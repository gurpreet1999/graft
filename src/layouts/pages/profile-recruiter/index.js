import BasicInfo from "layouts/pages/account/settings/components/BasicInfoRecruiter";
import ChangePassword from "layouts/pages/account/settings/components/ChangePassword";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import Grid from "@mui/material/Grid";
import { useWindowSize } from "utilities/useWindowSize";
import Header from "./components/Header";
import Billing from "../account/settings/components/Billing";

function ProfileRecriuter() {
  const pageSize = useWindowSize({ marginDesktop: 2, marginMobile: 12 });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={pageSize} />
      <Header>
        <MDBox mt={window.innerWidth < 768 ? 2 : 3}>
          <Grid>
            <BasicInfo />
          </Grid>
        </MDBox>
        <MDBox mt={window.innerWidth < 768 ? 2 : 3}>
          <Grid>
            <Billing />
          </Grid>
        </MDBox>
        <MDBox mt={window.innerWidth < 768 ? 2 : 3}>
          <Grid>
            <ChangePassword />
          </Grid>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default ProfileRecriuter;
