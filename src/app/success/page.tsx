"use client";

import { motion } from "framer-motion";
import { CheckCircle, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function SuccessPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="glass p-10 rounded-2xl max-w-md w-full text-center flex flex-col items-center gap-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center"
        >
          <CheckCircle className="w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]" />
        </motion.div>

        <div className="space-y-2">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold font-heading text-white tracking-wide"
          >
            Order Confirmed
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted text-sm"
          >
            Your premium assembled PC will be processed shortly. An email receipt will be sent to the address provided during payment.
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full pt-4 border-t border-white/10"
        >
          <Link href="/" className="block w-full">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <Home className="w-4 h-4" /> Return Home
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
