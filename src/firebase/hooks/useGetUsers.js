import { useCallback, useState } from "react";
import { getUsersByRole, getUsersCount } from "../user";

/**
 * Hook to get users by role.
 * @returns {Object} - Object containing users, loading, and pagination functions.
 */
export const useGetUsers = () => {
  // Pagination related
  const [firstDoc, setFirstDoc] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePagination = useCallback(
    async ({ direction, role, filters, filtersData }) => {
      setLoading(true);

      const { usersData, firstDocument, lastDocument } = await getUsersByRole({
        direction,
        role,
        firstDoc,
        lastDoc,
        filters,
        filtersData,
      });

      setUsers(usersData);
      setFirstDoc(firstDocument);
      setLastDoc(lastDocument);
      setLoading(false);
    },
    [lastDoc, firstDoc]
  );

  const nextPage = useCallback(
    async ({ role, filters, filtersData }) => {
      setCurrentPage((prev) => prev + 1);
      await handlePagination({
        direction: "next",
        role,
        filters,
        filtersData,
      });
    },
    [handlePagination]
  );

  const prevPage = useCallback(
    async ({ role, filters, filtersData }) => {
      setCurrentPage((prev) => prev - 1);
      await handlePagination({
        direction: "prev",
        role,
        filters,
        filtersData,
      });
    },
    [handlePagination]
  );

  // Initial load of 1st page
  const initialLoad = useCallback(
    async ({ role, filters, filtersData }) => {
      const [usersCount] = await Promise.all([
        getUsersCount({ role, filters, filtersData }),
        handlePagination({ role, filters, filtersData }),
      ]);

      setTotalCount(usersCount);
      setPages(Math.ceil(usersCount / filters.limitPerPage));
    },
    [handlePagination]
  );

  return {
    users,
    loading,
    getUsers: initialLoad,
    nextPage,
    prevPage,
    totalCount,
    pages,
    currentPage,
  };
};
