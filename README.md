# Study Buddy – Frontend

Study Buddy is an AI-powered quiz platform that helps students generate and practice multiple-choice questions from their course materials.  
This repository contains the **frontend application**, delivering an interactive and analytics-driven learning experience.

---

## 🚀 Overview

The Study Buddy frontend provides AI-generated quizzes from uploaded materials, three difficulty levels, weekly leaderboard-level challenges, detailed performance analytics, course-based quiz management, and smart attempt tracking with structured restrictions.

It connects to the backend API for authentication, quiz generation, submissions, reporting, and leaderboard management.

---

## 🧠 Core Features

### AI Quiz Generation
Users can upload course materials and automatically generate MCQs categorized by difficulty level.

### Difficulty Levels
Quizzes are structured into Easy, Medium, and Hard levels. Attempt limits are enforced per level to encourage progressive mastery, and users are limited to **three quiz sets per difficulty per course**.

---

### 🏆 Leaderboard-Level Quiz

Each course includes a fixed-question leaderboard quiz available once per week. Only one leaderboard quiz exists per course, and rankings are based strictly on first-attempt scores. The top 20 scores are displayed for competitive ranking.

---

### 📊 Performance Reports

Each course provides analytics per difficulty level, including total attempts, average score, highest score, overall success rate, total time spent, first attempt versus most recent attempt comparison, improvement rate, and number of completed quizzes.

---

## 🏗 Tech Stack

- React / Next.js  
- TypeScript   
- ReactQuery
- Axios  
  
