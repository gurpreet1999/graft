import React, { useState, useEffect, useCallback } from "react";
import billingIcon from "assets/images/icons/dashboard/billing.png";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { formatPlan } from "utilities/helpers";
import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";
import { userSelector } from "store/user/selectors";
import { fetchPaymentPlans } from "../../../../../firebase/backend/payment";
import CreditModal from "../../../account/settings/components/Billing/components/CreditModal";
import AbortSubscriptionModal from "../../../account/settings/components/Billing/components/AbortSubscriptionModal";

const getProgressWidth = (daysLeft) => `${(daysLeft / 30) * 100}%`;

const getProgressColor = (daysLeft) => {
  if (daysLeft > 12) {
    return "#2196F3";
  }
  if (daysLeft > 6) {
    return "#F08725";
  }
  return "#D32F2F";
};

export default function SmallBilling() {
  const { user } = useSelector(userSelector);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAbortModalOpen, setIsAbortModalOpen] = useState(false);
  const currentPlan = user?.pricing_plan;
  const [planPricing, setPlanPricing] = useState();

  const daysLeft = 28;

  useEffect(() => {
    fetchPaymentPlans().then((fetchedPlans) => {
      setPlanPricing(fetchedPlans.find((plan) => plan.id === currentPlan)?.price);
    });
  }, [user]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const openAbortModal = () => {
    setIsAbortModalOpen(true);
  };

  const handleCloseModal = useCallback(() => {
    const url = new URL(window.location.toString());
    url.searchParams.delete("success");
    window.history.pushState({}, "", url.toString());
    setIsModalOpen(false);
  }, []);
  return (
    <MDBox
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#FFF",
        borderRadius: "24px",
        padding: "16px 24px",
        gap: "16px",
        position: "relative",
      }}
    >
      <img
        src={billingIcon}
        alt="billing"
        style={{
          position: "absolute",
          top: "-28px",
          left: "10px",
        }}
      />
      <MDTypography
        style={{
          paddingLeft: "80px",
          fontSize: "16px",
          color: "#353F46",
          fontWeight: 700,
        }}
      >
        Billing Info
      </MDTypography>
      <div
        style={{
          height: "100%",
          weight: "100%",
          borderRadius: "8px",
          padding: "16px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          border: "1px solid #DCE7ED",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "6px",
            flexDirection: "column",
          }}
        >
          <MDTypography
            style={{
              fontSize: "12px",
              color: "$5F5F5F",
            }}
          >
            Free trial
          </MDTypography>
          <div
            style={{
              display: "flex",
              gap: "6px",
              flexDirection: "row",
              alignItems: "flex-end",
            }}
          >
            <MDTypography
              style={{
                fontSize: "28px",
                color: "$353F46",
                fontFamily: "Montserrat",
                fontWeight: 600,
              }}
            >
              {daysLeft}
            </MDTypography>
            <MDTypography
              style={{
                fontSize: "16px",
                color: "$353F46",
                fontFamily: "Montserrat",
                fontWeight: 600,
                paddingBottom: "6px",
              }}
            >
              trial days left
            </MDTypography>
            <Button
              style={{
                color: "#38B6FF",
                borderRadius: "4px",
                fontFamily: "Roboto, sans-serif",
                fontSize: "13px",
                maxHeight: "30px",
                fontWeight: "500",
                maxWidth: "162px",
                padding: "0px 5px",
                marginLeft: "auto",
              }}
              onClick={openAbortModal}
            >
              Cancel subscription
            </Button>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            position: "relative",
            height: "4px",
            backgroundColor: "#D6D6D6",
          }}
        >
          <span
            style={{
              position: "absolute",
              left: "0",
              top: "0",
              width: getProgressWidth(daysLeft),
              height: "100%",
              backgroundColor: getProgressColor(daysLeft),
            }}
          />
        </div>
      </div>
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
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "6px",
            flexDirection: "column",
          }}
        >
          <MDTypography
            style={{
              fontSize: "12px",
              color: "$5F5F5F",
            }}
          >
            Balance
          </MDTypography>
          <div
            style={{
              display: "flex",
              gap: "6px",
              flexDirection: "row",
              alignItems: "flex-end",
            }}
          >
            <MDTypography
              style={{
                fontSize: "28px",
                color: "$353F46",
                fontFamily: "Montserrat",
                fontWeight: 600,
              }}
            >
              {String(user?.credits)}
            </MDTypography>
            <MDTypography
              style={{
                fontSize: "16px",
                color: "$353F46",
                fontFamily: "Montserrat",
                fontWeight: 600,
                paddingBottom: "6px",
              }}
            >
              credits
            </MDTypography>
            <Button
              variant="contained"
              style={{
                color: "#fff",
                borderRadius: "4px",
                backgroundColor: "#38B6FF",
                fontFamily: "Roboto, sans-serif",
                fontSize: "13px",
                fontWeight: "500",
                maxWidth: "146px",
                maxHeight: "30px",
                padding: "0px 10px",
                marginLeft: "auto",
              }}
              onClick={openModal}
            >
              Buy more credits
            </Button>
          </div>
        </div>
      </div>
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
        }}
      >
        <div>
          <MDTypography
            style={{
              fontSize: "12px",
              color: "$5F5F5F",
              justifyContent: "space-between",
            }}
          >
            Pricing Plan
          </MDTypography>
          <div
            style={{
              display: "flex",
              gap: "6px",
              flexDirection: "row",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <MDTypography
              style={{
                fontSize: "28px",
                fontWeight: 600,
                color: "#353F46",
              }}
            >
              {formatPlan(user?.pricing_plan) || "Standard"}
            </MDTypography>
            <Grid
              item
              container
              direction="row"
              gap="2px"
              style={{
                height: "40px",
                width: "117px",
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
                {planPricing}
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
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "6px",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            height: "30px",
            flexWrap: "wrap",
          }}
        >
          <MDTypography
            style={{
              fontSize: "14px",
              color: "$5F5F5F",
            }}
          >
            Renews (Nov 16, 2024)
          </MDTypography>
          <Link
            to="pricing-plan"
            style={{
              fontSize: "13px",
              color: "#38B6FF",
              textDecoration: "none",
              height: "22px",
              fontWeight: 500,
              lineHeight: "1.7",
              textTransform: "uppercase",
              maxHeight: "30px",
              padding: "0px 5px",
            }}
          >
            Update plan
          </Link>
        </div>
      </div>
      <CreditModal
        isOpen={isModalOpen}
        closeModal={handleCloseModal}
        openModal={openModal}
        currentPlan={user.pricing_plan}
      />
      <AbortSubscriptionModal
        isOpen={isAbortModalOpen}
        closeModal={() => setIsAbortModalOpen(false)}
      />
    </MDBox>
  );
}
