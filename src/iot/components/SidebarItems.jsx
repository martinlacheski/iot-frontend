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
  ChevronRightOutlined,
  DashboardOutlined,
  TuneOutlined,
  BoltOutlined,
  Air,
  MoodBad,
  MapsHomeWorkOutlined,
  SecurityOutlined
} from "@mui/icons-material";

export const SidebarItems = () => {
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const { pathname } = useLocation();

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);
  return (
    <List>
      {navItems.map(({ text, url, icon }) => {
        if (!icon) {
          return (
            <Fragment key={text}>
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
            </Fragment>
          );
        }
        const lcText = url.toLowerCase();
        const isActive = pathname.startsWith(`/${lcText}`);
        return (
          <ListItem key={text} disablePadding>
            <Box
              sx={{
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
                  backgroundColor:
                    isActive
                      ? theme.palette.primary.main
                      : "transparent",
                  color: isActive ? "#020617" : "white",
                  fontSize: "12px",
                  transition: "background-color .5s, color .5s",
                  "&:hover": {
                    backgroundColor:
                      isActive
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
                {isActive && (
                  <ChevronRightOutlined sx={{ ml: "auto" }} />
                )}
              </ListItemButton>
            </Box>
          </ListItem>
        );
      })}
    </List>
  );
};

const navItems = [
  {
    text: "Dashboard",
    url: "dashboard",
    icon: <DashboardOutlined />,
  },
  {
    text: "Reportes y estadísticas",
    icon: null,
  },
  {
    text: "Consumo energético",
    url: "energy-consumption",
    icon: <BoltOutlined />,
  },
  {
    text: "Calidad del aire",
    url: "air-quality",
    icon: <Air />,
  },
  {
    text: "Uso ineficiente de energía eléctrica",
    url: "energy-waste",
    icon: <MoodBad />,
  },
  {
    text: "Condiciones ambientales",
    url: "environment-conditions",
    icon: <MapsHomeWorkOutlined />,
  },
  {
    text: "Seguridad y movimiento de personas",
    url: "security-movement",
    icon: <SecurityOutlined />,
  },
  {
    text: "Sistema",
    icon: null,
  },
  {
    text: "Parámetros",
    url: "parameters",
    icon: <TuneOutlined />,
  },
];
