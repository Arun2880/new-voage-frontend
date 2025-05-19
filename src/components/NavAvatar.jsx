import React, { useState, useEffect } from "react";
import { Avatar, Menu, MenuItem, IconButton, Typography } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";
import { jwtDecode } from 'jwt-decode';

function NavAvatar() {
  const token = sessionStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const userId1 = decodedToken.userId;
  const [anchorEl, setAnchorEl] = useState(null);
  const [userName, setUserName] = useState("U"); // Default to "U" if no name
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user name from session or API
    const name = sessionStorage.getItem("name") || "User";
    const firstChar = name.charAt(0).toUpperCase();
    setUserName(firstChar);
  }, []);

  // Generate a random avatar URL using DiceBear
  const getRandomAvatar = () => {
    const avatarStyles = [
      "adventurer",  // Cute colorful avatars
      "identicon",   // GitHub-style identicons
      "bottts",      // Robot-style avatars
      "avataaars",   // Avatar-style (like Slack)
      "micah",       // Fun illustrated faces
    ];
    const randomStyle = avatarStyles[Math.floor(Math.random() * avatarStyles.length)];
    return `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${userName}`;
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const Logoutuser = async () => {
    try {
      const url = `${BASE_URL}/admin/logout-user/${userId1}`;
      const headers = { "Content-Type": "application/json" };
      await axios.post(url, {}, { headers }); // Fix: Pass empty body and correct headers
      
      sessionStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div>
      <IconButton onClick={handleMenuOpen} style={{ padding: "20px" }}>
        {/* Use DiceBear random avatar */}
        <Avatar 
          src={getRandomAvatar()} 
          alt={userName}
        />
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={Logoutuser}>
          <Logout sx={{ marginRight: 1, color: "red" }} />
          <Typography color="error">Sign Out</Typography>
        </MenuItem>
      </Menu>
    </div>
  );
}

export default NavAvatar;