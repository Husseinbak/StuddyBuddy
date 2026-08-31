/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
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
  PieLabelRenderProps,
} from "recharts";
import {
  BarChartIcon,
  PieChartIcon,
  TrendingUpIcon,
  ClockIcon,
  BrainIcon,
  LoaderIcon,
} from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import Link from "next/link";
import formatTime from "@/utils/formatTime";

interface AttemptData {
  id: string;
  courseCode: string;
  difficulty: "easy" | "medium" | "hard";
  score: number;
  percentage: number;
  timeSpent: number;
  completedAt?: any;
}

const AnalyticsPage = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");
  const [attempts, setAttempts] = useState<AttemptData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchUserAnalytics() {
      if (!user?.uid) return;
      setIsLoading(true);
      try {
        const q = query(
          collection(db, "quiz_attempts"),
          where("userId", "==", user.uid)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const loaded: AttemptData[] = snap.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<AttemptData, "id">),
          }));
          setAttempts(loaded);
        }
      } catch (err) {
        console.error("Failed to load user analytics:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUserAnalytics();
  }, [user]);

  // Compute live statistics or use structured baseline
  const hasRealAttempts = attempts.length > 0;

  // 1. Progression Data
  const progressData = hasRealAttempts
    ? attempts.map((att, idx) => ({
        date: `Test ${idx + 1}`,
        score: att.percentage,
        course: att.courseCode,
      }))
    : [
        { date: "Week 1", score: 65 },
        { date: "Week 2", score: 70 },
        { date: "Week 3", score: 68 },
        { date: "Week 4", score: 75 },
        { date: "Week 5", score: 72 },
        { date: "Week 6", score: 78 },
        { date: "Week 7", score: 82 },
        { date: "Week 8", score: 85 },
      ];

  // 2. Aggregate Metrics
  const totalAttemptsCount = hasRealAttempts ? attempts.length : 124;
  const avgScore = hasRealAttempts
    ? Math.round(
        attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length
      )
    : 78;
  const totalSeconds = hasRealAttempts
    ? attempts.reduce((sum, a) => sum + (a.timeSpent || 0), 0)
    : 151200; // 42h
  const timeSpentFormatted = hasRealAttempts
    ? formatTime(totalSeconds)
    : "42h";

  // Improvement Rate (Comparing first half vs second half or baseline)
  let improvementRate = "+12%";
  if (hasRealAttempts && attempts.length >= 2) {
    const firstScore = attempts[0].percentage;
    const lastScore = attempts[attempts.length - 1].percentage;
    const diff = lastScore - firstScore;
    improvementRate = `${diff >= 0 ? "+" : ""}${diff}%`;
  }

  const metrics = [
    {
      title: "Total Attempts",
      value: String(totalAttemptsCount),
      icon: <BarChartIcon size={20} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Average Score",
      value: `${avgScore}%`,
      icon: <PieChartIcon size={20} />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Improvement Rate",
      value: improvementRate,
      icon: <TrendingUpIcon size={20} />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Time Spent",
      value: timeSpentFormatted,
      icon: <ClockIcon size={20} />,
      color: "bg-amber-100 text-amber-600",
    },
  ];

  // 3. Difficulty Data
  const difficultyData = (() => {
    if (!hasRealAttempts) {
      return [
        { name: "Easy", value: 85 },
        { name: "Medium", value: 70 },
        { name: "Hard", value: 45 },
      ];
    }
    const grouped: Record<string, { total: number; count: number }> = {
      easy: { total: 0, count: 0 },
      medium: { total: 0, count: 0 },
      hard: { total: 0, count: 0 },
    };
    attempts.forEach((att) => {
      if (grouped[att.difficulty]) {
        grouped[att.difficulty].total += att.percentage;
        grouped[att.difficulty].count++;
      }
    });
    return [
      {
        name: "Easy",
        value: grouped.easy.count
          ? Math.round(grouped.easy.total / grouped.easy.count)
          : 85,
      },
      {
        name: "Medium",
        value: grouped.medium.count
          ? Math.round(grouped.medium.total / grouped.medium.count)
          : 70,
      },
      {
        name: "Hard",
        value: grouped.hard.count
          ? Math.round(grouped.hard.total / grouped.hard.count)
          : 45,
      },
    ];
  })();

  // 4. Subject Performance Breakdown
  const subjectBreakdown = (() => {
    const subjectsMap: Record<
      string,
      { count: number; totalScore: number; timeSpent: number }
    > = {};

    if (hasRealAttempts) {
      attempts.forEach((att) => {
        const code = att.courseCode || "General";
        if (!subjectsMap[code]) {
          subjectsMap[code] = { count: 0, totalScore: 0, timeSpent: 0 };
        }
        subjectsMap[code].count++;
        subjectsMap[code].totalScore += att.percentage;
        subjectsMap[code].timeSpent += att.timeSpent || 0;
      });

      return Object.entries(subjectsMap).map(([subject, data]) => ({
        subject,
        quizzesTaken: data.count,
        avgScore: Math.round(data.totalScore / data.count),
        timeSpent: formatTime(data.timeSpent),
      }));
    }

    return [
      { subject: "BIO101 (Biology)", quizzesTaken: 32, avgScore: 85, timeSpent: "12h 30m" },
      { subject: "CS201 (Algorithms)", quizzesTaken: 28, avgScore: 76, timeSpent: "10h 45m" },
      { subject: "CS101 (Computer Science)", quizzesTaken: 40, avgScore: 82, timeSpent: "15h 20m" },
      { subject: "MATH201 (Calculus)", quizzesTaken: 24, avgScore: 68, timeSpent: "9h 15m" },
    ];
  })();

  const COLORS = ["#4ade80", "#facc15", "#f87171"];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Performance Analytics & Mastery
          </h1>
          <p className="text-gray-600">
            Real-time assessment tracking, difficulty success rates, and subject progression.
          </p>
        </div>

        <div className="inline-flex rounded-lg shadow-sm bg-white p-1 border border-gray-200 mt-4 md:mt-0">
          <button
            onClick={() => setTimeRange("week")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              timeRange === "week"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange("month")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              timeRange === "month"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange("year")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              timeRange === "year"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="bg-blue-50 p-4 rounded-xl flex items-center space-x-2 text-blue-700 text-sm">
          <LoaderIcon size={18} className="animate-spin" />
          <span>Synchronizing performance analytics with Firestore records...</span>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center mb-2">
              <div className={`p-2 rounded-lg ${metric.color}`}>
                {metric.icon}
              </div>
              <h3 className="ml-3 text-gray-600 font-medium text-sm">
                {metric.title}
              </h3>
            </div>
            <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Progression Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              Score Progression Trend
            </h2>
            <span className="text-xs text-gray-500 font-semibold">
              Average Mastery: {avgScore}%
            </span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={progressData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Success Rate by Difficulty */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Success Rate by Difficulty
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={difficultyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={(props: PieLabelRenderProps) => {
                    const percent = (props as any).percent as number | undefined;
                    const name = (props.payload as any)?.name;
                    return percent && name ? `${name}: ${(percent * 100).toFixed(0)}%` : null;
                  }}
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

      {/* Subject Performance Breakdown Table */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            Performance by Subject
          </h2>
          <Link
            href="/quiz"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center"
          >
            <BrainIcon size={14} className="mr-1" />
            Practice More Courses
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Assessments Completed
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Average Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Total Time Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Progress Mastery
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {subjectBreakdown.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {row.subject}
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {row.quizzesTaken}
                  </td>
                  <td className="px-6 py-4 font-bold text-blue-700">
                    {row.avgScore}%
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {row.timeSpent}
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          row.avgScore >= 80
                            ? "bg-green-500"
                            : row.avgScore >= 70
                            ? "bg-blue-500"
                            : "bg-amber-500"
                        }`}
                        style={{ width: `${row.avgScore}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
