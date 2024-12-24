/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { userSelector } from "store/user/selectors";
import MDBox from "components/MDBox";
import MDPagination from "components/MDPagination";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Autocomplete from "@mui/material/Autocomplete";
import Icon from "@mui/material/Icon";
import EmptyState from "assets/images/jobs/empty-available.png";
import { useGetJobsAsCandidate } from "../../../../../firebase/hooks/useGetJobs";
import AvalaibleItem from "./AvalaibleItem";

function Avalaible() {
  const { user } = useSelector(userSelector);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isMobileSize, setIsMobileSize] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobileSize(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const entries = ["5", "10", "15", "20", "25"];

  const { jobs, loading, getJobs, nextPage, prevPage, totalCount, pages, currentPage } =
    useGetJobsAsCandidate();

  useEffect(() => {
    getJobs({ currentUser: user, limitPerPage: rowsPerPage });
  }, [rowsPerPage]);

  useEffect(() => {
    if (jobs.length !== 0) {
      localStorage.setItem("jobForRedirect", JSON.stringify(jobs[0].id));
    }
  }, [jobs]);

  const handleNextPage = useCallback(async () => {
    if (currentPage === pages) return;
    await nextPage({ currentUser: user, limitPerPage: rowsPerPage });
  }, [jobs, rowsPerPage, currentPage, pages, nextPage]);

  const handlePrevPage = useCallback(async () => {
    if (currentPage === 1) return;
    await prevPage({ currentUser: user, limitPerPage: rowsPerPage });
  }, [jobs, rowsPerPage, currentPage, pages, prevPage]);

  const handleChangeRowsPerPage = useCallback(
    (numberOfRows) => {
      setRowsPerPage(numberOfRows);
    },
    [jobs]
  );

  return (
    <>
      {jobs.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <img src={EmptyState} alt="empty state" />
        </div>
      ) : (
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {loading ? (
            <MDTypography
              style={{
                color: "#5F5F5F",
                fontSize: "12px",
                fontWeight: "400",
              }}
            >
              Loading...
            </MDTypography>
          ) : (
            jobs.map((job) => (
              <li key={job.id}>
                <AvalaibleItem job={job} />
              </li>
            ))
          )}
        </ul>
      )}
      {jobs.length !== 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: isMobileSize ? "6px" : "20px",
            gap: isMobileSize ? "5px" : "10px",
          }}
        >
          {rowsPerPage && (
            <MDBox display="flex" gap={2} alignItems="center" sx={{ border: "none" }}>
              <MDTypography
                variant="caption"
                style={{
                  color: "#5F5F5F",
                  fontSize: "12px",
                  fontWeight: "400",
                }}
              >
                {isMobileSize ? "" : "Rows per page:"}
              </MDTypography>
              <Autocomplete
                disableClearable
                value={rowsPerPage.toString()}
                options={entries}
                onChange={(event, newValue) => {
                  handleChangeRowsPerPage(parseInt(newValue, 10));
                }}
                size="xsmall"
                sx={{
                  width: "70px",
                  outline: "none",
                  border: "none",
                }}
                renderInput={(params) => (
                  <MDInput variant="standard" {...params} sx={{ border: "none !important" }} />
                )}
              />
            </MDBox>
          )}
          {totalCount && (
            <MDBox>
              <MDTypography
                style={{
                  color: "#5F5F5F",
                  fontSize: "12px",
                  fontWeight: "400",
                }}
              >
                {totalCount} results
              </MDTypography>
            </MDBox>
          )}
          <MDPagination variant="gradient" color="info">
            <MDPagination item onClick={() => currentPage > 1 && handlePrevPage()}>
              <Icon sx={{ fontWeight: "bold" }}>chevron_left</Icon>
            </MDPagination>

            <MDPagination item onClick={() => currentPage < pages && handleNextPage()}>
              <Icon sx={{ fontWeight: "bold" }}>chevron_right</Icon>
            </MDPagination>
          </MDPagination>
        </div>
      )}
    </>
  );
}

export default Avalaible;
