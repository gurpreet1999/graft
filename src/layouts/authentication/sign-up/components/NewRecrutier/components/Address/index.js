/* eslint-disable jsx-a11y/anchor-is-valid */
import PropTypes from "prop-types";
import { Typography, Grid, Checkbox, Link } from "@mui/material";
import MDBox from "components/MDBox";
import FormField from "layouts/authentication/sign-up/components/NewCandidate/components/FormField";
import { useState, useEffect } from "react";
import steps from "assets/images/steps1-3.svg";

function Address({ formData }) {
  const { formField, values, errors, touched } = formData;
  const { phoneNumber, postalCode, companyName } = formField;
  const { phoneNumber: phoneNumberV, postalCode: postalCodeV, companyName: companyNameV } = values;
  const [isMobileSize, setIsMobileSize] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobileSize(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <MDBox mt={1.625}>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: "48px",
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
      <Grid container spacing={isMobileSize ? 0 : 3}>
        <Grid item xs={12}>
          <MDBox mt={-1.625}>
            <FormField
              type={companyName.type}
              label={companyName.label}
              name={companyName.name}
              value={companyNameV}
              placeholder={companyName.placeholder}
              success={companyNameV.length > 0 && !errors.companyName}
            />
          </MDBox>
        </Grid>
      </Grid>
      <Grid container spacing={isMobileSize ? 0 : 3}>
        <Grid item xs={12}>
          <MDBox mt={-1.625}>
            <FormField
              type={phoneNumber.type}
              label={phoneNumber.label}
              name={phoneNumber.name}
              value={phoneNumberV}
              placeholder={phoneNumber.placeholder}
              success={phoneNumberV.length > 0 && !errors.phoneNumber}
            />
          </MDBox>
        </Grid>
      </Grid>
      <Grid container spacing={isMobileSize ? 0 : 3}>
        <Grid item xs={12}>
          <FormField
            type={postalCode.type}
            label={postalCode.label}
            name={postalCode.name}
            value={postalCodeV}
            placeholder={postalCode.placeholder}
            error={errors.postalCode && touched.postalCode}
            success={postalCode.length > 0 && !errors.postalCode}
          />
        </Grid>
      </Grid>
      <Grid container alignItems="center" gap={1}>
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
            style={{ fontSize: isMobileSize ? "12px" : "14px", marginLeft: "6px" }}
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
    </MDBox>
  );
}

// typechecking props for Address
Address.propTypes = {
  formData: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
};

export default Address;
