/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/no-unresolved */
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PropTypes from "prop-types";
import steps from "assets/images/steps3-3.svg";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function Billing({ clientSecret, selectedPlan }) {
  const options = {
    clientSecret,
    appearance: {},
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <div style={{ width: "100%", textAlign: "center" }}>
        <img
          src={steps}
          alt="steps"
          style={{
            margin: "24px auto",
          }}
        />
      </div>

      <span
        style={{
          fontSize: "16px",
          color: "#1C1C1C",
          fontStyle: "normal",
          fontWeight: 600,
          display: "block",
          fontFamily: "Montserrat",
          paddingBottom: "8px",
        }}
      >
        Enter payment details
      </span>
      <CheckoutForm selectedPlan={selectedPlan} />
    </Elements>
  );
}

Billing.propTypes = {
  clientSecret: PropTypes.string.isRequired,
  selectedPlan: PropTypes.string.isRequired,
};

export default Billing;
