import { useContext, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { Link } from "react-router";
import logo from "../assets/logo.png";
import { AppContext } from "../context/AppContext";
import SearchBar from "../components/SearchBar";
import SearchIcon from "@mui/icons-material/Search";

const settings = ["Profile", "Account", "Dashboard", "Logout"];

function Header() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const { accessToken } = useContext(AppContext);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
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
            <PostAddIcon
              fontSize="medium"
              sx={{
                mt: 1,
                mr: 0.5,
                display: "flex",
              }}
            />
            <Typography
              sx={{ mt: 0.5, fontFamily: "monospace", fontWeight: 700 }}
              variant="h6"
            >
              Write
            </Typography>
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
