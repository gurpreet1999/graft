import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";
import createIcon from "assets/images/icons/jobs/create-job.png";
import Autocomplete from "@mui/material/Autocomplete";
import { removeEmptyValues } from "utilities/helpers";
import FormField from "layouts/pages/account/components/FormField";
import {
  allRolesDropdown,
  yearsOfExperience as years,
  establishments,
  constructionRoles,
  cscsCardTypes,
} from "constants/experience";
import { hospitalityEmploymentTypes, constructionEmploymentTypes } from "constants/job";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import { useSelector } from "react-redux";
import { userSelector } from "store/user/selectors";
import MDBox from "components/MDBox";
import PropTypes from "prop-types";
import SnackBar from "../../../../../authentication/components/SnackBar/SnackBar";
import { postJobAsRecruiter } from "../../../../../../firebase/job";

const validateDescription = (description) => {
  const emptyKeys = [];
  Object.entries(description).forEach(([key, value]) => {
    if (value === "") {
      emptyKeys.push(key);
    }
  });
  if (emptyKeys.length > 0) {
    return `${emptyKeys.join(", ")} are required`;
  }
  return null;
};
const validateJobFields = (object, sector) => {
  if (sector === "Construction" && (!object.role || !object.constructionCardType)) {
    return "Role and Card Type are required";
  }
  if (
    sector === "Hospitality" &&
    (!object.role || !object.establishmentType || !object.yearsOfExperience)
  ) {
    return "Role, type of establishment and years of experience are required";
  }
  return null;
};

const getRole = (role) => {
  if (role !== undefined) {
    if (typeof role === "object") return role;
    if (typeof role === "string") return role;
  }
  return "";
};

export default function JobCreateFlow({ sector }) {
  const formattedYears = ["Any", ...years];
  const formattedEstablishments = ["Any Establishment Type", ...establishments];
  const { user } = useSelector(userSelector);
  const nav = useNavigate();
  const [pageSize, setPageSize] = useState(window.innerWidth);
  const [snackMessages, setSnackMessages] = useState([]);
  const maxSnackMessages = 4;
  const handleCloseSnack = (index) => {
    setSnackMessages((prevMessages) => prevMessages.filter((_, i) => i !== index));
  };
  const [cursorPosition, setCursorPosition] = useState(0);
  const [formData, setFormData] = useState({
    role: "",
    establishmentType: "",
    yearsOfExperience: "",
    postcode: "",
    distance: "",
    constructionCardType: "",
    immediate: false,
    verified: false,
    sector,
  });
  const [description, setDescription] = useState({
    location: "",
    employment_type: "",
    rate_of_pay: "",
    contact_name: user?.first_name,
    contact_phone: user?.phone_number,
    company_name: user?.company_name,
    contact_email: user?.email,
  });
  const jobDetails = useMemo(
    () =>
      removeEmptyValues({
        role: getRole(formData.role),
        area_of_expertise:
          formData.establishmentType === "Any Establishment Type"
            ? "any"
            : formData.establishmentType || formData.constructionCardType,
        years_of_experience:
          formData.yearsOfExperience === "Any" ? "any" : formData.yearsOfExperience,
        verification: formData.verified,
        ...(formData.postcode !== "" ? { postcode: formData.postcode } : {}),
        ...(formData.distance !== "" ? { distance: formData.distance } : {}),
        status: formData.immediate,
        constructionCardType: formData.area_of_expertise,
        sector,
        job_description: description,
      }),
    [formData, description]
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

  const handleDescriptionChange = (value, key, newValue) => {
    setDescription({
      ...description,
      [key]: newValue || value,
    });
  };

  const dropdownData = allRolesDropdown.flatMap((group) =>
    group.options.map((option) => ({
      header: group.header,
      ...option,
    }))
  );

  const createJob = async () => {
    const validateDescriptionResult = validateDescription(description);
    const validateJobFieldsResult = validateJobFields(formData, sector);
    if (validateJobFieldsResult) {
      if (snackMessages.length < maxSnackMessages) {
        setSnackMessages((prevMessages) => [...prevMessages, validateJobFieldsResult]);
      }
      return;
    }
    if (validateDescriptionResult) {
      if (snackMessages.length < maxSnackMessages) {
        setSnackMessages((prevMessages) => [...prevMessages, validateDescriptionResult]);
      }
      return;
    }
    try {
      await postJobAsRecruiter({ jobData: jobDetails });
      nav("/jobs");
    } catch (error) {
      if (snackMessages.length < maxSnackMessages) {
        setSnackMessages((prevMessages) => [...prevMessages, error.message]);
      }
    }
  };

  return (
    <MDBox
      mt={pageSize < 1200 ? 0 : 3}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        padding: "16px 24px",
        borderRadius: "24px",
        boxShadow:
          "0px 4px 12px 4px rgba(38, 42, 63, 0.06), 0px 2px 4px -1px rgba(48, 57, 65, 0.16)",
      }}
    >
      <Grid container direction="column" gap={2}>
        <Grid item container direction="row" gap={2}>
          <div style={{ position: "relative", width: "64px" }}>
            <img
              src={createIcon}
              alt="create icon"
              style={{
                position: "absolute",
                left: "0",
                bottom: "0",
                width: "64px",
                height: "64px",
              }}
            />
          </div>
          <MDTypography variant="h6">Add New Job</MDTypography>
        </Grid>
        <Grid item container direction="row" gap={2}>
          {sector === "Construction" ? (
            <Grid item xs={pageSize < 1200 ? 12 : 5.9} pr={1.1}>
              <Autocomplete
                value={formData.role}
                onChange={(e, newValue) => handleChange(e, "role", newValue)}
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
            <Grid item xs={pageSize < 1200 ? 12 : 5.9} pr={1.1}>
              <Autocomplete
                value={jobDetails.role}
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
            <Grid item xs={pageSize < 1200 ? 12 : 2.9} pr={1}>
              <Autocomplete
                value={formData.constructionCardType}
                onChange={(e, newValue) => handleChange(e, "constructionCardType", newValue)}
                options={cscsCardTypes}
                renderInput={(params) => (
                  <FormField
                    {...params}
                    label="Card Type*"
                    placeholder="Select Card Type"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>
          ) : (
            <Grid item xs={pageSize < 1200 ? 12 : 2.9} pr={1}>
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
          <Grid item xs={pageSize < 1200 ? 12 : 2.9}>
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
        <Grid item container justifyContent="space-between" direction="row" pb={3}>
          <Grid item xs={pageSize < 1200 ? 12 : 5.9} pr={1}>
            <FormField
              label="Postcode"
              value={formData.postcode}
              placeholder="Enter postcode"
              onChange={(e) => handleChange(e, "postcode")}
            />
          </Grid>
          <Grid item xs={pageSize < 1200 ? 12 : 5.94} pr={1} pt={pageSize < 1200 ? 2 : 0}>
            <FormField
              label="Distance (km)"
              value={formData.distance}
              type="number"
              placeholder="Enter distance in km"
              onChange={(e) => handleChange(e, "distance")}
            />
          </Grid>
        </Grid>
        <MDTypography variant="h6">Job Description</MDTypography>
        <Grid item container justifyContent="space-between" direction="row" pb={3} gap={2}>
          <Grid item xs={pageSize < 1200 ? 12 : 5.9} pr={1}>
            <FormField
              label="Location IE Restaurant Address"
              value={description.location}
              placeholder="Enter location"
              onChange={(e) => handleDescriptionChange(e.target.value, "location")}
            />
          </Grid>
          <Grid item xs={pageSize < 1200 ? 12 : 2.9} pl={pageSize < 1200 ? 0 : 0.8}>
            <Autocomplete
              value={description.employment_type}
              onChange={(e, newValue) =>
                handleDescriptionChange(e.target.value, "employment_type", newValue)
              }
              options={
                sector === "Construction" ? constructionEmploymentTypes : hospitalityEmploymentTypes
              }
              renderInput={(params) => (
                <FormField
                  {...params}
                  label="Part Time Or Full Time*"
                  placeholder="Select time"
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>
          <Grid item xs={pageSize < 1200 ? 12 : 2.9}>
            <FormField
              label="Rate of Pay"
              value={description.rate_of_pay ? `${description.rate_of_pay} £ (GBP)` : ""}
              placeholder="Enter rate of pay"
              onKeyDown={(e) => {
                if (e.key === "Backspace") {
                  const formattedValue = description.rate_of_pay.slice(0, -1);
                  handleDescriptionChange(formattedValue, "rate_of_pay");
                }
              }}
              onChange={(e) => {
                const inputValue = e.target.value;
                const formattedValue = inputValue.replace(/[^\d]/g, "");
                handleDescriptionChange(formattedValue, "rate_of_pay");
                setCursorPosition(formattedValue.length);
              }}
              onFocus={(e) => e.target.setSelectionRange(cursorPosition, cursorPosition)}
              onBlur={(e) => setCursorPosition(e.target.selectionStart)}
            />
          </Grid>
        </Grid>
        <Grid item container justifyContent="space-between" direction="row" pb={3} gap={2}>
          <Grid item xs={pageSize < 1200 ? 12 : 5.9} pr={1}>
            <FormField
              label="Contact Details Name"
              value={description.contact_name}
              placeholder="Enter contact details name"
              onChange={(e) => handleDescriptionChange(e.target.value, "contact_name")}
            />
          </Grid>
          <Grid item xs={pageSize < 1200 ? 12 : 5.9} pr={1}>
            <FormField
              label="Phone Number"
              value={description.contact_phone}
              placeholder="Enter phone number"
              onChange={(e) => handleDescriptionChange(e.target.value, "contact_phone")}
            />
          </Grid>
        </Grid>
        <Grid item container justifyContent="space-between" direction="row" pb={3} gap={2}>
          <Grid item xs={pageSize < 1200 ? 12 : 5.9} pr={1}>
            <FormField
              label="Company Name"
              value={description.company_name}
              placeholder="Enter company name"
              onChange={(e) => handleDescriptionChange(e.target.value, "company_name")}
            />
          </Grid>
          <Grid item xs={pageSize < 1200 ? 12 : 5.9} pr={1}>
            <FormField
              label="Email Address"
              value={description.contact_email}
              placeholder="Enter email address"
              onChange={(e) => handleDescriptionChange(e.target.value, "contact_email")}
            />
          </Grid>
        </Grid>
        <Grid item container direction="row" alignItems="center">
          <Grid item container xs={6} alignItems="center">
            <Checkbox
              size="small"
              checked={formData.immediate}
              onChange={() => {
                setFormData({
                  ...formData,
                  immediate: !formData.immediate,
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
              Publish Job Immediately
            </MDTypography>
          </Grid>
          <Grid item container xs={6} alignItems="center">
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
            variant="outlined"
            style={{
              color: "#fff",
              padding: "8px 22px",
              borderRadius: "4px",
              boxShadow:
                "0px 3px 1px -2px rgba(0, 0, 0, 0.20), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
              backgroundColor: "#38B6FF",
              fontFamily: "Roboto, sans-serif",
              fontSize: "14px",
              fontWeight: "500",
              border: "none",
            }}
            onClick={createJob}
          >
            Add new job
          </Button>
        </Grid>
      </Grid>
      <SnackBar errorMessages={snackMessages} handleCloseSnack={handleCloseSnack} />
    </MDBox>
  );
}

JobCreateFlow.propTypes = {
  sector: PropTypes.string.isRequired,
};
