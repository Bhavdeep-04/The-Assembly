"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Calendar, Settings, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Define local interfaces for the API response
interface OrderItem {
  id: string;
  name: string;
  price: number;
  category: string;
  _id: string;
}

interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  razorpayOrderId: string;
  status: string;
  createdAt: string;
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchOrders();
    }
  }, [status, router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) {
        throw new Error("Failed to load orders");
      }
      const data = await res.json();
      setOrders(data.orders);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || (status === "authenticated" && isLoading)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-muted text-sm tracking-widest uppercase">Loading Orders</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2 flex items-center gap-3">
          <Package className="w-8 h-8 text-primary" />
          Order History
        </h1>
        <p className="text-muted">View the status and details of your past builds.</p>
      </motion.div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8">
          {error}
        </div>
      )}

      {!isLoading && orders.length === 0 && !error ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-12 rounded-2xl text-center border-dashed border-2 border-white/5"
        >
          <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mx-auto mb-6">
            <Settings className="w-10 h-10 text-muted opacity-50" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No orders yet</h2>
          <p className="text-muted mb-8 max-w-md mx-auto">
            You haven't built any machines yet. Start configuring your ultimate setup today.
          </p>
          <Link href="/build">
            <Button variant="primary">Start Building <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {orders.map((order, i) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                className="glass rounded-2xl overflow-hidden group"
              >
                {/* Order Header */}
                <div className="bg-surface/50 p-6 border-b border-white/5 flex flex-wrap gap-6 justify-between items-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                  
                  <div>
                    <div className="text-xs text-muted mb-1 uppercase tracking-wider font-semibold">
                      Order ID
                    </div>
                    <div className="font-mono text-sm text-white/80">
                      {order.razorpayOrderId || order._id}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted mb-1 uppercase tracking-wider font-semibold flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Date
                    </div>
                    <div className="text-sm text-white/90">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted mb-1 uppercase tracking-wider font-semibold">
                      Total Amount
                    </div>
                    <div className="text-lg font-black text-white flex items-center gap-2">
                       ₹{order.totalPrice.toLocaleString('en-IN')}
                       <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ${
                         order.status === 'paid' ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 
                         order.status === 'created' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20' : 
                         'bg-red-500/20 text-red-400 border border-red-500/20'
                       }`}>
                         {order.status}
                       </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
                    Components Built
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {order.items.map((item, index) => (
                      <div key={item._id || index} className="flex justify-between items-center p-3 rounded-xl bg-surface/30 border border-white/5 hover:border-white/10 transition-colors">
                        <div className="min-w-0 pr-4">
                          <p className="text-xs text-primary mb-0.5">{item.category}</p>
                          <p className="text-sm font-semibold text-white/90 truncate">{item.name}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-mono text-white/80">₹{item.price.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
