import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import Breadcrumbs from "examples/Breadcrumbs";
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";
import { useMaterialUIController, setMiniSidenav } from "context";
import logoCraft from "../../../assets/images/LogoCraftSmall.png";

function getMarginTop() {
  if (window.innerWidth < 576) {
    return "65px";
  }
  if (window.innerWidth < 768) {
    return "50px";
  }
  if (window.innerWidth < 1200) {
    return "100px";
  }
  return "-55px";
}

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, darkMode } = controller;
  const route = useLocation().pathname.split("/").slice(1);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  if (isSmallScreen !== window.innerWidth < 1200) {
    setIsSmallScreen(window.innerWidth < 1200);
  }

  useEffect(() => {
    setNavbarType("static");
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
      style={{
        height: "30px",
      }}
    >
      {isSmallScreen ? (
        <MDBox
          sx={(theme) => navbarRow(theme, { isMini })}
          style={{
            backgroundColor: "#000",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "fixed",
            left: 0,
            top: 0,
            padding: "18px 16px",
            zIndex: 1000,
            pointerEvents: "auto",
          }}
        >
          <MDBox component="img" src={logoCraft} alt="logo" width="178px" height="52px" />
          <IconButton
            size="small"
            disableRipple
            color="inherit"
            sx={navbarMobileMenu}
            onClick={handleMiniSidenav}
          >
            <Icon sx={{ color: "#fff" }} fontSize="medium">
              {miniSidenav ? "menu_open" : "menu"}
            </Icon>
          </IconButton>
        </MDBox>
      ) : null}
      <Toolbar
        sx={(theme) => navbarContainer(theme)}
        style={{
          height: "26px",
        }}
      >
        <MDBox
          color="inherit"
          mb={{ xs: 1, md: 0 }}
          style={{
            marginTop: getMarginTop(),
            pointerEvents: "none",
            height: "10px",
          }}
          sx={(theme) => navbarRow(theme, { isMini })}
        >
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>
      </Toolbar>
    </AppBar>
  );
}

DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
