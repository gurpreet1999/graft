/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import { filters as filterConstants } from "constants/filters";
import Autocomplete from "@mui/material/Autocomplete";
import FormField from "layouts/pages/account/components/FormField";
import { styled } from "@mui/system";
import TabsUnstyled from "@mui/base/TabsUnstyled/TabsUnstyled";
import TabsList from "@mui/base/TabsListUnstyled/TabsListUnstyled";
import Tab from "@mui/base/TabUnstyled/TabUnstyled";
import tabUnstyledClasses from "@mui/base/TabUnstyled/tabUnstyledClasses";
import MDTypography from "components/MDTypography";
import Button from "@mui/material/Button";
import DataTable from "examples/Tables/DataTable";
import { formatPlan } from "utilities/helpers";
import EmptyState from "../../../../../assets/images/empty-users.png";
import searchIcon from "../../../../../assets/images/icons/search/searchIcon.svg";
import filterIcon from "../../../../../assets/images/icons/search/filterIcon.svg";
import closeFiltersIcon from "../../../../../assets/images/icons/search/closeFiltersIcon.svg";
import AddNewAdmin from "./AddNewAdmin/AddNewAdmin";
import { useGetUsers } from "../../../../../firebase/hooks/useGetUsers";
import SuspendUser from "../SuspendUser";

const getColumns = (usersRole) => {
  if (usersRole === "candidate") {
    return [
      { Header: "№", accessor: "id", width: "10%" },
      { Header: "Full Name", accessor: "namewithimg", width: "17%" },
      { Header: "Email", accessor: "email", width: "17%" },
      { Header: "Mobile Number", accessor: "phone", width: "17%" },
      { Header: "Postcode", accessor: "postalCode", width: "12%" },
      { Header: "Verified", accessor: "verified", width: "8%" },
      { Header: "documents Provided", accessor: "documentsProvided", width: "8%" },
      { Header: "Action", accessor: "actionMoreDeleteUser", width: "8%" },
    ];
  }
  if (usersRole === "admin") {
    return [
      { Header: "№", accessor: "id", width: "10%" },
      { Header: "Full Name", accessor: "namewithimg", width: "18%" },
      { Header: "Email", accessor: "email", width: "18%" },
      { Header: "Action", accessor: "actionMoreDeleteUser", width: "8%" },
    ];
  }
  return [
    { Header: "№", accessor: "id", width: "10%" },
    { Header: "Full Name", accessor: "namewithimg", width: "16%" },
    { Header: "Email", accessor: "email", width: "16%" },
    { Header: "Mobile Number", accessor: "phone", width: "16%" },
    { Header: "Credits", accessor: "credits", width: "8%" },
    { Header: "Pricing Plan", accessor: "pricing", width: "8%" },
    { Header: "Action", accessor: "actionMoreDeleteUser", width: "8%" },
  ];
};

function Layout() {
  const [openFilters, setOpenFilters] = useState(false);
  const [filtersData, setFiltersData] = useState({
    credits: "",
    plan: "",
    status: "",
  });
  const [open, setOpen] = useState(false);
  const [openSuspend, setOpenSuspend] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentTab, setCurrentTab] = useState(1);
  const [filters, setFilters] = useState({
    limitPerPage: 10,
    searchValue: "",
    sector: "",
  });
  const [role, setRole] = useState("recruiter");
  const [isMobileSize, setIsMobileSize] = useState(window.innerWidth < 768);
  const [suspendedUserId, setSuspendedUserId] = useState();
  const {
    users: fetchedUsers,
    loading,
    getUsers,
    nextPage,
    prevPage,
    totalCount,
    pages,
    currentPage,
  } = useGetUsers();

  useEffect(() => {
    setFiltersData({ status: "", plan: "", credits: "" });
    setFilters({ ...filters, searchValue: "", sector: "" });

    if (currentTab === 1) {
      setRole("recruiter");
    }
    if (currentTab === 2) {
      setRole("candidate");
    }
    if (currentTab === 3) {
      setRole("admin");
    }
  }, [currentTab]);

  useEffect(() => {
    getUsers({ role, filters, filtersData });
  }, [role, filters, filtersData]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setFilters((prev) => ({ ...prev, searchValue: value }));
    }, 100),
    []
  );
  useEffect(() => {
    if (JSON.stringify(users) !== JSON.stringify(fetchedUsers)) {
      setUsers(fetchedUsers);
    }
  }, [fetchedUsers]);

  const handleNextPage = useCallback(async () => {
    if (currentPage === pages) return;
    await nextPage({ role, filters, filtersData });
  }, [users, filters, currentPage, pages, nextPage]);

  const handlePrevPage = useCallback(async () => {
    if (currentPage === 1) return;
    await prevPage({ role, filters, filtersData });
  }, [users, filters, filtersData, currentPage, pages, prevPage]);

  const handleChange = useCallback((e, key, value) => {
    setFiltersData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleChangeRowsPerPage = useCallback(
    async (numberOfRows) => {
      setFilters((prev) => ({ ...prev, limitPerPage: numberOfRows }));
    },
    [users]
  );

  const handleClose = () => setOpen(false);

  const handleSuspendUser = useCallback((id) => {
    setSuspendedUserId(id);
    setOpenSuspend(true);
  }, []);

  const handleCloseSuspendUser = () => setOpenSuspend(false);

  useEffect(() => {
    function handleResize() {
      setIsMobileSize(window.innerWidth < 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formattedUsers = users.map((user) => ({
    id: user.id,
    namewithimg: {
      img: user.img,
      name: `${user.first_name} ${user.last_name}`,
    },
    email: user.email,
    phone: user.phone_number,
    credits: user.credits,
    pricing: user.pricing_plan && formatPlan(user.pricing_plan),
    postalCode: user.postal_code,
    verified: user.verified,
    documentsProvided:
      typeof user.personal_document === "object" &&
      typeof user.sector_experience_document === "object",
    actionMoreDeleteUser: user.id,
  }));

  return (
    <>
      <MDBox
        sx={{
          backgroundColor: "#fff",
          boxShadow:
            "0px 4px 12px 4px rgba(38, 42, 63, 0.06), 0px 2px 4px -1px rgba(48, 57, 65, 0.16)",
          padding: isMobileSize ? "8px 12px" : "16px 24px",
          borderRadius: "24px",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: isMobileSize ? "flex-start" : "center",
            flexDirection: isMobileSize ? "column" : "row",
          }}
        >
          <MDTypography
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: "#353F46",
              paddingTop: isMobileSize ? "12px" : "0",
              flexWrap: "wrap",
              width: "140px",
            }}
          >
            User management
          </MDTypography>
        </div>
        <Grid container pt={3}>
          <Grid
            item
            style={{
              width: "100%",
            }}
          >
            <TabsUnstyled
              defaultValue={1}
              onChange={(event, newValue) => {
                setCurrentTab(newValue);
              }}
              style={{
                width: "100%",
              }}
            >
              <TabsList
                style={{
                  display: "flex",
                  flexDirection: window.innerWidth > 768 ? "row" : "column",
                  width: "100%",
                  justifyContent: "space-between",
                  height: "fit-content",
                  gap: "16px",
                }}
              >
                <MDBox
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <TabStyled value={1}>Clients</TabStyled>
                  <TabStyled value={2}>Candidates</TabStyled>
                  <TabStyled value={3}>Admins</TabStyled>
                </MDBox>
                {currentTab !== 3 && (
                  <MDBox
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "24px",
                    }}
                  >
                    <Button
                      onClick={() => setOpenFilters(!openFilters)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                        gap: "8px",
                        border: "1px solid #38B6FF",
                        color: "#38B6FF",
                        borderRadius: "8px",
                        fontSize: isMobileSize ? "12px" : "14px",
                      }}
                    >
                      <img src={openFilters ? closeFiltersIcon : filterIcon} alt="filter" />
                      <span>FILTERS</span>
                    </Button>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                        maxWidth: "281px",
                        width: "100%",
                        padding: "8px 16px",
                        gap: "12px",
                        border: "1px solid #DCE7ED",
                        borderRadius: "8px",
                      }}
                    >
                      <img
                        src={searchIcon}
                        alt="search"
                        style={{ width: "24px", height: "24px" }}
                      />
                      <input
                        placeholder="Search by email"
                        value={filters.searchValue}
                        onChange={(e) => debouncedSearch(e.target.value)}
                        style={{
                          width: "100%",
                          outline: "none",
                          border: "none",
                          maxWidth: "221px",
                          fontSize: isMobileSize ? "12px" : "14px",
                          fontWeight: "500",
                          color: "$888",
                        }}
                      />
                    </div>
                  </MDBox>
                )}
                {currentTab === 3 && (
                  <Button
                    type="submit"
                    onClick={() => setOpen(!open)}
                    variant="contained"
                    style={{
                      color: "#fff",
                      padding: isMobileSize ? "2px 8px" : "8px 22px",
                      borderRadius: "4px",
                      boxShadow:
                        "0px 3px 1px -2px rgba(0, 0, 0, 0.20), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
                      backgroundColor: "#38B6FF",
                      fontFamily: "Roboto, sans-serif",
                      fontSize: isMobileSize ? "12px" : "15px",
                      fontWeight: "500",
                      position: isMobileSize ? "absolute" : "relative",
                      top: isMobileSize ? "16px" : "0",
                      right: isMobileSize ? "8px" : "0",
                    }}
                  >
                    Add new Admin
                  </Button>
                )}
              </TabsList>
              {currentTab === 2 && (
                <Grid
                  direction="row"
                  gap="12px"
                  pt={2}
                  style={{
                    display: "flex",
                  }}
                >
                  <Button
                    onClick={() => setFilters({ ...filters, sector: "Hospitality" })}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "row",
                      gap: "8px",
                      border: "1px solid #38B6FF",
                      color: filters.sector === "Hospitality" ? "#fff" : "#38B6FF",
                      borderRadius: "8px",
                      fontSize: isMobileSize ? "12px" : "14px",
                      padding: "4px 10px",
                      backgroundColor:
                        filters.sector === "Hospitality" ? "rgb(7, 160, 195)" : "transparent",
                    }}
                  >
                    Hospitality
                  </Button>
                  <Button
                    onClick={() => setFilters({ ...filters, sector: "Construction" })}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "row",
                      gap: "8px",
                      border: "1px solid #38B6FF",
                      color: filters.sector === "Construction" ? "#fff" : "#38B6FF",
                      borderRadius: "8px",
                      fontSize: isMobileSize ? "12px" : "14px",
                      padding: "4px 10px",
                      backgroundColor:
                        filters.sector === "Construction" ? "rgb(7, 160, 195)" : "transparent",
                    }}
                  >
                    Construction
                  </Button>
                </Grid>
              )}
              {openFilters && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: isMobileSize ? "row-reverse" : "row",
                    justifyContent: isMobileSize && "flex-end",
                    gap: "16px",
                    padding: "16px 0",
                  }}
                >
                  {currentTab === 1 && (
                    <>
                      <Autocomplete
                        value={filtersData.credits}
                        onChange={(e, newValue) => handleChange(e, "credits", newValue)}
                        options={filterConstants.credits}
                        style={{
                          width: "260px",
                        }}
                        renderInput={(params) => (
                          <FormField
                            {...params}
                            label="Credits"
                            placeholder="Value"
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                      <Autocomplete
                        value={filtersData.plan}
                        onChange={(e, newValue) => handleChange(e, "plan", newValue)}
                        options={filterConstants.plan}
                        style={{
                          width: "260px",
                        }}
                        renderInput={(params) => (
                          <FormField
                            {...params}
                            label="Pricing plan"
                            placeholder="Value"
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </>
                  )}
                  {currentTab === 2 && (
                    <Autocomplete
                      value={filtersData.status}
                      onChange={(e, newValue) => handleChange(e, "status", newValue)}
                      options={filterConstants.status}
                      style={{
                        width: "260px",
                      }}
                      renderInput={(params) => (
                        <FormField
                          {...params}
                          label="Status"
                          placeholder="Value"
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  )}
                </div>
              )}
              {loading ? (
                <MDBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="100%"
                  height="100%"
                  minHeight="700px"
                >
                  <MDTypography
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#353F46",
                    }}
                  >
                    Loading...
                  </MDTypography>
                </MDBox>
              ) : (
                <Grid container style={{ width: "100%", paddingTop: "16px" }}>
                  {users.length === 0 ? (
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
                        alt="te"
                        style={{ maxWidth: "100%", margin: "0 auto", height: "auto" }}
                      />
                    </div>
                  ) : (
                    <DataTable
                      style={{
                        width: "100%",
                      }}
                      pages={pages}
                      entriesPerPage={filters.limitPerPage}
                      currentPage={currentPage}
                      nextPage={handleNextPage}
                      prevPage={handlePrevPage}
                      showTotalEntries={totalCount}
                      handleChangeRowsPerPage={handleChangeRowsPerPage}
                      handleSuspendUser={handleSuspendUser}
                      table={{
                        columns: getColumns(role),
                        rows: formattedUsers,
                      }}
                      type={`users${currentTab}`}
                    />
                  )}
                </Grid>
              )}
            </TabsUnstyled>
          </Grid>
        </Grid>
      </MDBox>
      <AddNewAdmin show={open} handleClose={handleClose} />
      <SuspendUser
        isOpenModal={openSuspend}
        handleCloseModal={handleCloseSuspendUser}
        uid={suspendedUserId}
      />
    </>
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

export default Layout;
