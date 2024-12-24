import { useCallback, useState } from "react";
import { getCampaignsHistoryForRecruiter, getCampaignsCount } from "../campaign";

/**
 * Custom hook to get the campaigns for the recruiter.
 * @returns {Object} - The campaigns, loading state, and pagination functions.
 */
export const useRecruiterCampaigns = () => {
  // Pagination related
  const [firstDoc, setFirstDoc] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePagination = useCallback(
    async ({ direction, filters, limitPerPage }) => {
      setLoading(true);

      const { campaignsData, firstDocument, lastDocument } = await getCampaignsHistoryForRecruiter({
        direction,
        filters,
        firstDoc,
        lastDoc,
        limitPerPage,
      });

      setCampaigns(campaignsData);
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
    async ({ limitPerPage, filters }) => {
      const [campaignsCount] = await Promise.all([
        getCampaignsCount(filters),
        handlePagination({ limitPerPage, filters }),
      ]);

      setTotalCount(campaignsCount);
      setPages(Math.ceil(campaignsCount / limitPerPage));
    },
    [handlePagination]
  );

  return {
    campaigns,
    loading,
    getCampaigns: initialLoad,
    nextPage,
    prevPage,
    totalCount,
    pages,
    currentPage,
  };
};
