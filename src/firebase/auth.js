import { setDoc, doc, Timestamp } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import logger from "utilities/logger";
import { geohashForLocation } from "geofire-common";
import { auth, db } from ".";
import {
  validateCandidateSignUp,
  validateRecruiterSignUp,
  validateSignInFields,
} from "./validation/validators";
import { validatePostalCode, lookupPostalCode } from "./api/postal-code";
import { notifyNewUser } from "./backend/notify";

/**
 * Sign up user with email and password, handle auth errors if there are any.
 * @param {string} email - The email address of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<AuthUser>} A promise that resolves when the sign-up process is complete.
 */
const signUp = async (email, password) => {
  try {
    const authUser = await createUserWithEmailAndPassword(auth, email, password);
    return authUser;
  } catch (error) {
    switch (error.code) {
      case "auth/email-already-in-use":
        throw new Error("Email is already in use.");
      case "auth/invalid-email":
        throw new Error("Invalid email address.");
      case "auth/weak-password":
        throw new Error(
          "Password is not strong enough. Add additional characters including special characters and numbers."
        );
      default:
        logger.error(error);
        throw new Error("Failed to sign up.");
    }
  }
};

/**
 * Sign in a user with their email and password.
 * @param {string} email - The email address of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<void>} A promise that resolves when the sign-in process is complete.
 */
export const signIn = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    switch (error.code) {
      case "auth/user-disabled":
        throw new Error("User account is suspended.");
      case "auth/invalid-credential":
        throw new Error("Invalid credentials.");
      default:
        logger.error(error);
        throw new Error("Failed to sign in.");
    }
  }
};

/**
 * Sign in a user with their email and password.
 * @param {Object} userData - The user data for signing in.
 * @param {string} userData.email - The email address of the user.
 * @param {string} userData.password - The password of the user.
 * @returns {Promise<void>} A promise that resolves when the sign-in process is complete.
 * @throws {Error} If the email or password is not provided.
 * @throws {Error} If the user is not found.
 * @throws {Error} If the password is incorrect.
 * @throws {Error} If the user is already signed in.
 */
export const signInAsUser = async (signInFields) => {
  if (auth.currentUser) {
    throw new Error("User is already signed in.");
  }

  validateSignInFields(signInFields);

  const { email, password } = signInFields;

  await signIn(email, password);
};

export const signOutAsUser = async () => {
  await signOut(auth);
};

/**
 * Sign up a user as a candidate.
 * @param {Object} userData - The user data for signing up as a candidate.
 * @param {string} userData.email - The email address of the candidate.
 * @param {string} userData.password - The password of the candidate.
 * @param {string} userData.firstName - The first name of the candidate.
 * @param {string} userData.lastName - The last name of the candidate.
 * @param {string} userData.phoneNumber - The phone number of the candidate.
 * @param {string} userData.postalCode - The postal code of the candidate.
 * @param {string} userData.dailyJobUpdatePreference - The period when the candidate prefers to be contacted.
 * @param {boolean} userData.agreedToBeContacted - A boolean indicating whether the candidate agreed to be contacted.
 * @param {Object} userData.experience - The details of candidate's experience.
 * @param {string} userData.experience.sector - "Hospitality" or "Construction".
 * Fields for Hospitality:
 * @param {string} userData.experience.mainTypeOfEstablishment - The main type of establishment of the candidate.
 * @param {string} userData.experience.secondTypeOfEstablishment - (Optional) The second type of establishment of the candidate.
 * @param {string} userData.experience.firstRolePreference - The first role preference of the candidate.
 * @param {string} userData.experience.secondRolePreference - (Optional) The second role preference of the candidate.
 * Fields for Construction:
 * @param {string} userData.experience.constructionRole - The construction role of the candidate.
 * @param {string} userData.experience.constructionCardType - The type of CSCS card of the candidate.
 * Fields for both sectors:
 * @param {string} userData.experience.yearsOfExperience - The years of experience of the candidate.
 * @returns {Promise<void>} A promise that resolves when the sign-up process is complete.
 * @throws {Error} If the email or password is not provided.
 * @throws {Error} If the email is already in use.
 * @throws {Error} If the user is already signed in.
 */
export const signUpAsCandidate = async (userData) => {
  if (auth.currentUser) {
    throw new Error("User is already signed in.");
  }

  validateCandidateSignUp(userData);
  const isValidPostalCode = await validatePostalCode(userData.postalCode);
  if (!isValidPostalCode) {
    throw new Error("Invalid UK postal code.");
  }

  const {
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    postalCode,
    experience,
    dailyJobUpdatePreference,
    agreedToBeContacted,
  } = userData;

  const { longitude, latitude } = await lookupPostalCode(postalCode);
  const hash = geohashForLocation([latitude, longitude]);

  const authUser = await signUp(email, password);
  const { uid } = authUser.user;

  const experienceFieldsBySector = {
    Construction: {
      construction_role: experience.constructionRole,
      construction_card_type: experience.constructionCardType,
    },
    Hospitality: {
      main_type_of_establishment: experience.mainTypeOfEstablishment,
      ...(experience.secondTypeOfEstablishment && {
        second_type_of_establishment: experience.secondTypeOfEstablishment,
      }),
      first_role_preference: experience.firstRolePreference,
      ...(experience.secondRolePreference && {
        second_role_preference: experience.secondRolePreference,
      }),
    },
  };

  // Create a candidate profile
  const candidate = {
    email,
    first_name: firstName,
    last_name: lastName,
    phone_number: phoneNumber,
    postal_code: postalCode.toUpperCase(),
    postal_code_longitude: longitude,
    postal_code_latitude: latitude,
    geohash: hash,
    daily_job_update_preference: dailyJobUpdatePreference,
    agreed_to_be_contacted: agreedToBeContacted,
    role: "candidate",
    experience: {
      sector: experience.sector,
      years_of_experience: experience.yearsOfExperience,
      ...(experienceFieldsBySector[experience.sector] || {}),
    },
    verified: false,
    created_at: Timestamp.now(),
  };

  await setDoc(doc(db, "users", uid), candidate);

  // Notify Slack channels about the new user
  await notifyNewUser();
};

/**
 * Sign up a user as a recruiter.
 * @param {Object} userData - The user data for signing up as a recruiter.
 * @param {string} userData.email - The email address of the recruiter.
 * @param {string} userData.password - The password of the recruiter.
 * @param {string} userData.companyName - The name of the company of the recruiter.
 * @param {string} userData.firstName - The first name of the recruiter.
 * @param {string} userData.lastName - The last name of the recruiter.
 * @param {string} userData.phoneNumber - The phone number of the recruiter.
 * @param {string} userData.postalCode - The postal code of the recruiter.
 * @returns {Promise<void>} A promise that resolves when the sign-up process is complete.
 * @throws {Error} If the email or password is not provided.
 * @throws {Error} If the email is already in use.
 * @throws {Error} If the user is already signed in.
 */
export const signUpAsRecruiter = async (userData) => {
  if (auth.currentUser) {
    throw new Error("User is already signed in.");
  }

  validateRecruiterSignUp(userData);
  const isValidPostalCode = await validatePostalCode(userData.postalCode);
  if (!isValidPostalCode) {
    throw new Error("Invalid UK postal code.");
  }

  const { email, password, companyName, firstName, lastName, phoneNumber, postalCode } = userData;
  const { longitude, latitude } = await lookupPostalCode(postalCode);

  const authUser = await signUp(email, password);

  const { uid } = authUser.user;

  const hash = geohashForLocation([latitude, longitude]);

  // Create a recruiter profile
  const recruiter = {
    email,
    first_name: firstName,
    last_name: lastName,
    company_name: companyName,
    phone_number: phoneNumber,
    postal_code: postalCode.toUpperCase(),
    postal_code_longitude: longitude,
    postal_code_latitude: latitude,
    geohash: hash,
    pricing_plan: "free",
    trial_used: false,
    credits: 0,
    role: "recruiter",
    created_at: Timestamp.now(),
  };

  const userRef = doc(db, "users", uid);

  await setDoc(userRef, recruiter);

  // Notify Slack channels about the new user
  await notifyNewUser();
};

/**
 * Send password reset email to user.
 * @param {string} email - The email address of the user.
 * @returns {Promise<void>} A promise that resolves when the password reset email is sent.
 */
export const requestPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    logger.error(error);
    throw new Error("Failed to send password reset email.");
  }
};
