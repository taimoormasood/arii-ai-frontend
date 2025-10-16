import "./globals.css";

import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import type React from "react";

// import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import AppProvider from "@/providers/app-provider";

const urbanist = Urbanist({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Rental Guru - Property Management Platform",
  description: "The world's leading property management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={urbanist.className}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
