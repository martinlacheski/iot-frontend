import React, { Fragment, useEffect, useState } from "react";
import io from "socket.io-client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { getEnvVariables } from "../../../helpers";
import { Box, Typography } from "@mui/material";
import { AcUnitOutlined } from "@mui/icons-material";
import { random } from "lodash";

const { VITE_SOCKET_URL } = getEnvVariables();

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions = {
  responsive: true,
  interaction: {
    mode: "index",
    intersect: false,
  },
  stacked: false,
  plugins: {
    title: {
      display: false,
      text: "AC",
    },
    legend: {
      position: "top",
    },
  },
  scales: {
    y: {
      type: "linear",
      display: true,
      ticks: {
        callback: function (value, index, values) {
          return value + " W";
        },
      },
      min: 0,
    },
  },
};

export const EnergyConsumptionACChart = () => {
  const [voltage, setVoltage] = useState(0);
  const [current, setCurrent] = useState(0);
  const [powerFactor, setPowerFactor] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Potencia (W)",
        data: [],
        fill: false,
        borderColor: "#1e293b",
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    const socket = io(VITE_SOCKET_URL);

    socket.on("pzemAC", (data) => {
      if (!data.data.timestamp) {
        console.log("pzemAC: ", data);
        return;
      }
      setChartData((prevState) => {
        const updatedLabels = [
          ...prevState.labels,
          data.data.timestamp.slice(11, 19),
        ];
        const updatedData = [
          ...prevState.datasets[0].data.slice(
            Math.max(0, prevState.datasets[0].data.length - 12)
          ),
          // data.sensor.power + random(200, 500),
          data.sensor.p,
        ];

        return {
          labels: updatedLabels.slice(Math.max(0, updatedLabels.length - 12)),
          datasets: [
            {
              ...prevState.datasets[0],
              data: updatedData,
            },
          ],
        };
      });

      setCurrent(Math.round(data.sensor.c * 100) / 100);
      setPowerFactor(Math.round(data.sensor.pf * 100) / 100);
      setVoltage(Math.round(data.sensor.v * 100) / 100);
    });

    return () => {
      socket.off("pzemAC");
    };
  }, []);

  return (
    <Fragment>
      <Box
        sx={{
          border: "1px solid #e0e0e0",
          backgroundColor: "#fff",
          borderRadius: "5px",
          p: ".5rem 1rem",
        }}
      >
        <Box
          sx={{
            mb: ".5rem",
            fontSize: "1rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
              mb: "1rem",
            }}
          >
            <AcUnitOutlined sx={{ fontSize: "1.2rem" }} />
            <Typography variant="p" fontWeight="bold">
              Línea de Aire Acondicionado
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="p" title="Voltaje">
                Voltaje:{" "}
              </Typography>
              <Typography variant="p" fontWeight="bold">
                {voltage} V
              </Typography>
            </Box>
            <Box>
              <Typography variant="p" title="Corriente">
                Corriente:{" "}
              </Typography>
              <Typography variant="p" fontWeight="bold">
                {current} A
              </Typography>
            </Box>
            <Box>
              <Typography variant="p" title="Factor de potencia">
                FP:{" "}
              </Typography>
              <Typography variant="p" fontWeight="bold">
                {powerFactor}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Line data={chartData} options={chartOptions} />
      </Box>
    </Fragment>
  );
};
