import { Typography } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getEnvVariables } from "../../../helpers";

const { VITE_SOCKET_URL } = getEnvVariables();
export const CountPeopleChart = () => {
  const [data, setData] = useState(0);

  useEffect(() => {
    const socket = io(VITE_SOCKET_URL);

    socket.on("countPeople", (data) => {
      console.log(data);
      setData(data.sensor.count);
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
        sx={{ fontSize: "3rem" }}
      >
        {data > 0 && data}
      </Typography>
      <Typography
        variant="h6"
        textAlign={"center"}
        sx={{ fontSize: "14px", fontWeight: "bold" }}
        >
        {data > 0 ? "personas" : "No hay personas"}
        </Typography>

    </Fragment>
  );
};
