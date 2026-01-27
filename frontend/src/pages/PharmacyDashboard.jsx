import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PharmacyDashboard() {
  const [stats, setStats] = useState({
    totalMedicines: 0,
    pendingOrders: 0,
    outOfStock: 0,
    revenue: "0"
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/orders/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pharmacy Dashboard</h1>
          <p className="text-sm text-gray-500">Manage your pharmacy operations</p>
        </div>
        <button 
          onClick={() => navigate("/pharmacy/inventory/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Medicine
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <DashboardCard title="Total Medicines" value={stats.totalMedicines} />
        <DashboardCard title="Out of Stock" value={stats.outOfStock} danger />
        <DashboardCard title="Pending Orders" value={stats.pendingOrders} />
        <DashboardCard title="Today's Revenue" value={`₹ ${stats.revenue}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-5 shadow">
          <h2 className="font-semibold text-lg mb-4">Inventory Quick Actions</h2>
          <div className="space-y-3">
            <button onClick={() => navigate("/pharmacy/inventory")} className="w-full border rounded-lg px-4 py-2 hover:bg-gray-100">
              View Inventory
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow">
          <h2 className="font-semibold text-lg mb-4">Orders</h2>
          <p className="text-gray-500 text-sm mb-3">
            You have <b>{stats.pendingOrders}</b> pending orders
          </p>
          <button 
            onClick={() => navigate("/pharmacy/orders")}
            className="w-full bg-green-600 text-white rounded-lg py-2 hover:bg-green-700"
          >
            View Orders
          </button>
        </div>

        <div className="bg-white rounded-xl p-5 shadow">
          <h2 className="font-semibold text-lg mb-4">Pharmacy Status</h2>
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-green-500"></span>
            <span className="text-sm font-medium text-gray-700">Verified & Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, value, danger }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow border-b-4 border-transparent hover:border-blue-500 transition-all">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <h3 className={`text-2xl font-bold ${danger ? 'text-red-600' : 'text-gray-800'}`}>
        {value}
      </h3>
    </div>
  );
}