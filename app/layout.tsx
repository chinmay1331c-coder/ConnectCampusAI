// app/layout.tsx

import "./globals.css";
import type { Metadata } from "next";
import GlobalAIChatbot from "@/components/GlobalAIChatbot";

export const metadata: Metadata = {
  title: "CampusConnectAI",
  description:
    "AI-powered startup collaboration platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f4f8ff] text-[#07162b]">
        {children}

        {/* GLOBAL AI CHATBOT */}
        <GlobalAIChatbot />
      </body>
    </html>
  );
}