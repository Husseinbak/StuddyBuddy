import { BrainIcon } from "lucide-react";
import Link from "next/link";

const Header = ({ heroInView }: { heroInView: boolean }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div
        className={`container mx-auto px-2 py-6 flex justify-between items-center ${
          heroInView ? "" : "backdrop-blur-md"
        }`}
      >
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <BrainIcon size={24} />
          </div>
          <span
            className={`text-xl font-bold ${
              heroInView ? "text-white" : "text-gray-600"
            }`}
          >
            SmartStudy
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <Link
            href="/dashboard"
            className={`font-medium ${
              heroInView ? "text-white" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Features
          </Link>
          <Link
            href="/sign-in"
            className={`font-medium ${
              heroInView ? "text-white" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
