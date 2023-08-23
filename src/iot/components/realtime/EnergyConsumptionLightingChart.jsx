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
import { EmojiObjects } from "@mui/icons-material";
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
      max: 1000,
    },
  },
};

export const EnergyConsumptionLightingChart = () => {
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

    socket.on("pzemLigthing", (data) => {
      if (!data.data.timestamp) {
        console.log("pzemLigthing: ", data);
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
          data.sensor.power + random(200, 500),
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
      setCurrent(data.sensor.current);
      setPowerFactor(data.sensor.pf);
      setVoltage(Math.round(data.sensor.voltage * 100) / 100);
    });

    return () => {
      socket.off("pzemLigthing");
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
            <EmojiObjects sx={{ fontSize: "1.2rem" }} />
            <Typography variant="p" fontWeight="bold">
              Línea de Iluminación
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
              <Typography variant="p">Voltaje: </Typography>
              <Typography variant="p" fontWeight="bold">
                {voltage} V
              </Typography>
            </Box>
            <Box>
              <Typography variant="p">Corriente: </Typography>
              <Typography variant="p" fontWeight="bold">
                {current} A
              </Typography>
            </Box>
            <Box>
              <Typography variant="p">Factor de potencia: </Typography>
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
