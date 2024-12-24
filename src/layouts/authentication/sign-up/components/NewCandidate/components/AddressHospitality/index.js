/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-no-undef */
import PropTypes from "prop-types";
import {
  Typography,
  Grid,
  InputLabel,
  Link,
  Checkbox,
  FormControl,
  NativeSelect,
} from "@mui/material";
import MDBox from "components/MDBox";
import {
  establishments as experiences,
  yearsOfExperience,
  allRolesDropdown,
} from "constants/experience";
import { dailyJobUpdatePreferences as periodsToBeContacted } from "constants/candidate";
import { useState, useEffect } from "react";
import MDTypography from "components/MDTypography";
import steps from "assets/images/steps-full.svg";

function AddressHospitality({ formData }) {
  const [updatePreference, setUpdatePreference] = useState("");
  const { values } = formData;
  const { agreedToBeContacted: agreedToBeContactedV } = values;
  const dropdownData = allRolesDropdown.flatMap((group) =>
    group.options.map((option) => ({
      header: group.header,
      ...option,
    }))
  );
  // eslint-disable-next-line no-unused-vars
  const [isMobileSize, setIsMobileSize] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobileSize(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const handleChange = (e, field) => {
    const { value, type, checked } = e.target;

    if (type === "checkbox") {
      values[field] = checked;
    } else if (field === "dailyJobUpdatePreference") {
      values.dailyJobUpdatePreference = value;
    } else {
      values.experience[field] = value;
    }
  };

  const renderOptions = (arr) => {
    if (arr[0] && arr[0].header) {
      const headers = [...new Set(arr.map((item) => item.header))];
      return headers.map((header) => (
        <optgroup label={header} key={header}>
          {arr
            .filter((item) => item.header === header)
            .map((option) => (
              <option key={option.value} value={option.label}>
                {option.label}
              </option>
            ))}
        </optgroup>
      ));
    }
    return arr.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ));
  };

  return (
    <MDBox>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: "24px",
        }}
      >
        <img
          src={steps}
          alt="steps"
          style={{
            margin: "0 auto",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          gap: "10px",
        }}
      >
        <div>
          <Typography variant="h5" fontWeight="bold">
            Experience
          </Typography>
        </div>
        <div
          style={{
            fontSize: isMobileSize ? "12px" : "14px",
            lineHeight: "0.5 !important",
          }}
        >
          <MDTypography
            variant="button"
            color="text"
            textTransform="unset"
            style={{
              fontSize: "12px",
              lineHeight: "0.5 !important",
            }}
          >
            Choose 2 Establishment Types & 2 Roles
          </MDTypography>
        </div>
      </div>
      <Grid container spacing={isMobileSize ? 0 : 3}>
        <Grid item xs={12} pt={isMobileSize ? 0 : 1}>
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              Total Years Hospitality Experience
            </InputLabel>
            <NativeSelect
              inputProps={{
                name: "yearsOfExperience",
                id: "uncontrolled-native",
              }}
              value={values.yearsOfExperience}
              onChange={(e) => handleChange(e, "yearsOfExperience", e.target.value)}
              isRequired
            >
              <option value="" />
              {renderOptions(yearsOfExperience)}
            </NativeSelect>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={isMobileSize ? 0 : 3}>
        <Grid item xs={12} pt={1}>
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              Main Type Of Establishment
            </InputLabel>
            <NativeSelect
              inputProps={{
                name: "mainTypeOfEstablishment",
                id: "uncontrolled-native",
              }}
              value={values.mainTypeOfEstablishment}
              onChange={(e) => handleChange(e, "mainTypeOfEstablishment", e.target.value)}
              isRequired
            >
              <option value="" />
              {renderOptions(experiences)}
            </NativeSelect>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container pt={1}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              Second Type Of Establishment
            </InputLabel>
            <NativeSelect
              inputProps={{
                name: "secondTypeOfEstablishment",
                id: "uncontrolled-native",
              }}
              value={values.secondExperience}
              onChange={(e) => handleChange(e, "secondTypeOfEstablishment", e.target.value)}
              isRequired
            >
              <option value="" />
              {renderOptions(experiences)}
            </NativeSelect>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container pt={1}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              1st Role Looking For Preference
            </InputLabel>
            <NativeSelect
              inputProps={{
                name: "firstRolePreference",
                id: "uncontrolled-native",
              }}
              value={values.firstRolePreference}
              onChange={(e) => handleChange(e, "firstRolePreference", e.target.value)}
              isRequired
            >
              <option value="" />
              {renderOptions(dropdownData)}
            </NativeSelect>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container pt={1}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              2nd Role Looking For Preference
            </InputLabel>
            <NativeSelect
              inputProps={{
                name: "secondRolePreference",
                id: "uncontrolled-native",
              }}
              value={values.secondRolePreference}
              onChange={(e) => handleChange(e, "secondRolePreference", e.target.value)}
              isRequired
            >
              <option value="" />
              {renderOptions(dropdownData)}
            </NativeSelect>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container pt={1}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              Daily Job Update Preference
            </InputLabel>
            <NativeSelect
              inputProps={{
                name: "dailyJobUpdatePreference",
                id: "uncontrolled-native",
              }}
              value={updatePreference}
              onChange={(e) => {
                setUpdatePreference(e.target.value);
                handleChange(e, "dailyJobUpdatePreference", e.target.value);
              }}
              isRequired
            >
              <option value="" />
              {renderOptions(periodsToBeContacted)}
            </NativeSelect>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container alignItems="center" pt={1}>
        <Grid item xs={1}>
          <Checkbox
            id="uncontrolled-native"
            value={agreedToBeContactedV}
            size="small"
            sx={{
              "&.Mui-checked": {
                color: "#07A0C3",
              },
            }}
            onChange={(e) => handleChange(e, "agreedToBeContacted")}
          />
        </Grid>
        <Grid item xs={11} pl={isMobileSize ? 1 : 0}>
          <Typography
            variant="body2"
            style={{ fontSize: isMobileSize ? "12px" : "14px", marginLeft: "6px" }}
          >
            Wish to be contacted via SMS/Email
          </Typography>
        </Grid>
      </Grid>
      <Grid container alignItems="center">
        <Grid item xs={1}>
          <Checkbox
            size="small"
            defaultChecked
            sx={{
              "&.Mui-checked": {
                color: "#07A0C3",
              },
            }}
          />
        </Grid>
        <Grid item xs={11} pl={isMobileSize ? 1 : 0} pb={1}>
          <Typography
            variant="body2"
            style={{
              fontSize: isMobileSize ? "12px" : "14px",
              marginLeft: "6px",
              fontFamily: "Roboto",
            }}
          >
            I agree to the{" "}
            <Link href="#" style={{ color: "#07A0C3" }}>
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link href="#" style={{ color: "#07A0C3" }}>
              Privacy Policy
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </MDBox>
  );
}

// typechecking props for Address
AddressHospitality.propTypes = {
  formData: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
};

export default AddressHospitality;
