import React, { useState } from 'react';
import axios from 'axios';

const MedicineSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);

    try {
      const res = await axios.get(`http://localhost:5000/api/search/medicine`, {
        params: { q: query }
      });

      if (res.data.success) {
        setResults(res.data.results);
      }
    } catch (err) {
      console.error("Frontend Error:", err);
      alert("Search failed. Check if backend is running!");
    } finally {
      setLoading(false);
    }
  };

  // --- NAYA ORDER LOGIC ---
  const handleOrder = async (item) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert("Bhai, pehle login kar lo!");

      const orderData = {
        pharmacyId: item.pharmacyId,
        medicineName: item.medicineName,
        price: item.price
      };

      const res = await axios.post('http://localhost:5000/api/orders/create', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        alert(`🎉 Order successful for ${item.medicineName}! Check Pharmacy Dashboard.`);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Order placement failed");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen bg-gray-50">
      <h1 className="text-4xl font-black text-center mb-10 text-blue-700">DawaKhoj</h1>
      
      <form onSubmit={handleSearch} className="flex gap-2 mb-10 shadow-xl p-3 bg-white rounded-2xl">
        <input 
          className="flex-1 p-4 outline-none text-lg border-none" 
          placeholder="Search Dolo, Crocin, Paracetamol..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-xl font-bold transition-all">
          {loading ? 'Searching...' : 'SEARCH'}
        </button>
      </form>

      <div className="space-y-8">
        {results.length > 0 ? results.map((group, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
            <h2 className="text-xl font-bold text-blue-900 mb-4 uppercase tracking-widest border-b pb-2">
              Brand: {group.brand}
            </h2>
            <div className="grid gap-4">
              {group.options.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div>
                    <h3 className="font-bold text-2xl text-gray-800">{item.medicineName}</h3>
                    <p className="text-blue-500 font-bold">🏪 {item.pharmacy}</p>
                    {/* ORDER BUTTON ADDED HERE */}
                    <button 
                      onClick={() => handleOrder(item)}
                      className="mt-2 bg-blue-600 text-white px-4 py-1 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
                    >
                      ORDER NOW
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-green-600">₹{item.price}</p>
                    <p className="font-bold text-gray-400">Stock: {item.stock}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )) : !loading && (
          <div className="text-center py-20 bg-white rounded-3xl border-4 border-dashed border-gray-100">
            <p className="text-gray-400 text-2xl font-medium">Try searching for something in your DB!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineSearch;