import { useWindowSize } from "utilities/useWindowSize";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import JobsLayout from "./JobsLayout";
import JobDetails from "./components/JobDetails";

function Jobs() {
  const pageSize = useWindowSize({ marginDesktop: -6, marginMobile: 4 });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={pageSize} />
      <Routes>
        <Route path="*" element={<JobsLayout />} />
        <Route path="/job-details/:id" element={<JobDetails />} />
      </Routes>
    </DashboardLayout>
  );
}

export default Jobs;
