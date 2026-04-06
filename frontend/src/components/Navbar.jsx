import {
  AppBar, Toolbar, Typography, Button, Box, IconButton,
  Drawer, List, ListItem, ListItemText, useMediaQuery, useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAdmin, logoutUser } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Search", path: "/search" },
    { label: "Eligibility", path: "/eligibility" },
    ...(isAdmin ? [{ label: "Admin", path: "/admin" }] : []),
  ];

  const handleNav = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: "#1a237e" }}>
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ flexGrow: 1, textDecoration: "none", color: "white", fontWeight: 700 }}
          >
            🏛️ GovtSchemes
          </Typography>

          {isMobile ? (
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              {navLinks.map((link) => (
                <Button key={link.path} color="inherit" onClick={() => handleNav(link.path)}>
                  {link.label}
                </Button>
              ))}
              {isAdmin ? (
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => { logoutUser(); navigate("/"); }}
                >
                  Logout
                </Button>
              ) : (
                <Button variant="outlined" color="inherit" onClick={() => navigate("/login")}>
                  Admin Login
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 220, pt: 2 }}>
          <List>
            {navLinks.map((link) => (
              <ListItem button key={link.path} onClick={() => handleNav(link.path)}>
                <ListItemText primary={link.label} />
              </ListItem>
            ))}
            <ListItem
              button
              onClick={() => {
                isAdmin ? logoutUser() : navigate("/login");
                setDrawerOpen(false);
              }}
            >
              <ListItemText primary={isAdmin ? "Logout" : "Admin Login"} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
