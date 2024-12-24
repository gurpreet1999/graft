import React, { useState, useMemo, useEffect, useCallback } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";
import SearchIcon from "assets/images/icons/search/header.png";
import Autocomplete from "@mui/material/Autocomplete";
import FormField from "layouts/pages/account/components/FormField";
import {
  allRolesDropdown,
  yearsOfExperience as years,
  establishments,
  constructionRoles,
  cscsCardTypes,
} from "constants/experience";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import PropTypes from "prop-types";
import { removeEmptyValues } from "utilities/helpers";
import Result from "../result";
import CreateCampaign from "../create-campaign";
import { useSearchCandidates } from "../../../../firebase/hooks/useSearchCandidates";
import SnackBar from "../../../authentication/components/SnackBar/SnackBar";

const MAX_SNACK_MESSAGES = 4;

const getRole = (role) => {
  if (role !== undefined) {
    return role.label;
  }
  return "";
};

export function SearchFlow({ sector }) {
  const formattedYears = ["Any", ...years];
  const formattedEstablishments = ["Any Establishment Type", ...establishments];
  const [formData, setFormData] = useState({
    role: "",
    establishmentType: "",
    yearsOfExperience: "",
    postcode: "",
    distance: "",
    verified: false,
    constructionRole: "",
    constructionCardType: "",
    sector,
  });

  const filters = useMemo(
    () =>
      removeEmptyValues({
        role: getRole(formData.role),
        establishmentType:
          formData.establishmentType === "Any Establishment Type"
            ? "any"
            : formData.establishmentType,
        yearsOfExperience:
          formData.yearsOfExperience === "Any" ? "any" : formData.yearsOfExperience,
        verified: formData.verified,
        constructionRole: formData.constructionRole,
        constructionCardType: formData.constructionCardType,
        sector,
        postalCode: formData.postcode,
        distance: formData.distance,
      }),
    [formData]
  );

  const [pageSize, setPageSize] = useState(window.innerWidth);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showResult, setShowResult] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [snackMessages, setSnackMessages] = useState([]);
  const handleCloseSnack = (index) => {
    setSnackMessages((prevMessages) => prevMessages.filter((_, i) => i !== index));
  };

  const {
    candidates,
    pages,
    totalCount,
    currentPage,
    nextPage,
    prevPage,
    loading,
    searchCandidates,
  } = useSearchCandidates();

  const handleOpenModal = useCallback(() => {
    setIsOpenModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  const handleSearchCandidates = useCallback(async () => {
    if (
      sector === "Hospitality" &&
      snackMessages.length < MAX_SNACK_MESSAGES &&
      (!formData.role || !formData.establishmentType || !formData.yearsOfExperience)
    ) {
      if (snackMessages.length < MAX_SNACK_MESSAGES) {
        setSnackMessages((prevMessages) => [
          ...prevMessages,
          "Role, type of establishment and years of experience are required",
        ]);
      }
      return;
    }
    if (
      sector === "Construction" &&
      snackMessages.length < MAX_SNACK_MESSAGES &&
      (!formData.constructionRole || !formData.constructionCardType || !formData.yearsOfExperience)
    ) {
      setSnackMessages((prevMessages) => [
        ...prevMessages,
        "Role, Card Type and years of experience are required",
      ]);
      return;
    }

    await searchCandidates({ filters, limitPerPage: rowsPerPage });
    setShowResult(true);
  }, [filters, rowsPerPage, isOpenModal, searchCandidates]);

  const handleNextPage = useCallback(async () => {
    if (currentPage === pages) return;

    await nextPage({ filters, limitPerPage: rowsPerPage });
  }, [filters, rowsPerPage, currentPage, pages, nextPage]);

  const handlePrevPage = useCallback(async () => {
    if (currentPage === 1) return;

    await prevPage({ filters, limitPerPage: rowsPerPage });
  }, [filters, rowsPerPage, currentPage, pages, prevPage]);

  const handleChangeRowsPerPage = useCallback(
    async (numberOfRows) => {
      setRowsPerPage(numberOfRows);
      await searchCandidates({ filters, limitPerPage: numberOfRows });
    },
    [filters, searchCandidates]
  );

  useEffect(() => {
    const handleResize = () => {
      setPageSize(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleChange = (e, key, newValue) => {
    setFormData({
      ...formData,
      [key]: newValue || e.target.value,
    });
  };

  const dropdownData = useMemo(
    () =>
      allRolesDropdown.flatMap((group) =>
        group.options.map((option) => ({
          header: group.header,
          ...option,
        }))
      ),
    [allRolesDropdown]
  );

  return (
    <MDBox pt={4}>
      <MDBox
        style={{
          backgroundColor: "white",
          padding: "16px 24px",
          boxShadow:
            "0px 4px 12px 4px rgba(38, 42, 63, 0.06), 0px 2px 4px -1px rgba(48, 57, 65, 0.16)",
          borderRadius: "24px",
        }}
      >
        <Grid container direction="column" gap={2}>
          <Grid item container direction="row" gap={2}>
            <div style={{ position: "relative", width: "64px" }}>
              <img
                src={SearchIcon}
                alt="search icon"
                style={{
                  position: "absolute",
                  left: "0",
                  bottom: "0",
                  width: "64px",
                  height: "64px",
                }}
              />
            </div>
            <MDTypography variant="h6">Search Candidates ({sector})</MDTypography>
          </Grid>
          <Grid item container direction="row" gap={2}>
            {sector === "Construction" ? (
              <Grid item xs={pageSize < 1200 ? 12 : 5.2} pr={1}>
                <Autocomplete
                  value={formData.constructionRole}
                  onChange={(e, newValue) => handleChange(e, "constructionRole", newValue)}
                  options={constructionRoles}
                  renderInput={(params) => (
                    <FormField
                      {...params}
                      label="Role*"
                      placeholder="Select role"
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Grid>
            ) : (
              <Grid item xs={pageSize < 1200 ? 12 : 5.2} pr={1}>
                <Autocomplete
                  value={getRole(formData.role)}
                  onChange={(e, newValue) => handleChange(e, "role", newValue)}
                  options={dropdownData}
                  getOptionLabel={(option) => option.label}
                  groupBy={(option) => option.header}
                  renderInput={(params) => (
                    <FormField
                      {...params}
                      label="Role*"
                      placeholder="Select role"
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Grid>
            )}
            {sector === "Construction" ? (
              <Grid item xs={pageSize < 1200 ? 12 : 5.2} pr={1}>
                <Autocomplete
                  value={formData.constructionCardType}
                  onChange={(e, newValue) => handleChange(e, "constructionCardType", newValue)}
                  options={cscsCardTypes}
                  renderInput={(params) => (
                    <FormField
                      {...params}
                      label="Card Type*"
                      placeholder="Select card type"
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Grid>
            ) : (
              <Grid item xs={pageSize < 1200 ? 12 : 5.2} pr={1}>
                <Autocomplete
                  value={formData.establishmentType}
                  onChange={(e, newValue) => handleChange(e, "establishmentType", newValue)}
                  options={formattedEstablishments}
                  renderInput={(params) => (
                    <FormField
                      {...params}
                      label="Type Of Establishment*"
                      placeholder="Select type of establishment"
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Grid>
            )}
            <Grid item xs={pageSize < 1200 ? 12 : 1.2} pr={1}>
              <Autocomplete
                value={formData.yearsOfExperience}
                onChange={(e, newValue) => handleChange(e, "yearsOfExperience", newValue)}
                options={formattedYears}
                renderInput={(params) => (
                  <FormField
                    {...params}
                    label="Experience*"
                    placeholder="Select"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid item container direction="row" pb={3} gap={2}>
            <Grid item xs={pageSize < 1200 ? 10 : 5.2} pr={1}>
              <FormField
                label="Postcode"
                value={formData.postcode}
                placeholder="Enter postcode"
                onChange={(e) => handleChange(e, "postcode")}
              />
            </Grid>
            <Grid item xs={pageSize < 1200 ? 10 : 6.52} pr={1}>
              <FormField
                label="Distance (km)"
                value={formData.distance}
                type="number"
                placeholder="Enter distance in km"
                onChange={(e) => handleChange(e, "distance")}
              />
            </Grid>
            <Grid item container direction="row" alignItems="center">
              <Checkbox
                size="small"
                checked={formData.verified}
                onChange={() => {
                  setFormData({
                    ...formData,
                    verified: !formData.verified,
                  });
                }}
                label="Verified Candidates Only"
              />
              <MDTypography
                style={{
                  fontFamily: "Roboto, sans-serif",
                  fontSize: "14px",
                  fontWeight: "400",
                  color: "#5F5F5F",
                  paddingTop: "3px",
                }}
              >
                Verified Candidates Only
              </MDTypography>
            </Grid>
          </Grid>
          <Grid item container direction="row" justifyContent="flex-end" gap={2}>
            <Button
              variant="contained"
              style={{
                color: "#38B6FF",
                padding: "8px 22px",
                borderRadius: "4px",
                boxShadow:
                  "0px 3px 1px -2px rgba(0, 0, 0, 0.20), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
                backgroundColor: "#fff",
                border: "1px solid #38B6FF",
                fontFamily: "Roboto, sans-serif",
                fontSize: "15px",
                fontWeight: "500",
              }}
              onClick={handleOpenModal}
            >
              Create Campaign
            </Button>
            <Button
              variant="outlined"
              style={{
                color: "#fff",
                padding: "8px 22px",
                borderRadius: "4px",
                boxShadow:
                  "0px 3px 1px -2px rgba(0, 0, 0, 0.20), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
                backgroundColor: "#38B6FF",
                fontFamily: "Roboto, sans-serif",
                fontSize: "15px",
                fontWeight: "500",
              }}
              onClick={handleSearchCandidates}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </MDBox>
      {showResult && (
        <Result
          showTotalEntries={totalCount}
          currentPage={currentPage}
          pages={pages}
          nextPage={handleNextPage}
          prevPage={handlePrevPage}
          candidates={candidates}
          rowsPerPage={rowsPerPage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          loading={loading}
          sector={sector}
        />
      )}
      {isOpenModal && (
        <CreateCampaign
          isOpenModal={isOpenModal}
          handleCloseModal={handleCloseModal}
          candidateCount={totalCount}
          filters={filters}
        />
      )}
      <SnackBar errorMessages={snackMessages} handleCloseSnack={handleCloseSnack} />
    </MDBox>
  );
}

SearchFlow.propTypes = {
  sector: PropTypes.string.isRequired,
};
