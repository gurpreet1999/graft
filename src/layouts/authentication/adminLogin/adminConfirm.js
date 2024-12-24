/* eslint-disable react/no-array-index-key */
import MDBox from "components/MDBox";
import Typography from "@mui/material/Typography";
import MDTypography from "components/MDTypography";
import FormField from "layouts/pages/account/components/FormField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userSelector } from "store/user/selectors";
import { updateUser, updateUserPassword } from "store/user/actions";
import AdminConfirmLayout from "../components/AdminConfirmLayout/AdminConfirmLayout";
import SnackBar from "../components/SnackBar/SnackBar";

function AdminConfirm() {
  const { user } = useSelector(userSelector);
  const [snackMessages, setSnackMessages] = useState([]);
  const maxSnackMessages = 4;
  const nav = useNavigate();
  const handleCloseSnack = (index) => {
    setSnackMessages((prevMessages) => prevMessages.filter((_, i) => i !== index));
  };
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [userPassword, setUserPassword] = useState({
    currentPassword: "",
    newPassword: "",
    repeatNewPassword: "",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setUserInfo({
        ...userInfo,
        email: user.email,
      });
    }
  }, [user]);

  const handleInputChange = (field) => (event) => {
    setUserInfo({
      ...userInfo,
      [field]: event.target.value,
    });
  };

  const handlePasswordChange = (field) => (event) => {
    setUserPassword({
      ...userPassword,
      [field]: event.target.value,
    });
  };

  const handleSubmit = async () => {
    if (userPassword.newPassword !== userPassword.repeatNewPassword) {
      const newMessages = [...snackMessages, "Passwords do not match"];
      setSnackMessages(newMessages.slice(Math.max(newMessages.length - maxSnackMessages, 0)));
    }
    try {
      await dispatch(updateUser(userInfo));
      nav("/admin/user-management");
    } catch (error) {
      const newMessages = [...snackMessages, error.message];
      setSnackMessages(newMessages.slice(Math.max(newMessages.length - maxSnackMessages, 0)));
    }
    try {
      await dispatch(updateUserPassword(userPassword));
      nav("/admin/user-management");
    } catch (error) {
      const newMessages = [...snackMessages, error.message];
      setSnackMessages(newMessages.slice(Math.max(newMessages.length - maxSnackMessages, 0)));
    }
  };

  return (
    <AdminConfirmLayout>
      <MDBox component="form" role="form" maxWidth="408px" width="100%" margin="0 auto">
        <Grid container direction="column" gap="24px" mt={3}>
          <MDTypography
            style={{
              textAlign: "center",
              fontSize: "16px",
              fontWeight: "600",
              color: "#5F5F5F",
              fontFamily: "Montserrat",
            }}
          >
            To complete first log in, please enter the information below
          </MDTypography>
          <Grid
            item
            container
            direction="row"
            gap="16px"
            justifyContent={{ xs: "center", sm: "space-between" }}
            style={{
              width: "100%",
            }}
          >
            <Grid item xs={12} sm={5.4}>
              <FormField
                label="First Name*"
                placeholder="Enter your first name"
                InputLabelProps={{ shrink: true }}
                onChange={handleInputChange("firstName")}
              />
            </Grid>
            <Grid item xs={12} sm={5.4}>
              <FormField
                label="Last Name*"
                placeholder="Enter your last name"
                InputLabelProps={{ shrink: true }}
                onChange={handleInputChange("lastName")}
              />
            </Grid>
          </Grid>
          <FormField
            type="password"
            label="Current Password*"
            placeholder="⦁⦁⦁⦁⦁⦁"
            InputLabelProps={{ shrink: true }}
            onChange={handlePasswordChange("currentPassword")}
          />
          <FormField
            type="password"
            label="New Password*"
            placeholder="⦁⦁⦁⦁⦁⦁"
            InputLabelProps={{ shrink: true }}
            onChange={handlePasswordChange("newPassword")}
          />
          <FormField
            type="password"
            label="Repeat New Password*"
            placeholder="⦁⦁⦁⦁⦁⦁"
            InputLabelProps={{ shrink: true }}
            onChange={handlePasswordChange("repeatNewPassword")}
          />
          <Typography variant="body2" style={{ fontSize: "14px", marginLeft: "6px" }}>
            I agree to the
            <span style={{ fontSize: "14px", color: "#07A0C3" }}> Terms and Conditions </span>
            and
            <span style={{ fontSize: "14px", color: "#07A0C3" }}> Privacy Policy</span>
          </Typography>
          <Button
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
            onClick={handleSubmit}
          >
            Finish
          </Button>
        </Grid>
      </MDBox>
      <SnackBar errorMessages={snackMessages} handleCloseSnack={handleCloseSnack} />
    </AdminConfirmLayout>
  );
}

export default AdminConfirm;
