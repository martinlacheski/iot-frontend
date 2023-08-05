import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Menu as MenuIcon,
  Search,
  SettingsOutlined,
  ArrowDropDownOutlined,
} from "@mui/icons-material";
import { FlexBetween } from "./";
import {
  AppBar,
  Box,
  Typography,
  Button,
  IconButton,
  InputBase,
  Toolbar,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";
import { useAuthStore } from "../../hooks";

export const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const theme = useTheme();
  const { startLogout } = useAuthStore();

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);

  const { user } = useSelector((state) => state.auth);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      sx={{
        position: "static",
        background: "white",
        boxShadow: "none",
      }}
      className="animate__animated animate__fadeIn animate__faster"
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT SIDE */}
        <FlexBetween gap="0.5rem">
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon />
          </IconButton>
          <FlexBetween
            // backgroundColor={theme.palette.light.alt}
            border={`1px solid ${theme.palette.light.main}`}
            borderRadius="9px"
            gap="3px"
            padding="0rem 1.5rem"
          >
            <InputBase
              placeholder="Ingrese su búsqueda aquí..."
              sx={{ width: "20rem" }}
            />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween>
        </FlexBetween>

        {/* RIGHT SIDE */}
        <FlexBetween>
          <FlexBetween>
            <Button
              onClick={handleClick}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textTransform: "none",
                gap: "0.5rem",
              }}
            >
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.85rem"
                  sx={{ color: theme.palette.secondary }}
                >
                  {user?.name || "User"}
                </Typography>
              </Box>
              <ArrowDropDownOutlined
                sx={{
                  color: theme.palette.secondary,
                  fontSize: "25px",
                }}
              />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
            >
              <MenuItem onClick={startLogout}>Cerrar sesión</MenuItem>
            </Menu>
          </FlexBetween>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};
