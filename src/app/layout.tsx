import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";
import { LenisProvider } from "@/components/LenisProvider";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-sans" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "ASMBLY | Premium PC Configurator",
  description: "Build your dream PC with our premium, interactive configurator.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} dark`} style={{ colorScheme: "dark" }}>
      <body className="antialiased font-sans bg-background text-foreground min-h-screen flex flex-col">
        <AuthProvider>
          <LenisProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer />
          </LenisProvider>
        </AuthProvider>
      </body>
    </html>
  );
}



