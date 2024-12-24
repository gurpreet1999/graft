/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";
import check from "assets/images/icons/check.svg";
import logger from "utilities/logger";
import {
  upgradeSubscription,
  downgradeSubscription,
  createSubscriptionCheckoutSession,
} from "../../../../../../../../firebase/backend/payment";
import {
  renderButtonByPlan,
  checkPlan,
  renderPlanPrice,
  renderPlanTitle,
} from "./pricing-plan-utils";

export default function PricingPlan({ plan, currentPlan, setIsPlanChanged }) {
  const [pageWidth, setPageWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setPageWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const changePlan = async () => {
    const action = checkPlan(plan, currentPlan);
    if (action === "Current") {
      return;
    }
    if (action === "Downgrade") {
      try {
        await downgradeSubscription(plan.id);
        setIsPlanChanged(true);
      } catch (error) {
        logger.error(error);
      }
    }
    if (action === "Upgrade") {
      try {
        await upgradeSubscription(plan.id);
        setIsPlanChanged(true);
      } catch (error) {
        logger.error(error);
      }
    }
    if (action === "Buy") {
      try {
        const { checkoutURL } = await createSubscriptionCheckoutSession(plan.id);
        window.location = checkoutURL;
      } catch (error) {
        logger.error(error);
      }
    }
  };
  return (
    <div
      style={{
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "8px",
        background: "#ffffff",
        boxShadow: "0px 2px 4px 0px rgba(57, 69, 72, 0.19)",
        width: pageWidth > 420 ? "372px" : "300px",
        height: "100%",
        position: "relative",
      }}
    >
      {renderPlanTitle(plan, currentPlan)}
      <MDTypography
        style={{
          fontSize: "24px",
          fontWeight: 600,
          color: "#353F46",
        }}
      >
        <Grid item container direction="row" gap="2px">
          {renderPlanPrice(plan)}
        </Grid>
      </MDTypography>
      <ul style={{ width: "100%" }}>
        {plan.features.map((feature) => (
          <li
            key={Math.random()}
            style={{
              display: "flex",
              alignItems: "flex-start",
              padding: "8px 0",
              width: "100%",
            }}
          >
            <img
              src={check}
              alt="check"
              style={{
                width: "20px",
                height: "20px",
                marginRight: "8px",
              }}
            />
            <MDTypography
              style={{
                fontSize: "14px",
                color: "#888",
                fontWeight: 400,
              }}
            >
              {feature}
            </MDTypography>
          </li>
        ))}
        {plan.bonusCredits && (
          <li
            key={Math.random()}
            style={{
              display: "flex",
              alignItems: "flex-start",
              padding: "8px 0",
              width: "100%",
            }}
          >
            <img
              src={check}
              alt="check"
              style={{
                width: "20px",
                height: "20px",
                marginRight: "8px",
              }}
            />
            <MDTypography
              style={{
                fontSize: "14px",
                color: "#888",
                fontWeight: 400,
              }}
            >
              {plan.bonusCredits ? `${plan.bonusCredits} Credits included` : ""}
            </MDTypography>
          </li>
        )}
        {plan.creditsPrice && (
          <li
            key={Math.random()}
            style={{
              display: "flex",
              alignItems: "flex-start",
              padding: "8px 0",
              width: "100%",
            }}
          >
            <img
              src={check}
              alt="check"
              style={{
                width: "20px",
                height: "20px",
                marginRight: "8px",
              }}
            />
            <MDTypography
              style={{
                fontSize: "14px",
                color: "#888",
                fontWeight: 400,
              }}
            >
              {`${plan.creditsPrice}£  Per Bonus Credit`}
            </MDTypography>
          </li>
        )}
      </ul>
      {renderButtonByPlan(plan, currentPlan, changePlan)}
    </div>
  );
}

PricingPlan.propTypes = {
  plan: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    features: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    description: PropTypes.string.isRequired,
    creditsPrice: PropTypes.number.isRequired,
    bonusCredits: PropTypes.number.isRequired,
  }).isRequired,
  currentPlan: PropTypes.number.isRequired,
  setIsPlanChanged: PropTypes.func.isRequired,
};
