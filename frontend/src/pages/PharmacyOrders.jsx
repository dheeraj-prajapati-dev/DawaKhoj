import { useEffect, useState } from 'react';
import { API } from '../context/AuthContext'; // 🔥 API instance use karein
import { toast } from 'react-hot-toast';

export default function PharmacyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      // 🔥 No manual token/headers needed
      const res = await API.get('/orders/pharmacy-orders');
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
    if (newStatus === 'Rejected' && !window.confirm("Kya aap sach mein ye order reject karna chahte hain?")) return;

    try {
      const res = await API.put(`/orders/status/${orderId}`, { status: newStatus });
      
      if (res.data.success) {
        toast.success(`Order ${newStatus} successfully! 🎉`);
        fetchOrders(); // Refresh list
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Status update failed");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen font-black text-blue-600 animate-pulse">
      ORDERS LOAD HO RAHE HAIN...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">INCOMING ORDERS 📦</h1>
          <button 
            onClick={fetchOrders}
            className="text-sm bg-white border-2 border-gray-100 px-4 py-2 rounded-xl shadow-sm hover:bg-gray-50 font-black uppercase tracking-widest transition-all"
          >
            Refresh List 🔄
          </button>
        </div>
        
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b text-gray-400 uppercase font-black text-[10px] tracking-[0.2em]">
                <tr>
                  <th className="px-6 py-5">Customer</th>
                  <th className="px-6 py-5">Medicine</th>
                  <th className="px-6 py-5">Amount</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-24 text-gray-400 font-black uppercase tracking-widest italic">
                      Abhi tak koi order nahi aaya hai.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-black text-gray-800 uppercase italic">{order.user?.name || "Customer"}</div>
                        <div className="text-gray-400 text-[10px] font-bold">{order.user?.phone || 'No Contact'}</div>
                      </td>
                      <td className="px-6 py-4 font-black text-blue-700 italic uppercase">{order.medicineName}</td>
                      <td className="px-6 py-4 font-black text-gray-900 text-lg">₹{order.price}</td>
                      <td className="px-6 py-4">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                          ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : 
                            order.status === 'Accepted' ? 'bg-blue-100 text-blue-600' : 
                            order.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                            'bg-red-100 text-red-600'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          {order.status === 'Pending' && (
                            <button 
                              onClick={() => updateStatus(order._id, 'Accepted')}
                              className="bg-blue-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-90 shadow-lg shadow-blue-100"
                            >
                              Accept
                            </button>
                          )}
                          {order.status === 'Accepted' && (
                            <button 
                              onClick={() => updateStatus(order._id, 'Delivered')}
                              className="bg-green-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all active:scale-90 shadow-lg shadow-green-100"
                            >
                              Deliver
                            </button>
                          )}
                          {(order.status === 'Pending' || order.status === 'Accepted') && (
                            <button 
                              onClick={() => updateStatus(order._id, 'Rejected')}
                              className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition font-black text-[10px] uppercase"
                            >
                              Reject
                            </button>
                          )}
                          {order.status === 'Delivered' && (
                            <span className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Completed ✅</span>
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