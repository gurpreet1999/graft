import React, { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import PropTypes from "prop-types";

function CustomSnackbar({ messages }) {
  const [snackMessages, setSnackMessages] = useState([]);
  const maxSnackMessages = 4;

  const handleCloseSnack = (index) => {
    setSnackMessages((prevMessages) => prevMessages.filter((_, i) => i !== index));
  };

  const renderAlert = (severity, message, index) => (
    <Snackbar
      key={index}
      open
      autoHideDuration={1500}
      onClose={() => handleCloseSnack(index)}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={() => handleCloseSnack(index)} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );

  const updateSnackMessages = (newMessage) => {
    setSnackMessages((prevMessages) =>
      prevMessages.length < maxSnackMessages
        ? [...prevMessages, newMessage]
        : [...prevMessages.slice(1), newMessage]
    );
  };

  useEffect(() => {
    messages.forEach(({ type, text }) => {
      updateSnackMessages({ type, text });
    });
  }, [messages]);

  return <>{snackMessages.map(({ type, text }, index) => renderAlert(type, text, index))}</>;
}

export default CustomSnackbar;
CustomSnackbar.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
};
