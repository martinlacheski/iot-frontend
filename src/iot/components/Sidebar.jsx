import React, { useEffect } from "react";
import { Box, Drawer, IconButton, Typography, useTheme } from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";
import { FlexBetween } from "./";
import { SidebarItems } from "./SidebarItems";

export const Sidebar = ({
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const theme = useTheme();

  useEffect(() => {
    if (!isNonMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isNonMobile]);

  return (
    <Box
      component="nav"
      className="animate__animated animate__fadeIn animate__faster"
    >
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              backgroundColor: theme.palette.background.main,
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
              padding: "0.3rem",
            },
          }}
        >
          <Box width="100%">
            <Box m="1rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img src="/appLogo.png" alt="Logo aplicación" width="200px" />
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <SidebarItems />
          </Box>
        </Drawer>
      )}
    </Box>
  );
};
