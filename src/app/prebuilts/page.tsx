"use client";

import { motion } from "framer-motion";
import { Metadata } from "next";
import { ShoppingCart, Zap, Cpu, Gamepad2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/useCartStore";

const prebuilts = [
  {
    id: "pb-001",
    name: "Apex Dominator",
    tagline: "Ultimate 4K Gaming Powerhouse",
    icon: <Gamepad2 className="w-8 h-8" />,
    color: "primary",
    specs: [
      { label: "CPU", value: "AMD Ryzen 9 7950X" },
      { label: "GPU", value: "NVIDIA RTX 4090 24GB" },
      { label: "RAM", value: "64GB DDR5 6000MHz" },
      { label: "Storage", value: "2TB NVMe Gen5" },
      { label: "Cooler", value: "360mm AIO Liquid" },
      { label: "PSU", value: "1000W 80+ Platinum" },
    ],
    price: 549999,
    badge: "Best Seller",
  },
  {
    id: "pb-002",
    name: "Velocity Pro",
    tagline: "High-Performance 1440p Gaming Rig",
    icon: <Zap className="w-8 h-8" />,
    color: "secondary",
    specs: [
      { label: "CPU", value: "Intel Core i7-14700K" },
      { label: "GPU", value: "NVIDIA RTX 4070 Ti" },
      { label: "RAM", value: "32GB DDR5 5600MHz" },
      { label: "Storage", value: "1TB NVMe Gen4" },
      { label: "Cooler", value: "240mm AIO Liquid" },
      { label: "PSU", value: "750W 80+ Gold" },
    ],
    price: 289999,
    badge: "Most Popular",
  },
  {
    id: "pb-003",
    name: "Studio Titan",
    tagline: "Creator & Workstation Beast",
    icon: <Cpu className="w-8 h-8" />,
    color: "blue-400",
    specs: [
      { label: "CPU", value: "AMD Threadripper 7960X" },
      { label: "GPU", value: "NVIDIA RTX 4080 Super" },
      { label: "RAM", value: "128GB DDR5 ECC" },
      { label: "Storage", value: "4TB NVMe RAID" },
      { label: "Cooler", value: "Custom Water Loop" },
      { label: "PSU", value: "1200W 80+ Titanium" },
    ],
    price: 749999,
    badge: "Pro Pick",
  },
  {
    id: "pb-004",
    name: "Entry Striker",
    tagline: "1080p Competitive Gaming Value Build",
    icon: <Briefcase className="w-8 h-8" />,
    color: "green-400",
    specs: [
      { label: "CPU", value: "AMD Ryzen 5 7600X" },
      { label: "GPU", value: "NVIDIA RTX 4060 Ti" },
      { label: "RAM", value: "16GB DDR5 5200MHz" },
      { label: "Storage", value: "500GB NVMe Gen4" },
      { label: "Cooler", value: "Tower Air Cooler" },
      { label: "PSU", value: "650W 80+ Bronze" },
    ],
    price: 129999,
    badge: "Best Value",
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  primary: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/30 hover:border-primary/60", glow: "drop-shadow-[0_0_12px_rgba(0,240,255,0.5)]" },
  secondary: { bg: "bg-secondary/10", text: "text-secondary", border: "border-secondary/30 hover:border-secondary/60", glow: "drop-shadow-[0_0_12px_rgba(176,38,255,0.5)]" },
  "blue-400": { bg: "bg-blue-400/10", text: "text-blue-400", border: "border-blue-400/30 hover:border-blue-400/60", glow: "drop-shadow-[0_0_12px_rgba(96,165,250,0.5)]" },
  "green-400": { bg: "bg-green-400/10", text: "text-green-400", border: "border-green-400/30 hover:border-green-400/60", glow: "drop-shadow-[0_0_12px_rgba(74,222,128,0.5)]" },
};

export default function PreBuiltsPage() {
  const { addItem } = useCartStore();

  const handleAddToCart = (pb: (typeof prebuilts)[0]) => {
    addItem({
      id: pb.id,
      name: pb.name,
      price: pb.price,
      category: "Processor" as any, // Pre-Builts don't map to a single category
      specs: Object.fromEntries(pb.specs.map((s) => [s.label, s.value])),
      description: pb.tagline,
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 border-primary/20">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium tracking-wide uppercase text-white/80">
            Expert-Curated Machines
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">
          Pre-Built Systems
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          Don't want to configure from scratch? Our experts have hand-picked the best component combinations for every use case.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {prebuilts.map((pb, i) => {
          const c = colorMap[pb.color];
          return (
            <motion.div
              key={pb.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
              className={`glass rounded-2xl p-6 border ${c.border} transition-colors group`}
            >
              <div className="flex items-start justify-between mb-5">
                <div className={`p-3 rounded-xl ${c.bg} ${c.text} ${c.glow}`}>
                  {pb.icon}
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${c.bg} ${c.text}`}>
                  {pb.badge}
                </span>
              </div>

              <h2 className="text-2xl font-black text-white mb-1">{pb.name}</h2>
              <p className={`text-sm font-medium mb-5 ${c.text}`}>{pb.tagline}</p>

              <div className="space-y-2 mb-6">
                {pb.specs.map((s) => (
                  <div key={s.label} className="flex justify-between text-sm">
                    <span className="text-muted">{s.label}</span>
                    <span className="text-white/80 font-medium">{s.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div>
                  <p className="text-xs text-muted mb-1">Starting at</p>
                  <p className={`text-2xl font-black ${c.text}`}>
                    ₹{pb.price.toLocaleString("en-IN")}
                  </p>
                </div>
                <Button
                  variant="primary"
                  className="flex items-center gap-2"
                  onClick={() => handleAddToCart(pb)}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
