import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import FormField from "layouts/authentication/sign-up/components/NewRecrutier/components/FormField";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";

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

function UserInfo({ formData }) {
  const { formField, values, errors, touched, handleChange } = formData;
  const { firstName, lastName, email, password, role } = formField;
  const [isMobileSize, setIsMobileSize] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileSize(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { firstName: firstNameV, lastName: lastNameV, email: emailV, password: passwordV } = values;

  return (
    <MDBox mt={isMobileSize ? 0 : 1.625}>
      <Grid container spacing={isMobileSize ? 0 : 3}>
        <Grid item xs={12} sm={6}>
          <FormField
            type={firstName.type}
            label={firstName.label}
            name={firstName.name}
            value={firstNameV}
            placeholder={firstName.placeholder}
            error={errors.firstName && touched.firstName}
            success={firstNameV.length > 0 && !errors.firstName}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormField
            type={lastName.type}
            label={lastName.label}
            name={lastName.name}
            value={lastNameV}
            placeholder={lastName.placeholder}
            error={errors.lastName && touched.lastName}
            success={lastNameV.length > 0 && !errors.lastName}
          />
        </Grid>
      </Grid>
      <Grid container>
        <Grid
          item
          xs={12}
          spacing={isMobileSize ? 0 : 3}
          style={{
            paddingTop: "0",
          }}
        >
          <FormField
            type={email.type}
            label={email.label}
            name={email.name}
            value={emailV}
            placeholder={email.placeholder}
            error={errors.email && touched.email}
            success={emailV.length > 0 && !errors.email}
          />
        </Grid>
      </Grid>
      <Grid container spacing={isMobileSize ? 0 : 3}>
        <Grid item xs={12} sm={12}>
          <FormField
            type={password.type}
            label={password.label}
            name={password.name}
            value={passwordV}
            placeholder={password.placeholder}
            error={errors.password && touched.password}
            success={passwordV.length > 0 && !errors.password}
            inputProps={{ autoComplete: "" }}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} sm={12}>
        <TextField
          id="role"
          select
          label={role.label}
          SelectProps={{
            native: true,
          }}
          variant="standard"
          onChange={handleChange}
          style={{ width: "100%" }}
          placeholder="Select your role"
          defaultValue="1"
        >
          <option value="1" disabled>
            Select your role
          </option>
          {renderOptions(["Looking For A Job", "Looking For Staff"])}
        </TextField>
      </Grid>
    </MDBox>
  );
}

UserInfo.propTypes = {
  formData: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
};

export default UserInfo;
