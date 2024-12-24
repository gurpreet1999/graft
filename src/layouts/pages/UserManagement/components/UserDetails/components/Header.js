/* eslint-disable no-nested-ternary */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import breakpoints from "assets/theme/base/breakpoints";

function Header({ children, user }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const width = window.innerWidth;
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
    <MDBox position="relative" mb={4}>
      <Card
        sx={{
          position: "relative",
          mt: -2,
          mx: 0,
          py: 2,
          px: 2,
          width: { xs: "100%", sm: "100%", md: "100%", lg: "100%", xl: "100%" },
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            {!user.avatar ? (
              <AccountCircleRoundedIcon
                style={{
                  width: "100px",
                  height: "100px",
                  color: "#000",
                }}
              />
            ) : (
              <img src={user.avatar} alt="user avatar" />
            )}
          </Grid>
          <Grid item>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDTypography
                variant={width < breakpoints.values.sm ? "h6" : "h5"}
                fontWeight="medium"
              >
                {user.first_name} {user.last_name}
              </MDTypography>
              <MDTypography variant="button" color="text" fontSize="14px" fontWeight="regular">
                {user && user.role.charAt(0).toUpperCase() + user.role.slice(1)} | {user.id}
              </MDTypography>
            </MDBox>
          </Grid>
        </Grid>
      </Card>
      {children}
    </MDBox>
  );
}

Header.propTypes = {
  children: PropTypes.node,
  user: PropTypes.shape({
    avatar: PropTypes.string,
    company_name: PropTypes.string,
    credits: PropTypes.number,
    email: PropTypes.string.isRequired,
    first_name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    phone_number: PropTypes.string,
    postal_code: PropTypes.string,
    postal_code_latitude: PropTypes.number,
    postal_code_longitude: PropTypes.number,
    pricing_plan: PropTypes.string,
    role: PropTypes.string.isRequired,
  }),
};

Header.defaultProps = {
  children: null,
  user: {
    avatar: "",
    company_name: "",
    credits: 0,
    phone_number: "",
    postal_code: "",
    postal_code_latitude: 0,
    postal_code_longitude: 0,
    pricing_plan: "",
  },
};

export default Header;
