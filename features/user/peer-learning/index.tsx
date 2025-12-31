"use client";

import React, { useState } from "react";
import { CalendarIcon, ClockIcon, StarIcon, SearchIcon } from "lucide-react";
import Image from "next/image";

const TutoringPage = () => {
  const [activeTab, setActiveTab] = useState("tutors");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  // Sample tutors data
  const tutors = [
    {
      id: 1,
      name: "Dr. Emily Chen",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      expertise: ["Biology", "Chemistry"],
      rating: 4.9,
      availability: ["Mon", "Wed", "Fri"],
      sessions: 128,
    },
    {
      id: 2,
      name: "Prof. Michael Johnson",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      expertise: ["Physics", "Mathematics"],
      rating: 4.7,
      availability: ["Tue", "Thu", "Sat"],
      sessions: 95,
    },
    {
      id: 3,
      name: "Sarah Williams, MSc",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      expertise: ["Computer Science", "Data Science"],
      rating: 4.8,
      availability: ["Mon", "Tue", "Wed", "Thu"],
      sessions: 112,
    },
    {
      id: 4,
      name: "Dr. Robert Taylor",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      expertise: ["History", "Literature"],
      rating: 4.6,
      availability: ["Wed", "Fri", "Sun"],
      sessions: 87,
    },
  ];
  // Generate dates for the next 7 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split("T")[0],
        day: new Intl.DateTimeFormat("en-US", {
          weekday: "short",
        }).format(date),
        dayOfMonth: date.getDate(),
      });
    }
    return dates;
  };
  const dates = generateDates();
  // Sample time slots
  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
  ];
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Peer Tutoring & Collaboration
      </h1>
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("tutors")}
          className={`px-4 py-2 font-medium ${
            activeTab === "tutors"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Find Tutors
        </button>
        <button
          onClick={() => setActiveTab("sessions")}
          className={`px-4 py-2 font-medium ${
            activeTab === "sessions"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          My Sessions
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`px-4 py-2 font-medium ${
            activeTab === "chat"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Chat
        </button>
      </div>
      {/* Search and Filter */}
      {activeTab === "tutors" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-grow">
              <SearchIcon
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by subject or tutor name"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">All Subjects</option>
                <option value="math">Mathematics</option>
                <option value="science">Science</option>
                <option value="english">English</option>
                <option value="history">History</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Availability</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="week">This Week</option>
              </select>
            </div>
          </div>
        </div>
      )}
      {/* Tutor Listing */}
      {activeTab === "tutors" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tutors.map((tutor) => (
            <div
              key={tutor.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start">
                  <Image
                    src={tutor.avatar}
                    alt={tutor.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-medium text-gray-800">
                      {tutor.name}
                    </h3>
                    <div className="flex items-center mt-1 mb-2">
                      <div className="flex items-center text-amber-500 mr-2">
                        <StarIcon size={16} className="fill-current" />
                        <span className="ml-1 text-sm font-medium">
                          {tutor.rating}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {tutor.sessions} sessions
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {tutor.expertise.map((subject, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon size={14} className="mr-1" />
                      <span>Available: {tutor.availability.join(", ")}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 bg-gray-50 p-4">
                <div className="flex justify-between">
                  <button className="px-4 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
                    View Profile
                  </button>
                  <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Request Session
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Calendar Picker */}
      {activeTab === "sessions" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <CalendarIcon size={18} className="mr-2" />
            Schedule a Session
          </h2>
          <div className="mb-6">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {dates.map((date, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date.date)}
                  className={`flex flex-col items-center justify-center min-w-[60px] h-20 p-2 rounded-lg border ${
                    selectedDate === date.date
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="text-sm font-medium">{date.day}</span>
                  <span className="text-lg font-bold mt-1">
                    {date.dayOfMonth}
                  </span>
                </button>
              ))}
            </div>
          </div>
          {selectedDate && (
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-3">
                Available Time Slots
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {timeSlots.map((time, index) => (
                  <button
                    key={index}
                    className="py-2 px-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-center"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {/* Chat Interface */}
      {activeTab === "chat" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] flex flex-col">
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center">
              <Image
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
                alt="Dr. Emily Chen"
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div>
                <h3 className="font-medium text-gray-800">Dr. Emily Chen</h3>
                <p className="text-sm text-gray-500">Biology, Chemistry</p>
              </div>
            </div>
          </div>
          <div className="flex-grow p-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-end">
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
                  alt="Dr. Emily Chen"
                  className="w-8 h-8 rounded-full object-cover mr-2"
                />
                <div className="bg-gray-100 rounded-lg rounded-bl-none p-3 max-w-[80%]">
                  <p>
                    Hi there! How can I help you with your biology studies
                    today?
                  </p>
                  <span className="text-xs text-gray-500 mt-1 block">
                    10:32 AM
                  </span>
                </div>
              </div>
              <div className="flex items-end justify-end">
                <div className="bg-blue-100 rounded-lg rounded-br-none p-3 max-w-[80%]">
                  <p>
                    I&apos;m having trouble understanding photosynthesis. Could
                    you explain the light-dependent reactions?
                  </p>
                  <span className="text-xs text-gray-500 mt-1 block">
                    10:34 AM
                  </span>
                </div>
              </div>
              <div className="flex items-end">
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
                  alt="Dr. Emily Chen"
                  className="w-8 h-8 rounded-full object-cover mr-2"
                />
                <div className="bg-gray-100 rounded-lg rounded-bl-none p-3 max-w-[80%]">
                  <p>
                    Of course! The light-dependent reactions take place in the
                    thylakoid membrane of the chloroplast. They convert light
                    energy into chemical energy in the form of ATP and NADPH.
                  </p>
                  <span className="text-xs text-gray-500 mt-1 block">
                    10:36 AM
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 p-4">
            <div className="flex">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default TutoringPage;
