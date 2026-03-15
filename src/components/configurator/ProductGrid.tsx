"use client";

import { Product } from "@/data/products";
import { useCartStore } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";
import { Plus, Check } from "lucide-react";

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
  const { items, addItem } = useCartStore();

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
        {products.map((product) => {
          const isSelected = items.some((item) => item.id === product.id);
          
          return (
          <motion.div
            layout
            key={product.id}
            variants={itemVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className={`glass rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 group relative overflow-hidden transition-all duration-300 hover:bg-surface-hover/80 ${
              isSelected ? "border-primary/50 shadow-[0_0_15px_rgba(200,184,154,0.15)] bg-primary/5" : "border-white/10"
            }`}
          >
            {/* Subtle hover gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-r ${isSelected ? "from-primary/10 to-transparent opacity-100" : "from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100"} transition-opacity duration-500 pointer-events-none`} />
            
            {/* Product Image */}
            {product.image && (
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center p-2 z-10 transition-transform duration-300 group-hover:scale-105">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-contain filter drop-shadow-lg"
                />
              </div>
            )}

            {/* Primary Details */}
            <div className="flex-1 min-w-0 relative z-10 w-full sm:w-auto pr-4">
              <div className="flex items-center gap-2">
                <h3 className={`text-base sm:text-lg font-bold transition-colors truncate ${isSelected ? "text-primary" : "text-white group-hover:text-primary"}`}>
                  {product.name}
                </h3>
                {isSelected && (
                  <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                    Selected
                  </span>
                )}
              </div>
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
                <p className={`text-xl font-black tracking-tight whitespace-nowrap drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] ${isSelected ? "text-primary" : "text-white"}`}>
                  ₹{product.price.toLocaleString('en-IN')}
                </p>
              </div>
              <Button
                size="sm"
                className={`shrink-0 shadow-none relative overflow-hidden group/btn ${
                  isSelected 
                    ? "border-primary bg-primary/20 text-primary hover:bg-primary/30" 
                    : "border-primary/20 hover:border-primary/50 text-white"
                }`}
                variant="outline"
                onClick={() => addItem(product)}
              >
                {!isSelected && <div className="absolute inset-0 bg-primary/10 translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-300 pointer-events-none" />}
                {isSelected ? (
                  <>
                    <Check className="w-4 h-4 mr-1 sm:mr-2 z-10 relative" /> 
                    <span className="z-10 relative">Selected</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-1 sm:mr-2 z-10 relative" /> 
                    <span className="z-10 relative">Add</span>
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )})}
      </AnimatePresence>
    </motion.div>
  );
}
