/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/no-unresolved */
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PropTypes from "prop-types";
import steps from "assets/images/steps-full.svg";
import { useSelector } from "react-redux";
import { userSelector } from "store/user/selectors";
import CheckoutForm from "./CheckoutForm";
import {
  fetchPaymentPlans,
  fetchTrialSubscription,
} from "../../../../../../../../firebase/backend/payment";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function Billing({ clientSecret, selectedPlan }) {
  const [secret, setSecret] = useState(clientSecret);
  const [plan, setPlan] = useState(selectedPlan);
  const [options, setOptions] = useState({}); // eslint-disable-line no-unused-vars
  const { user } = useSelector(userSelector);

  useEffect(() => {
    if (!secret) return;
    setOptions({
      clientSecret: secret,
      appearance: {},
    });
  }, [secret]);

  useEffect(() => {
    if (secret || !plan) return;
    fetchTrialSubscription(plan.id).then((res) => {
      setSecret(res.client_secret);
    });
  }, [plan]);

  useEffect(() => {
    if (plan) return;
    fetchPaymentPlans().then((plans) => {
      const planCurrent = plans.find((p) => p.id === user?.pricing_plan);
      setPlan(planCurrent);
    });
  }, [user]);

  if (!secret || !options.clientSecret) return null;

  return (
    <Elements stripe={stripePromise} options={options}>
      <div style={{ width: "100%", textAlign: "center" }}>
        <h2
          style={{
            fontSize: "32px",
            color: "#1C1C1C",
            fontStyle: "normal",
            fontWeight: 700,
            display: "block",
            fontFamily: "Montserrat",
            textAlign: "center",
            lineHeight: "40px",
          }}
        >
          Enter payment details
        </h2>
        <img
          src={steps}
          alt="steps"
          style={{
            margin: "24px auto",
          }}
        />
      </div>
      <CheckoutForm selectedPlan={plan} />
    </Elements>
  );
}

Billing.propTypes = {
  clientSecret: PropTypes.string.isRequired,
  selectedPlan: PropTypes.string.isRequired,
};

export default Billing;
