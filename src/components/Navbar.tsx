"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, LogOut, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/useCartStore";
import { useState, useEffect } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const cartItemsCount = useCartStore((state) => state.getTotalItems());
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "border-b border-white/[0.06] bg-background/90 backdrop-blur-xl"
          : "border-b border-white/[0.04]"
      }`}
    >
      <div className="container mx-auto px-6 h-14 flex items-center justify-between">
        {/* Wordmark */}
        <Link href="/" className="group">
          <span className="font-display text-xl font-light tracking-[0.15em] uppercase metallic-text">
            ASMBLY
          </span>
        </Link>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {[
            { label: "Pre-Builts", href: "/prebuilts" },
            { label: "Configurator", href: "/build" },
            { label: "Support", href: "/support" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-medium tracking-[0.12em] uppercase text-white/40 hover:text-white/90 transition-colors duration-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-5">
          {session ? (
            <>
              <span className="hidden sm:block text-xs tracking-widest uppercase text-white/40">
                {session.user?.name?.split(" ")[0]}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-xs tracking-widest uppercase text-white/40 hover:text-white/80 transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Out</span>
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-xs tracking-widest uppercase text-white/40 hover:text-white/80 transition-colors hidden sm:flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              Log In
            </Link>
          )}

          {/* Cart */}
          <Link href="/build" className="relative group">
            <div className="w-8 h-8 flex items-center justify-center border border-silver/20 group-hover:border-silver/50 transition-colors duration-300">
              <ShoppingCart className="w-3.5 h-3.5 text-silver/60 group-hover:text-silver transition-colors" />
            </div>
            {mounted && cartItemsCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 bg-silver text-background text-[9px] font-bold w-4 h-4 flex items-center justify-center"
              >
                {cartItemsCount}
              </motion.span>
            )}
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
