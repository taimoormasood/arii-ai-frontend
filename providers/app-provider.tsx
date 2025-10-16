"use client";

import type React from "react";
import { Toaster } from "react-hot-toast";

import { ThemeProvider } from "@/components/theme-provider";
import { CustomModal } from "@/components/ui/custom-modal";
import { AuthProvider } from "@/lib/contexts/auth-context";
import ReactQueryProvider from "@/providers/query-client-provider";
import { customModalRef } from "@/utils/modal-config";

export default function AppProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <CustomModal ref={customModalRef} />
        </ThemeProvider>
      </AuthProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </ReactQueryProvider>
  );
}
