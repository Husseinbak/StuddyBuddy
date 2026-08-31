import React from "react";
import Link from "next/link";
import { ArrowLeftIcon, BrainIcon } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12">
        <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-8">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <BrainIcon size={20} />
            </div>
            <span className="text-xl font-bold text-gray-800">StuddyBuddy</span>
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <ArrowLeftIcon size={16} className="mr-1" />
            Back to Sign Up
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: August 2026</p>

        <div className="space-y-6 text-gray-700 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when creating an account (such as your name, username, email, institution, and course of study), documents you upload for study analysis, and quiz attempt metrics.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">2. How We Use Your Information</h2>
            <p>
              We use the collected information to personalize your learning analytics, generate document-grounded quizzes, calculate leaderboard rankings, and facilitate peer learning sessions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Data Protection and Document Privacy</h2>
            <p>
              Uploaded course materials are processed solely for the purpose of generating quizzes for your study sessions. We do not sell your personal data or uploaded materials to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Your Rights</h2>
            <p>
              You may update your profile details at any time in your Account Settings or request deletion of your account and study records.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
