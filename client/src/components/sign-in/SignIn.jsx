import {
  Stack,
  Typography,
  TextField,
  Button,
  ThemeProvider,
  Link,
  Alert,
  CircularProgress,
  Box,
  FormControlLabel,
  Checkbox,
  InputAdornment,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { createTheme } from "@mui/material";
import { Link as RouterLink } from "react-router";
import { useState, useReducer, useContext } from "react";
import CustomPasswordField from "./CustomPasswordField";
import { validateEmail, validatePassword } from "./ValidationFunctions";

import { INITIAL_STATE, postReducer } from "./postReducer";
import { ACTION_TYPES } from "./postActionTypes";
import { AppContext } from "../../context/AppContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const PORT = import.meta.env.VITE_PORT;

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

function RememberMe({ rememberMe, setRememberMe }) {
  const handleChange = (event) => {
    setRememberMe(event.target.checked);
  };

  return (
    <FormControlLabel
      control={
        <Checkbox
          name="tandc"
          value="true"
          color="primary"
          sx={{ padding: 0.5, "& .MuiSvgIcon-root": { fontSize: 20 } }}
          checked={rememberMe}
          onChange={handleChange}
        />
      }
      slotProps={{
        typography: {
          fontSize: 14,
          color: "textPrimary",
        },
      }}
      label="Remember me"
    />
  );
}

function SignIn() {
  const [rememberMe, setRememberMe] = useState(true);
  const [message, setMessage] = useState("");
  const [state, dispatch] = useReducer(postReducer, INITIAL_STATE);

  const { setAccessToken, setIsLoggedin } = useContext(AppContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [dataValidity, setDataValidity] = useState({
    email: true,
    password: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    let isValid = true;

    if (name === "email") {
      isValid = validateEmail(value);
    } else if (name === "password") {
      isValid = validatePassword(value);
    }

    setDataValidity({ ...dataValidity, [name]: isValid });

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return;
    }

    for (let name in dataValidity) {
      if (!dataValidity[name]) {
        return;
      }
    }

    dispatch({ type: ACTION_TYPES.POST_START });

    try {
      const res = await fetch(`${BASE_URL}:${PORT}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: rememberMe,
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw data.error || "";
      }

      if (data.message === "Login successful" && data.accessToken) {
        console.log(data);
        setAccessToken(data.accessToken);
        setIsLoggedin(true);
        dispatch({ type: ACTION_TYPES.POST_SUCCESS });
      }
    } catch (err) {
      setMessage(typeof err === "string" ? err : "");
      dispatch({ type: ACTION_TYPES.POST_ERROR });

      console.error(err);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Stack>
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            width: "100%",
            minHeight: "100vh", // Ensures content never overflows
          }}
        >
          <Stack
            spacing={2}
            sx={{
              p: 2,
              mt: 2,
              mb: 2,
              width: { xs: "70%", sm: "350px", md: "370px", xl: "25vw" },
              minHeight: "380px",
              boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px;",
              borderRadius: "1%",
              backgroundColor: "#222831",
            }}
            component="form"
            autoComplete="off"
            alignItems="center"
            justifyContent="center"
            onSubmit={handleSubmit}
          >
            <Typography color="textPrimary" variant="h5" align="center">
              Login
            </Typography>
            <TextField
              error={!dataValidity["email"]}
              id="email"
              label="Email"
              helperText={dataValidity["email"] ? "" : "Invalid email"}
              sx={{ width: "90%" }}
              size="small"
              name="email"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle fontSize="inherit" />
                    </InputAdornment>
                  ),
                },
              }}
              value={formData.email}
              onChange={handleChange}
            />
            <CustomPasswordField
              value={formData.password}
              onChange={handleChange}
              customWidth={"90%"}
              error={!dataValidity["password"]}
              helperText={
                dataValidity["password"]
                  ? ""
                  : "Password must include upper/lowercase letters, numbers & special characters"
              }
            />
            <Stack
              direction="row"
              sx={{ width: "85%" }}
              justifyContent="space-between"
            >
              <RememberMe
                rememberMe={rememberMe}
                setRememberMe={setRememberMe}
              />
              <Link to="/forgot-password" component={RouterLink} align="right">
                Forgot password?
              </Link>
            </Stack>
            <Button type="submit" variant="outlined" sx={{ width: "90%" }}>
              LOG IN
            </Button>
            <Link to="/signup" component={RouterLink}>
              Sign up
            </Link>
            {state.loading && <CircularProgress />}
            {state.error && (
              <Alert severity="error">
                {message || "Something went wrong"}
              </Alert>
            )}
          </Stack>
        </Box>
      </Stack>
    </ThemeProvider>
  );
}

export default SignIn;
