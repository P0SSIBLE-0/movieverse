import type { Metadata } from "next";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "./globals.css";
import AppShell from "@/components/AppShell";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "MovieVerse",
  description: "Browse trending movies and shows, explore cast details, and manage your watchlist.",
  openGraph: {
    title: "MovieVerse",
    description: "Browse trending movies and shows, explore cast details, and manage your watchlist.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MovieVerse",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MovieVerse",
    description: "Browse trending movies and shows, explore cast details, and manage your watchlist.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
