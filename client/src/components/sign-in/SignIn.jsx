import * as React from "react";
import {
  Button,
  FormControl,
  FormControlLabel,
  Checkbox,
  InputLabel,
  OutlinedInput,
  TextField,
  InputAdornment,
  Alert,
  IconButton,
  Link,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { AppProvider } from "@toolpad/core/AppProvider";
import { SignInPage } from "@toolpad/core/SignInPage";
import { createTheme } from "@mui/material/styles";
import { Link as RouterLink } from "react-router";

const providers = [{ id: "credentials", name: "Email and Password" }];

function CustomEmailField() {
  return (
    <TextField
      id="input-with-icon-textfield"
      label="Email"
      name="email"
      type="email"
      size="small"
      required
      fullWidth
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle fontSize="inherit" />
            </InputAdornment>
          ),
        },
      }}
      variant="outlined"
    />
  );
}

function CustomPasswordField() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FormControl sx={{ my: 2 }} fullWidth variant="outlined">
      <InputLabel size="small" htmlFor="outlined-adornment-password">
        Password
      </InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        type={showPassword ? "text" : "password"}
        name="password"
        size="small"
        required
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              size="small"
            >
              {showPassword ? (
                <VisibilityOff fontSize="inherit" />
              ) : (
                <Visibility fontSize="inherit" />
              )}
            </IconButton>
          </InputAdornment>
        }
        label="Password"
      />
    </FormControl>
  );
}

function CustomButton() {
  return (
    <Button
      type="submit"
      variant="outlined"
      color="info"
      size="small"
      disableElevation
      fullWidth
      sx={{ my: 2 }}
    >
      Log In
    </Button>
  );
}

function SignUpLink() {
  return (
    <Link to="/sign-up" component={RouterLink}>
      Sign up
    </Link>
  );
}

function ForgotPasswordLink() {
  return (
    <Link to="/forgot-password" component={RouterLink}>
      Forgot password?
    </Link>
  );
}

function Title() {
  return <h2 style={{ marginBottom: 8 }}>Login</h2>;
}

// function Subtitle() {
//   return (
//     <Alert sx={{ mb: 2, px: 1, py: 0.25 }} severity="warning">
//       We are investigating an ongoing outage.
//     </Alert>
//   );
// }

function RememberMe() {
  return (
    <FormControlLabel
      control={
        <Checkbox
          name="tandc"
          value="true"
          color="primary"
          sx={{ padding: 0.5, "& .MuiSvgIcon-root": { fontSize: 20 } }}
        />
      }
      slotProps={{
        typography: {
          fontSize: 14,
        },
      }}
      color="textSecondary"
      label="Remember me"
    />
  );
}

const theme = createTheme({
  palette: {
    background: {
      paper: "#222831",
      default: "#eee",
    },
    text: {
      primary: "#fff",
      secondary: "#fff",
    },
    action: {
      active: "#fff",
    },
    primary: {
      main: "#F6B17A",
    },
    info: {
      main: "#F6B17A",
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

export default function SignIn() {
  const handleSubmit = (data) => {
    console.log("Email: ", data.get("email"));
    console.log("Password: ", data.get("password"));

    fetch("http://localhost:8000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.get("email"),
        password: data.get("password"),
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.json();
      })
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  };

  return (
    <AppProvider theme={theme}>
      <SignInPage
        signIn={
          (provider, formData) => handleSubmit(formData)
          // alert(
          //   `Logging in with "${provider.name}" and credentials: ${formData.get(
          //     "email"
          //   )}, ${formData.get("password")}, and checkbox value: ${formData.get(
          //     "tandc"
          //   )}`
          // )
        }
        slots={{
          title: Title,
          // subtitle: Subtitle,
          emailField: CustomEmailField,
          passwordField: CustomPasswordField,
          submitButton: CustomButton,
          signUpLink: SignUpLink,
          rememberMe: RememberMe,
          forgotPasswordLink: ForgotPasswordLink,
        }}
        providers={providers}
        slotProps={{
          form: {
            autoComplete: "off",
            sx: {
              height: "250px",
            },
          },
        }}
      />
    </AppProvider>
  );
}
