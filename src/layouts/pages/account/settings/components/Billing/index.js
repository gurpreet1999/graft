import MDBox from "components/MDBox";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import strype from "assets/images/Billing/stripe.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { userSelector } from "store/user/selectors";
import { useState, useEffect, useCallback } from "react";
import Button from "@mui/material/Button";
import { formatPlan } from "utilities/helpers";
import CreditModal from "./components/CreditModal";
import { fetchPaymentPlans } from "../../../../../../firebase/backend/payment";

function Billing() {
  const { user } = useSelector(userSelector);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentPlan = user?.pricing_plan;
  const [planPricing, setPlanPricing] = useState();

  useEffect(() => {
    fetchPaymentPlans().then((fetchedPlans) => {
      setPlanPricing(fetchedPlans.find((plan) => plan.id === currentPlan)?.price);
    });
  }, [user]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = useCallback(() => {
    const url = new URL(window.location.toString());
    url.searchParams.delete("success");
    window.history.pushState({}, "", url.toString());
    setIsModalOpen(false);
  }, []);

  return (
    <Card>
      <MDBox px={3} py={2}>
        <MDBox>
          <MDTypography variant="h5">Billing details</MDTypography>
        </MDBox>
        <Grid container>
          <Grid item xs={24} sm={12} mt={2}>
            <MDBox
              px={3}
              py={2}
              style={{
                border: "1px solid #DCE7ED",
                borderRadius: "8px",
              }}
            >
              <Grid container>
                <Grid item>
                  <MDTypography
                    style={{
                      fontSize: "12px",
                      fontWeight: 400,
                    }}
                  >
                    Balance
                  </MDTypography>
                  <Grid container direction="row" alignItems="flex-end" gap="6px">
                    <MDTypography
                      style={{
                        fontSize: "28px",
                        fontWeight: 600,
                        color: "#353F46",
                      }}
                    >
                      {String(user?.credits)}
                    </MDTypography>
                    <MDTypography
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#353F46",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-end",
                        paddingBottom: "6px",
                      }}
                    >
                      credits
                    </MDTypography>
                  </Grid>
                </Grid>
              </Grid>
            </MDBox>
          </Grid>
          <Grid item xs={24} sm={12} mt={2}>
            <MDBox
              px={3}
              py={2}
              style={{
                border: "1px solid #DCE7ED",
                borderRadius: "8px",
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
                      {formatPlan(user?.pricing_plan) || "Standard"}
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
              </Grid>
            </MDBox>
          </Grid>
          <Grid item xs={24} sm={12} mt={2}>
            <MDBox
              px={3}
              py={2}
              style={{
                border: "1px solid #DCE7ED",
                borderRadius: "8px",
              }}
            >
              <Grid container>
                <Grid item>
                  <Grid container direction="row" alignItems="center" gap="8px">
                    <img src={strype} alt="strype logo" />
                    <MDTypography
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#353F46",
                      }}
                    >
                      Stripe
                    </MDTypography>
                  </Grid>
                </Grid>
              </Grid>
            </MDBox>
          </Grid>
          <Grid item container justifyContent="flex-end" pt={2} gap="16px">
            <Link
              className="MuiButton-root"
              to="/dashboard/pricing-plan"
              style={{
                color: "#38B6FF",
                padding: "8px 22px",
                borderRadius: "4px",
                boxShadow:
                  "0px 3px 1px -2px rgba(0, 0, 0, 0.20), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
                backgroundColor: "#fff",
                fontFamily: "Roboto, sans-serif",
                fontSize: "15px",
                fontWeight: "500",
              }}
            >
              Update pricing plan
            </Link>
            <Button
              variant="contained"
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
              }}
              onClick={openModal}
            >
              Buy more credits
            </Button>
            <CreditModal
              isOpen={isModalOpen}
              closeModal={handleCloseModal}
              openModal={openModal}
              currentPlan={user.pricing_plan}
            />
          </Grid>
        </Grid>
      </MDBox>
    </Card>
  );
}

export default Billing;
