import React, { useState, useEffect, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Typography,
  useTheme,
} from "@mui/material";
import {
  TransferWithinAStation,
  ChevronRightOutlined,
  DashboardOutlined,
  TuneOutlined,
  BoltOutlined,
  Air,
  MoodBad,
  MapsHomeWorkOutlined,
  SecurityOutlined,
} from "@mui/icons-material";
import { useAuthStore } from "../../hooks";

export const SidebarItems = () => {
  const [active, setActive] = useState("");
  const { role } = useAuthStore();
  const navigate = useNavigate();
  const theme = useTheme();
  const { pathname } = useLocation();

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  const navItems = [
    {
      text: "Dashboard",
      url: "dashboard",
      icon: <DashboardOutlined />,
      display:
        role === "BEDELIA" || role === "ADMINISTRATIVO" || role === "SUDO",
    },
    {
      text: "Ajustar contador de personas",
      url: "adjust-people-counter",
      icon: <TransferWithinAStation />,
      display:
        role === "BEDELIA" || role === "ADMINISTRATIVO" || role === "SUDO",
    },
    {
      text: "Reportes y estadísticas",
      icon: null,
      display: role === "ADMINISTRATIVO" || role === "SUDO",
    },
    {
      text: "Consumo energético",
      url: "energy-consumption",
      icon: <BoltOutlined />,
      display: role === "ADMINISTRATIVO" || role === "SUDO",
    },
    {
      text: "Calidad del aire",
      url: "air-quality",
      icon: <Air />,
      display: role === "ADMINISTRATIVO" || role === "SUDO",
    },
    {
      text: "Uso ineficiente de energía eléctrica",
      url: "energy-waste",
      icon: <MoodBad />,
      display: role === "ADMINISTRATIVO" || role === "SUDO",
    },
    {
      text: "Condiciones ambientales",
      url: "environment-conditions",
      icon: <MapsHomeWorkOutlined />,
      display: role === "ADMINISTRATIVO" || role === "SUDO",
    },
    {
      text: "Seguridad y movimiento de personas",
      url: "security-movement",
      icon: <SecurityOutlined />,
      display: role === "ADMINISTRATIVO" || role === "SUDO",
    },
    {
      text: "Sistema",
      icon: null,
      display: role === "SUDO",
    },
    {
      text: "Parámetros",
      url: "parameters",
      icon: <TuneOutlined />,
      display: role === "SUDO",
    },
  ];

  return (
    <List>
      {navItems.map(({ text, url, icon, display }) => {
        if (!icon) {
          return (
            <Fragment key={text}>
              <Box sx={{ display: display ? "block" : "none" }}>
                <Typography
                  key={text}
                  color="white"
                  fontWeight="bold"
                  sx={{ m: "1rem 1rem 0.5rem 1rem" }}
                  fontSize={14}
                  textTransform={"uppercase"}
                >
                  {text}
                </Typography>
                <Divider
                  sx={{
                    backgroundColor: "white",
                    margin: "0 1rem 0.5rem 1rem",
                  }}
                />
              </Box>
            </Fragment>
          );
        }
        const lcText = url.toLowerCase();
        const isActive = pathname.startsWith(`/${lcText}`);
        return (
          <ListItem key={text} disablePadding>
            <Box
              sx={{
                display: display ? "block" : "none",
                borderRadius: "8px",
                mx: "10px",
                my: "2px",
                overflow: "hidden",
                width: "100%",
              }}
            >
              {" "}
              <ListItemButton
                onClick={() => {
                  navigate(`/${url}`);
                  setActive(lcText);
                }}
                sx={{
                  backgroundColor: isActive
                    ? theme.palette.primary.main
                    : "transparent",
                  color: isActive ? "#020617" : "white",
                  fontSize: "12px",
                  transition: "background-color .5s, color .5s",
                  "&:hover": {
                    backgroundColor: isActive
                      ? theme.palette.primary.main
                      : "rgba(226, 232, 240, 0.1)", // Cambiar el valor de opacidad para el color más claro
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? "#020617" : "white",
                    marginRight: "-1rem",
                    padding: "0rem",
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  primaryTypographyProps={{
                    fontSize: 13,
                    margin: 0,
                    fontWeight: isActive ? "700" : "400",
                  }}
                />
                {isActive && <ChevronRightOutlined sx={{ ml: "auto" }} />}
              </ListItemButton>
            </Box>
          </ListItem>
        );
      })}
    </List>
  );
};
