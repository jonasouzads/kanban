// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/board/Header";
import { AppProvider } from "@/app/contexts/AppContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wizebot",
  description: "Wizebot Kanban",
};

// app/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} flex flex-col min-h-screen bg-white`}>
        <Header />
        <main className="flex-1 overflow-hidden bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}