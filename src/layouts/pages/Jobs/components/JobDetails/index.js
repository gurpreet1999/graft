import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import Button from "@mui/material/Button";
import CheckIcon from "@mui/icons-material/Check";

import CustomSnackbar from "../../../../../components/Snackbar";

import { userSelector } from "../../../../../store/user/selectors";
import { getJobById } from "../../../../../firebase/job";

import { applyToJob, isAppliedToJob, unApplyJob } from "../../../../../firebase/job-application";

const getJobStatus = (status) => {
  if (status) {
    return (
      <MDTypography
        style={{
          fontSize: "14px",
          fontWeight: "400",
          color: "#1C1C1C",
          padding: "4px 10px",
          borderRadius: "8px",
          backgroundColor: "#E1FCDC",
          maxWidth: "68px",
        }}
      >
        Opened
      </MDTypography>
    );
  }
  return (
    <MDTypography
      style={{
        fontSize: "14px",
        fontWeight: "400",
        color: "#1C1C1C",
        padding: "4px 10px",
        borderRadius: "8px",
        backgroundColor: "#E1FCDC",
        maxWidth: "68px",
      }}
    >
      Closed
    </MDTypography>
  );
};

function AvalaibleItem() {
  const { user } = useSelector(userSelector);

  const [isApplied, setIsApplied] = useState(false);
  const [job, setJob] = useState(null);
  const [jobApplication, setJobApplication] = useState(null);
  const { id } = useParams();

  const [snackbar, setSnackbar] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      const jobData = await getJobById(id);
      setJob(jobData);
    };
    fetchJob();
  }, [id]);

  useEffect(() => {
    const isAppliedFetch = async () => {
      const isAppl = await isAppliedToJob(id, user.id);
      if (isAppl.id) {
        setIsApplied(true);
        setJobApplication(isAppl);
      }
    };
    isAppliedFetch();
  }, [id, user]);

  const handleApplyToJob = async () => {
    try {
      const appliedJob = await applyToJob({ jobId: id, currentUser: user });
      if (appliedJob.id) {
        setIsApplied(!isApplied);
        setJobApplication(appliedJob);
      }
    } catch (error) {
      setSnackbar(<CustomSnackbar messages={[{ type: "error", text: error.message }]} />);
    }
  };

  const handleUnApply = async () => {
    try {
      await unApplyJob({ jobApplication });
      setIsApplied(false);
    } catch (error) {
      setSnackbar(<CustomSnackbar messages={[{ type: "error", text: error.message }]} />);
    }
  };

  return (
    <>
      <MDBox
        px={3}
        py={2}
        style={{
          backgroundColor: "#fff",
          borderRadius: "24px",
          boxShadow:
            "0px 4px 12px 4px rgba(38, 42, 63, 0.06), 0px 2px 4px -1px rgba(48, 57, 65, 0.16)",
        }}
      >
        <MDTypography
          style={{
            fontSize: "16px",
            fontWeight: "700",
            marginBottom: "16px",
            color: "#353F46",
          }}
        >
          {job?.role}
        </MDTypography>
        <Grid container direction="row" gap={3} justifyContent="space-between">
          <Grid
            item
            container
            direction="column"
            gap={2}
            style={{
              maxWidth: "750px",
            }}
          >
            <Grid item>
              <MDTypography
                style={{
                  fontSize: "12px",
                  fontWeight: "400",
                  color: "rgba(0, 0, 0, 0.60)",
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
                {job?.role}
              </MDTypography>
            </Grid>
            {typeof job?.job_description === "object" && (
              <>
                <Grid item>
                  <MDTypography
                    style={{
                      fontSize: "12px",
                      fontWeight: "400",
                      color: "rgba(0, 0, 0, 0.60)",
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
                    {job?.job_description.company_name}
                  </MDTypography>
                </Grid>
                <Grid item>
                  <MDTypography
                    style={{
                      fontSize: "12px",
                      fontWeight: "400",
                      color: "rgba(0, 0, 0, 0.60)",
                      marginBottom: "5px",
                    }}
                  >
                    Recruiter Name
                  </MDTypography>
                  <MDTypography
                    style={{
                      fontSize: "14px",
                      fontWeight: "400",
                      color: "#1C1C1C",
                    }}
                  >
                    {job?.job_description.contact_name}
                  </MDTypography>
                </Grid>
                <Grid item>
                  <MDTypography
                    style={{
                      fontSize: "12px",
                      fontWeight: "400",
                      color: "rgba(0, 0, 0, 0.60)",
                      marginBottom: "5px",
                    }}
                  >
                    Contact Phone
                  </MDTypography>
                  <MDTypography
                    style={{
                      fontSize: "14px",
                      fontWeight: "400",
                      color: "#1C1C1C",
                    }}
                  >
                    {job?.job_description.contact_phone}
                  </MDTypography>
                </Grid>
              </>
            )}
            {typeof job?.job_description === "string" && (
              <Grid item>
                <MDTypography
                  style={{
                    fontSize: "12px",
                    fontWeight: "400",
                    color: "rgba(0, 0, 0, 0.60)",
                    marginBottom: "5px",
                  }}
                >
                  Description
                </MDTypography>
                <MDTypography
                  style={{
                    fontSize: "14px",
                    fontWeight: "400",
                    color: "#1C1C1C",
                  }}
                >
                  {job?.job_description}
                </MDTypography>
              </Grid>
            )}
          </Grid>
          <Grid
            item
            container
            direction="column"
            gap={2}
            style={{
              maxWidth: "250px",
            }}
          >
            <Grid item>
              <MDTypography
                style={{
                  fontSize: "12px",
                  fontWeight: "400",
                  color: "rgba(0, 0, 0, 0.60)",
                  marginBottom: "5px",
                }}
              >
                Area of Expertise
              </MDTypography>
              <MDTypography
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  color: "#1C1C1C",
                }}
              >
                {job?.area_of_expertise === "any" ? "Any" : job?.area_of_expertise}
              </MDTypography>
            </Grid>
            <Grid item>
              <MDTypography
                style={{
                  fontSize: "12px",
                  fontWeight: "400",
                  color: "rgba(0, 0, 0, 0.60)",
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
                {job?.postcode ? job?.postcode : "N/A"}
              </MDTypography>
            </Grid>
            {typeof job?.job_description === "object" && (
              <Grid item>
                <MDTypography
                  style={{
                    fontSize: "12px",
                    fontWeight: "400",
                    color: "rgba(0, 0, 0, 0.60)",
                    marginBottom: "5px",
                  }}
                >
                  Location
                </MDTypography>
                <MDTypography
                  style={{
                    fontSize: "14px",
                    fontWeight: "400",
                    color: "#1C1C1C",
                  }}
                >
                  {job?.job_description.location}
                </MDTypography>
              </Grid>
            )}
            <Grid item>
              <MDTypography
                style={{
                  fontSize: "12px",
                  fontWeight: "400",
                  color: "rgba(0, 0, 0, 0.60)",
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
                {job?.verification ? "Verified Candidates Only" : "All Candidates"}
              </MDTypography>
            </Grid>
          </Grid>
          <Grid
            item
            container
            direction="column"
            gap={2}
            style={{
              maxWidth: "250px",
              width: "fit-content",
            }}
          >
            <Grid item>
              <MDTypography
                style={{
                  fontSize: "12px",
                  fontWeight: "400",
                  color: "rgba(0, 0, 0, 0.60)",
                  marginBottom: "5px",
                }}
              >
                Years experience
              </MDTypography>
              <MDTypography
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  color: "#1C1C1C",
                }}
              >
                {job?.years_of_experience === "any" ? "Any" : job?.years_of_experience}
              </MDTypography>
            </Grid>
            {typeof job?.job_description === "object" && (
              <Grid item>
                <MDTypography
                  style={{
                    fontSize: "12px",
                    fontWeight: "400",
                    color: "rgba(0, 0, 0, 0.60)",
                    marginBottom: "5px",
                  }}
                >
                  Salary
                </MDTypography>
                <MDTypography
                  style={{
                    fontSize: "14px",
                    fontWeight: "400",
                    color: "#1C1C1C",
                  }}
                >
                  {job?.job_description.rate_of_pay}£ per hours
                </MDTypography>
              </Grid>
            )}
            <Grid item>
              <MDTypography
                style={{
                  fontSize: "12px",
                  fontWeight: "400",
                  color: "rgba(0, 0, 0, 0.60)",
                  marginBottom: "5px",
                }}
              >
                Status
              </MDTypography>
              {getJobStatus(job?.status)}
            </Grid>
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-end" pt={2}>
          {isApplied ? (
            <>
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
                onClick={handleUnApply}
              >
                Unapply
              </Button>
              <Button
                variant="contained"
                disabled
                style={{
                  color: "#38B6FF",
                  padding: "8px 22px",
                  borderRadius: "4px",
                  border: "1px solid #38B6FF",
                  backgroundColor: "#fff",
                  fontFamily: "Roboto, sans-serif",
                  fontSize: "15px",
                  fontWeight: "500",
                }}
              >
                <CheckIcon style={{ color: "#38B6FF" }} /> Applied
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              onClick={handleApplyToJob}
              style={{
                color: "#fff",
                padding: "8px 22px",
                borderRadius: "4px",
                backgroundColor: "#38B6FF",
                fontFamily: "Roboto, sans-serif",
                fontSize: "15px",
                fontWeight: "500",
                width: window.innerWidth > 500 ? "auto" : "100%",
              }}
            >
              Apply for a job
            </Button>
          )}
        </Grid>
      </MDBox>
      {snackbar}
    </>
  );
}

export default AvalaibleItem;
