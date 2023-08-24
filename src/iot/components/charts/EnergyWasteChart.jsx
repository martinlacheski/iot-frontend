import React from "react";
import { Line } from "react-chartjs-2";

export const EnergyWasteChart = ({ chartData }) => {

  const { labels, dataAC, dataLighting, dataDevices, dataMotionDetection } =
    chartData;

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Aire acondicionado",
        data: dataAC,
        borderColor: "#cbd5e1",
        backgroundColor: "#cbd5e1",
        yAxisID: "y",
      },
      {
        label: "Iluminación",
        data: dataLighting,
        borderColor: "#64748b",
        backgroundColor: "#64748b",
        yAxisID: "y",
      },
      {
        label: "Toma corrientes",
        data: dataDevices,
        borderColor: "#334155",
        backgroundColor: "#334155",
        yAxisID: "y",
      },
      {
        label: "Ausencia de personas",
        data: dataMotionDetection,
        backgroundColor: "rgba(185, 28, 28, 0.2)",
        stepped: "middle",
        yAxisID: "y2",
        fill: true,
        pointStyle: false,
      },
    ],
  };

  const options = {
    height: 400,
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Uso de energía eléctrica en momentos de ausencia de personas",
      },
    },
    scales: {
      y: {
        type: "linear",
        position: "left",
        stack: "demo",
        stackWeight: 1,
        grid: {
          borderColor: "red",
        },
        min: 0,
      },
      y2: {
        type: "category",
        labels: ["SI", "NO"],
        position: "right",
        stack: "demo",
        stackWeight: 1,
        grid: {
          borderColor: "gray",
        },
      },
    },
  };

  return <Line data={data} options={options} height="100vh" />;
};
