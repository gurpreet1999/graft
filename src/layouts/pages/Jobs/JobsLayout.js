/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import { styled } from "@mui/system";
import TabsUnstyled from "@mui/base/TabsUnstyled/TabsUnstyled";
import TabsList from "@mui/base/TabsListUnstyled/TabsListUnstyled";
import TabPanel from "@mui/base/TabPanelUnstyled/TabPanelUnstyled";
import Tab from "@mui/base/TabUnstyled/TabUnstyled";
import tabUnstyledClasses from "@mui/base/TabUnstyled/tabUnstyledClasses";
import MDTypography from "components/MDTypography";
import Avalaible from "./components/Avalaible";
import Applied from "./components/Applied";

function JobsLayout() {
  return (
    <MDBox
      style={{
        backgroundColor: "#fff",
        boxShadow:
          " 0px 4px 12px 4px rgba(38, 42, 63, 0.06), 0px 2px 4px -1px rgba(48, 57, 65, 0.16)",
        padding: window.innerWidth < 768 ? "8px" : "16px 24px",
        borderRadius: "24px",
      }}
    >
      <MDTypography
        style={{
          fontSize: "16px",
          fontWeight: "bold",
          color: "#353F46",
        }}
      >
        Listed Jobs
      </MDTypography>
      <Grid container pt={3}>
        <Grid
          item
          style={{
            width: "100%",
          }}
        >
          <TabsUnstyled
            defaultValue={1}
            style={{
              width: "100%",
            }}
          >
            <TabsList
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <TabStyled value={1}>Available Jobs</TabStyled>
              <TabStyled value={2}>Applied Jobs</TabStyled>
            </TabsList>
            <Grid container pt={2} style={{ width: "100%" }}>
              <TabPanel value={1} style={{ width: "100%" }}>
                <Avalaible />
              </TabPanel>
              <TabPanel value={2} style={{ width: "100%" }}>
                <Applied />
              </TabPanel>
            </Grid>
          </TabsUnstyled>
        </Grid>
      </Grid>
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
export default JobsLayout;
