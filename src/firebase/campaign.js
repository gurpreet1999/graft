import {
  collection,
  where,
  and,
  query,
  getDocs,
  orderBy,
  limit,
  startAfter,
  endBefore,
  limitToLast,
  getCountFromServer,
  getDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "./index";

/**
 * Get paginated campaigns for the recruiter.
 * @param {string} direction - The direction of the page.
 * @param {Object} lastDoc - The last document in the previous page.
 * @param {Object} firstDoc - The first document in the previous page.
 * @param {number} limitPerPage - The number of campaigns per page.
 * @returns {Promise<Object>} - Promise that resolves when the campaigns are fetched.
 */
export const getCampaignsHistoryForRecruiter = async ({
  direction,
  filters,
  lastDoc,
  firstDoc,
  limitPerPage,
}) => {
  const recruiterId = filters?.recruiterId || auth.currentUser.uid;
  const sector = filters?.sector;
  const campaignsCollection = collection(db, "sms_campaigns");

  let filterClauses = where("recruiter_id", "==", recruiterId);

  if (sector) {
    filterClauses = and(filterClauses, where("filters.sector", "==", sector));
  }

  const orderByClause = orderBy("credits_spent", "asc");

  let campaignsQuery = query(
    campaignsCollection,
    orderByClause,
    filterClauses,
    limit(limitPerPage)
  );

  if (direction === "next" && lastDoc) {
    campaignsQuery = query(campaignsQuery, startAfter(lastDoc));
  } else if (direction === "prev" && firstDoc) {
    campaignsQuery = query(
      campaignsCollection,
      filterClauses,
      orderByClause,
      endBefore(firstDoc),
      limitToLast(limitPerPage)
    );
  }

  const snapshot = await getDocs(campaignsQuery);
  const campaignsData = snapshot.docs.map((campaign) => ({ id: campaign.id, ...campaign.data() }));

  return {
    campaignsData,
    firstDocument: campaignsData[0],
    lastDocument: campaignsData[campaignsData.length - 1],
  };
};

/**
 * Get the count of the campaigns for the recruiter.
 * @returns {Promise<number>} - Promise that resolves with the count of the campaigns.
 */
export const getCampaignsCount = async (filters) => {
  const campaignsCollection = collection(db, "sms_campaigns");

  const recruiterId = filters.recruiterId || auth.currentUser.uid;
  const { sector } = filters;

  let filterClauses = where("recruiter_id", "==", recruiterId);

  if (sector) {
    filterClauses = and(filterClauses, where("filters.sector", "==", sector));
  }
  const count = await getCountFromServer(query(campaignsCollection, filterClauses));

  return count.data().count;
};

/**
 * Get the count of the campaigns for the admin.
 * @returns {Promise<number>} - Promise that resolves with the count of the campaigns.
 */
export const getCampaignsCountForAdmin = async (filters) => {
  const campaignsCollection = collection(db, "sms_campaigns");

  if (filters) {
    const { sector } = filters;

    const filterClauses = where("filters.sector", "==", sector);

    const count = await getCountFromServer(query(campaignsCollection, filterClauses));
    return count.data().count;
  }

  const count = await getCountFromServer(query(campaignsCollection));
  return count.data().count;
};

/**
 * Get the details of the campaign.
 * @param {string} campaignId - The id of the campaign.
 * @returns {Promise<Object>} - Promise that resolves with the details of the campaign.
 */
export const getCampaignDetails = async (campaignId) => {
  const campaignRef = doc(db, "sms_campaigns", campaignId);
  const campaignDoc = await getDoc(campaignRef);
  return campaignDoc.data();
};
