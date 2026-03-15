"use client";

import { useState, useMemo, useEffect } from "react";
import { Category, products } from "@/data/products";
import { CategoryList } from "@/components/configurator/CategoryList";
import { ProductGrid } from "@/components/configurator/ProductGrid";
import { CartSummary } from "@/components/configurator/CartSummary";
import { useCartStore } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export function BuildInterface() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("Motherboard");
  const { items } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredProducts = products.filter(
    (product) => product.category === selectedCategory
  );

  const compatibilityWarning = useMemo(() => {
    if (!mounted) return null;
    const cpu = items.find(i => i.category === 'Processor');
    const mobo = items.find(i => i.category === 'Motherboard');

    if (cpu && mobo) {
      const isIntelCpu = cpu.name.toLowerCase().includes('intel');
      const isAmdCpu = cpu.name.toLowerCase().includes('amd');
      const isLga1700 = mobo.specs?.Socket === 'LGA 1700';
      const isAm5 = mobo.specs?.Socket === 'AM5';

      if (isIntelCpu && isAm5) return "Socket Mismatch: The selected Intel Processor requires an LGA 1700 Motherboard, but you selected an AM5 Motherboard.";
      if (isAmdCpu && isLga1700) return "Socket Mismatch: The selected AMD Processor requires an AM5 Motherboard, but you selected an LGA 1700 Motherboard.";
    }
    
    // Add additional checks here if needed in the future

    return null;
  }, [items, mounted]);

  return (
    <div className="flex flex-col gap-6">
      <AnimatePresence>
        {compatibilityWarning && (
          <motion.div
            key="compat-warning"
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            className="overflow-hidden"
          >
            <div className="glass bg-red-500/10 border-red-500/30 p-4 rounded-xl flex items-start gap-4 shadow-[0_4px_30px_rgba(239,68,68,0.1)]">
              <div className="p-2 bg-red-500/20 rounded-lg shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h4 className="text-red-500 font-bold mb-1">Compatibility Issue Detected</h4>
                <p className="text-sm text-red-200/80 leading-relaxed">{compatibilityWarning}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column: Configurator Options */}
        <div className="flex-1 w-full min-w-0">
          <CategoryList 
            selectedCategory={selectedCategory} 
            onSelectCategory={setSelectedCategory} 
          />
          
          <ProductGrid products={filteredProducts} />
        </div>

        {/* Right Column: Cart Summary — sticky only on large screens */}
        <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-24">
          <CartSummary />
        </div>
      </div>
    </div>
  );

}
