/* eslint-disable import/named */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Switch from "@mui/material/Switch";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PersonIcon from "@mui/icons-material/Person";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import IllustrationLayout from "layouts/authentication/components/IllustrationLayout";
import bgImage from "assets/images/illustrations/Illustration-auth.png";
import CustomSnackbar from "components/Snackbar";
import { signInAsUser } from "../../../firebase/auth";

function Illustration() {
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const [mobileSize, setMobileSize] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setMobileSize(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const [value, setValue] = useState(0);

  const nav = useNavigate();

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  const iconActive = {
    color: "#38B6FF",
  };

  const iconDisabled = {
    color: "#888888",
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      await signInAsUser({ email, password });
      nav("/dashboard");
    } catch (error) {
      setSnackbar(<CustomSnackbar messages={[{ type: "error", text: error.message }]} />);
    }
  };

  return (
    <IllustrationLayout
      title="Login"
      description="Enter your email and password to sign in"
      illustration={bgImage}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="icon tabs example"
        textColor="inherit"
        indicatorColor="primary"
      >
        <Tab
          icon={
            value === 0 ? (
              <PersonIcon style={iconActive} />
            ) : (
              <PersonOutlineIcon style={iconDisabled} />
            )
          }
          label="Looking For Staff?"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "20px 30px",
          }}
        />
        <Tab
          icon={
            value === 1 ? (
              <PersonIcon style={iconActive} />
            ) : (
              <PersonOutlineIcon style={iconDisabled} />
            )
          }
          label="Looking For Work?"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "20px 30px",
          }}
        />
      </Tabs>
      {value === 0 && (
        <MDBox component="form" role="form">
          <MDBox my={2}>
            <MDInput
              variant="standard"
              type="email"
              label="Email"
              fullWidth
              onChange={(e) => setEmail(e.target.value)}
            />
          </MDBox>
          <MDBox mb={1}>
            <MDInput
              variant="standard"
              type={showPassword ? "text" : "password"}
              label="Password"
              fullWidth
              onChange={(e) => setPassword(e.target.value)}
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{
                  cursor: "pointer",
                  userSelect: "none",
                  ml: -1,
                  fontSize: mobileSize ? "12px" : "14px",
                }}
              >
                {mobileSize ? "Remember me" : <>&nbsp;&nbsp;Remember me</>}
              </MDTypography>
            </MDBox>
            <Link
              to="/authentication/forgot-password"
              style={{
                textDecoration: "none",
                color: "#07A0C3",
                fontSize: mobileSize ? "12px" : "14px",
                paddingTop: "2px",
              }}
            >
              Forgot Password ?
            </Link>
          </div>
          <MDBox mt={mobileSize ? 1 : 4} mb={1}>
            <MDButton variant="gradient" color="info" size="large" fullWidth onClick={handleSignIn}>
              Login
            </MDButton>
          </MDBox>
          <MDBox mt={mobileSize ? 1 : 3} textAlign="center">
            <MDTypography variant="button" color="text">
              Don&apos;t have an account?{" "}
              <MDTypography
                component={Link}
                to="/authentication/sign-up"
                variant="button"
                color="info"
                fontWeight="medium"
                textGradient
              >
                Sign up
              </MDTypography>
            </MDTypography>
          </MDBox>
        </MDBox>
      )}
      {value === 1 && (
        <MDBox component="form" role="form">
          <MDBox my={2}>
            <MDInput
              variant="standard"
              type="email"
              label="Email"
              fullWidth
              onChange={(e) => setEmail(e.target.value)}
            />
          </MDBox>
          <MDBox mb={1}>
            <MDInput
              variant="standard"
              type={showPassword ? "text" : "password"}
              label="Password"
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{
                  cursor: "pointer",
                  userSelect: "none",
                  ml: -1,
                  fontSize: mobileSize ? "12px" : "14px",
                }}
              >
                {mobileSize ? "Remember me" : <>&nbsp;&nbsp;Remember me</>}
              </MDTypography>
            </MDBox>
            <Link
              to="/authentication/forgot-password"
              style={{
                textDecoration: "none",
                color: "#07A0C3",
                fontSize: mobileSize ? "12px" : "14px",
              }}
            >
              Forgot Password ?
            </Link>
          </div>
          <MDBox mt={mobileSize ? 1 : 4} mb={1}>
            <MDButton variant="gradient" color="info" size="large" fullWidth onClick={handleSignIn}>
              Login
            </MDButton>
          </MDBox>
          <MDBox mt={mobileSize ? 1 : 3} textAlign="center">
            <MDTypography variant="button" color="text">
              Don&apos;t have an account?{" "}
              <MDTypography
                component={Link}
                to="/authentication/sign-up"
                variant="button"
                color="info"
                fontWeight="medium"
                textGradient
              >
                Sign up
              </MDTypography>
            </MDTypography>
          </MDBox>
        </MDBox>
      )}
      {snackbar}
    </IllustrationLayout>
  );
}

export default Illustration;
