"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { BrainIcon, UserIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import NavbarUserSettings from "./settings";

interface NavbarProps {
  onMenuClick: () => void; // prop to toggle the drawer
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 right-0 z-50 w-full bg-white md:p-4 py-3 px-2 flex justify-between items-center">
      <Link href="/dashboard" className="flex items-center space-x-2">
        <div className="bg-blue-600 text-white p-1.5 rounded-lg">
          <BrainIcon size={20} />
        </div>
        <span className="text-xl font-semibold text-gray-800">StuddyBuddy</span>
      </Link>

      <div className="hidden md:flex items-center gap-4">
        <NavbarUserSettings />

        <span className="font-medium text-gray-900 capitalize">
          {user?.username}
        </span>

        <button className="relative p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 hidden md:block">
          <UserIcon size={20} />
          {/* Green dot */}
          <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
        </button>
      </div>

      <button
        className="md:hidden p-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
        onClick={onMenuClick}
      >
        <MenuIcon size={20} />
      </button>
    </nav>
  );
};

export default Navbar;
