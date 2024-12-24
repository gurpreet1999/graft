import { useState, useEffect, useCallback } from "react";
import { getDoc, doc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "store/user/selectors";
import { setUser } from "store/user/slices";
import { auth, db } from "..";

/**
 * Hook to fetch the current user based on auth info. Needs to be used once in the app.
 * @returns {Object} currentUser - The current user data.
 * @returns {Boolean} isUserLoggedIn - The current user login status.
 * @returns {Boolean} loading - The loading state.
 */
export const useFetchCurrentUser = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const currentUser = useSelector(userSelector);

  const getUserData = useCallback(async (uid) => {
    setLoading(true);

    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    const data = userDoc.data();

    const userData = {
      ...data,
      id: userDoc.id,
      created_at: data.created_at?.toDate().toISOString(),
    };

    dispatch(setUser(userData));

    setLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        dispatch(setUser(null));
        setLoading(false);
        return;
      }

      await getUserData(user.uid);
    });

    return unsubscribe;
  }, []);

  return {
    isUserLoggedIn: Boolean(auth.currentUser),
    currentUser,
    loading,
  };
};
