import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import Button from "@mui/material/Button";
import strype from "assets/images/Billing/stripe.png";
import { getCampaignDetails } from "../../../../../firebase/campaign";
import { reRunSMSCampaign } from "../../../../../firebase/backend/sms-campaign";

const textStyle = {
  fontSize: "12px",
  fontWeight: "400",
  color: "#5F5F5F",
  marginBottom: "5px",
};

function CampaignDetailItem({ title, value }) {
  if (value === "Stripe") {
    return (
      <Grid item>
        <MDTypography style={textStyle}>{title}</MDTypography>
        <MDBox
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "8px",
          }}
        >
          <img src={strype} alt="stripe" style={{ width: "22px" }} />
          <div style={{ fontSize: "14px", fontWeight: "400", color: "#353F46" }}>{value}</div>
        </MDBox>
      </Grid>
    );
  }
  return (
    <Grid item>
      <MDTypography style={textStyle}>{title}</MDTypography>
      <MDTypography
        style={{
          fontSize: "14px",
          fontWeight: "400",
          color: "#353F46",
        }}
      >
        {value}
      </MDTypography>
    </Grid>
  );
}

export default function CampaignHistoryDetails() {
  const { id } = useParams();
  const [details, setDetails] = useState({});
  const nav = useNavigate();

  const repeatCampaign = () => {
    reRunSMSCampaign(id).then(() => {
      nav("/campaign-history");
    });
  };

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      const data = await getCampaignDetails(id);
      setDetails(data);
    };

    fetchCampaignDetails();
  }, [id]);

  return (
    <Grid container direction="column" gap={3}>
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
        <MDTypography variant="h6" pb={3}>
          Campaign {details?.id}
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
            <CampaignDetailItem title="Role" value={details?.filters?.role} />
            <CampaignDetailItem
              title="Distance"
              value={details?.filters?.distance ? `${details?.filters?.distance} km` : "N/A"}
            />
            <CampaignDetailItem
              title="Number of Candidates"
              value={details?.amount_of_candidates}
            />
            <CampaignDetailItem title="Contact method" value="SMS" />
            <CampaignDetailItem title="Message for Candidates" value={details?.message} />
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
            <CampaignDetailItem
              title="Area of Expertise"
              value={
                details?.filters?.area_of_expertise === "any"
                  ? "Any"
                  : details?.filters?.area_of_expertise
              }
            />
            <CampaignDetailItem title="Postcode" value={details?.filters?.postcode || "N/A"} />
            <CampaignDetailItem title="Payment method" value="Stripe" />
            <CampaignDetailItem title="Total Cost" value={`${details?.credits_spent} Credits`} />
            <CampaignDetailItem
              title="Verification"
              value={details?.verification ? "Verified Candidates Only" : "Unverified Candidates"}
            />
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
            <CampaignDetailItem title="Experience" value={details?.filters?.years_of_experience} />
          </Grid>
        </Grid>

        <Grid container justifyContent="flex-end" pt={2} gap={2}>
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
              cursor: "pointer",
            }}
            onClick={() => nav("/campaign-history")}
          >
            Back to List
          </Button>
          <Button
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
            onClick={repeatCampaign}
          >
            Repeat Campaign
          </Button>
        </Grid>
      </MDBox>
    </Grid>
  );
}

CampaignDetailItem.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};
