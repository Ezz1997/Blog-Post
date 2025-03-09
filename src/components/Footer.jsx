import Typography from "@mui/material/Typography";

function Footer() {
  return (
    <footer
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        backgroundColor: "#222831",
      }}
    >
      <Typography
        variant="h6"
        align="inherit"
        sx={{ color: "white"}}
      >
        Ezz Maree • © 2025
      </Typography>
    </footer>
  );
}

export default Footer;
