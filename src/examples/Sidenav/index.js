import { useEffect, useMemo, useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import MDBox from "components/MDBox";
import Grid from "@mui/material/Grid";
import MDTypography from "components/MDTypography";
import verifiedIcon from "assets/images/icons/header/verified.svg";
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";
import SidenavList from "examples/Sidenav/SidenavList";
import SidenavItem from "examples/Sidenav/SidenavItem";
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";
import { useSelector } from "react-redux";
import { signOutAsUser } from "../../firebase/auth";
import { userSelector } from "../../store/user/selectors";
import { isCandidate } from "../../helpers/user";

const getFilter = (route, pathname, hover) => {
  if (pathname.includes(route) || hover[route]) {
    return "brightness(0) invert(1)";
  }
  return "brightness(1)";
};

const getBackgroundColor = (route, pathname, hover) => {
  if (pathname.includes(route) || hover[route]) {
    return "#38B6FF";
  }
  return "transparent";
};

const getBorder = (route, pathname, hover) => {
  if (pathname.includes(route) || hover[route]) {
    return "1px solid #38B6FF";
  }
  return "1px solid transparent";
};

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const [openCollapse, setOpenCollapse] = useState(false);
  const [hover, setHover] = useState({});
  const [openNestedCollapse, setOpenNestedCollapse] = useState(false);
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } = controller;
  const location = useLocation();
  const { pathname } = location;
  const collapseName = pathname.split("/").slice(1)[0];
  const items = pathname.split("/").slice(1);
  const itemParentName = items[1];
  const itemName = items[items.length - 1];

  const { user } = useSelector(userSelector);

  const userData = useMemo(
    () => ({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      verified: user?.verified || "",
      role: user?.role || "",
    }),
    [user]
  );

  const userIsCandidate = isCandidate(userData);

  let textColor = "white";

  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  useEffect(() => {
    setOpenCollapse(collapseName);
    setOpenNestedCollapse(itemParentName);
  }, []);

  useEffect(() => {
    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
    }

    /** 
     The event listener that's calling the handleMiniSidenav function when resizing the window.
    */
    window.addEventListener("resize", handleMiniSidenav);

    // Call the handleMiniSidenav function to set the state with the initial value.
    handleMiniSidenav();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  // Render all the nested collapse items from the routes.js
  const renderNestedCollapse = (collapse) => {
    const template = collapse.map(({ name, route, key, href }) =>
      href ? (
        <Link
          key={key}
          href={href}
          target="_blank"
          rel="noreferrer"
          sx={{ textDecoration: "none" }}
        >
          <SidenavItem name={name} nested />
        </Link>
      ) : (
        <NavLink to={route} key={key} sx={{ textDecoration: "none" }}>
          <SidenavItem name={name} active={route === pathname} nested />
        </NavLink>
      )
    );

    return template;
  };
  // Render the all the collpases from the routes.js
  const renderCollapse = (collapses) =>
    collapses.map(({ name, collapse, route, href, key }) => {
      let returnValue;

      if (collapse) {
        returnValue = (
          <SidenavItem
            key={key}
            color={color}
            name={name}
            active={key === itemParentName ? "isParent" : false}
            open={openNestedCollapse === key}
            onClick={({ currentTarget }) =>
              openNestedCollapse === key && currentTarget.classList.contains("MuiListItem-root")
                ? setOpenNestedCollapse(false)
                : setOpenNestedCollapse(key)
            }
          >
            {renderNestedCollapse(collapse)}
          </SidenavItem>
        );
      } else {
        returnValue = href ? (
          <Link
            href={href}
            key={key}
            target="_blank"
            rel="noreferrer"
            sx={{ textDecoration: "none" }}
          >
            <SidenavItem color={color} name={name} active={key === itemName} />
          </Link>
        ) : (
          <NavLink to={route} key={key} sx={{ textDecoration: "none" }}>
            <SidenavItem color={color} name={name} active={key === itemName} />
          </NavLink>
        );
      }
      return <SidenavList key={key}>{returnValue}</SidenavList>;
    });

  // Render all the routes from the routes.js (All the visible items on the Sidenav)
  const renderRoutes = routes.map(
    ({ type, name, icon, title, collapse, noCollapse, key, href, route }) => {
      let returnValue;

      if (name === "Login") {
        return null;
      }

      if (type === "profile") {
        returnValue = (
          <MDBox
            mb={2}
            textAlign="center"
            style={{
              backgroundColor: "#353F46",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: getBorder(route, pathname, hover),
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: icon ? "space-between" : "flex-start",
                width: "100%",
                padding: "16px",
                gap: "16px",
              }}
            >
              <Grid
                item
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "0px",
                  position: "relative",
                }}
              >
                <AccountCircleRoundedIcon
                  style={{
                    width: "40px",
                    height: "40px",
                    color: "white",
                  }}
                />
                {userData.verified && userIsCandidate && (
                  <MDBox
                    component="img"
                    src={verifiedIcon}
                    alt="verified"
                    width="16px"
                    height="16px"
                    style={{
                      padding: "0px",
                      marginLeft: "auto",
                      position: "absolute",
                      right: "0",
                      top: "0",
                      width: "12px",
                      height: "12px",
                    }}
                  />
                )}
              </Grid>
              <Grid item>
                <MDBox textAlign="start">
                  <MDTypography
                    variant="h6"
                    fontWeight="medium"
                    style={{
                      color: "white",
                      maxWidth: "100px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      lineHeight: "1.5",
                    }}
                  >
                    {`${userData.first_name} ${userData.last_name}`}
                  </MDTypography>
                  <MDTypography
                    color="text"
                    fontWeight="regular"
                    style={{
                      color: !userData.verified ? "#AAC2D0" : "#38B6FF",
                      fontSize: "14px",
                      lineHeight: "1.43",
                    }}
                  >
                    {userIsCandidate && (!userData.verified ? "Non-verified" : "Verified")}
                  </MDTypography>
                </MDBox>
              </Grid>
              {icon && (
                <NavLink
                  to={route}
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <MDBox
                    component="img"
                    src={icon}
                    alt="avatar"
                    width="24px"
                    height="24px"
                    style={{
                      padding: "0px",
                      marginLeft: "auto",
                    }}
                  />
                </NavLink>
              )}
            </div>
          </MDBox>
        );
      }

      if (type === "singleRoute") {
        returnValue = (
          <MDBox
            style={{
              position: name === "Logout" ? "absolute" : "retalive",
              bottom: name === "Logout" ? "0px" : "none",
              width: "100%",
            }}
          >
            <NavLink
              to={route}
              key={key}
              onClick={() => {
                if (name === "Logout") {
                  signOutAsUser();
                }
              }}
            >
              <Grid
                container
                direction="row"
                alignItems="center"
                width="100%"
                spacing={0}
                gap="16px"
                onMouseEnter={() => setHover((prevHover) => ({ ...prevHover, [route]: true }))}
                onMouseLeave={() => setHover((prevHover) => ({ ...prevHover, [route]: false }))}
                px={2}
                style={{
                  backgroundColor: getBackgroundColor(route, pathname, hover),
                  borderRadius: "8px",
                  height: "48px",
                  margin: "0px 0px 8px 0px",
                }}
              >
                <Grid
                  item
                  px={0}
                  style={{
                    padding: "0px",
                    height: "24px",
                  }}
                >
                  <MDBox
                    component="img"
                    src={icon}
                    alt="avatar"
                    width="24px"
                    height="24px"
                    style={{
                      padding: "0px",
                      filter: getFilter(route, pathname, hover),
                    }}
                  />
                </Grid>
                <Grid>
                  <MDTypography
                    style={{
                      color: "white",
                      fontSize: "14px",
                      fontWeight: "regular",
                      paddingTop: "2.5px",
                    }}
                  >
                    {name}
                  </MDTypography>
                </Grid>
              </Grid>
            </NavLink>
          </MDBox>
        );
      }

      if (type === "collapse") {
        returnValue = href ? (
          <Link
            href={href}
            key={key}
            target="_blank"
            rel="noreferrer"
            sx={{ textDecoration: "none" }}
          >
            <SidenavCollapse
              name={name}
              icon={icon}
              active={key === collapseName}
              noCollapse={noCollapse}
            />
          </Link>
        ) : (
          <SidenavCollapse
            key={key}
            name={name}
            icon={icon}
            active={key === collapseName}
            open={openCollapse === key}
            onClick={() => (openCollapse === key ? setOpenCollapse(false) : setOpenCollapse(key))}
          >
            {collapse ? renderCollapse(collapse) : null}
          </SidenavCollapse>
        );
      } else if (type === "title") {
        returnValue = (
          <MDTypography
            key={key}
            color={textColor}
            display="none"
            variant="caption"
            fontWeight="bold"
            textTransform="uppercase"
            pl={3}
            mt={2}
            mb={1}
            ml={1}
          >
            {title}
          </MDTypography>
        );
      } else if (type === "divider") {
        returnValue = (
          <Divider
            key={key}
            light={
              (!darkMode && !whiteSidenav && !transparentSidenav) ||
              (darkMode && !transparentSidenav && whiteSidenav)
            }
          />
        );
      }

      return returnValue;
    }
  );

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
      style={{
        overflow: "hidden",
      }}
    >
      <MDBox
        pb={3}
        textAlign="center"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MDBox display="flex" alignItems="center">
          {brand && (
            <MDBox
              component="img"
              src={brand}
              alt="Brand"
              width="178px"
              height="54px"
              style={{
                transform: "scale(6.3)",
              }}
            />
          )}
        </MDBox>
      </MDBox>
      <List
        style={{
          height: "100%",
        }}
      >
        {renderRoutes}
      </List>
    </SidenavRoot>
  );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.instanceOf(Array).isRequired,
};

export default Sidenav;
