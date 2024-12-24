/* eslint-disable import/extensions */
/* eslint-disable import/named */
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Header from "layouts/pages/profile/components/Header";
import BasicInfo from "layouts/pages/account/settings/components/BasicInfo";
import Verification from "layouts/pages/account/settings/components/Verification";
import ChangePassword from "layouts/pages/account/settings/components/ChangePassword";
import { useWindowSize } from "utilities/useWindowSize";

function Overview() {
  const pageSize = useWindowSize({ marginDesktop: 3, marginMobile: 12 });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={pageSize} />
      <Header>
        <MDBox mt={3}>
          <Grid>
            <BasicInfo />
          </Grid>
        </MDBox>
        <MDBox mt={3}>
          <Grid>
            <Verification />
          </Grid>
        </MDBox>
        <MDBox mt={3}>
          <Grid>
            <ChangePassword />
          </Grid>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
