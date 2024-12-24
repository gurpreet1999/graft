import Grid from "@mui/material/Grid";
import success from "assets/images/search/success.svg";
import MDTypography from "components/MDTypography";
import Button from "@mui/material/Button";

export default function CreateSuccess() {
  return (
    <Grid container gap={3} direction="column" alignItems="center">
      <img src={success} alt="success" style={{ width: "80px", height: "80px" }} />
      <Grid item container gap="6px" direction="column">
        <MDTypography
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            lineHeight: "1.4",
            fontFamily: "Montserrat",
            color: "#1C1C1C",
            textAlign: "center",
          }}
        >
          Success
        </MDTypography>
        <MDTypography
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#5F5F5F",
            fontFamily: "Montserrat",
            textAlign: "center",
          }}
        >
          Campaign was successfully sent
        </MDTypography>
      </Grid>
      <Button
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
          width: "100%",
        }}
        onClick={() => window.location.reload()}
      >
        Go back
      </Button>
    </Grid>
  );
}
