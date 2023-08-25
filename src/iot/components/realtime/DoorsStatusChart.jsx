import { Typography } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getEnvVariables } from "../../../helpers";

const { VITE_SOCKET_URL } = getEnvVariables();
export const DoorsStatusChart = () => {
  const [data, setData] = useState(false);

  useEffect(() => {
    const socket = io(VITE_SOCKET_URL);

    socket.on("doorsStatus", (data) => {
      if (!data.data.timestamp) return;
      setData(data.sensor.o);
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
        sx={{ my: ".5rem", fontSize: "14px" }}
        color={data ? "#b91c1c" : "#006600"}
      >
        {data ? "Puertas abiertas" : "Puertas cerradas"}
      </Typography>
    </Fragment>
  );
};
