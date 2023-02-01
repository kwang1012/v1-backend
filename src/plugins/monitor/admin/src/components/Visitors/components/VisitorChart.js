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

const FullLine = styled(Line)`
  height: 200px !important;
`;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
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
      borderColor: "rgb(122, 146, 163)",
      backgroundColor: "rgba(122, 146, 163, 0.5)",
      cubicInterpolationMode: "monotone",
    },
    {
      label: "Prior week",
      data: labels.map(() => Math.floor(0 + 2000 * Math.random())),
      borderColor: "rgb(11, 98, 164)",
      backgroundColor: "rgba(11, 98, 164, 0.5)",
      cubicInterpolationMode: "monotone",
    },
  ],
};

export default function VisitorChart() {
  return <FullLine options={options} data={data} />;
}
