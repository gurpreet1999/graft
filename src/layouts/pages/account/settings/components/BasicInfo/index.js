/* eslint-disable*/
// @material-ui core components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import FormField from "layouts/pages/account/components/FormField";
import { useEffect, useState } from "react";
import { yearsOfExperience, establishments, allRolesDropdown } from "constants/experience";
import { dailyJobUpdatePreferences } from "constants/candidate";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "store/user/actions";
import { userSelector } from "store/user/selectors";
import logger from "utilities/logger";
import { cscsCardTypes } from "constants/experience";
import { constructionRoles } from "constants/experience";
import { removeEmptyValues } from "utilities/helpers";

function BasicInfo() {
  const { user } = useSelector(userSelector);
  const dropdownData = allRolesDropdown.flatMap((group) =>
    group.options.map((option) => ({
      header: group.header,
      ...option,
    }))
  );

  const [formData, setFormData] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    companyName: user?.company_name || "",
    email: user?.email || "",
    phoneNumber: user?.phone_number || "",
    periodToBeContacted: user?.period_to_be_contacted || "",
    agreedToBeContacted: user?.agreed_to_be_contacted || false,
    postalCode: user?.postal_code || "",
    dailyJobUpdatePreference: user?.period_to_be_contacted || "",
    experience: {
      mainTypeOfEstablishment: user?.experience?.main_type_of_establishment || "",
      yearsOfExperience: user?.experience?.years_of_experience || "",
      firstRolePreference:
        user?.experience?.first_role_preference ||
        user?.experience?.first_role_preference?.header ||
        "",
      secondTypeOfEstablishment:
        user?.experience?.second_type_of_establishment ||
        user?.experience?.second_type_of_establishment?.header ||
        "",
      secondRolePreference: user?.experience?.second_role_preference || "",
      constructionCardType: user?.experience?.construction_card_type  || "",
      constructionRole: user?.experience?.construction_role || "",
      sector: user?.experience?.sector || "",
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user?.first_name || "",
        lastName: user?.last_name || "",
        companyName: user?.company_name || "",
        email: user?.email || "",
        phoneNumber: user.phone_number || "",
        periodToBeContacted: user?.period_to_be_contacted || "",
        agreedToBeContacted: user?.agreed_to_be_contacted || false,
        postalCode: user?.postal_code || "",
        dailyJobUpdatePreference: user?.daily_job_update_preference || "",
        experience: {
          mainTypeOfEstablishment: user?.experience?.main_type_of_establishment || "",
          yearsOfExperience: user?.experience?.years_of_experience || "",
          firstRolePreference:
            {
              label: user?.experience?.first_role_preference || "",
              header: dropdownData.find(
                (option) => option.label === user?.experience?.first_role_preference
              )?.header,
            } || "",
          secondTypeOfEstablishment: user?.experience?.second_type_of_establishment || "",
          secondRolePreference:
            {
              label: user?.experience?.second_role_preference || "",
              header: dropdownData.find(
                (option) => option.label === user?.experience?.second_role_preference || ""
              )?.header,
            } || "",
          constructionCardType: user?.experience?.construction_card_type || "",
          constructionRole: user?.experience?.construction_role || "",
          sector: user?.experience?.sector || "",
        },
      });
    }
  }, [user]);

  const experience = {
    ...formData.experience,
  };

  const filteredExperience = removeEmptyValues(experience);

  const width = window.innerWidth;

  function handleChange(event, fieldName, newValue, nestedField) {
    if (nestedField) {
      setFormData({
        ...formData,
        [nestedField]: {
          ...formData[nestedField],
          [fieldName]: newValue || event.target.value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [fieldName]: newValue || event.target.value,
      });
    }
  }

  const dispatch = useDispatch();

  const updateUserData = async () => {
    await dispatch(
      updateUser({
        ...formData,
        experience: {
          ...filteredExperience,
        },
      })
    ).catch((error) => {
      logger.error(error, "Error updating user data.");
    });
  };

  return (
    <Card id="basic-info" sx={{ overflow: "visible" }}>
      <MDBox p={3}>
        <MDTypography variant="h5">Basic Info</MDTypography>
      </MDBox>
      <MDBox component="form" pb={{ xs: 2, md: 3 }} px={3}>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid item xs={12} sm={6}>
            <FormField
              label="First Name"
              placeholder="Alec"
              value={formData.firstName}
              onChange={(e) => handleChange(e, "firstName")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              label="Last Name"
              placeholder="Cooper Co"
              value={formData.lastName}
              onChange={(e) => handleChange(e, "lastName")}
            />
          </Grid>

          <Grid item xs={24} sm={12}>
            <FormField
              label="Email"
              placeholder="example@email.com"
              inputProps={{ type: "email" }}
              value={formData.email}
              onChange={(e) => handleChange(e, "email")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              label="Phone Number"
              placeholder="+40 735 631 620"
              inputProps={{ type: "tel" }}
              value={formData.phoneNumber}
              onChange={(e) => handleChange(e, "phoneNumber")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              label="Post Code"
              placeholder="Post Code"
              value={formData.postalCode}
              onChange={(e) => handleChange(e, "postalCode")}
            />
          </Grid>
        </Grid>
      </MDBox>
      <MDBox
        px={3}
        pb={2}
        style={{
          display: "flex",
          flexDirection: window.innerWidth < 768 ? "column" : "row",
          gap: "8px",
          alignItems: window.innerWidth < 768 ? "flex-start" : "flex-end",
        }}
      >
        <MDTypography variant="h6">Experience</MDTypography>
        <MDTypography
          style={{
            fontSize: "12px",
            color: "#888",
          }}
        >
          Choose 2 Establishment Types & 2 Roles
        </MDTypography>
      </MDBox>
      <Grid container pb={{ xs: 2, md: 3 }} px={3}>
        <Grid item xs={12} pr={1}>
          <Autocomplete
            value={formData.experience.yearsOfExperience}
            onChange={(e, newValue) => handleChange(e, "yearsOfExperience", newValue, "experience")}
            options={yearsOfExperience}
            renderInput={(params) => (
              <FormField
                {...params}
                label={
                  formData.experience.sector === "Construction"
                    ? "Total Construction Experience"
                    : "Total Years Hospitality Experience"
                }
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid container pb={{ xs: 2, md: 3 }} px={3}>
        {formData.experience.sector === "Construction" ? (
          <>
            <Grid item xs={12} sm={5.8}>
              <Autocomplete
                value={formData.experience.constructionRole}
                onChange={(e, newValue) =>
                  handleChange(e, "constructionRole", newValue, "experience")
                }
                options={constructionRoles}
                renderInput={(params) => (
                  <FormField {...params} label="Role" InputLabelProps={{ shrink: true }} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6.1} pl={width < 576 ? 0 : 3} pt={width < 576 && 2}>
              <Autocomplete
                value={formData.experience.constructionCardType}
                onChange={(e, newValue) => handleChange(e, "constructionCardType", newValue, "experience")}
                options={cscsCardTypes}
                renderInput={(params) => (
                  <FormField {...params} label="Card Type" InputLabelProps={{ shrink: true }} />
                )}
              />
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} sm={6} pr={1}>
              <Autocomplete
                value={formData.experience.mainTypeOfEstablishment}
                onChange={(e, newValue) =>
                  handleChange(e, "mainTypeOfEstablishment", newValue, "experience")
                }
                options={establishments}
                renderInput={(params) => (
                  <FormField
                    {...params}
                    label="Main Type Of Establishment"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} pl={width < 576 ? 0 : 2}>
              <Autocomplete
                value={formData.experience.firstRolePreference}
                onChange={(e, newValue) =>
                  handleChange(e, "firstRolePreference", newValue, "experience")
                }
                options={dropdownData}
                getOptionLabel={(option) => option.label}
                groupBy={(option) => option.header}
                renderInput={(params) => (
                  <FormField
                    {...params}
                    label="1st Role Looking For Preference"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} pr={1} pt={2}>
              <Autocomplete
                value={formData.experience.secondTypeOfEstablishment}
                onChange={(e, newValue) =>
                  handleChange(e, "secondTypeOfEstablishment", newValue, "experience")
                }
                options={establishments}
                renderInput={(params) => (
                  <FormField
                    {...params}
                    label="Second Type Of Establishment"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} pl={width < 576 ? 0 : 2} pt={2}>
              <Autocomplete
                value={formData.experience.secondRolePreference}
                onChange={(e, newValue) =>
                  handleChange(e, "secondRolePreference", newValue, "experience")
                }
                options={dropdownData}
                getOptionLabel={(option) => option.label}
                groupBy={(option) => option.header}
                renderInput={(params) => (
                  <FormField
                    {...params}
                    label="2nd Role Looking For Preference"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>
          </>
        )}
        <Grid container spacing={3} pb={3} pt={{ xs: 2, md: 3 }}>
          <Grid item xs={11.9} sm={11.9}>
            <Autocomplete
              value={formData.dailyJobUpdatePreference}
              onChange={(e, newValue) => handleChange(e, "dailyJobUpdatePreference", newValue)}
              options={dailyJobUpdatePreferences}
              renderInput={(params) => (
                <FormField
                  {...params}
                  label="Daily Job Update Preference"
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>
        </Grid>

        <FormControlLabel
          required
          control={
            <Checkbox
              style={{ height: "20px" }}
              checked={formData.agreedToBeContacted}
              onChange={(e) => handleChange(e, "agreedToBeContacted")}
            />
          }
          sx={{ "& .MuiFormControlLabel-label": { fontSize: 14, fontWeight: 400 } }}
          label="Wish to be contacted via SMS/Email"
        />

        <Grid item container justifyContent="flex-end" pt={2}>
          <Button
            type="submit"
            variant="contained"
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
            onClick={updateUserData}
          >
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
}

export default BasicInfo;
