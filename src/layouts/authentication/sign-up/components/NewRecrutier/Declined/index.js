/* eslint-disable react/no-unescaped-entities */
import * as React from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import IllustrationLayout from "layouts/authentication/components/IllustrationLayout";
import bgImage from "assets/images/illustrations/Illustration-auth.png";
import logo from "assets/images/illustrations/LogoCraft.svg";
import declinedIcon from "assets/images/declined.png";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

function Declined() {
  const nav = useNavigate();
  const handleUpgradeNow = () => {
    nav("billing");
  };

  const handleUpdatePaymentInfo = () => {
    nav("billing", { state: { step: 1, isUpdate: true } });
  };

  return (
    <IllustrationLayout
      logo={window.innerHeight > 1047 ? logo : null}
      illustration={bgImage}
      isHiddenText
    >
      <Card sx={{ height: "100%", boxShadow: "unset" }}>
        <MDBox>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "24px",
              textAlign: "center",
            }}
          >
            <img src={declinedIcon} alt="icon" style={{ width: "100%", maxWidth: "339px" }} />
            <h1
              style={{
                fontSize: "32px",
                lineHeight: "40px",
                textAlign: "center",
                color: "#1C1C1C",
              }}
            >
              Payment Declined
            </h1>
            <span
              style={{
                color: "#5F5F5F",
                fontSize: "16px",
                textAlign: "center",
                lineHeight: "24px",
              }}
            >
              Oops! It looks like there was an issue processing your payment for accessing this
              platform feature after your free trial. Please update your payment information to
              continue using this feature or contact support for assistance.
            </span>
            <Button
              onClick={handleUpdatePaymentInfo}
              sx={{
                width: "286px",
                color: "#fff !important",
                backgroundColor: "#38B6FF !important",
                fontSize: "15px",
                padding: "8px 0",
                borderRadius: "4px",
                textTransform: "uppercase",
                fontWeight: "500",
              }}
            >
              Update payment information
            </Button>
            <Button
              onClick={handleUpgradeNow}
              sx={{
                width: "286px",
                color: "#38B6FF !important",
                backgroundColor: "#fff !important",
                fontSize: "15px",
                padding: "8px 0",
                borderRadius: "4px",
                textTransform: "uppercase",
                fontWeight: "500",
              }}
            >
              Update Plan
            </Button>
          </div>
        </MDBox>
      </Card>
    </IllustrationLayout>
  );
}

export default Declined;
