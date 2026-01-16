import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VisionPath AI | Your Story, Your Future",
  description: "AI-powered strategic life planning based on your personal journey.",
};

import { AuthProvider } from "@/lib/auth-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
