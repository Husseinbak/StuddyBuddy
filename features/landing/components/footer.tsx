import { BrainIcon } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <BrainIcon size={24} />
            </div>
            <span className="text-xl font-bold">SmartStudy</span>
          </div>
          <div className="text-gray-400 text-sm">
            © 2023 SmartStudy. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
