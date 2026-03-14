"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Zap, Target, Cpu } from "lucide-react";
import { Hero3D } from "@/components/Hero3D";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 200, damping: 20 } },
  };

  return (
    <>
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-4 min-h-[calc(100vh-64px)] pb-24 pt-12">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        className="z-10 w-full max-w-5xl mx-auto text-center flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border-primary/20">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium tracking-wide uppercase text-white/80">Next-Gen PC Building Experience</span>
        </motion.div>

        <motion.h1 
          variants={itemVariants} 
          className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/40 leading-tight"
        >
          Forge Your <br className="hidden md:block" /> Ultimate Machine
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          The Assembly is a boutique hardware configurator. Select premium parts, ensure compatibility, and build a masterpiece tailored precisely to your needs.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md mx-auto">
          <Link href="/build" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto group relative overflow-hidden">
              <span className="relative z-10 flex items-center">
                Start Building <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto hover:border-white/20">
              Sign In & Save
            </Button>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="glass p-6 rounded-2xl border-white/5 hover:border-primary/20 transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Cpu className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Premium Selection</h3>
            <p className="text-sm text-muted">Curated components from top-tier manufacturers ensuring elite performance.</p>
          </div>
          <div className="glass p-6 rounded-2xl border-white/5 hover:border-secondary/20 transition-colors">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Guaranteed Compatibility</h3>
            <p className="text-sm text-muted">Our smart algorithm ensures your selected parts work flawlessly together.</p>
          </div>
          <div className="glass p-6 rounded-2xl border-white/5 hover:border-blue-500/20 transition-colors">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Instant Checkout</h3>
            <p className="text-sm text-muted">Seamlessly review your build and securely process your order in seconds.</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
    <Hero3D />
    </>
  );
}
