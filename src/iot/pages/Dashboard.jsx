import React, { Fragment } from "react";
import {
  Box,
  Typography,
  Grid,
} from "@mui/material";
import {
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
  AmbientNoiseChart,
  EnergyConsumptionACChart,
  EnergyConsumptionDevicesChart,
  EnergyConsumptionLightingChart,
} from "../components/realtime";
import {
  DirectionsWalk,
  People,
  SensorDoor,
  SensorWindow,
} from "@mui/icons-material";

export const Dashboard = () => {
  return (
    <Box sx={{ p: "1.5rem" }}>
      <Fragment>
          {/* VARIABLES ELÉCTRICAS */}
        <Grid container spacing={1}>
          <Grid item xs={12} md={4}>
            <EnergyConsumptionACChart />
          </Grid>
          <Grid item xs={12} md={4}>
            <EnergyConsumptionDevicesChart />
          </Grid>
          <Grid item xs={12} md={4}>
            <EnergyConsumptionLightingChart />
          </Grid>

          {/* GASES */}
          <Grid item xs={12} md={8}>
            <Grid
              container
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "5px",
                backgroundColor: "#fff",
                p: ".5rem",
              }}
            >
              <Grid item xs={12} md={3}>
                <AirQualityChart />
              </Grid>
              <Grid item xs={12} md={3}>
                <MonoxideCarbonGasChart />
              </Grid>
              <Grid item xs={12} md={3}>
                <FlammableGasChart />
              </Grid>
              <Grid item xs={12} md={3}>
                <NaturalGasChart />
              </Grid>
            </Grid>
          </Grid>

          {/* ILUMINACIÓN */}
          <Grid item xs={12} md={4}>
            <Grid
              container
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "5px",
                backgroundColor: "#fff",
                mb: "1rem",
                p: ".5rem",
              }}
            >
              <Grid item xs={12} md={6}>
                <ExternalLightingChart />
              </Grid>
              <Grid item xs={12} md={6}>
                <InternalLightingChart />
              </Grid>
            </Grid>
          </Grid>

          {/* TEMPERATURA Y HUMEDAD */}
          <Grid item xs={12} md={4}>
            <Grid
              container
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "5px",
                backgroundColor: "#fff",
                p: "1rem",
                mt: "-.8rem",
              }}
            >
              <Grid item xs={12} justifyContent={"center"} display={"flex"}>
                <TemperatureHumidityChart />
              </Grid>
            </Grid>
          </Grid>

          {/* PUERTAS, VENTANAS, PERSONAS, ETC */}
          <Grid item xs={12} md={8}>
            <Grid
              container
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "5px",
                backgroundColor: "#fff",
                p: "1rem",
                mt: {
                  xs: ".2rem",
                  md: "-.8rem",
                },
                gap: {
                  xs: "2rem",
                  md: "0",
                },
              }}
            >
              <Grid item xs={12} md={3}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: "1rem",
                    gap: ".5rem",
                  }}
                >
                  <SensorDoor />
                  <Typography
                    variant="h6"
                    textAlign={"center"}
                    sx={{ fontSize: "16px" }}
                  >
                    Estado de puertas
                  </Typography>
                </Box>
                <Box
                  sx={{
                    mb: "2rem",
                  }}
                >
                  <DoorsStatusChart />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: "1rem",
                    gap: ".5rem",
                  }}
                >
                  <SensorWindow />
                  <Typography
                    variant="h6"
                    textAlign={"center"}
                    sx={{ fontSize: "16px" }}
                  >
                    Estado de ventanas
                  </Typography>
                </Box>
                <Box>
                  <WindowsStatusChart />
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: "1rem",
                    gap: ".5rem",
                  }}
                >
                  <People />
                  <Typography
                    variant="h6"
                    textAlign={"center"}
                    sx={{ fontSize: "16px" }}
                  >
                    Cantidad de personas
                  </Typography>
                </Box>
                <Box>
                  <CountPeopleChart />
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: "1rem",
                    gap: ".5rem",
                  }}
                >
                  <DirectionsWalk />
                  <Typography
                    variant="h6"
                    textAlign={"center"}
                    sx={{ fontSize: "16px" }}
                  >
                    Movimiento
                  </Typography>
                </Box>
                <Box>
                  <MovementDetectedChart />
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <AmbientNoiseChart />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Fragment>
    </Box>
  );
};
