import React, { useState } from "react";
import {
  BookOpenIcon,
  BrainIcon,
  UploadIcon,
  UsersIcon,
  BarChartIcon,
  TrophyIcon,
  MenuIcon,
  XIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const navItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: <BookOpenIcon size={20} />,
    },
    {
      path: "/quiz",
      label: "Quizzes",
      icon: <BrainIcon size={20} />,
    },
    {
      path: "/upload",
      label: "Uploads",
      icon: <UploadIcon size={20} />,
    },
    {
      path: "/tutoring",
      label: "Tutoring",
      icon: <UsersIcon size={20} />,
    },
    {
      path: "/analytics",
      label: "Analytics",
      icon: <BarChartIcon size={20} />,
    },
    {
      path: "/leaderboard",
      label: "Leaderboard",
      icon: <TrophyIcon size={20} />,
    },
  ];
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-20 lg:w-64 bg-white border-r border-gray-200 shadow-sm">
        {/* Logo - Desktop Sidebar */}
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start p-4 border-b border-gray-200"
        >
          <div className="bg-blue-600 text-white p-1.5 rounded-lg">
            <BrainIcon size={20} />
          </div>
          <span className="hidden lg:block text-xl font-semibold text-gray-800 ml-2">
            SmartStudy
          </span>
        </Link>
        {/* Navigation Items */}
        <nav className="flex-grow py-6">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex flex-col items-center lg:flex-row lg:items-center lg:px-6 py-3 hover:bg-gray-50 transition-colors ${
                    pathname === item.path
                      ? "text-blue-600 border-r-4 lg:border-r-0 lg:border-l-4 border-blue-600 bg-blue-50"
                      : "text-gray-600"
                  }`}
                >
                  <div className="flex flex-col items-center lg:flex-row">
                    <div className="p-1">{item.icon}</div>
                    <span className="text-xs mt-1 lg:text-base lg:mt-0 lg:ml-3">
                      {item.label}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <div className="flex flex-col flex-grow">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            {/* Logo - Mobile only */}
            <Link href="/" className="flex md:hidden items-center space-x-2">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <BrainIcon size={20} />
              </div>
              <span className="text-xl font-semibold text-gray-800">
                SmartStudy
              </span>
            </Link>
            <div className="flex items-center space-x-3 ml-auto">
              <button className="p-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
                <UserIcon size={20} />
              </button>
              {/* Mobile menu button */}
              <button
                className="md:hidden p-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? (
                  <XIcon size={20} />
                ) : (
                  <MenuIcon size={20} />
                )}
              </button>
            </div>
          </div>
        </header>
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg border-b border-gray-200">
            <nav className="container mx-auto py-3 px-4">
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`flex items-center space-x-3 p-2 rounded-md ${
                        location.pathname === item.path
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 py-6">
          {children}
        </main>
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            © 2023 SmartStudy. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};
export default Layout;
