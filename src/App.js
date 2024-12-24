/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { userSelector } from "store/user/selectors";
import { ThemeProvider } from "@mui/material/styles";
import Sidenav from "examples/Sidenav";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "assets/theme";
import themeDark from "assets/theme-dark";
import { ProductFruits } from "react-product-fruits";
import { useMaterialUIController } from "context";
import brandWhite from "assets/images/LogoCraft.svg";
import { isFirstTimeAdmin } from "helpers/user";
import CircularProgress from "@mui/material/CircularProgress";
import { useFetchCurrentUser } from "./firebase/hooks/useFetchCurrentUser";
import { getRoutesByRole } from "./routes";

const getRoutes = (allRoutes) =>
  allRoutes.flatMap((route) =>
    route.route ? <Route key={route.key} path={route.route} element={<route.component />} /> : null
  );

const isLoginPath = (pathname) =>
  [
    "/authentication/admin/confirm",
    "/authentication/admin",
    "/authentication/login",
    "/authentication/sign-up",
  ].includes(pathname);

const navigateByRole = (role, nav) => {
  const rolePathMap = {
    admin: "/admin/user-management",
    recruiter: "/dashboard",
    candidate: "/dashboard",
  };
  nav(rolePathMap[role]);
};

export default function App() {
  const { user } = useSelector(userSelector);
  const [controller] = useMaterialUIController();
  const { direction, layout, sidenavColor, darkMode } = controller;
  const { pathname } = useLocation();
  const { isUserLoggedIn, loading } = useFetchCurrentUser();
  const [showLoader, setShowLoader] = useState(true);
  const nav = useNavigate();
  const role = user?.role;

  const userData = useMemo(
    () => ({
      username: user?.id,
      email: user?.email,
      firstname: user?.first_name,
      lastname: user?.last_name,
      signUpAt: user?.created_at,
      role: user?.role,
    }),
    [user]
  );

  const routes = useMemo(() => getRoutesByRole(role), [role]);
  const installRoutes = useMemo(() => getRoutes(routes, isUserLoggedIn), [routes, isUserLoggedIn]);

  useEffect(() => {
    if (loading) return;
    if (pathname === "/success") nav({ pathname: "/dashboard", search: "?success=true" });
    if (isUserLoggedIn) {
      if (pathname === "/authentication/billing") return;
      if (user.role === "recruiter" && user.pricing_plan === "free")
        nav("/authentication/get-access");
      if (user.role === "recruiter" && user.pricing_plan === null) nav("/authentication/billing");
      if (isLoginPath(pathname)) navigateByRole(role, nav);
      if (pathname === "/") navigateByRole(role, nav);
      setShowLoader(false);
    }
    if (!isUserLoggedIn) {
      if (isLoginPath(pathname)) setShowLoader(false);
      else nav("/authentication/login");
    }
  }, [loading]);

  useEffect(() => {
    if (user && isFirstTimeAdmin(user)) nav("/authentication/admin/confirm");
  }, [user]);

  useEffect(() => {
    document.body.setAttribute("dir", direction);
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [direction, pathname]);

  useEffect(() => {
    window.addEventListener("productfruits_ready", () => {
      window.productFruits.api.tours.getTours();
      window.productFruits.api.tours.listen("tour-card-completed", (id, currentCardId) => {
        switch (currentCardId.currentCardId) {
          case "c322d4ca-f49f-4ae1-b175-af20eb75320e":
            nav("/jobs");
            break;
          case "f1bce0db-228d-4fd7-8e77-1169d287e1a4": {
            const jobId = JSON.parse(localStorage.getItem("jobForRedirect"));
            if (jobId) {
              nav(`/jobs/job-details/${jobId}`);
              localStorage.removeItem("jobForRedirect");
            }
            break;
          }
          case "95901335-3e43-43bf-99b2-858c8f6c5b2b": {
            if (window.innerWidth < 768) {
              document
                .querySelector(
                  "span.material-icons-round.notranslate.MuiIcon-root.MuiIcon-fontSizeMedium"
                )
                .click();
            }
            break;
          }
          case "77227333-59c0-4721-be7b-5cd082da076f":
            nav("/jobs/add-new-job");
            break;
          case "b53ff663-a6cf-444b-b1b0-5a2bde5827e0":
            nav("/search-candidates");
            break;
          case "257e6191-f311-4398-915c-bd461741ffbf":
            nav("/campaign-history");
            break;
          default:
            break;
        }
      });
    });
  }, []);

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      {showLoader ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100%",
            position: "fixed",
          }}
        >
          <CircularProgress color="secondary" />
        </div>
      ) : (
        <>
          <CssBaseline />
          {layout === "dashboard" && !pathname.includes("sign-up") && (
            <div
              style={{
                marginRight: "24px",
              }}
            >
              <Sidenav color={sidenavColor} brand={brandWhite} routes={routes} brandName="Craft" />
            </div>
          )}
          {(userData.role === "candidate" || userData.role === "recruiter") && (
            <ProductFruits workspaceCode="iS5awdSafXedgKw7" language="en" user={userData} />
          )}
          <Routes>{installRoutes}</Routes>
        </>
      )}
    </ThemeProvider>
  );
}
