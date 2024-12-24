import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import breakpoints from "assets/theme/base/breakpoints";
import { useSelector } from "react-redux";
import { userSelector } from "store/user/selectors";

function Header({ children }) {
  const { user } = useSelector(userSelector);
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

  const [tabsOrientation, setTabsOrientation] = useState("horizontal");

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
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Grid
              item
              style={{
                width: pageWidth > 768 ? "100px" : "50px",
                height: pageWidth > 768 ? "100px" : "50px",
              }}
            >
              <AccountCircleRoundedIcon
                style={{
                  width: pageWidth > 768 ? "100px" : "50px",
                  height: pageWidth > 768 ? "100px" : "50px",
                  color: "#000",
                }}
              />
            </Grid>
          </Grid>
          <Grid item>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDTypography
                style={{
                  fontWeight: 700,
                  fontSize: "16px",
                  lineHeight: "0.5",
                }}
                fontWeight="medium"
              >
                {user?.first_name} {user?.last_name}
              </MDTypography>
              <MDTypography
                variant="button"
                color="text"
                fontSize="14px"
                fontWeight="regular"
                lineHeight="0"
              >
                Recruiter
              </MDTypography>
            </MDBox>
          </Grid>
          {/* <Grid item xs={12} md={6} lg={4} sx={{ ml: "auto" }}>
            <AppBar position="static">
              <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                <Tab
                  label="App"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      home
                    </Icon>
                  }
                />
                <Tab
                  label="Message"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      email
                    </Icon>
                  }
                />
                <Tab
                  label="Settings"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      settings
                    </Icon>
                  }
                />
              </Tabs>
            </AppBar>
          </Grid> */}
        </Grid>
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
