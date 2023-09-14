import React, { Fragment, useState } from "react";
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
export const TemperatureChart = ({tempData}) => {
    const { labels, minTemp, maxTemp } = tempData;
    const [options, setOptions] = useState({
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Temperatura ambiente",
          },
        },
        scales: {
          y: {
            type: "linear",
            display: true,
            ticks: {
              callback: function (value, index, values) {
                return value + " °C";
              },
            },
            min: 0,
            max: 50,
          },
        },
      });
      const [chartData, setChartData] = useState({
        labels: labels,
        datasets: [
          {
            label: "Mínima",
            data: minTemp,
            fill: false,
            borderColor: "#94a3b8",
            tension: 0.1,
          },
          {
            label: "Máxima",
            data: maxTemp,
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
}
