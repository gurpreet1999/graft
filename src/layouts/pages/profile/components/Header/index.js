/* eslint-disable no-nested-ternary */
import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import verifiedIcon from "assets/images/icons/header/verified.svg";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import breakpoints from "assets/theme/base/breakpoints";
import { useSelector } from "react-redux";
import { userSelector } from "../../../../../store/user/selectors";
import { isCandidate } from "../../../../../helpers/user";

function Header({ children }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");

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

  const { user } = useSelector(userSelector);

  const userData = useMemo(
    () => ({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      verified: user?.verified || "",
      role: user?.role || "",
    }),
    [user]
  );

  const userIsCandidate = isCandidate(userData);

  useEffect(() => {
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    window.addEventListener("resize", handleTabsOrientation);
    handleTabsOrientation();
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  return (
    <MDBox position="relative">
      <Card
        sx={{
          position: "relative",
          mt: -8,
          mx: 0,
          py: 2,
          px: 2,
          width: { xs: "100%", sm: "100%", md: "100%", lg: "100%", xl: "100%" },
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div
            style={{
              position: "relative",
              width: pageWidth > 768 ? "100px" : "50px",
              height: pageWidth > 768 ? "100px" : "50px",
            }}
          >
            {userData.verified && userIsCandidate && (
              <MDBox
                component="img"
                src={verifiedIcon}
                alt="verified"
                width="16px"
                height="16px"
                style={{
                  padding: "0px",
                  marginLeft: "auto",
                  position: "absolute",
                  right: window.innerWidth < 768 ? "1px" : "10px",
                  top: window.innerWidth < 768 ? "2px" : "14px",
                  width: "16px",
                  height: "16px",
                }}
              />
            )}
            <AccountCircleRoundedIcon
              style={{
                width: "100%",
                height: "100%",
                color: "#000",
              }}
            />
          </div>
          <Grid item>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDTypography
                fontWeight="medium"
                style={{
                  fontWeight: 700,
                  fontSize: "16px",
                  lineHeight: "0.5",
                }}
              >
                {`${userData.first_name} ${userData.last_name}`}
              </MDTypography>
              <MDTypography
                variant="button"
                color="text"
                fontSize="14px"
                fontWeight="regular"
                lineHeight="0"
                style={{
                  color: !userData.verified ? "#5F5F5F" : "#38B6FF",
                }}
              >
                {!userData.verified ? "Candidate | Non-verified" : "Verified"}
              </MDTypography>
            </MDBox>
          </Grid>
        </div>
      </Card>
      {children}
    </MDBox>
  );
}

// Setting default props for the Header
Header.defaultProps = {
  children: "",
};

// Typechecking props for the Header
Header.propTypes = {
  children: PropTypes.node,
};

export default Header;
