"use client";

import { Product } from "@/data/products";
import { useCartStore } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";
import { Plus } from "lucide-react";

interface ProductGridProps {
  products: Product[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } }
};

export function ProductGrid({ products }: ProductGridProps) {
  const addItem = useCartStore((state) => state.addItem);

  // Determine which properties to display in the quick specs overview
  const renderSpecs = (specs: Record<string, string>) => {
    return Object.entries(specs).slice(0, 4).map(([key, value]) => (
      <div key={key} className="flex justify-between items-center text-[11px] gap-2 py-0.5">
        <span className="text-muted font-medium truncate">{key}</span>
        <span className="text-white/80 truncate font-mono">{value}</span>
      </div>
    ));
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-3"
    >
      <AnimatePresence mode="popLayout">
        {products.map((product) => (
          <motion.div
            layout
            key={product.id}
            variants={itemVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="glass rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 group relative overflow-hidden transition-colors hover:bg-surface-hover/80"
          >
            {/* Subtle hover gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            {/* Primary Details */}
            <div className="flex-1 min-w-0 relative z-10 w-full sm:w-auto pr-4">
              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-primary transition-colors truncate">
                {product.name}
              </h3>
              <p className="text-xs text-muted line-clamp-2 mt-1 hidden sm:block">
                {product.description}
              </p>
            </div>

            {/* Specs List Column */}
            <div className="hidden md:flex flex-col w-56 relative z-10 border-l border-white/10 pl-4 shrink-0 justify-center">
              {renderSpecs(product.specs)}
            </div>

            {/* Price & Action */}
            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-56 relative z-10 shrink-0 sm:pl-6 sm:border-l sm:border-white/10">
              <div className="text-right flex-1 sm:flex-none">
                <p className="text-xl font-black tracking-tight whitespace-nowrap text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">
                  ₹{product.price.toLocaleString('en-IN')}
                </p>
              </div>
              <Button
                size="sm"
                className="shrink-0 shadow-none border border-primary/20 hover:border-primary/50 relative overflow-hidden group/btn"
                variant="outline"
                onClick={() => addItem(product)}
              >
                <div className="absolute inset-0 bg-primary/10 translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-300 pointer-events-none" />
                <Plus className="w-4 h-4 mr-1 sm:mr-2 z-10 relative" /> 
                <span className="z-10 relative">Add</span>
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
