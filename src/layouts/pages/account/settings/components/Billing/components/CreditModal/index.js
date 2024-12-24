import Button from "@mui/material/Button";
import MDTypography from "components/MDTypography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import stripeLogo from "assets/images/Billing/stripe.png";
import cardsImg from "assets/images/Billing/cards.png";
import CreateError from "./error";
import CreateSuccess from "./success";
import { createCreditsCheckoutSession } from "../../../../../../../../firebase/backend/payment";

const getInputBorder = (isFocused, inputError) => {
  if (inputError) {
    return "1px solid red";
  }
  if (isFocused) {
    return "1px solid #38B6FF";
  }
  return "1px solid #DCE7ED";
};

function CreditModal({ isOpen, closeModal, openModal, currentPlan }) {
  const [inputCredit, setInputValue] = useState({
    inputValue: "",
    inputFocused: false,
  });
  const [inputError, setInputError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [inputMoney, setInputMoney] = useState("");
  const [pageWidth, setPageWidth] = useState(window.innerWidth);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };
  let priceMultiplier = 0.1;
  if (currentPlan === "small_crew") {
    priceMultiplier = 0.08;
  }
  if (currentPlan === "medium_crew") {
    priceMultiplier = 0.06;
  }
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const successParam = params.get("success");
    if (successParam) {
      openModal();
      if (successParam === "true") setSuccess(true);
      else setError(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setPageWidth(window.innerWidth);
    });
  }, [pageWidth]);

  const handleChange = (event) => {
    setInputError(false);
    const onlyNums = event.target.value.replace(/[^0-9]/g, "");
    if (onlyNums.length <= 16) {
      if (onlyNums.length < 1) {
        setInputValue({
          ...inputCredit,
          inputValue: "",
        });
        setInputMoney(onlyNums);
      } else {
        const numValue = parseInt(onlyNums, 10);
        if (numValue <= 1000000000000) {
          setInputValue({
            ...inputCredit,
            inputValue: onlyNums,
          });
          setInputMoney(onlyNums);
        }
      }
    }
  };
  const numbers = inputCredit.inputValue.replace(/\D/g, "");

  const buyCredits = async () => {
    const credits = Number(inputCredit.inputValue);
    if (credits < 5 || credits > 1000000) {
      setInputError(true);
      return;
    }
    try {
      const { checkoutURL } = await createCreditsCheckoutSession(credits);
      window.location = checkoutURL;
    } catch (err) {
      setError(true);
    }
  };

  const handleGoBack = () => {
    const url = new URL(window.location.toString());
    url.searchParams.delete("success");
    window.history.pushState({}, "", url.toString());
    setSuccess(false);
    setError(false);
    closeModal();
  };

  const closeAllModal = () => {
    setSuccess(false);
    setError(false);
    closeModal();
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: success || error ? "504px" : "640px",
    width: "100%",
    padding: "16px",
    outline: "none !important",
  };

  const getModalPadding = () => {
    if (success || error || pageWidth < 768) {
      return "32px 24px";
    }
    return "48px 100px";
  };

  return (
    <Modal
      open={isOpen}
      onClose={closeAllModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box
          style={{
            width: "100%",
            borderRadius: "24px",
            backgroundColor: "#fff",
            height: success || error ? "320px" : "549px",
            padding: getModalPadding(),
          }}
        >
          <button
            type="button"
            onClick={closeAllModal}
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
          {error && <CreateError handleGoBack={handleGoBack} />}
          {success && <CreateSuccess handleGoBack={handleGoBack} />}
          {!success && !error && (
            <Grid container direction="column" gap="24px">
              <MDTypography
                style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "#1C1C1C",
                  textAlign: "center",
                }}
              >
                Buy more credits
              </MDTypography>
              <MDBox>
                <MDTypography
                  style={{
                    fontSize: "12px",
                    fontWeight: 400,
                    color: "#5F5F5F",
                    paddingBottom: "8px",
                  }}
                >
                  Enter amount of credits
                </MDTypography>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    height: "71px",
                    width: "100%",
                    borderRadius: "8px",
                    textAlign: "center",
                    fontSize: "32px",
                    outline: "none",
                    border: getInputBorder(isFocused, inputError),
                    textDecoration: "none",
                    position: "relative",
                    gap: "6px",
                    paddingBottom: "12px",
                    fontWeight: 600,
                    color: "#1C1C1C",
                  }}
                >
                  {inputError && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "-19px",
                        right: "0",
                        fontSize: "12px",
                        color: "red",
                      }}
                    >
                      Minimum of 5 credits for purchase
                    </span>
                  )}
                  <span style={{ fontSize: "28px" }}>{numbers}</span>
                  <span style={{ fontSize: "16px", paddingBottom: "6px" }}>
                    {inputCredit.inputValue !== "" ? "credits" : ""}
                  </span>
                  <input
                    value={inputCredit.inputValue}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    style={{
                      opacity: 0,
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      top: 0,
                      left: 0,
                    }}
                  />
                  {inputCredit.inputValue === "" && (
                    <div
                      style={{
                        position: "absolute",
                        color: "#1C1C1C",
                        pointerEvents: "none",
                        top: "10px",
                        gap: "8px",
                      }}
                    >
                      <span style={{ fontSize: "28px", paddingBottom: "2px" }}>0</span>
                      <span style={{ fontSize: "16px", paddingBottom: "14px", paddingLeft: "3px" }}>
                        credits
                      </span>
                    </div>
                  )}
                </div>
              </MDBox>
              <MDBox>
                <MDTypography
                  style={{
                    fontSize: "12px",
                    fontWeight: 400,
                    color: "#5F5F5F",
                    paddingBottom: "8px",
                  }}
                >
                  Total to pay
                </MDTypography>
                <input
                  onChange={handleChange}
                  disabled
                  value={`£${(inputMoney * priceMultiplier)
                    .toFixed(2)
                    .toString()
                    .replace(/^£/g, "")}`}
                  style={{
                    width: "100%",
                    height: "71px",
                    borderRadius: "8px",
                    border: "1px solid #DCE7ED",
                    padding: "0 16px",
                    outline: "none",
                    textAlign: "center",
                    fontSize: "28px",
                    fontWeight: 600,
                  }}
                />
              </MDBox>
              <MDBox>
                <MDTypography
                  style={{
                    fontSize: "12px",
                    fontWeight: 400,
                    color: "#5F5F5F",
                    paddingBottom: "8px",
                  }}
                >
                  Payment method
                </MDTypography>
                <Grid
                  container
                  direction="row"
                  gap="16px"
                  justifyContent="space-between"
                  style={{
                    width: "100%",
                    height: "56px",
                    borderRadius: "8px",
                    border: "1px solid #DCE7ED",
                    padding: "16px 24px",
                  }}
                >
                  <MDBox
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "8px",
                      alignItems: "center",
                      fontSize: "16px",
                      color: "#353F46",
                      fontWeight: 500,
                      height: "24px",
                    }}
                  >
                    <img
                      src={stripeLogo}
                      alt="stripe-logo"
                      style={{ width: "24px", height: "24px" }}
                    />
                    Stripe
                  </MDBox>
                  <MDBox>
                    <img
                      src={cardsImg}
                      alt="payments"
                      style={{
                        width: "156px",
                        height: "24px",
                      }}
                    />
                  </MDBox>
                </Grid>
              </MDBox>
              <Button
                variant="contained"
                disabled={inputError}
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
                  height: "48px",
                }}
                onClick={buyCredits}
              >
                Buy credits
              </Button>
            </Grid>
          )}
        </Box>
      </Box>
    </Modal>
  );
}

CreditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  currentPlan: PropTypes.string.isRequired,
};

export default CreditModal;
