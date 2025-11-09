import type { Metadata } from "next";
import { Montserrat, Nunito } from "next/font/google";
import "./globals.css";

const monstserrat = Montserrat({
  variable: "--font-monstserrat",
  subsets: ["latin"],
});
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elso Dental AI",
  description: "Dental AI Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${monstserrat.variable} ${nunito.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
