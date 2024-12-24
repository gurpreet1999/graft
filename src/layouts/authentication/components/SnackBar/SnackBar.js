/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function SnackBar({ errorMessages, handleCloseSnack }) {
  return (
    <>
      {errorMessages.map((message, index) => (
        <Snackbar
          key={index}
          open
          autoHideDuration={2000}
          onClose={() => handleCloseSnack(index)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={() => handleCloseSnack(index)} severity="error">
            {message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
}

export default SnackBar;
