import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ClientProviders from "./ClientProviders";
import Twitterlayout from "./components/FeedCard/Layout/TwitterLayout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const inter = Inter({
  subsets: ["latin"]
})

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Twitter Clone",
  description: "Created by Harsh Walia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProviders>
          <Twitterlayout>
            <div className={inter.className}>
              <Toaster />
              {children}
            </div>
          </Twitterlayout>
        </ClientProviders>
      </body>
    </html>
  );
}