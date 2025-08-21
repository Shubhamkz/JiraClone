"use client";

import { useState, useEffect } from "react";
import {
  format,
  subDays,
  subMonths,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  FiClock,
  FiTrendingUp,
  FiCalendar,
  FiDollarSign,
} from "react-icons/fi";
import { getTimeEntries } from "@/lib/api";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

export default function TimeTrackDashboard() {
  const [timeRange, setTimeRange] = useState("week");
  const [timeEntries, setTimeEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch actual time entries
        // const entries = await getTimeEntries();
        // setTimeEntries(entries);

        // Using dummy data for demonstration
        setTimeEntries(generateDummyTimeEntries());
      } catch (error) {
        console.error("Failed to load time entries:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [timeRange]);

  // Process data for visualizations
  const { summaryCards, dailyHours, projectDistribution, summaryStats } =
    processTimeData(timeEntries, timeRange);

  return (
    <div className="space-y-8 mt-12">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Time Tracking Dashboard
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange("week")}
            className={`px-3 py-1 rounded-md ${
              timeRange === "week" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange("month")}
            className={`px-3 py-1 rounded-md ${
              timeRange === "month" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange("year")}
            className={`px-3 py-1 rounded-md ${
              timeRange === "year" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SummaryCard
              icon={<FiClock className="text-blue-500" size={24} />}
              title="Total Hours"
              value={summaryCards.totalHours}
              change={summaryCards.hoursChange}
              period={timeRange}
            />
            <SummaryCard
              icon={<FiDollarSign className="text-green-500" size={24} />}
              title="Earnings"
              value={`$${summaryCards.totalEarnings}`}
              change={summaryStats?.earningsChange}
              period={timeRange}
            />
            <SummaryCard
              icon={<FiTrendingUp className="text-purple-500" size={24} />}
              title="Productivity"
              value={`${summaryCards.productivity}%`}
              change={summaryStats?.productivityChange}
              period={timeRange}
            />
            <SummaryCard
              icon={<FiCalendar className="text-orange-500" size={24} />}
              title="Active Days"
              value={summaryCards.activeDays}
              change={summaryStats?.daysChange}
              period={timeRange}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
              <h2 className="text-lg font-semibold mb-4">Daily Hours Worked</h2>
              <div className="h-80">
                <Bar data={dailyHours.data} options={dailyHours.options} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-lg font-semibold mb-4">
                Project Distribution
              </h2>
              <div className="h-80">
                <Doughnut
                  data={projectDistribution.data}
                  options={projectDistribution.options}
                />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Recent Time Entries</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hours
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {timeEntries.slice(0, 5).map((entry) => (
                    <tr key={entry.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(entry.date), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {entry.project?.name || "No project"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {entry.description || "No description"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.hours.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${entry.billingRate?.toFixed(2) || "0.00"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SummaryCard({ icon, title, value, change, period }) {
  const isPositive = change >= 0;
  const periodMap = {
    week: "last week",
    month: "last month",
    year: "last year",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex items-center justify-between">
        <div className="p-3 rounded-lg bg-gray-100">{icon}</div>
        <div
          className={`text-sm font-medium ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? "+" : ""}
          {change}%
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">{value}</h3>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xs text-gray-400 mt-1">
          {isPositive ? "Increase" : "Decrease"} from {periodMap[period]}
        </p>
      </div>
    </div>
  );
}

function processTimeData(entries, range) {
  // Filter entries based on selected time range
  const now = new Date();
  let startDate;

  switch (range) {
    case "week":
      startDate = subDays(now, 7);
      break;
    case "month":
      startDate = subMonths(now, 1);
      break;
    case "year":
      startDate = subMonths(now, 12);
      break;
    default:
      startDate = subDays(now, 7);
  }

  const filteredEntries = entries.filter(
    (entry) => new Date(entry.date) >= startDate
  );

  // Calculate summary statistics
  const totalHours = filteredEntries.reduce(
    (sum, entry) => sum + entry.hours,
    0
  );
  const totalEarnings = filteredEntries.reduce(
    (sum, entry) => sum + entry.hours * (entry.billingRate || 0),
    0
  );

  // For demo purposes - in a real app you would calculate these properly
  const hoursChange = Math.floor(Math.random() * 20) - 5;
  const earningsChange = Math.floor(Math.random() * 20) - 5;
  const productivityChange = Math.floor(Math.random() * 15);
  const daysChange = Math.floor(Math.random() * 10);

  // Prepare data for daily hours chart
  const days = eachDayOfInterval({ start: startDate, end: now });
  const dailyData = days.map((day) => {
    const dayEntries = filteredEntries.filter((entry) =>
      isSameDay(new Date(entry.date), day)
    );
    return dayEntries.reduce((sum, entry) => sum + entry.hours, 0);
  });

  const dailyHours = {
    data: {
      labels: days.map((day) => format(day, "MMM d")),
      datasets: [
        {
          label: "Hours Worked",
          data: dailyData,
          backgroundColor: "rgba(59, 130, 246, 0.7)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Hours",
          },
        },
      },
    },
  };

  // Prepare data for project distribution chart
  const projects = {};
  filteredEntries.forEach((entry) => {
    const projectName = entry.project?.name || "Other";
    projects[projectName] = (projects[projectName] || 0) + entry.hours;
  });

  const projectDistribution = {
    data: {
      labels: Object.keys(projects),
      datasets: [
        {
          data: Object.values(projects),
          backgroundColor: [
            "rgba(99, 102, 241, 0.7)",
            "rgba(14, 165, 233, 0.7)",
            "rgba(22, 163, 74, 0.7)",
            "rgba(234, 88, 12, 0.7)",
            "rgba(139, 92, 246, 0.7)",
          ],
          borderColor: [
            "rgba(99, 102, 241, 1)",
            "rgba(14, 165, 233, 1)",
            "rgba(22, 163, 74, 1)",
            "rgba(234, 88, 12, 1)",
            "rgba(139, 92, 246, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const value = context.raw;
              const percentage = Math.round((value / total) * 100);
              return `${context.label}: ${value} hours (${percentage}%)`;
            },
          },
        },
      },
    },
  };

  return {
    summaryCards: {
      totalHours: totalHours.toFixed(1),
      totalEarnings: totalEarnings.toFixed(2),
      productivity: Math.min(
        100,
        Math.floor((totalHours / (8 * days.length)) * 100)
      ),
      activeDays: new Set(filteredEntries.map((e) => e.date)).size,
      hoursChange,
      earningsChange,
      productivityChange,
      daysChange,
    },
    dailyHours,
    projectDistribution,
  };
}

function generateDummyTimeEntries() {
  const projects = [
    { id: 1, name: "Website Redesign" },
    { id: 2, name: "Mobile App" },
    { id: 3, name: "API Development" },
    { id: 4, name: "Marketing Campaign" },
  ];

  const entries = [];
  const now = new Date();

  // Generate entries for the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = subDays(now, 30 - i);
    const entriesPerDay = Math.floor(Math.random() * 3) + 1;

    for (let j = 0; j < entriesPerDay; j++) {
      const project = projects[Math.floor(Math.random() * projects.length)];
      const hours = (Math.random() * 4 + 1).toFixed(2);

      entries.push({
        id: i * 10 + j,
        date: date.toISOString(),
        description: [
          "Implemented new features",
          "Fixed bugs",
          "Code review",
          "Client meeting",
          "Performance optimization",
          "UI improvements",
        ][Math.floor(Math.random() * 6)],
        hours: parseFloat(hours),
        billingRate: [65, 75, 85, 95][Math.floor(Math.random() * 4)],
        project,
        isDummy: true,
      });
    }
  }

  return entries;
}
