/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import Grid from "@mui/material/Grid";
import clientsIcon from "assets/images/icons/dashboard-admin/clients.png";
import candidatesIcon from "assets/images/icons/dashboard-admin/candidates.png";
import campaignsIcon from "assets/images/icons/dashboard-admin/campaigns.png";
import chartIcon from "assets/images/icons/dashboard-admin/chart.png";
import DefaultLineChart from "examples/Charts/LineCharts/DefaultLineChart";
import { getUsersCount } from "../../../firebase/user";
import { getCampaignsCountForAdmin } from "../../../firebase/campaign";

const boxStyle = {
  padding: "16px 24px",
  width: "100%",
  minHeight: "143px",
  borderRadius: "24px",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  background: "#FFF",
  gap: "24px",
  position: "relative",
};

function InfoBox({ icon, title, value, additionalValue }) {
  return (
    <MDBox style={boxStyle}>
      <img
        src={icon}
        alt="billing"
        style={{
          position: "absolute",
          top: "-28px",
          left: "11px",
        }}
      />
      <Grid container direction="column" justifyContent="space-between" height="61px">
        <Grid item>
          <MDBox
            style={{
              fontSize: "16px",
              color: "#888",
              textAlign: "end",
              lineHeight: "1.5",
              fontWeight: "400",
            }}
          >
            {title}
          </MDBox>
          <MDBox
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#353F46",
              textAlign: "end",
              lineHeight: "1.3",
            }}
          >
            {value}
          </MDBox>
        </Grid>
      </Grid>
      {additionalValue && (
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          height="66px"
        >
          {additionalValue.map((item, index) => (
            <React.Fragment key={item}>
              <Grid
                item
                style={{
                  flex: "1 1 40%",
                  justifyContent: "flex-start",
                }}
              >
                <MDBox
                  style={{
                    fontSize: "14px",
                    color: "#888",
                    textAlign: "start",
                    lineHeight: "1.5",
                    fontWeight: "400",
                    maxWidth: "50px",
                  }}
                >
                  {item.title}
                </MDBox>
                <MDBox
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#353F46",
                    textAlign: "start",
                    lineHeight: "1.3",
                  }}
                >
                  {item.value}
                </MDBox>
              </Grid>
              {index < additionalValue.length - 1 && (
                <span style={{ margin: "0 16px", height: "44px" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="3"
                    height="44"
                    viewBox="0 0 3 44"
                    fill="none"
                  >
                    <path d="M1.5 1V43" stroke="#38B6FF" stroke-width="2" stroke-linecap="round" />
                  </svg>
                </span>
              )}
            </React.Fragment>
          ))}
        </Grid>
      )}
    </MDBox>
  );
}

export default function AdminDashboard() {
  const [pageSize, setPageSize] = useState(window.innerWidth);
  const [counts, setCounts] = useState({
    clients: 0,
    candidates: 0,
    candidatesHospitality: 0,
    candidatesConstruction: 0,
    campaigns: 0,
    campaignsHospitality: 0,
    campaignsConstruction: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const [
        clientsCount,
        candidatesCountHospitality,
        candidatesCountConstruction,
        campaignsCountHospitality,
        campaignsCountConstruction,
      ] = await Promise.all([
        getUsersCount({ role: "recruiter" }),
        getUsersCount({ role: "candidate", filters: { sector: "Hospitality" } }),
        getUsersCount({ role: "candidate", filters: { sector: "Construction" } }),
        getCampaignsCountForAdmin({ sector: "Hospitality" }),
        getCampaignsCountForAdmin({ sector: "Construction" }),
      ]);

      setCounts({
        clients: clientsCount,
        candidates: candidatesCountHospitality + candidatesCountConstruction,
        candidatesHospitality: candidatesCountHospitality,
        candidatesConstruction: candidatesCountConstruction,
        campaigns: campaignsCountHospitality + campaignsCountConstruction,
        campaignsHospitality: campaignsCountHospitality,
        campaignsConstruction: campaignsCountConstruction,
      });
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setPageSize(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={pageSize < 1200 ? 6 : -2} />
      <Grid container direction="column" xs={12} gap="40px">
        <div
          style={{
            display: "flex",
            gap: "24px",
            flexDirection: pageSize < 845 ? "column" : "row",
          }}
        >
          <InfoBox icon={clientsIcon} title="Clients" value={counts.clients} />
          <InfoBox
            icon={candidatesIcon}
            title="Candidates"
            value={counts.candidates}
            additionalValue={[
              {
                title: "Candidates hospitality",
                value: counts.candidatesHospitality,
              },
              {
                title: "Candidates construction",
                value: counts.candidatesConstruction,
              },
            ]}
          />
          <InfoBox
            icon={campaignsIcon}
            title="Campaigns"
            value={counts.campaigns}
            additionalValue={[
              {
                title: "Hospitality",
                value: counts.campaignsHospitality,
              },
              {
                title: "Construction",
                value: counts.campaignsConstruction,
              },
            ]}
          />
        </div>
        <div
          style={{
            display: "none",
          }}
        >
          <DefaultLineChart
            icon={chartIcon}
            title="Line chart"
            description="Revenue historical change"
            chart={{
              labels: [
                "Dec",
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
              datasets: [
                {
                  label: "Direct",
                  color: "info",
                  data: [
                    1000, 700, 2600, 1500, 3000, 5000, 2000, 5300, 3200, 2100, 4300, 3300, 6000,
                  ],
                },
              ],
            }}
          />
        </div>
      </Grid>
    </DashboardLayout>
  );
}

InfoBox.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  additionalValue: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ),
};

InfoBox.defaultProps = {
  additionalValue: null,
};
