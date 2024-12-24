import { fetchPost } from "utilities/CRUD";
import { auth } from "..";

/**
 * Create admin user with email and password by another admin.
 * @param {Object} userData - Object with user data.
 * @param {string} userData.email - The email address of the admin.
 * @param {string} userData.password - The password of the admin.
 * @returns {Promise<void>} Promise that resolves when the user is created.
 */
export const createAdminUser = async (userData) => {
  const authToken = await auth.currentUser?.getIdToken();

  return fetchPost({
    endpoint: `/api/v1/firebase-auth/admin`,
    headers: {
      Authorization: authToken,
    },
    data: userData,
  });
};

/**
 * Suspend/un-suspend a user by another admin.
 * @param {string} uid - The user ID.
 * @param {boolean} suspend - Whether to suspend or un-suspend the user.
 * @returns {Promise<void>} Promise that resolves when the user is suspended.
 */
export const suspendUser = async (uid, suspend) => {
  const authToken = await auth.currentUser?.getIdToken();

  return fetchPost({
    endpoint: `/api/v1/firebase-auth/suspend`,
    headers: {
      Authorization: authToken,
    },
    data: { userUid: uid, suspend },
  });
};
