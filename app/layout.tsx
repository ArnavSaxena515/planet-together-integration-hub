import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Integration Hub - Planet Together",
  description: "SAP S/4HANA ↔ Planet Together APS Integration Hub",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} bg-surface selection:bg-primary/20 antialiased`}>
        <Sidebar />
        <main className="ml-[240px] min-h-screen flex flex-col">
          <TopHeader />
          <div className="flex-1">{children}</div>
        </main>
      </body>
    </html>
  );
}
