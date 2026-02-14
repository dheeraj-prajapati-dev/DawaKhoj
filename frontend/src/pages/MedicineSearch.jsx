import React, { useState, useEffect, useMemo } from 'react';
import { API } from '../context/AuthContext';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, MapPin, Navigation, 
  ArrowUpDown, CheckCircle2, PackageX,
  ChevronLeft, Filter, Loader2
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
    if ((query.trim().length <= 2 && !activeCategory) || !userCoords) {
      setResults([]);
      return;
    }

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
        setResults(res.data.results || []);
      }
    } catch (err) {
      toast.error("Failed to fetch results.");
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
      const res = await API.post('/orders/create', {
        pharmacyId: item.pharmacyId,
        medicineName: item.medicineName,
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

  const getDirections = (pharmacyName) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pharmacyName)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 font-sans overflow-x-hidden">
      <Toaster position="top-center" />

      {/* 🚀 Modern Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center z-[100] p-6 animate-in fade-in zoom-in duration-300">
          <div className="bg-slate-900 border border-blue-500/30 rounded-[3rem] p-10 max-w-sm w-full text-center shadow-[0_0_50px_rgba(37,99,235,0.2)]">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
               <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black mb-2 tracking-tighter uppercase italic">Confirmed!</h2>
            <p className="text-slate-400 mb-8 text-sm font-medium leading-relaxed">
              Order for <span className="text-blue-400 font-bold">{lastOrder?.medicineName}</span> placed successfully.
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

      {/* Header & Sticky Search Area */}
      <header className="max-w-5xl mx-auto mb-8 flex flex-col items-center">
        <div className="flex items-center justify-between w-full mb-8">
            <button onClick={() => navigate('/')} className="p-3 bg-slate-900 rounded-2xl border border-slate-800 hover:bg-slate-800 transition-all">
                <ChevronLeft className="w-5 h-5 text-slate-400" />
            </button>
            <h1 className="text-3xl font-black text-white italic tracking-tighter">DawaKhoj<span className="text-blue-500">+</span></h1>
            <div className="w-10"></div> {/* Spacer */}
        </div>

        {/* 🔍 Dynamic Search Bar */}
        <div className="w-full sticky top-4 z-40 space-y-4 mb-6">
            <div className="relative group">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                    {loading ? <Loader2 className="w-5 h-5 text-blue-500 animate-spin" /> : <Search className="w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />}
                </div>
                <input 
                    className="w-full bg-slate-900/60 backdrop-blur-2xl border border-slate-800 rounded-[2rem] pl-16 pr-8 py-5 text-lg font-bold outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-2xl placeholder:text-slate-600"
                    placeholder={activeCategory ? `Search in ${activeCategory}...` : "Dawa ka naam likhein..."}
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                />
            </div>

            {/* Filter Chips */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-slate-500 mr-2">
                    <Filter className="w-3 h-3" />
                </div>
                {[
                  { id: 'price-low', label: 'Cheapest', icon: '💰' }, 
                  { id: 'distance', label: 'Nearest', icon: '📍' }, 
                  { id: 'price-high', label: 'Premium', icon: '📈' }
                ].map((filter) => (
                    <button 
                        key={filter.id} 
                        onClick={() => setSortBy(filter.id)} 
                        className={`whitespace-nowrap flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === filter.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'}`}
                    >
                        <span>{filter.icon}</span> {filter.label}
                    </button>
                ))}
            </div>
        </div>
      </header>

      {/* Search Results */}
      <main className="max-w-5xl mx-auto space-y-12 pb-20">
        {sortedResults.length > 0 ? sortedResults.map((group, idx) => (
          <div key={idx} className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-blue-500/20 shadow-sm">
                BRAND: {group.brand}
              </span>
              <div className="h-[1px] bg-slate-900 flex-1"></div>
            </div>

            <div className="grid gap-6">
              {group.options.map((item, i) => (
                <div key={i} className="group bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-slate-800/60 hover:border-blue-500/30 hover:bg-slate-900 transition-all duration-500 flex flex-col md:flex-row justify-between items-stretch md:items-center p-8 gap-8 relative overflow-hidden">
                  
                  {/* Stock Indicator Light */}
                  <div className={`absolute left-0 top-0 w-1 h-full ${item.stock > 0 ? 'bg-blue-500' : 'bg-slate-700'}`}></div>

                  <div className="flex-1 space-y-4">
                    <div>
                        <h3 className="font-black text-4xl text-slate-100 italic uppercase tracking-tighter group-hover:text-white transition-colors">
                            {item.medicineName}
                        </h3>
                        <div className="flex flex-wrap gap-4 mt-3">
                            <span className="flex items-center gap-1.5 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                                <CheckCircle2 className="w-3 h-3" /> {item.pharmacy}
                            </span>
                            <span className="flex items-center gap-1.5 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                <Navigation className="w-3 h-3" /> { (typeof item.distance === 'number') ? `${item.distance.toFixed(1)} KM` : 'N/A' }
                            </span>
                            <span className="bg-slate-950 px-2 py-1 rounded text-[9px] text-slate-600 font-bold uppercase border border-slate-800">
                                {item.category}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button 
                        onClick={() => handleOrder(item)} 
                        disabled={item.stock === 0} 
                        className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${item.stock > 0 ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/20 active:scale-95' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
                      >
                        {item.stock > 0 ? (<><ArrowUpDown className="w-3 h-3" /> Order Now</>) : 'Out of Stock'}
                      </button>
                      <button onClick={() => getDirections(item.pharmacy)} className="bg-slate-950 text-slate-400 border border-slate-800 px-6 py-4 rounded-2xl text-[10px] font-black uppercase hover:text-white hover:border-slate-600 transition-all">
                        Directions 🚩
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-center border-t md:border-t-0 border-slate-800 pt-6 md:pt-0">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Total Price</p>
                    <div className="flex items-start gap-1">
                        <span className="text-xl font-black text-emerald-500 mt-1">₹</span>
                        <p className="text-6xl font-black text-white italic tracking-tighter">{item.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )) : (query.length > 2 || activeCategory) && !loading && (
          <div className="flex flex-col items-center justify-center mt-32 space-y-6">
            <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center border border-slate-800">
                <PackageX className="w-12 h-12 text-slate-700" />
            </div>
            <div className="text-center">
                <p className="text-slate-500 font-black text-xl uppercase tracking-tighter italic">Stock Not Available</p>
                <button onClick={() => { setQuery(''); navigate('/search'); }} className="mt-4 text-blue-500 font-black text-[10px] uppercase tracking-widest border-b border-blue-500/30 hover:border-blue-500 transition-all">Reset All Filters</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MedicineSearch;