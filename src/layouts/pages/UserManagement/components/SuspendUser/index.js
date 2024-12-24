/* eslint-disable no-nested-ternary */
import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MDTypography from "components/MDTypography";
import Button from "@mui/material/Button";
import suspendIcon from "assets/images/icons/suspend.png";
import CloseIcon from "@mui/icons-material/Close";
import logger from "utilities/logger";
import CreateSuccess from "./success";
import CreateError from "./error";
import { suspendUser as fetchSuspendUser } from "../../../../../firebase/backend/auth";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "640px",
  width: "100%",
  padding: "16px",
};

export default function SuspendUser({ isOpenModal, handleCloseModal, uid }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const suspend = true;

  const handleGoBack = () => {
    setSuccess(false);
    setError(false);
  };

  const suspendUser = async () => {
    try {
      await fetchSuspendUser(uid, suspend);
      setSuccess(true);
    } catch (e) {
      setError(true);
      logger.error(e);
    }
  };

  return (
    <Modal
      open={isOpenModal}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box
          style={{
            width: "100%",
            borderRadius: "24px",
            backgroundColor: "#fff",
            padding:
              success || error ? "48px" : window.innerWidth < 540 ? "32px 24px" : "48px 100px",
          }}
        >
          <button
            type="button"
            onClick={handleCloseModal}
            style={{
              position: "absolute",
              top: "35px",
              right: "34px",
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
          {success && <CreateSuccess handleGoBack={handleGoBack} />}
          {error && <CreateError handleGoBack={handleGoBack} />}
          {!success && !error && (
            <Grid container direction="column" gap={3}>
              <img
                src={suspendIcon}
                alt="suspen-icon"
                style={{ width: "80px", height: "80px", margin: "0 auto" }}
              />
              <div style={{ width: "100%" }}>
                <MDTypography
                  variant="h2"
                  style={{
                    textAlign: "center",
                    color: "#1C1C1C",
                    fontWeight: 700,
                    fontSize: "32px",
                    paddingBottom: "8px",
                  }}
                >
                  Suspend user
                </MDTypography>
                <MDTypography
                  variant="h2"
                  style={{
                    textAlign: "center",
                    color: "#1C1C1C",
                    fontWeight: 600,
                    fontSize: "16px",
                  }}
                >
                  Are you sure you want to suspend user?
                </MDTypography>
              </div>
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
                onClick={suspendUser}
              >
                Yes, I`m sure
              </Button>
            </Grid>
          )}
        </Box>
      </Box>
    </Modal>
  );
}

SuspendUser.propTypes = {
  isOpenModal: PropTypes.bool.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  uid: PropTypes.string.isRequired,
};
