import React, { useState, useEffect, useMemo } from 'react';
import { API } from '../context/AuthContext';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import MedicineResultCard from '../components/MedicineResultCard'; // 🔥 Integrated
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
        (position) => {
          setUserCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        () => toast.error("Please enable location access for accurate results.")
      );
    }
  }, []);


  const performSearch = async () => {
    if ((query.trim().length <= 2 && !activeCategory) || !userCoords) return;

    setLoading(true);
    try {
      const res = await API.get('/search/medicine', {
        params: { 
          q: query,
          category: activeCategory,
          lat: userCoords.lat,
          lng: userCoords.lng
        }
      });
      if (res.data.success) {
        // Flat list for the UI
        const formattedResults = res.data.results.flatMap(group => 
          group.options.map(opt => ({
            ...opt,
            brand: group.brand
          }))
        );
        setResults(formattedResults);
      }
    } catch (err) {
      toast.error("Network Link Failed.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      performSearch();
    }, 600);
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
      const res = await API.post('/orders/create', {
        pharmacyId: item.pharmacyId,
        medicineName: item.name,
        price: item.price
      });

      if (res.data.success) {
        setLastOrder(item);
        setShowModal(true);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Order failed";
      toast.error(msg === "Please login first!" ? "Aap login nahi hain!" : msg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 relative overflow-hidden">
      <Toaster position="top-center" />
      
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10"></div>

      {/* 🚀 Order Confirmed Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center z-[100] p-6">
          <div className="bg-slate-900 border border-blue-500/30 rounded-[3rem] p-10 max-w-sm w-full text-center shadow-2xl">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
               <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black mb-2 tracking-tighter uppercase italic">Confirmed!</h2>
            <p className="text-slate-400 mb-8 text-sm leading-relaxed">
              Order for <span className="text-blue-400 font-bold">{lastOrder?.name}</span> placed successfully.
            </p>
            <button 
              onClick={() => { setShowModal(false); navigate('/my-orders'); }} 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all"
            >
              Track Your Order 📦
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="max-w-5xl mx-auto mb-12">
        <div className="flex items-center justify-between w-full mb-10">
            <button onClick={() => navigate('/')} className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                <ChevronLeft className="w-5 h-5 text-slate-400" />
            </button>
            <div className="text-right">
              <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
                Dawa<span className="text-blue-500">Khoj+</span>
              </h1>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2 italic">Hyper-Local Search Engine</p>
            </div>
        </div>

        {/* 🔍 Search Input Area */}
        <div className="sticky top-4 z-40 space-y-6">
            <div className="relative">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                    {loading ? <Loader2 className="w-6 h-6 text-blue-500 animate-spin" /> : <Search className="w-6 h-6 text-slate-600" />}
                </div>
                <input 
                    className="w-full bg-slate-900/60 backdrop-blur-2xl border border-slate-800 rounded-[2.5rem] pl-16 pr-8 py-6 text-xl font-bold outline-none focus:border-blue-500/50 transition-all shadow-2xl"
                    placeholder={activeCategory ? `Searching in ${activeCategory}...` : "Medicine ka naam likhein..."}
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                />
            </div>

            {/* Filter Chips */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
                {[
                  { id: 'price-low', label: 'Cheapest', icon: <Zap size={14} fill="currentColor"/> }, 
                  { id: 'distance', label: 'Nearest', icon: <MapPin size={14} /> }, 
                  { id: 'price-high', label: 'Premium', icon: <Sparkles size={14} /> }
                ].map((filter) => (
                    <button 
                        key={filter.id} 
                        onClick={() => setSortBy(filter.id)} 
                        className={`flex items-center gap-2 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === filter.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}
                    >
                        {filter.icon} {filter.label}
                    </button>
                ))}
            </div>
        </div>
      </header>

      {/* Results Main Section */}
      <main className="max-w-5xl mx-auto pb-24">
        {sortedResults.length > 0 ? (
          <div className="space-y-4">
            {sortedResults.map((med, idx) => (
              <MedicineResultCard 
                key={idx} 
                medicine={med} 
                onOrder={handleOrder} 
              />
            ))}
          </div>
        ) : (query.length > 2 || activeCategory) && !loading && (
          <div className="flex flex-col items-center justify-center mt-32 space-y-8">
            <div className="w-28 h-28 bg-slate-900 rounded-[3rem] flex items-center justify-center border border-slate-800">
                <PackageX className="w-12 h-12 text-slate-700" />
            </div>
            <div className="text-center">
                <p className="text-slate-400 font-black text-2xl uppercase tracking-tighter italic">No Inventory Found</p>
                <button onClick={() => setQuery('')} className="mt-4 text-blue-500 font-black text-[10px] uppercase border-b-2 border-blue-500/20">Reset Search</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MedicineSearch;