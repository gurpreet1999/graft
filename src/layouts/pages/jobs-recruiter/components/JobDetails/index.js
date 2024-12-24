/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState, useCallback } from "react";
import Modal from "@mui/material/Modal";
import { useParams, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import Button from "@mui/material/Button";
import { styled } from "@mui/system";
import TabsUnstyled from "@mui/base/TabsUnstyled/TabsUnstyled";
import TabsList from "@mui/base/TabsListUnstyled/TabsListUnstyled";
import TabPanel from "@mui/base/TabPanelUnstyled/TabPanelUnstyled";
import Tab from "@mui/base/TabUnstyled/TabUnstyled";
import tabUnstyledClasses from "@mui/base/TabUnstyled/tabUnstyledClasses";
import deleteBig from "assets/images/icons/jobs/deleteBig.svg";
import EmptyState from "assets/images/search/EmptyState.png";
import emptyApply from "assets/images/search/empty-apply.png";
import CreateCampaign from "./create-campaign";
import { CandidatesMatched } from "./candidatesMatched";
import { CandidatesApplied } from "./candidatesApplied";
import {
  deleteJobAsRecruiter,
  getJobById,
  updateJobAsRecruiter,
} from "../../../../../firebase/job";

function JobDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [jobDetails, setJobDetails] = useState();
  const [totalCount, setTotalCount] = useState(0);
  const [isMobileSize, setIsMobileSize] = useState(window.innerWidth < 540);
  useEffect(() => {
    const handleResize = () => {
      setIsMobileSize(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTabChange = useCallback((count) => {
    setTotalCount(count);
  }, []);

  useEffect(() => {
    const fetchJob = async () => {
      const fetchedJob = await getJobById(id);
      setJobDetails(fetchedJob);
      setFilters({
        ...(fetchedJob.sector !== "Construction" && { role: fetchedJob.role }),
        ...(fetchedJob.sector === "Construction" && { constructionRole: fetchedJob.role }),
        establishmentType: fetchedJob.area_of_expertise,
        yearsOfExperience: fetchedJob.years_of_experience,
        verified: fetchedJob.verification,
        sector: fetchedJob.sector,
        ...(fetchedJob.area_of_expertise && { cscsCardType: fetchedJob.area_of_expertise }),
        ...(fetchedJob.postcode && { postalCode: fetchedJob.postcode }),
      });
    };
    fetchJob();
  }, []);

  const confirmDelete = async () => {
    await deleteJobAsRecruiter(jobDetails.id);
    navigate("/jobs");
  };

  const handleOpenModal = useCallback(() => {
    setIsOpenModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  const handleClose = () => setIsOpen(false);

  const handleOpen = () => setIsOpen(true);

  const unPublishJob = async () => {
    await updateJobAsRecruiter({
      jobId: jobDetails.id,
      jobData: {
        ...jobDetails,
        status: false,
      },
    });
    setJobDetails({
      ...jobDetails,
      status: false,
    });
  };

  const publishJob = async () => {
    await updateJobAsRecruiter({
      jobId: jobDetails.id,
      jobData: {
        ...jobDetails,
        status: true,
      },
    });
    setJobDetails({
      ...jobDetails,
      status: true,
    });
  };

  return (
    <Grid container direction="column" gap={3}>
      <Modal open={isOpen} onClose={handleClose} style={{ padding: "16px" }}>
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
          {jobDetails?.length === 0 ? (
            <MDTypography variant="h6">Loading...</MDTypography>
          ) : (
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
                    {id.substring(0, 5)}
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
                    {jobDetails?.area_of_expertise === "any"
                      ? "Any Type of Establishment"
                      : jobDetails?.area_of_expertise}
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
                    {jobDetails?.verification ? "Verified Candidates Only " : "No"}
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
                    {jobDetails?.role}
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
                    {jobDetails?.years_of_experience === "any"
                      ? "Any Experience"
                      : jobDetails?.years_of_experience}
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
                    {jobDetails?.postcode}
                  </MDTypography>
                </div>
              </div>
            </div>
          )}
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
        {jobDetails?.length === 0 ? (
          <MDTypography variant="h6">Loading...</MDTypography>
        ) : (
          <>
            <MDTypography variant="h6" pb={3}>
              Job ID: {jobDetails?.id}
            </MDTypography>
            <Grid container direction="row" gap={3} justifyContent="space-between">
              <Grid
                item
                container
                direction="column"
                gap={2}
                style={{
                  maxWidth: "650px",
                }}
              >
                <Grid item>
                  <MDTypography
                    style={{
                      fontSize: "12px",
                      fontWeight: "400",
                      color: "#5F5F5F",
                      marginBottom: "5px",
                    }}
                  >
                    Role
                  </MDTypography>
                  <MDTypography
                    style={{
                      fontSize: "14px",
                      fontWeight: "400",
                      color: "#1C1C1C",
                    }}
                  >
                    {jobDetails?.role}
                  </MDTypography>
                </Grid>
                {typeof jobDetails?.job_description === "string" && (
                  <Grid item>
                    <MDTypography
                      style={{
                        fontSize: "12px",
                        fontWeight: "400",
                        color: "#5F5F5F",
                        marginBottom: "5px",
                      }}
                    >
                      Job Description
                    </MDTypography>
                    <MDTypography
                      style={{
                        fontSize: "14px",
                        fontWeight: "400",
                        color: "#1C1C1C",
                      }}
                    >
                      {jobDetails?.job_description}
                    </MDTypography>
                  </Grid>
                )}
                {typeof jobDetails?.job_description === "object" && (
                  <>
                    <Grid item>
                      <MDTypography
                        style={{
                          fontSize: "12px",
                          fontWeight: "400",
                          color: "#5F5F5F",
                          marginBottom: "5px",
                        }}
                      >
                        Location IE Restaurant Address
                      </MDTypography>
                      <MDTypography
                        style={{
                          fontSize: "14px",
                          fontWeight: "400",
                          color: "#1C1C1C",
                        }}
                      >
                        {jobDetails?.job_description.location}
                      </MDTypography>
                    </Grid>
                    <Grid item>
                      <MDTypography
                        style={{
                          fontSize: "12px",
                          fontWeight: "400",
                          color: "#5F5F5F",
                          marginBottom: "5px",
                        }}
                      >
                        Rate of Pay
                      </MDTypography>
                      <MDTypography
                        style={{
                          fontSize: "14px",
                          fontWeight: "400",
                          color: "#1C1C1C",
                        }}
                      >
                        {jobDetails?.job_description.rate_of_pay}£ per hours
                      </MDTypography>
                    </Grid>
                    <Grid item>
                      <MDTypography
                        style={{
                          fontSize: "12px",
                          fontWeight: "400",
                          color: "#5F5F5F",
                          marginBottom: "5px",
                        }}
                      >
                        Company Name
                      </MDTypography>
                      <MDTypography
                        style={{
                          fontSize: "14px",
                          fontWeight: "400",
                          color: "#1C1C1C",
                        }}
                      >
                        {jobDetails?.job_description.company_name}
                      </MDTypography>
                    </Grid>
                    <Grid item>
                      <MDTypography
                        style={{
                          fontSize: "12px",
                          fontWeight: "400",
                          color: "#5F5F5F",
                          marginBottom: "5px",
                        }}
                      >
                        Phone Number
                      </MDTypography>
                      <MDTypography
                        style={{
                          fontSize: "14px",
                          fontWeight: "400",
                          color: "#1C1C1C",
                        }}
                      >
                        {jobDetails?.job_description.contact_phone}
                      </MDTypography>
                    </Grid>
                    <Grid item>
                      <MDTypography
                        style={{
                          fontSize: "12px",
                          fontWeight: "400",
                          color: "#5F5F5F",
                          marginBottom: "5px",
                        }}
                      >
                        Email Address
                      </MDTypography>
                      <MDTypography
                        style={{
                          fontSize: "14px",
                          fontWeight: "400",
                          color: "#1C1C1C",
                        }}
                      >
                        {jobDetails?.job_description.contact_email}
                      </MDTypography>
                    </Grid>
                  </>
                )}
              </Grid>
              <Grid
                item
                container
                direction="column"
                gap={2}
                style={{
                  maxWidth: "650px",
                }}
              >
                <Grid item>
                  <MDTypography
                    style={{
                      fontSize: "12px",
                      fontWeight: "400",
                      color: "#5F5F5F",
                      marginBottom: "5px",
                    }}
                  >
                    Type of Establishment
                  </MDTypography>
                  <MDTypography
                    style={{
                      fontSize: "14px",
                      fontWeight: "400",
                      color: "#1C1C1C",
                    }}
                  >
                    {jobDetails?.area_of_expertise === "any"
                      ? "Any Type of Establishment"
                      : jobDetails?.area_of_expertise}
                  </MDTypography>
                </Grid>
                <Grid item>
                  <MDTypography
                    style={{
                      fontSize: "12px",
                      fontWeight: "400",
                      color: "#5F5F5F",
                      marginBottom: "5px",
                    }}
                  >
                    Postcode
                  </MDTypography>
                  <MDTypography
                    style={{
                      fontSize: "14px",
                      fontWeight: "400",
                      color: "#1C1C1C",
                    }}
                  >
                    {jobDetails?.postcode ? jobDetails?.postcode : "Not specified"}
                  </MDTypography>
                </Grid>
                <Grid item>
                  <MDTypography
                    style={{
                      fontSize: "12px",
                      fontWeight: "400",
                      color: "#5F5F5F",
                      marginBottom: "5px",
                    }}
                  >
                    Distance
                  </MDTypography>
                  <MDTypography
                    style={{
                      fontSize: "14px",
                      fontWeight: "400",
                      color: "#1C1C1C",
                    }}
                  >
                    {jobDetails?.distance ? `${jobDetails?.distance} km` : "Not specified"}
                  </MDTypography>
                </Grid>
                <Grid item>
                  <MDTypography
                    style={{
                      fontSize: "12px",
                      fontWeight: "400",
                      color: "#5F5F5F",
                      marginBottom: "5px",
                    }}
                  >
                    Verification
                  </MDTypography>
                  <MDTypography
                    style={{
                      fontSize: "14px",
                      fontWeight: "400",
                      color: "#1C1C1C",
                    }}
                  >
                    {jobDetails?.verification ? "Verified Candidates Only" : "All Candidates"}
                  </MDTypography>
                </Grid>
                {typeof jobDetails?.job_description === "object" && (
                  <>
                    <Grid item>
                      <MDTypography
                        style={{
                          fontSize: "12px",
                          fontWeight: "400",
                          color: "#5F5F5F",
                          marginBottom: "5px",
                        }}
                      >
                        Part Time Or Full Time
                      </MDTypography>
                      <MDTypography
                        style={{
                          fontSize: "14px",
                          fontWeight: "400",
                          color: "#1C1C1C",
                        }}
                      >
                        {jobDetails?.job_description.employment_type}
                      </MDTypography>
                    </Grid>
                    <Grid item>
                      <MDTypography
                        style={{
                          fontSize: "12px",
                          fontWeight: "400",
                          color: "#5F5F5F",
                          marginBottom: "5px",
                        }}
                      >
                        Contact Details Name
                      </MDTypography>
                      <MDTypography
                        style={{
                          fontSize: "14px",
                          fontWeight: "400",
                          color: "#1C1C1C",
                        }}
                      >
                        {jobDetails?.job_description.contact_name}
                      </MDTypography>
                    </Grid>
                  </>
                )}
              </Grid>
              <Grid
                item
                container
                direction="column"
                gap={2}
                style={{
                  maxWidth: "120px",
                  width: "100%",
                }}
              >
                <Grid item>
                  <MDTypography
                    style={{
                      fontSize: "12px",
                      fontWeight: "400",
                      color: "#5F5F5F",
                      marginBottom: "5px",
                    }}
                  >
                    Experience
                  </MDTypography>
                  <MDTypography
                    style={{
                      fontSize: "14px",
                      fontWeight: "400",
                      color: "#1C1C1C",
                    }}
                  >
                    {jobDetails?.years_of_experience === "any"
                      ? "Any Experience"
                      : jobDetails?.years_of_experience}
                  </MDTypography>
                </Grid>
                <Grid item>
                  <MDTypography
                    style={{
                      fontSize: "12px",
                      fontWeight: "400",
                      color: "#5F5F5F",
                      marginBottom: "5px",
                    }}
                  >
                    Status
                  </MDTypography>
                  <MDTypography
                    style={{
                      fontSize: "14px",
                      fontWeight: "400",
                      color: "#1C1C1C",
                      padding: "4px 10px",
                      borderRadius: "8px",
                      backgroundColor: jobDetails?.status ? "#E1FCDC" : "#FFEBE6",
                      maxWidth: "122px",
                      width: "fit-content",
                      textAlign: "center",
                      textTransform: "capitalize",
                    }}
                  >
                    {jobDetails?.status ? "Published" : "Not Published"}
                  </MDTypography>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}

        <Grid container justifyContent="flex-end" pt={2} gap={2}>
          <Button
            variant="outlined"
            style={{
              color: "#D32F2F",
              padding: "8px 22px",
              fontFamily: "Roboto, sans-serif",
              fontSize: "15px",
              fontWeight: "500",
              border: "none",
            }}
            onClick={handleOpen}
          >
            Remove job
          </Button>
          {jobDetails?.status ? (
            <Button
              style={{
                color: "#38B6FF",
                padding: "8px 22px",
                borderRadius: "4px",
                backgroundColor: "#fff",
                border: "1px solid #38B6FF",
                fontFamily: "Roboto, sans-serif",
                fontSize: "15px",
                fontWeight: "500",
                width: window.innerWidth > 500 ? "auto" : "100%",
              }}
              onClick={unPublishJob}
            >
              Unpublish
            </Button>
          ) : (
            <Button
              style={{
                color: "#fff",
                padding: "8px 22px",
                borderRadius: "4px",
                backgroundColor: "#38B6FF",
                border: "none",
                fontFamily: "Roboto, sans-serif",
                fontSize: "15px",
                fontWeight: "500",
                width: window.innerWidth > 500 ? "auto" : "100%",
              }}
              onClick={publishJob}
            >
              Publish
            </Button>
          )}
        </Grid>
      </MDBox>
      <MDBox
        style={{
          backgroundColor: "#fff",
          boxShadow:
            " 0px 4px 12px 4px rgba(38, 42, 63, 0.06), 0px 2px 4px -1px rgba(48, 57, 65, 0.16)",
          padding: isMobileSize ? "8px" : "16px 24px",
          borderRadius: "24px",
          width: "100%",
          position: "relative",
        }}
      >
        <MDTypography
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "#1C1C1C",
            paddingTop: isMobileSize ? "8px" : "0",
          }}
        >
          Candidates
        </MDTypography>
        <Grid container pt={3}>
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                  >
                    <TabStyled value={1}>Applied</TabStyled>
                    <TabStyled value={2}>Candidates matches</TabStyled>
                  </div>
                  <Button
                    xs="4"
                    variant="contained"
                    style={{
                      color: "#fff",
                      padding: isMobileSize ? "0px 12px" : "8px 22px",
                      borderRadius: "4px",
                      boxShadow:
                        "0px 3px 1px -2px rgba(0, 0, 0, 0.20), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
                      backgroundColor: "#38B6FF",
                      fontFamily: "Roboto, sans-serif",
                      fontSize: "15px",
                      fontWeight: "500",
                      maxHeight: "40px",
                      position: isMobileSize ? "absolute" : "relative",
                      right: isMobileSize ? "16px" : "0",
                      top: isMobileSize ? "16px" : "0",
                    }}
                    onClick={handleOpenModal}
                  >
                    Create Campaign
                  </Button>
                </div>
              </TabsList>

              <Grid container pt={2} style={{ width: "100%" }}>
                <TabPanel value={1} style={{ width: "100%" }}>
                  <CandidatesApplied
                    jobId={jobDetails?.id}
                    emptyState={emptyApply}
                    handleTabChange={handleTabChange}
                  />
                </TabPanel>
                <TabPanel value={2} style={{ width: "100%" }}>
                  {filters && Object.keys(filters).length > 0 && (
                    <CandidatesMatched
                      filters={filters}
                      emptyState={EmptyState}
                      handleTabChange={handleTabChange}
                    />
                  )}
                </TabPanel>
              </Grid>
            </TabsUnstyled>
          </Grid>
        </Grid>
      </MDBox>
      {isOpenModal && (
        <CreateCampaign
          isOpenModal={isOpenModal}
          handleCloseModal={handleCloseModal}
          candidateCount={totalCount}
          jobId={id}
        />
      )}
    </Grid>
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

export default JobDetails;
