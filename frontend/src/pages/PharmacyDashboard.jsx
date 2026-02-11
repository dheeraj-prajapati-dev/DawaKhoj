import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { toast, Toaster } from "react-hot-toast";
import { API } from "../context/AuthContext"; // 🔥 Cookie-based API instance

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

  // 🔔 Bell Sound Logic
  const playNotification = useCallback(() => {
    const audio = new Audio("/bell.mp3");
    audio.play().catch(err => {
      console.log("Audio play blocked. Click anywhere on the dashboard first.", err);
    });
  }, []);

  const fetchData = async () => {
    try {
      // 🔥 Headers ki zarurat nahi, API instance cookies handle karega
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
        // Active orders: Pending ya Accepted
        const activeOrders = ordersRes.data.orders.filter(
            o => o.status === 'Pending' || o.status === 'Accepted'
        );
        setRecentOrders(activeOrders.slice(0, 8)); 
      }
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      }
    }
  };

  useEffect(() => {
    fetchData();

    // Socket Connection with credentials for cookies
    const socket = io("https://dawakhoj.onrender.com", {
      transports: ["websocket", "polling"],
      withCredentials: true
    });

    if (stats.pharmacyId) {
      socket.emit("join_room", stats.pharmacyId);
    }

    socket.on("new_order_alert", (data) => {
      playNotification();
      toast.success(`📦 ${data.message}`, {
        duration: 8000,
        icon: '🚀',
        style: { border: '2px solid #2563eb', padding: '16px', fontWeight: 'bold' }
      });
      fetchData(); 
    });

    socket.on("search_alert", (data) => {
      toast(data.message, {
        icon: '🔍',
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
    });

    return () => {
      socket.off("new_order_alert");
      socket.off("search_alert");
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
      toast.error(err.response?.data?.message || "Update Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6" onClick={() => console.log("Dashboard Active")}>
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Pharmacy Dashboard 🏥</h1>
          <p className="text-sm text-gray-500">Real-time monitoring active ⚡</p>
        </div>
        <div className="flex gap-2">
           <button onClick={playNotification} className="bg-white border text-gray-700 px-3 py-2 rounded-lg text-xs font-bold hover:bg-gray-50 transition-all shadow-sm">
             🔊 Test Sound
          </button>
          <button onClick={() => navigate("/pharmacy/inventory")} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all font-bold shadow-md">
            Manage Inventory
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <DashboardCard title="Total Medicines" value={stats.totalMedicines} />
        <DashboardCard title="Low Stock" value={stats.lowStock} warning={stats.lowStock > 0} />
        <DashboardCard title="Out of Stock" value={stats.outOfStock} danger={stats.outOfStock > 0} />
        <DashboardCard title="Pending Orders" value={stats.pendingOrders} blink={stats.pendingOrders > 0} />
        <DashboardCard title="Revenue" value={`₹ ${stats.revenue}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg text-gray-800 uppercase tracking-tighter">New Tasks</h2>
            <button onClick={() => navigate("/pharmacy/orders")} className="text-blue-600 text-sm font-bold hover:underline">Full History</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] font-black">
                <tr>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Medicine</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-3">
                      <p className="font-black text-gray-800 group-hover:text-blue-600">{order.user?.name || "Customer"}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">📍 {order.user?.address?.city || "Silvassa"}</p>
                    </td>
                    <td className="p-3 font-bold text-gray-700 italic">{order.medicineName}</td>
                    <td className="p-3">
                      <div className="flex gap-2 justify-end">
                        {order.status === 'Pending' ? (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(order._id, 'Accepted')}
                              className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black hover:bg-blue-700 shadow-lg shadow-blue-100 uppercase tracking-wider"
                            >
                              ACCEPT
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(order._id, 'Rejected')}
                              className="bg-white border-2 border-red-100 text-red-500 px-3 py-1.5 rounded-lg text-[10px] font-black hover:bg-red-50 uppercase tracking-wider"
                            >
                              REJECT
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => handleUpdateStatus(order._id, 'Delivered')}
                            className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-black hover:bg-emerald-700 shadow-lg shadow-emerald-100 animate-pulse uppercase tracking-wider"
                          >
                            MARK DELIVERED
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentOrders.length === 0 && (
                <div className="text-center py-20 bg-gray-50/50 rounded-xl mt-2 border-2 border-dashed">
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Waiting for new orders... ✨</p>
                </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <h2 className="font-bold text-sm mb-4 text-gray-400 uppercase tracking-widest">Connection Status</h2>
            <div className="flex items-center gap-3 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
              <span className="h-3 w-3 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">System Online</span>
            </div>
          </div>
          
          <div className="bg-blue-600 rounded-2xl p-6 shadow-xl shadow-blue-200 text-white relative overflow-hidden group">
             <div className="relative z-10">
               <h3 className="font-black text-xs uppercase tracking-widest opacity-70">Admin Tip</h3>
               <p className="text-sm mt-3 font-medium leading-relaxed italic">
                 "Bhai, fast response se Store Rating badhti hai! 🚀"
               </p>
             </div>
             <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 group-hover:rotate-12 transition-transform">⚡</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, value, danger, warning, blink }) {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border-b-[6px] transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
      danger ? 'border-red-500' : 
      warning ? 'border-orange-500' : 
      blink ? 'border-blue-600 shadow-blue-50' : 
      'border-gray-200'
    }`}>
      <p className="text-[10px] text-gray-400 mb-2 uppercase font-black tracking-[0.2em]">{title}</p>
      <h3 className={`text-3xl font-black tracking-tighter ${danger ? 'text-red-600' : warning ? 'text-orange-600' : blink ? 'text-blue-700' : 'text-gray-800'}`}>
        {value}
      </h3>
      {(warning || blink) && (
        <div className="flex items-center gap-1.5 mt-3">
            <span className={`h-1.5 w-1.5 rounded-full ${warning ? 'bg-orange-500' : 'bg-blue-500'} animate-ping`}></span>
            <p className={`text-[10px] font-black uppercase tracking-widest italic ${warning ? 'text-orange-600' : 'text-blue-600'}`}>
              {warning ? 'Action Required!' : 'Processing...'}
            </p>
        </div>
      )}
    </div>
  );
}