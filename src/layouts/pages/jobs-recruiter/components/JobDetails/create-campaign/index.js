/* eslint-disable no-nested-ternary */
import React, { useState, useRef } from "react";
import FormField from "layouts/pages/account/components/FormField";
import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MDTypography from "components/MDTypography";
import CreateIcon from "@mui/icons-material/Create";
import Button from "@mui/material/Button";
import phoneMockup from "assets/images/search/phoneMockup.png";
import CloseIcon from "@mui/icons-material/Close";
import CreateError from "./error";
import CreateSuccess from "./success";
import { createSMSCampaignByJob } from "../../../../../../firebase/backend/sms-campaign";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "640px",
  width: "100%",
  padding: "16px",
};

export default function CreateCampaign({ isOpenModal, handleCloseModal, candidateCount, jobId }) {
  const [formData, setFormData] = useState({
    candidateNumber: "",
    mailText:
      "The Sample Restaurant Is Looking For Waiting Staff Urgently. \n Liverpool Street - EC2M \n Starting ASAP \n £15 Per Hour \n Call George @ The Sample Restaurant on 07700 340000",
  });
  const [isInputChange, setIsInputChange] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [newMailText, setNewMailText] = useState(formData.mailText);
  const textAreaRef = useRef(null);

  const createCampaign = async () => {
    try {
      await createSMSCampaignByJob({
        message: newMailText,
        amount_of_candidates: Number(formData.candidateNumber),
        job_id: jobId,
      });
      setSuccess(true);
    } catch (err) {
      setError(true);
    }
  };

  const handleChangeNumber = (e) => {
    setFormData({
      ...formData,
      candidateNumber: e.target.value,
    });
  };

  const handleChangeMailText = (e) => {
    setNewMailText(e.target.value);
  };

  const handleSaveChange = () => {
    setFormData({
      ...formData,
      mailText: newMailText,
    });
    setIsInputChange(false);
  };

  const handleCancelChange = () => {
    setNewMailText(formData.mailText);
    setIsInputChange(false);
  };

  const handleEditClick = () => {
    setIsInputChange(true);
    setTimeout(() => textAreaRef.current.focus(), 0);
  };

  const handleGoBack = () => {
    setSuccess(false);
    setError(false);
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
            minHeight: success || error ? "341px" : "608px",
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
          {success && <CreateSuccess />}
          {error && <CreateError handleGoBack={handleGoBack} />}
          {!success && !error && (
            <Grid container direction="column" gap={3}>
              <Grid item>
                <MDTypography
                  style={{
                    fontSize: window.innerWidth < 540 ? "22px" : "32px",
                    fontWeight: "bold",
                    lineHeight: "1.4",
                    fontFamily: "Montserrat",
                    color: "#1C1C1C",
                    textAlign: "center",
                  }}
                >
                  Create Campaign
                </MDTypography>
              </Grid>
              <Grid item>
                <MDTypography
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    lineHeight: "1.37",
                    fontFamily: "Montserrat",
                    color: "#5F5F5F",
                    textAlign: "center",
                  }}
                >
                  <span style={{ color: "#07A0C3" }}>
                    {candidateCount && candidateCount === "" ? 0 : candidateCount}{" "}
                  </span>
                  Candidates Matched
                </MDTypography>
              </Grid>
              <Grid item>
                <FormField
                  label="Number of candidates you want to reach"
                  placeholder="Enter the number of candidates you want to reach"
                  value={formData.candidateNumber}
                  onChange={(e) => handleChangeNumber(e)}
                  type="number"
                />
              </Grid>
              <Grid
                item
                container
                px={1}
                pt={1}
                justifyContent="space-between"
                alignItems="center"
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  boxShadow:
                    "0px 4px 12px 4px rgba(38, 42, 63, 0.06), 0px 2px 4px -1px rgba(48, 57, 65, 0.16)",
                  height: "278px",
                  overflow: "hidden",
                }}
              >
                <Grid item container justifyContent="space-between">
                  <MDTypography style={{ fontSize: "12px", fontWeight: "400" }}>SMS</MDTypography>
                  <Grid item container direction="row" justifyContent="flex-end" gap={1} xs={8}>
                    {isInputChange && (
                      <Grid item container direction="row" justifyContent="flex-end" gap={1}>
                        <Button
                          variant="contained"
                          style={{
                            color: "#fff",
                            padding: "4px 10px",
                            borderRadius: "4px",
                            boxShadow:
                              "0px 3px 1px -2px rgba(0, 0, 0, 0.20), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
                            backgroundColor: "#38B6FF",
                            fontFamily: "Roboto, sans-serif",
                            fontSize: "15px",
                            fontWeight: "500",
                            height: "30px",
                          }}
                          onClick={handleSaveChange}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outlined"
                          style={{
                            color: "#D32F2F",
                            padding: "4px 10px",
                            borderRadius: "4px",
                            boxShadow:
                              "0px 3px 1px -2px rgba(0, 0, 0, 0.20), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
                            backgroundColor: "#fff",
                            fontFamily: "Roboto, sans-serif",
                            fontSize: "15px",
                            fontWeight: "500",
                            height: "30px",
                            border: "1px solid #D32F2F",
                          }}
                          onClick={handleCancelChange}
                        >
                          Cancel
                        </Button>
                      </Grid>
                    )}
                    {!isInputChange && (
                      <Button
                        variant="outlined"
                        style={{
                          color: "#38B6FF",
                          padding: "4px 10px",
                          borderRadius: "4px",
                          boxShadow:
                            "0px 3px 1px -2px rgba(0, 0, 0, 0.20), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
                          backgroundColor: "#fff",
                          border: "1px solid #38B6FF",
                          fontFamily: "Roboto, sans-serif",
                          fontSize: "15px",
                          fontWeight: "500",
                          height: "30px",
                        }}
                        onClick={handleEditClick}
                      >
                        <CreateIcon /> Edit
                      </Button>
                    )}
                  </Grid>
                </Grid>
                <div
                  style={{
                    margin: "34px auto",
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img src={phoneMockup} alt="phone-mockup" />
                  <textarea
                    ref={textAreaRef}
                    style={{
                      position: "absolute",
                      height: "100px",
                      width: "240px",
                      resize: "none",
                      border: "none",
                      padding: "8.51px",
                      backgroundColor: "#DCE7ED",
                      borderRadius: "11px",
                      color: "#1C1C1C",
                      fontFamily: "Roboto, sans-serif",
                      fontSize: "12px",
                    }}
                    disabled={!isInputChange}
                    value={newMailText}
                    onChange={(e) => handleChangeMailText(e)}
                  />
                </div>
              </Grid>
              <Grid>
                <MDTypography
                  style={{
                    fontSize: "12px",
                    fontWeight: "400",
                    lineHeight: "1.37",
                    fontFamily: "Montserrat",
                    color: "#5F5F5F",
                  }}
                >
                  Total Credits
                </MDTypography>
                <MDTypography
                  style={{
                    fontSize: "28px",
                    fontWeight: "600",
                    lineHeight: "1.37",
                    fontFamily: "Montserrat",
                    color: "#1C1C1C",
                    textAlign: "center",
                  }}
                >
                  {formData.candidateNumber === "" ? 0 : formData.candidateNumber}
                  <span style={{ fontSize: "16px", paddingLeft: "2px" }}>credits</span>
                </MDTypography>
              </Grid>
              <Grid>
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
                    width: "100%",
                  }}
                  onClick={createCampaign}
                >
                  Send Campaign
                </Button>
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>
    </Modal>
  );
}

CreateCampaign.defaultProps = {
  candidateCount: "",
};

CreateCampaign.propTypes = {
  isOpenModal: PropTypes.bool.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  candidateCount: PropTypes.number,
  jobId: PropTypes.string.isRequired,
};
