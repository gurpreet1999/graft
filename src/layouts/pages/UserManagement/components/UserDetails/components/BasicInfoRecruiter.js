import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import EmptyState from "assets/images/noJobs.png";
import PropTypes from "prop-types";
import { formatPlan } from "utilities/helpers";
import { useRecruiterJobs } from "../../../../../../firebase/hooks/useRecruiterJobs";
import SuspendUser from "../../SuspendUser";
import { fetchPaymentPlans } from "../../../../../../firebase/backend/payment";

function BasicInfoRecruiter({ user }) {
  const [openSuspend, setOpenSuspend] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [planPricing, setPlanPricing] = useState();
  const { jobs, loading, getRecruiterJobs, nextPage, prevPage, totalCount, pages, currentPage } =
    useRecruiterJobs();

  useEffect(() => {
    fetchPaymentPlans().then((fetchedPlans) => {
      setPlanPricing(fetchedPlans.find((plan) => plan.id === user?.pricing_plan)?.price);
    });
  }, [user]);

  useEffect(() => {
    getRecruiterJobs({ recruiterId: user.id, limitPerPage: rowsPerPage });
  }, [rowsPerPage, user]);

  const handleNextPage = useCallback(async () => {
    if (currentPage === pages) return;
    await nextPage({ recruiterId: user.id, limitPerPage: rowsPerPage });
  }, [rowsPerPage, currentPage, pages, nextPage]);

  const handlePrevPage = useCallback(async () => {
    if (currentPage === 1) return;
    await prevPage({ recruiterId: user.id, limitPerPage: rowsPerPage });
  }, [rowsPerPage, currentPage, pages, prevPage]);

  const handleChangeRowsPerPage = useCallback(async (numberOfRows) => {
    setRowsPerPage(numberOfRows);
  }, []);

  const handleSuspendUser = useCallback(() => {
    setOpenSuspend(true);
  }, []);

  const handleCloseSuspendUser = () => setOpenSuspend(false);

  const formatJobs = jobs?.map((job) => ({
    id: job.id.substring(0, 5),
    role: job.role,
    expertise: job.area_of_expertise,
    experience: job.years_of_experience,
    postcode: job.postcode,
    statusJobs: "Not Published",
    matches: job.matches || "0",
    applied: job.applied || "0",
    actionDetailsDelete: job.id,
  }));
  return (
    <>
      <Card id="basic-info" sx={{ overflow: "visible", marginBottom: "24px" }}>
        <MDBox p={3}>
          <MDTypography variant="h3">Basic Info</MDTypography>
        </MDBox>
        <MDBox component="form" pb={3} px={3}>
          <Grid container spacing={3}>
            <Grid
              item
              xs={12}
              sm={6}
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <MDTypography
                style={{
                  fontSize: "16px",
                  color: "#888",
                }}
              >
                First Name
              </MDTypography>
              <MDTypography
                style={{
                  fontSize: "18px",
                  color: "#1C1C1C",
                }}
              >
                {user.first_name}
              </MDTypography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid
                item
                xs={12}
                sm={6}
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <MDTypography
                  style={{
                    fontSize: "16px",
                    color: "#888",
                  }}
                >
                  Last Name
                </MDTypography>
                <MDTypography
                  style={{
                    fontSize: "18px",
                    color: "#1C1C1C",
                  }}
                >
                  {user.last_name}
                </MDTypography>
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <MDTypography
                style={{
                  fontSize: "16px",
                  color: "#888",
                }}
              >
                Company
              </MDTypography>
              <MDTypography
                style={{
                  fontSize: "18px",
                  color: "#1C1C1C",
                }}
              >
                {user.company_name}
              </MDTypography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <MDTypography
                style={{
                  fontSize: "16px",
                  color: "#888",
                }}
              >
                Email
              </MDTypography>
              <MDTypography
                style={{
                  fontSize: "18px",
                  color: "#1C1C1C",
                }}
              >
                {user.email}
              </MDTypography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <MDTypography
                style={{
                  fontSize: "16px",
                  color: "#888",
                }}
              >
                Mobile Number
              </MDTypography>
              <MDTypography
                style={{
                  fontSize: "18px",
                  color: "#1C1C1C",
                }}
              >
                {user.phone_number}
              </MDTypography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <MDTypography
                style={{
                  fontSize: "16px",
                  color: "#888",
                }}
              >
                Postcode
              </MDTypography>
              <MDTypography
                style={{
                  fontSize: "18px",
                  color: "#1C1C1C",
                }}
              >
                {user.postal_code}
              </MDTypography>
            </Grid>
            <Grid item container direction="row" justifyContent="flex-end" gap={2}>
              <button
                type="button"
                onClick={() => handleSuspendUser()}
                style={{
                  padding: "5px",
                  borderRadius: "4px",
                  backgroundColor: "#fff",
                  boxShadow:
                    "0px 4px 12px 4px rgba(38, 42, 63, 0.06), 0px 2px 4px -1px rgba(48, 57, 65, 0.16)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  outline: "none",
                  border: "none",
                  cursor: "pointer",
                  width: "42px",
                  height: "42px",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M12.5 11.6668C14.725 11.6668 19.1667 12.7752 19.1667 15.0002V16.6668H5.83334V15.0002C5.83334 12.7752 10.275 11.6668 12.5 11.6668ZM12.5 10.0002C11.616 10.0002 10.7681 9.64897 10.143 9.02385C9.51786 8.39873 9.16667 7.55088 9.16667 6.66683C9.16667 5.78277 9.51786 4.93493 10.143 4.30981C10.7681 3.68469 11.616 3.3335 12.5 3.3335C13.3841 3.3335 14.2319 3.68469 14.857 4.30981C15.4822 4.93493 15.8333 5.78277 15.8333 6.66683C15.8333 7.55088 15.4822 8.39873 14.857 9.02385C14.2319 9.64897 13.3841 10.0002 12.5 10.0002ZM4.16667 7.99183L5.93334 6.21683L7.11667 7.40016L5.34167 9.16683L7.11667 10.9335L5.93334 12.1168L4.16667 10.3418L2.40001 12.1168L1.21667 10.9335L2.99167 9.16683L1.21667 7.40016L2.40001 6.21683L4.16667 7.99183Z"
                    fill="#AAC2D0"
                  />
                </svg>
              </button>
              <Link to="/admin/user-management">
                <button
                  type="button"
                  style={{
                    padding: "8px 22px",
                    backgroundColor: "#38B6FF",
                    textTransform: "uppercase",
                    color: "white",
                    borderRadius: "4px",
                    boxShadow:
                      "0px 3px 1px -2px rgba(0, 0, 0, 0.20), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
                    fontFamily: "Roboto, sans-serif",
                    fontSize: "16px",
                    border: "none",
                    height: "42px",
                    cursor: "pointer",
                  }}
                >
                  Back to list
                </button>
              </Link>
            </Grid>
          </Grid>
        </MDBox>
      </Card>
      <Card sx={{ overflow: "visible", marginBottom: "24px" }}>
        <MDBox px={3} py={2}>
          <MDBox>
            <MDTypography variant="h5">Billing details</MDTypography>
          </MDBox>
          <Grid container>
            <Grid item xs={24} sm={12} mt={2}>
              <MDBox
                px={3}
                py={2}
                style={{
                  border: "1px solid #DCE7ED",
                  borderRadius: "8px",
                }}
              >
                <Grid container>
                  <Grid item>
                    <MDTypography
                      style={{
                        fontSize: "12px",
                        fontWeight: 400,
                      }}
                    >
                      Balance
                    </MDTypography>
                    <Grid container direction="row" alignItems="flex-end" gap="6px">
                      <MDTypography
                        style={{
                          fontSize: "28px",
                          fontWeight: 600,
                          color: "#353F46",
                        }}
                      >
                        {String(user?.credits)}
                      </MDTypography>
                      <MDTypography
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "#353F46",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "flex-end",
                          paddingBottom: "6px",
                        }}
                      >
                        credits
                      </MDTypography>
                    </Grid>
                  </Grid>
                </Grid>
              </MDBox>
            </Grid>
            <Grid item xs={24} sm={12} mt={2}>
              <MDBox
                px={3}
                py={2}
                style={{
                  border: "1px solid #DCE7ED",
                  borderRadius: "8px",
                }}
              >
                <Grid
                  container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-end"
                >
                  <Grid item>
                    <MDTypography
                      style={{
                        fontSize: "12px",
                        fontWeight: 400,
                      }}
                    >
                      Pricing Plan
                    </MDTypography>
                    <Grid container direction="row" alignItems="flex-end" gap="6px">
                      <MDTypography
                        style={{
                          fontSize: "28px",
                          fontWeight: 600,
                          color: "#353F46",
                        }}
                      >
                        {formatPlan(user?.pricing_plan)}
                      </MDTypography>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    container
                    direction="row"
                    gap="2px"
                    style={{
                      height: "40px",
                      width: "84px",
                      paddingBottom: "10px",
                    }}
                  >
                    <MDTypography
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#353F46",
                        paddingTop: "6px",
                      }}
                    >
                      £
                    </MDTypography>
                    <MDTypography
                      style={{
                        fontSize: "28px",
                        fontWeight: 600,
                        color: "#353F46",
                      }}
                    >
                      {planPricing}
                    </MDTypography>
                    <MDTypography
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#353F46",
                        marginTop: "auto",
                        paddingBottom: "4px",
                      }}
                    >
                      /mo
                    </MDTypography>
                  </Grid>
                </Grid>
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </Card>
      <Card>
        {loading ? (
          <MDTypography>Loading...</MDTypography>
        ) : (
          <div>
            {(jobs && jobs.length === 0) || jobs === undefined ? (
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
            ) : (
              <MDBox px={3} py={2}>
                <MDBox pb={2}>
                  <MDTypography variant="h5">Listing Jobs</MDTypography>
                </MDBox>
                <DataTable
                  style={{
                    width: "100%",
                  }}
                  pages={pages}
                  entriesPerPage={rowsPerPage}
                  currentPage={currentPage}
                  nextPage={handleNextPage}
                  prevPage={handlePrevPage}
                  showTotalEntries={totalCount}
                  handleChangeRowsPerPage={handleChangeRowsPerPage}
                  table={{
                    columns: [
                      { Header: "№", accessor: "id", width: "8%" },
                      { Header: "Role", accessor: "role", width: "12%" },
                      { Header: "Area of Expertise", accessor: "expertise", width: "12%" },
                      { Header: "Experience", accessor: "experience", width: "8%" },
                      { Header: "Postcode", accessor: "postcode", width: "8%" },
                      { Header: "Status", accessor: "statusJobs", width: "12%" },
                      { Header: "Candidates Matches", accessor: "matches", width: "11%" },
                      { Header: "Applied to a job", accessor: "applied", width: "10%" },
                      { Header: "Action", accessor: "actionDetailsDelete", width: "6%" },
                    ],
                    rows: formatJobs,
                  }}
                  type="jobs"
                />
              </MDBox>
            )}
          </div>
        )}
      </Card>
      <SuspendUser
        isOpenModal={openSuspend}
        handleCloseModal={handleCloseSuspendUser}
        uid={user.id}
      />
    </>
  );
}

BasicInfoRecruiter.propTypes = {
  user: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    company_name: PropTypes.string,
    email: PropTypes.string,
    phone_number: PropTypes.string,
    postal_code: PropTypes.string,
    credits: PropTypes.number,
    pricing_plan: PropTypes.string,
    id: PropTypes.string,
  }),
};

BasicInfoRecruiter.defaultProps = {
  user: {
    first_name: "",
    last_name: "",
    company_name: "",
    email: "",
    phone_number: "",
    postal_code: "",
    credits: 0,
    pricing_plan: "",
    id: "",
  },
};

export default BasicInfoRecruiter;
