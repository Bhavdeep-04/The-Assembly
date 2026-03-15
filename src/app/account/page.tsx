import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, LogOut, Package, MapPin, Mail, CreditCard, ChevronRight } from "lucide-react";
import Link from "next/link";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  await connectToDatabase();

  // Fetch only the latest 3 orders for the account preview
  const recentOrders = await Order.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-10 flex flex-col items-center md:flex-row md:items-start md:justify-between gap-6 relative">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-4xl font-black text-primary drop-shadow-[0_0_15px_rgba(200,184,154,0.3)] shrink-0">
            {session.user.name ? session.user.name.charAt(0).toUpperCase() : session.user.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-1">
              {session.user.name || "ASMBLY Member"}
            </h1>
            <p className="text-muted flex items-center gap-2">
              <Mail className="w-4 h-4" /> {session.user.email}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Navigation / Details */}
        <div className="md:col-span-1 space-y-4">
          <div className="glass rounded-2xl p-4 flex flex-col">
            <Link href="/orders" className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-hover transition-colors group">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                   <Package className="w-5 h-5 text-primary" />
                 </div>
                 <div>
                   <h3 className="text-white font-bold group-hover:text-primary transition-colors">Order History</h3>
                   <p className="text-xs text-muted">View past PC builds</p>
                 </div>
               </div>
               <ChevronRight className="w-5 h-5 text-muted group-hover:text-white transition-colors" />
            </Link>

            <Link href="/account" className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-hover transition-colors group">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center transition-colors border border-white/5 group-hover:border-white/20">
                   <User className="w-5 h-5 text-muted group-hover:text-white transition-colors" />
                 </div>
                 <div>
                   <h3 className="text-white font-bold transition-colors">Personal Details</h3>
                   <p className="text-xs text-muted">Manage your information</p>
                 </div>
               </div>
               <ChevronRight className="w-5 h-5 text-muted group-hover:text-white transition-colors" />
            </Link>

            <Link href="/account" className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-hover transition-colors group">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center transition-colors border border-white/5 group-hover:border-white/20">
                   <MapPin className="w-5 h-5 text-muted group-hover:text-white transition-colors" />
                 </div>
                 <div>
                   <h3 className="text-white font-bold transition-colors">Addresses</h3>
                   <p className="text-xs text-muted">Shipping locations</p>
                 </div>
               </div>
               <ChevronRight className="w-5 h-5 text-muted group-hover:text-white transition-colors" />
            </Link>
          </div>
          
          <div className="glass rounded-2xl p-4 flex flex-col mt-4">
             <Link href="/api/auth/signout?callbackUrl=/" className="flex items-center gap-3 p-4 rounded-xl hover:bg-red-500/10 hover:text-red-400 group transition-colors text-muted">
                <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
                <span className="font-bold group-hover:text-red-400">Sign Out</span>
             </Link>
          </div>
        </div>

        {/* Right Column - Recent Orders */}
        <div className="md:col-span-2">
           <div className="glass rounded-2xl p-6 md:p-8">
             <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
               <h2 className="text-xl font-bold text-white flex items-center gap-2">
                 <CreditCard className="w-5 h-5 text-primary" />
                 Recent Orders
               </h2>
               <Link href="/orders" className="text-sm font-semibold text-primary hover:text-white transition-colors uppercase tracking-wider">
                 View All
               </Link>
             </div>

             {recentOrders.length === 0 ? (
               <div className="text-center py-12">
                 <Package className="w-12 h-12 text-muted opacity-30 mx-auto mb-4" />
                 <p className="text-muted text-sm">No orders found.</p>
                 <Link href="/build" className="text-primary text-sm font-semibold hover:underline mt-2 inline-block">Start your first build</Link>
               </div>
             ) : (
               <div className="space-y-4">
                 {recentOrders.map((order: any) => (
                   <Link href="/orders" key={order._id.toString()} className="block">
                     <div className="p-4 rounded-xl bg-surface/50 border border-white/5 hover:border-primary/30 transition-colors group flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
                       {/* Left accent strip */}
                       <div className={`absolute top-0 left-0 w-1 h-full ${order.status === 'paid' ? 'bg-primary' : 'bg-muted'}`} />
                       
                       <div className="pl-2">
                         <div className="text-xs text-muted mb-1">
                           {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                         </div>
                         <div className="font-semibold text-white group-hover:text-primary transition-colors">
                           Order #{order.razorpayOrderId ? order.razorpayOrderId.slice(-8) : order._id.toString().slice(-8)}
                         </div>
                         <div className="text-xs text-muted mt-1">
                           {order.items.length} {order.items.length === 1 ? 'component' : 'components'}
                         </div>
                       </div>
                       
                       <div className="flex items-center justify-between md:justify-end gap-6 pl-2 md:pl-0">
                         <div className="text-right">
                           <div className="font-bold text-white">₹{order.totalPrice.toLocaleString('en-IN')}</div>
                           <div className={`text-[10px] uppercase tracking-wider font-bold mt-1 ${order.status === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>
                             {order.status}
                           </div>
                         </div>
                         <ChevronRight className="w-5 h-5 text-muted group-hover:text-white transition-colors hidden md:block" />
                       </div>
                     </div>
                   </Link>
                 ))}
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
