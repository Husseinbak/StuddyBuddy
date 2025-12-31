"use client";
import React, { useState } from "react";
import { SearchIcon, TrophyIcon, AwardIcon, StarIcon } from "lucide-react";
const LeaderboardPage = () => {
  const [courseFilter, setCourseFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  // Sample leaderboard data
  const leaderboardData = [
    {
      id: 1,
      name: "Alex Johnson",
      score: 980,
      course: "Biology",
      difficulty: "all",
      badges: ["top_performer", "quick_learner", "consistent"],
    },
    {
      id: 2,
      name: "Jamie Smith",
      score: 945,
      course: "Chemistry",
      difficulty: "hard",
      badges: ["top_performer", "hard_mode_master"],
    },
    {
      id: 3,
      name: "Taylor Brown",
      score: 910,
      course: "Physics",
      difficulty: "medium",
      badges: ["top_performer", "team_player"],
    },
    {
      id: 4,
      name: "Casey Wilson",
      score: 890,
      course: "Mathematics",
      difficulty: "hard",
      badges: ["problem_solver"],
    },
    {
      id: 5,
      name: "Jordan Lee",
      score: 875,
      course: "Computer Science",
      difficulty: "medium",
      badges: ["consistent", "team_player"],
    },
    {
      id: 6,
      name: "Riley Garcia",
      score: 860,
      course: "Biology",
      difficulty: "easy",
      badges: ["quick_learner"],
    },
    {
      id: 7,
      name: "Avery Martinez",
      score: 845,
      course: "Chemistry",
      difficulty: "medium",
      badges: ["team_player"],
    },
    {
      id: 8,
      name: "Morgan Robinson",
      score: 830,
      course: "Physics",
      difficulty: "hard",
      badges: ["hard_mode_master"],
    },
    {
      id: 9,
      name: "Drew Thompson",
      score: 815,
      course: "Mathematics",
      difficulty: "medium",
      badges: ["problem_solver"],
    },
    {
      id: 10,
      name: "Skyler White",
      score: 800,
      course: "Computer Science",
      difficulty: "easy",
      badges: ["consistent"],
    },
    {
      id: 11,
      name: "Charlie Evans",
      score: 785,
      course: "Biology",
      difficulty: "medium",
      badges: [],
    },
    {
      id: 12,
      name: "Reese Parker",
      score: 770,
      course: "Chemistry",
      difficulty: "hard",
      badges: ["hard_mode_master"],
    },
    {
      id: 13,
      name: "Finley Adams",
      score: 755,
      course: "Physics",
      difficulty: "easy",
      badges: ["quick_learner"],
    },
    {
      id: 14,
      name: "Quinn Nelson",
      score: 740,
      course: "Mathematics",
      difficulty: "medium",
      badges: [],
    },
    {
      id: 15,
      name: "Hayden Baker",
      score: 725,
      course: "Computer Science",
      difficulty: "hard",
      badges: ["problem_solver"],
    },
    {
      id: 16,
      name: "Dakota Clark",
      score: 710,
      course: "Biology",
      difficulty: "medium",
      badges: ["team_player"],
    },
    {
      id: 17,
      name: "Emerson Wright",
      score: 695,
      course: "Chemistry",
      difficulty: "easy",
      badges: ["consistent"],
    },
    {
      id: 18,
      name: "Rowan Young",
      score: 680,
      course: "Physics",
      difficulty: "hard",
      badges: [],
    },
    {
      id: 19,
      name: "Phoenix Allen",
      score: 665,
      course: "Mathematics",
      difficulty: "medium",
      badges: ["quick_learner"],
    },
    {
      id: 20,
      name: "Sage Martin",
      score: 650,
      course: "Computer Science",
      difficulty: "easy",
      badges: [],
    },
  ];
  // Filter the leaderboard data
  const filteredData = leaderboardData.filter((user) => {
    if (courseFilter !== "all" && user.course !== courseFilter) return false;
    if (difficultyFilter !== "all" && user.difficulty !== difficultyFilter)
      return false;
    return true;
  });
  // Badge information
  const badgeInfo = {
    top_performer: {
      name: "Top Performer",
      icon: <TrophyIcon size={14} />,
      color: "bg-amber-100 text-amber-700",
    },
    quick_learner: {
      name: "Quick Learner",
      icon: <StarIcon size={14} />,
      color: "bg-blue-100 text-blue-700",
    },
    consistent: {
      name: "Consistent",
      icon: <StarIcon size={14} />,
      color: "bg-green-100 text-green-700",
    },
    team_player: {
      name: "Team Player",
      icon: <StarIcon size={14} />,
      color: "bg-purple-100 text-purple-700",
    },
    problem_solver: {
      name: "Problem Solver",
      icon: <StarIcon size={14} />,
      color: "bg-indigo-100 text-indigo-700",
    },
    hard_mode_master: {
      name: "Hard Mode Master",
      icon: <AwardIcon size={14} />,
      color: "bg-red-100 text-red-700",
    },
  };
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Leaderboard</h1>
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-grow">
            <SearchIcon
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by name"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Courses</option>
              <option value="Biology">Biology</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Physics">Physics</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Computer Science">Computer Science</option>
            </select>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      </div>
      {/* Leaderboard Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Rank
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Student
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Course
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Score
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Badges
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((user, index) => (
                <tr key={user.id} className={index < 3 ? "bg-blue-50" : ""}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {index === 0 ? (
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-100 text-amber-700">
                          <TrophyIcon size={16} />
                        </div>
                      ) : index === 1 ? (
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-700">
                          <span className="font-bold">2</span>
                        </div>
                      ) : index === 2 ? (
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-50 text-amber-700">
                          <span className="font-bold">3</span>
                        </div>
                      ) : (
                        <div className="w-8 h-8 flex items-center justify-center text-gray-500">
                          {index + 1}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-800">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                      {user.course}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-gray-800">{user.score}</div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{
                          width: `${(user.score / 1000) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {user.badges.map((badge, idx) => (
                        <span
                          key={idx}
                          className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                            badgeInfo[badge as keyof typeof badgeInfo].color
                          }`}
                          title={
                            badgeInfo[badge as keyof typeof badgeInfo].name
                          }
                        >
                          {badgeInfo[badge as keyof typeof badgeInfo].icon}
                          <span className="ml-1 hidden sm:inline">
                            {badgeInfo[badge as keyof typeof badgeInfo].name}
                          </span>
                        </span>
                      ))}
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
export default LeaderboardPage;
