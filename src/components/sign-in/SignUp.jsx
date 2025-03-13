import {
  Stack,
  Typography,
  TextField,
  Button,
  ThemeProvider,
  Link,
  Alert,
  CircularProgress,
} from "@mui/material";
import { createTheme } from "@mui/material";
import { Link as RouterLink } from "react-router";
import { useState } from "react";
import CustomPasswordField from "./CustomPasswordField";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "./ValidationFunctions";

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
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const [dataValidity, setDataValidity] = useState({
    firstname: true,
    lastname: true,
    email: true,
    password: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    let isValid = true;

    if (name === "firstname" || name === "lastname") {
      isValid = validateName(value);
    } else if (name === "email") {
      isValid = validateEmail(value);
    } else if (name === "password") {
      isValid = validatePassword(value);
    }

    setDataValidity({ ...dataValidity, [name]: isValid });

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.email ||
      !formData.password
    ) {
      console.log("Make sure to fill out all fields");
      return;
    }

    for (let name in dataValidity) {
      if (!dataValidity[name]) {
        console.log("Invalid data");
        return;
      }
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);

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
          height: { xs: "70vh", sm: "45vh", md: "55vh" },
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
          error={!dataValidity["firstname"]}
          id="firstname"
          helperText={
            dataValidity["firstname"] ? "" : "Name must contain only letters"
          }
          label="First name"
          sx={{ width: "80%" }}
          size="small"
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
        />
        <TextField
          error={!dataValidity["lastname"]}
          id="lastname"
          label="Last name"
          helperText={
            dataValidity["lastname"] ? "" : "Name must contain only letters"
          }
          sx={{ width: "80%" }}
          size="small"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
        />
        <TextField
          error={!dataValidity["email"]}
          id="email"
          label="Email"
          helperText={dataValidity["email"] ? "" : "Invalid email"}
          sx={{ width: "80%" }}
          size="small"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <CustomPasswordField
          value={formData.password}
          onChange={handleChange}
          customWidth={"80%"}
          error={!dataValidity["password"]}
          helperText={
            dataValidity["password"]
              ? ""
              : "Password must include upper/lowercase letters, numbers & special characters"
          }
        />
        <Button type="submit" variant="outlined" sx={{ width: "80%" }}>
          Sign up
        </Button>
        <Link to="/sign-in" component={RouterLink}>
          Already have an account?
        </Link>
        {loading && <CircularProgress />}
      </Stack>
    </ThemeProvider>
  );
}

export default SignUp;
