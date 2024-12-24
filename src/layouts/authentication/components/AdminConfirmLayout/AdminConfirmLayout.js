/* eslint-disable react/prop-types */
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import PageLayout from "examples/LayoutContainers/PageLayout";
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
            width="100%"
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
              width={{ xs: "350px", md: "608px" }}
            >
              <MDBox
                px={{ xs: 2, sm: 2, md: 12 }}
                py={{ xs: 4, sm: 4, md: 6 }}
                width="100%"
                bgColor="white"
                borderRadius="12px"
              >
                <MDBox textAlign="center">
                  <MDTypography
                    style={{
                      fontSize: "32px",
                      fontWeight: 700,
                      color: "#1C1C1C",
                      fontFamily: "Montserrat",
                    }}
                  >
                    Welcome!
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
