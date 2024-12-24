import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import image from "../../../assets/images/background.png";

function Illustration() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100%",
        background: "linear-gradient(180deg, #46545B 0%, #000 100%)",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 16px",
        minHeight: "100vh",
        zIndex: 100,
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        bgcolor="#fff"
        py="40px"
        px={{ md: "40px", xs: "16px" }}
        borderRadius="24px"
        gap="24px"
        alignItems="center"
        maxWidth="800px"
        width="100%"
        boxSizing="border-box"
      >
        <img
          src={image}
          alt="rocket"
          style={{
            maxWidth: "100%",
          }}
        />
        <Typography
          variant="h4"
          fontSize="32px"
          fontWeight="bold"
          style={{
            fontFamily: "Montserrat",
          }}
        >
          See you soon
        </Typography>
        <Typography
          variant="body1"
          fontSize="16px"
          textAlign="center"
          fontWeight="600"
          color="#5F5F5F"
          style={{
            fontFamily: "Montserrat",
          }}
        >
          Graft will be updated soon and registrations will be restored on July 23th
        </Typography>
        <Typography
          variant="body1"
          fontSize="14px"
          textAlign="center"
          fontWeight="400"
          color="#5F6477"
          style={{
            fontFamily: "Roboto",
          }}
        >
          Already have an account?{" "}
          <Link to="/authentication/login" style={{ color: "#07A0C3", fontWeight: "500" }}>
            Sign in
          </Link>
        </Typography>
      </Box>
    </div>
  );
}

export default Illustration;
