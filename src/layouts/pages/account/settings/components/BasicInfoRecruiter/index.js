import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import FormField from "layouts/pages/account/components/FormField";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "store/user/actions";
import { userSelector } from "store/user/selectors";
import logger from "utilities/logger";

function BasicInfo() {
  const { user } = useSelector(userSelector);
  const [formData, setFormData] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    companyName: user?.company_name || "",
    email: user?.email || "",
    phoneNumber: user?.phone_number || "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        companyName: user.company_name || "",
        email: user.email || "",
        phoneNumber: user.phone_number || "",
      });
    }
  }, [user]);

  const handleChange = (event, fieldName) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: event.target.value,
    }));
  };

  const dispatch = useDispatch();

  const updateUserData = async () => {
    await dispatch(updateUser({ ...formData, postalCode: user.postal_code })).catch((error) => {
      logger.error(error, "Error updating user data.");
    });
  };

  return (
    <Card id="basic-info" sx={{ overflow: "visible" }}>
      <MDBox p={3}>
        <MDTypography variant="h5">Basic Info</MDTypography>
      </MDBox>
      <MDBox component="form" pb={3} px={3}>
        <Grid container spacing={3}>
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
          <Grid item xs={12} sm={6}>
            <FormField
              label="Company Name"
              placeholder="Cooper Co"
              inputProps={{ type: "companyName" }}
              value={formData.companyName}
              onChange={(e) => handleChange(e, "companyName")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              label="Email"
              placeholder="example@email.com"
              inputProps={{ type: "email" }}
              value={formData.email}
              onChange={(e) => handleChange(e, "email")}
            />
          </Grid>
          <Grid item xs={24} sm={12}>
            <FormField
              label="Mobile Number"
              placeholder="+40 735 631 620"
              inputProps={{ type: "tel" }}
              value={formData.phoneNumber}
              onChange={(e) => handleChange(e, "phoneNumber")}
            />
          </Grid>
        </Grid>
        <Grid item container justifyContent="flex-end" pt={2}>
          <Button
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
      </MDBox>
    </Card>
  );
}

export default BasicInfo;
