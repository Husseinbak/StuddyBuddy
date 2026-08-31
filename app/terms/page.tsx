import React from "react";
import Link from "next/link";
import { ArrowLeftIcon, BrainIcon } from "lucide-react";

export default function TermsPage() {
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

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: August 2026</p>

        <div className="space-y-6 text-gray-700 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing and using StuddyBuddy, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Educational Use and AI Content</h2>
            <p>
              StuddyBuddy provides AI-powered quiz generation and active recall assistance based on materials you upload. You are responsible for ensuring that any uploaded materials do not infringe on intellectual property or institutional honour codes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Academic Integrity & Proctoring</h2>
            <p>
              When taking quizzes and weekly leaderboard assessments, users agree to uphold academic integrity. Browser tracking, focus events, and attempt restrictions are in place to ensure authentic assessment metrics.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">4. User Accounts</h2>
            <p>
              You must provide accurate information when registering. You are responsible for maintaining the confidentiality of your account credentials.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
