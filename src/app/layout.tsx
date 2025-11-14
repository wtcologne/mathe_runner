import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-fredoka",
});

export const metadata: Metadata = {
  title: "Mathe-Runner",
  description:
    "Fröhliches Mathe-Laufspiel für Grundschulkinder – trainiere Kopfrechnen in drei Lanes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${fredoka.variable} bg-sky-50 text-slate-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
