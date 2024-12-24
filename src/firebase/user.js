import {
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import {
  doc,
  updateDoc,
  deleteField,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  limit,
  getCountFromServer,
  endBefore,
  limitToLast,
  startAfter,
  getDoc,
  runTransaction,
} from "firebase/firestore";

import { personalDocumentTypes, sectorExperienceDocumentTypes } from "constants/candidate";
import { toSnakeCase, applyFilters } from "utilities/helpers";
import { auth, db } from ".";
import { validatePostalCode, lookupPostalCode } from "./api/postal-code";
import {
  validateAdminUser,
  validateCandidateUser,
  validateRecruiterUser,
} from "./validation/validators";
import { deleteFile, uploadFile, getDownloadFileURL } from "./storage";

/**
 * Updates the current user data.
 * @param {Object<CandidateUser | RecruiterUser | AdminUser>} newUserData - The new user data.
 * @param {Object<CandidateUser | RecruiterUser | AdminUser>} currentUserData - The current user data.
 * @returns {Promise<CandidateUser | RecruiterUser | AdminUser>} A promise that resolves with the updated user data.
 */
export const updateMe = async (newUserData, currentUserData) => {
  const authUser = auth.currentUser;

  if (!authUser || !currentUserData) {
    throw new Error("User is not signed in.");
  }

  const { email: currentUserEmail, role, postal_code: currentUserPostalCode } = currentUserData;
  const { email: newEmail } = newUserData;
  const { uid } = authUser;

  const userDocRef = doc(db, "users", uid);
  let newUserFields = null;

  if (role === "candidate") {
    const {
      experience: { sector },
    } = currentUserData;
    validateCandidateUser(newUserData);

    const {
      email,
      firstName,
      lastName,
      phoneNumber,
      postalCode,
      experience,
      dailyJobUpdatePreference,
      agreedToBeContacted,
    } = newUserData;

    let postalCodeLongitude = currentUserData.postal_code_longitude;
    let postalCodeLatitude = currentUserData.postal_code_latitude;

    if (postalCode !== currentUserPostalCode) {
      const isValidPostalCode = await validatePostalCode(postalCode);
      if (!isValidPostalCode) {
        throw new Error("Invalid UK postal code.");
      }

      const { longitude, latitude } = await lookupPostalCode(postalCode);

      postalCodeLongitude = longitude;
      postalCodeLatitude = latitude;
    }

    // Candidate fields
    newUserFields = {
      email,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      postal_code: postalCode.toUpperCase(),
      postal_code_longitude: postalCodeLongitude,
      postal_code_latitude: postalCodeLatitude,
      daily_job_update_preference: dailyJobUpdatePreference,
      agreed_to_be_contacted: agreedToBeContacted,
      experience: {
        years_of_experience: experience.yearsOfExperience,
        ...(sector === "Hospitality" && {
          main_type_of_establishment: experience.mainTypeOfEstablishment,
          second_type_of_establishment: experience.secondTypeOfEstablishment ?? deleteField(),
          first_role_preference: experience.firstRolePreference,
          second_role_preference: experience.secondRolePreference ?? deleteField(),
        }),
        ...(sector === "Construction" && {
          construction_role: experience.constructionRole,
          construction_card_type: experience.constructionCardType,
        }),
        sector,
      },
    };
  } else if (role === "recruiter") {
    validateRecruiterUser(newUserData);

    const { email, companyName, firstName, lastName, phoneNumber, postalCode } = newUserData;

    let postalCodeLongitude = currentUserData.postal_code_longitude;
    let postalCodeLatitude = currentUserData.postal_code_latitude;

    if (postalCode !== currentUserPostalCode) {
      const isValidPostalCode = await validatePostalCode(postalCode);
      if (!isValidPostalCode) {
        throw new Error("Invalid UK postal code.");
      }

      const { longitude, latitude } = await lookupPostalCode(postalCode);

      postalCodeLongitude = longitude;
      postalCodeLatitude = latitude;
    }

    newUserFields = {
      email,
      company_name: companyName,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      postal_code: postalCode.toUpperCase(),
      postal_code_longitude: postalCodeLongitude,
      postal_code_latitude: postalCodeLatitude,
    };
  } else if (role === "admin") {
    validateAdminUser(newUserData);
    const { email, firstName, lastName } = newUserData;

    newUserFields = {
      email,
      first_name: firstName,
      last_name: lastName,
    };
  }

  if (!newUserFields) {
    throw new Error("Unknown user role.");
  }

  const updatePromises = [];

  updatePromises.push(updateDoc(userDocRef, newUserFields));
  if (newEmail !== currentUserEmail) {
    updatePromises.push(updateEmail(authUser, newEmail));
  }

  const [updatedUser] = await Promise.all(updatePromises);

  return updatedUser;
};

/**
 * Updates the current user password.
 * @param {string} currentPassword - The current user password.
 * @param {string} newPassword - The new user password.
 * @returns {Promise<boolean>} A promise that resolves when the password is updated.
 */
export const updateMePassword = async (currentPassword, newPassword) => {
  const authUser = auth.currentUser;

  if (!authUser) {
    throw new Error("User is not signed in.");
  }

  if (!currentPassword || !newPassword) {
    throw new Error("Current password and new password are required.");
  }

  const credential = EmailAuthProvider.credential(authUser.email, currentPassword);

  await reauthenticateWithCredential(authUser, credential);

  await updatePassword(authUser, newPassword);

  return true;
};

/**
 * Get paginated users by role (requested by admin).
 * @param {string} role - The role of the users.
 * @param {number} limitPerPage - The number of users per page.
 * @param {string} direction - The direction of the page.
 * @param {DocumentSnapshot} firstDoc - The first document of the page.
 * @param {DocumentSnapshot} lastDoc - The last document of the page.
 * @returns {Promise<Array<CandidateUser | RecruiterUser | AdminUser>>} A promise that resolves with the users.
 */
export const getUsersByRole = async ({
  direction,
  role,
  firstDoc,
  lastDoc,
  filters,
  filtersData,
}) => {
  const { limitPerPage, searchValue, sector } = filters;
  const usersCollection = collection(db, "users");

  const filterClauses = [where("role", "==", role)];

  if (sector) {
    filterClauses.push(where("experience.sector", "==", sector));
  }

  if (searchValue) {
    filterClauses.push(where("email", "==", searchValue));
  }

  Object.entries(filtersData).forEach(([field, value]) => {
    applyFilters(filterClauses, field, value);
  });

  let finalQuery = query(
    usersCollection,
    ...filterClauses,
    orderBy("first_name", "asc"),
    limit(limitPerPage)
  );

  if (direction === "next" && lastDoc) {
    finalQuery = query(finalQuery, startAfter(lastDoc));
  } else if (direction === "prev" && firstDoc) {
    finalQuery = query(finalQuery, endBefore(firstDoc), limitToLast(filters.limitPerPage));
  }

  const snapshot = await getDocs(finalQuery);

  const usersData = snapshot.docs.map((userDoc) => ({
    ...userDoc.data(),
    id: userDoc.id,
  }));

  return {
    usersData,
    firstDocument: snapshot.docs[0],
    lastDocument: snapshot.docs[snapshot.docs.length - 1],
  };
};

/**
 * Get users pages count (requested by admin).
 * @param {string} role - The role of the users.
 * @param {number} limitPerPage - The number of users per page.
 * @returns {Promise<number>} A promise that resolves with the total number of users.
 */
export const getUsersCount = async ({ role, filters, filtersData }) => {
  const usersCollection = collection(db, "users");

  const filterClauses = [where("role", "==", role)];

  if (filters?.sector) {
    filterClauses.push(where("experience.sector", "==", filters.sector));
  }

  if (filters?.searchValue) {
    filterClauses.push(where("email", "==", filters.searchValue));
  }

  if (filtersData) {
    Object.entries(filtersData).forEach(([field, value]) => {
      applyFilters(filterClauses, field, value);
    });
  }

  const finalQuery = query(usersCollection, ...filterClauses);
  const count = await getCountFromServer(finalQuery);

  return count.data().count;
};

/**
 * Get user by ID (requested by admin).
 * @param {string} userId - The ID of the user.
 * @returns {Promise<CandidateUser | RecruiterUser | AdminUser>} A promise that resolves with the user.
 */
export const getUserById = async (userId) => {
  const userDocRef = doc(db, "users", userId);
  const userDoc = await getDoc(userDocRef);

  return {
    ...userDoc.data(),
    id: userDoc.id,
  };
};

/**
 * Download document for the candidate's verification
 * @param {string} path - The path of the document.
 * @returns {Promise<void>} A promise that resolves with the triggered download.
 */
export const downloadDocument = async (path) => {
  const downloadURL = await getDownloadFileURL(path);
  const link = document.createElement("a");
  link.target = "_blank";
  link.download = path;
  link.href = downloadURL;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Delete the document for the candidate's verification.
 * @param {Candidate} currentUser - The current user data.
 * @param {string} kind - The kind of the document ('personal' | 'sector').
 * @returns {Promise<void>} A promise that resolves when the document is deleted.
 */
export const deleteDocument = async ({ currentUser, kind }) => {
  if (!["personal", "sector"].includes(kind)) {
    throw new Error("Invalid document kind.");
  }

  const propertyName = kind === "personal" ? "personal_document" : "sector_experience_document";
  const documentData = currentUser[propertyName];

  if (documentData) {
    await runTransaction(db, async (transaction) => {
      transaction.update(doc(db, "users", auth.currentUser.uid), {
        [propertyName]: deleteField(),
        verified: false,
      });

      await deleteFile(documentData.path);
    });
  }
};

/**
 * Upload document for the candidate's verification.
 * @param {File} file - The file to upload.
 * @param {string} kind - The kind of the document ('personal' | 'sector').
 * @param {string} documentType - The type of the document.
 * @param {Function} setProgress - The function to set the progress of the upload.
 * @returns {Promise<void>} A promise that resolves when the document is uploaded.
 */
export const uploadDocument = async ({ file, kind, documentType, setProgress }) => {
  if (!["personal", "sector"].includes(kind)) {
    throw new Error("Invalid document kind.");
  }

  if (kind === "personal" && !personalDocumentTypes.includes(documentType)) {
    throw new Error("Invalid type of document.");
  }

  if (kind === "sector" && !sectorExperienceDocumentTypes.includes(documentType)) {
    throw new Error("Invalid type of document.");
  }

  const propertyName = kind === "personal" ? "personal_document" : "sector_experience_document";

  await runTransaction(db, async (transaction) => {
    const extension = file.name.split(".").pop();

    const path = await uploadFile({
      file,
      path: `documents/${auth.currentUser.uid}/${toSnakeCase(documentType)}.${extension}`,
      setProgress,
    });

    transaction.update(doc(db, "users", auth.currentUser.uid), {
      [propertyName]: {
        path,
        type: documentType,
        status: "pending",
      },
      verified: false,
    });
  });
};

/**
 * Approve/reject document for the candidate's verification (as admin).
 * @param {string} userId - The ID of the user.
 * @param {string} documentType - The type of the document ('personal' | 'sector').
 * @param {string} status - The status of the document. ('approved' | 'pending' | 'rejected')
 * @returns {Promise<void>} A promise that resolves when the document is approved.
 */
export const changeDocumentStatus = async (userId, documentType, status) => {
  if (!["personal", "sector"].includes(documentType)) {
    throw new Error("Invalid document type.");
  }

  if (!["approved", "rejected"].includes(status)) {
    throw new Error("Invalid document status.");
  }

  await runTransaction(db, async (transaction) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await transaction.get(userRef);

    const {
      personal_document: personalDocument,
      sector_experience_document: sectorExperienceDocument,
    } = userDoc.data();

    const secondDocument =
      documentType === "personal" ? sectorExperienceDocument : personalDocument;
    const verified = status === "approved" && secondDocument?.status === "approved";
    const propertyUpdate =
      documentType === "personal"
        ? "personal_document.status"
        : "sector_experience_document.status";

    transaction.update(doc(db, "users", userId), {
      [propertyUpdate]: status,
      verified,
    });
  });
};
