import React, { Fragment } from "react";
import {
  Box,
  Typography,
  Grid,
  Divider,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  VoltageChart,
  CurrentChart,
  PowerChart,
  PfChart,
  FlammableGasChart,
  NaturalGasChart,
  MonoxideCarbonGasChart,
  AirQualityChart,
  TemperatureHumidityChart,
  ExternalLightingChart,
  InternalLightingChart,
  WindowsStatusChart,
  DoorsStatusChart,
  CountPeopleChart,
  MovementDetectedChart,
  AmbientNoiseChart
} from "../components/realtime";

export const Dashboard = () => {
  return (
    <Box sx={{ p: "1.5rem" }}>
      <Fragment>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <VoltageChart />
          </Grid>
          <Grid item xs={12} md={4}>
            <CurrentChart />
          </Grid>
          <Grid item xs={12} md={4}>
            <PowerChart />
          </Grid>

          <Grid item xs={12}>
            <Grid
              container
              spacing={2}
              sx={{
                mb: "1rem",
              }}
            >
              <Grid item xs={12} md={3}>
                <FlammableGasChart />
              </Grid>
              <Grid item xs={12} md={3}>
                <AirQualityChart />
              </Grid>
              <Grid item xs={12} md={3}>
                <NaturalGasChart />
              </Grid>
              <Grid item xs={12} md={3}>
                <MonoxideCarbonGasChart />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <Grid container spacing={2}>
              <Grid item xs={12} justifyContent={"center"} display={"flex"}>
                <TemperatureHumidityChart />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box>
              <Box sx={{ mb: "1rem" }} height={1}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <ExternalLightingChart />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InternalLightingChart />
                  </Grid>
                </Grid>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    textAlign={"center"}
                    sx={{ mt: "1rem", fontSize: "16px" }}
                  >
                    Estado de puertas y ventanas
                  </Typography>
                  <Box>
                    <WindowsStatusChart />
                  </Box>
                  <Box>
                    <DoorsStatusChart />
                  </Box>
                </Box>
                <Box>
                  <Box>
                    <CountPeopleChart />
                  </Box>
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    textAlign={"center"}
                    sx={{ mt: "1rem", fontSize: "16px" }}
                  >
                    Movimiento
                  </Typography>
                  <Box>
                    <MovementDetectedChart/>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <AmbientNoiseChart />
          </Grid>
        </Grid>
      </Fragment>
    </Box>
  );
};
