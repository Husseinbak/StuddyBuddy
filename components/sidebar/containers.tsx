import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface navItemContainerProps {
  item: { path: string; label: string; icon: React.ReactNode };
}

export const NavItemContainer = ({ item }: navItemContainerProps) => {
  const pathname = usePathname();
  return (
    <nav className="flex-grow">
      <ul className="space-y-2">
        <li key={item.path}>
          <Link
            href={item.path}
            className={`flex flex-col items-center lg:flex-row lg:items-center lg:px-6 py-3 hover:bg-gray-50 transition-colors ${
              pathname === item.path
                ? "text-blue-600 border-r-4 lg:border-r-0 lg:border-l-4 border-blue-600 bg-blue-50"
                : "text-gray-600"
            }`}
          >
            <div className="flex justify-center flex-row">
              <div className="p-1">{item.icon}</div>
              <span className="text-xs mt-1 lg:text-base lg:mt-0 lg:ml-3">
                {item.label}
              </span>
            </div>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export const NavItemsContainer = ({ children }: { children: ReactNode }) => {
  return (
    <nav className="flex flex-col pt-12">
      <ul className="space-y-2">{children}</ul>
    </nav>
  );
};
