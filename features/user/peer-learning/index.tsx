"use client";

import React, { useState } from "react";
import {
  CalendarIcon,
  ClockIcon,
  StarIcon,
  SearchIcon,
  CheckCircleIcon,
  MessageSquareIcon,
  SendIcon,
  UserCheckIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface Tutor {
  id: number;
  name: string;
  avatar: string;
  expertise: string[];
  rating: number;
  availability: string[];
  sessions: number;
  bio?: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "tutor";
  text: string;
  time: string;
}

interface BookedSession {
  id: string;
  tutorName: string;
  date: string;
  time: string;
  subject: string;
}

const TutoringPage = () => {
  const [activeTab, setActiveTab] = useState<"tutors" | "sessions" | "chat">("tutors");
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedSessions, setBookedSessions] = useState<BookedSession[]>([
    {
      id: "session-1",
      tutorName: "Dr. Emily Chen",
      date: new Date().toISOString().split("T")[0],
      time: "2:00 PM",
      subject: "Biology",
    },
  ]);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  // Chat state
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "tutor",
      text: "Hi there! How can I help you with your biology studies today?",
      time: "10:32 AM",
    },
    {
      id: "2",
      sender: "user",
      text: "I'm having trouble understanding photosynthesis. Could you explain the light-dependent reactions?",
      time: "10:34 AM",
    },
    {
      id: "3",
      sender: "tutor",
      text: "Of course! The light-dependent reactions take place in the thylakoid membrane of the chloroplast. They convert light energy into chemical energy in the form of ATP and NADPH.",
      time: "10:36 AM",
    },
  ]);

  const tutors: Tutor[] = [
    {
      id: 1,
      name: "Dr. Emily Chen",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      expertise: ["Biology", "Chemistry"],
      rating: 4.9,
      availability: ["Mon", "Wed", "Fri"],
      sessions: 128,
      bio: "Doctorate in Molecular Biology with 5+ years of university tutoring experience.",
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
      bio: "Physics lecturer specializing in Newtonian mechanics and calculus.",
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
      bio: "Software engineer and researcher helping students master algorithms and data structures.",
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
      bio: "Humanities tutor with focus on analytical essay writing and historical context.",
    },
  ];

  // Filter tutors
  const filteredTutors = tutors.filter((tutor) => {
    const matchesSearch =
      searchQuery === "" ||
      tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.expertise.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSubject =
      subjectFilter === "all" ||
      tutor.expertise.some((e) => e.toLowerCase() === subjectFilter.toLowerCase());

    const matchesAvailability =
      availabilityFilter === "all" ||
      tutor.availability.some((a) => a.toLowerCase().includes(availabilityFilter.toLowerCase()));

    return matchesSearch && matchesSubject && matchesAvailability;
  });

  // Dates for next 7 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split("T")[0],
        day: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date),
        dayOfMonth: date.getDate(),
      });
    }
    return dates;
  };
  const dates = generateDates();

  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
  ];

  const handleRequestSession = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setSelectedDate(dates[0].date);
    setActiveTab("sessions");
  };

  const handleBookSession = () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select both a date and a time slot.");
      return;
    }
    const tutor = selectedTutor || tutors[0];
    const newSession: BookedSession = {
      id: `session-${Date.now()}`,
      tutorName: tutor.name,
      date: selectedDate,
      time: selectedTime,
      subject: tutor.expertise[0] || "General Tutoring",
    };
    setBookedSessions((prev) => [...prev, newSession]);
    toast.success(`Session booked with ${tutor.name} on ${selectedDate} at ${selectedTime}!`);
    setBookingSuccess(`Session booked successfully with ${tutor.name} on ${selectedDate} at ${selectedTime}!`);
    setSelectedTime(null);
    setTimeout(() => setBookingSuccess(null), 4000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: messageInput.trim(),
      time: new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "numeric" }).format(new Date()),
    };

    setMessages((prev) => [...prev, userMsg]);
    setMessageInput("");

    // Simulate tutor reply
    setTimeout(() => {
      const tutorReplies = [
        "That's a great question! Let's break it down step-by-step.",
        "Exactly! Make sure to review the corresponding section in your uploaded document as well.",
        "Remember the key formula for this concept and practice with the quiz questions.",
        "I'll prepare some targeted exercises for our upcoming review session.",
      ];
      const randomReply = tutorReplies[Math.floor(Math.random() * tutorReplies.length)];
      const tutorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "tutor",
        text: randomReply,
        time: new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "numeric" }).format(new Date()),
      };
      setMessages((prev) => [...prev, tutorMsg]);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Peer Tutoring & Collaboration
          </h1>
          <p className="text-gray-600">
            Connect with subject matter experts, book study sessions, and ask questions.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("tutors")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "tutors"
              ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Find Tutors
        </button>
        <button
          onClick={() => setActiveTab("sessions")}
          className={`px-4 py-2 font-medium transition-colors flex items-center space-x-2 ${
            activeTab === "sessions"
              ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <span>Sessions & Booking</span>
          {bookedSessions.length > 0 && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-bold">
              {bookedSessions.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`px-4 py-2 font-medium transition-colors flex items-center space-x-2 ${
            activeTab === "chat"
              ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <MessageSquareIcon size={16} />
          <span>Live Tutor Chat</span>
        </button>
      </div>

      {/* TAB 1: FIND TUTORS */}
      {activeTab === "tutors" && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-grow">
                <SearchIcon
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search by subject or tutor name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">All Subjects</option>
                  <option value="biology">Biology</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="physics">Physics</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="computer science">Computer Science</option>
                  <option value="history">History</option>
                </select>
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">All Days</option>
                  <option value="mon">Monday</option>
                  <option value="tue">Tuesday</option>
                  <option value="wed">Wednesday</option>
                  <option value="thu">Thursday</option>
                  <option value="fri">Friday</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tutor Listing */}
          {filteredTutors.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
              <p className="text-gray-500">No tutors found matching your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTutors.map((tutor) => (
                <div
                  key={tutor.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start">
                      <Image
                        src={tutor.avatar}
                        alt={tutor.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                      <div className="flex-grow">
                        <h3 className="text-lg font-bold text-gray-800">
                          {tutor.name}
                        </h3>
                        <div className="flex items-center mt-1 mb-2">
                          <div className="flex items-center text-amber-500 mr-2">
                            <StarIcon size={16} className="fill-current" />
                            <span className="ml-1 text-sm font-semibold">
                              {tutor.rating}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {tutor.sessions} sessions completed
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {tutor.expertise.map((subject, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <ClockIcon size={14} className="mr-1 text-gray-400" />
                          <span>Available: {tutor.availability.join(", ")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 bg-gray-50 px-6 py-3.5 flex justify-between items-center">
                    <button
                      onClick={() => {
                        setSelectedTutor(tutor);
                        setActiveTab("chat");
                      }}
                      className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-white transition-colors"
                    >
                      Chat with Tutor
                    </button>
                    <button
                      onClick={() => handleRequestSession(tutor)}
                      className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      Book Session
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SESSIONS & BOOKING */}
      {activeTab === "sessions" && (
        <div className="space-y-6">
          {bookingSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2">
              <CheckCircleIcon size={18} />
              <span>{bookingSuccess}</span>
            </div>
          )}

          {/* Book New Session Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
              <CalendarIcon size={20} className="mr-2 text-blue-600" />
              Book a New Study Session
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {selectedTutor
                ? `Booking session with ${selectedTutor.name} (${selectedTutor.expertise.join(", ")})`
                : "Select a date and available time slot to schedule peer assistance."}
            </p>

            {/* Date Picker */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {dates.map((date, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(date.date)}
                    className={`flex flex-col items-center justify-center min-w-[70px] h-20 p-2 rounded-xl border transition-all ${
                      selectedDate === date.date
                        ? "bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-500/20"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <span className="text-xs font-semibold">{date.day}</span>
                    <span className="text-xl font-bold mt-1">
                      {date.dayOfMonth}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time Slot
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {timeSlots.map((time, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-colors ${
                        selectedTime === time
                          ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                          : "border-gray-200 hover:border-blue-300 bg-white text-gray-700"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleBookSession}
                disabled={!selectedDate || !selectedTime}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                Confirm Booking
              </button>
            </div>
          </div>

          {/* Booked Sessions List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <UserCheckIcon size={20} className="mr-2 text-green-600" />
              Your Upcoming Sessions ({bookedSessions.length})
            </h3>
            {bookedSessions.length === 0 ? (
              <p className="text-gray-500 text-sm">You have no upcoming tutoring sessions scheduled.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {bookedSessions.map((session) => (
                  <div key={session.id} className="py-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">{session.tutorName}</h4>
                      <p className="text-xs text-gray-500">{session.subject}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-800">{session.date}</div>
                      <div className="text-xs text-blue-600 font-semibold">{session.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: LIVE TUTOR CHAT */}
      {activeTab === "chat" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="border-b border-gray-200 p-4 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src={selectedTutor?.avatar || tutors[0].avatar}
                alt={selectedTutor?.name || tutors[0].name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover mr-3 border border-white"
              />
              <div>
                <h3 className="font-bold text-gray-800">
                  {selectedTutor?.name || tutors[0].name}
                </h3>
                <p className="text-xs text-green-600 font-medium">● Online • Ready to help</p>
              </div>
            </div>
            <span className="text-xs text-gray-500 bg-white px-2.5 py-1 rounded-full border border-gray-200">
              Active Peer Room
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "tutor" && (
                  <Image
                    src={selectedTutor?.avatar || tutors[0].avatar}
                    alt="Tutor"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover mr-2 mb-1"
                  />
                )}
                <div
                  className={`max-w-[75%] rounded-2xl p-3.5 ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none shadow-sm"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <span
                    className={`text-[10px] mt-1 block ${
                      msg.sender === "user" ? "text-blue-100" : "text-gray-400"
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3 bg-white flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask a question about your study materials..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-grow px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <button
              type="submit"
              disabled={!messageInput.trim()}
              className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-1.5"
            >
              <span className="text-sm font-medium hidden sm:inline">Send</span>
              <SendIcon size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TutoringPage;
