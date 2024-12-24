/**
=========================================================
* Otis Admin PRO - v2.0.1
=========================================================

* Product Page: https://material-ui.com/store/items/otis-admin-pro-material-dashboard-react/
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

export default styled(Box)(({ theme }) => {
  const { palette, borders } = theme;

  const { inputBorderColor, transparent } = palette;
  const { borderRadius, borderWidth } = borders;

  return {
    display: "flex",
    alignItems: "center",
    border: `${borderWidth[1]} solid ${inputBorderColor} !important`,
    borderRadius: borderRadius.md,
    maxHeight: "68px",
    minHeight: "70px",
    // Add breakpoints for adaptive behavior
    [theme.breakpoints.down("sm")]: {
      minHeight: "148px !important",
      border: "none !important",
      // Width: 600px
    },
    [theme.breakpoints.up("md")]: {
      minHeight: "80px !important",
      // Width: 960px
    },
    [theme.breakpoints.up("lg")]: {
      minHeight: "70px",
      // Width: 1280px
    },

    "&.dropzone": {
      background: `${transparent.main} !important`,
      padding: "2 20px !important",
      minHeight: "70px",
    },
    "& .dz-error-message": {
      display: "none !important",
    },
    "& .dz-error-mark": {
      display: "none !important",
    },
    "& .dz-preview": {
      height: "40px !important",
      minHeight: "70px !important",
      margin: "0 !important",
    },
    "& .dz-preview, & .dz-preview img": {
      height: "40px !important",
      minHeight: "30px !important",
    },
    "& .dz-details": {
      display: "block !important",
      opacity: "1 !important",
      top: "0 !important",
      padding: "2px 4px !important",
      borderRadius: "4px !important",
      background: "#38B6FF !important",
      color: "#fff !important",
    },
    "& .dz-remove": {
      position: "absolute !important",
      opacity: "1 !important",
      top: "-15px !important",
      padding: "0px !important",
    },
    "& .dz-size": {
      margin: "0 !important",
      padding: "0 !important",
    },
    "& .dz-details span": {
      background: "#38B6FF !important",
    },
  };
});
