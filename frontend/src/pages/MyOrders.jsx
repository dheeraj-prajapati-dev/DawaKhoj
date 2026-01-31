import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client'; 
import { toast, Toaster } from 'react-hot-toast';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // 1. Socket connection setup (Internal)
    const newSocket = io('https://dawakhoj.onrender.com');

    const fetchMyOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://dawakhoj.onrender.com/api/orders/my-orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) setOrders(res.data.orders);
      } catch (err) {
        console.error("Orders load error:", err);
      }
    };

    fetchMyOrders();

    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user._id) {
      // 2. Room join emit karein
      newSocket.emit('join_room', user._id); 
      console.log("Attempting to join room:", user._id);

      // 3. Status update listener
      newSocket.on('order_status_update', (data) => {
        console.log("Socket Data Received:", data);
        toast.success(data.message, { icon: '💊', duration: 5000 });
        
        // State update bina refresh ke
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === data.orderId ? { ...order, status: data.status } : order
          )
        );
      });
    }

    // Cleanup on unmount
    return () => {
      newSocket.off('order_status_update');
      newSocket.disconnect();
    };
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-black mb-8 text-gray-800">Mera Order History</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order._id} className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center transition-all hover:shadow-md">
            <div>
              <h3 className="font-bold text-lg">{order.medicineName}</h3>
              <p className="text-sm text-blue-600 font-medium">🏪 {order.pharmacy?.storeName}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-xl mb-1">₹{order.price}</p>
              <span className={`text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider border ${
                order.status === 'Delivered' ? 'bg-green-100 text-green-700 border-green-200' :
                order.status === 'Accepted' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                'bg-yellow-100 text-yellow-700 border-yellow-200 animate-pulse'
              }`}>
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;