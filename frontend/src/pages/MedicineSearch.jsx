import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const MedicineSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  
  // Naye states for Modal and Suggestions
  const [showModal, setShowModal] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const navigate = useNavigate();

  // 1. Geolocation Setup
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => toast.error("Location access denied. Directions might be less accurate.")
      );
    }
  }, []);

  // 2. Debounced Search Logic (Auto-fetch typing karte waqt)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim().length > 2) {
        performSearch();
      }
    }, 600); // 0.6 seconds wait karega typing rukne ka

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://dawakhoj.onrender.com/api/search/medicine`, {
        params: { 
          q: query,
          lat: userCoords?.lat,
          lng: userCoords?.lng
        }
      });
      if (res.data.success) setResults(res.data.results);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async (item) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return toast.error("Bhai, pehle login kar lo!");

      const res = await axios.post('https://dawakhoj.onrender.com/api/orders/create', {
        pharmacyId: item.pharmacyId,
        medicineName: item.medicineName,
        price: item.price
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setLastOrder(item);
        setShowModal(true); // Success Modal dikhao
        toast.success("Order Placed!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed");
    }
  };

  const getDirections = (pharmacyName) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pharmacyName)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen bg-gray-50 relative">
      <Toaster position="top-center" />

      {/* SUCCESS MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl scale-in-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">Order Success!</h2>
            <p className="text-gray-500 mb-6 text-sm">Aapka order <span className="font-bold text-blue-600">{lastOrder?.medicineName}</span> ke liye bhej diya gaya hai.</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => { setShowModal(false); navigate('/my-orders'); }}
                className="bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
              >
                MY ORDERS DEKHEIN
              </button>
              <button onClick={() => setShowModal(false)} className="text-gray-400 font-bold hover:text-gray-600 text-xs">
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-4xl font-black text-center mb-10 text-blue-700 italic">DawaKhoj+</h1>
      
      {/* SEARCH BAR */}
      <div className="relative mb-10">
        <div className="flex gap-2 shadow-2xl p-2 bg-white rounded-2xl border border-gray-100">
          <input 
            className="flex-1 p-4 outline-none text-lg bg-transparent" 
            placeholder="Dawa ka naam likhein..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center px-4">
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            ) : (
              <span className="text-gray-300">🔍</span>
            )}
          </div>
        </div>
      </div>

      {/* RESULTS SECTION */}
      <div className="space-y-8">
        {results.length > 0 ? results.map((group, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
            <h2 className="text-sm font-black text-gray-400 mb-4 uppercase tracking-[0.2em] border-b pb-2">
              Brand Family: {group.brand}
            </h2>
            <div className="grid gap-4">
              {group.options.map((item, i) => (
                <div key={i} className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all group">
                  <div className="mb-4 md:mb-0">
                    <h3 className="font-black text-2xl text-gray-800 group-hover:text-blue-700 transition-colors">{item.medicineName}</h3>
                    <p className="text-blue-500 font-bold flex items-center gap-1 mt-1">
                      <span className="text-xs">🏥</span> {item.pharmacy}
                    </p>
                    <div className="flex gap-3 mt-4">
                      <button 
                        onClick={() => handleOrder(item)}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-black hover:bg-blue-700 shadow-lg active:scale-95 transition-all"
                      >
                        ORDER NOW
                      </button>
                      <button 
                        onClick={() => getDirections(item.pharmacy)}
                        className="bg-white text-gray-700 border border-gray-200 px-6 py-2.5 rounded-xl text-xs font-black hover:bg-gray-100 flex items-center gap-1"
                      >
                        📍 LOCATION
                      </button>
                    </div>
                  </div>
                  <div className="text-left md:text-right w-full md:w-auto border-t md:border-none pt-3 md:pt-0">
                    <p className="text-4xl font-black text-green-600">₹{item.price}</p>
                    <p className={`text-xs font-bold mt-1 ${item.stock > 0 ? 'text-gray-400' : 'text-red-400'}`}>
                      {item.stock > 0 ? `In Stock: ${item.stock}` : 'Out of Stock'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )) : query.length > 2 && !loading && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 text-xl font-bold">Bhai, ye medicine abhi nahi mili ☹️</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineSearch;