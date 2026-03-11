"use client";

import { useCartStore } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { useState, useEffect } from "react";

export function CartSummary() {
  const { items, removeItem, getTotalPrice, clearCart } = useCartStore();
  const totalPrice = getTotalPrice();
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      const isLoaded = await loadRazorpayScript();

      if (!isLoaded) {
        alert("Razorpay SDK failed to load. Are you online?");
        setIsProcessing(false);
        return;
      }

      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice }),
      });
      const data = await res.json();

      if (!data.orderId) {
        throw new Error("Failed to create order");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "The Assembly",
        description: "Complete your PC Build",
        order_id: data.orderId,
        theme: {
          color: "#00f0ff",
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                items,
                totalPrice,
              }),
            });

            if (verifyRes.ok) {
              clearCart();
              window.location.href = "/success";
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error(err);
            alert("Payment verification error.");
          }
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        alert(response.error.description);
      });
      
      paymentObject.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong during checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="glass rounded-xl p-6 h-fit">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-primary" />
          Your Build
        </h2>
        {mounted && items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-muted hover:text-white transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4 min-h-[200px] max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {!mounted || items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full text-muted pt-10"
            >
              <div className="w-16 h-16 rounded-full bg-surface mb-4 flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 opacity-20" />
              </div>
              <p>Your cart is empty.</p>
              <p className="text-sm mt-1">Select components to start building.</p>
            </motion.div>
          ) : (
            items.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center justify-between p-3 rounded-lg bg-surface border border-white/5 group"
              >
                <div className="flex flex-col flex-1 min-w-0 pr-4">
                  <span className="text-xs text-primary font-medium tracking-wider uppercase mb-1 drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
                    {item.category}
                  </span>
                  <span className="text-sm font-semibold truncate text-white/90">
                    {item.name}
                  </span>
                  <span className="text-xs text-muted mt-0.5">
                    ₹{item.price.toLocaleString('en-IN')} {item.quantity > 1 && `x${item.quantity}`}
                  </span>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 mr-[-8px] text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded-md hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex items-end justify-between mb-6">
          <span className="text-muted font-medium">Total</span>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              ₹{mounted ? totalPrice.toLocaleString('en-IN') : '0'}
            </span>
          </div>
        </div>

        <Button
          variant="primary"
          className="w-full text-sm font-bold tracking-wide uppercase"
          disabled={!mounted || items.length === 0 || isProcessing}
          onClick={handleCheckout}
        >
          {isProcessing ? "Processing..." : "Checkout"} <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
