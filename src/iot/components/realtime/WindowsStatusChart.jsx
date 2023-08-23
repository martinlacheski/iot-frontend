import { Typography } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getEnvVariables } from "../../../helpers";

const { VITE_SOCKET_URL } = getEnvVariables();
export const WindowsStatusChart = () => {
  const [data, setData] = useState(false);

  useEffect(() => {
    const socket = io(VITE_SOCKET_URL);

    socket.on("windowsStatus", (data) => {
      setData(data.sensor.areOpen);
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
        {data ? "Ventanas abiertas" : "Ventanas cerradas"}
      </Typography>
    </Fragment>
  );
};
