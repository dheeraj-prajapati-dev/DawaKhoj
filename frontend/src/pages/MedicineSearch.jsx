import React, { useState, useEffect, useMemo } from 'react';
import { API } from '../context/AuthContext';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import MedicineResultCard from '../components/MedicineResultCard';
import { 
  Search, MapPin, CheckCircle2, PackageX,
  ChevronLeft, Filter, Loader2, Sparkles, Zap
} from 'lucide-react';

const MedicineSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  const [sortBy, setSortBy] = useState('price-low');
  const [showModal, setShowModal] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeCategory = searchParams.get('category');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserCoords({ lat: position.coords.latitude, lng: position.coords.longitude }),
        () => toast.error("Location access required.")
      );
    }
  }, []);

  const performSearch = async () => {
    // 🔥 Search query check to prevent toLowerCase error
    const safeQuery = (query || "").trim();
    if ((safeQuery.length <= 2 && !activeCategory) || !userCoords) return;

    setLoading(true);
    try {
      const res = await API.get('/search/medicine', {
        params: { q: safeQuery, category: activeCategory, lat: userCoords.lat, lng: userCoords.lng }
      });
      if (res.data.success) {
        // 🔥 Critical Fix: Passing _id from group to each option
        const formattedResults = res.data.results.flatMap(group => 
          group.options.map(opt => ({
            ...opt,
            _id: group._id, // Mapping the main medicine ID
            brand: group.brand
          }))
        );
        setResults(formattedResults);
      }
    } catch (err) {
      toast.error("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => performSearch(), 600);
    return () => clearTimeout(delayDebounceFn);
  }, [query, userCoords, activeCategory]);

  const sortedResults = useMemo(() => {
    if (!results) return [];
    return [...results].sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'distance') return a.distance - b.distance;
      return 0;
    });
  }, [results, sortBy]);

  const handleOrder = async (item) => {
    try {
      // Backend expects pharmacyId, medicineName, and price
      const res = await API.post('/orders/create', {
        pharmacyId: item.pharmacyId,
        medicineName: item.name || item.medicineName,
        price: item.price
      });

      if (res.data.success) {
        setLastOrder(item);
        setShowModal(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 relative">
      <Toaster position="top-center" />
      
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center z-[100] p-6">
          <div className="bg-slate-900 border border-blue-500/30 rounded-[3rem] p-10 max-w-sm w-full text-center">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
               <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black mb-2 tracking-tighter uppercase italic">Confirmed!</h2>
            <p className="text-slate-400 mb-8 text-sm">
              Order for <span className="text-blue-400 font-bold">{lastOrder?.name || lastOrder?.medicineName}</span> placed.
            </p>
            <button onClick={() => { setShowModal(false); navigate('/my-orders'); }} className="w-full bg-blue-600 py-5 rounded-2xl font-black text-[10px] uppercase">Track Order 📦</button>
          </div>
        </div>
      )}

      <header className="max-w-5xl mx-auto mb-12">
        <div className="flex items-center justify-between mb-10">
            <button onClick={() => navigate('/')} className="p-4 bg-slate-900 rounded-2xl border border-slate-800"><ChevronLeft className="w-5 h-5"/></button>
            <h1 className="text-4xl font-black italic uppercase">Dawa<span className="text-blue-500">Khoj+</span></h1>
        </div>
        <div className="relative">
            <input 
                className="w-full bg-slate-900/60 border border-slate-800 rounded-[2.5rem] pl-16 pr-8 py-6 text-xl font-bold outline-none focus:border-blue-500/50"
                placeholder="Search Medicine..."
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
            />
            <div className="absolute inset-y-0 left-6 flex items-center">
                {loading ? <Loader2 className="animate-spin text-blue-500" /> : <Search className="text-slate-600" />}
            </div>
        </div>
        <div className="flex gap-3 mt-6 overflow-x-auto no-scrollbar">
            {['price-low', 'distance', 'price-high'].map(id => (
                <button key={id} onClick={() => setSortBy(id)} className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest ${sortBy === id ? 'bg-blue-600' : 'bg-slate-900 text-slate-500'}`}>
                    {id.replace('-', ' ')}
                </button>
            ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto pb-24">
        {sortedResults.map((med, idx) => (
          <MedicineResultCard key={idx} medicine={med} onOrder={handleOrder} />
        ))}
      </main>
    </div>
  );
};

export default MedicineSearch;