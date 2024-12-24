import MDTypography from "components/MDTypography";

/**
 * Renders a button based on the given plan, current plan, and change plan function.
 * The button's appearance and behavior depend on the relationship between the plan and the current plan.
 * @param {object} plan - The plan object.
 * @param {string} currentPlan - The current plan.
 * @param {function} changePlan - The function to change the plan.
 * @returns {JSX.Element} - The rendered button.
 */
export const renderButtonByPlan = (plan, currentPlan, changePlan) => {
  if (plan.id === "big_house") {
    return (
      <button
        type="button"
        onClick={changePlan}
        disabled={plan.price === currentPlan}
        style={{
          color: "#38B6FF",
          padding: "8px 22px",
          borderRadius: "4px",
          backgroundColor: "#fff",
          fontFamily: "Roboto, sans-serif",
          fontSize: "15px",
          fontWeight: "500",
          width: "100%",
          outline: "none",
          border: "1px solid #38B6FF",
          marginTop: "auto",
          cursor: plan.price === currentPlan ? "not-allowed" : "pointer",
          textTransform: "uppercase",
        }}
      >
        Get Contact
      </button>
    );
  }
  if (plan.price > currentPlan) {
    return (
      <button
        type="button"
        onClick={changePlan}
        style={{
          color: "#fff",
          padding: "8px 22px",
          borderRadius: "4px",
          backgroundColor: "#38B6FF",
          fontFamily: "Roboto, sans-serif",
          fontSize: "15px",
          fontWeight: "500",
          width: "100%",
          outline: "none",
          border: "none",
          marginTop: "auto",
          cursor: "pointer",
          textTransform: "uppercase",
        }}
      >
        Upgrade plan
      </button>
    );
  }
  if (plan.price < currentPlan) {
    return (
      <button
        type="button"
        onClick={changePlan}
        disabled={plan.price === currentPlan}
        style={{
          color: "#38B6FF",
          padding: "8px 22px",
          borderRadius: "4px",
          backgroundColor: "#fff",
          fontFamily: "Roboto, sans-serif",
          fontSize: "15px",
          fontWeight: "500",
          width: "100%",
          outline: "none",
          border: "1px solid #38B6FF",
          marginTop: "auto",
          cursor: "pointer",
          textTransform: "uppercase",
        }}
      >
        Downgrade plan
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={changePlan}
      disabled={plan.price === currentPlan}
      style={{
        color: "#888",
        padding: "8px 22px",
        borderRadius: "4px",
        backgroundColor: "#D6D6D6",
        fontFamily: "Roboto, sans-serif",
        fontSize: "15px",
        fontWeight: "500",
        width: "100%",
        outline: "none",
        border: "none",
        marginTop: "auto",
        cursor: "not-allowed",
        textTransform: "uppercase",
      }}
    >
      Current Plan
    </button>
  );
};

/**
 * Checks the relationship between the given plan and the current plan.
 * @param {object} plan - The plan object.
 * @param {string} currentPlan - The current plan.
 * @returns {string} - The relationship between the plan and the current plan.
 */
export const checkPlan = (plan, currentPlan) => {
  if (plan.price === currentPlan) {
    return "Current";
  }
  if (plan.price < currentPlan) {
    return "Downgrade";
  }
  if (currentPlan === 0) {
    return "Buy";
  }
  return "Upgrade";
};

/**
 * Renders the price of the given plan.
 * @param {object} plan - The plan object.
 * @returns {JSX.Element} - The rendered price.
 */
export function renderPlanPrice(plan) {
  if (plan.price || plan.price === 0) {
    return (
      <>
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
            fontSize: "32px",
            fontWeight: 600,
            color: "#353F46",
          }}
        >
          {plan.price}
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
      </>
    );
  }
  return (
    <MDTypography
      style={{
        fontSize: "32px",
        fontWeight: 600,
        color: "#353F46",
      }}
    >
      Individual
    </MDTypography>
  );
}

/**
 * Renders the title of the given plan with specific styles based on the current plan.
 * @param {object} plan - The plan object.
 * @param {string} currentPlan - The current plan.
 * @returns {JSX.Element} - The rendered title.
 */
export function renderPlanTitle(plan, currentPlan) {
  if (plan.price === currentPlan) {
    return (
      <MDTypography
        style={{
          padding: "4px 32px",
          fontSize: "14px",
          color: "#fff",
          fontWeight: 500,
          background: "#38B6FF",
          position: "absolute",
          top: "-16px",
          borderRadius: "20px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {plan.title}
      </MDTypography>
    );
  }
  return (
    <MDTypography
      style={{
        padding: "4px 32px",
        fontSize: "14px",
        color: "#353F46",
        fontWeight: 500,
        background: "#DCE7ED",
        position: "absolute",
        top: "-16px",
        borderRadius: "20px",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      {plan.title}
    </MDTypography>
  );
}
