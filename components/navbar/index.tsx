"use client";

import { BrainIcon, UserIcon, MenuIcon } from "lucide-react";
import Link from "next/link";

interface NavbarProps {
  onMenuClick: () => void; // prop to toggle the drawer
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  return (
    <nav className="fixed top-0 right-0 z-50 w-full bg-white md:p-4 py-3 px-2 flex justify-between items-center">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center space-x-2">
        <div className="bg-blue-600 text-white p-1.5 rounded-lg">
          <BrainIcon size={20} />
        </div>
        <span className="text-xl font-semibold text-gray-800">SmartStudy</span>
      </Link>

      {/* Desktop User Icon */}
      <button className="p-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 hidden md:block">
        <UserIcon size={20} />
      </button>

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
