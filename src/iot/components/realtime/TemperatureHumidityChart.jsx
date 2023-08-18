import React, { Fragment, useEffect, useState } from "react";
import Thermometer from "react-thermometer-ecotropy";
import GaugeComponent from "react-gauge-component";
import { Typography, Box } from "@mui/material";
import { io } from "socket.io-client";
import { getEnvVariables } from "../../../helpers";

const { VITE_SOCKET_URL } = getEnvVariables();

export const TemperatureHumidityChart = () => {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [pressure, setPressure] = useState(0);

  useEffect(() => {
    const socket = io(VITE_SOCKET_URL);

    socket.on("tempAndHumidity", (data) => {
      const temp = Math.round(data.sensor.temperature * 10) / 10;
      const hum = Math.round(data.sensor.humidity * 10) / 10;
      setTemperature(temp);
      setHumidity(hum);
    });

    socket.on("pressureAndTemp", (data) => {
      const press = Math.round(data.sensor.pressure * 10) / 10;
      setPressure(press);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box>
        <Typography
          variant="h6"
          textAlign={"center"}
          sx={{ fontSize: "16px", mb: "1rem" }}
        >
          Temperatura
        </Typography>
        <Thermometer
          theme="light"
          value={temperature}
          max="50"
          steps="2"
          format="°C"
          size="medium"
          height="250"
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <Box>
          <Typography
            variant="h6"
            textAlign={"center"}
            sx={{ fontSize: "16px", mb: "-1.5rem" }}
          >
            Humedad relativa
          </Typography>

          <GaugeComponent
            arc={{
              subArcs: [
                { limit: 33, color: "#84cc16" },
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
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h6"
            textAlign={"center"}
            sx={{ fontSize: "16px", mt: "1rem" }}
          >
            Presión atmosférica
          </Typography>

          {pressure}
        </Box>
      </Box>
    </Box>
  );
};
