"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { EyeIcon, EyeOffIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { createUserProfile, isUsernameTaken } from "@/lib/firestore";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "sonner";

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

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const userRef = doc(db, "users", res.user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const nameParts = (res.user.displayName || "Student").split(" ");
        await createUserProfile(res.user.uid, {
          email: res.user.email,
          username: (res.user.displayName || "student")
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "_"),
          firstName: nameParts[0] || "Student",
          surname: nameParts.slice(1).join(" ") || "",
          middleName: null,
          institution: "University",
          courseOfStudy: "General Studies",
          createdAt: new Date(),
        });
      }

      toast.success("Account created successfully with Google!");
      router.push("/dashboard");
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        console.error("Google sign-up error:", err);
        toast.error(err.message || "Google sign-up failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match! Please re-type your password.");
      return;
    }
    setIsLoading(true);
    try {
      if (await isUsernameTaken(formData.username)) {
        toast.error("That username is already taken. Please choose another.");
        setIsLoading(false);
        return;
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

      toast.success("Account created successfully! Welcome to StuddyBuddy.");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Signup failed. Please try again.");
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
        <div>
          <motion.button
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
            type="button"
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white shadow-xs text-sm font-medium text-gray-700 disabled:opacity-50"
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
            <span>Sign up with Google</span>
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
