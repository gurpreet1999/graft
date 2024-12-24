import { useState, useCallback, useMemo } from "react";
import {
  getCandidatesByDistance,
  getCandidatesCount,
  getPaginatedCandidates,
} from "../search-candidates";
import { validateSearchCandidatesFilters } from "../validation/validators";
import { calculateDistance, lookupPostalCode } from "../api/postal-code";

/**
 * Props for the useSearchCandidates hook.
 * @param {Object} filters - Filters to be applied to the search.
 * @param {string} filters.sector - Sector of the candidates.
 * Fields for Hospitality sector:
 * @param {string} filters.role - Role of the candidates.
 * @param {string} filters.establishmentType - Establishment type of the candidates.
 * Fields for Construction sector:
 * @param {string} filters.constructionRole - Role of the candidates.
 * @param {string} filters.constructionCardType - Card type of the candidates.
 * Shared fields:
 * @param {string} filters.yearsOfExperience - Years of experience of the candidates.
 * @param {string} filters.postalCode - Postal code of the candidates.
 * @param {number} filters.distance - Distance from the postal code to search for candidates.
 * @param {boolean} filters.verified - Whether the candidates are verified.
 * @param {number} limitPerPage - The number of candidates to display per page.
 * @param {boolean} ignoreQuery - Ignores the query explicitly until certain action (e.g. click of the button).
 */

export const useSearchCandidates = () => {
  // Pagination related
  const [firstDoc, setFirstDoc] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  // Postal code pagination related
  const [postalCodeData, setPostalCodeData] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handlePagination = useCallback(
    async ({ direction, filters, limitPerPage }) => {
      setLoading(true);
      const { candidatesData, firstDocument, lastDocument } = await getPaginatedCandidates({
        direction,
        filters,
        lastDoc,
        firstDoc,
        limitPerPage,
      });

      setCandidates(candidatesData);
      setFirstDoc(firstDocument);
      setLastDoc(lastDocument);
      setLoading(false);
    },
    [lastDoc, firstDoc]
  );

  const nextPage = useCallback(
    async ({ filters, limitPerPage }) => {
      setCurrentPage((prev) => prev + 1);

      if (!postalCodeData) {
        await handlePagination({ direction: "next", filters, limitPerPage });
      }
    },
    [handlePagination, postalCodeData]
  );

  const prevPage = useCallback(
    async ({ filters, limitPerPage }) => {
      setCurrentPage((prev) => prev - 1);

      if (!postalCodeData) {
        await handlePagination({ direction: "prev", filters, limitPerPage });
      }
    },
    [handlePagination, postalCodeData]
  );

  // Initial load of 1st page
  const initialLoad = useCallback(
    async ({ filters, limitPerPage }) => {
      validateSearchCandidatesFilters(filters);

      setItemsPerPage(limitPerPage);

      if (filters.postalCode && filters.distance) {
        const postalCodeInfo = await lookupPostalCode(filters.postalCode);
        setPostalCodeData(postalCodeInfo);

        setLoading(true);

        const candidatesByDistance = await getCandidatesByDistance({
          postalCodeData: postalCodeInfo,
          filters,
        });

        setCandidates(candidatesByDistance);
        setTotalCount(candidatesByDistance.length);
        setLoading(false);

        return;
      }

      const [candidatesCount] = await Promise.all([
        getCandidatesCount({ filters }),
        handlePagination({ filters, limitPerPage }),
      ]);

      setTotalCount(candidatesCount);
      setPostalCodeData(null);
    },
    [handlePagination]
  );

  const candidatesData = useMemo(() => {
    const candidatesWithDistance = candidates.map((candidate) => {
      let distance = "N/A";
      const candidateHasPostalCodeCoordinates =
        candidate.postal_code_longitude && candidate.postal_code_latitude;

      if (postalCodeData && candidateHasPostalCodeCoordinates) {
        distance = calculateDistance(
          {
            longitude: postalCodeData.longitude,
            latitude: postalCodeData.latitude,
          },
          {
            longitude: candidate.postal_code_longitude,
            latitude: candidate.postal_code_latitude,
          }
        ).toFixed(2);
      }

      return {
        ...candidate,
        distance,
      };
    });

    if (!postalCodeData) {
      // Data is already paginated, no need to change it.
      return candidatesWithDistance;
    }

    // Paginate the data based on the itemsPerPage
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return candidatesWithDistance.slice(start, end);
  }, [currentPage, itemsPerPage, candidates, postalCodeData]);

  const pages = useMemo(() => Math.ceil(totalCount / itemsPerPage), [totalCount, itemsPerPage]);

  return {
    pages,
    totalCount,
    currentPage,
    candidates: candidatesData,
    loading,
    searchCandidates: initialLoad,
    nextPage,
    prevPage,
  };
};
