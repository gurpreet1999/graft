/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Autocomplete from "@mui/material/Autocomplete";
import "dropzone/dist/dropzone.css";
import dropZoneImg from "assets/images/icons/fileUpload.svg";
import { useDropzone } from "react-dropzone";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import MDDropzoneRoot from "components/MDDropzone/MDDropzoneRoot";
import { useMaterialUIController } from "context";
import MDTypography from "components/MDTypography";
import FormField from "layouts/pages/account/components/FormField";

const getFileName = (acceptedFiles) => {
  if (acceptedFiles.length > 0) {
    const fileName = acceptedFiles[0].name;
    return fileName.length > 15 ? `${fileName.slice(0, 15)}...` : fileName;
  }
  return "Drag and drop file here";
};

function MDDropzone({ values, setDocumentName, setDocumentFile, primaryName }) {
  const { acceptedFiles, open, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
  });
  const [kind, setKind] = useState(primaryName);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const dropzoneRef = useRef();
  const width = window.innerWidth;

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      setDocumentFile(acceptedFiles[0]);
      setDocumentName(kind);
    }
  }, [acceptedFiles, kind]);

  return (
    <MDDropzoneRoot
      component="div"
      ref={dropzoneRef}
      className="form-control"
      ownerState={{ darkMode }}
      style={{ position: "relative", maxHeight: "70px" }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <Grid
        container
        px={width < 900 ? 0.5 : 3}
        py={2}
        style={{
          position: "absolute",
          pointerEvents: "none",
          left: "50%",
          top: width < 900 ? "0%" : "50%",
          transform: width < 900 ? "translate(-50%, 0%)" : "translate(-50%, -50%)",
          width: "calc(100% - 4px)",
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          flexDirection: width < 600 ? "column-reverse" : "row",
          justifyContent: "space-between",
          height: width < 900 ? "100%" : "68px",
        }}
      >
        <Grid
          item
          style={{
            display: "flex",
            alignItems: "center",
            gap: width < 700 ? "8px" : "16px",
            flexDirection: "row",
            border: width < 600 ? "1px solid #DCE7ED" : "none",
            padding: width < 600 ? "8px 20px 8px 16px" : "0px 0px 6px 0px",
            borderRadius: width < 600 ? "12px" : "0px",
          }}
        >
          <img src={dropZoneImg} alt="dropzone" />
          <MDTypography variant="h6" textAlign="center">
            {acceptedFiles.length > 0 ? getFileName(acceptedFiles) : "Drag and drop file here"}
          </MDTypography>
        </Grid>
        <Grid
          item
          style={{
            display: "flex",
            alignItems: "center",
            gap: width < 700 ? "8px" : "16px",
            flexDirection: "row",
          }}
        >
          <Autocomplete
            defaultValue={values[1]}
            options={values}
            onClick={(e) => e.stopPropagation()}
            onChange={(e, newValue) => setKind(newValue)}
            renderInput={(params) => (
              <FormField
                {...params}
                InputLabelProps={{ shrink: true }}
                style={{ width: width < 900 ? "120px" : "300px", marginTop: "0px", zIndex: 10000 }}
              />
            )}
            style={{
              width: width < 900 ? "120px" : "300px",
              marginTop: "0px",
              position: "relative",
              top: "-12px",
              zIndex: 10000,
              pointerEvents: "auto",
            }}
          />
          <Button
            onClick={open}
            style={{
              color: "#38B6FF",
              borderRadius: "4px",
              pointerEvents: "auto",
              border: "1px solid #38B6FF",
              padding: width < 900 ? "2px 16px" : "9px 24px",
            }}
          >
            Browse File
          </Button>
        </Grid>
      </Grid>
    </MDDropzoneRoot>
  );
}

MDDropzone.propTypes = {
  options: PropTypes.instanceOf(Object).isRequired,
  values: PropTypes.instanceOf(Array).isRequired,
  setDocumentName: PropTypes.func.isRequired,
  setDocumentFile: PropTypes.func.isRequired,
  primaryName: PropTypes.string.isRequired,
};

export default MDDropzone;
