import * as React from "react";
import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import arrow from "assets/images/arrow.svg";
import Button from "@mui/material/Button";
import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CustomSnackbar from "components/Snackbar";
import PropTypes from "prop-types";
import Address from "./components/Address";
import AddressHospitality from "./components/AddressHospitality";
import Sector from "./components/Sector";
import validations from "./schemas/validations";
import form from "./schemas/form";
import initialValues from "./schemas/initialValues";
import { signUpAsCandidate } from "../../../../../firebase/auth";

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

const getButtonText = (step) => {
  switch (step) {
    case 0:
      return "Next";
    case 1:
      return "Finish";
    default:
      return "Next";
  }
};

function getSteps() {
  return ["Sector", "Address"];
}

function getSectorsForm(formData) {
  if (formData.values.experience.sector === "Hospitality") {
    return <AddressHospitality formData={formData} />;
  }
  return <Address formData={formData} />;
}

function getStepContent(stepIndex, formData) {
  switch (stepIndex) {
    case 0:
      return <Sector formData={formData} />;
    case 1:
      return getSectorsForm(formData);
    default:
      return null;
  }
}

function NewCandidate({ userInfo, handleBackToUserData }) {
  const [activeStep, setActiveStep] = useState(0);
  const [open, setOpen] = React.useState(false);
  const steps = getSteps();
  const { formId, formField } = form;
  const currentValidation = validations[activeStep];
  const isLastStep = activeStep === steps.length - 1;
  const nav = useNavigate();
  const [snackbar, setSnackbar] = useState(null);
  const [errorText, setErrorText] = useState("Error");
  const [isMobileSize, setIsMobileSize] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobileSize(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleBack = () => {
    if (activeStep === 0) {
      handleBackToUserData();
    } else {
      setActiveStep(activeStep - 1);
    }
  };

  const handleClose = () => setOpen(false);
  const submitForm = async (values, actions) => {
    const experience = {
      sector: values.experience.sector,
      mainTypeOfEstablishment: values.experience.mainTypeOfEstablishment,
      secondTypeOfEstablishment: values.experience.secondTypeOfEstablishment,
      yearsOfExperience: values.experience.yearsOfExperience,
      firstRolePreference: values.experience.firstRolePreference,
      secondRolePreference: values.experience.secondRolePreference,
      constructionRole: values.experience.constructionRole,
      constructionCardType: values.experience.constructionCardType,
    };

    const filteredExperience = Object.fromEntries(
      // eslint-disable-next-line no-unused-vars
      Object.entries(experience).filter(([_, value]) => value)
    );

    try {
      await signUpAsCandidate({
        email: userInfo.email,
        password: userInfo.password,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        phoneNumber: values.phoneNumber,
        postalCode: values.postalCode,
        agreedToBeContacted: values.agreedToBeContacted,
        dailyJobUpdatePreference: values.dailyJobUpdatePreference,
        verified: false,
        experience: filteredExperience,
      });
      actions.setSubmitting(false);
      actions.resetForm();
    } catch (error) {
      setSnackbar(<CustomSnackbar messages={[{ type: "error", text: error.message }]} />);
      throw error;
    }
  };

  const handleSubmit = async (values, actions) => {
    if (isLastStep) {
      try {
        await submitForm(values, actions);
      } catch (error) {
        if (error.errors && Array.isArray(error.errors)) {
          error.errors.forEach((errorItem) => {
            setSnackbar(<CustomSnackbar messages={[{ type: "error", text: errorItem.message }]} />);
            setOpen(true);
          });
        } else {
          setErrorText("Oops... Something went wrong. Please try again");
          setSnackbar(<CustomSnackbar messages={[{ type: "error", text: error.message }]} />);
          setOpen(true);
        }
        return;
      }
      nav("/dashboard");
    } else {
      setActiveStep(activeStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  };
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={currentValidation}
        onSubmit={(values, actions) => {
          handleSubmit(values, actions);
        }}
      >
        {({ values, errors, touched }) => (
          <Form id={formId} autoComplete="off">
            <Card sx={{ height: "100%", boxShadow: "unset" }}>
              <MDBox p={isMobileSize ? 1 : 2}>
                <MDBox>
                  {getStepContent(activeStep, {
                    values,
                    touched,
                    formField,
                    errors,
                  })}
                  <MDBox mt={2} width="100%" display="flex" justifyContent="space-between">
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
                    <MDButton
                      type="submit"
                      {...(activeStep === 0 ? { fullWidth: true } : { forContent: true })}
                      sx={{
                        width: "100%",
                        color: "white !important",
                        backgroundColor: "#38B6FF !important",
                      }}
                    >
                      {getButtonText(activeStep)}
                    </MDButton>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Form>
        )}
      </Formik>
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
    </>
  );
}

NewCandidate.propTypes = {
  userInfo: PropTypes.shape({
    email: PropTypes.string,
    password: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,
  handleBackToUserData: PropTypes.func.isRequired,
};

export default NewCandidate;
