import { useCallback, useState } from "react";
import { getAllJobsForCandidate, getAllJobsForCandidateCount } from "../job";
import { getAppliedJobs, getAppliedJobsCount } from "../job-application";

export const useGetJobsAsCandidate = () => {
  const [firstDoc, setFirstDoc] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePagination = useCallback(
    async ({ direction, currentUser, limitPerPage }) => {
      setLoading(true);
      const { jobsData, firstDocument, lastDocument } = await getAllJobsForCandidate({
        direction,
        currentUser,
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
    async ({ currentUser, limitPerPage }) => {
      setCurrentPage((prev) => prev + 1);
      await handlePagination({ direction: "next", currentUser, limitPerPage });
    },
    [handlePagination]
  );

  const prevPage = useCallback(
    async ({ currentUser, limitPerPage }) => {
      setCurrentPage((prev) => prev - 1);
      await handlePagination({ direction: "prev", currentUser, limitPerPage });
    },
    [handlePagination]
  );

  const initialLoad = useCallback(
    async ({ currentUser, limitPerPage }) => {
      const [jobsCount] = await Promise.all([
        getAllJobsForCandidateCount({ currentUser }),
        handlePagination({ currentUser, limitPerPage }),
      ]);
      setTotalCount(jobsCount);
      setPages(Math.ceil(jobsCount / limitPerPage));
    },
    [handlePagination]
  );

  return {
    jobs,
    loading,
    getJobs: initialLoad,
    nextPage,
    prevPage,
    totalCount,
    pages,
    currentPage,
  };
};

export const useGetAppliedJobs = () => {
  const [firstDoc, setFirstDoc] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePagination = useCallback(
    async ({ direction, userId, limitPerPage }) => {
      setLoading(true);
      const { jobsData, firstDocument, lastDocument } = await getAppliedJobs({
        direction,
        userId,
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
    async ({ userId, limitPerPage }) => {
      setCurrentPage((prev) => prev + 1);
      await handlePagination({ direction: "next", userId, limitPerPage });
    },
    [handlePagination]
  );

  const prevPage = useCallback(
    async ({ userId, limitPerPage }) => {
      setCurrentPage((prev) => prev - 1);
      await handlePagination({ direction: "prev", userId, limitPerPage });
    },
    [handlePagination]
  );

  const initialLoad = useCallback(
    async ({ userId, limitPerPage }) => {
      const [jobsCount] = await Promise.all([
        getAppliedJobsCount({ userId }),
        handlePagination({ userId, limitPerPage }),
      ]);

      setTotalCount(jobsCount);
      setPages(Math.ceil(jobsCount / limitPerPage));
    },
    [handlePagination]
  );

  return {
    jobs,
    loading,
    getJobs: initialLoad,
    nextPage,
    prevPage,
    totalCount,
    pages,
    currentPage,
  };
};
