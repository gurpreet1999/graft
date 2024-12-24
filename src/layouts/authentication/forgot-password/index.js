/* eslint-disable import/named */
/* eslint-disable react/jsx-no-useless-fragment */
import { useState } from "react";
import IllustrationLayout from "layouts/authentication/components/IllustrationLayout";
import bgImage from "assets/images/illustrations/Illustration-auth.png";
import FormField from "layouts/pages/account/components/FormField";
import { Link } from "react-router-dom";
import SnackBar from "../components/SnackBar/SnackBar";
import { requestPasswordReset } from "../../../firebase/auth";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [snackMessages, setSnackMessages] = useState([]);
  const maxSnackMessages = 4;

  const handleCloseSnack = (index) => {
    setSnackMessages((prevMessages) => prevMessages.filter((_, i) => i !== index));
  };

  const handleResetPassword = async () => {
    try {
      await requestPasswordReset(email);
      setSuccess(true);
    } catch (error) {
      const newMessages = [...snackMessages, error.message];
      setSnackMessages(newMessages.slice(Math.max(newMessages.length - maxSnackMessages, 0)));
    }
  };

  return (
    <IllustrationLayout
      title={
        <p
          style={{
            fontSize: "32px",
            fontWeight: "700",
            fontFamily: "Montserrat",
          }}
        >
          {success ? "Success!" : "Forgot Your Password"}
        </p>
      }
      description={
        <p
          style={{
            fontSize: "16px",
            fontWeight: "600",
            fontFamily: "Montserrat",
          }}
        >
          {success
            ? "Please check your email for further instructions on how to reset your password."
            : "Please enter your email address. You will receive a link to create a new password via email"}
        </p>
      }
      illustration={bgImage}
    >
      {!success && (
        <>
          <FormField
            value={email}
            type="text"
            label="Email"
            placeholder="Enter your email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <button
            type="button"
            style={{
              backgroundColor: "#38B6FF",
              color: "white",
              width: "100%",
              padding: "8px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              fontSize: "15px",
              textTransform: "uppercase",
              marginTop: "24px",
              lineHeight: "1.73",
              fontWeight: "500",
            }}
            onClick={handleResetPassword}
          >
            Reset password
          </button>
        </>
      )}
      <Link
        to="/authentication/login"
        style={{
          backgroundColor: "#fff",
          color: "#38B6FF",
          width: "100%",
          padding: "8px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          fontSize: "15px",
          textTransform: "uppercase",
          marginTop: "8px",
          lineHeight: "1.73",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "500",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
        >
          <path
            d="M15.7049 7.91L14.2949 6.5L8.29492 12.5L14.2949 18.5L15.7049 17.09L11.1249 12.5L15.7049 7.91Z"
            fill="#2196F3"
          />
        </svg>{" "}
        Back to log in
      </Link>
      <SnackBar errorMessages={snackMessages} handleCloseSnack={handleCloseSnack} />
    </IllustrationLayout>
  );
}

export default ForgotPassword;
