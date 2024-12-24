/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/no-unresolved */
import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import check from "assets/images/icons/check.svg";
import steps from "assets/images/steps2-3.svg";
import PropTypes from "prop-types";
import { fetchPaymentPlans } from "../../../../../../../firebase/backend/payment";

import "./slider.css";
import "swiper/css/pagination";
import "swiper/css";

function ChoosePlan({ setSelectedPlan }) {
  const [plans, setPlans] = useState([]);
  const [choosenPlan, setChoosenPlan] = useState();

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    fetchPaymentPlans().then((fetchedPlans) => {
      setPlans(fetchedPlans);
    });
  }, []);

  const choosePlan = (plan) => () => {
    setSelectedPlan(plan);
    setChoosenPlan(plan);
  };

  return (
    <MDBox mt={1.625}>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: "24px",
        }}
      >
        <img
          src={steps}
          alt="steps"
          style={{
            margin: "0 auto",
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
        }}
      >
        Choose your plan to start 30 days free trial
      </span>
      <div
        style={{
          paddingTop: "8px",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Roboto",
          fontSize: "12px",
          fontWeight: 400,
          lineHeight: 1.3,
          color: "#888",
        }}
      >
        <span>* Free trial includes 250 credits. </span>
        <span>* Payment will be proceeded after free trial expires.</span>
      </div>
      <div
        style={{
          height: "464px",
          display: width < 768 ? "none" : "block",
          width: "371px",
        }}
      />
      <div
        style={{
          height: "436px",
          position: width < 768 ? "relative" : "absolute",
          left: width < 768 ? "50%" : "-80px",
          transform: width < 768 ? "translateX(-50%)" : "none",
          top: width < 768 ? "0" : "156px",
          width: width < 768 ? "300px" : "562px",
          padding: width < 768 ? "16px 0" : "0",
        }}
      >
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView="auto"
          spaceBetween={16}
          centeredSlides
          pagination={{ clickable: true }}
          navigation
          centerInsufficientSlides
          style={{
            height: "100%",
            paddingBottom: "24px",
          }}
        >
          {plans &&
            plans.map((plan) => {
              if (plan.name !== "Free") {
                return (
                  <SwiperSlide
                    style={{
                      width: width < 768 ? "300px" : "375px",
                      padding: "13px 0 8px 0",
                      height: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    <div
                      style={{
                        boxShadow: "0px 2px 4px 0px rgba(57, 69, 72, 0.19)",
                        borderRadius: "8px",
                        backgroundColor: "#fff",
                        position: "relative",
                        height: "100%",
                        width: "100%",
                      }}
                    >
                      <div
                        className="plan-name"
                        style={{
                          position: "absolute",
                          top: "-13px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          borderRadius: "20px",
                          padding: "4px 32px",
                          fontFamily: "Roboto",
                          fontSize: "14px",
                          fontWeight: 500,
                          lineHeight: 1.3,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span>{plan.name}</span>
                      </div>
                      <div
                        style={{
                          padding: "24px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "24px",
                          height: "100%",
                        }}
                      >
                        <Grid
                          item
                          container
                          direction="row"
                          gap="2px"
                          style={{
                            height: "40px",
                            justifyContent: "center",
                          }}
                        >
                          {plan.price ? (
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
                          ) : (
                            <MDTypography
                              style={{
                                fontSize: "32px",
                                fontWeight: 600,
                                color: "#353F46",
                              }}
                            >
                              Individual
                            </MDTypography>
                          )}
                        </Grid>
                        <span
                          style={{
                            fontSize: "16px",
                            width: "100%",
                            textAlign: "start",
                          }}
                        >
                          {plan.description}
                        </span>
                        <Grid
                          direction="column"
                          gap="16px"
                          style={{
                            width: "100%",
                            justifyContent: "flex-start",
                            display: "flex",
                          }}
                        >
                          <div
                            style={{
                              height: "20px",
                              fontSize: "14px",
                              color: "#888",
                              fontWeight: 400,
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <img src={check} alt="check" />
                            <span
                              style={{
                                paddingTop: "3px",
                              }}
                            >
                              {plan.features && plan.features[0]}
                            </span>
                          </div>
                          <div
                            style={{
                              height: "20px",
                              fontSize: "14px",
                              color: "#888",
                              fontWeight: 400,
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <img src={check} alt="check" />
                            <span
                              style={{
                                paddingTop: "3px",
                              }}
                            >
                              {plan.bonus_credits
                                ? `${plan.bonus_credits} Credits included`
                                : "Custom Integrations"}
                            </span>
                          </div>
                          <div
                            style={{
                              height: "20px",
                              fontSize: "14px",
                              color: "#888",
                              fontWeight: 400,
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <img src={check} alt="check" />
                            <span
                              style={{
                                paddingTop: "3px",
                              }}
                            >
                              {plan.credits_price
                                ? `${plan.credits_price}£ Per Bonus Credit`
                                : "Custom Bonus"}
                            </span>
                          </div>
                        </Grid>
                        <Button
                          onClick={choosePlan(plan)}
                          style={{
                            width: "100%",
                            height: "40px",
                            backgroundColor:
                              choosenPlan && choosenPlan.name === plan.name ? "#38B6FF" : "#fff",
                            color:
                              choosenPlan && choosenPlan.name === plan.name ? "#fff" : "#38B6FF",
                            fontSize: "15px",
                            fontWeight: 500,
                            borderRadius: "4px",
                            textTransform: "uppercase",
                            marginTop: "auto",
                            border: "1px solid #38B6FF",
                          }}
                        >
                          {choosenPlan && choosenPlan.name === plan.name ? (
                            <>
                              <img
                                src={check}
                                alt="check"
                                style={{
                                  height: "22px",
                                  width: "22px",
                                  marginRight: "8px",
                                  filter:
                                    "brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(103%) contrast(103%)",
                                }}
                              />
                              Plan selected
                            </>
                          ) : (
                            "Select Plan"
                          )}
                        </Button>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              }
              return null;
            })}
        </Swiper>
      </div>
    </MDBox>
  );
}

ChoosePlan.propTypes = {
  setSelectedPlan: PropTypes.func.isRequired,
};

export default ChoosePlan;
