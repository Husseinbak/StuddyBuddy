"use client";

import React, { useState, useEffect } from "react";
import {
  SearchIcon,
  TrophyIcon,
  AwardIcon,
  StarIcon,
  UsersIcon,
  ShieldAlertIcon,
  CheckCircleIcon,
  LoaderIcon,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";

interface LeaderboardEntry {
  id: string | number;
  name: string;
  score: number;
  course: string;
  difficulty: string;
  badges: string[];
  isCurrentUser?: boolean;
}

const defaultLeaderboardData: LeaderboardEntry[] = [
  {
    id: "d1",
    name: "Alex Johnson",
    score: 980,
    course: "BIO101",
    difficulty: "hard",
    badges: ["top_performer", "quick_learner", "consistent"],
  },
  {
    id: "d2",
    name: "Jamie Smith",
    score: 945,
    course: "CHEM101",
    difficulty: "hard",
    badges: ["top_performer", "hard_mode_master"],
  },
  {
    id: "d3",
    name: "Taylor Brown",
    score: 910,
    course: "PHYS101",
    difficulty: "medium",
    badges: ["top_performer", "team_player"],
  },
  {
    id: "d4",
    name: "Casey Wilson",
    score: 890,
    course: "MATH201",
    difficulty: "hard",
    badges: ["problem_solver"],
  },
  {
    id: "d5",
    name: "Jordan Lee",
    score: 875,
    course: "CS101",
    difficulty: "medium",
    badges: ["consistent", "team_player"],
  },
  {
    id: "d6",
    name: "Riley Garcia",
    score: 860,
    course: "BIO101",
    difficulty: "easy",
    badges: ["quick_learner"],
  },
  {
    id: "d7",
    name: "Avery Martinez",
    score: 845,
    course: "CS201",
    difficulty: "medium",
    badges: ["team_player"],
  },
  {
    id: "d8",
    name: "Morgan Robinson",
    score: 830,
    course: "PHYS101",
    difficulty: "hard",
    badges: ["hard_mode_master"],
  },
  {
    id: "d9",
    name: "Drew Thompson",
    score: 815,
    course: "MATH201",
    difficulty: "medium",
    badges: ["problem_solver"],
  },
  {
    id: "d10",
    name: "Skyler White",
    score: 800,
    course: "CS101",
    difficulty: "easy",
    badges: ["consistent"],
  },
];

const LeaderboardPage = () => {
  const [courseFilter, setCourseFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [entries, setEntries] = useState<LeaderboardEntry[]>(defaultLeaderboardData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadFirestoreLeaderboard() {
      setIsLoading(true);
      try {
        const q = query(
          collection(db, "quiz_attempts"),
          orderBy("percentage", "desc"),
          limit(25)
        );
        const snap = await getDocs(q);

        if (!snap.empty) {
          const liveEntries: LeaderboardEntry[] = snap.docs.map((docSnap, idx) => {
            const data = docSnap.data();
            const badges: string[] = [];
            if (idx < 3) badges.push("top_performer");
            if (data.percentage >= 90) badges.push("quick_learner");
            if (data.difficulty === "hard") badges.push("hard_mode_master");
            badges.push("consistent");

            return {
              id: docSnap.id,
              name: data.userName || "Student",
              score: Math.round(data.percentage * 10),
              course: data.courseCode || "CS101",
              difficulty: data.difficulty || "medium",
              badges,
            };
          });

          // Deduplicate and combine with baseline
          const combined = [...liveEntries, ...defaultLeaderboardData];
          setEntries(combined.sort((a, b) => b.score - a.score));
        }
      } catch (err) {
        console.error("Failed to load live leaderboard scores", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadFirestoreLeaderboard();
  }, []);

  const badgeInfo: Record<
    string,
    { name: string; icon: React.ReactNode; color: string }
  > = {
    top_performer: {
      name: "Top Performer",
      icon: <TrophyIcon size={13} />,
      color: "bg-amber-100 text-amber-800 border-amber-200",
    },
    quick_learner: {
      name: "Quick Learner",
      icon: <StarIcon size={13} />,
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    consistent: {
      name: "Consistent",
      icon: <CheckCircleIcon size={13} />,
      color: "bg-green-100 text-green-800 border-green-200",
    },
    team_player: {
      name: "Team Player",
      icon: <UsersIcon size={13} />,
      color: "bg-purple-100 text-purple-800 border-purple-200",
    },
    problem_solver: {
      name: "Problem Solver",
      icon: <StarIcon size={13} />,
      color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    },
    hard_mode_master: {
      name: "Hard Mode Master",
      icon: <AwardIcon size={13} />,
      color: "bg-red-100 text-red-800 border-red-200",
    },
  };

  const filteredData = entries.filter((user) => {
    if (
      searchQuery.trim() &&
      !user.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (courseFilter !== "all" && user.course.toUpperCase() !== courseFilter.toUpperCase()) {
      return false;
    }
    if (difficultyFilter !== "all" && user.difficulty !== difficultyFilter) {
      return false;
    }
    return true;
  });

  const getRankBadge = (index: number) => {
    if (index === 0) return <span className="text-xl">🏆</span>;
    if (index === 1) return <span className="text-xl">🥈</span>;
    if (index === 2) return <span className="text-xl">🥉</span>;
    return <span className="font-bold text-gray-500 text-sm">#{index + 1}</span>;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Weekly Leaderboard</h1>
        <p className="text-gray-600">
          Rankings are calculated strictly from first-attempt assessment scores per course.
        </p>
      </div>

      {/* Top 3 Podium Cards */}
      {filteredData.length >= 3 && !searchQuery && courseFilter === "all" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {/* Rank 2 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center flex flex-col items-center justify-between order-2 md:order-1">
            <div className="text-3xl mb-2">🥈</div>
            <div className="font-bold text-gray-800 text-base">{filteredData[1].name}</div>
            <span className="text-xs text-gray-500 font-medium">{filteredData[1].course}</span>
            <div className="mt-3 px-4 py-1.5 bg-blue-50 text-blue-700 font-black text-lg rounded-xl">
              {filteredData[1].score} pts
            </div>
          </div>

          {/* Rank 1 */}
          <div className="bg-gradient-to-b from-amber-50 to-white rounded-2xl p-7 border-2 border-amber-300 shadow-md text-center flex flex-col items-center justify-between order-1 md:order-2 transform md:-translate-y-2">
            <div className="text-4xl mb-2">🏆</div>
            <div className="font-black text-gray-900 text-lg">{filteredData[0].name}</div>
            <span className="text-xs text-amber-700 font-semibold">{filteredData[0].course} Champion</span>
            <div className="mt-3 px-5 py-2 bg-amber-500 text-white font-black text-xl rounded-xl shadow-xs">
              {filteredData[0].score} pts
            </div>
          </div>

          {/* Rank 3 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center flex flex-col items-center justify-between order-3">
            <div className="text-3xl mb-2">🥉</div>
            <div className="font-bold text-gray-800 text-base">{filteredData[2].name}</div>
            <span className="text-xs text-gray-500 font-medium">{filteredData[2].course}</span>
            <div className="mt-3 px-4 py-1.5 bg-blue-50 text-blue-700 font-black text-lg rounded-xl">
              {filteredData[2].score} pts
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-grow">
            <SearchIcon
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search student by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Courses</option>
              <option value="BIO101">BIO101 - Biology</option>
              <option value="CS101">CS101 - Computer Science</option>
              <option value="CS201">CS201 - Algorithms</option>
              <option value="CHEM101">CHEM101 - Chemistry</option>
              <option value="MATH201">MATH201 - Mathematics</option>
              <option value="PHYS101">PHYS101 - Physics</option>
            </select>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
        {isLoading ? (
          <div className="p-12 text-center text-gray-500">
            <LoaderIcon size={28} className="animate-spin mx-auto mb-2 text-blue-600" />
            <span>Calculating real-time academic standings...</span>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No students found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 text-center w-16">Rank</th>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Course</th>
                  <th className="py-3.5 px-4">Difficulty</th>
                  <th className="py-3.5 px-4">Earned Badges</th>
                  <th className="py-3.5 px-4 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredData.map((student, idx) => (
                  <tr
                    key={student.id}
                    className={`hover:bg-blue-50/40 transition-colors ${
                      idx < 3 ? "bg-amber-50/10 font-medium" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center">
                      {getRankBadge(idx)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                          {student.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-gray-800">
                          {student.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-bold">
                        {student.course}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs text-gray-600 capitalize">
                        {student.difficulty}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {student.badges.map((badgeKey) => {
                          const badge = badgeInfo[badgeKey];
                          if (!badge) return null;
                          return (
                            <span
                              key={badgeKey}
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badge.color}`}
                            >
                              <span className="mr-1">{badge.icon}</span>
                              {badge.name}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg text-sm">
                        {student.score} pts
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
