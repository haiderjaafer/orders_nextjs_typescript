import type { Metadata } from "next";
import { Noto_Sans_Arabic } from "next/font/google";


import "./globals.css";
import { Navbar } from "@/components/Navbar";

const arabic = Noto_Sans_Arabic({ 
  subsets: ["arabic"],
  variable: "--font-arabic",
  weight: ["400", "500", "600", "700"] // Include needed weights
});

export const metadata: Metadata = {
  title: "نظام متابعة اطلبيات",
  description: "تطبيق مع دعم كامل للغة العربية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
    <body className={`${arabic.variable} font-sans`}>
      <Navbar />
      <main className="container py-1">{children}</main>
    </body>
  </html>
  );
}

//npm install @tanstack/react-table --legacy-peer-deps
