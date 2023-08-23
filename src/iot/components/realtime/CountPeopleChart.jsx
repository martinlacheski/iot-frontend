import { Typography } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getEnvVariables } from "../../../helpers";
import iotApi from "../../../api/iotApi";

const { VITE_SOCKET_URL } = getEnvVariables();
export const CountPeopleChart = () => {
  const [countPeople, setCountPeople] = useState(0);
  const [data, setData] = useState(null);

  useEffect(() => {
    const getLastValue = async () => {
      try {
        const { data } = await iotApi.get("/data-count-people");
        setCountPeople(data.count.count);
      } catch (error) {
        console.log(error);
      }
    };

    getLastValue();

    const socket = io(VITE_SOCKET_URL);

    socket.on("countPeople", (data) => {
      if (!data.data.timestamp) return;
      setData(data.sensor.count);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Fragment>
      <Typography variant="h6" textAlign={"center"} sx={{ fontSize: "3rem" }}>
        {
          data !== null ? (
            data
          ) : (
            countPeople !== null ? (
              countPeople
            ) : (
              ""
            )
          )
        }
      </Typography>
      <Typography
        variant="h6"
        textAlign={"center"}
        sx={{ fontSize: "14px", fontWeight: "bold" }}
      >
        {data > 0 || countPeople > 0 ? "personas presentes" : "No hay personas presentes"}
      </Typography>
    </Fragment>
  );
};
