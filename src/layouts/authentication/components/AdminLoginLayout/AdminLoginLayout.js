/* eslint-disable react/prop-types */
// prop-types is a library for typechecking of props

// @mui material components
import Grid from "@mui/material/Grid";

// Otis Admin PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Otis Admin PRO React example components
// import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import PageLayout from "examples/LayoutContainers/PageLayout";

// Otis Admin PRO React page layout routes
// import pageRoutes from "page.routes";

import logo from "../../../../assets/images/illustrations/LogoCraft.svg";

function AdminLoginLayout({ children }) {
  return (
    <PageLayout>
      <Grid container sx={{ background: "linear-gradient(180deg, #46545B 0%, #000 100%)" }}>
        <Grid item xs={11} sm={8} md={6} lg={4} xl={3} sx={{ mx: "auto" }}>
          <MDBox
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="center"
            height="100vh"
            padding="24px 0"
          >
            <a href="https://www.onthegraft.co.uk/">
              <img src={logo} alt="logo" style={{ width: "178px" }} />
            </a>
            <MDBox
              display="flex"
              flexDirection="column"
              justifyContent="center"
              height="100%"
              width="100%"
              maxWidth="608px"
            >
              <MDBox p={3} bgColor="white" borderRadius="12px">
                <MDBox mb="24px" mt="24px" textAlign="center">
                  <MDTypography variant="h2" fontWeight="bold">
                    Log in
                  </MDTypography>
                </MDBox>
                {children}
              </MDBox>
            </MDBox>
          </MDBox>
        </Grid>
      </Grid>
    </PageLayout>
  );
}

export default AdminLoginLayout;
