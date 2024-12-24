/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/no-unresolved */
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PropTypes from "prop-types";
import steps from "assets/images/steps-full.svg";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function Billing({ clientSecret, selectedPlan }) {
  const options = {
    clientSecret,
    appearance: {},
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <div style={{ color: "#1C1C1C", fontSize: "32px", textAlign: "center", fontWeight: 700 }}>
        Enter payment details
      </div>
      <div style={{ width: "100%", textAlign: "center" }}>
        <img
          src={steps}
          alt="steps"
          style={{
            margin: "24px auto",
          }}
        />
      </div>

      <div
        style={{
          fontSize: "12px",
          color: "#888",
          marginTop: "12px",
          lineHeight: "1.3",
        }}
      >
        * No payments due now. On 17 May 2024 you will be charged $39.99 automatically. Cancel any
        time
      </div>
      <CheckoutForm selectedPlan={selectedPlan} />
    </Elements>
  );
}

Billing.propTypes = {
  clientSecret: PropTypes.string.isRequired,
  selectedPlan: PropTypes.string.isRequired,
};

export default Billing;
