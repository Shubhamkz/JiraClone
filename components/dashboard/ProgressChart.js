"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ProgressChart({ projects }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  const chartData = {
    labels: projects.map((item) => item.name),
    datasets: [
      {
        label: "Completion %",
        data: projects.map((item) => item.completion.completionPercentage),
        backgroundColor: "rgba(79, 70, 229, 0.7)",
      },
    ],
  };

  return <Bar options={options} data={chartData} />;
}
