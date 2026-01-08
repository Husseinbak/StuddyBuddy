import React from "react";
import {
  UploadIcon,
  BrainIcon,
  UsersIcon,
  BarChartIcon,
  ArrowRightIcon,
} from "lucide-react";
import Link from "next/link";
const Dashboard = () => {
  const actionCards = [
    {
      title: "Upload Materials",
      description: "Upload your study materials for AI analysis",
      icon: <UploadIcon size={24} />,
      color: "bg-blue-100 text-blue-600",
      link: "/documents",
    },
    {
      title: "Start Quiz",
      description: "Test your knowledge with AI-generated quizzes",
      icon: <BrainIcon size={24} />,
      color: "bg-green-100 text-green-600",
      link: "/quiz",
    },
    {
      title: "Peer Tutoring",
      description: "Connect with peers for collaborative learning",
      icon: <UsersIcon size={24} />,
      color: "bg-purple-100 text-purple-600",
      link: "/peer-learning",
    },
    {
      title: "View Analytics",
      description: "Track your learning progress and performance",
      icon: <BarChartIcon size={24} />,
      color: "bg-amber-100 text-amber-600",
      link: "/analytics",
    },
  ];
  const leaderboardData = [
    {
      id: 1,
      name: "Alex Johnson",
      score: 980,
      badge: "🏆",
    },
    {
      id: 2,
      name: "Jamie Smith",
      score: 945,
      badge: "🥈",
    },
    {
      id: 3,
      name: "Taylor Brown",
      score: 910,
      badge: "🥉",
    },
    {
      id: 4,
      name: "Casey Wilson",
      score: 890,
      badge: "⭐",
    },
    {
      id: 5,
      name: "Jordan Lee",
      score: 875,
      badge: "⭐",
    },
  ];
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Elevate your learning with AI
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-6">
            Upload materials, generate quizzes, collaborate with peers, and
            track your progress all in one place.
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center bg-white text-blue-600 px-5 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Get Started
            <ArrowRightIcon size={18} className="ml-2" />
          </Link>
        </div>
      </section>
      {/* Quick Action Cards */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actionCards.map((card, index) => (
            <Link
              key={index}
              href={card.link}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className={`${card.color} p-3 rounded-lg inline-block mb-3`}>
                {card.icon}
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-1">
                {card.title}
              </h3>
              <p className="text-gray-600">{card.description}</p>
            </Link>
          ))}
        </div>
      </section>
      {/* Leaderboard Preview */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Top Performers
          </h2>
          <Link
            href="/leaderboard"
            className="text-blue-600 hover:text-blue-700 flex items-center"
          >
            View All
            <ArrowRightIcon size={16} className="ml-1" />
          </Link>
        </div>
        <div className="overflow-hidden">
          {leaderboardData.map((user, index) => (
            <div
              key={user.id}
              className="flex items-center py-3 border-b last:border-b-0 border-gray-100"
            >
              <div className="w-8 text-center font-medium text-gray-500">
                {index + 1}
              </div>
              <div className="ml-3 mr-2">{user.badge}</div>
              <div className="flex-grow font-medium text-gray-800">
                {user.name}
              </div>
              <div className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-sm font-medium">
                {user.score} pts
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
export default Dashboard;
