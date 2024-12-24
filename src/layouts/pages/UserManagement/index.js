import { Routes, Route } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import { useWindowSize } from "utilities/useWindowSize";
import Layout from "./components/UserList/Layout";
import UserDetails from "./components/UserDetails";

function UserManagement() {
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
      />
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/user-details/:userId" element={<UserDetails />} />
      </Routes>
      <Footer />
    </DashboardLayout>
  );
}

export default UserManagement;
