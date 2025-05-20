import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Canvas - Whiteboard Collaboration App",
  description: "Create a room and start drawing live or join other room and watch others drawing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen xl:h-screen xl:flex xl:flex-col`}>
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}
