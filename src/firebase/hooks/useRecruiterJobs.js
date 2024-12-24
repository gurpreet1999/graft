import { useCallback, useState } from "react";

import { getListedJobsForRecruiter, getRecruiterJobsCount } from "../job";

/**
 * Custom hook to get the jobs for the recruiter.
 * @returns {Object} - The jobs, loading state, and pagination functions.
 */
export const useRecruiterJobs = () => {
  // Pagination related
  const [firstDoc, setFirstDoc] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePagination = useCallback(
    async ({ direction, filters, limitPerPage }) => {
      setLoading(true);
      const { jobsData, firstDocument, lastDocument } = await getListedJobsForRecruiter({
        direction,
        filters,
        firstDoc,
        lastDoc,
        limitPerPage,
      });

      setJobs(jobsData);
      setFirstDoc(firstDocument);
      setLastDoc(lastDocument);
      setLoading(false);
    },
    [lastDoc, firstDoc]
  );

  const nextPage = useCallback(
    async ({ filters, limitPerPage }) => {
      setCurrentPage((prev) => prev + 1);
      await handlePagination({ direction: "next", filters, limitPerPage });
    },
    [handlePagination]
  );

  const prevPage = useCallback(
    async ({ filters, limitPerPage }) => {
      setCurrentPage((prev) => prev - 1);
      await handlePagination({ direction: "prev", filters, limitPerPage });
    },
    [handlePagination]
  );

  // Initial load of 1st page
  const initialLoad = useCallback(
    async ({ filters, limitPerPage }) => {
      const [jobsCount] = await Promise.all([
        getRecruiterJobsCount(filters),
        handlePagination({ filters, limitPerPage }),
      ]);

      setTotalCount(jobsCount);
      setPages(Math.ceil(jobsCount / limitPerPage));
    },
    [handlePagination]
  );

  return {
    jobs,
    loading,
    getRecruiterJobs: initialLoad,
    nextPage,
    prevPage,
    totalCount,
    pages,
    currentPage,
  };
};
