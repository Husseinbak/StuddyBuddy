"use client";

import React, { useState } from "react";
import {
  NavItemContainer,
  NavItemsContainer,
} from "@/components/sidebar/containers";
import Navbar from "@/components/navbar";
import navItems from "@/components/sidebar/nav-items";
import SidebarNavigation from "@/components/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  // Added mobile drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-dvh overflow-hidden md:ml-44 mt-16 relative">
      {/* === Sidebar (Desktop + Mobile Drawer) === */}
      <SidebarNavigation open={isMobileMenuOpen}>
        <NavItemsContainer>
          {navItems.map((item) => (
            <NavItemContainer item={item} key={item.path} />
          ))}
        </NavItemsContainer>
      </SidebarNavigation>

      {/* === Mobile Backdrop === */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* === Main Content === */}
      <div className="flex flex-1 flex-col overflow-auto max-w-full bg-gray-50">
        <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <div className="py-5 pr-4 md:pr-10 pl-4 flex-1 mx-auto">
          <main className="max-w-7xl">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
