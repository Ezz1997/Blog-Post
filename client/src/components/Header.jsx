import { useContext, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router";
import logo from "../assets/logo.png";
import { AppContext } from "../context/AppContext";
import SearchBar from "../components/SearchBar";
import SearchIcon from "@mui/icons-material/Search";
import postIcon from "../assets/postIcon.png";

const settings = ["Profile", "Account", "Dashboard", "Logout"];

function Header() {
  const [anchorElUser, setAnchorElUser] = useState(null);

  const { accessToken } = useContext(AppContext);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#222831" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: "flex" }}>
            <IconButton
              sx={{
                display: "flex",
                fontFamily: "monospace",
              }}
              component={Link}
              to={accessToken ? "/" : null}
            >
              <Avatar alt="Logo" src={logo} />
            </IconButton>
            <Box
              sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, mt: 1 }}
            >
              <SearchBar />
            </Box>
          </Box>
          <Box
            sx={{
              mr: 1,
              display: { xs: "flex", md: "none" },
            }}
          >
            <IconButton
              type="button"
              aria-label="search"
              onClick={() => console.log("Oh my god I've been clicked!")}
            >
              <SearchIcon sx={{ color: "white" }} />
            </IconButton>{" "}
          </Box>

          <Box
            sx={{
              display: "flex",
              color: "inherit",
              textDecoration: "none",
              flexDirection: "row",
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
            component={Link}
            to={accessToken ? "/new-post" : null}
          >
            <Typography
              sx={{ mt: 1.8, fontFamily: "monospace", fontWeight: 700 }}
              variant="h6"
            >
              Write
            </Typography>
            <IconButton
              sx={{
                fontFamily: "monospace",
                ml: -1.5,
              }}
            >
              <Avatar alt="Logo" src={postIcon} />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: "center" }}>
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
