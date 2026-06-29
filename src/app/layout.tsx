import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "Elrulo Breakthrough Padel Cup",
  description: "17ème Etape FTT - El Rulo Padel Club, Monastir",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-rullo-dark text-white">
        {children}
      </body>
    </html>
  );
}
