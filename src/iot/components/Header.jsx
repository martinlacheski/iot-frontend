import React from "react";
import { Typography, Box, useTheme } from "@mui/material";

export const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        p: ".5rem 2rem",
        backgroundColor: "white",
      }}
    >
      <Typography
        variant="h1"
        color={theme.palette.background.main}
        fontWeight="bold"
        sx={{ mb: "5px", fontSize: "2.1rem" }}
      >
        {title}
      </Typography>
      <Typography variant="p" color={theme.palette.primary.main} sx={{fontSize: "1rem"}}>
        {subtitle}
      </Typography>
    </Box>
  );
};
