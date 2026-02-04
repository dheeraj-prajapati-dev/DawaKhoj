import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client'; 
import { toast, Toaster } from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const downloadInvoice = (order) => {
    try {
      toast.loading("Preparing your invoice...", { id: 'pdf-gen' });
      const doc = new jsPDF();

      // Premium Header
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, 210, 50, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.text("DawaKhoj+", 14, 32);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Digital Health Receipt", 14, 42);

      // Order Info Section
      doc.setTextColor(50, 50, 50);
      doc.setFontSize(10);
      doc.text(`Invoice ID: #INV-${order._id.substring(18).toUpperCase()}`, 14, 65);
      doc.text(`Order Date: ${new Date(order.createdAt).toLocaleString()}`, 14, 72);
      doc.text(`Pharmacy: ${order.pharmacy?.storeName || 'N/A'}`, 14, 79);

      // Table Setup
      autoTable(doc, {
        startY: 90,
        head: [['Service/Medicine', 'Qty', 'Unit Price', 'Total']],
        body: [
          [order.medicineName, '01', `INR ${order.price}`, `INR ${order.price}`]
        ],
        styles: { font: 'helvetica', fontSize: 10, cellPadding: 6 },
        headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
        columnStyles: { 3: { halign: 'right', fontStyle: 'bold' } },
        theme: 'striped'
      });

      const finalY = doc.lastAutoTable.finalY + 20;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`Amount Paid: Rs. ${order.price}`, 140, finalY);

      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(150);
      doc.text("This is a computer generated invoice. No signature required.", 14, finalY + 30);

      doc.save(`DawaKhoj_Invoice_${order.medicineName}.pdf`);
      toast.success("Downloaded Successfully! 📄", { id: 'pdf-gen' });

    } catch (error) {
      console.error("PDF Gen Error:", error);
      toast.error("Failed to generate PDF", { id: 'pdf-gen' });
    }
  };

  useEffect(() => {
    const socket = io('https://dawakhoj.onrender.com', {
        transports: ['websocket', 'polling']
    });

    const fetchMyOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://dawakhoj.onrender.com/api/orders/my-orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) setOrders(res.data.orders);
        setLoading(false);
      } catch (err) {
        console.error("Orders Load Error:", err);
        setLoading(false);
      }
    };

    fetchMyOrders();

    const user = JSON.parse(localStorage.getItem('user'));
    if (user?._id) {
      socket.emit('join_room', user._id); 
      socket.on('order_status_update', (data) => {
        toast.success(data.message, { 
            icon: '💊', 
            duration: 6000,
            style: { borderRadius: '15px', fontWeight: 'bold' }
        });
        setOrders(prev => prev.map(o => o._id === data.orderId ? { ...o, status: data.status } : o));
      });
    }

    return () => {
      socket.off('order_status_update');
      socket.disconnect();
    };
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-blue-600 animate-pulse">LOADING ORDERS...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen bg-gray-50/50 font-sans">
      <Toaster position="top-center" />
      
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Order History</h1>
        <p className="text-gray-500 font-bold mt-1 uppercase text-xs tracking-[0.3em]">Track and manage your medical supplies</p>
      </div>

      <div className="space-y-6">
        {orders.length > 0 ? orders.map(order => (
          <div key={order._id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all hover:shadow-xl hover:shadow-blue-100/50 group">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-black text-2xl text-gray-800 tracking-tight">{order.medicineName}</h3>
                {order.status === 'Pending' && <span className="h-2 w-2 rounded-full bg-yellow-400 animate-ping"></span>}
              </div>
              <p className="text-sm text-blue-600 font-black flex items-center gap-2 uppercase tracking-widest">
                <span className="bg-blue-50 px-3 py-1 rounded-full">🏪 {order.pharmacy?.storeName}</span>
              </p>
              
              {order.status === 'Delivered' && (
                <button 
                  onClick={() => downloadInvoice(order)}
                  className="mt-5 text-[10px] bg-gray-900 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-3 active:scale-95 shadow-lg shadow-gray-200"
                >
                  Download Invoice 📄
                </button>
              )}
            </div>

            <div className="flex flex-col items-end gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
              <p className="font-black text-3xl text-gray-900 tracking-tighter">₹{order.price}</p>
              <span className={`text-[11px] font-black px-6 py-2.5 rounded-2xl uppercase tracking-[0.15em] border-2 shadow-sm ${
                order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-100' :
                order.status === 'Accepted' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                'bg-yellow-50 text-yellow-700 border-yellow-100'
              }`}>
                {order.status}
              </span>
            </div>
          </div>
        )) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-gray-100">
            <p className="text-gray-300 font-black text-3xl italic tracking-tighter">No orders found yet! 🛒</p>
            <button onClick={() => navigate('/')} className="mt-6 text-blue-600 font-black uppercase text-xs hover:underline">Start Shopping Now</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;