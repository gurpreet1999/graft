import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import MDDropzone from "components/MDDropzone";
import Button from "@mui/material/Button";
import { userSelector } from "store/user/selectors";
import { useSelector } from "react-redux";
import LinearProgress from "@mui/material/LinearProgress";
import uploadIcon from "assets/images/icons/fileUpload.svg";
import { personalDocumentTypes, sectorExperienceDocumentTypes } from "constants/candidate";
import {
  deleteDocument as deleteUserDocument,
  uploadDocument,
  downloadDocument,
} from "../../../../../../firebase/user";

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
  return "Pending";
};

const upprovedColor = (approved) => {
  if (approved === "approved") {
    return "#219653";
  }
  if (approved === "rejected") {
    return "#FF5C93";
  }
  return "#FF5C93";
};

function Verification() {
  const [firstDocumentName, setFirstDocumentName] = useState("Driving License");
  const [firstDocumentFile, setFirstDocumentFile] = useState("");
  const [secondDocumentName, setSecondDocumentName] = useState("Employment Contract");
  const [secondDocumentFile, setSecondDocumentFile] = useState("");
  const [isUploadingFirst, setIsUploadingFirst] = useState(false);
  const [isUploadingSecond, setIsUploadingSecond] = useState(false);
  const [progressPersonal, setProgressPersonal] = useState(0);
  const [progressSector, setProgressSector] = useState(0);
  const { user } = useSelector(userSelector);

  const deleteDocument = async (kind) => {
    await deleteUserDocument({ currentUser: user, kind });
    window.location.reload();
  };

  const downloadPersonalFile = async () => {
    await downloadDocument(user?.personal_document?.path);
  };

  const downloadSectorFile = async () => {
    await downloadDocument(user?.sector_experience_document?.path);
  };

  const handleUpload = async () => {
    if (firstDocumentFile && firstDocumentName) {
      setIsUploadingFirst(true);
      await uploadDocument({
        file: firstDocumentFile,
        kind: "personal",
        documentType: firstDocumentName,
        setProgressPersonal,
        user,
      });
      setIsUploadingFirst(false);
    }
    if (secondDocumentFile && secondDocumentName) {
      setIsUploadingSecond(true);
      await uploadDocument({
        file: secondDocumentFile,
        kind: "sector",
        documentType: secondDocumentName,
        setProgressSector,
        user,
      });
      setIsUploadingSecond(false);
    }
    window.location.reload();
  };

  return (
    <Card id="basic-info" sx={{ overflow: "visible" }}>
      <MDBox p={3}>
        <MDBox
          style={{
            display: "flex",
            flexDirection: window.innerWidth < 768 ? "column" : "row",
            gap: "8px",
            alignItems: window.innerWidth < 768 ? "flex-start" : "flex-end",
          }}
        >
          <MDTypography variant="h5">Verification</MDTypography>
          <MDTypography
            style={{
              fontSize: "12px",
              color: "#888",
            }}
          >
            Upload 2 documents to become a verified candidate including 1 showing sector experience
            the names must match your profile.
          </MDTypography>
        </MDBox>
      </MDBox>
      {user?.personal_document ? (
        <Grid item container pb={2} px={3}>
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
              position: "relative",
            }}
          >
            {(user?.personal_document?.status === "rejected" ||
              user?.personal_document?.status === "pending") && (
              <button
                type="button"
                style={{
                  position: "absolute",
                  border: "2px solid #DCE7ED",
                  background: "#fff",
                  padding: "4px 8px",
                  right: "0",
                  top: "-10px",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                onClick={() => {
                  deleteDocument("personal");
                }}
              >
                x
              </button>
            )}
            <button
              type="button"
              onClick={downloadPersonalFile}
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
            </div>
          </div>
        </Grid>
      ) : (
        <MDBox component="form" pb={2} px={3}>
          <MDTypography
            style={{
              fontSize: "12px",
              color: "#888",
            }}
          >
            Document №1
          </MDTypography>
          {isUploadingFirst ? (
            <LinearProgress variant="determinate" color="info" progress={progressPersonal} />
          ) : (
            <MDDropzone
              values={personalDocumentTypes}
              setDocumentName={setFirstDocumentName}
              setDocumentFile={setFirstDocumentFile}
              primaryName="Driving License"
              approved={user?.personal_document}
            />
          )}
        </MDBox>
      )}
      {user?.sector_experience_document ? (
        <Grid item container pb={2} px={3}>
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
            {(user?.sector_experience_document?.status === "rejected" ||
              user?.sector_experience_document?.status === "pending") && (
              <button
                type="button"
                style={{
                  position: "absolute",
                  border: "2px solid #DCE7ED",
                  background: "#fff",
                  padding: "4px 8px",
                  right: "0",
                  top: "-10px",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                onClick={() => {
                  deleteDocument("sector");
                }}
              >
                x
              </button>
            )}

            <button
              type="button"
              onClick={downloadSectorFile}
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
            </div>
          </div>
        </Grid>
      ) : (
        <MDBox component="form" pb={2} px={3}>
          <MDTypography
            style={{
              fontSize: "12px",
              color: "#888",
            }}
          >
            Document №2
          </MDTypography>
          {isUploadingSecond ? (
            <LinearProgress variant="determinate" color="info" value={progressSector} />
          ) : (
            <MDDropzone
              values={sectorExperienceDocumentTypes}
              setDocumentName={setSecondDocumentName}
              setDocumentFile={setSecondDocumentFile}
              primaryName="Employment Contract"
            />
          )}
        </MDBox>
      )}
      <Grid item container justifyContent="flex-end" px={2} pr={3} mb={2}>
        <Button
          onClick={handleUpload}
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
        >
          Save Changes
        </Button>
      </Grid>
    </Card>
  );
}

export default Verification;
