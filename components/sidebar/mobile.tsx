// import Link from "next/link";
// import navItems from "./nav-items";
// import { BrainIcon, MenuIcon, UserIcon, XIcon } from "lucide-react";

// interface MobileSidebarProps {
//   isMobileMenuOpen: boolean;
//   toggleDrawer: () => void;
// }

// const MobileSidebar = ({
//   toggleDrawer,
//   isMobileMenuOpen,
// }: MobileSidebarProps) => {
//   return (
//     <div className="container mx-auto px-4 py-3 flex justify-between items-center">
//       <Link href="/dashboard" className="flex md:hidden items-center space-x-2">
//         <div className="bg-blue-600 text-white p-1.5 rounded-lg">
//           <BrainIcon size={20} />
//         </div>
//         <span className="text-xl font-semibold text-gray-800">SmartStudy</span>
//       </Link>
//       <div className="flex items-center space-x-3 ml-auto">
//         <button className="p-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
//           <UserIcon size={20} />
//         </button>
//         {/* Mobile menu button */}
//         <button
//           className="md:hidden p-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
//           onClick={toggleDrawer}
//         >
//           {isMobileMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
//         </button>
//       </div>
//       {isMobileMenuOpen && (
//         <div className="md:hidden bg-white shadow-lg border-b border-gray-200">
//           <nav className="container mx-auto py-3 px-4">
//             <ul className="space-y-3">
//               {navItems.map((item) => (
//                 <li key={item.path}>
//                   <Link
//                     href={item.path}
//                     className={`flex items-center space-x-3 p-2 rounded-md ${
//                       location.pathname === item.path
//                         ? "bg-blue-50 text-blue-600 font-medium"
//                         : "text-gray-700 hover:bg-gray-100"
//                     }`}
//                     onClick={() => toggleDrawer()}
//                   >
//                     {item.icon}
//                     <span>{item.label}</span>
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </nav>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MobileSidebar;
