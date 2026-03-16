"use client";

import { useState, useMemo, useEffect } from "react";
import { Category, Product, products as allProducts } from "@/data/products";
import { useCartStore } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, Cpu, MemoryStick, HardDrive, Fan, Zap, Box,
  CircuitBoard, Plus, X, Trash2, ChevronRight, CheckCircle2,
  ShoppingCart, ArrowRight, Loader2, Check, ShoppingBag, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";

const CATEGORIES: { name: Category; icon: LucideIcon; subtitle: string }[] = [
  { name: 'Motherboard',  icon: CircuitBoard, subtitle: 'The foundation of your build'  },
  { name: 'Processor',   icon: Cpu,          subtitle: 'The brain of the machine'       },
  { name: 'RAM',         icon: MemoryStick,  subtitle: 'Short-term memory for tasks'    },
  { name: 'CPU Cooler',  icon: Fan,          subtitle: 'Keep temperatures in check'     },
  { name: 'GPU',         icon: HardDrive,    subtitle: 'Drive your frame rate'         },
  { name: 'Power Supply',icon: Zap,          subtitle: 'Clean power for every component'},
  { name: 'Case',        icon: Box,          subtitle: 'The canvas for your creation'   },
];

export function BuildInterface() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, addItem, removeItem, getItemByCategory, getTotalPrice, clearCart } = useCartStore();
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const totalPrice = getTotalPrice();
  const filledCount = items.length;

  const filteredProducts = useMemo(() =>
    activeCategory ? allProducts.filter(p => p.category === activeCategory) : [],
    [activeCategory]
  );

  const compatibilityWarning = useMemo(() => {
    if (!mounted) return null;
    const cpu = items.find(i => i.category === 'Processor');
    const mobo = items.find(i => i.category === 'Motherboard');
    if (cpu && mobo) {
      const isIntel = cpu.name.toLowerCase().includes('intel');
      const isAmd   = cpu.name.toLowerCase().includes('amd');
      const isAm4   = mobo.specs?.Socket === 'AM4';
      const isAm5   = mobo.specs?.Socket === 'AM5';
      const isLga   = mobo.specs?.Socket === 'LGA 1700';
      if (isAmd && isLga) return "Socket Mismatch: AMD CPU needs an AM4 or AM5 Motherboard, not LGA 1700.";
      if (isIntel && (isAm4 || isAm5)) return "Socket Mismatch: Intel CPU needs an LGA 1700 Motherboard.";
    }
    return null;
  }, [items, mounted]);

  const loadRazorpay = () => new Promise<boolean>(resolve => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

  const handleCheckout = async () => {
    if (!session) { router.push("/login"); return; }
    try {
      setIsProcessing(true);
      const loaded = await loadRazorpay();
      if (!loaded) { alert("Razorpay SDK failed to load."); return; }
      const res = await fetch("/api/razorpay", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount: totalPrice }) });
      const data = await res.json();
      if (!data.orderId) throw new Error("Failed to create order");
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount, currency: data.currency,
        name: "ASMBLY", description: "Complete your PC Build",
        order_id: data.orderId,
        theme: { color: "#c8b89a" },
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/razorpay/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...response, items, totalPrice }) });
          if (verifyRes.ok) { clearCart(); window.location.href = "/success"; }
          else alert("Payment verification failed.");
        },
      };
      const rz = new (window as any).Razorpay(options);
      rz.on("payment.failed", (r: any) => alert(r.error.description));
      rz.open();
    } catch (e) {
      console.error(e);
      alert("Something went wrong during checkout.");
    } finally { setIsProcessing(false); }
  };

  return (
    <div className="flex flex-col gap-8">

      {/* Compatibility Warning */}
      <AnimatePresence>
        {compatibilityWarning && (
          <motion.div
            key="compat-warning"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass bg-red-500/10 border-red-500/30 p-4 rounded-xl flex items-start gap-4">
              <div className="p-2 bg-red-500/20 rounded-lg shrink-0"><AlertTriangle className="w-5 h-5 text-red-500" /></div>
              <div>
                <h4 className="text-red-500 font-bold mb-1">Compatibility Issue Detected</h4>
                <p className="text-sm text-red-200/80">{compatibilityWarning}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Slot Grid */}
      <div className="flex flex-col gap-3">
        {CATEGORIES.map((cat, idx) => {
          const Icon = cat.icon;
          const selectedItem = mounted ? getItemByCategory(cat.name) : null;
          const isActive = activeCategory === cat.name;

          return (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04, type: "spring", stiffness: 300, damping: 28 }}
            >
              {/* Slot Row */}
              <div
                className={`glass rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden
                  ${isActive ? "border-primary/40 shadow-[0_0_20px_rgba(200,184,154,0.1)]" : "border-white/8 hover:border-white/20"}
                  ${selectedItem ? "bg-primary/5" : ""}
                `}
              >
                {/* Header — always visible */}
                <div
                  className="flex items-center gap-5 p-5"
                  onClick={() => setActiveCategory(isActive ? null : cat.name)}
                >
                  {/* Icon badge */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300
                    ${selectedItem ? "bg-primary/20 text-primary shadow-[0_0_12px_rgba(200,184,154,0.25)]" : isActive ? "bg-white/10 text-white" : "bg-white/5 text-muted"}`}>
                    {selectedItem ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>

                  {/* Slot info OR selected product */}
                  {selectedItem ? (
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Product image */}
                      {selectedItem.image && (
                        <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center p-1.5">
                          <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-contain" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-0.5">{cat.name}</p>
                        <p className="text-sm font-semibold text-white truncate">{selectedItem.name}</p>
                        <p className="text-xs text-muted mt-0.5">₹{selectedItem.price.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white">{cat.name}</p>
                      <p className="text-xs text-muted mt-0.5">{cat.subtitle}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {selectedItem && (
                      <button
                        onClick={(e) => { e.stopPropagation(); removeItem(selectedItem.id); }}
                        className="p-2 rounded-lg text-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <motion.div animate={{ rotate: isActive ? 90 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronRight className={`w-5 h-5 transition-colors ${isActive ? "text-primary" : "text-muted"}`} />
                    </motion.div>
                  </div>
                </div>

                {/* Expandable Product Panel */}
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      key="product-panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/8 px-5 pb-5 pt-4 flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                        {filteredProducts.map((product) => {
                          const isSelected = items.some(i => i.id === product.id);
                          return (
                            <motion.div
                              key={product.id}
                              layout
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={`flex items-center gap-4 p-3 rounded-xl border transition-all duration-200 group relative
                                ${
                                  product.available === false
                                    ? "border-white/5 bg-white/2 opacity-50 cursor-not-allowed"
                                    : isSelected
                                    ? "border-primary/40 bg-primary/10 shadow-[0_0_10px_rgba(200,184,154,0.08)] cursor-pointer"
                                    : "border-white/5 bg-white/3 hover:border-white/15 hover:bg-white/5 cursor-pointer"
                                }`}
                              onClick={() => {
                                if (product.available === false) return;
                                addItem(product);
                                setActiveCategory(null);
                              }}
                            >
                              {/* Mini image */}
                              {product.image && (
                                <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center p-1">
                                  <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                                </div>
                              )}
                              {/* Details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className={`text-sm font-semibold truncate ${isSelected ? "text-primary" : "text-white"}`}>{product.name}</p>
                                  {product.available === false && (
                                    <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/20">
                                      Unavailable
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-muted truncate mt-0.5">
                                  {Object.entries(product.specs).slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                                </p>
                              </div>
                              {/* Price + action */}
                              <div className="flex items-center gap-2 shrink-0">
                                <p className={`text-sm font-bold whitespace-nowrap ${isSelected ? "text-primary" : "text-white"}`}>
                                  ₹{product.price.toLocaleString('en-IN')}
                                </p>
                                {/* Amazon / Flipkart link */}
                                {(product.amazonUrl || product.flipkartUrl) && (
                                  <a
                                    href={product.amazonUrl ?? product.flipkartUrl!}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={product.amazonUrl ? "Buy on Amazon" : "Buy on Flipkart"}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all
                                      text-[#FF9900]/70 bg-[#FF9900]/5 border border-[#FF9900]/20
                                      hover:bg-[#FF9900]/15 hover:text-[#FF9900] hover:border-[#FF9900]/50
                                      hover:shadow-[0_0_10px_rgba(255,153,0,0.2)]"
                                  >
                                    <ShoppingBag className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                {/* Add/Selected icon */}
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all
                                  ${
                                    product.available === false
                                      ? "bg-white/5 text-muted/40"
                                      : isSelected
                                      ? "bg-primary/20 text-primary"
                                      : "bg-white/5 text-muted group-hover:bg-primary/15 group-hover:text-primary"
                                  }`}>
                                  {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Build Summary */}
      <motion.div
        className="glass rounded-2xl border border-white/10 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Build Summary
          </h3>
          {mounted && items.length > 0 && (
            <button onClick={clearCart} className="text-xs text-muted hover:text-red-400 transition-colors flex items-center gap-1">
              <Trash2 className="w-3 h-3" /> Clear All
            </button>
          )}
        </div>

        {mounted && items.length > 0 ? (
          <div className="flex flex-col gap-2 mb-5">
            {CATEGORIES.map(cat => {
              const item = getItemByCategory(cat.name);
              if (!item) return null;
              return (
                <div key={cat.name} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 group">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted uppercase tracking-wider">{cat.name}</p>
                      <p className="text-sm text-white font-medium truncate max-w-[180px]">{item.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    <span className="text-sm font-bold text-white whitespace-nowrap">₹{item.price.toLocaleString('en-IN')}</span>
                    {item.amazonUrl && (
                      <a
                        href={item.amazonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Buy on Amazon"
                        className="p-1 rounded text-[#FF9900]/50 hover:text-[#FF9900] opacity-0 group-hover:opacity-100 transition-all hover:bg-[#FF9900]/10"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted mb-5">
            <ShoppingCart className="w-10 h-10 opacity-20 mx-auto mb-3" />
            <p className="text-sm">No components selected yet.</p>
            <p className="text-xs mt-1">Click any category above to start building.</p>
          </div>
        )}

        {/* Total */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 mb-5">
          <div>
            <p className="text-xs text-muted">Build Total</p>
            <p className="text-3xl font-black text-white tracking-tight mt-0.5">
              ₹{mounted ? totalPrice.toLocaleString('en-IN') : '0'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted">{filledCount} / 7 selected</p>
            <div className="flex gap-1 mt-2 justify-end">
              {Array.from({ length: 7 }, (_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i < filledCount ? "bg-primary shadow-[0_0_6px_rgba(200,184,154,0.6)]" : "bg-white/15"}`} />
              ))}
            </div>
          </div>
        </div>

        <Button
          variant={filledCount === 7 ? "primary" : "outline"}
          className={`w-full text-sm font-bold tracking-wider uppercase ${filledCount < 7 ? "border-primary/20 text-primary/60" : ""}`}
          disabled={!mounted || items.length === 0 || isProcessing}
          onClick={handleCheckout}
        >
          {isProcessing
            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
            : filledCount === 7
              ? <><ArrowRight className="w-4 h-4 mr-2" /> Checkout — ₹{totalPrice.toLocaleString('en-IN')}</>
              : `Select ${7 - filledCount} More Component${7 - filledCount !== 1 ? "s" : ""} to Checkout`
          }
        </Button>
      </motion.div>
    </div>
  );
}
