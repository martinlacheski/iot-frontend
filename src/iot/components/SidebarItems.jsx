import React, { useState, useEffect } from "react";
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
  ShoppingCartOutlined,
  Groups2Outlined,
  ReceiptLongOutlined,
  PublicOutlined,
  TuneOutlined,
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
            <>
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
            </>
          );
        }
        const lcText = url.toLowerCase();
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
                    active === lcText
                      ? theme.palette.primary.main
                      : "transparent",
                  color: active === lcText ? "#020617" : "white",
                  fontSize: "12px",
                  transition: "background-color .5s, color .5s",
                  "&:hover": {
                    backgroundColor:
                      active === lcText
                        ? theme.palette.primary.main
                        : "rgba(226, 232, 240, 0.1)", // Cambiar el valor de opacidad para el color más claro
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: active === lcText ? "#020617" : "white",
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
                    fontWeight: active === lcText ? "700" : "400",
                  }}
                />
                {active === lcText && (
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
    text: "Client Facing",
    icon: null,
  },
  {
    text: "Products",
    url: "products",
    icon: <ShoppingCartOutlined />,
  },
  {
    text: "Customers",
    url: "customers",
    icon: <Groups2Outlined />,
  },
  {
    text: "Transactions",
    url: "transactions",
    icon: <ReceiptLongOutlined />,
  },
  {
    text: "Geography",
    url: "geography",
    icon: <PublicOutlined />,
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
