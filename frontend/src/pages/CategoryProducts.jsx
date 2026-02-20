import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { IndianRupee, ArrowLeft, Loader2, Search, Zap, ShoppingBag } from 'lucide-react';
import { API } from '../context/AuthContext';

const CategoryProducts = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const categoryName = searchParams.get('category');
    
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    const PLACEHOLDER = 'https://placehold.co/300x300/1e293b/475569?text=Medicine';

    useEffect(() => {
        const fetchProducts = async () => {
            if (!categoryName) return;
            try {
                setLoading(true);
                const res = await API.get(`/medicines/search?category=${encodeURIComponent(categoryName)}`);
                if (res.data.success) {
                    console.log("Fetched Products:", res.data.products);
                    setProducts(res.data.products);
                }
            } catch (err) {
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categoryName]);

    const filtered = products.filter(p => 
        (p.name || p.medicineName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 🔥 Navigation Handler with Deep ID Detection
    const handleProductClick = (product) => {
        // Checking all possible ID locations
        const id = product._id || product.id || product.medicineId;
        
        console.log("Card Clicked, ID found:", id);
        
        if (id) {
            // Ensure ID is a string before navigating
            const cleanId = typeof id === 'object' ? id.toString() : id;
            navigate(`/product/${cleanId}`);
        } else {
            console.error("ID Missing in product object:", product);
            alert("Asset ID not synchronized. Check console.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -z-10"></div>
            
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 border-b border-white/5 pb-10">
                    <div>
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-blue-500 font-black uppercase text-[10px] tracking-[0.3em] mb-4 transition-all">
                            <ArrowLeft size={16} /> BACK_TO_NODES
                        </button>
                        <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-none">
                            {categoryName} <span className="text-blue-600 not-italic">ASSETS</span>
                        </h1>
                    </div>
                    
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                        <input 
                            type="text"
                            placeholder="SCANNING SECTOR..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-[10px] font-black tracking-widest outline-none focus:border-blue-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center py-40">
                        <Loader2 className="animate-spin text-blue-500 mb-4" size={50} />
                        <p className="text-[10px] font-black tracking-[0.4em] text-slate-700">ESTABLISHING NEURAL LINK...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filtered.length > 0 ? filtered.map((p) => {
                            // Unique Key handling
                            const itemKey = p._id ? p._id.toString() : Math.random().toString();
                            
                            return (
                                <div 
                                    key={itemKey} 
                                    onClick={() => handleProductClick(p)}
                                    className="group bg-slate-900/40 border border-slate-800 rounded-[2.5rem] overflow-hidden hover:border-blue-500/50 hover:bg-slate-900/60 transition-all duration-500 cursor-pointer relative"
                                >
                                    <div className="aspect-square bg-white m-3 rounded-[2rem] flex items-center justify-center p-8 relative overflow-hidden shadow-inner">
                                        <img 
                                            src={p.image || PLACEHOLDER} 
                                            alt={p.name || "Medicine"}
                                            className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 pointer-events-none"
                                            onError={(e) => { e.target.src = PLACEHOLDER; }}
                                        />
                                    </div>
                                    <div className="p-8">
                                        <div className="flex items-center gap-1.5 text-blue-500 mb-2">
                                            <Zap size={10} fill="currentColor" />
                                            <span className="text-[9px] font-black tracking-widest uppercase">{p.brand || 'Generic'}</span>
                                        </div>
                                        <h3 className="text-xl font-black italic uppercase tracking-tight mb-4 truncate text-slate-100 group-hover:text-blue-400 transition-colors">
                                            {p.name || p.medicineName || "Unknown Asset"}
                                        </h3>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-600 uppercase mb-1">Starting From</p>
                                                <p className="text-4xl font-black italic flex items-center tracking-tighter text-white">
                                                    <span className="text-blue-500 text-2xl mr-1">₹</span>{p.price || 0}
                                                </p>
                                            </div>
                                            <div className="bg-blue-600 p-4 rounded-2xl group-hover:bg-blue-500 shadow-lg transition-all active:scale-90 text-white">
                                                <ShoppingBag size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="col-span-full text-center py-20 border border-dashed border-slate-800 rounded-[3rem]">
                                <p className="text-slate-600 font-black uppercase tracking-[0.3em]">No Assets Found In This Sector</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryProducts;