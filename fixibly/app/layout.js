import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppStore } from "./context/AppStore";
import { AuthProvider } from "./context/AuthContext";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "FieldFlow — Customer & Service Portal",
  description: "Home Repair & Field Service Booking Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {/* AppStore wraps operational mock data; AuthProvider manages customer profile state */}
        <AppStore>
          <AuthProvider>
            {children}
          </AuthProvider>
        </AppStore>
      </body>
    </html>
  );
}
