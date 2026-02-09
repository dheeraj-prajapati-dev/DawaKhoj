import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const MedicineSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  const [sortBy, setSortBy] = useState('price-low');
  const [showModal, setShowModal] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const navigate = useNavigate();

  const BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://dawakhoj.onrender.com';

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => toast.error("Please enable location access.")
      );
    }
  }, []);

  const performSearch = async () => {
    if (query.trim().length <= 2) {
      setResults([]);
      return;
    }
    if (!userCoords) return;

    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/search/medicine`, {
        params: { 
          q: query,
          lat: userCoords.lat,
          lng: userCoords.lng
        }
      });
      if (res.data.success) {
        setResults(res.data.results || []);
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      performSearch();
    }, 600);
    return () => clearTimeout(delayDebounceFn);
  }, [query, userCoords]);

  const sortedResults = useMemo(() => {
    if (!results || !Array.isArray(results)) return [];
    return results.map(group => {
      const options = Array.isArray(group.options) ? [...group.options] : [];
      const sortedOptions = options.sort((a, b) => {
        if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'distance') return (a.distance || 0) - (b.distance || 0);
        return 0;
      });
      return { ...group, options: sortedOptions };
    });
  }, [results, sortBy]);

  const handleOrder = async (item) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return toast.error("Please login first!");
      const res = await axios.post(`${BASE_URL}/api/orders/create`, {
        pharmacyId: item.pharmacyId,
        medicineName: item.medicineName,
        price: item.price
      }, { headers: { Authorization: `Bearer ${token}` } });

      if (res.data.success) {
        setLastOrder(item);
        setShowModal(true);
      }
    } catch (err) {
      toast.error("Order failed");
    }
  };

  const getDirections = (pharmacyName) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pharmacyName)}`, '_blank');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto min-h-screen bg-gray-50/50 font-sans">
      <Toaster position="top-center" />

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">✅</div>
            <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tighter uppercase italic">Confirmed!</h2>
            <p className="text-gray-500 mb-8 text-sm font-medium">Order for <span className="text-blue-600 font-bold">{lastOrder?.medicineName}</span> placed.</p>
            <button onClick={() => { setShowModal(false); navigate('/my-orders'); }} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest">TRACK ORDER 📦</button>
          </div>
        </div>
      )}

      <header className="text-center mb-12">
        <h1 className="text-5xl font-black text-blue-600 italic tracking-tighter">DawaKhoj+</h1>
      </header>
      
      <div className="sticky top-4 z-40 bg-gray-50/80 backdrop-blur-md pb-4">
        <div className="relative mb-6">
          <div className="flex gap-2 shadow-2xl p-2 bg-white rounded-3xl border-2 border-transparent focus-within:border-blue-500 transition-all">
            <input className="flex-1 p-4 outline-none text-lg bg-transparent font-medium" placeholder="Search medicine..." value={query} onChange={(e) => setQuery(e.target.value)} />
            <div className="flex items-center px-6">{loading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div> : "🔍"}</div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {[{ id: 'price-low', label: 'Cheapest 💰' }, { id: 'distance', label: 'Nearest 📍' }, { id: 'price-high', label: 'Premium 📈' }].map((filter) => (
            <button key={filter.id} onClick={() => setSortBy(filter.id)} className={`whitespace-nowrap px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2 ${sortBy === filter.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400 border-gray-100'}`}>
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-10 mt-8">
        {sortedResults.length > 0 ? sortedResults.map((group, idx) => (
          <div key={idx}>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] bg-gray-100 px-3 py-1 rounded-md">Brand: {group.brand}</h2>
              <div className="h-[1px] bg-gray-200 w-full"></div>
            </div>
            <div className="grid gap-6">
              {group.options.map((item, i) => (
                <div key={i} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 hover:border-blue-300 transition-all flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex-1">
                    <h3 className="font-black text-3xl text-gray-800 italic uppercase">{item.medicineName}</h3>
                    <p className="text-blue-600 font-black text-xs uppercase">🏪 {item.pharmacy}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
  📍 { (typeof item.distance === 'number' && item.distance >= 0) 
       ? `APPROX. ${item.distance} KM AWAY` 
       : 'DISTANCE NOT AVAILABLE' }
</p>
                    <div className="flex gap-2 mt-6">
                      <button onClick={() => handleOrder(item)} disabled={item.stock === 0} className={`px-8 py-3 rounded-2xl text-[10px] font-black tracking-widest ${item.stock > 0 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                        {item.stock > 0 ? 'ORDER NOW ⚡' : 'OUT OF STOCK'}
                      </button>
                      <button onClick={() => getDirections(item.pharmacy)} className="bg-white text-gray-900 border-2 border-gray-100 px-6 py-3 rounded-2xl text-[10px] font-black">MAPS 🚩</button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-5xl font-black text-gray-900"><span className="text-2xl text-green-600">₹</span>{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )) : query.length > 2 && !loading && <p className="text-center text-gray-400 font-bold mt-10">No medicine found nearby.</p>}
      </div>
    </div>
  );
};

export default MedicineSearch;