import {
  doc,
  getDoc,
  addDoc,
  collection,
  updateDoc,
  deleteDoc,
  and,
  or,
  where,
  query,
  getDocs,
  orderBy,
  limit,
  startAfter,
  endBefore,
  limitToLast,
  getCountFromServer,
} from "firebase/firestore";
import { db, auth } from "./index";
import logger from "../utilities/logger";
import { validateJobFields } from "./validation/validators";

import { validatePostalCode } from "./api/postal-code";

export const getHospitalityAndClause = (currentUser) =>
  and(
    where("sector", "==", "Hospitality"),
    or(
      where("area_of_expertise", "==", currentUser.experience.main_type_of_establishment),
      where("area_of_expertise", "==", currentUser.experience.second_type_of_establishment),
      where("area_of_expertise", "==", "any")
    ),
    or(
      where("years_of_experience", "==", currentUser.experience.years_of_experience),
      where("years_of_experience", "==", "any")
    ),
    or(
      where("role", "==", currentUser.experience.first_role_preference),
      where("role", "==", currentUser.experience.second_role_preference)
    )
  );

export const getConstructionAndClause = (currentUser) =>
  and(
    where("sector", "==", "Construction"),
    or(
      where("area_of_expertise", "==", currentUser.experience.construction_card_type),
      where("area_of_expertise", "==", "any")
    ),
    or(
      where("years_of_experience", "==", currentUser.experience.years_of_experience),
      where("years_of_experience", "==", "any")
    ),
    or(where("role", "==", currentUser.experience.construction_role))
  );

export const getAndClause = (currentUser) => {
  let andClause =
    currentUser.experience.sector === "Hospitality"
      ? getHospitalityAndClause(currentUser)
      : getConstructionAndClause(currentUser);

  if (!currentUser.verified) {
    // If candidate is verified, they can see all jobs.
    // If not, they can only see unverified jobs.
    andClause = and(andClause, where("verification", "==", false));
  }

  return andClause;
};

export const getAllJobsForCandidate = async ({
  direction,
  currentUser,
  firstDoc,
  lastDoc,
  limitPerPage,
}) => {
  try {
    if (!auth.currentUser) {
      throw new Error("User is not authenticated.");
    }

    const jobsCollection = collection(db, "jobs");
    const andClause = getAndClause(currentUser);

    let jobsQuery = query(jobsCollection, andClause, limit(limitPerPage));

    if (direction === "next" && lastDoc) {
      jobsQuery = query(jobsQuery, startAfter(lastDoc));
    } else if (direction === "prev" && firstDoc) {
      jobsQuery = query(jobsCollection, andClause, endBefore(firstDoc), limitToLast(limitPerPage));
    }
    const snapshot = await getDocs(jobsQuery);

    const jobsData = snapshot.docs.map((job) => ({
      ...job.data(),
      id: job.id,
    }));

    return {
      jobsData,
      firstDocumet: snapshot.docs[0],
      lastDocument: snapshot.docs[snapshot.docs.length - 1],
    };
  } catch (error) {
    logger.error(error, "Error getting jobs for candidate.");
    throw error;
  }
};

export const getAllJobsForCandidateCount = async ({ currentUser }) => {
  const jobsCollection = collection(db, "jobs");
  const andClause = getAndClause(currentUser);

  const count = await getCountFromServer(query(jobsCollection, andClause));
  return count.data().count;
};

export const getJobById = async (jobId) => {
  try {
    if (!auth.currentUser) {
      throw new Error("User is not authenticated.");
    }

    if (!jobId) {
      throw new Error("Job ID is required.");
    }

    const jobRef = doc(db, "jobs", jobId);
    const jobDoc = await getDoc(jobRef);
    if (!jobDoc.exists()) {
      return false;
    }

    return {
      ...jobDoc.data(),
      id: jobDoc.id,
    };
  } catch (error) {
    logger.error(error, "Error in checking if job exists.");
    throw error;
  }
};

/**
 * Parameters for the jobData object.
 * @param {Object} jobData - Object containing job details.
 * @param {string} jobData.sector - Job sector.
 * @param {string} jobData.area_of_expertise - Area of expertise required for the job.
 * @param {Object} jobData.job_description - Description of the job.
 * @param {string} jobData.job_description.company_name - Name of the company.
 * @param {string} jobData.job_description.location - Location of the job.
 * @param {number} jobData.job_description.rate_of_pay - Rate of pay for the job.
 * @param {string} jobData.job_description.employment_type - Type of employment.
 * @param {string} jobData.job_description.contact_name - Name of the contact person.
 * @param {string} jobData.job_description.contact_email - Email of the contact person.
 * @param {string} jobData.job_description.contact_phone - Phone number of the contact person.
 * @param {string} jobData.postcode - Postal code for the job location.
 * @param {number} jobData.distance - Distance from the job location.
 * @param {string} jobData.role - Role required for the job.
 * @param {string} jobData.status - Current status of the job posting.
 * @param {boolean} jobData.verification - Verification status of the job posting.
 * @param {string} jobData.years_of_experience - Years of experience required for the job.
 * @returns {Promise<Object>} - Promise that resolves when the job is posted.
 */

export const postJobAsRecruiter = async ({ jobData }) => {
  try {
    if (!auth.currentUser) {
      throw new Error("User is not authenticated.");
    }

    const recruiterJob = {
      ...jobData,
      recruiter_id: auth.currentUser.uid,
      ...(jobData.postcode ? { postcode: jobData.postcode.toUpperCase() } : {}),
    };

    validateJobFields(recruiterJob);

    if (recruiterJob.postcode) {
      const isValidPostalCode = await validatePostalCode(recruiterJob.postcode);
      if (!isValidPostalCode) {
        throw new Error("Invalid UK postal code.");
      }
    }

    const job = await addDoc(collection(db, "jobs"), recruiterJob);
    return {
      ...recruiterJob,
      id: job.id,
    };
  } catch (error) {
    logger.error(error, "Error in posting the job.");
    throw error;
  }
};

/**
 * Parameters for the jobData object.
 * @param {string} jobId - Job ID that should be updated.
 * @param {Object} jobData - Object containing job details.
 * @param {string} jobData.area_of_expertise - Area of expertise required for the job.
 * @param {Object} jobData.job_description - Description of the job.
 * @param {string} jobData.job_description.company_name - Name of the company.
 * @param {string} jobData.job_description.location - Location of the job.
 * @param {number} jobData.job_description.rate_of_pay - Rate of pay for the job.
 * @param {string} jobData.job_description.employment_type - Type of employment.
 * @param {string} jobData.job_description.contact_name - Name of the contact person.
 * @param {string} jobData.job_description.contact_email - Email of the contact person.
 * @param {string} jobData.job_description.contact_phone - Phone number of the contact person.
 * @param {string} jobData.postcode - Postal code for the job location.
 * @param {string} jobData.role - Role required for the job.
 * @param {string} jobData.status - Current status of the job posting.
 * @param {number} jobData.distance - Distance from the job location.
 * @param {boolean} jobData.verification - Verification status of the job posting.
 * @param {string} jobData.years_of_experience - Years of experience required for the job.
 * @returns {Promise<void>} - Promise that resolves when the job is updated.
 */
export const updateJobAsRecruiter = async ({ jobId, jobData }) => {
  try {
    if (!auth.currentUser) {
      throw new Error("User is not authenticated.");
    }

    if (!jobId) {
      throw new Error("Job ID is required.");
    }

    const recruiterJob = {
      ...jobData,
      recruiter_id: auth.currentUser.uid,
      ...(jobData.postcode ? { postcode: jobData.postcode.toUpperCase() } : {}),
    };

    validateJobFields(recruiterJob);

    if (recruiterJob.postcode) {
      const isValidPostalCode = await validatePostalCode(recruiterJob.postcode);
      if (!isValidPostalCode) {
        throw new Error("Invalid UK postal code.");
      }
    }

    const jobDoc = doc(db, "jobs", jobData.id);

    await updateDoc(jobDoc, recruiterJob);
  } catch (error) {
    logger.error(error, "Error in updating the job.");
    throw error;
  }
};

/**
 * Delete a job as a recruiter.
 * @param {string} jobId - Job ID that should be deleted.
 * @returns {Promise<void>} - Promise that resolves when the job is deleted.
 */
export const deleteJobAsRecruiter = async (jobId) => {
  try {
    if (!auth.currentUser) {
      throw new Error("User is not authenticated.");
    }

    if (!jobId) {
      throw new Error("Job ID is required.");
    }

    const jobDoc = doc(db, "jobs", jobId);

    await deleteDoc(jobDoc);
  } catch (error) {
    logger.error(error, "Error in deleting the job.");
    throw error;
  }
};

/**
 * Get paginated jobs for the recruiter.
 * @param {string} direction - The direction of the page.
 * @param {Object} lastDoc - The last document in the previous page.
 * @param {Object} firstDoc - The first document in the previous page.
 * @param {number} limitPerPage - The number of jobs per page.
 * @returns {Promise<Object>} - Promise that resolves when the jobs are fetched.
 */
export const getListedJobsForRecruiter = async ({
  direction,
  filters,
  lastDoc,
  firstDoc,
  limitPerPage,
}) => {
  const recruiterId = filters?.recruiterId || auth.currentUser.uid;
  const sector = filters?.sector;

  const jobsCollection = collection(db, "jobs");

  let filterClause = where("recruiter_id", "==", recruiterId);

  if (sector) {
    filterClause = and(filterClause, where("sector", "==", sector));
  }

  const orderByClause = orderBy("role", "desc");

  let jobsQuery = query(jobsCollection, filterClause, orderByClause, limit(limitPerPage));

  if (direction === "next" && lastDoc) {
    jobsQuery = query(jobsQuery, startAfter(lastDoc));
  } else if (direction === "prev" && firstDoc) {
    jobsQuery = query(
      jobsCollection,
      filterClause,
      orderByClause,
      endBefore(firstDoc),
      limitToLast(limitPerPage)
    );
  }

  const snapshot = await getDocs(jobsQuery);
  const jobsData = snapshot.docs.map((job) => ({
    ...job.data(),
    id: job.id,
  }));
  return {
    jobsData,
    firstDocument: snapshot.docs[0],
    lastDocument: snapshot.docs[snapshot.docs.length - 1],
  };
};

/**
 * Get the count of the jobs for the recruiter.
 * @returns {Promise<number>} - Promise that resolves with the count of the jobs.
 */
export const getRecruiterJobsCount = async (filters) => {
  const jobsCollection = collection(db, "jobs");

  const sector = filters?.sector;

  const recruiterId = filters?.recruiterId || auth.currentUser.uid;

  let filterClauses = where("recruiter_id", "==", recruiterId);

  if (sector) {
    filterClauses = and(filterClauses, where("sector", "==", sector));
  }

  const count = await getCountFromServer(query(jobsCollection, filterClauses));

  return count.data().count;
};
