import React, { useEffect, useState, useCallback } from 'react';
import { API, useAuth } from '../context/AuthContext'; // 🔥 useAuth add kiya
import { io } from 'socket.io-client'; 
import { toast, Toaster } from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import { Package, Download, Star, Clock, CheckCircle2, XCircle, ShoppingBag } from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingModal, setRatingModal] = useState({ show: false, orderId: null });
  const [selectedStars, setSelectedStars] = useState(5);
  const navigate = useNavigate();
  const { user } = useAuth(); // Context se user liya

  const SOCKET_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://dawakhoj.onrender.com';

  const sortOrders = useCallback((orderList) => {
    const priority = { 'Pending': 1, 'Accepted': 2, 'Out for Delivery': 3, 'Delivered': 4, 'Rejected': 5 };
    return [...orderList].sort((a, b) => {
      if (priority[a.status] !== priority[b.status]) {
        return priority[a.status] - priority[b.status];
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, []);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get('/orders/my-orders');
      if (res.data.success) {
        setOrders(sortOrders(res.data.orders));
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired.");
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const socket = io(SOCKET_URL, { 
      transports: ['websocket'],
      withCredentials: true 
    });

    fetchMyOrders();
    
    if (user) {
      socket.emit('join_room', user._id || user.id); 
      socket.on('order_status_update', (data) => {
        toast.success(data.message, { 
            style: { background: '#1e293b', color: '#fff', borderRadius: '15px' },
            icon: '💊' 
        });
        fetchMyOrders(); // Re-fetch for updated list
      });
    }

    return () => { 
      socket.disconnect(); 
    };
  }, [user, SOCKET_URL]);

  const downloadInvoice = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235);
    doc.text("DawaKhoj+ Receipt", 14, 22);
    // ... (rest of your PDF logic is fine)
    doc.save(`Invoice_${order._id.slice(-6)}.pdf`);
    toast.success("Invoice Downloaded");
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse';
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_20px_rgba(37,99,235,0.3)]"></div>
        <div className="font-black text-blue-500 uppercase tracking-[0.3em] text-xs">Syncing Orders...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 pb-12 px-6">
      <Toaster />
      <div className="max-w-5xl mx-auto">
        
        <div className="flex justify-between items-end mb-12">
            <div>
                <h1 className="text-5xl font-black tracking-tighter italic bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">My Orders</h1>
                <p className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] mt-2">Track your healthcare journey</p>
            </div>
            <div className="hidden md:block bg-slate-900/50 border border-slate-800 px-6 py-3 rounded-2xl">
                <span className="text-gray-500 text-xs font-bold">Total Orders:</span>
                <span className="ml-2 text-xl font-black text-blue-400">{orders.length}</span>
            </div>
        </div>

        <div className="space-y-4">
          {orders.length > 0 ? orders.map(order => (
            <div key={order._id} className="group bg-slate-900/40 border border-slate-800/60 p-6 md:p-8 rounded-[2.5rem] hover:border-blue-500/30 transition-all duration-500 backdrop-blur-sm relative overflow-hidden">
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[60px] rounded-full group-hover:bg-blue-600/10 transition-colors"></div>

              <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-2xl shadow-inner">💊</div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tight group-hover:text-blue-400 transition-colors">{order.medicineName}</h3>
                        <p className="text-gray-500 text-xs font-bold flex items-center gap-1">
                            <ShoppingBag size={12} /> {order.pharmacy?.storeName || 'Pharmacy'}
                        </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                        {order.status}
                    </span>
                    <span className="px-5 py-2 bg-slate-800/50 text-gray-400 border border-slate-700/50 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Clock size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col justify-between items-end gap-4 min-w-[150px]">
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Paid</p>
                    <p className="text-3xl font-black text-white italic">₹{order.price}</p>
                  </div>

                  <div className="flex gap-2">
                    {order.status === 'Delivered' && (
                        <>
                         <button onClick={() => downloadInvoice(order)} className="p-3 bg-slate-800 hover:bg-blue-600 rounded-xl transition-all" title="Download Invoice">
                            <Download size={18} />
                         </button>
                         {!order.isRated ? (
                            <button onClick={() => setRatingModal({ show: true, orderId: order._id })} className="px-5 py-2 bg-yellow-500 text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20">
                                Rate
                            </button>
                         ) : (
                            <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-4 py-2 rounded-xl border border-yellow-500/20">
                                <span className="font-black text-xs">{order.rating}</span>
                                <Star size={14} fill="currentColor" />
                            </div>
                         )}
                        </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-24 text-center bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-[3rem]">
               <Package className="mx-auto text-slate-800 mb-4" size={64} />
               <h3 className="text-2xl font-bold text-slate-600">No orders found</h3>
               <p className="text-slate-700 mt-2">Dawa mangao, sehat banao! 💪</p>
            </div>
          )}
        </div>
      </div>

      {/* ⭐ Rating Modal (Dark) */}
      {ratingModal.show && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center z-[100] p-6">
          <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] w-full max-w-sm shadow-2xl scale-in-center">
            <h2 className="text-3xl font-black text-center mb-2 tracking-tighter">Rate Service</h2>
            <p className="text-center text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8">How was your experience?</p>
            
            <div className="flex justify-center gap-3 mb-10">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                    key={star} 
                    onClick={() => setSelectedStars(star)} 
                    className={`text-5xl transition-all ${selectedStars >= star ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.4)]' : 'text-slate-800 hover:text-slate-700'}`}
                >★</button>
              ))}
            </div>

            <div className="space-y-3">
              <button onClick={() => {/* your submitRating logic */}} className="w-full py-4 font-black bg-blue-600 rounded-2xl shadow-xl shadow-blue-900/20 hover:bg-blue-500 transition-all uppercase tracking-widest text-xs">Submit Rating</button>
              <button onClick={() => setRatingModal({ show: false, orderId: null })} className="w-full py-2 font-black text-slate-500 text-[10px] uppercase tracking-widest hover:text-white transition-all">Dismiss</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;