import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { toast, Toaster } from "react-hot-toast";
import { API } from "../context/AuthContext";
import { 
  Package, AlertTriangle, Clock, IndianRupee, 
  ChevronRight, Activity, BellRing, Settings2, ShoppingBag
} from "lucide-react";

export default function PharmacyDashboard() {
  const [stats, setStats] = useState({
    totalMedicines: 0,
    pendingOrders: 0,
    outOfStock: 0,
    lowStock: 0,
    revenue: "0",
    pharmacyId: ""
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const navigate = useNavigate();

  const playNotification = useCallback(() => {
    const audio = new Audio("/bell.mp3");
    audio.play().catch(err => console.log("Audio blocked", err));
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        API.get("/orders/stats"),
        API.get("/orders/pharmacy-orders")
      ]);

      if (statsRes.data.success) {
        setStats(prev => ({ 
          ...prev,
          ...statsRes.data.stats, 
          pharmacyId: ordersRes.data.orders?.[0]?.pharmacy || statsRes.data.stats.pharmacyId || prev.pharmacyId 
        }));
      }

      if (ordersRes.data.success) {
        const activeOrders = ordersRes.data.orders.filter(
            o => o.status === 'Pending' || o.status === 'Accepted'
        );
        setRecentOrders(activeOrders.slice(0, 8)); 
      }
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const socket = io("https://dawakhoj.onrender.com", {
      transports: ["websocket", "polling"],
      withCredentials: true
    });

    if (stats.pharmacyId) socket.emit("join_room", stats.pharmacyId);

    socket.on("new_order_alert", (data) => {
      playNotification();
      toast.success(`📦 ${data.message}`, {
        style: { background: '#1e293b', color: '#fff', border: '1px solid #3b82f6' }
      });
      fetchData(); 
    });

    return () => {
      socket.off("new_order_alert");
      socket.disconnect();
    };
  }, [stats.pharmacyId, playNotification]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await API.put(`/orders/status/${orderId}`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Order ${newStatus} ✅`);
        fetchData();
      }
    } catch (err) {
      toast.error("Update Failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 font-sans text-white relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10"></div>
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter italic flex items-center gap-3">
            PHARMACY <span className="text-blue-500">DASHBOARD</span> 
            <Activity className="text-emerald-500 w-6 h-6 animate-pulse" />
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Real-time Monitoring Active ⚡</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => navigate("/pharmacy/inventory")}
            className="group flex items-center gap-2 bg-slate-900 border border-slate-800 px-5 py-3 rounded-2xl hover:border-blue-500/50 transition-all font-bold text-sm tracking-tight"
          >
            <Settings2 className="w-4 h-4 text-slate-500 group-hover:text-blue-500" />
            Manage Inventory
          </button>
          <button 
            onClick={() => navigate("/pharmacy/orders")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-2xl transition-all font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-900/20"
          >
            <ShoppingBag className="w-4 h-4" />
            Orders
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        <StatCard title="Total Inventory" value={stats.totalMedicines} icon={<Package />} color="blue" />
        <StatCard title="Low Stock" value={stats.lowStock} icon={<AlertTriangle />} color="orange" alert={stats.lowStock > 0} />
        <StatCard title="Out of Stock" value={stats.outOfStock} icon={<AlertTriangle />} color="red" alert={stats.outOfStock > 0} />
        <StatCard title="Pending" value={stats.pendingOrders} icon={<Clock />} color="blue" pulse={stats.pendingOrders > 0} />
        <StatCard title="Total Revenue" value={`₹${stats.revenue}`} icon={<IndianRupee />} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Orders Board */}
        <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-slate-800/60 shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black italic uppercase tracking-tight">Active Tasks</h2>
            <div className="h-[1px] flex-grow mx-6 bg-slate-800 hidden md:block"></div>
            <button onClick={() => navigate("/pharmacy/orders")} className="text-blue-500 text-[10px] font-black uppercase tracking-widest hover:text-blue-400">View History</button>
          </div>

          <div className="space-y-4">
            {recentOrders.map(order => (
              <div key={order._id} className="flex flex-col md:flex-row items-center justify-between p-5 bg-slate-950/50 border border-slate-800/50 rounded-3xl group hover:border-blue-500/30 transition-all duration-500">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 font-black italic">
                    {order.user?.name?.charAt(0) || "C"}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-200 group-hover:text-white transition-colors uppercase text-sm tracking-tight">{order.user?.name || "Anonymous User"}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Medicine: <span className="text-blue-400 italic">{order.medicineName}</span></p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 md:mt-0 w-full md:w-auto">
                  {order.status === 'Pending' ? (
                    <>
                      <button onClick={() => handleUpdateStatus(order._id, 'Accepted')} className="flex-grow md:flex-none bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Accept</button>
                      <button onClick={() => handleUpdateStatus(order._id, 'Rejected')} className="bg-slate-800 hover:bg-red-900/20 text-slate-400 hover:text-red-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Decline</button>
                    </>
                  ) : (
                    <button onClick={() => handleUpdateStatus(order._id, 'Delivered')} className="w-full md:w-auto bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest animate-pulse">Mark Delivered</button>
                  )}
                </div>
              </div>
            ))}

            {recentOrders.length === 0 && (
              <div className="text-center py-24 bg-slate-950/20 border-2 border-dashed border-slate-800 rounded-[2rem]">
                <Clock className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                <p className="text-slate-600 font-bold uppercase tracking-[0.2em] text-[10px]">Awaiting New Orders...</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Status */}
        <div className="space-y-6">
          <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-slate-800/60">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">System Health</h3>
            <div className="space-y-4">
              <StatusIndicator label="Network" status="Optimal" active />
              <StatusIndicator label="Socket Server" status="Connected" active />
              <StatusIndicator label="Database" status="Syncing" active />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-8 shadow-2xl shadow-blue-900/40 relative overflow-hidden group cursor-pointer" onClick={playNotification}>
            <BellRing className="absolute -right-6 -bottom-6 w-32 h-32 text-white/10 group-hover:rotate-12 transition-transform" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4">Notification Center</h3>
            <p className="text-sm font-bold leading-relaxed italic text-blue-50 underline decoration-blue-400 underline-offset-4 decoration-2">
              Test Alert System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components for better readability
function StatCard({ title, value, icon, color, alert, pulse }) {
  const colors = {
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20 shadow-blue-500/5",
    orange: "text-orange-500 bg-orange-500/10 border-orange-500/20 shadow-orange-500/5",
    red: "text-red-500 bg-red-500/10 border-red-500/20 shadow-red-500/5",
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/5",
  };

  return (
    <div className={`bg-slate-900/60 p-6 rounded-[2rem] border border-slate-800 transition-all duration-500 hover:border-slate-700 hover:-translate-y-1 relative group overflow-hidden ${alert ? 'ring-2 ring-red-500/20 ring-offset-4 ring-offset-slate-950' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colors[color]}`}>{icon}</div>
        {pulse && <div className="h-2 w-2 rounded-full bg-blue-500 animate-ping"></div>}
      </div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-3xl font-black italic tracking-tighter text-slate-100">{value}</h3>
    </div>
  );
}

function StatusIndicator({ label, status, active }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-950/40 rounded-2xl border border-slate-800/50">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`}></div>
        <span className="text-[10px] font-black text-slate-200 uppercase">{status}</span>
      </div>
    </div>
  );
}