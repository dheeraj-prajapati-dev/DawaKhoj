import React, { useState, useEffect, useMemo } from 'react';
import { API } from '../context/AuthContext';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, MapPin, Navigation, 
  ArrowUpDown, CheckCircle2, PackageX,
  ChevronLeft, Filter, Loader2, ShoppingBag, Zap, Sparkles
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
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 font-sans relative overflow-hidden">
      <Toaster position="top-center" />
      
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -z-10"></div>

      {/* 🚀 Order Confirmed Modal */}
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

      {/* Header Section */}
      <header className="max-w-5xl mx-auto mb-12">
        <div className="flex items-center justify-between w-full mb-10">
            <button onClick={() => navigate('/')} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 transition-all group">
                <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
            </button>
            <div className="text-right">
              <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
                Dawa<span className="text-blue-500">Khoj+</span>
              </h1>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2 italic">Hyper-Local Search Engine</p>
            </div>
        </div>

        {/* 🔍 Search Input Area */}
        <div className="w-full sticky top-4 z-40 space-y-6">
            <div className="relative group">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                    {loading ? <Loader2 className="w-6 h-6 text-blue-500 animate-spin" /> : <Search className="w-6 h-6 text-slate-600 group-focus-within:text-blue-500 transition-colors" />}
                </div>
                <input 
                    className="w-full bg-slate-900/40 backdrop-blur-2xl border border-slate-800 rounded-[2.5rem] pl-16 pr-8 py-6 text-xl font-bold outline-none focus:border-blue-500/50 focus:ring-8 focus:ring-blue-500/5 transition-all shadow-2xl placeholder:text-slate-700"
                    placeholder={activeCategory ? `Searching in ${activeCategory}...` : "Medicine ka naam likhein..."}
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                />
            </div>

            {/* Filter Chips */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 px-2">
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-slate-500">
                    <Filter className="w-3 h-3" />
                </div>
                {[
                  { id: 'price-low', label: 'Cheapest', icon: <Zap size={14} className="fill-current"/> }, 
                  { id: 'distance', label: 'Nearest', icon: <MapPin size={14} /> }, 
                  { id: 'price-high', label: 'Premium', icon: <Sparkles size={14} /> }
                ].map((filter) => (
                    <button 
                        key={filter.id} 
                        onClick={() => setSortBy(filter.id)} 
                        className={`whitespace-nowrap flex items-center gap-2 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${sortBy === filter.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'bg-slate-900/50 text-slate-500 border border-slate-800 hover:border-slate-600'}`}
                    >
                        {filter.icon} {filter.label}
                    </button>
                ))}
            </div>
        </div>
      </header>

      {/* Results Main Section */}
      <main className="max-w-5xl mx-auto space-y-16 pb-24">
        {sortedResults.length > 0 ? sortedResults.map((group, idx) => (
          <div key={idx} className="space-y-8 animate-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-5 py-2 rounded-full uppercase tracking-[0.3em] border border-blue-500/20 shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                Brand: {group.brand}
              </span>
              <div className="h-[1px] bg-slate-800/50 flex-1"></div>
            </div>

            <div className="grid gap-6">
              {group.options.map((item, i) => (
                <div key={i} className="group relative bg-slate-900/30 backdrop-blur-xl rounded-[3rem] border border-slate-800/60 hover:border-blue-500/40 hover:bg-slate-900/50 transition-all duration-500 flex flex-col md:flex-row justify-between items-center p-8 gap-8 overflow-hidden">
                  
                  {/* Decorative Glow on Hover */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  {/* Left Side: Info */}
                  <div className="flex-1 space-y-5 w-full">
                    <div>
                        <h3 className="font-black text-4xl text-slate-100 italic uppercase tracking-tighter group-hover:text-blue-400 transition-colors duration-500">
                            {item.medicineName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 mt-4">
                            <span className="flex items-center gap-1.5 text-blue-500 text-[10px] font-black uppercase tracking-widest bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/10">
                                <CheckCircle2 className="w-3 h-3" /> {item.pharmacy}
                            </span>
                            <span className="flex items-center gap-1.5 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                <Navigation className="w-3 h-3" /> { (typeof item.distance === 'number') ? `${item.distance.toFixed(1)} KM` : 'N/A' }
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleOrder(item)} 
                        disabled={item.stock === 0} 
                        className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all ${item.stock > 0 ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-2xl shadow-blue-900/30 active:scale-95' : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700/50'}`}
                      >
                        {item.stock > 0 ? (<><ShoppingBag className="w-4 h-4" /> Order Now</>) : 'Out of Stock'}
                      </button>
                      <button onClick={() => getDirections(item.pharmacy)} className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all" title="Get Directions">
                        <Navigation size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Right Side: Pricing */}
                  <div className="flex flex-col items-end justify-center w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-10">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Best Price</p>
                    <div className="flex items-start gap-1">
                        <span className="text-xl font-black text-blue-500 mt-1 italic">₹</span>
                        <p className="text-7xl font-black text-white italic tracking-tighter leading-none">{item.price}</p>
                    </div>
                  </div>

                  {/* Border Accent */}
                  <div className={`absolute left-0 top-1/4 bottom-1/4 w-1 rounded-full ${item.stock > 0 ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
                </div>
              ))}
            </div>
          </div>
        )) : (query.length > 2 || activeCategory) && !loading && (
          <div className="flex flex-col items-center justify-center mt-32 space-y-8 animate-in fade-in slide-in-from-top-4">
            <div className="w-28 h-28 bg-slate-900/50 rounded-[3rem] flex items-center justify-center border border-slate-800 relative">
                <PackageX className="w-12 h-12 text-slate-700" />
                <div className="absolute inset-0 bg-blue-600/5 blur-2xl rounded-full"></div>
            </div>
            <div className="text-center">
                <p className="text-slate-400 font-black text-2xl uppercase tracking-tighter italic">No Inventory Found</p>
                <p className="text-slate-600 text-xs font-bold uppercase tracking-widest mt-2">Try a different name or category</p>
                <button 
                  onClick={() => { setQuery(''); navigate('/search'); }} 
                  className="mt-8 text-blue-500 font-black text-[10px] uppercase tracking-[0.2em] border-b-2 border-blue-500/20 hover:border-blue-500 transition-all pb-1"
                >
                  Reset Search Results
                </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MedicineSearch;