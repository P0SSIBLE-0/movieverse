'use client';

import React, { createContext, useContext, useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

const AppShellContext = createContext({
  isSidebarOpen: false,
  openSidebar: () => {},
  closeSidebar: () => {},
  toggleSidebar: () => {},
});

export const useAppShell = () => useContext(AppShellContext);

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const value = useMemo(
    () => ({
      isSidebarOpen,
      openSidebar: () => setIsSidebarOpen(true),
      closeSidebar: () => setIsSidebarOpen(false),
      toggleSidebar: () => setIsSidebarOpen((current) => !current),
    }),
    [isSidebarOpen]
  );

  return (
    <AppShellContext.Provider value={value}>
      <div className="flex h-screen overflow-hidden bg-black text-brand-text-primary">
        <Sidebar isOpen={isSidebarOpen} onClose={value.closeSidebar} />

        <div className="flex flex-1 flex-col overflow-hidden lg:py-2 lg:pr-2">
          <main className="flex-1 overflow-y-auto scrollbar-hide bg-zinc-900 md:rounded-md lg:rounded-md">
            <div className="w-full">{children}</div>
          </main>

          <div className="lg:hidden">
            <BottomNav />
          </div>
        </div>
      </div>
    </AppShellContext.Provider>
  );
}
