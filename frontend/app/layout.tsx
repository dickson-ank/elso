import type React from "react";
import type { Metadata } from "next";
import { montserrat } from "@/components/ui/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elso Dental AI",
  description: "Advanced AI analysis for dental professionals",
  generator: "github.com/dickson-ank",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
