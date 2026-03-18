"use client";

import { useEffect } from "react";

const SERVICE_WORKER_PATH = "/sw.js";

function canRegisterServiceWorker() {
  if (typeof window === "undefined") {
    return false;
  }

  const isSecureContext =
    window.location.protocol === "https:" ||
    window.location.hostname === "localhost";

  return "serviceWorker" in navigator && isSecureContext;
}

export default function PwaRegistration() {
  useEffect(() => {
    if (!canRegisterServiceWorker()) {
      return;
    }

    void navigator.serviceWorker.register(SERVICE_WORKER_PATH);
  }, []);

  return null;
}
