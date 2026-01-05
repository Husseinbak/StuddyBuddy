import { BrainIcon } from "lucide-react";
import Link from "next/link";
// import { motion } from "framer-motion";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative flex flex-col p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
            filter: "blur(20px)",
            transform: "scale(1.1)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-indigo-900/75 to-purple-900/80" />
      </div>
      <div className="w-full max-w-md relative z-10">
        {/* Logo and back to home */}
        <div className="text-left mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center space-x-2 mb-6"
          >
            <div className="bg-white text-blue-600 p-2 rounded-lg shadow-lg">
              <BrainIcon size={28} />
            </div>
            <span className="text-2xl font-bold text-white">StuddyBuddy</span>
          </Link>
        </div>
      </div>
      <div className=" relative z-10 items-center justify-center flex">
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
