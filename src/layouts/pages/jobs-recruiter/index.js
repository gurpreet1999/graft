import { useWindowSize } from "utilities/useWindowSize";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Routes, Route } from "react-router-dom";
import JobCreate from "./components/JobCreate";
import JobDetails from "./components/JobDetails";
import JobsList from "./components/JobsList";

export default function JobsRecruiter() {
  const pageSize = useWindowSize({ marginDesktop: -6, marginMobile: 4 });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox
        mt={pageSize}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <Routes>
          <Route path="/*" element={<JobsList />} />
          <Route path="/job-details/:id" element={<JobDetails />} />
          <Route path="/add-new-job" element={<JobCreate />} />
        </Routes>
      </MDBox>
    </DashboardLayout>
  );
}
