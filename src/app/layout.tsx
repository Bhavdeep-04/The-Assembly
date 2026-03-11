import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"], display: 'swap', variable: '--font-sans' });

export const metadata: Metadata = {
  title: "The Assembly | Premium PC Configurator",
  description: "Build your dream PC with our premium, interactive configurator.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`} style={{ colorScheme: 'dark' }}>
      <body className="antialiased font-sans bg-background text-foreground min-h-screen flex flex-col">
          <AuthProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer />
          </AuthProvider>
      </body>
    </html>
  );
}


