/* eslint-disable import/no-extraneous-dependencies */
import MDTypography from "components/MDTypography";
import React, { useEffect, useState, useCallback } from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import EmptyState from "assets/images/noJobs.png";
import deleteBig from "assets/images/icons/jobs/deleteBig.svg";
import { styled } from "@mui/system";
import TabsUnstyled from "@mui/base/TabsUnstyled/TabsUnstyled";
import TabsList from "@mui/base/TabsListUnstyled/TabsListUnstyled";
import TabPanel from "@mui/base/TabPanelUnstyled/TabPanelUnstyled";
import Tab from "@mui/base/TabUnstyled/TabUnstyled";
import tabUnstyledClasses from "@mui/base/TabUnstyled/tabUnstyledClasses";
import { deleteJobAsRecruiter } from "../../../../../firebase/job";
import { useRecruiterJobs } from "../../../../../firebase/hooks/useRecruiterJobs";

export default function JobsList() {
  const [selectedJob, setSelectedJob] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [sector, setSector] = useState("Hospitality");
  const { jobs, loading, getRecruiterJobs, nextPage, prevPage, totalCount, pages, currentPage } =
    useRecruiterJobs();

  const handleTabChange = useCallback(
    (event, newValue) => {
      setSector(newValue === 1 ? "Hospitality" : "Construction");
    },
    [setSector]
  );

  useEffect(() => {
    getRecruiterJobs({
      limitPerPage: rowsPerPage,
      filters: {
        sector,
      },
    });
  }, [rowsPerPage, deleteSuccess, sector]);

  const handleClose = () => setSelectedJob("");

  const handleDeleteItem = useCallback(
    async (jobId) => {
      setSelectedJob(jobs.find((job) => job.id === jobId));
    },
    [jobs]
  );

  const confirmDelete = useCallback(async () => {
    await deleteJobAsRecruiter(selectedJob.id);
    setDeleteSuccess(true);
    setSelectedJob(null);
  }, [selectedJob]);

  const handleNextPage = useCallback(async () => {
    if (currentPage === pages) return;
    await nextPage({
      limitPerPage: rowsPerPage,
      filters: {
        sector,
      },
    });
  }, [jobs, rowsPerPage, currentPage, pages, nextPage]);

  const handlePrevPage = useCallback(async () => {
    if (currentPage === 1) return;
    await prevPage({
      limitPerPage: rowsPerPage,
      filters: {
        sector,
      },
    });
  }, [jobs, rowsPerPage, currentPage, pages, prevPage]);

  const handleChangeRowsPerPage = useCallback(
    async (numberOfRows) => {
      setRowsPerPage(numberOfRows);
    },
    [jobs]
  );

  const formatJobs = jobs?.map((job) => ({
    id: job.id.substring(0, 5),
    role: job?.role || "",
    expertise: job?.area_of_expertise === "any" ? "Any" : job?.area_of_expertise || "",
    experience: job?.years_of_experience === "any" ? "Any" : job?.years_of_experience || "",
    postcode: job?.postcode || "N/A",
    statusJob: job?.status || "",
    // matches: job.matches || "0",
    // applied: job.applied || "0",
    actionDetailsDelete: job?.id || "",
    typeOfSite: job?.type_of_site || "",
  }));

  return (
    <MDBox
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        padding: "16px 24px",
        borderRadius: "24px",
        boxShadow:
          "0px 4px 12px 4px rgba(38, 42, 63, 0.06), 0px 2px 4px -1px rgba(48, 57, 65, 0.16)",
      }}
    >
      <Modal open={!!selectedJob} onClose={handleClose} style={{ padding: "16px" }}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: "640px",
            width: "100%",
            backgroundColor: "white",
            border: "none",
            borderRadius: "24px",
            padding: "48px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <img src={deleteBig} alt="delete icon" />
          <MDTypography
            style={{
              fontSize: "32px",
              fontFamily: "Montserrat",
              color: "#1C1C1C",
              fontWeight: "700",
            }}
          >
            Remove Job?
          </MDTypography>
          <div
            style={{
              display: "flex",
              gap: "16px",
              flexDirection: "row",
              width: "100%",
              padding: "16px",
              border: "1px solid #DCE7ED",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "16px",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "2px",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <MDTypography
                  style={{
                    fontSize: "12px",
                    color: "#1C1C1C",
                    fontWeight: "400",
                  }}
                >
                  №
                </MDTypography>
                <MDTypography
                  style={{
                    fontSize: "14px",
                    color: "#1C1C1C",
                    fontWeight: "400",
                  }}
                >
                  {!!selectedJob && selectedJob?.id.substring(0, 5)}
                </MDTypography>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "2px",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <MDTypography
                  style={{
                    fontSize: "12px",
                    color: "#1C1C1C",
                    fontWeight: "400",
                  }}
                >
                  Area of Expertise
                </MDTypography>
                <MDTypography
                  style={{
                    fontSize: "14px",
                    color: "#1C1C1C",
                    fontWeight: "400",
                  }}
                >
                  {!!selectedJob &&
                    (selectedJob?.area_of_expertise === "any"
                      ? "Any"
                      : selectedJob?.area_of_expertise)}
                </MDTypography>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "2px",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <MDTypography
                  style={{
                    fontSize: "12px",
                    color: "#1C1C1C",
                    fontWeight: "400",
                  }}
                >
                  Verification
                </MDTypography>
                <MDTypography
                  style={{
                    fontSize: "14px",
                    color: "#1C1C1C",
                    fontWeight: "400",
                  }}
                >
                  {!!selectedJob && selectedJob?.verification ? "Verified Candidates Only " : "No"}
                </MDTypography>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "16px",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "2px",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <MDTypography
                  style={{
                    fontSize: "12px",
                    color: "#1C1C1C",
                    fontWeight: "400",
                  }}
                >
                  Role
                </MDTypography>
                <MDTypography
                  style={{
                    fontSize: "14px",
                    color: "#1C1C1C",
                    fontWeight: "400",
                  }}
                >
                  {!!selectedJob && selectedJob?.role}
                </MDTypography>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "2px",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <MDTypography
                  style={{
                    fontSize: "12px",
                    color: "#1C1C1C",
                    fontWeight: "400",
                  }}
                >
                  Experience
                </MDTypography>
                <MDTypography
                  style={{
                    fontSize: "14px",
                    color: "#1C1C1C",
                    fontWeight: "400",
                  }}
                >
                  {!!selectedJob && selectedJob?.years_of_experience}
                </MDTypography>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "2px",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <MDTypography
                  style={{
                    fontSize: "12px",
                    color: "#1C1C1C",
                    fontWeight: "400",
                  }}
                >
                  Postcode
                </MDTypography>
                <MDTypography
                  style={{
                    fontSize: "14px",
                    color: "#1C1C1C",
                    fontWeight: "400",
                  }}
                >
                  {!!selectedJob && selectedJob?.postcode}
                </MDTypography>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "16px",
              flexDirection: "row",
              width: "100%",
            }}
          >
            <Button
              onClick={handleClose}
              variant="outlined"
              style={{
                color: "#38B6FF",
                borderRadius: "4px",
                border: "1px solid #38B6FF",
                backgroundColor: "#fff",
                fontFamily: "Roboto, sans-serif",
                fontSize: "15px",
                fontWeight: "500",
                width: "100%",
              }}
            >
              Keep it
            </Button>
            <Button
              onClick={confirmDelete}
              style={{
                color: "#fff",
                borderRadius: "4px",
                border: "1px solid #D32F2F",
                backgroundColor: "#D32F2F",
                fontFamily: "Roboto, sans-serif",
                fontSize: "15px",
                fontWeight: "500",
                width: "100%",
              }}
            >
              Yes, Remove
            </Button>
          </div>
        </div>
      </Modal>
      <Grid container justifyContent="space-between" pb={2}>
        <MDTypography
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "#353F46",
          }}
        >
          Listed Jobs
        </MDTypography>
        <Link
          className="MuiButton-root"
          to="/jobs/add-new-job"
          style={{
            color: "white",
            backgroundColor: "#38B6FF",
            padding: "7px 16px 6px 16px",
            borderRadius: "4px",
            textDecoration: "none",
            fontSize: "14px",
            textTransform: "uppercase",
            boxShadow:
              "0px 3px 1px -2px rgba(0, 0, 0, 0.20), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
          }}
        >
          Add new job
        </Link>
      </Grid>
      <Grid container>
        <Grid
          item
          style={{
            width: "100%",
          }}
        >
          <TabsUnstyled
            defaultValue={1}
            onChange={handleTabChange}
            style={{
              width: "100%",
            }}
          >
            <TabsList
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <TabStyled value={1}>Hospitality</TabStyled>
              <TabStyled value={2}>Construction</TabStyled>
            </TabsList>
            <Grid container pt={2} style={{ width: "100%" }}>
              {loading && <MDTypography>Loading...</MDTypography>}
              {!loading && (jobs === undefined || jobs.length === 0) && (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    paddingBottom: "50px",
                  }}
                >
                  <img
                    src={EmptyState}
                    alt="Empty State"
                    style={{ maxWidth: "100%", margin: "0 auto", height: "auto" }}
                  />
                </div>
              )}
              {!loading && jobs && jobs.length > 0 && (
                <>
                  <TabPanel value={1} style={{ width: "100%" }}>
                    <DataTable
                      style={{
                        width: "100%",
                      }}
                      pages={pages}
                      entriesPerPage={rowsPerPage}
                      currentPage={currentPage}
                      nextPage={handleNextPage}
                      prevPage={handlePrevPage}
                      handleDeleteItem={handleDeleteItem}
                      showTotalEntries={totalCount}
                      handleChangeRowsPerPage={handleChangeRowsPerPage}
                      table={{
                        columns: [
                          { Header: "№", accessor: "id", width: "8%" },
                          { Header: "Role", accessor: "role", width: "12%" },
                          { Header: "Type of Establishment", accessor: "expertise", width: "12%" },
                          { Header: "Experience", accessor: "experience", width: "8%" },
                          { Header: "Postcode", accessor: "postcode", width: "8%" },
                          { Header: "Status", accessor: "statusJob", width: "12%" },
                          { Header: "Action", accessor: "actionDetailsDelete", width: "6%" },
                        ],
                        rows: formatJobs,
                      }}
                      type="jobs"
                    />
                  </TabPanel>
                  <TabPanel value={2} style={{ width: "100%" }}>
                    <DataTable
                      style={{
                        width: "100%",
                      }}
                      pages={pages}
                      entriesPerPage={rowsPerPage}
                      currentPage={currentPage}
                      nextPage={handleNextPage}
                      prevPage={handlePrevPage}
                      handleDeleteItem={handleDeleteItem}
                      showTotalEntries={totalCount}
                      handleChangeRowsPerPage={handleChangeRowsPerPage}
                      table={{
                        columns: [
                          { Header: "№", accessor: "id", width: "8%" },
                          { Header: "Role", accessor: "role", width: "12%" },
                          { Header: "Card Type", accessor: "expertise", width: "12%" },
                          { Header: "Experience", accessor: "experience", width: "8%" },
                          { Header: "Postcode", accessor: "postcode", width: "8%" },
                          { Header: "Status", accessor: "statusJob", width: "12%" },
                          { Header: "Action", accessor: "actionDetailsDelete", width: "6%" },
                        ],
                        rows: formatJobs,
                      }}
                      type="jobs"
                    />
                  </TabPanel>
                </>
              )}
            </Grid>
          </TabsUnstyled>
        </Grid>
      </Grid>
    </MDBox>
  );
}

const TabStyled = styled(Tab)`
  font-family: "Roboto", sans-serif;
  color: #f5f5f;
  cursor: pointer;
  font-weight: 500;
  background-color: transparent;
  width: fit-content;
  padding: 9px 16px 7px 16px;
  display: flex;
  justify-content: center;
  border: none;
  background: none;
  color: inherit;
  border: none;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  font-size: 14px;
  text-transform: UpperCase;

  &:hover {
    border-bottom: 2px solid #07a0c3;
    color: #07a0c3;
  }

  &:focus {
    color: #07a0c3;
    border-bottom: 2px solid #07a0c3;
  }

  &.${tabUnstyledClasses.selected} {
    border-bottom: 2px solid #07a0c3;
    color: #07a0c3;
  }
`;
