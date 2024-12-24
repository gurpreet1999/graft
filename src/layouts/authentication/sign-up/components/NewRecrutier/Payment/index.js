/* eslint-disable react/no-unescaped-entities */
import * as React from "react";
import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import arrow from "assets/images/arrow.svg";
import { Button } from "@mui/material";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import IllustrationLayout from "layouts/authentication/components/IllustrationLayout";
import bgImage from "assets/images/illustrations/Illustration-auth.png";
import logo from "assets/images/illustrations/LogoCraft.svg";
import Grid from "@mui/material/Grid";
import success from "assets/images/search/success.svg";
import { useLocation, useNavigate } from "react-router-dom";
import ChoosePlan from "./ChoosePlan";
import Billing from "./Billing";
import { fetchTrialSubscription } from "../../../../../../firebase/backend/payment";

const getButtonText = (step, isSuccess) => {
  if (isSuccess) {
    return "Proceed to dashboard";
  }
  switch (step) {
    case 0:
      return "Proceed to payment";
    case 1:
      return "Start free trial";
    default:
      return "Sign Up";
  }
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "24px",
};

function getSteps() {
  return ["User Info", "Address", "Waiting"];
}

function getStepContent(stepIndex, handleSelectPlan, clientSecret, selectedPlan) {
  switch (stepIndex) {
    case 0:
      return <ChoosePlan setSelectedPlan={handleSelectPlan} />;
    case 1:
      return <Billing clientSecret={clientSecret} selectedPlan={selectedPlan} />;
    default:
      return null;
  }
}

function Payment() {
  const [activeStep, setActiveStep] = useState(0);
  const [open, setOpen] = React.useState(false);
  const steps = getSteps();
  // eslint-disable-next-line no-unused-vars
  const isLastStep = activeStep === steps.length - 1;
  // eslint-disable-next-line no-unused-vars
  const [snackbar, setSnackbar] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [errorText, setErrorText] = useState("Error");
  const [isMobileSize, setIsMobileSize] = useState(window.innerWidth < 768);
  const [clientSecret, setClientSecret] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const nav = useNavigate();

  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const isSuccess = query.get("success") === "true";

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileSize(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleProceedPayment = async () => {
    if (isSuccess) {
      nav("/dashboard");
    }
    if (activeStep === 0) {
      fetchTrialSubscription(selectedPlan.id).then((res) => {
        setClientSecret(res.client_secret);
        setActiveStep(activeStep + 1);
      });
    }
    return null;
  };

  const handleBack = () =>
    activeStep === 0 ? window.history.back() : setActiveStep(activeStep - 1);

  const handleClose = () => setOpen(false);

  return (
    <IllustrationLayout
      title={!isSuccess && "Welcome!"}
      logo={window.innerHeight > 1047 ? logo : null}
      description={!isSuccess && "To complete registration, follow the steps below"}
      illustration={bgImage}
    >
      <Card sx={{ height: "100%", boxShadow: "unset" }}>
        <MDBox p={isMobileSize ? 1 : 2}>
          <MDBox>
            {isSuccess ? (
              <Grid container gap={3} direction="column" alignItems="center">
                <img src={success} alt="success" style={{ width: "80px", height: "80px" }} />
                <Grid item container gap="6px" direction="column">
                  <MDTypography
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      lineHeight: "1.4",
                      fontFamily: "Montserrat",
                      color: "#1C1C1C",
                      textAlign: "center",
                    }}
                  >
                    Thank you for your registration!
                  </MDTypography>
                </Grid>
              </Grid>
            ) : (
              getStepContent(activeStep, handleSelectPlan, clientSecret, selectedPlan)
            )}
            <MDBox mt={2} width="100%" display="flex" justifyContent="space-between">
              {!isSuccess && (
                <Button
                  variant="gradient"
                  color="light"
                  onClick={handleBack}
                  uppercase
                  style={{
                    backgroundColor: "none",
                    outline: "none",
                    background: "#EBF2F5",
                    padding: "10px",
                    width: "44px",
                    height: "44px",
                    position: "absolute",
                    left: isMobileSize ? "-7px" : "-40px",
                    top: "-100px",
                  }}
                >
                  <img src={arrow} alt="arrow" />
                </Button>
              )}
              {activeStep === 0 && (
                <MDButton
                  variant="button"
                  {...(activeStep === 0 ? { fullWidth: true } : { forContent: true })}
                  onClick={handleProceedPayment}
                  sx={{
                    width: "100%",
                    color: "white !important",
                    backgroundColor: "#38B6FF !important",
                    fontSize: "16px",
                    height: "42px",
                    borderRadius: "4px",
                  }}
                >
                  {getButtonText(activeStep, isSuccess)}
                </MDButton>
              )}
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
      {snackbar}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
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
          <Typography id="modal-modal-title">Error</Typography>
          <Typography id="modal-modal-description" variant="h6" component="h2" sx={{ mt: 2 }}>
            {errorText}
          </Typography>
        </Box>
      </Modal>
    </IllustrationLayout>
  );
}

export default Payment;
