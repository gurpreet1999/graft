import deleteIcon from "assets/images/icons/jobs/delete.png";
import PersonIcon from "@mui/icons-material/Person";
import Button from "@mui/material/Button";
import strype from "assets/images/Billing/stripe.png";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function getBackgroundColor(value) {
  if (value) {
    return "#E1FCDC";
  }
  return "#E9E9E9";
}

export const renderTableRow = (cell, handleDeleteItem, handleSuspendUser, isShowFooter) => {
  const cellType = cell.column.id;
  if (cellType === "documentsProvided") {
    return (
      <MDBox
        style={{
          color: cell.value ? "#07A0C3" : "#1C1C1C",
          fontSize: "14px",
          fontWeight: "400",
        }}
      >
        {cell.value ? "Yes" : "No"}
      </MDBox>
    );
  }
  if (cellType === "verified") {
    return (
      <MDBox
        style={{
          color: cell.value ? "#07A0C3" : "#1C1C1C",
          fontSize: "14px",
          fontWeight: "400",
        }}
      >
        {cell.value ? "Verified" : "Not Verified"}
      </MDBox>
    );
  }
  if (cellType === "payments") {
    return (
      <Grid container direction="row" alignItems="center" gap="8px">
        <img src={strype} alt="strype logo" />
        <MDTypography
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#353F46",
          }}
        >
          Stripe
        </MDTypography>
      </Grid>
    );
  }
  if (cellType === "statusInvoice") {
    let statusColor = "#E9E9E9";
    if (cell.value === "Paid") {
      statusColor = "#E1FCDC";
    }
    if (cell.value === "Failed") {
      statusColor = "#FDDDD3";
    }
    return (
      <MDBox
        style={{
          color: "#353F46",
          fontSize: "14px",
          fontWeight: "400",
          padding: "4px 10px",
          backgroundColor: statusColor,
          borderRadius: "8px",
        }}
      >
        {cell.render("Cell")}
      </MDBox>
    );
  }
  if (cellType === "statusJobApplied") {
    return (
      <MDBox
        style={{
          color: "#353F46",
          fontSize: "14px",
          fontWeight: "400",
          padding: "4px 10px",
          borderRadius: "8px",
          backgroundColor: cell.value ? "#E1FCDC" : "#FDDDD3",
        }}
      >
        {cell.value ? "Opened" : "Closed"}
      </MDBox>
    );
  }
  if (cellType === "actionDetailsCamapign") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Link to={`campaign-details/${cell.value}`}>
          <Button
            style={{
              padding: "4px 10px",
              backgroundColor: "#38B6FF",
              textTransform: "uppercase",
              color: "white",
              borderRadius: "4px",
              boxShadow:
                "0px 3px 1px -2px rgba(0, 0, 0, 0.20), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
              fontFamily: "Roboto, sans-serif",
              fontSize: "16px",
            }}
          >
            Details
          </Button>
        </Link>
      </div>
    );
  }
  if (cellType === "actionMoreDeleteUser") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Link className="MuiButton-root" to={`user-details/${cell.value}`}>
          <Button
            style={{
              padding: "4px 10px",
              backgroundColor: "#38B6FF",
              textTransform: "uppercase",
              color: "white",
              borderRadius: "4px",
              boxShadow:
                "0px 3px 1px -2px rgba(0, 0, 0, 0.20), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
              fontFamily: "Roboto, sans-serif",
              fontSize: "16px",
            }}
          >
            Details
          </Button>
        </Link>
        <button
          type="button"
          onClick={() => handleSuspendUser(cell.value)}
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
      </div>
    );
  }
  if (cellType === "namewithimg") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {cell.value.img ? (
          <img
            src={cell.value.img}
            alt=""
            style={{ width: "24px", height: "24px", borderRadius: "50%" }}
          />
        ) : (
          <PersonIcon style={{ fontSize: "24px" }} />
        )}
        <span>{cell.value.name}</span>
      </div>
    );
  }
  if (cellType === "action") {
    return (
      <Link
        className="MuiButton-root"
        to={`/user-details/${cell.value}`}
        style={{
          color: "#FFF",
          fontSize: "13px",
          fontWeight: "400",
          padding: "4px 10px",
          borderRadius: "4px",
          backgroundColor: "#38B6FF",
          textTransform: "uppercase",
        }}
      >
        Details
      </Link>
    );
  }
  if (cellType === "statusJob") {
    return (
      <MDBox
        style={{
          color: "#353F46",
          fontSize: "14px",
          fontWeight: "400",
          padding: "4px 10px",
          borderRadius: "8px",
          backgroundColor: getBackgroundColor(cell.value),
        }}
      >
        {cell.value ? "Published" : "Not Published"}
      </MDBox>
    );
  }
  if (cellType === "actionJobApplied") {
    return (
      <Link
        className="MuiButton-root"
        to={`/jobs/job-details/${cell.value}`}
        style={{
          color: "#FFF",
          fontSize: "13px",
          fontWeight: "400",
          padding: "4px 10px",
          borderRadius: "4px",
          backgroundColor: "#38B6FF",
          textTransform: "uppercase",
        }}
      >
        Details
      </Link>
    );
  }

  if (cellType === "actionDetailsDelete") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Link
          className="MuiButton-root"
          to={`/jobs/job-details/${cell.value}`}
          style={{
            color: "#FFF",
            fontSize: "13px",
            fontWeight: "400",
            padding: "4px 10px",
            borderRadius: "4px",
            backgroundColor: "#38B6FF",
            textTransform: "uppercase",
          }}
        >
          Details
        </Link>
        <button
          type="button"
          style={{
            color: "#FFF",
            fontSize: "13px",
            fontWeight: "400",
            padding: "5px",
            maxWidth: "30px",
            maxHeight: "30px",
            borderRadius: "4px",
            backgroundColor: "#fff",
            textTransform: "uppercase",
            marginLeft: "10px",
            border: "none",
            outline: "none",
            cursor: "pointer",
            boxShadow:
              "0px 4px 12px 4px rgba(38, 42, 63, 0.06), 0px 2px 4px -1px rgba(48, 57, 65, 0.16)",
          }}
          onClick={() => {
            handleDeleteItem(cell.value);
          }}
        >
          <img src={deleteIcon} alt="delete" />
        </button>
      </div>
    );
  }
  if (cellType === "statusVerified") {
    return (
      <MDBox
        style={{
          color: cell.value ? "#07A0C3" : "#1C1C1C",
          fontSize: "14px",
          fontWeight: "400",
        }}
      >
        {cell.value ? "Verified" : "Not Verified"}
      </MDBox>
    );
  }
  if (cellType === "role" && !isShowFooter) {
    return <MDBox py="4px">{cell.value}</MDBox>;
  }
  return <div>{cell.render("Cell")}</div>;
};
