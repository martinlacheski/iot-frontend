import React, { Fragment, useEffect, useState } from "react";
import Thermometer from "react-thermometer-ecotropy";
import GaugeComponent from "react-gauge-component";
import { Typography, Box } from "@mui/material";
import { io } from "socket.io-client";
import { getEnvVariables } from "../../../helpers";
import { Expand, Thermostat, WaterDrop } from "@mui/icons-material";

const { VITE_SOCKET_URL } = getEnvVariables();

export const TemperatureHumidityChart = () => {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [pressure, setPressure] = useState(0);

  useEffect(() => {
    const socket = io(VITE_SOCKET_URL);

    socket.on("tempAndHumidity", (data) => {
      if (!data.data.timestamp) return;
      const temp = Math.round(data.sensor.t * 10) / 10;
      const hum = Math.round(data.sensor.h * 10) / 10;
      setTemperature(temp);
      setHumidity(hum);
    });

    socket.on("pressureAndTemp", (data) => {
      const press = Math.round(data.sensor.p * 10) / 10;
      setPressure(press);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Box
      sx={{
        display: {
          xs: "block",
          md: "flex",
        },
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: "1rem",
            gap: ".5rem",
          }}
        >
          <Thermostat />
          <Typography
            variant="h6"
            textAlign={"center"}
            sx={{ fontSize: "16px" }}
          >
            Temperatura
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: {
              xs: "1rem",
              md: "0",
            },
          }}
        >
          <Thermometer
            theme="light"
            value={temperature}
            max="50"
            steps="2"
            format="°C"
            size="medium"
            height="200"
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: "-1.5rem",
              justifyContent: "center",
              gap: ".5rem",
            }}
          >
            <WaterDrop />
            <Typography
              variant="h6"
              textAlign={"center"}
              sx={{ fontSize: "16px" }}
            >
              Humedad
            </Typography>
          </Box>

          <GaugeComponent
            arc={{
              subArcs: [
                { limit: 33, color: "#006600" },
                { limit: 66, color: "#f59e0b" },
                { color: "#b91c1c" },
              ],
            }}
            value={humidity}
            labels={{
              valueLabel: {
                style: {
                  fontSize: 30,
                  fill: "#000000",
                  textShadow: "0 0 10px #fff",
                },
                formatTextValue: (value) => `${value} %`,
              },
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: "1rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: ".5rem",
            }}
          >
            <Expand />
            <Typography
              variant="h6"
              textAlign={"center"}
              sx={{ fontSize: "16px" }}
            >
              Presión atmosférica
            </Typography>
          </Box>
          {pressure} hPa
        </Box>
      </Box>
    </Box>
  );
};
