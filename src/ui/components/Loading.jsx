import { CircularProgress, Grid } from "@mui/material";

export const Loading = () => {
  return (
    <Grid
      container
      spacing={0}
      direction={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      sx={{ minHeight: "100vh", backgroundColor: "background.main", padding: 4 }}
    >
      <Grid
        container
        direction={"row"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <CircularProgress color="warning" />
      </Grid>
    </Grid>
  );
};