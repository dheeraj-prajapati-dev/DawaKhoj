import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../context/AuthContext';
import { toast, Toaster } from 'react-hot-toast';
import { 
  ShoppingBag, RefreshCcw, ChevronLeft, 
  User, Phone, Hash, IndianRupee, Clock 
} from 'lucide-react';

export default function PharmacyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
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
        toast.success(`Order ${newStatus} ✅`, {
          style: { background: '#1e293b', color: '#fff', border: '1px solid #3b82f6' }
        });
        fetchOrders();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Status update failed");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-slate-950 font-black text-blue-500 animate-pulse uppercase tracking-[0.3em]">
      ACCESSING ORDER REGISTRY...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 font-sans text-white relative">
      <Toaster position="top-right" />
      
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10"></div>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <button 
              onClick={() => navigate("/pharmacy/dashboard")} 
              className="text-slate-500 hover:text-blue-500 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest mb-2 transition-colors"
            >
              <ChevronLeft size={14} /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-black tracking-tighter italic flex items-center gap-3 uppercase">
              Order <span className="text-blue-500">History</span> 
              <ShoppingBag className="text-blue-500 w-6 h-6" />
            </h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Full Transaction Log 🧾</p>
          </div>

          <button 
            onClick={fetchOrders}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-6 py-3 rounded-2xl hover:border-blue-500/50 transition-all font-bold text-xs uppercase tracking-widest text-slate-300"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Sync Database
          </button>
        </div>
        
        {/* Orders Table Container */}
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-slate-800/60 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-950/50 border-b border-slate-800">
                <tr className="text-slate-500 uppercase font-black text-[10px] tracking-[0.2em]">
                  <th className="px-8 py-6">Customer Info</th>
                  <th className="px-8 py-6">Medicine Details</th>
                  <th className="px-8 py-6">Transaction</th>
                  <th className="px-8 py-6">Current Status</th>
                  <th className="px-8 py-6 text-center">Protocol Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-32 text-slate-600 font-black uppercase tracking-widest italic">
                      <Clock className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      No Transactions Recorded
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-blue-600/5 transition-all group">
                      {/* Customer Info */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-blue-500 font-black border border-slate-700">
                            {order.user?.name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <div className="font-black text-slate-200 uppercase italic group-hover:text-white">{order.user?.name || "Anonymous"}</div>
                            <div className="flex items-center gap-1 text-slate-500 text-[9px] font-bold mt-1">
                              <Phone size={10} /> {order.user?.phone || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Medicine Details */}
                      <td className="px-8 py-6">
                        <div className="font-black text-blue-400 italic uppercase tracking-tight">{order.medicineName}</div>
                        <div className="text-[9px] text-slate-500 font-bold uppercase mt-1">ID: {order._id.slice(-6)}</div>
                      </td>

                      {/* Price */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-1 font-black text-slate-100 text-lg italic">
                          <IndianRupee size={16} className="text-emerald-500" />
                          {order.price}
                        </div>
                      </td>

                      {/* Status Pills */}
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border
                          ${order.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse' : 
                            order.status === 'Accepted' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                            order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                            'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                          {order.status}
                        </span>
                      </td>

                      {/* Logic Based Actions */}
                      <td className="px-8 py-6">
                        <div className="flex justify-center gap-2">
                          {order.status === 'Pending' && (
                            <button 
                              onClick={() => updateStatus(order._id, 'Accepted')}
                              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20"
                            >
                              Accept
                            </button>
                          )}
                          {order.status === 'Accepted' && (
                            <button 
                              onClick={() => updateStatus(order._id, 'Delivered')}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20"
                            >
                              Deliver
                            </button>
                          )}
                          {(order.status === 'Pending' || order.status === 'Accepted') && (
                            <button 
                              onClick={() => updateStatus(order._id, 'Rejected')}
                              className="bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-xl transition font-black text-[10px] uppercase border border-slate-700"
                            >
                              Reject
                            </button>
                          )}
                          {order.status === 'Delivered' && (
                            <div className="flex items-center gap-2 text-emerald-500/50 font-black text-[10px] uppercase tracking-[0.2em]">
                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                              ARCHIVED
                            </div>
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