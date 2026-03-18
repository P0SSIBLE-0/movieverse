import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "./globals.css";
import AppShell from "@/components/AppShell";
import Providers from "@/components/Providers";
import PwaRegistration from "@/components/pwa/PwaRegistration";

const APP_NAME = "MovieVerse";
const APP_DESCRIPTION =
  "Browse trending movies and shows, explore cast details, and manage your watchlist.";

function getMetadataBase() {
  const fallbackUrl = "http://localhost:3000";
  const rawUrl = process.env.NEXT_PUBLIC_APP_URL || fallbackUrl;

  try {
    return new URL(rawUrl);
  } catch {
    return new URL(fallbackUrl);
  }
}

export const viewport: Viewport = {
  themeColor: "#101010",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  applicationName: APP_NAME,
  title: APP_NAME,
  description: APP_DESCRIPTION,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_NAME,
  },
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [
      {
        url: "/open-graph.png",
        width: 1200,
        height: 630,
        alt: APP_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: ["/open-graph.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <PwaRegistration />
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
