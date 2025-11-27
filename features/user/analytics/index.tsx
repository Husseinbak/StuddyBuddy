"use client";
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  BarChartIcon,
  PieChartIcon,
  TrendingUpIcon,
  ClockIcon,
} from "lucide-react";
const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState("month");
  // Sample data for score progression
  const progressData = [
    {
      date: "Week 1",
      score: 65,
    },
    {
      date: "Week 2",
      score: 70,
    },
    {
      date: "Week 3",
      score: 68,
    },
    {
      date: "Week 4",
      score: 75,
    },
    {
      date: "Week 5",
      score: 72,
    },
    {
      date: "Week 6",
      score: 78,
    },
    {
      date: "Week 7",
      score: 82,
    },
    {
      date: "Week 8",
      score: 85,
    },
  ];
  // Sample data for success rate by difficulty
  const difficultyData = [
    {
      name: "Easy",
      value: 85,
    },
    {
      name: "Medium",
      value: 70,
    },
    {
      name: "Hard",
      value: 45,
    },
  ];
  // Sample data for key metrics
  const metrics = [
    {
      title: "Total Attempts",
      value: "124",
      icon: <BarChartIcon size={20} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Average Score",
      value: "78%",
      icon: <PieChartIcon size={20} />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Improvement Rate",
      value: "+12%",
      icon: <TrendingUpIcon size={20} />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Time Spent",
      value: "42h",
      icon: <ClockIcon size={20} />,
      color: "bg-amber-100 text-amber-600",
    },
  ];
  // Colors for pie chart
  const COLORS = ["#4ade80", "#facc15", "#f87171"];
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">
          Performance Analytics
        </h1>
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setTimeRange("week")}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
              timeRange === "week"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange("month")}
            className={`px-4 py-2 text-sm font-medium border-t border-b ${
              timeRange === "month"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange("year")}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
              timeRange === "year"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Year
          </button>
        </div>
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center mb-2">
              <div className={`p-2 rounded-lg ${metric.color}`}>
                {metric.icon}
              </div>
              <h3 className="ml-3 text-gray-600 font-medium">{metric.title}</h3>
            </div>
            <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
          </div>
        ))}
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Progression Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Score Progression
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={progressData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  activeDot={{
                    r: 8,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Success Rate by Difficulty */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Success Rate by Difficulty
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={difficultyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {difficultyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Subject Performance */}
      <div className="mt-6 bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Performance by Subject
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quizzes Taken
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Average Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-800">Biology</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  32
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  85%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  12h 30m
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-500 h-2.5 rounded-full"
                      style={{
                        width: "85%",
                      }}
                    ></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-800">Chemistry</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  28
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  76%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  10h 45m
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{
                        width: "76%",
                      }}
                    ></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-800">Physics</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  24
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  68%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  9h 15m
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-amber-500 h-2.5 rounded-full"
                      style={{
                        width: "68%",
                      }}
                    ></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-800">Mathematics</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  40
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  82%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  15h 20m
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: "82%",
                      }}
                    ></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default AnalyticsPage;
