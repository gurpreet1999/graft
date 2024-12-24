import { useWindowSize } from "utilities/useWindowSize";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Routes, Route } from "react-router-dom";
import CampaignHistoryDetails from "./components/CampaignHistoryDetails";
import CampaignHistoryList from "./components/CampaignHistoryList";

export default function CampaignHistory() {
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
          <Route path="/" element={<CampaignHistoryList />} />
          <Route path="/campaign-details/:id" element={<CampaignHistoryDetails />} />
        </Routes>
      </MDBox>
    </DashboardLayout>
  );
}
