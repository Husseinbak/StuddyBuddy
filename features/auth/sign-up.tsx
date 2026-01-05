"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { EyeIcon, EyeOffIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createUserProfile, isUsernameTaken } from "@/lib/firestore";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    middleName: "",
    institution: "",
    username: "",
    courseOfStudy: "",
    password: "",
    confirmPassword: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    setIsLoading(true);
    try {
      if (await isUsernameTaken(formData.username)) {
        throw new Error("Username already taken");
      }

      const cred = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await createUserProfile(cred.user.uid, {
        email: formData.email,
        username: formData.username.toLowerCase(),
        firstName: formData.firstName,
        surname: formData.surname,
        middleName: formData.middleName || null,
        institution: formData.institution,
        courseOfStudy: formData.courseOfStudy,
        createdAt: new Date(),
      });

      router.push("/dashboard");
    } catch (err: any) {
      alert(err.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl relative z-10">
      {/* Logo and header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Create your account
        </h1>
        <p className="text-blue-100">
          Join thousands of students improving their learning
        </p>
      </div>
      {/* Signup card */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
          delay: 0.1,
        }}
        className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name fields row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                First Name <span className="text-red-500">*</span>
              </label>
              <motion.input
                whileFocus={{
                  scale: 1.01,
                }}
                transition={{
                  duration: 0.2,
                }}
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white"
                placeholder="John"
                required
              />
            </div>
            {/* Surname */}
            <div>
              <label
                htmlFor="surname"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Surname <span className="text-red-500">*</span>
              </label>
              <motion.input
                whileFocus={{
                  scale: 1.01,
                }}
                transition={{
                  duration: 0.2,
                }}
                id="surname"
                name="surname"
                type="text"
                value={formData.surname}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white"
                placeholder="Doe"
                required
              />
            </div>
          </div>
          {/* Middle Name */}
          <div>
            <label
              htmlFor="middleName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Middle Name{" "}
              <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <motion.input
              whileFocus={{
                scale: 1.01,
              }}
              transition={{
                duration: 0.2,
              }}
              id="middleName"
              name="middleName"
              type="text"
              value={formData.middleName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white"
              placeholder="Michael"
            />
          </div>
          {/* Institution and Course row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Institution */}
            <div>
              <label
                htmlFor="institution"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Institution <span className="text-red-500">*</span>
              </label>
              <motion.input
                whileFocus={{
                  scale: 1.01,
                }}
                transition={{
                  duration: 0.2,
                }}
                id="institution"
                name="institution"
                type="text"
                value={formData.institution}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white"
                placeholder="University of Example"
                required
              />
            </div>
            {/* Course of Study */}
            <div>
              <label
                htmlFor="courseOfStudy"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Course of Study <span className="text-red-500">*</span>
              </label>
              <motion.input
                whileFocus={{
                  scale: 1.01,
                }}
                transition={{
                  duration: 0.2,
                }}
                id="courseOfStudy"
                name="courseOfStudy"
                type="text"
                value={formData.courseOfStudy}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white"
                placeholder="Computer Science"
                required
              />
            </div>
          </div>
          {/* Username */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <motion.input
              whileFocus={{
                scale: 1.01,
              }}
              transition={{
                duration: 0.2,
              }}
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white"
              placeholder="johndoe@gmail.com"
              required
            />
          </div>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username <span className="text-red-500">*</span>
            </label>
            <motion.input
              whileFocus={{
                scale: 1.01,
              }}
              transition={{
                duration: 0.2,
              }}
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white"
              placeholder="johndoe"
              required
            />
          </div>
          {/* Password fields row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <motion.input
                  whileFocus={{
                    scale: 1.01,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    <EyeOffIcon size={20} />
                  ) : (
                    <EyeIcon size={20} />
                  )}
                </button>
              </div>
            </div>
            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <motion.input
                  whileFocus={{
                    scale: 1.01,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon size={20} />
                  ) : (
                    <EyeIcon size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>
          {/* Terms and conditions */}
          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              required
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              I agree to the{" "}
              <Link
                href="/terms"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Privacy Policy
              </Link>
            </label>
          </div>
          {/* Submit button */}
          <motion.button
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating account...</span>
              </div>
            ) : (
              <>
                <span>Create account</span>
                <ArrowRightIcon size={18} />
              </>
            )}
          </motion.button>
        </form>
        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or sign up with</span>
          </div>
        </div>
        {/* Social signup buttons */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
            type="button"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">Google</span>
          </motion.button>
          <motion.button
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
            type="button"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">GitHub</span>
          </motion.button>
        </div>
      </motion.div>
      {/* Login link */}
      <motion.p
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
          delay: 0.3,
        }}
        className="text-center mt-6 text-white"
      >
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="text-blue-200 hover:text-white font-medium transition-colors"
        >
          Sign in
        </Link>
      </motion.p>
    </div>
  );
};
export default SignupPage;
