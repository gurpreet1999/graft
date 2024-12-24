import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import uploadIcon from "assets/images/icons/fileUpload.svg";
import SuspendUser from "../../SuspendUser";
import { downloadDocument, changeDocumentStatus } from "../../../../../../firebase/user";

function getFileNameFromPath(path) {
  return path?.split("/").pop();
}

const upprovedText = (approved) => {
  if (approved === "approved") {
    return "Approved";
  }
  if (approved === "rejected") {
    return "Rejected";
  }
  return "";
};

const upprovedColor = (approved) => {
  if (approved === "approved") {
    return "#219653";
  }
  if (approved === "rejected") {
    return "#FF5C93";
  }
  return "#DCE7ED";
};

function BasicInfo({ user, changeStatus, setChangeStatus }) {
  const [openSuspend, setOpenSuspend] = useState(false);

  const handleSuspendUser = useCallback(() => {
    setOpenSuspend(true);
  }, []);

  const handleCloseSuspendUser = () => setOpenSuspend(false);

  const downloadPersonal = async () => {
    if (user?.personal_document) {
      await downloadDocument(user?.personal_document?.path);
    }
  };

  const downloadSector = async () => {
    if (user?.sector_experience_document) {
      await downloadDocument(user?.sector_experience_document?.path);
    }
  };

  const submitPersonalDocument = async () => {
    if (user?.personal_document) {
      await changeDocumentStatus(user.id, "personal", "approved");
      setChangeStatus(!changeStatus);
    }
  };

  const rejectPersonalDocument = async () => {
    if (user?.personal_document) {
      await changeDocumentStatus(user.id, "personal", "rejected");
      setChangeStatus(!changeStatus);
    }
  };

  const submitSectorDocument = async () => {
    if (user?.sector_experience_document) {
      await changeDocumentStatus(user.id, "sector", "approved");
      setChangeStatus(!changeStatus);
    }
  };

  const rejectSectorDocument = async () => {
    if (user?.sector_experience_document) {
      await changeDocumentStatus(user.id, "sector", "rejected");
      setChangeStatus(!changeStatus);
    }
  };

  return (
    <Card id="basic-info" sx={{ overflow: "visible" }}>
      <MDBox p={3}>
        <MDTypography variant="h3">Basic Info</MDTypography>
      </MDBox>
      <MDBox component="form" pb={3} px={3}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sm={6}
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <MDTypography
              style={{
                fontSize: "12px",
                color: "#888",
              }}
            >
              First Name
            </MDTypography>
            <MDTypography
              style={{
                fontSize: "14px",
                color: "#1C1C1C",
              }}
            >
              {user.first_name}
            </MDTypography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid
              item
              xs={12}
              sm={6}
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <MDTypography
                style={{
                  fontSize: "12px",
                  color: "#888",
                }}
              >
                Last Name
              </MDTypography>
              <MDTypography
                style={{
                  fontSize: "14px",
                  color: "#1C1C1C",
                }}
              >
                {user.last_name}
              </MDTypography>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <MDTypography
              style={{
                fontSize: "12px",
                color: "#888",
              }}
            >
              Email
            </MDTypography>
            <MDTypography
              style={{
                fontSize: "14px",
                color: "#1C1C1C",
              }}
            >
              {user.email}
            </MDTypography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid
              item
              xs={12}
              sm={6}
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <MDTypography
                style={{
                  fontSize: "12px",
                  color: "#888",
                }}
              >
                Status
              </MDTypography>
              {!user.verified ? (
                <MDBox>
                  <div
                    label={user.verified}
                    style={{
                      fontSize: "14px",
                      borderRadius: "8px",
                      padding: "4px 10px",
                      backgroundColor: "#E1FCDC",
                      width: "fit-content",
                      color: "#353F46",
                    }}
                  >
                    {user.personal_document || user.sector_experience_document
                      ? "Waiting for submission"
                      : "Not verified"}
                  </div>
                </MDBox>
              ) : (
                <div
                  label={user.verified}
                  style={{
                    fontSize: "14px",
                    borderRadius: "8px",
                    padding: "4px 10px",
                    backgroundColor: "rgb(56, 182, 255)",
                    width: "fit-content",
                    color: "#fff",
                  }}
                >
                  Verified
                </div>
              )}
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <MDTypography
              style={{
                fontSize: "12px",
                color: "#888",
              }}
            >
              Mobile Number
            </MDTypography>
            <MDTypography
              style={{
                fontSize: "14px",
                color: "#1C1C1C",
              }}
            >
              {user.phone_number}
            </MDTypography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <MDTypography
              style={{
                fontSize: "12px",
                color: "#888",
              }}
            >
              Postcode
            </MDTypography>
            <MDTypography
              style={{
                fontSize: "14px",
                color: "#1C1C1C",
              }}
            >
              {user.postal_code}
            </MDTypography>
          </Grid>
          {user.experience.sector === "Hospitality" ? (
            <>
              <Grid
                item
                xs={12}
                sm={12}
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <MDTypography
                  style={{
                    fontSize: "12px",
                    color: "#888",
                  }}
                >
                  Total Years Hospitality Experience
                </MDTypography>
                <MDTypography
                  style={{
                    fontSize: "14px",
                    color: "#1C1C1C",
                  }}
                >
                  {user.experience.years_of_experience}
                </MDTypography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <MDTypography
                  style={{
                    fontSize: "12px",
                    color: "#888",
                  }}
                >
                  Main Type Of Establishment
                </MDTypography>
                <MDTypography
                  style={{
                    fontSize: "14px",
                    color: "#1C1C1C",
                  }}
                >
                  {user.experience.main_type_of_establishment}
                </MDTypography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <MDTypography
                  style={{
                    fontSize: "12px",
                    color: "#888",
                  }}
                >
                  1st Role Looking For Preference
                </MDTypography>
                <MDTypography
                  style={{
                    fontSize: "14px",
                    color: "#1C1C1C",
                  }}
                >
                  {user.experience.first_role_preference}
                </MDTypography>
              </Grid>
            </>
          ) : (
            <>
              <Grid
                item
                xs={12}
                sm={12}
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <MDTypography
                  style={{
                    fontSize: "12px",
                    color: "#888",
                  }}
                >
                  Total Construction Experience
                </MDTypography>
                <MDTypography
                  style={{
                    fontSize: "14px",
                    color: "#1C1C1C",
                  }}
                >
                  {user.experience.years_of_experience}
                </MDTypography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <MDTypography
                  style={{
                    fontSize: "12px",
                    color: "#888",
                  }}
                >
                  Role
                </MDTypography>
                <MDTypography
                  style={{
                    fontSize: "14px",
                    color: "#1C1C1C",
                  }}
                >
                  {user.experience.construction_role}
                </MDTypography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <MDTypography
                  style={{
                    fontSize: "12px",
                    color: "#888",
                  }}
                >
                  Card Type
                </MDTypography>
                <MDTypography
                  style={{
                    fontSize: "14px",
                    color: "#1C1C1C",
                  }}
                >
                  {user.experience.construction_card_type}
                </MDTypography>
              </Grid>
            </>
          )}
          {user?.personal_document && user?.sector_experience_document && (
            <>
              <Grid item container>
                <MDTypography style={{ fontSize: "12px" }}>Document №1</MDTypography>
                <MDTypography
                  style={{
                    fontSize: "12px",
                    paddingLeft: "2px",
                    color: upprovedColor(user?.personal_document?.status),
                  }}
                >
                  {upprovedText(user?.personal_document?.status)}
                </MDTypography>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    padding: "16px",
                    borderRadius: "12px",
                    border: `1px solid ${upprovedColor(user?.personal_document?.status)}`,

                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    marginTop: "6px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="button"
                    onClick={downloadPersonal}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "16px",
                      background: "transparent",
                      border: "none",
                      fontFamily: "Roboto, sans-serif",
                      fontSize: "14px",
                      color: "#5F5F5F",
                      cursor: "pointer",
                    }}
                  >
                    <img src={uploadIcon} alt="upload" />
                    {user?.personal_document
                      ? getFileNameFromPath(user?.personal_document?.path)
                      : "not provided"}
                  </button>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "16px",
                      minWidth: "40%",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>{user?.personal_document?.type}</div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "16px",
                        flexWrap: "wrap",
                      }}
                    >
                      {(user?.personal_document?.status === "approved" ||
                        user?.personal_document?.status === "pending") && (
                        <button
                          type="button"
                          onClick={rejectPersonalDocument}
                          style={{
                            padding: "8px 22px",
                            backgroundColor: "#fff",
                            textTransform: "uppercase",
                            color: "#38B6FF",
                            borderRadius: "4px",
                            fontFamily: "Roboto, sans-serif",
                            fontSize: "16px",
                            border: "1px solid #38B6FF",
                            height: "42px",
                            cursor: "pointer",
                          }}
                        >
                          Reject
                        </button>
                      )}
                      {(user?.personal_document?.status === "rejected" ||
                        user?.personal_document?.status === "pending") && (
                        <button
                          type="button"
                          onClick={submitPersonalDocument}
                          style={{
                            padding: "8px 22px",
                            backgroundColor: "#38B6FF",
                            textTransform: "uppercase",
                            color: "white",
                            borderRadius: "4px",
                            boxShadow:
                              "0px 3px 1px -2px rgba(0, 0, 0, 0.20), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
                            fontFamily: "Roboto, sans-serif",
                            fontSize: "16px",
                            border: "none",
                            cursor: "pointer",
                            height: "42px",
                          }}
                        >
                          Submit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item container>
                <MDTypography style={{ fontSize: "12px" }}>Document №2</MDTypography>
                <MDTypography
                  style={{
                    fontSize: "12px",
                    paddingLeft: "2px",
                    color: upprovedColor(user?.sector_experience_document?.status),
                  }}
                >
                  {upprovedText(user?.sector_experience_document?.status)}
                </MDTypography>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    padding: "16px",
                    borderRadius: "12px",
                    border: `1px solid ${upprovedColor(user?.sector_experience_document?.status)}`,
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    marginTop: "6px",
                    flexWrap: "wrap",
                    position: "relative",
                  }}
                >
                  <button
                    type="button"
                    onClick={downloadSector}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "16px",
                      background: "transparent",
                      border: "none",
                      fontFamily: "Roboto, sans-serif",
                      fontSize: "14px",
                      color: "#5F5F5F",
                      cursor: "pointer",
                    }}
                  >
                    <img src={uploadIcon} alt="upload" />
                    {user?.sector_experience_document
                      ? getFileNameFromPath(user?.sector_experience_document?.path)
                      : "not provided"}
                  </button>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "16px",
                      minWidth: "40%",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>{user?.sector_experience_document?.type}</div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "16px",
                        flexWrap: "wrap",
                      }}
                    >
                      {(user?.sector_experience_document?.status === "approved" ||
                        user?.sector_experience_document?.status === "pending") && (
                        <button
                          type="button"
                          onClick={rejectSectorDocument}
                          style={{
                            padding: "8px 22px",
                            backgroundColor: "#fff",
                            textTransform: "uppercase",
                            color: "#38B6FF",
                            borderRadius: "4px",
                            fontFamily: "Roboto, sans-serif",
                            fontSize: "16px",
                            border: "1px solid #38B6FF",
                            height: "42px",
                            cursor: "pointer",
                          }}
                        >
                          Reject
                        </button>
                      )}
                      {(user?.sector_experience_document?.status === "rejected" ||
                        user?.sector_experience_document?.status === "pending") && (
                        <button
                          type="button"
                          onClick={submitSectorDocument}
                          style={{
                            padding: "8px 22px",
                            backgroundColor: "#38B6FF",
                            textTransform: "uppercase",
                            color: "white",
                            borderRadius: "4px",
                            boxShadow:
                              "0px 3px 1px -2px rgba(0, 0, 0, 0.20), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
                            fontFamily: "Roboto, sans-serif",
                            fontSize: "16px",
                            border: "none",
                            height: "42px",
                            cursor: "pointer",
                          }}
                        >
                          Submit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Grid>
            </>
          )}
          <Grid item container direction="row" justifyContent="flex-end" gap={2}>
            <button
              type="button"
              onClick={() => handleSuspendUser()}
              style={{
                padding: "5px",
                borderRadius: "4px",
                backgroundColor: "#fff",
                boxShadow:
                  "0px 4px 12px 4px rgba(38, 42, 63, 0.06), 0px 2px 4px -1px rgba(48, 57, 65, 0.16)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                outline: "none",
                border: "none",
                cursor: "pointer",
                width: "42px",
                height: "42px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M12.5 11.6668C14.725 11.6668 19.1667 12.7752 19.1667 15.0002V16.6668H5.83334V15.0002C5.83334 12.7752 10.275 11.6668 12.5 11.6668ZM12.5 10.0002C11.616 10.0002 10.7681 9.64897 10.143 9.02385C9.51786 8.39873 9.16667 7.55088 9.16667 6.66683C9.16667 5.78277 9.51786 4.93493 10.143 4.30981C10.7681 3.68469 11.616 3.3335 12.5 3.3335C13.3841 3.3335 14.2319 3.68469 14.857 4.30981C15.4822 4.93493 15.8333 5.78277 15.8333 6.66683C15.8333 7.55088 15.4822 8.39873 14.857 9.02385C14.2319 9.64897 13.3841 10.0002 12.5 10.0002ZM4.16667 7.99183L5.93334 6.21683L7.11667 7.40016L5.34167 9.16683L7.11667 10.9335L5.93334 12.1168L4.16667 10.3418L2.40001 12.1168L1.21667 10.9335L2.99167 9.16683L1.21667 7.40016L2.40001 6.21683L4.16667 7.99183Z"
                  fill="#AAC2D0"
                />
              </svg>
            </button>
            <Link to="/admin/user-management">
              <button
                type="button"
                style={{
                  padding: "8px 22px",
                  backgroundColor: "#38B6FF",
                  textTransform: "uppercase",
                  color: "white",
                  borderRadius: "4px",
                  boxShadow:
                    "0px 3px 1px -2px rgba(0, 0, 0, 0.20), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
                  fontFamily: "Roboto, sans-serif",
                  fontSize: "16px",
                  border: "none",
                  height: "42px",
                  cursor: "pointer",
                }}
              >
                Back to list
              </button>
            </Link>
          </Grid>
        </Grid>
      </MDBox>
      <SuspendUser
        isOpenModal={openSuspend}
        handleCloseModal={handleCloseSuspendUser}
        uid={user.uid}
      />
    </Card>
  );
}

BasicInfo.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    verified: PropTypes.bool,
    email: PropTypes.string,
    phone_number: PropTypes.string,
    postal_code: PropTypes.string,
    credits: PropTypes.number,
    uid: PropTypes.string,
    experience: PropTypes.shape({
      first_role_preference: PropTypes.string,
      years_of_experience: PropTypes.string,
      main_type_of_establishment: PropTypes.string,
      sector: PropTypes.string,
      construction_role: PropTypes.string,
      site_type: PropTypes.string,
      construction_card_type: PropTypes.string,
    }),
    personal_document: PropTypes.shape({
      path: PropTypes.string,
      type: PropTypes.string,
      status: PropTypes.string,
    }),
    sector_experience_document: PropTypes.shape({
      path: PropTypes.string,
      type: PropTypes.string,
      status: PropTypes.string,
    }),
  }),
  changeStatus: PropTypes.bool.isRequired,
  setChangeStatus: PropTypes.func.isRequired,
};

BasicInfo.defaultProps = {
  user: {
    first_name: "",
    last_name: "",
    verified: false,
    email: "",
    phone_number: "",
    postal_code: "",
    credits: 0,
    uid: "",
    experience: {
      first_role_preference: "",
      years_of_experience: "",
      main_type_of_establishment: "",
      sector: "",
      construction_role: "",
      site_type: "",
    },
    personal_document: {
      path: "",
      type: "",
    },
    sector_experience_document: {
      path: "",
      type: "",
    },
  },
};

export default BasicInfo;
