"use client";

import { ReactNode } from "react";

interface SidebarNavigationProps {
  children: ReactNode;
  open: boolean; // added
}

const SidebarNavigation = ({ children, open }: SidebarNavigationProps) => {
  return (
    <section
      className={`
        fixed bottom-0 left-0 h-full w-44 bg-white z-40
        flex-col items-center pt-12 overflow-x-hidden
        transform transition-transform duration-300 ease-in-out

        /* Desktop: always visible */
        md:flex md:translate-x-0

        /* Mobile: drawer behavior */
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {children}
    </section>
  );
};

export default SidebarNavigation;
