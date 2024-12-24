import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import invoicesIcon from "assets/images/icons/invoices/invoices.png";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import emptyInvoice from "assets/images/empty-invoices-dashboard.png";
import { renderSmallTable } from "utilities/renderSmallTable";
import { useGetInvoices } from "../../../../../firebase/hooks/useGetInvoices";

const columns = [
  { Header: "№", accessor: "id", width: "10%" },
  { Header: "Date", accessor: "date", width: "10%" },
  { Header: "Amount", accessor: "amount", width: "16%" },
  { Header: "Status", accessor: "statusInvoice", width: "16%" },
];

export default function SmallInvoices() {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const {
    formattedInvoices: invoicesList,
    loading,
    getInvoices,
    nextPage,
    prevPage,
    totalCount,
    pages,
    currentPage,
  } = useGetInvoices();

  useEffect(() => {
    getInvoices({ limitPerPage: rowsPerPage });
  }, [rowsPerPage]);

  const handleChangeRowsPerPage = useCallback(
    async (numberOfRows) => {
      setRowsPerPage(numberOfRows);
    },
    [rowsPerPage]
  );

  const handleNextPage = useCallback(async () => {
    await nextPage({ limitPerPage: rowsPerPage });
  }, [invoicesList, nextPage, currentPage, pages, rowsPerPage]);

  const handlePrevPage = useCallback(async () => {
    await prevPage({ limitPerPage: rowsPerPage });
  }, [invoicesList, prevPage, currentPage, pages, rowsPerPage]);

  return (
    <MDBox
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#FFF",
        borderRadius: "24px",
        padding: "16px 24px",
        gap: "16px",
        position: "relative",
      }}
    >
      <img
        src={invoicesIcon}
        alt="invoices"
        style={{
          position: "absolute",
          top: "-28px",
          left: "10px",
        }}
      />
      <MDTypography
        style={{
          paddingLeft: "80px",
          fontSize: "16px",
          color: "#353F46",
          fontWeight: 700,
        }}
      >
        Invoices
      </MDTypography>
      {renderSmallTable(
        loading,
        emptyInvoice,
        columns,
        invoicesList,
        pages,
        rowsPerPage,
        currentPage,
        handleNextPage,
        handlePrevPage,
        totalCount,
        handleChangeRowsPerPage
      )}
      <Link
        to="/invoices"
        style={{
          marginTop: "auto",
        }}
      >
        <MDTypography
          style={{
            fontSize: "13px",
            color: "#38B6FF",
            fontWeight: 500,
            textAlign: "right",
            textTransform: "uppercase",
          }}
        >
          See more
        </MDTypography>
      </Link>
    </MDBox>
  );
}
