"use client";

import { useMemo } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

interface Document {
  uploadedAt: string;
}

interface Props {
  documents?: Document[];
}

export default function AnalyticsChart({
  documents = [],
}: Props) {

  const { labels, values } = useMemo(() => {

    const today = new Date();

    const year = today.getFullYear();
    const month = today.getMonth();

    const totalDays = new Date(year, month + 1, 0).getDate();

    const labels: string[] = [];
    const values: number[] = [];

    for (let day = 1; day <= totalDays; day++) {

      labels.push(day.toString());

      const count = documents.filter((doc) => {

        const uploaded = new Date(doc.uploadedAt);

        return (
          uploaded.getDate() === day &&
          uploaded.getMonth() === month &&
          uploaded.getFullYear() === year
        );

      }).length;

      values.push(count);

    }

    return { labels, values };

  }, [documents]);

  const monthName = new Date().toLocaleString("default", {
    month: "long",
  });

  const data = {
    labels,

    datasets: [
      {
        label: "Certificates Uploaded",
        data: values,
        backgroundColor: "#06B6D4",
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {

        labels: {
          color: "#FFFFFF",
        },

      },

    },

    scales: {

      x: {

        ticks: {

          color: "#CBD5E1",

        },

        grid: {

          color: "#1E293B",

        },

      },

      y: {

        beginAtZero: true,

        ticks: {

          stepSize: 1,

          color: "#CBD5E1",

        },

        grid: {

          color: "#1E293B",

        },

      },

    },

  };

  return (

    <div className="bg-[#0F172A] rounded-3xl border border-slate-800 shadow-xl p-8 h-[420px]">

      <div className="flex justify-between items-center mb-8">

        <div>

          <h2 className="text-2xl font-bold text-white">

            Certificates Analytics

          </h2>

          <p className="text-slate-400">

            Upload statistics for {monthName}

          </p>

        </div>

      </div>

      <Bar
        data={data}
        options={options}
      />

    </div>

  );

}