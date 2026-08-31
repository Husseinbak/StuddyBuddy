"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import {
  BrainIcon,
  UserIcon,
  MenuIcon,
  LogOutIcon,
  SettingsIcon,
  ChevronDownIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import NavbarUserSettings from "./settings";
import { toast } from "sonner";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.info("Signed out successfully");
      router.replace("/sign-in");
    } catch (err) {
      console.error("Sign out error", err);
      toast.error("Failed to sign out");
    }
  };

  return (
    <nav className="fixed top-0 right-0 z-50 w-full bg-white md:p-4 py-3 px-2 flex justify-between items-center border-b border-gray-100 shadow-sm">
      <Link href="/dashboard" className="flex items-center space-x-2">
        <div className="bg-blue-600 text-white p-1.5 rounded-lg">
          <BrainIcon size={20} />
        </div>
        <span className="text-xl font-semibold text-gray-800">StuddyBuddy</span>
      </Link>

      <div className="flex items-center gap-3 md:gap-4">
        <div className="hidden md:block">
          <NavbarUserSettings />
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="relative p-1.5 rounded-full bg-blue-100 text-blue-700">
              <UserIcon size={18} />
              <span className="absolute bottom-0 right-0 block w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            <span className="font-medium text-gray-900 capitalize text-sm hidden md:inline-block">
              {user?.username || user?.firstName || "Account"}
            </span>
            <ChevronDownIcon size={14} className="text-gray-500 hidden md:inline-block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800 capitalize truncate">
                  {user?.firstName ? `${user?.firstName} ${user?.surname || ""}` : user?.username}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>

              <Link
                href="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <SettingsIcon size={16} className="mr-2 text-gray-500" />
                Settings & Profile
              </Link>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <LogOutIcon size={16} className="mr-2 text-red-500" />
                Sign Out
              </button>
            </div>
          )}
        </div>

        <button
          className="md:hidden p-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
          onClick={onMenuClick}
          aria-label="Toggle Menu"
        >
          <MenuIcon size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
