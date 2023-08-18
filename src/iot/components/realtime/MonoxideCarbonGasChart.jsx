import { Typography } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import GaugeComponent from "react-gauge-component";
import { io } from "socket.io-client";
import { getEnvVariables } from "../../../helpers";

const { VITE_SOCKET_URL } = getEnvVariables();

export const MonoxideCarbonGasChart = () => {
  const [data, setData] = useState(0);
  const min = 0;
  const max = 1000;

  useEffect(() => {
    const socket = io(VITE_SOCKET_URL);

    socket.on("carbonMonoxide", (data) => {
      setData(data.sensor.ppm);
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
        Monóxido de carbono
      </Typography>
      <GaugeComponent
        minValue={min}
        maxValue={max}
        arc={{
          subArcs: [
            { limit: max * 0.33, color: "#84cc16" },
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
      />
    </Fragment>
  );
};
