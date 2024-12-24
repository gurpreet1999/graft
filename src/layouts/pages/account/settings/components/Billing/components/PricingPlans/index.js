import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useEffect, useState, useMemo } from "react";
import Grid from "@mui/material/Grid";
import { userSelector } from "store/user/selectors";
import { useSelector } from "react-redux";
import { fetchPaymentPlans } from "../../../../../../../../firebase/backend/payment";
import PricingPlan from "./pricing-plan";

export default function PricingPlans() {
  const { user } = useSelector(userSelector);
  const currentPlan = user?.pricing_plan;
  const [plans, setPlans] = useState();
  const [isPlanChanged, setIsPlanChanged] = useState(false);

  const currentPlanPrice = useMemo(
    () => plans?.find((plan) => plan.id === currentPlan)?.price,
    [plans, currentPlan]
  );

  useEffect(() => {
    if (isPlanChanged) {
      window.location.reload();
    }
  }, [isPlanChanged]);

  useEffect(() => {
    fetchPaymentPlans().then((fetchedPlans) => {
      setPlans(
        fetchedPlans.map((plan) => ({
          id: plan.id,
          title: plan.name,
          price: plan.price,
          features: plan.features,
          description: plan.description,
          creditsPrice: plan.credits_price,
          bonusCredits: plan.bonus_credits,
        }))
      );
    });
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container direction="row" gap="24px" mt={5} justifyContent="center">
        {Array.isArray(plans) &&
          plans.map((plan) => (
            <Grid item key={plan.title}>
              <PricingPlan
                plan={plan}
                currentPlan={currentPlanPrice}
                setIsPlanChanged={setIsPlanChanged}
              />
            </Grid>
          ))}
      </Grid>
    </DashboardLayout>
  );
}
