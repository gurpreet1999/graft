/* eslint-disable react/no-array-index-key */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Switch from "@mui/material/Switch";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { isFirstTimeAdmin } from "helpers/user";
import { userSelector } from "store/user/selectors";
import AdminLoginLayout from "../components/AdminLoginLayout/AdminLoginLayout";
import { signInAsUser } from "../../../firebase/auth";
import SnackBar from "../components/SnackBar/SnackBar";

function AdminLogin() {
  const { user } = useSelector(userSelector);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackMessages, setSnackMessages] = useState([]);
  const maxSnackMessages = 4;

  const handleCloseSnack = (index) => {
    setSnackMessages((prevMessages) => prevMessages.filter((_, i) => i !== index));
  };

  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const nav = useNavigate();
  const [userdata, setUserData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (field) => (event) => {
    setUserData({
      ...userdata,
      [field]: event.target.value,
    });
  };

  const handleSignIn = async () => {
    try {
      await signInAsUser({ email: userdata.email, password: userdata.password });
      if (isFirstTimeAdmin(user)) {
        nav("/authentication/admin/confirm");
      }
      nav("/admin/user-management");
    } catch (error) {
      const newMessages = [...snackMessages, error.message];
      setSnackMessages(newMessages.slice(Math.max(newMessages.length - maxSnackMessages, 0)));
    }
  };

  return (
    <AdminLoginLayout>
      <MDBox component="form" role="form" maxWidth="408px" margin="0 auto">
        <MDBox mb={2}>
          <MDInput
            variant="standard"
            type="email"
            label="Email"
            fullWidth
            value={userdata.email}
            onChange={handleInputChange("email")}
          />
        </MDBox>
        <MDBox mb={2}>
          <MDInput
            variant="standard"
            type={showPassword ? "text" : "password"}
            label="Password"
            fullWidth
            value={userdata.password}
            onChange={handleInputChange("password")}
            startAdornment={
              <InputAdornment position="start">
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <RemoveRedEyeIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </MDBox>
        <MDBox display="flex" alignItems="center" ml={-1}>
          <Switch checked={rememberMe} onChange={handleSetRememberMe} />
          <MDTypography
            variant="button"
            fontWeight="regular"
            color="text"
            onClick={handleSetRememberMe}
            sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
          >
            &nbsp;Remember me
          </MDTypography>
        </MDBox>
        <MDBox mt={4} mb={1}>
          <MDButton
            style={{
              background: "#38B6FF",
              color: "white",
            }}
            variant="gradient"
            size="large"
            fullWidth
            onClick={handleSignIn}
          >
            Login
          </MDButton>
        </MDBox>
      </MDBox>
      <SnackBar errorMessages={snackMessages} handleCloseSnack={handleCloseSnack} />
    </AdminLoginLayout>
  );
}

export default AdminLogin;
