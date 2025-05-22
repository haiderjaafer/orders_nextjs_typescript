import type { Metadata } from "next";
import { Noto_Sans_Arabic } from "next/font/google";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Providers } from "./providers";

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
      <main className="container py-1">
        
        <Providers>{children}</Providers>
        
        
        </main>
       {/* Toast container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </body>
  </html>
  );
}

//npm install @tanstack/react-table --legacy-peer-deps
// npm install --force
