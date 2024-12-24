/* eslint-disable react/no-unescaped-entities */
import * as React from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import IllustrationLayout from "layouts/authentication/components/IllustrationLayout";
import bgImage from "assets/images/illustrations/Illustration-auth.png";
import logo from "assets/images/illustrations/LogoCraft.svg";
import upgradeIcon from "assets/images/upgrade.png";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function GetAccess() {
  const nav = useNavigate();
  const handleUpgradeNow = () => {
    nav("payment");
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
            <img src={upgradeIcon} alt="icon" style={{ width: "100%", maxWidth: "339px" }} />
            <h1
              style={{
                fontSize: "32px",
                lineHeight: "40px",
                textAlign: "center",
                color: "#1C1C1C",
              }}
            >
              Upgrade to Get Access <br /> to the Platform
            </h1>
            <span
              style={{
                color: "#5F5F5F",
                fontSize: "16px",
                textAlign: "center",
                lineHeight: "24px",
              }}
            >
              We'd like to offer you an upgrade to one of our plans, which includes additional
              features. This would allow you to take full advantage of our services and make your
              experience even more seamless.
            </span>
            <Button
              onClick={handleUpgradeNow}
              sx={{
                width: "164px",
                color: "#fff",
                backgroundColor: "#38B6FF",
                fontSize: "15px",
                padding: "8px 22px",
                borderRadius: "4px",
                textTransform: "uppercase",
              }}
            >
              Upgrade now
            </Button>
          </div>
        </MDBox>
      </Card>
    </IllustrationLayout>
  );
}

export default GetAccess;
