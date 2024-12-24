import React, { useState, useEffect, useCallback } from "react";
import { useWindowSize } from "utilities/useWindowSize";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";
import InvoicesIcon from "assets/images/icons/invoices/invoices.png";
import DataTable from "examples/Tables/DataTable";
import emptyState from "assets/images/empty-invoices.png";
import { useGetInvoices } from "../../../firebase/hooks/useGetInvoices";

const columns = [
  { Header: "№", accessor: "id", width: "10%" },
  { Header: "Date", accessor: "date", width: "10%" },
  { Header: "Type", accessor: "type", width: "16%" },
  { Header: "Quantity", accessor: "quantity", width: "16%" },
  { Header: "Amount", accessor: "amount", width: "16%" },
  { Header: "Status", accessor: "statusInvoice", width: "16%" },
  { Header: "Payments", accessor: "payments", width: "16%" },
];

export default function Invoices() {
  const pageSize = useWindowSize({ marginDesktop: -2, marginMobile: 7 });
  const [isMobileSize, setIsMobileSize] = useState(window.innerWidth < 768);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
    const handleResize = () => {
      setIsMobileSize(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox />
      <MDBox
        mt={pageSize}
        style={{
          backgroundColor: "white",
          padding: isMobileSize ? "8px" : "16px 24px",
          boxShadow:
            "0px 4px 12px 4px rgba(38, 42, 63, 0.06), 0px 2px 4px -1px rgba(48, 57, 65, 0.16)",
          borderRadius: "24px",
        }}
      >
        <Grid container direction="column" gap={2}>
          <Grid item container direction="row" gap={2}>
            <div style={{ position: "relative", width: "64px" }}>
              <img
                src={InvoicesIcon}
                alt="invoices icon"
                style={{
                  position: "absolute",
                  left: "-14px",
                  bottom: "-16px",
                  width: "92px",
                  height: "92px",
                }}
              />
            </div>
            <MDTypography variant="h6">Invoices</MDTypography>
          </Grid>

          {loading ? (
            <Grid item>
              <MDTypography variant="body1">Loading...</MDTypography>
            </Grid>
          ) : (
            <Grid
              item
              style={{
                width: "100%",
              }}
            >
              {invoicesList.length === 0 ? (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={emptyState}
                    alt="Empty State"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </div>
              ) : (
                <DataTable
                  pages={pages}
                  entriesPerPage={rowsPerPage}
                  currentPage={currentPage}
                  nextPage={handleNextPage}
                  prevPage={handlePrevPage}
                  showTotalEntries={totalCount}
                  handleChangeRowsPerPage={handleChangeRowsPerPage}
                  table={{
                    columns,
                    rows: invoicesList,
                  }}
                  type="invoices"
                />
              )}
            </Grid>
          )}
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}
