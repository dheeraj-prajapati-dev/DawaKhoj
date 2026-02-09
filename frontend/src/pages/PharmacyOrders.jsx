import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast'; // Alert ki jagah toast use karein

export default function PharmacyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🚀 Local testing ke liye URL flexible rakhein
  const API_BASE = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api/orders' 
    : 'https://dawakhoj.onrender.com/api/orders';

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/pharmacy-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error("Orders load nahi ho paye");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    // Basic confirmation for Rejection
    if (newStatus === 'Rejected' && !window.confirm("Kya aap sach mein ye order reject karna chahte hain?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`${API_BASE}/status/${orderId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
        toast.success(`Order ${newStatus} successfully! 🎉`);
        fetchOrders(); // List refresh karein
      }
    } catch (err) {
      console.error("Update Error:", err.response?.data);
      toast.error(err.response?.data?.message || "Status update failed");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen font-bold text-blue-600">
      Orders load ho rahe hain...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">INCOMING ORDERS 📦</h1>
          <button 
            onClick={fetchOrders}
            className="text-sm bg-white border px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 font-bold"
          >
            Refresh List 🔄
          </button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b text-gray-400 uppercase font-black text-[10px] tracking-widest">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Medicine</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-20 text-gray-400 font-medium">
                      Abhi tak koi order nahi aaya hai.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-800">{order.user?.name || "Customer"}</div>
                        <div className="text-gray-400 text-xs font-medium">{order.user?.phone || 'No Contact'}</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-blue-700">{order.medicineName}</td>
                      <td className="px-6 py-4 font-black text-gray-900">₹{order.price}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter
                          ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-600 border border-yellow-200' : 
                            order.status === 'Accepted' ? 'bg-blue-100 text-blue-600 border border-blue-200' : 
                            order.status === 'Delivered' ? 'bg-green-100 text-green-600 border border-green-200' :
                            'bg-red-100 text-red-600 border border-red-200'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          {order.status === 'Pending' && (
                            <button 
                              onClick={() => updateStatus(order._id, 'Accepted')}
                              className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
                            >
                              Accept
                            </button>
                          )}
                          {order.status === 'Accepted' && (
                            <button 
                              onClick={() => updateStatus(order._id, 'Delivered')}
                              className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 shadow-lg shadow-green-100 transition-all active:scale-95"
                            >
                              Mark Delivered
                            </button>
                          )}
                          {(order.status === 'Pending' || order.status === 'Accepted') && (
                            <button 
                              onClick={() => updateStatus(order._id, 'Rejected')}
                              className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition font-bold text-xs"
                            >
                              Reject
                            </button>
                          )}
                          {order.status === 'Delivered' && (
                            <span className="text-gray-400 italic text-xs">Completed ✅</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}