import { Typography } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import GaugeComponent from "react-gauge-component";
import { io } from "socket.io-client";
import { getEnvVariables } from "../../../helpers";

const { VITE_SOCKET_URL } = getEnvVariables();

export const FlammableGasChart = () => {
  const [data, setData] = useState(0);
  const min = 0;
  const max = 1000;

  useEffect(() => {
    const socket = io(VITE_SOCKET_URL);

    socket.on("flammableGases", (data) => {
      if (!data.data.timestamp) return;
      setData(data.sensor.p);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Fragment>
      <Typography
        variant="h6"
        textAlign={"center"}
        sx={{ mb: "-1.5rem", fontSize: "16px" }}
      >
        Gases inflamables
      </Typography>
      <GaugeComponent
      
        minValue={min}
        maxValue={max}
        arc={{
          subArcs: [
            { limit: max * 0.33, color: "#006600" },
            { limit: max * 0.66, color: "#f59e0b" },
            { color: "#b91c1c" },
          ],
        }}
        value={data}
        labels={{
          valueLabel: {
            style: {
              fontSize: 30,
              fill: "#000000",
              textShadow: "0 0 10px #fff",
            },
            formatTextValue: (value) => `${value} ppm`,
          },
        }}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    </Fragment>
  );
};
