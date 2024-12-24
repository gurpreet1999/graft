import { useCallback, useMemo, useState } from "react";
import { fetchInvoices } from "../backend/payment";

/**
 * Hook to get paginated invoices
 * @returns {Object} - Object containing invoices, loading, and pagination functions.
 */
export const useGetInvoices = () => {
  const [prevPageCursor, setPrevPageCursor] = useState(undefined);
  const [nextPageCursor, setNextPageCursor] = useState(undefined);
  const [totalCount, setTotalCount] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePagination = useCallback(
    async ({ direction, limitPerPage }) => {
      setLoading(true);

      let cursor;
      let property;

      switch (direction) {
        case "next":
          cursor = nextPageCursor;
          property = "starting_after";
          break;
        case "prev":
          cursor = prevPageCursor;
          property = "ending_before";
          break;
        default:
          cursor = undefined;
          property = undefined;
      }

      const usePagination = property !== undefined && cursor !== undefined;

      const { invoices: invoicesReturned, total_count: totalCountReturned } = await fetchInvoices({
        limit: limitPerPage,
        ...(usePagination && { [property]: cursor }),
      });

      setInvoices(invoicesReturned);
      setTotalCount(totalCountReturned);
      setPages(Math.ceil(totalCountReturned / limitPerPage));

      setLoading(false);

      setNextPageCursor(invoicesReturned.at(-1)?.id);
      setPrevPageCursor(invoicesReturned[0]?.id);
    },
    [totalCount, nextPageCursor, prevPageCursor]
  );

  const nextPage = useCallback(
    async ({ limitPerPage }) => {
      setCurrentPage((prev) => prev + 1);
      await handlePagination({ direction: "next", limitPerPage });
    },
    [handlePagination]
  );

  const prevPage = useCallback(
    async ({ limitPerPage }) => {
      setCurrentPage((prev) => prev - 1);
      await handlePagination({ direction: "prev", limitPerPage });
    },
    [handlePagination]
  );

  // Initial load of 1st page
  const initialLoad = useCallback(
    async ({ limitPerPage }) => {
      await handlePagination({ limitPerPage });
    },
    [handlePagination]
  );

  const formattedInvoices = useMemo(
    () =>
      invoices.map((invoice) => {
        const date = new Date(invoice.created * 1000);
        const formattedDate = date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        return {
          id: invoice.id.substring(0, 10),
          date: formattedDate,
          type: invoice.type.charAt(0).toUpperCase() + invoice.type.slice(1),
          quantity: invoice.quantity,
          amount: `£ ${invoice.amount_due}`,
          statusInvoice: invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1),
          payments: invoice.payments,
        };
      }),
    [invoices]
  );

  return {
    invoices,
    formattedInvoices,
    loading,
    getInvoices: initialLoad,
    nextPage,
    prevPage,
    totalCount,
    pages,
    currentPage,
  };
};
