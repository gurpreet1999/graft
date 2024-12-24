import deleteIcon from "assets/images/icons/jobs/delete.png";
import PersonIcon from "@mui/icons-material/Person";
import strype from "assets/images/Billing/stripe.png";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const commonStyles = {
  display: "flex",
  flexDirection: "row",
  gap: "8px",
};

export const renderTableHeader = (type, row) => {
  const getTypeSpecificContent = () => {
    switch (type) {
      case "campaigns":
        return (
          <>
            <span style={{ color: "#353F46", fontSize: "14px", fontWeight: "400" }}>
              #{row?.id?.slice(0, 5)}
            </span>
            <span style={{ color: "#AAC2D0", fontSize: "14px", fontWeight: "400" }}>|</span>
            <span style={{ color: "#353F46", fontSize: "14px", fontWeight: "500" }}>
              {row?.candidates} candidates
            </span>
          </>
        );
      case "invoices":
        return (
          <>
            <span style={{ color: "#353F46", fontSize: "14px", fontWeight: "500" }}>
              #{row?.id.slice(5, 7)}
            </span>
            <span style={{ color: "#AAC2D0", fontSize: "14px", fontWeight: "400" }}>|</span>
            <span style={{ color: "#353F46", fontSize: "14px", fontWeight: "400" }}>
              {row?.date
                .split(" ")
                .map((part, index) => (index === 2 ? part.slice(2) : part))
                .join(" ")}{" "}
            </span>
          </>
        );
      case "candidates":
      case "jobs":
        return (
          <>
            {row.id.length > 5 ? (
              <span style={{ color: "#353F46", fontSize: "14px", fontWeight: "400" }}>
                #{row?.id?.slice(0, 5)}
              </span>
            ) : (
              <span style={{ color: "#353F46", fontSize: "14px", fontWeight: "400" }}>
                #{row?.id}
              </span>
            )}

            <span style={{ color: "#AAC2D0", fontSize: "14px", fontWeight: "400" }}>|</span>
            <span style={{ color: "#353F46", fontSize: "14px", fontWeight: "400" }}>
              {row?.role}
            </span>
          </>
        );
      case "users1":
      case "users2":
      case "users3":
        return (
          <>
            <PersonIcon sx={{ color: "#5F5F5F" }} />
            <span style={{ color: "#353F46", fontSize: "14px", fontWeight: "500" }}>
              {row?.namewithimg?.name}
            </span>
            <span style={{ color: "#888", fontSize: "14px", fontWeight: "400" }}>
              #{row?.id.slice(0, 5)}
            </span>
          </>
        );
      default:
        return null;
    }
  };

  const getTypeSpecificAdditionalContent = () => {
    switch (type) {
      case "campaigns":
      case "jobs":
      case "candidates":
        return (
          <>
            <span style={{ color: "#4E5C78", fontSize: "14px", fontWeight: "400" }}>
              {row?.postcode}
            </span>
            <span style={{ color: "#AAC2D0", fontSize: "14px", fontWeight: "400" }}>|</span>
            <span style={{ color: "#4E5C78", fontSize: "14px", fontWeight: "400" }}>
              {row?.distance ? `${row.distance} km` : "N/A"}
            </span>
          </>
        );
      case "invoices":
        return (
          <>
            <span style={{ color: "#353F46", fontSize: "14px", fontWeight: "400" }}>
              {row?.quantity} credits
            </span>
            <span style={{ color: "#AAC2D0", fontSize: "14px", fontWeight: "400" }}>|</span>
            <span style={{ color: "#353F46", fontSize: "14px", fontWeight: "400" }}>
              {row?.amount}
            </span>
          </>
        );
      case "users1":
      case "users2":
      case "users3":
        return (
          <div style={{ ...commonStyles, gap: "12px" }}>
            <span style={{ color: "#1C1C1C", fontSize: "14px", fontWeight: "400" }}>
              {row?.credits} credits
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div style={commonStyles}>{getTypeSpecificContent()}</div>
      {getTypeSpecificAdditionalContent() && (
        <div style={commonStyles}>{getTypeSpecificAdditionalContent()}</div>
      )}
    </>
  );
};

export const renderTableInner = (type, row) => {
  const commonContainerStyles = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  };

  const commonItemStyles = {
    color: "#1C1C1C",
    fontSize: "14px",
    fontWeight: "400",
  };

  const pairConteinerStyles = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: "8px",
  };

  const renderKeyValuePair = (key = null, value, style = {}) => (
    <div style={{ ...commonItemStyles, ...pairConteinerStyles }}>
      {key && <span style={{ color: "#353F46", fontWeight: "500" }}>{key}</span>}
      <span style={style}>{value}</span>
    </div>
  );

  const renderCampaignContent = () => (
    <div style={commonContainerStyles}>
      {renderKeyValuePair("Role:", row?.role)}
      {renderKeyValuePair("Type of Establishment:", row?.expertise)}
      {renderKeyValuePair("Experience:", row?.experience)}
    </div>
  );

  const renderInvoiceContent = () => {
    const statusColor =
      {
        Paid: "#E1FCDC",
        Failed: "#FDDDD3",
      }[row.statusInvoice] || "#E9E9E9";

    return (
      <div
        style={{
          ...commonContainerStyles,
          flexDirection: "row",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <Grid container direction="row" alignItems="center" gap="8px">
          <img src={strype} alt="strype logo" />
          <MDTypography style={{ ...commonItemStyles, fontWeight: 600 }}>Stripe</MDTypography>
        </Grid>
        <MDBox
          style={{
            ...commonItemStyles,
            padding: "4px 10px",
            backgroundColor: statusColor,
            borderRadius: "8px",
          }}
        >
          {row.statusInvoice}
        </MDBox>
      </div>
    );
  };

  const renderCandidateContent = () => (
    <div style={commonContainerStyles}>
      {renderKeyValuePair("Role:", row?.role)}
      {renderKeyValuePair("Type of Establishment:", row?.area)}
      {renderKeyValuePair("Experience:", row?.years)}
      {renderKeyValuePair("Status:", row?.statusVerified ? "Verified" : "Not Verified", {
        backgroundColor: row?.statusVerified ? "#E1FCDC" : "#E9E9E9",
        borderRadius: "8px",
        padding: "4px 10px",
      })}
    </div>
  );

  const renderJobContent = () => (
    <div style={commonContainerStyles}>
      {renderKeyValuePair("Area of Expertise:", row?.expertise)}
      {renderKeyValuePair("Experience:", row?.experience)}
      {renderKeyValuePair("Status:", row?.statusJob ? "Published" : "Draft", {
        backgroundColor: row?.statusJob ? "#E1FCDC" : "#FDDDD3",
        borderRadius: "15px",
        padding: "4px 10px",
      })}
      {row?.matches && renderKeyValuePair("Candidates Matches:", row?.matches)}
      {row?.applied && renderKeyValuePair("Applied to a job:", row?.applied)}
    </div>
  );

  const renderUserContent = () => (
    <div style={commonContainerStyles}>
      {renderKeyValuePair(null, row?.email)}
      {type !== "users3" && renderKeyValuePair(null, row?.phone)}
    </div>
  );

  switch (type) {
    case "campaigns":
      return renderCampaignContent();
    case "invoices":
      return renderInvoiceContent();
    case "candidates":
      return renderCandidateContent();
    case "jobs":
      return renderJobContent();
    case "users1":
    case "users2":
    case "users3":
      return renderUserContent();
    default:
      return null;
  }
};

export const renderTableActions = (type, row, handleDeleteItem, handleSuspendUser) => {
  if (type === "campaigns") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <Link
          style={{
            display: "block",
            height: "30px",
          }}
          className="MuiButton-root"
          to={`/campaign-history/campaign-details/${row.actionDetailsCamapign}`}
        >
          <button
            type="button"
            style={{
              display: "block",
              padding: "4px 10px",
              backgroundColor: "#38B6FF",
              textTransform: "uppercase",
              color: "white",
              borderRadius: "4px",
              boxShadow:
                "0px 3px 1px -2px rgba(0, 0, 0, 0.20), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
              fontFamily: "Roboto, sans-serif",
              fontSize: "13px",
              height: "30px",
              outline: "none",
              border: "none",
            }}
          >
            Details
          </button>
        </Link>
      </div>
    );
  }
  if (type === "jobs") {
    if (row.actionDetailsDelete) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <Link
            style={{
              display: "block",
              height: "30px",
            }}
            className="MuiButton-root"
            to={`/jobs/job-details/${row.actionDetailsDelete}`}
          >
            <button
              type="button"
              style={{
                display: "block",
                padding: "4px 10px",
                backgroundColor: "#38B6FF",
                textTransform: "uppercase",
                color: "white",
                borderRadius: "4px",
                boxShadow:
                  "0px 3px 1px -2px rgba(0, 0, 0, 0.20), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
                fontFamily: "Roboto, sans-serif",
                fontSize: "13px",
                height: "30px",
                outline: "none",
                border: "none",
              }}
            >
              Details
            </button>
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
              border: "none",
              outline: "none",
              cursor: "pointer",
              boxShadow:
                "0px 4px 12px 4px rgba(38, 42, 63, 0.06), 0px 2px 4px -1px rgba(48, 57, 65, 0.16)",
            }}
            onClick={() => {
              handleDeleteItem(row.actionDetailsDelete);
            }}
          >
            <img src={deleteIcon} alt="delete" />
          </button>
        </div>
      );
    }

    if (row.actionJobApplied) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <Link
            style={{
              display: "block",
              height: "30px",
            }}
            className="MuiButton-root"
            to={`/jobs/job-details/${row.actionJobApplied}`}
          >
            <button
              type="button"
              style={{
                display: "block",
                padding: "4px 10px",
                backgroundColor: "#38B6FF",
                textTransform: "uppercase",
                color: "white",
                borderRadius: "4px",
                boxShadow:
                  "0px 3px 1px -2px rgba(0, 0, 0, 0.20), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
                fontFamily: "Roboto, sans-serif",
                fontSize: "13px",
                height: "30px",
                outline: "none",
                border: "none",
              }}
            >
              Details
            </button>
          </Link>
        </div>
      );
    }
  }
  if (type === "users1" || type === "users2" || type === "users3") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <Link
          style={{
            display: "block",
            height: "30px",
          }}
          className="MuiButton-root"
          to={`user-details/${row.actionMoreDeleteUser}`}
        >
          <button
            type="button"
            style={{
              display: "block",
              padding: "4px 10px",
              backgroundColor: "#38B6FF",
              textTransform: "uppercase",
              color: "white",
              borderRadius: "4px",
              boxShadow:
                "0px 3px 1px -2px rgba(0, 0, 0, 0.20), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
              fontFamily: "Roboto, sans-serif",
              fontSize: "13px",
              height: "30px",
              outline: "none",
              border: "none",
            }}
          >
            Details
          </button>
        </Link>
        {type !== "users3" && (
          <button
            type="button"
            onClick={() => handleSuspendUser(row.actionMoreDeleteUser)}
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
              height: "30px",
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
        )}
      </div>
    );
  }
  return null;
};
