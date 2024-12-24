import React from "react";
import { useWindowSize } from "utilities/useWindowSize";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SmallBilling from "./components/SmallBilling";
import SmallInvoices from "./components/SmallInvoices";
import SmallJobs from "./components/SmallJobs";

export default function DashboardRecruiter() {
  const pageSize = useWindowSize({ marginDesktop: -4, marginMobile: 6 });

  const gridItemStyle = {
    maxWidth: "508px",
    width: "100%",
    minHeight: "374px",
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={pageSize} />
      <Grid container direction="row" gap={window.innerWidth < 768 ? 4 : 3}>
        <Grid item style={gridItemStyle}>
          <SmallBilling />
        </Grid>
        <Grid item style={gridItemStyle}>
          <SmallInvoices />
        </Grid>
        <Grid item style={gridItemStyle}>
          <SmallJobs />
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
