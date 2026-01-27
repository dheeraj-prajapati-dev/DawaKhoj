import { useEffect, useState } from 'react';
import axios from 'axios';

export default function PharmacyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/orders/pharmacy-orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Status Update Function (Fixed Route Path)
  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      
      // Yahan maine '/update/' ko badal kar '/status/' kar diya hai jo aapke purane code mein tha
      await axios.put(`http://localhost:5000/api/orders/status/${orderId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert(`Order ${newStatus} successfully!`);
      fetchOrders(); 
    } catch (err) {
      console.error("Update Error:", err.response?.data);
      alert(err.response?.data?.message || "Status update failed");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading orders...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Incoming Orders</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-4">Customer Details</th>
              <th className="px-6 py-4">Medicine</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">No orders found.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800">{order.user?.name || "Unknown User"}</p>
                    <p className="text-gray-500 text-xs">{order.user?.phone}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-blue-600">{order.medicineName}</td>
                  <td className="px-6 py-4 font-bold">₹{order.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold 
                      ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                        order.status === 'Accepted' ? 'bg-blue-100 text-blue-700' : 
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    {order.status === 'Pending' && (
                      <button 
                        onClick={() => updateStatus(order._id, 'Accepted')}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 shadow-sm"
                      >
                        Accept
                      </button>
                    )}
                    {order.status === 'Accepted' && (
                      <button 
                        onClick={() => updateStatus(order._id, 'Delivered')}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 shadow-sm"
                      >
                        Mark Delivered
                      </button>
                    )}
                    {(order.status === 'Pending' || order.status === 'Accepted') && (
                      <button 
                        onClick={() => updateStatus(order._id, 'Rejected')}
                        className="text-red-500 hover:text-red-700 font-medium text-xs"
                      >
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}