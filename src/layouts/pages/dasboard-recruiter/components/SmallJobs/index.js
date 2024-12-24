import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import searchIcon from "assets/images/icons/search/search.png";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import emptyJobs from "assets/images/empty-jobs-dashboard.png";
import { renderSmallTable } from "utilities/renderSmallTable";
import { useRecruiterJobs } from "../../../../../firebase/hooks/useRecruiterJobs";

const columns = [
  { Header: "№", accessor: "id", width: "10%" },
  { Header: "Role", accessor: "role", width: "10%" },
  { Header: "Distance", accessor: "distance", width: "16%" },
];

export default function SmallJobs() {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { jobs, loading, getRecruiterJobs, nextPage, prevPage, totalCount, pages, currentPage } =
    useRecruiterJobs();

  useEffect(() => {
    getRecruiterJobs({ limitPerPage: rowsPerPage });
  }, [rowsPerPage]);

  const handleChangeRowsPerPage = useCallback(
    async (numberOfRows) => {
      setRowsPerPage(numberOfRows);
    },
    [rowsPerPage]
  );

  const handleNextPage = useCallback(async () => {
    await nextPage({ limitPerPage: rowsPerPage });
  }, [jobs, nextPage, currentPage, pages, rowsPerPage]);

  const handlePrevPage = useCallback(async () => {
    await prevPage({ limitPerPage: rowsPerPage });
  }, [jobs, prevPage, currentPage, pages, rowsPerPage]);

  const formattedJobs = jobs.map((job) => ({
    id: job.id.substring(0, 9),
    role: job.role,
    distance: job.distance || "N/A",
  }));

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
        src={searchIcon}
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
        Jobs
      </MDTypography>
      {renderSmallTable(
        loading,
        emptyJobs,
        columns,
        formattedJobs,
        pages,
        rowsPerPage,
        currentPage,
        handleNextPage,
        handlePrevPage,
        totalCount,
        handleChangeRowsPerPage
      )}
      <Link
        to="/jobs"
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
