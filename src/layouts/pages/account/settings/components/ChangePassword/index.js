/* eslint-disable no-unused-vars */
/**
=========================================================
* Otis Admin PRO - v2.0.1
=========================================================

* Product Page: https://material-ui.com/store/items/otis-admin-pro-material-dashboard-react/
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
// Otis Admin PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import { useDispatch } from "react-redux";
import { updateUserPassword } from "store/user/actions";
import { useState } from "react";

function ChangePassword() {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (event, fieldName) => {
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [fieldName]: event.target.value,
    }));
  };

  const dispatch = useDispatch();

  const changePassword = () => {
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      return;
    }
    dispatch(
      updateUserPassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      })
    );
  };

  const passwordRequirements = [
    "One special characters",
    "Min 6 characters",
    "One number (2 are recommended)",
    "Change it often",
  ];

  const renderPasswordRequirements = passwordRequirements.map((item, key) => {
    const itemKey = `element-${key}`;

    return (
      <MDBox key={itemKey} component="li" color="text" fontSize="1.25rem" lineHeight={1}>
        <MDTypography variant="button" color="text" fontWeight="regular" verticalAlign="middle">
          {item}
        </MDTypography>
      </MDBox>
    );
  });

  return (
    <Card id="change-password">
      <MDBox p={3}>
        <MDTypography variant="h5">Change Password</MDTypography>
      </MDBox>
      <MDBox component="form" pb={3} px={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <MDInput
              variant="standard"
              fullWidth
              label="Current Password"
              inputProps={{ type: "password", autoComplete: "" }}
              value={passwords.currentPassword}
              onChange={(e) => handleChange(e, "currentPassword")}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <MDInput
              variant="standard"
              fullWidth
              label="New Password"
              inputProps={{ type: "password", autoComplete: "" }}
              value={passwords.newPassword}
              onChange={(e) => handleChange(e, "newPassword")}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <MDInput
              variant="standard"
              fullWidth
              label="Confirm New Password"
              inputProps={{ type: "password", autoComplete: "" }}
              value={passwords.confirmNewPassword}
              onChange={(e) => handleChange(e, "confirmNewPassword")}
            />
          </Grid>
        </Grid>
        <MDBox mb={1} />
        <MDBox
          mt={2}
          display="flex"
          justifyContent="space-between"
          alignItems="flex-end"
          flexWrap="wrap"
        >
          <MDBox ml="auto">
            <Button
              variant="contained"
              onClick={changePassword}
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
            >
              Save Changes
            </Button>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default ChangePassword;
