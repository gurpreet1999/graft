import { fetchPost, fetchGet, fetchPut } from "utilities/CRUD";
import { auth } from "..";

/**
 * Create a checkout session for credits purchase.
 * @param {number} quantity - amount of credits to purchase
 * @returns {Object} Object with `checkoutURL` to redirect to.
 */
export const createCreditsCheckoutSession = async (quantity) => {
  const authToken = await auth.currentUser?.getIdToken();

  return fetchPost({
    endpoint: `/api/v1/billing/credits`,
    headers: {
      Authorization: authToken,
    },
    data: { credits: quantity },
  });
};

/**
 * Create a checkout session for subscription purchase.
 * @param {string} pricingPlan - specific pricing plan name (small_crew | medium_crew)
 * @returns {Object} Object with `checkoutURL` to redirect to.
 */
export const createSubscriptionCheckoutSession = async (pricingPlan) => {
  const authToken = await auth.currentUser?.getIdToken();
  return fetchPost({
    endpoint: `/api/v1/billing/subscription`,
    headers: {
      Authorization: authToken,
    },
    data: { pricing_plan: pricingPlan },
  });
};

/**
 * Fetch the info about payment plans.
 * @returns {Array} Array with multiple plans.
 */
export const fetchPaymentPlans = async () =>
  fetchGet({
    endpoint: `/api/v1/billing/plans`,
  });

/**
 * Upgrade the user's subscription.
 * @param {string} pricingPlan - specific pricing plan name (small_crew | medium_crew)
 * @returns {Promise<void>}} Resolved promise in case of success.
 */
export const upgradeSubscription = async (pricingPlan) => {
  const authToken = await auth.currentUser?.getIdToken();

  return fetchPut({
    endpoint: `/api/v1/billing/upgrade`,
    headers: {
      Authorization: authToken,
    },
    data: { pricing_plan: pricingPlan },
  });
};

/**
 * Downgrade the user's subscription.
 * @param {string} pricingPlan - specific pricing plan name (small_crew | medium_crew)
 * @returns {Promise<void>}} Resolved promise in case of success.
 */
export const downgradeSubscription = async (pricingPlan) => {
  const authToken = await auth.currentUser?.getIdToken();

  return fetchPut({
    endpoint: `/api/v1/billing/downgrade`,
    headers: {
      Authorization: authToken,
    },
    data: { pricing_plan: pricingPlan },
  });
};

/**
 * Renew the user's subscription.
 * @returns {Promise<void>}} Resolved promise in case of success.
 */
export const renewSubscription = async () => {
  const authToken = await auth.currentUser?.getIdToken();

  return fetchPut({
    endpoint: `/api/v1/billing/renew`,
    headers: {
      Authorization: authToken,
    },
  });
};

/**
 * Get paginated invoices.
 * @param {Object} params - object with pagination params
 * @param {string} params.starting_after - the invoice id to start after
 * @param {string} params.ending_before - the invoice id to end before
 * @param {number} params.limit - the number of invoices to return per page
 * @returns {Object} - Object containing invoices, has_more, and total_count.
 */
export const fetchInvoices = async (params) => {
  const authToken = await auth.currentUser?.getIdToken();

  return fetchGet({
    endpoint: `/api/v1/billing/invoices`,
    headers: {
      Authorization: authToken,
    },
    params,
  });
};

/**
 * Fetch the client secret for trial subscription.
 * @param {string} pricingPlan - specific pricing plan name (small_crew | medium_crew)
 * @returns {Object} Object with `client_secret`.
 */
export const fetchTrialSubscription = async (pricingPlan) => {
  const authToken = await auth.currentUser?.getIdToken();

  return fetchPost({
    endpoint: `/api/v1/billing/trial-subscription`,
    headers: {
      Authorization: authToken,
    },
    data: { pricing_plan: pricingPlan },
  });
};
