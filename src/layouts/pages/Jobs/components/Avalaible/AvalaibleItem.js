import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import MDTypography from "components/MDTypography";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import avatar from "assets/images/jobs/def_user.jpeg";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function AvalaibleItem({ job }) {
  const [pageWidth, setPageWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setPageWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const renderJobDescription = () => {
    if (typeof job?.job_description === "object") {
      const jobDescription = job.job_description;

      const {
        company_name: companyName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        employment_type: employmentType,
        rate_of_pay: rateOfPay,
        contact_name: contactName,
      } = jobDescription;

      return `Company: ${companyName}, Email: ${contactEmail}, Phone: ${contactPhone}, Employment Type: ${employmentType}, Salary: ${rateOfPay}, Recruiter Name: ${contactName}`;
    }

    return job.job_description;
  };

  return (
    <Grid
      item
      container
      direction="row"
      justifyContent="space-between"
      px={3}
      py={2}
      gap={2}
      style={{
        border: "1px solid #DCE7ED",
        borderRadius: "12px",
      }}
    >
      <Grid
        item
        container
        style={{
          maxWidth: "540px",
        }}
      >
        <Grid item container direction="row" gap={2}>
          <MDTypography
            style={{
              fontSize: "28px",
              fontWeight: "600",
              lineHeight: "1.4",
              color: "#353F46",
            }}
          >
            {job.role}
          </MDTypography>
          <div
            style={{
              fontSize: "16px",
              fontWeight: "600",
              lineHeight: "1.4",
              color: "#578E44",
              padding: "4px 10px",
              backgroundColor: "#E1FCDC",
              maxWidth: "62px",
              maxHeight: "30px",
              borderRadius: "8px",
            }}
          >
            NEW
          </div>
        </Grid>
        <Grid item container direction="row" gap={1}>
          <MDTypography
            style={{
              fontSize: "16px",
              fontWeight: "400",
              lineHeight: "1.5",
              color: "#1C1C1C",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "fit-content",
            }}
          >
            <BusinessIcon style={{ color: "#AAC2D0" }} /> {job.area_of_expertise}
          </MDTypography>
          <span
            style={{
              color: "#E9E9E9",
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              backgroundColor: "#E9E9E9",
              marginTop: "10px",
            }}
          />
          <MDTypography
            style={{
              fontSize: "16px",
              fontWeight: "400",
              lineHeight: "1.5",
              color: "#1C1C1C",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "fit-content",
            }}
          >
            <WorkIcon style={{ color: "#AAC2D0" }} /> {job.years_of_experience}
          </MDTypography>
          <span
            style={{
              color: "#E9E9E9",
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              backgroundColor: "#E9E9E9",
              marginTop: "10px",
            }}
          />
          <MDTypography
            style={{
              fontSize: "16px",
              fontWeight: "400",
              lineHeight: "1.5",
              color: "#1C1C1C",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "fit-content",
            }}
          >
            <LocationOnIcon style={{ color: "#AAC2D0" }} />
            <span style={{ color: "#888" }}> {job.postcode ? `(${job.postcode})` : "N/A"}</span>
          </MDTypography>
          <span
            style={{
              color: "#E9E9E9",
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              backgroundColor: "#E9E9E9",
              marginTop: "10px",
            }}
          />
          <MDTypography
            style={{
              fontSize: "16px",
              fontWeight: "400",
              lineHeight: "1.5",
              color: "#1C1C1C",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "fit-content",
            }}
          >
            <CheckCircleIcon style={{ color: "#38B6FF" }} />{" "}
            {job.verification ? "Verified Candidates Only" : "All Candidates"}
          </MDTypography>
        </Grid>
        <Grid>
          <MDTypography
            style={{
              fontSize: "14px",
              fontWeight: "400",
              lineHeight: "1.5",
              color: "#5F5F5F",
              overflow: "hidden",
              textOverflow: "ellipsis",
              height: "54px",
              lineClamp: "2",
              paddingTop: "12px",
            }}
          >
            {renderJobDescription()}
          </MDTypography>
        </Grid>
      </Grid>
      <div
        style={{
          display: "flex",
          flexDirection: pageWidth < 768 ? "row" : "column",
          gap: "8px",
          alignItems: pageWidth < 768 ? "center" : "flex-end",
          marginLeft: pageWidth < 864 && "auto",
        }}
      >
        <div
          style={{
            maxWidth: "147px",
          }}
        >
          <Grid
            item
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            gap="8px"
            width="fit-content"
            wrap="nowrap"
          >
            <img
              src={avatar}
              alt="human avatar"
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
              }}
            />
            <MDTypography
              style={{
                fontSize: "14px",
                fontWeight: "400",
                lineHeight: "1.5",
                color: "#5F5F5F",
                whiteSpace: "nowrap",
              }}
            >
              {job.job_description.company_name ?? job.job_description}
            </MDTypography>
          </Grid>
        </div>
        <Link
          className="MuiButton-root"
          to={`job-details/${job.id}`}
          variant="contained"
          style={{
            color: "#fff",
            padding: "8px 22px",
            borderRadius: "4px",
            boxShadow:
              "0px 3px 1px -2px rgba(0, 0, 0, 0.20), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
            backgroundColor: "#38B6FF",
            fontFamily: "Roboto, sans-serif",
            fontSize: "15px",
            fontWeight: "500",
            width: "100%",
            maxWidth: "147px",
            textTransform: "uppercase",
          }}
        >
          View details
        </Link>
      </div>
    </Grid>
  );
}

AvalaibleItem.propTypes = {
  job: PropTypes.shape({
    role: PropTypes.string,
    area_of_expertise: PropTypes.string,
    years_of_experience: PropTypes.string,
    postcode: PropTypes.string,
    verification: PropTypes.bool,
    job_description: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        company_name: PropTypes.string,
        location: PropTypes.string,
        rate_of_pay: PropTypes.number,
        employment_type: PropTypes.string,
        contact_name: PropTypes.string,
        contact_email: PropTypes.string,
        contact_phone: PropTypes.string,
      }),
    ]),
    id: PropTypes.string,
  }).isRequired,
};

export default AvalaibleItem;
