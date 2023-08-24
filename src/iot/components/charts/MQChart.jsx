import React, { Fragment, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
      text: "Chart.js Line Chart",
    },
  },
  scales: {
    y: {
      type: "linear",
      display: true,
      ticks: {
        callback: function (value, index, values) {
          return value + " ppm";
        },
      },
    },
  },
};

export const MQChart = ({ data }) => {
  const { title, labels, mins, maxs } = data;
  const [options, setOptions] = useState({
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        ticks: {
          callback: function (value, index, values) {
            return value + " ppm";
          },
        },
      },
    },
  });
  const [chartData, setChartData] = useState({
    labels: labels,
    datasets: [
      {
        label: "Mínimo",
        data: mins,
        fill: false,
        borderColor: "#94a3b8",
        tension: 0.1,
      },
      {
        label: "Máximo",
        data: maxs,
        fill: "-1",
        borderColor: "#475569",
        tension: 0.1,
      },
    ],
  });

  return (
    <Fragment>
      <Line data={chartData} options={options} />
    </Fragment>
  );
};
