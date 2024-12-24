/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-undef */
import React, { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button, Checkbox, Grid, Typography, Link } from "@mui/material";
import CustomSnackbar from "components/Snackbar";
import MDTypography from "components/MDTypography";
import propTypes from "prop-types";

function CheckoutForm({ selectedPlan }) {
  const stripe = useStripe();
  const elements = useElements();
  const [snackbar, setSnackbar] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/authentication/get-access/payment`,
      },
    });

    if (error) {
      setSnackbar(<CustomSnackbar messages={[{ type: "error", text: error.message }]} />);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <div
        style={{
          height: "100%",
          weight: "100%",
          borderRadius: "8px",
          padding: "16px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          border: "1px solid #DCE7ED",
          marginTop: "20px",
        }}
      >
        <Grid container direction="row" justifyContent="space-between" alignItems="flex-end">
          <Grid item>
            <MDTypography
              style={{
                fontSize: "12px",
                fontWeight: 400,
              }}
            >
              Pricing Plan
            </MDTypography>
            <Grid container direction="row" alignItems="flex-end" gap="6px">
              <MDTypography
                style={{
                  fontSize: "28px",
                  fontWeight: 600,
                  color: "#353F46",
                }}
              >
                {selectedPlan.name}
              </MDTypography>
            </Grid>
          </Grid>
          <Grid
            item
            container
            direction="row"
            gap="2px"
            style={{
              height: "40px",
              width: "124px",
            }}
          >
            <MDTypography
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#353F46",
                paddingTop: "6px",
              }}
            >
              £
            </MDTypography>
            <MDTypography
              style={{
                fontSize: "28px",
                fontWeight: 600,
                color: "#353F46",
              }}
            >
              {selectedPlan.price}
            </MDTypography>
            <MDTypography
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#353F46",
                marginTop: "auto",
                paddingBottom: "4px",
              }}
            >
              /mo
            </MDTypography>
          </Grid>
        </Grid>
      </div>
      <Grid container alignItems="center" gap={1} mt={2}>
        <Grid item xs={1}>
          <Checkbox
            size="small"
            defaultChecked
            sx={{
              "&.Mui-checked": {
                color: "#07A0C3",
              },
            }}
          />
        </Grid>
        <Grid item xs={10}>
          <Typography
            variant="body2"
            style={{ fontSize: window.innerWidth < 768 ? "12px" : "14px", marginLeft: "6px" }}
          >
            I agree to the{" "}
            <Link href="#" style={{ color: "#07A0C3" }}>
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link href="#" style={{ color: "#07A0C3" }}>
              Privacy Policy
            </Link>
          </Typography>
        </Grid>
      </Grid>
      <Button
        type="submit"
        disabled={!stripe}
        sx={{
          width: "100%",
          color: "white !important",
          backgroundColor: "#38B6FF !important",
          fontSize: "16px",
          marginTop: "20px",
        }}
      >
        Start free trial
      </Button>
      {snackbar}
    </form>
  );
}

CheckoutForm.propTypes = {
  selectedPlan: propTypes.string.isRequired,
};

export default CheckoutForm;
