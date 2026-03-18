'use client';

import React from "react";
import { AppProvider } from "../context/AppContext";
import { WatchlistProvider } from "../context/WatchlistContext";

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <AppProvider>
      <WatchlistProvider>{children}</WatchlistProvider>
    </AppProvider>
  );
}
