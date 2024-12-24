import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import icon from "assets/images/abortSubscription.svg";
import MDTypography from "components/MDTypography";
import { Button } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "590px",
  width: "100%",
  padding: "16px",
  outline: "none !important",
};

function AbortSubscriptionModal({ isOpen, closeModal }) {
  const abortSubscription = () => {
    // TODO: Implement abort subscription logic
    closeModal();
  };

  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box
          style={{
            width: "100%",
            borderRadius: "24px",
            backgroundColor: "#fff",
            padding: "48px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <button
            type="button"
            onClick={closeModal}
            style={{
              position: "absolute",
              top: "34px",
              right: "34px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              outline: "none",
              width: "32px",
              height: "32px",
            }}
          >
            <CloseIcon
              style={{
                width: "32px",
                height: "32px",
                color: "#AAC2D0",
              }}
            />
          </button>
          <img src={icon} alt="icon" />
          <div>
            <MDTypography
              style={{
                fontSize: "32px",
                color: "#1C1C1C",
                fontWeight: 700,
                textAlign: "center",
                lineHeight: "1.4",
              }}
            >
              Are you sure you want to cancel your subscription?
            </MDTypography>
            <MDTypography
              style={{
                fontSize: "16px",
                color: "#5F5F5F",
                fontWeight: 600,
                textAlign: "center",
                lineHeight: "1.37",
                paddingTop: "8px",
                maxWidth: "400px",
                margin: "0 auto",
              }}
            >
              You will lost your access to the platform until you will renew it.
            </MDTypography>
          </div>
          <div
            style={{
              display: "flex",
              gap: "16px",
              flexDirection: "row",
              maxWidth: "408px",
              width: "100%",
            }}
          >
            <Button
              type="button"
              onCanPlay={closeModal}
              style={{
                background: "#fff",
                borderRadius: "4px",
                border: "1px solid #38B6FF",
                padding: "8px 22px",
                cursor: "pointer",
                outline: "none",
                width: "100%",
                color: "#38B6FF",
              }}
            >
              Keep it
            </Button>
            <Button
              type="button"
              style={{
                background: "#D32F2F",
                borderRadius: "4px",
                border: "none",
                padding: "8px 22px",
                cursor: "pointer",
                outline: "none",
                color: "#fff",
                width: "100%",
              }}
              onClick={abortSubscription}
            >
              Yes, I&apos;m sure
            </Button>
          </div>
        </Box>
      </Box>
    </Modal>
  );
}

AbortSubscriptionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default AbortSubscriptionModal;
