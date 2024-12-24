/* eslint-disable import/no-extraneous-dependencies */
import MDTypography from "components/MDTypography";
import React, { useEffect, useState, useCallback } from "react";
import Grid from "@mui/material/Grid";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import EmptyState from "assets/images/empty-campaign.png";
import { styled } from "@mui/system";
import TabsUnstyled from "@mui/base/TabsUnstyled/TabsUnstyled";
import TabsList from "@mui/base/TabsListUnstyled/TabsListUnstyled";
import TabPanel from "@mui/base/TabPanelUnstyled/TabPanelUnstyled";
import Tab from "@mui/base/TabUnstyled/TabUnstyled";
import tabUnstyledClasses from "@mui/base/TabUnstyled/tabUnstyledClasses";
import { useRecruiterCampaigns } from "../../../../../firebase/hooks/useRecruiterCampaigns";

const boxStyle = {
  width: "100%",
  height: "100%",
  backgroundColor: "white",
  borderRadius: "24px",
  boxShadow: "0px 4px 12px 4px rgba(38, 42, 63, 0.06), 0px 2px 4px -1px rgba(48, 57, 65, 0.16)",
};

const hospitalityColumns = [
  { Header: "№", accessor: "id", width: "8%" },
  { Header: "Role", accessor: "role", width: "23%" },
  { Header: "Type of Establishment", accessor: "expertise", width: "23%" },
  { Header: "Experience", accessor: "experience", width: "8%" },
  { Header: "Postcode", accessor: "postcode", width: "8%" },
  { Header: "Distance", accessor: "distance", width: "8%" },
  { Header: "Number of candidates", accessor: "candidates", width: "14%" },
  { Header: "Action", accessor: "actionDetailsCamapign", width: "8%" },
];

const constructionColumns = [
  { Header: "№", accessor: "id", width: "8%" },
  { Header: "Role", accessor: "role", width: "23%" },
  { Header: "Card Type", accessor: "expertise", width: "23%" },
  { Header: "Experience", accessor: "experience", width: "8%" },
  { Header: "Postcode", accessor: "postcode", width: "8%" },
  { Header: "Distance", accessor: "distance", width: "8%" },
  { Header: "Number of candidates", accessor: "candidates", width: "14%" },
  { Header: "Action", accessor: "actionDetailsCamapign", width: "8%" },
];

function CampaignHistoryList() {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isMobileSize, setIsMobileSize] = useState(window.innerWidth < 768);
  const [sector, setSector] = useState("Hospitality");
  const { campaigns, loading, getCampaigns, nextPage, prevPage, totalCount, pages, currentPage } =
    useRecruiterCampaigns();

  useEffect(() => {
    getCampaigns({ limitPerPage: rowsPerPage, filters: { sector } });
  }, [rowsPerPage, sector]);

  const handleTabChange = useCallback(
    (event, newValue) => {
      setSector(newValue === 1 ? "Hospitality" : "Construction");
    },
    [setSector]
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobileSize(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNextPage = useCallback(async () => {
    await nextPage({ limitPerPage: rowsPerPage, filters: { sector } });
  }, [rowsPerPage, currentPage, pages, nextPage]);

  const handlePrevPage = useCallback(async () => {
    await prevPage({ limitPerPage: rowsPerPage, filters: { sector } });
  }, [rowsPerPage, currentPage, pages, prevPage]);

  const handleChangeRowsPerPage = useCallback(async (numberOfRows) => {
    setRowsPerPage(numberOfRows);
  }, []);

  const formatCampaigns = campaigns?.map((campaign) => ({
    id: campaign.id.substring(0, 5),
    role: campaign.filters.role,
    expertise: campaign.filters.area_of_expertise,
    experience: campaign.filters.years_of_experience,
    postcode: campaign.postcode || "N/A",
    distance: campaign.filters.distance || "N/A",
    candidates: campaign.amount_of_candidates || "0",
    actionDetailsCamapign: campaign.id,
  }));

  return (
    <MDBox style={{ ...boxStyle, padding: isMobileSize ? "8px" : "24px" }}>
      <Grid container justifyContent="space-between" pb={isMobileSize ? 2 : 3}>
        <MDTypography
          style={{
            fontWeight: "700",
            fontSize: "16px",
            color: "#353F46",
          }}
        >
          Campaign History
        </MDTypography>
      </Grid>
      <MDBox>
        <TabsUnstyled
          defaultValue={1}
          onChange={handleTabChange}
          style={{
            width: "100%",
          }}
        >
          <TabsList
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              paddingBottom: "16px",
            }}
          >
            <TabStyled value={1}>Hospitality</TabStyled>
            <TabStyled value={2}>Construction</TabStyled>
          </TabsList>
          {loading && <MDBox>Loading...</MDBox>}
          {!loading && (!formatCampaigns || formatCampaigns.length === 0) && (
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                paddingBottom: "50px",
              }}
            >
              <img
                src={EmptyState}
                alt="Empty State"
                style={{ maxWidth: "100%", margin: "0 auto", height: "auto" }}
              />
            </div>
          )}
          {!loading && formatCampaigns && formatCampaigns.length > 0 && (
            <>
              <TabPanel value={1} style={{ width: "100%" }}>
                <DataTable
                  pages={pages}
                  entriesPerPage={rowsPerPage}
                  currentPage={currentPage}
                  nextPage={handleNextPage}
                  prevPage={handlePrevPage}
                  showTotalEntries={totalCount}
                  handleChangeRowsPerPage={handleChangeRowsPerPage}
                  table={{
                    columns: hospitalityColumns,
                    rows: formatCampaigns,
                  }}
                  type="campaigns"
                />
              </TabPanel>
              <TabPanel value={2} style={{ width: "100%" }}>
                <DataTable
                  pages={pages}
                  entriesPerPage={rowsPerPage}
                  currentPage={currentPage}
                  nextPage={handleNextPage}
                  prevPage={handlePrevPage}
                  showTotalEntries={totalCount}
                  handleChangeRowsPerPage={handleChangeRowsPerPage}
                  table={{
                    columns: constructionColumns,
                    rows: formatCampaigns,
                  }}
                  type="campaigns"
                />
              </TabPanel>
            </>
          )}
        </TabsUnstyled>
      </MDBox>
    </MDBox>
  );
}

const TabStyled = styled(Tab)`
  font-family: "Roboto", sans-serif;
  color: #f5f5f;
  cursor: pointer;
  font-weight: 500;
  background-color: transparent;
  width: fit-content;
  padding: 9px 16px 7px 16px;
  display: flex;
  justify-content: center;
  border: none;
  background: none;
  color: inherit;
  border: none;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  font-size: 14px;
  text-transform: UpperCase;

  &:hover {
    border-bottom: 2px solid #07a0c3;
    color: #07a0c3;
  }

  &:focus {
    color: #07a0c3;
    border-bottom: 2px solid #07a0c3;
  }

  &.${tabUnstyledClasses.selected} {
    border-bottom: 2px solid #07a0c3;
    color: #07a0c3;
  }
`;

export default CampaignHistoryList;
