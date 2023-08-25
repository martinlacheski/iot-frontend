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
export const HumidityChart = ({humData}) => {
    const { labels, minHum, maxHum } = humData;
    const [options, setOptions] = useState({
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Humedad",
          },
        },
        scales: {
          y: {
            type: "linear",
            display: true,
            ticks: {
              callback: function (value, index, values) {
                return value + " %";
              },
            },
            min: 0,
            max: 100,
          },
        },
      });
      const [chartData, setChartData] = useState({
        labels: labels,
        datasets: [
          {
            label: "Mínima",
            data: minHum,
            fill: false,
            borderColor: "#94a3b8",
            tension: 0.1,
          },
          {
            label: "Máxima",
            data: maxHum,
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
