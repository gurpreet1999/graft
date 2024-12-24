/* eslint-disable react/no-unescaped-entities */
import * as React from "react";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";
import arrow from "assets/images/arrow.svg";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Address from "layouts/authentication/sign-up/components/NewRecrutier/components/Address";
import validations from "layouts/authentication/sign-up/components/NewRecrutier/schemas/validations";
import form from "layouts/authentication/sign-up/components/NewRecrutier/schemas/form";
import initialValues from "layouts/authentication/sign-up/components/NewRecrutier/schemas/initialValues";
import PropTypes from "prop-types";

// Firebase Auth
import CustomSnackbar from "components/Snackbar";
import { signUpAsRecruiter } from "../../../../../firebase/auth";

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

function NewUser({ userInfo, handleBack }) {
  const [open, setOpen] = React.useState(false);
  const { formId, formField } = form;
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

  const handleClose = () => setOpen(false);

  const nav = useNavigate();

  const submitForm = async (values, actions) => {
    try {
      await signUpAsRecruiter({
        email: userInfo.email,
        password: userInfo.password,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        phoneNumber: values.phoneNumber,
        postalCode: values.postalCode,
        companyName: values.companyName,
      });

      actions.setSubmitting(false);
      actions.resetForm();
    } catch (error) {
      setSnackbar(<CustomSnackbar messages={[{ type: "error", text: error.message }]} />);
      throw new Error(error);
    }
  };

  const handleSubmit = async (values, actions) => {
    try {
      await submitForm(values, actions);
      nav("/authentication/billing");
    } catch (error) {
      setErrorText("Oops... Something went wrong. Please try again");
      setSnackbar(<CustomSnackbar messages={[{ type: "error", text: error.message }]} />);
      setOpen(true);
    }
  };

  return (
    <>
      <Formik initialValues={initialValues} validationSchema={validations} onSubmit={handleSubmit}>
        {({ values, errors, touched }) => (
          <Form id={formId} autoComplete="off">
            <Card sx={{ height: "100%", boxShadow: "unset" }}>
              <MDBox p={isMobileSize ? 1 : 2}>
                <MDBox>
                  <Address
                    formData={{
                      values,
                      touched,
                      formField,
                      errors,
                    }}
                  />
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
                      sx={{
                        width: "100%",
                        color: "white !important",
                        backgroundColor: "#38B6FF !important",
                        fontSize: "16px",
                      }}
                    >
                      Finish
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

NewUser.propTypes = {
  userInfo: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
  handleBack: PropTypes.func.isRequired,
};

export default NewUser;
