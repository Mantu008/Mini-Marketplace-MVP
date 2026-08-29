"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, ReactNode } from "react";
import { AuthProvider } from "@/store/auth-store";
import ToastProvider from "@/components/layout/ToastProvider";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0, // Always consider data stale so updates are immediate
            retry: 1,
            refetchOnWindowFocus: true, // Auto refetch when switching back to tab
            refetchInterval: 3000, // Auto refetch every 3 seconds for live real-time sync across tabs
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider />
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}
