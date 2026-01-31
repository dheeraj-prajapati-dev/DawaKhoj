import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client"; // 👈 Naya install kiya hua

const socket = io("https://dawakhoj.onrender.com");

export default function PharmacyDashboard() {
  const [stats, setStats] = useState({
    totalMedicines: 0,
    pendingOrders: 0,
    outOfStock: 0,
    lowStock: 0,
    revenue: "0",
    pharmacyId: "" // 👈 Room join karne ke liye
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, ordersRes] = await Promise.all([
        axios.get("https://dawakhoj.onrender.com/api/orders/stats", { headers }),
        axios.get("https://dawakhoj.onrender.com/api/orders/pharmacy-orders", { headers })
      ]);

      if (statsRes.data.success) {
        // Stats update karein aur pharmacy ID extract karein
        setStats({ 
          ...statsRes.data.stats, 
          pharmacyId: ordersRes.data.orders[0]?.pharmacy || "" 
        });
      }
      if (ordersRes.data.success) {
        setRecentOrders(ordersRes.data.orders.slice(0, 5));
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  useEffect(() => {
    fetchData();

    // SOCKET LISTENERS
    if (stats.pharmacyId) {
      socket.emit("join_pharmacy", stats.pharmacyId);
    }

    socket.on("new_order_alert", (data) => {
      alert("🔔 " + data.message); // Real-time notification!
      fetchData(); // Dashboard auto-refresh
    });

    return () => socket.off("new_order_alert");
  }, [stats.pharmacyId]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`https://dawakhoj.onrender.com/api/orders/status/${orderId}`, 
        { status: newStatus }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        alert(`Order marked as ${newStatus}`);
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pharmacy Dashboard</h1>
          <p className="text-sm text-gray-500">Manage your pharmacy operations</p>
        </div>
        <button onClick={() => navigate("/pharmacy/inventory")} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all font-bold">
          Manage Inventory
        </button>
      </div>

      {/* Stats Cards - Aapka Original Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <DashboardCard title="Total Medicines" value={stats.totalMedicines} />
        <DashboardCard title="Low Stock" value={stats.lowStock} warning={stats.lowStock > 0} />
        <DashboardCard title="Out of Stock" value={stats.outOfStock} danger={stats.outOfStock > 0} />
        <DashboardCard title="Pending Orders" value={stats.pendingOrders} />
        <DashboardCard title="Today's Revenue" value={`₹ ${stats.revenue}`} />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">Recent Pending Orders</h2>
            <button onClick={() => navigate("/pharmacy/orders")} className="text-blue-600 text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-3">Customer Details</th>
                  <th className="p-3">Medicine</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.filter(o => o.status === 'Pending').map(order => (
                  <tr key={order._id} className="border-t hover:bg-gray-50 transition-colors">
                    <td className="p-3">
  <p className="font-bold text-gray-800">{order.user?.name || "Customer"}</p>
  <p className="text-[10px] text-blue-500 font-medium italic">
    {/* Agar city hai toh dikhao, nahi toh prompt do */}
    📍 {order.user?.address?.city 
        ? `${order.user.address.city}, ${order.user.address.pincode}` 
        : "Address not updated"}
  </p>
</td>
                    <td className="p-3 font-medium text-gray-700">{order.medicineName}</td>
                    <td className="p-3">
                      <button 
                        onClick={() => handleUpdateStatus(order._id, 'Delivered')}
                        className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-xs font-black hover:bg-green-200 transition-colors"
                      >
                        Mark Delivered
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentOrders.filter(o => o.status === 'Pending').length === 0 && (
                <p className="text-center py-10 text-gray-400 font-medium italic">No pending orders at the moment ✨</p>
            )}
          </div>
        </div>

        {/* Right Side: Quick Actions & Status */}
        <div className="space-y-6">
            <div className="bg-white rounded-xl p-5 shadow border border-gray-100">
                <h2 className="font-semibold text-lg mb-4 text-gray-800">Pharmacy Status</h2>
                <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg border border-green-100">
                    <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-sm font-bold text-green-700">Verified & Active</span>
                </div>
            </div>
            
            <div className="bg-white rounded-xl p-5 shadow border-l-4 border-blue-500">
                <h2 className="font-semibold text-md text-blue-800">Inventory Tip</h2>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  Bhai, aapke <span className="font-bold text-orange-600">{stats.lowStock} items</span> low stock mein hain. Jaldi refill karo taaki koi order miss na ho!
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}

// Sundar DashboardCard Component
function DashboardCard({ title, value, danger, warning }) {
  return (
    <div className={`bg-white rounded-xl p-5 shadow border-b-4 transition-all duration-300 ${
      danger ? 'border-red-500 bg-red-50' : 
      warning ? 'border-orange-500 bg-orange-50' : 
      'border-transparent hover:border-blue-500'
    }`}>
      <p className="text-xs text-gray-400 mb-1 uppercase font-black tracking-widest">{title}</p>
      <h3 className={`text-3xl font-black ${
        danger ? 'text-red-600' : 
        warning ? 'text-orange-600' : 
        'text-gray-800'
      }`}>
        {value}
      </h3>
      {warning && (
        <div className="flex items-center gap-1 mt-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-ping"></span>
            <p className="text-[10px] text-orange-600 font-bold italic underline">Refill Soon!</p>
        </div>
      )}
    </div>
  );
}