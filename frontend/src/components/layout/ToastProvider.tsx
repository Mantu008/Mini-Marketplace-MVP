"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#18181B",
          color: "#FAFAFA",
          borderRadius: "12px",
          fontSize: "14px",
        },
        success: {
          iconTheme: {
            primary: "#16A34A",
            secondary: "#FAFAFA",
          },
        },
        error: {
          iconTheme: {
            primary: "#DC2626",
            secondary: "#FAFAFA",
          },
        },
      }}
    />
  );
}
