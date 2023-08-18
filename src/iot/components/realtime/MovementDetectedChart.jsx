import { Typography } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getEnvVariables } from "../../../helpers";

const { VITE_SOCKET_URL } = getEnvVariables();
export const MovementDetectedChart = () => {
  const [data, setData] = useState(false);

  useEffect(() => {
    const socket = io(VITE_SOCKET_URL);

    socket.on("motionDetection", (data) => {
      setData(data.sensor.movementDetected);
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
        sx={{ my: ".5rem", fontSize: "14px", textTransform: "uppercase" }}
        color={data ? "#84cc16" : "#b91c1c"}
      >
        {data ? "Detectado" : "No detectado"}
      </Typography>
    </Fragment>
  );
};
