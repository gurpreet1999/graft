/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import MDButton from "components/MDButton";
import { Grid } from "@mui/material";
import SnackBar from "../../../../../authentication/components/SnackBar/SnackBar";

import { createAdminUser } from "../../../../../../firebase/backend/auth";

function AddNewAdmin({ show, handleClose }) {
  const [snackMessages, setSnackMessages] = useState([]);
  const maxSnackMessages = 4;
  const [adminData, setAdminData] = useState({
    email: "",
    password: "",
  });
  const handleInputChange = (field) => (e) => {
    setAdminData({
      ...adminData,
      [field]: e.target.value,
    });
  };
  const [showPassword, setShowPassword] = useState(false);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 608,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "24px",
  };
  const handleCloseSnack = (index) => {
    setSnackMessages((prevMessages) => prevMessages.filter((_, i) => i !== index));
  };

  const handleSendInvite = async () => {
    try {
      await createAdminUser(adminData);
      handleClose();
    } catch (error) {
      const newMessages = [...snackMessages, error.message];
      setSnackMessages(newMessages.slice(Math.max(newMessages.length - maxSnackMessages, 0)));
    }
  };

  return (
    <>
      <Modal
        open={show}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <MDBox sx={style}>
          <button
            type="button"
            onClick={handleClose}
            style={{
              position: "absolute",
              top: "42px",
              right: "24px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              outline: "none",
              width: "32px",
              height: "32px",
            }}
          >
            <CloseIcon
              style={{
                width: "32px",
                height: "32px",
                color: "#AAC2D0",
              }}
            />
          </button>
          <MDTypography
            id="modal-modal-title"
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#1C1C1C",
              display: "flex",
              justifyContent: "center",
              marginBottom: "8px",
            }}
          >
            Add New Admin
          </MDTypography>
          <MDTypography
            id="modal-modal-title"
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#5F5F5F",
              display: "flex",
              justifyContent: "center",
              marginBottom: "24px",
            }}
          >
            We will send an email with invitation
          </MDTypography>
          <MDBox
            component="form"
            px={3}
            style={{
              maxWidth: "408px",
              margin: "0 auto",
            }}
          >
            <Grid container spacing={3}>
              <Grid
                item
                xs={12}
                sm={12}
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <MDBox component="form" role="form">
                  <MDBox mb={2}>
                    <MDInput
                      variant="standard"
                      type="email"
                      label="Email"
                      fullWidth
                      value={adminData.email}
                      onChange={handleInputChange("email")}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      variant="standard"
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      fullWidth
                      value={adminData.password}
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
                </MDBox>
                <MDButton
                  variant="gradient"
                  size="large"
                  fullWidth
                  onClick={() => {
                    handleSendInvite();
                  }}
                  style={{
                    background: "#38B6FF",
                    boxShadow:
                      "0px 3px 1px -2px rgba(0, 0, 0, 0.20), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
                    color: "white",
                  }}
                >
                  Send Invite
                </MDButton>
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
      </Modal>
      <SnackBar errorMessages={snackMessages} handleCloseSnack={handleCloseSnack} />
    </>
  );
}

export default AddNewAdmin;
