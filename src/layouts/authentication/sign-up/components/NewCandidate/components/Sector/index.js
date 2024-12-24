/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-no-undef */
import PropTypes from "prop-types";
import { Grid, InputLabel, FormControl, NativeSelect } from "@mui/material";
import MDBox from "components/MDBox";
import FormField from "layouts/authentication/sign-up/components/NewCandidate/components/FormField";
import { useState, useEffect } from "react";
import steps from "assets/images/steps.svg";
import { sectors } from "constants/experience";

function Address({ formData }) {
  const { formField, values, errors, touched } = formData;
  const [sector, setSector] = useState(values.experience.sector || "");
  const { phoneNumber, postalCode } = formField;
  const { phoneNumber: phoneNumberV, postalCode: postalCodeV } = values;
  // eslint-disable-next-line no-unused-vars
  const [isMobileSize, setIsMobileSize] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobileSize(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

      <Grid container spacing={isMobileSize ? 0 : 3}>
        <Grid item xs={12}>
          <MDBox
            mt={-1.625}
            style={{
              width: "342px",
            }}
          >
            <FormField
              type={phoneNumber.type}
              label={phoneNumber.label}
              name={phoneNumber.name}
              value={phoneNumberV}
              placeholder={phoneNumber.placeholder}
              error={errors.phoneNumber && touched.phoneNumber}
              success={phoneNumberV.length > 0 && !errors.phoneNumber}
            />
          </MDBox>
        </Grid>
      </Grid>
      <Grid container spacing={isMobileSize ? 0 : 3}>
        <Grid item xs={12}>
          <FormField
            type={postalCode.type}
            label={postalCode.label}
            name={postalCode.name}
            value={postalCodeV}
            placeholder={postalCode.placeholder}
            error={errors.postalCode && touched.postalCode}
            success={postalCode.length > 0 && !errors.postalCode}
          />
        </Grid>
      </Grid>
      <Grid container spacing={isMobileSize ? 0 : 3}>
        <Grid item xs={12} pt={isMobileSize ? 0 : 1}>
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              Choose Sector *
            </InputLabel>
            <NativeSelect
              inputProps={{
                name: "sector",
                id: "uncontrolled-native",
              }}
              value={sector}
              onChange={(e) => {
                values.experience.sector = e.target.value;
                setSector(e.target.value);
              }}
              isRequired
            >
              <option value="" />
              {renderOptions(sectors)}
            </NativeSelect>
          </FormControl>
        </Grid>
      </Grid>
    </MDBox>
  );
}

// typechecking props for Address
Address.propTypes = {
  formData: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
};

export default Address;
