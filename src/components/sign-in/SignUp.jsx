import {
  Stack,
  Typography,
  TextField,
  Button,
  ThemeProvider,
  Link,
} from "@mui/material";
import { createTheme } from "@mui/material";
import { Link as RouterLink } from "react-router";
import { useState } from "react";
import CustomPasswordField from "./CustomPasswordField";

const theme = createTheme({
  palette: {
    text: {
      primary: "#fff",
      secondary: "#fff",
    },
    primary: {
      main: "#F6B17A",
    },
    action: {
      active: "#fff",
    },
  },
  typography: {
    h5: {
      fontWeight: 600, // or 'bold'
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#F6B17A", // Change border color
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#F6B17A", // Change border color on hover
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#F6B17A", // Change border color when focused
          },
        },
      },
    },
  },
});

function SignUp() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <ThemeProvider theme={theme}>
      <Stack
        spacing={2}
        sx={{
          p: 2,
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "80vw", md: "25vw" },
          minWidth: "0px",
          height: "50vh",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px;",
          borderRadius: "1%",
        }}
        style={{ backgroundColor: "#222831" }}
        component="form"
        autoComplete="off"
        alignItems="center"
        justifyContent="center"
        onSubmit={handleSubmit}
      >
        <Typography
          color="textPrimary"
          variant="h5"
          align="center"
          sx={{ width: "80%" }}
        >
          Sign up
        </Typography>
        <TextField
          error={false}
          id="firstname"
          helperText=""
          label="First name"
          sx={{ width: "80%" }}
          size="small"
          required
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
        />
        <TextField
          error={false}
          id="lastname"
          label="Last name"
          helperText=""
          sx={{ width: "80%" }}
          required
          size="small"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
        />
        <TextField
          error={false}
          id="email"
          label="Email"
          helperText=""
          sx={{ width: "80%" }}
          required
          size="small"
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
        />
        <CustomPasswordField
          value={formData.password}
          onChange={handleChange}
          customWidth={"80%"}
        />
        <Button type="submit" variant="outlined" sx={{ width: "80%" }}>
          Sign up
        </Button>
        <Link to="/sign-in" component={RouterLink}>
          Already have an account?
        </Link>
      </Stack>
    </ThemeProvider>
  );
}

export default SignUp;
