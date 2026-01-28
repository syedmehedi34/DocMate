import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import LayoutWrapper from "./LayoutWrapper";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DocMate",
  description: "Your smart medical documentation assistant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        cz-shortcut-listen="true"
      >
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
