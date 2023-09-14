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
export const AmbientNoiseChart = ({noiseData}) => {
    const { labels, values  } = noiseData;
    const [options, setOptions] = useState({
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Nivel de ruido ambiental",
          },
        },
        scales: {
          y: {
            type: "linear",
            display: true,
            ticks: {
              callback: function (value, index, values) {
                return value;
              },
            },
            min: 0,
            max: 1024,
          },
        },
      });
      const [chartData, setChartData] = useState({
        labels: labels,
        datasets: [
          {
            label: "Ruido ambiental",
            data: values,
            fill: false,
            borderColor: "#94a3b8",
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
