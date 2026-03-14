"use client";

import { motion } from "framer-motion";
import { Category } from "@/data/products";
import { Cpu, MemoryStick, HardDrive, Fan, Zap, Box, CircuitBoard, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryListProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

const categories: { name: Category; icon: LucideIcon }[] = [
  { name: 'Motherboard', icon: CircuitBoard },
  { name: 'Processor', icon: Cpu },
  { name: 'RAM', icon: MemoryStick },
  { name: 'CPU Cooler', icon: Fan },
  { name: 'GPU', icon: HardDrive }, // Using HardDrive as a proxy icon for GPU if actual GPU icon isn't in lucide yet
  { name: 'Power Supply', icon: Zap },
  { name: 'Case', icon: Box },
];

export function CategoryList({ selectedCategory, onSelectCategory }: CategoryListProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isSelected = selectedCategory === cat.name;

        return (
          <button
            key={cat.name}
            onClick={() => onSelectCategory(cat.name)}
            className={cn(
              "relative px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 outline-none",
              isSelected 
                ? "text-primary shadow-[0_0_20px_rgba(0,240,255,0.15)] bg-primary/10" 
                : "text-muted hover:text-white glass hover:bg-surface-hover"
            )}
          >
            {isSelected && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 rounded-xl border border-primary/50 bg-primary/5"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon className="w-5 h-5 relative z-10" />
            <span className="font-medium text-sm relative z-10">{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
