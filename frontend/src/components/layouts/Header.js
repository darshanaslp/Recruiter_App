import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AccountCircle from "@mui/icons-material/AccountCircle";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Recruiter App
        </Typography>

        {/* Render links based on role */}
        {role === "admin" && (
          <Button color="inherit" component={Link} to="/recruiters">
            Recruiters
          </Button>
        )}

        {role === "recruiter" && (
          <>
            <Button color="inherit" component={Link} to="/jobs">
              Jobs
            </Button>
            <Button color="inherit" component={Link} to="/interviews">
              Interviews
            </Button>
            <Button color="inherit" component={Link} to="/candidates">
              Candidates
            </Button>
          </>
        )}

        {role === "candidate" && (
          <>
            <Button color="inherit" component={Link} to="/jobs">
              Jobs
            </Button>
            <Button color="inherit" component={Link} to="/interviews">
              Interviews
            </Button>
            <Button color="inherit" component={Link} to="/candidate-profile">
              Profile
            </Button>
          </>
        )}

        {/* User profile menu */}
        <div>
          <IconButton
            size="large"
            aria-label="account"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {email && <MenuItem disabled>{email}</MenuItem>}
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
