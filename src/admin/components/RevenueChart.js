import React from "react";
import styled from "styled-components";
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

console.log(CategoryScale)
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const FullLine = styled(Line)`
  height: calc(100% - 22px) !important;
`;

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        maxTicksLimit: 20,
      },
    },
  },
  scaleOverride: true,
  scaleSteps: 5,
  scaleStepWidth: 20,
  scaleStartValue: 0,
  maintainAspectRatio: false,
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

const data = {
  labels,
  datasets: [
    {
      label: "Last 7 days",
      data: labels.map(() => Math.floor(0 + 2000 * Math.random())),
      borderColor: "rgb(204, 51, 99)",
      backgroundColor: "rgba(204, 51, 99, 0.5)",
      cubicInterpolationMode: "monotone",
    },
    {
      label: "Prior week",
      data: labels.map(() => Math.floor(0 + 2000 * Math.random())),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      cubicInterpolationMode: "monotone",
    },
  ],
};

export default function RevenueChart() {
  return <FullLine options={options} data={data} />;
}
