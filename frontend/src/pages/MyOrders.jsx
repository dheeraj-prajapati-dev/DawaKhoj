import React, { useEffect, useState, useCallback } from 'react';
import { API, useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client'; 
import { toast, Toaster } from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import { 
  Package, Download, Star, Clock, 
  CheckCircle2, XCircle, ShoppingBag, 
  ChevronRight, Calendar, ReceiptText 
} from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingModal, setRatingModal] = useState({ show: false, orderId: null });
  const [selectedStars, setSelectedStars] = useState(5);
  const navigate = useNavigate();
  const { user } = useAuth();

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
            style: { background: '#0f172a', color: '#fff', borderRadius: '15px', border: '1px solid #1e293b' },
            icon: '💊' 
        });
        fetchMyOrders();
      });
    }

    return () => { socket.disconnect(); };
  }, [user, SOCKET_URL]);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Accepted': return 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]';
      default: return 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse';
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
        <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-blue-600/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="mt-8 font-black text-blue-500 uppercase tracking-[0.4em] text-[10px] animate-pulse">Syncing Pharmacy Network</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-32 pb-20 px-6">
      <Toaster position="bottom-right" />
      
      {/* Background Glow */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10"></div>

      <div className="max-w-5xl mx-auto">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
                    <ReceiptText size={14} /> Transaction History
                </div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter italic bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent leading-none">
                    My Orders
                </h1>
            </div>
            
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 px-8 py-4 rounded-[2rem] flex items-center gap-6 shadow-2xl">
                <div className="text-center">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total</p>
                    <p className="text-2xl font-black text-blue-400 leading-none">{orders.length}</p>
                </div>
                <div className="w-[1px] h-8 bg-slate-800"></div>
                <div className="text-center">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Active</p>
                    <p className="text-2xl font-black text-emerald-400 leading-none">
                        {orders.filter(o => o.status !== 'Delivered' && o.status !== 'Rejected').length}
                    </p>
                </div>
            </div>
        </header>

        <div className="space-y-6">
          {orders.length > 0 ? orders.map((order, idx) => (
            <div 
              key={order._id} 
              className="group relative bg-slate-900/30 border border-slate-800/50 rounded-[3rem] hover:border-blue-500/30 transition-all duration-500 backdrop-blur-md overflow-hidden animate-in slide-in-from-bottom-4"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="p-8 md:p-10 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-8">
                
                {/* Product Info */}
                <div className="flex gap-6 items-center">
                  <div className="w-20 h-20 bg-slate-950 border border-slate-800 rounded-3xl flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform duration-500">
                    {order.medicineName.toLowerCase().includes('syrup') ? '🧪' : '💊'}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-black tracking-tight group-hover:text-blue-400 transition-colors uppercase italic">{order.medicineName}</h3>
                        <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                            <ShoppingBag size={12} className="text-blue-500" /> {order.pharmacy?.storeName || 'Local Pharmacy'}
                        </p>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                            <Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                  </div>
                </div>

                {/* Status & Price */}
                <div className="flex flex-row md:flex-col justify-between items-end gap-4 border-t md:border-t-0 border-slate-800/50 pt-6 md:pt-0">
                  <div className="text-right">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${getStatusStyle(order.status)} mb-3 inline-block`}>
                        {order.status}
                    </span>
                    <div className="flex items-start justify-end gap-1">
                        <span className="text-sm font-black text-emerald-500 mt-1">₹</span>
                        <p className="text-4xl font-black text-white italic tracking-tighter leading-none">{order.price}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {order.status === 'Delivered' && (
                        <>
                         <button 
                            onClick={() => {/* downloadInvoice logic */}} 
                            className="p-3 bg-slate-950 border border-slate-800 hover:border-blue-500/50 text-slate-400 hover:text-blue-400 rounded-2xl transition-all shadow-xl"
                            title="Invoice"
                         >
                            <Download size={18} />
                         </button>
                         {!order.isRated ? (
                            <button 
                                onClick={() => setRatingModal({ show: true, orderId: order._id })} 
                                className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20"
                            >
                                Rate Service
                            </button>
                         ) : (
                            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl text-yellow-500">
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
            <div className="py-32 text-center bg-slate-900/10 border-2 border-dashed border-slate-800 rounded-[4rem] flex flex-col items-center">
               <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mb-6">
                  <Package className="text-slate-700" size={40} />
               </div>
               <h3 className="text-2xl font-black text-slate-500 tracking-tight italic uppercase">No Orders Yet</h3>
               <button 
                onClick={() => navigate('/search')}
                className="mt-8 px-10 py-4 bg-blue-600/10 border border-blue-500/20 text-blue-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-blue-600 hover:text-white transition-all"
               >
                Start Shopping
               </button>
            </div>
          )}
        </div>
      </div>

      {/* ⭐ Rating Modal (Advanced Dark UI) */}
      {ratingModal.show && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 p-12 rounded-[3.5rem] w-full max-w-sm shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600"></div>
            
            <h2 className="text-4xl font-black text-center mb-3 tracking-tighter italic">Service Quality</h2>
            <p className="text-center text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] mb-10">Feedback helps us improve</p>
            
            <div className="flex justify-center gap-4 mb-12">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                    key={star} 
                    onMouseEnter={() => setSelectedStars(star)}
                    onClick={() => setSelectedStars(star)} 
                    className={`text-4xl transition-all duration-300 transform hover:scale-125 ${selectedStars >= star ? 'text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'text-slate-800'}`}
                >
                    ★
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <button className="w-full py-5 font-black bg-blue-600 rounded-[1.5rem] shadow-2xl shadow-blue-900/30 hover:bg-blue-500 transition-all uppercase tracking-[0.2em] text-[11px]">
                Submit Review
              </button>
              <button 
                onClick={() => setRatingModal({ show: false, orderId: null })} 
                className="w-full py-2 font-black text-slate-600 text-[10px] uppercase tracking-widest hover:text-white transition-all"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;