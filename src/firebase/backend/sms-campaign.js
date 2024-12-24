import { fetchPost } from "utilities/CRUD";
import { auth } from "..";

/**
 * Create SMS campaign by filters.
 * @param {Object} data
 * @param {Object} data.filters - Filters to apply to the campaign.
 * @param {string} data.filters.role - Role to filter by.
 * @param {string} data.filters.area_of_expertise - Experience to filter by.
 * @param {string} data.filters.years_of_experience - Years of experience to filter by.
 * @param {string} data.filters.postcode - [Optional] Postcode to filter by.
 * @param {string} data.filters.distance - [Optional] Distance to filter by.
 * @param {string} data.message - Message to send to the filtered users.
 * @param {number} data.amount_of_candidates - Amount of candidates to send the message to.
 * @returns {Promise} - Promise that resolves with the created campaign.
 */

export const createSMSCampaign = async (data) => {
  const authToken = await auth.currentUser?.getIdToken();
  return fetchPost({
    endpoint: `/api/v1/firestore/sms-campaign/filters`,
    headers: {
      Authorization: authToken,
    },
    data,
  });
};

/**
 * Create SMS campaign by job filters.
 * @param {Object} data
 * @param {string} data.job_id - Job ID to filter by.
 * @param {string} data.message - Message to send to the filtered users.
 * @param {number} data.amount_of_candidates - Amount of candidates to send the message to.
 * @returns {Promise} - Promise that resolves with the created campaign.
 */
export const createSMSCampaignByJob = async (data) => {
  const authToken = await auth.currentUser?.getIdToken();

  return fetchPost({
    endpoint: `/api/v1/firestore/sms-campaign/job`,
    headers: {
      Authorization: authToken,
    },
    data,
  });
};

/**
 * Create SMS campaign by users applied to a job.
 * @param {Object} data
 * @param {string} data.job_id - Job ID to filter by.
 * @param {string} data.message - Message to send to the filtered users.
 * @param {number} data.amount_of_candidates - Amount of candidates to send the message to.
 */
export const createSMSCampaignByJobApplicants = async (data) => {
  const authToken = await auth.currentUser?.getIdToken();

  return fetchPost({
    endpoint: `/api/v1/firestore/sms-campaign/applied-job`,
    headers: {
      Authorization: authToken,
    },
    data,
  });
};

/**
 * Re-run a SMS campaign.
 * @param {string} campaignId - ID of the campaign to re-run.
 * @returns {Promise} - Promise that resolves with the re-run campaign.
 */

export const reRunSMSCampaign = async (campaignId) => {
  const authToken = await auth.currentUser?.getIdToken();

  return fetchPost({
    endpoint: `/api/v1/firestore/sms-campaign/${campaignId}`,
    headers: {
      Authorization: authToken,
    },
  });
};
