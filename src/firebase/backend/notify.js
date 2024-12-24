import { fetchPost } from "utilities/CRUD";
import { auth } from "..";

/**
 * Notify Slack channels about the new user.
 */
export const notifyNewUser = async () => {
  const authToken = await auth.currentUser?.getIdToken();

  return fetchPost({
    endpoint: `/api/v1/notify`,
    headers: {
      Authorization: authToken,
    },
  });
};
