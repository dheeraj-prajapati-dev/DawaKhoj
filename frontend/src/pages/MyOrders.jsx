import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client'; 
import { toast, Toaster } from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingModal, setRatingModal] = useState({ show: false, orderId: null });
  const [selectedStars, setSelectedStars] = useState(5);
  const navigate = useNavigate();

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
      const token = localStorage.getItem('token');
      const res = await axios.get('https://dawakhoj.onrender.com/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setOrders(sortOrders(res.data.orders));
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const submitRating = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`https://dawakhoj.onrender.com/api/orders/rate/${ratingModal.orderId}`, 
        { rating: selectedStars },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success("Thank you for your rating! ⭐");
        setRatingModal({ show: false, orderId: null });
        fetchMyOrders(); // Refresh to hide the rate button
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Rating failed");
    }
  };

  useEffect(() => {
    const socket = io('https://dawakhoj.onrender.com', { transports: ['websocket', 'polling'] });
    fetchMyOrders();
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      socket.emit('join_room', user._id || user.id); 
      socket.on('order_status_update', (data) => {
        toast.success(data.message, { icon: '💊', duration: 6000 });
        setOrders(prev => sortOrders(prev.map(o => o._id === data.orderId ? { ...o, status: data.status } : o)));
      });
    }
    return () => { socket.off('order_status_update'); socket.disconnect(); };
  }, [sortOrders]);

  const downloadInvoice = (order) => { /* Invoice logic same as before... */ };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="font-black text-blue-600 animate-pulse uppercase tracking-widest text-center">Updating Your Health History...</div>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen bg-gray-50/50 font-sans">
      <Toaster position="top-center" />
      
      <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">My Orders</h1>
          <p className="text-gray-500 font-bold mt-1 uppercase text-[10px] tracking-[0.3em]">Live Tracking & Reviews Active ⚡</p>
      </div>

      <div className="space-y-6">
        {orders.length > 0 ? orders.map(order => (
          <div key={order._id} className={`bg-white p-8 rounded-[2.5rem] shadow-sm border transition-all duration-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${order.status === 'Delivered' || order.status === 'Rejected' ? 'opacity-70 grayscale-[0.2] border-gray-100 scale-95' : 'border-blue-100 shadow-blue-100/30'}`}>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-black text-2xl text-gray-800 tracking-tight">{order.medicineName}</h3>
                {['Pending', 'Accepted', 'Out for Delivery'].includes(order.status) && (
                  <span className="flex h-3 w-3"><span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span></span>
                )}
              </div>
              <p className="text-sm text-blue-600 font-black flex items-center gap-2 uppercase tracking-widest mb-4">
                <span className="bg-blue-50 px-3 py-1 rounded-full text-[10px]">🏪 {order.pharmacy?.storeName || 'Pharmacy'}</span>
              </p>
              
              <div className="flex gap-2">
                {order.status === 'Delivered' && (
                  <>
                    <button onClick={() => downloadInvoice(order)} className="text-[10px] bg-gray-900 text-white px-5 py-2.5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 shadow-lg">Receipt 📄</button>
                    {!order.isRated ? (
                      <button onClick={() => setRatingModal({ show: true, orderId: order._id })} className="text-[10px] bg-yellow-400 text-black px-5 py-2.5 rounded-2xl font-black uppercase tracking-widest hover:bg-yellow-500 transition-all flex items-center gap-2 shadow-lg">Rate ⭐</button>
                    ) : (
                      <span className="text-[10px] bg-green-100 text-green-700 px-5 py-2.5 rounded-2xl font-black uppercase tracking-widest">Rated {order.rating}★</span>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
              <p className="font-black text-3xl text-gray-900 tracking-tighter">₹{order.price}</p>
              <span className={`text-[11px] font-black px-6 py-2.5 rounded-2xl uppercase tracking-[0.15em] border-2 ${order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-100' : order.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100 animate-pulse'}`}>{order.status}</span>
            </div>
          </div>
        )) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-gray-100"><p className="text-gray-300 font-black text-3xl italic tracking-tighter">No orders yet! 🛒</p></div>
        )}
      </div>

      {/* ⭐ Rating Modal */}
      {ratingModal.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white p-10 rounded-[3rem] w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-300">
            <h2 className="text-3xl font-black text-center mb-2 tracking-tighter text-gray-900">How was the service?</h2>
            <p className="text-center text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">Tap a star to rate</p>
            <div className="flex justify-center gap-3 mb-10">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setSelectedStars(star)} className={`text-5xl transition-all transform active:scale-90 ${selectedStars >= star ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-gray-100'}`}>★</button>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={submitRating} className="w-full py-4 font-black bg-blue-600 text-white rounded-3xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all">SUBMIT RATING</button>
              <button onClick={() => setRatingModal({ show: false, orderId: null })} className="w-full py-2 font-bold text-gray-400 text-xs uppercase hover:text-gray-600 transition-all">Maybe Later</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;