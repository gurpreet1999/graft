import { useCallback, useState } from "react";
import { getAppliedCandidates, getCandidatesCount } from "../job-application";

/**
 * Hook to get candidates applied to job
 */
export const useGetAppliedCandidates = () => {
  const [firstDoc, setFirstDoc] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePagination = useCallback(
    async ({ direction, jobId, limitPerPage }) => {
      setLoading(true);

      const { candidatesData, firstDocument, lastDocument } = await getAppliedCandidates({
        jobId,
        direction,
        firstDoc,
        lastDoc,
        limitPerPage,
      });

      setCandidates(candidatesData);
      setFirstDoc(firstDocument);
      setLastDoc(lastDocument);
      setLoading(false);
    },
    [lastDoc, firstDoc]
  );

  const initialLoad = useCallback(
    async ({ jobId, limitPerPage }) => {
      const [candidatesCount] = await Promise.all([
        getCandidatesCount({ jobId }),
        handlePagination({ jobId, limitPerPage }),
      ]);

      setTotalCount(candidatesCount);
      setPages(Math.ceil(candidatesCount / limitPerPage));
    },
    [handlePagination]
  );

  const nextPage = useCallback(
    async ({ jobId, limitPerPage }) => {
      setCurrentPage((prev) => prev + 1);
      await handlePagination({ direction: "next", jobId, limitPerPage });
    },
    [handlePagination]
  );

  const prevPage = useCallback(
    async ({ jobId, limitPerPage }) => {
      setCurrentPage((prev) => prev + 1);
      await handlePagination({ direction: "prev", jobId, limitPerPage });
    },
    [handlePagination]
  );

  return {
    candidates,
    loading,
    getCandidates: initialLoad,
    nextPage,
    prevPage,
    totalCount,
    pages,
    currentPage,
  };
};
