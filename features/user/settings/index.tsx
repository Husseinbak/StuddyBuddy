"use client";

import React, { useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  UserIcon,
  MailIcon,
  SchoolIcon,
  BookOpenIcon,
  ShieldCheckIcon,
  LogOutIcon,
  SaveIcon,
  CheckCircleIcon,
} from "lucide-react";

const SettingsPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    surname: user?.surname || "",
    institution: user?.institution || "",
    courseOfStudy: user?.courseOfStudy || "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    setIsSaving(true);
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        firstName: formData.firstName,
        surname: formData.surname,
        institution: formData.institution,
        courseOfStudy: formData.courseOfStudy,
        updatedAt: new Date(),
      });
      setSavedSuccess(true);
      toast.success("Profile information updated successfully!");
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.info("Signed out of your session");
      router.replace("/sign-in");
    } catch (err: any) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
        <p className="text-gray-600">
          Manage your personal profile and account preferences
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <CheckCircleIcon size={18} />
          <span>Your profile information has been saved successfully!</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold uppercase">
            {user?.firstName?.[0] || user?.username?.[0] || "U"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 capitalize">
              {user?.firstName} {user?.surname}
            </h2>
            <p className="text-sm text-gray-500">@{user?.username}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
              Student Account
            </span>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <div className="relative">
                <UserIcon
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Surname
              </label>
              <div className="relative">
                <UserIcon
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  placeholder="Surname"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <MailIcon
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg cursor-not-allowed"
                />
              </div>
              <span className="text-xs text-gray-400 mt-1 block">
                Email is managed through your authentication provider.
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                  @
                </span>
                <input
                  type="text"
                  value={user?.username || ""}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg cursor-not-allowed"
                />
              </div>
              <span className="text-xs text-gray-400 mt-1 block">
                Username cannot be changed once created.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institution
              </label>
              <div className="relative">
                <SchoolIcon
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  placeholder="University / College"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course of Study
              </label>
              <div className="relative">
                <BookOpenIcon
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  name="courseOfStudy"
                  value={formData.courseOfStudy}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
            >
              <SaveIcon size={18} className="mr-2" />
              {isSaving ? "Saving changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
          <ShieldCheckIcon size={20} className="mr-2 text-blue-600" />
          Session & Account
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Sign out of your active session on this device.
        </p>
        <button
          onClick={handleSignOut}
          className="inline-flex items-center px-4 py-2.5 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-colors"
        >
          <LogOutIcon size={18} className="mr-2" />
          Sign Out of StuddyBuddy
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
