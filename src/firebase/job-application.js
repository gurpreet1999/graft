/* eslint-disable no-await-in-loop */
import {
  addDoc,
  doc,
  deleteDoc,
  collection,
  endBefore,
  getDocs,
  limitToLast,
  limit,
  query,
  startAfter,
  where,
  getCountFromServer,
} from "firebase/firestore";
import { auth, db } from "./index";
import logger from "../utilities/logger";

import { getJobById } from "./job";
import { getUserById } from "./user";

export const applyToJob = async ({ jobId, currentUser }) => {
  try {
    const job = await getJobById(jobId);
    if (!job.id) {
      throw new Error("Error applying for the job.");
    }

    const user = await getUserById(currentUser.id);
    if (!user.id) {
      throw new Error("Error applying for the job.");
    }
    const jobApplication = {
      job_id: jobId,
      candidate_data: {
        ...currentUser,
        id: auth.currentUser.uid,
      },
    };

    const jobApplicationCollection = collection(db, "job_applications");
    const result = await addDoc(jobApplicationCollection, jobApplication);
    return {
      ...jobApplication,
      id: result.id,
    };
  } catch (error) {
    logger.error(error, "Error in applying for the job.");
    throw error;
  }
};

// checks is user applied for this job
export const isAppliedToJob = async (jobId, userId) => {
  try {
    const jobApplicationCollection = collection(db, "job_applications");

    const jobApplicationQuery = query(
      jobApplicationCollection,
      where("candidate_data.id", "==", userId),
      where("job_id", "==", jobId)
    );
    const snapshot = await getDocs(jobApplicationQuery);
    return snapshot.docs[0]?.data()
      ? { ...snapshot.docs[0]?.data(), id: snapshot.docs[0].id }
      : false;
  } catch (error) {
    logger.error(error, "Error in check is applying for the job.");
    throw error;
  }
};

export const getAppliedCandidates = async ({
  jobId,
  direction,
  firstDoc,
  lastDoc,
  limitPerPage,
}) => {
  try {
    const jobApplicationCollection = collection(db, "job_applications");

    const filterClause = where("job_id", "==", jobId);

    let jobApplicationQuery = query(jobApplicationCollection, filterClause, limit(limitPerPage));

    if (direction === "next" && lastDoc) {
      jobApplicationQuery = query(jobApplicationQuery, startAfter(lastDoc));
    } else if (direction === "prev" && firstDoc) {
      jobApplicationQuery = query(
        jobApplicationCollection,
        filterClause,
        endBefore(firstDoc),
        limitToLast(limitPerPage)
      );
    }

    const snapshot = await getDocs(jobApplicationQuery);

    const candidatesData = snapshot.docs.map((jobApplication) => ({
      ...jobApplication.data().candidate_data,
    }));

    return {
      candidatesData,
      firstDocument: snapshot.docs[0],
      lastDocument: snapshot.docs[snapshot.docs.length - 1],
    };
  } catch (error) {
    logger.error(error, "Error in getting applied candidates.");
    throw error;
  }
};

/**
 *  Gets jobs that candidate is applied
 * @param {string} direction
 * @param {string} userId
 * @param {QueryDocumentSnapshot} firstDoc
 * @param {QueryDocumentSnapshot} lastDoc
 * @param {number} limitPerPage
 * @returns {Promise<Object>} Promise that resolves when the jobs are fetched.
 */
export const getAppliedJobs = async ({ direction, userId, firstDoc, lastDoc, limitPerPage }) => {
  if (!auth.currentUser) {
    throw new Error("User is not authenticated.");
  }
  const jobApplicationCollection = collection(db, "job_applications");

  const andClause = where("candidate_data.id", "==", userId);

  let jobApplicationQuery = query(jobApplicationCollection, andClause, limit(limitPerPage));

  if (direction === "next" && lastDoc) {
    jobApplicationQuery = query(jobApplicationQuery, startAfter(lastDoc));
  } else if (direction === "prev" && firstDoc) {
    jobApplicationQuery = query(
      jobApplicationCollection,
      andClause,
      endBefore(firstDoc),
      limitToLast(limitPerPage)
    );
  }

  const snapshot = await getDocs(jobApplicationQuery);

  const jobsId = snapshot.docs.map((jobApplication) => jobApplication.data().job_id);

  const jobsData = await Promise.all(jobsId.map((id) => getJobById(id)));

  return {
    jobsData,
    firstDocumet: snapshot.docs[0],
    lastDocument: snapshot.docs[snapshot.docs.length - 1],
  };
};

export const unApplyJob = async ({ jobApplication }) => {
  try {
    if (!auth.currentUser) {
      throw new Error("User is not authenticated.");
    }

    if (!jobApplication.id) {
      throw new Error("Job ID is required.");
    }
    const jobApplicationDoc = doc(db, "job_applications", jobApplication.id);
    await deleteDoc(jobApplicationDoc);
  } catch (error) {
    logger.error(error, "Error in unapply job.");
    throw error;
  }
};

export const getAppliedJobsCount = async ({ userId }) => {
  const jobApplicationCollection = collection(db, "job_applications");
  const count = await getCountFromServer(
    query(jobApplicationCollection, where("candidate_data.id", "==", userId))
  );

  return count.data().count;
};

export const getCandidatesCount = async ({ jobId }) => {
  const jobApplicationCollection = collection(db, "job_applications");
  const count = await getCountFromServer(
    query(jobApplicationCollection, where("job_id", "==", jobId))
  );

  return count.data().count;
};
