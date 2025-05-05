import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Contest Tracker",
  description:
    "Track programming contests from Codeforces, CodeChef, and LeetCode",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-[#0f1115]`}
      >
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8 mt-20">
            {children}
          </main>
      </body>
    </html>
  );
}
