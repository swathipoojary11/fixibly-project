import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppStore } from "./context/AppStore";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = { title: "FieldFlow", description: "Field Service Management" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AppStore>{children}</AppStore>
      </body>
    </html>
  );
}
