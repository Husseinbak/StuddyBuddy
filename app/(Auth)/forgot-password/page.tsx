"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MailIcon, ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon } from "lucide-react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      setIsSent(true);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setErrorMessage("No account exists with this email address.");
        toast.error("No account found with this email address.");
      } else if (err.code === "auth/invalid-email") {
        setErrorMessage("Please enter a valid email address.");
        toast.error("Invalid email address format.");
      } else {
        const msg = err.message || "Failed to send reset email. Please try again.";
        setErrorMessage(msg);
        toast.error(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md relative z-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
        <p className="text-blue-100">
          Enter your email to receive instructions to reset your password
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20"
      >
        {isSent ? (
          <div className="text-center py-4">
            <div className="mx-auto w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircleIcon size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Check your email</h2>
            <p className="text-gray-600 mb-6 text-sm">
              We have sent a password reset link to <strong className="text-gray-800">{email}</strong>. Please check your inbox and follow the instructions.
            </p>
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <ArrowLeftIcon size={18} className="mr-2" />
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                {errorMessage}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <MailIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Sending reset link...</span>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRightIcon size={18} />
                </>
              )}
            </motion.button>

            <div className="text-center pt-2">
              <Link
                href="/sign-in"
                className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeftIcon size={16} className="mr-1" />
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
