import React, { useEffect, useState } from "react";
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
  plugins: {
    title: {
      display: true,
      text: "Corriente (A)",
    },
    legend: {
      position: "top",
    },
  },
  scales: {
    y: {
      ticks: {
        callback: function (value, index, values) {
          return value + " A";
        },
      },
      min: 0,
      max: 10,
    },
  },
};

export const CurrentChart = () => {
  const [pzemLigthing, setPzemLigthing] = useState(null);
  const [pzemAC, setPzemAC] = useState(null);
  const [pzemDevices, setPzemDevices] = useState(null);
  const [allTopicsReceived, setAllTopicsReceived] = useState(false); // New state to track all topics received
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Iluminación",
        data: [],
        fill: false,
        borderColor: "#1e293b",
        tension: 0.1,
      },
      {
        label: "Aire acondicionado",
        data: [],
        fill: false,
        borderColor: "#475569",
        tension: 0.1,
      },
      {
        label: "Tomacorrientes",
        data: [],
        fill: false,
        borderColor: "#94a3b8",
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    const socket = io(VITE_SOCKET_URL);

    const handleTopicData = (topic, data) => {
      const current = data.sensor.current;
      const date = new Date().toLocaleTimeString();

      if (topic === "Iluminación") {
        setPzemLigthing(current);
      } else if (topic === "Aire acondicionado") {
        setPzemAC(current);
      } else if (topic === "Tomacorrientes") {
        setPzemDevices(current);
      }

      if (pzemLigthing !== null && pzemAC !== null && pzemDevices !== null) {
        setAllTopicsReceived(true); // All topics received, trigger update
      }
    };

    // socket.on("pzemLigthing", (data) => handleTopicData("Iluminación", data));
    // socket.on("pzemAC", (data) => handleTopicData("Aire acondicionado", data));
    // socket.on("pzemDevices", (data) => handleTopicData("Tomacorrientes", data));

    return () => {
      socket.off("pzemLigthing");
      socket.off("pzemAC");
      socket.off("pzemDevices");
    };
  }, [pzemLigthing, pzemAC, pzemDevices]); // Update effect dependencies

  useEffect(() => {
    if (allTopicsReceived) {
      setChartData((prevState) => {
        const updatedDatasets = prevState.datasets.map((dataset) => {
          const topic = dataset.label;
          const current =
            topic === "Iluminación"
              ? pzemLigthing
              : topic === "Aire acondicionado"
              ? pzemAC
              : topic === "Tomacorrientes"
              ? pzemDevices
              : null;
          return {
            ...dataset,
            data: [...dataset.data, current],
          };
        });

        return {
          ...prevState,
          labels: [...prevState.labels, new Date().toLocaleTimeString()],
          datasets: updatedDatasets,
        };
      });

      // Reset states and topic received flag
      setPzemLigthing(null);
      setPzemAC(null);
      setPzemDevices(null);
      setAllTopicsReceived(false);
    }
  }, [allTopicsReceived, pzemLigthing, pzemAC, pzemDevices]);

  return <Line data={chartData} options={chartOptions} />;
};
