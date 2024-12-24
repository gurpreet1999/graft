/* eslint-disable jsx-a11y/anchor-is-valid */
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Hidden from "@mui/material/Hidden";
import PageLayout from "examples/LayoutContainers/PageLayout";
import { useLocation } from "react-router-dom";
import signUpImg from "../../../../assets/images/illustrations/Graft2.png";

function IllustrationLayout({ header, title, description, children, logo, isHiddenText }) {
  const location = useLocation();
  const isLoginRoute =
    location.pathname === "/authentication/login" ||
    location.pathname === "/authentication/forgot-password";
  const isSignUpRoute =
    location.pathname === "/authentication/sign-up" ||
    location.pathname === "/authentication/billing" ||
    location.search === "?success=true";

  return (
    <PageLayout>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "100%",
          background: "linear-gradient(180deg, #46545B 0%, #000 100%)",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 16px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            height: "100%",
            alignItems: "center",
            width: "100%",
            maxWidth: "1920px",
          }}
        >
          {!isHiddenText && (
            <Hidden xsUp>
              <Grid item xs={12} lg={6.6}>
                <MDBox
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  color="white"
                  alignItems="center"
                  padding="0 16px"
                >
                  {isLoginRoute && (
                    <MDBox
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      paddingLeft="70px"
                    >
                      <MDBox
                        color="white"
                        fontSize="18px"
                        fontWeight="600"
                        maxWidth="846px"
                        display="flex"
                        flexDirection="column"
                      >
                        <h1
                          style={{
                            fontSize: "72px",
                            fontWeight: "700",
                            textTransform: "uppercase",
                          }}
                        >
                          don’t take our word for it. here`s what people had to say about{" "}
                          <span style={{ color: "#38B6FF" }}>GRAFT</span>
                        </h1>
                      </MDBox>
                      <img
                        src={signUpImg}
                        alt="login"
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                    </MDBox>
                  )}
                  {isSignUpRoute && (
                    <MDBox
                      display="flex"
                      flexDirection="column"
                      gap="85px"
                      alignItems="center"
                      justifyContent="center"
                      paddingLeft="70px"
                    >
                      <MDBox
                        color="white"
                        fontSize="18px"
                        fontWeight="600"
                        maxWidth="845px"
                        display="flex"
                        flexDirection="column"
                        gap="24px"
                      >
                        <h1
                          style={{
                            fontSize: "72px",
                            fontWeight: "700",
                            textTransform: "uppercase",
                          }}
                        >
                          You landed <span style={{ color: "#38B6FF" }}>here</span>
                        </h1>
                        <p>
                          because you’re either looking for a construction job, are looking for
                          someone for a construction job, or you clicked on an ad by accident whilst
                          searching for construction memes.
                        </p>
                        <p style={{ textTransform: "uppercase" }}>
                          IF IT’S THE LATTER, AND YOU’RE DISAPPOINTED AT THE LACK OF CONSTRUCTION
                          MEMES, DON’T WORRY.
                          <a
                            href="https://www.onthegraft.co.uk/ramsey-memes"
                            target="_blank"
                            style={{ color: "#38B6FF" }}
                            rel="noreferrer"
                          >
                            {" "}
                            CLICK HERE.
                          </a>
                        </p>
                        <p>
                          But, if you’re looking for the best jobs with some of the top construction
                          firms in the UK, or if you’re an employer trying to find people to fill
                          those jobs, you’re in the right place. Pop your details in and create your
                          account to get started.
                        </p>
                      </MDBox>
                      <img
                        src={signUpImg}
                        alt="login"
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                    </MDBox>
                  )}
                </MDBox>
              </Grid>
            </Hidden>
          )}
          <Grid item xs={11} sm={8} md={6} lg={4} xl={3} sx={{ mx: "auto" }}>
            <MDBox
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              minHeight="100vh"
              padding="24px 0"
              position="relative"
            >
              <a
                href="https://www.onthegraft.co.uk/"
                style={{
                  position: "absolute",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: "70px",
                }}
              >
                {logo && <img src={logo} alt="logo" style={{ width: "178px" }} />}
              </a>
              <MDBox
                display="flex"
                flexDirection="column"
                justifyContent="center"
                height="100%"
                width="100%"
                maxWidth="608px"
                borderRadius="12px"
                bgColor="white"
                py={{ xs: 2, sm: 6, md: 6 }}
                px={{ xs: 2, sm: 10, md: 10 }}
                style={{
                  padding: isHiddenText && (window.innerWidth > 768 ? "40px 80px" : "40px 20px"),
                }}
              >
                <MDBox textAlign="center">
                  {!header ? (
                    <>
                      {title && (
                        <MDBox mb={1} textAlign="center">
                          <MDTypography variant="h4" fontWeight="bold">
                            {title}
                          </MDTypography>
                        </MDBox>
                      )}
                      <MDTypography
                        variant="body2"
                        color="text"
                        style={{
                          fontWeight: "600",
                          fontFamily: "Montserrat",
                          fontSize: "16px",
                        }}
                      >
                        {description}
                      </MDTypography>
                    </>
                  ) : (
                    header
                  )}
                </MDBox>
                <MDBox bgColor="white">{children}</MDBox>
              </MDBox>
            </MDBox>
          </Grid>
        </div>
      </div>
    </PageLayout>
  );
}

// Setting default values for the props of IllustrationLayout
IllustrationLayout.defaultProps = {
  header: "",
  title: "",
  description: "",
  isHiddenText: false,
};

// Typechecking props for the IllustrationLayout
IllustrationLayout.propTypes = {
  header: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
  logo: PropTypes.string.isRequired,
  isHiddenText: PropTypes.bool,
};

export default IllustrationLayout;
