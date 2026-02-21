import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Search, Zap, ShoppingBag, PackageSearch } from 'lucide-react';
import { API } from '../context/AuthContext';

const CategoryProducts = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const categoryName = searchParams.get('category');
    
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    const PLACEHOLDER = 'https://cdn-icons-png.flaticon.com/512/883/883356.png';

    useEffect(() => {
        const fetchProducts = async () => {
            if (!categoryName) return;
            try {
                setLoading(true);
                // Tip: Encoding is good practice for category names with spaces/symbols
                const res = await API.get(`/medicines/search?category=${encodeURIComponent(categoryName)}`);
                if (res.data?.success) {
                    setProducts(res.data.products || []);
                }
            } catch (err) {
                console.error("API Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categoryName]);

    // Optimize filtering performance
    const filtered = useMemo(() => {
        return products.filter(p => 
            (p.name || p.medicineName || "").toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    const handleProductClick = (product) => {
        const id = product._id || product.id || product.medicineId;
        if (id) {
            const cleanId = typeof id === 'object' ? id.toString() : id;
            navigate(`/product/${cleanId}`);
        } else {
            console.error("Critical: Product ID missing for navigation");
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 relative overflow-hidden font-sans">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[140px] rounded-full -z-10"></div>
            
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8 border-b border-white/5 pb-10">
                    <div className="space-y-4">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="group flex items-center gap-2 text-slate-500 hover:text-blue-500 font-bold uppercase text-[10px] tracking-widest transition-all"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
                            Back to Categories
                        </button>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-tight">
                            {categoryName || 'General'} <span className="text-blue-600">Collection</span>
                        </h1>
                        <p className="text-slate-500 text-sm font-medium tracking-wide">
                            Displaying verified supplies in <span className="text-slate-300">"{categoryName}"</span>
                        </p>
                    </div>
                    
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input 
                            type="text"
                            placeholder="Search in this category..."
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-xs font-bold tracking-wide outline-none focus:border-blue-500 transition-all shadow-xl shadow-black/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center py-48">
                        <Loader2 className="animate-spin text-blue-600 mb-6" size={48} />
                        <p className="text-[10px] font-bold tracking-[0.5em] text-slate-600 uppercase">Indexing Catalog Data...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-700">
                        {filtered.length > 0 ? filtered.map((p) => (
                            <div 
                                key={p._id || Math.random()} 
                                onClick={() => handleProductClick(p)}
                                className="group bg-slate-900/30 border border-slate-800/60 rounded-[2rem] overflow-hidden hover:border-blue-500/40 hover:bg-slate-900/60 transition-all duration-300 cursor-pointer flex flex-col"
                            >
                                {/* Image Container */}
                                <div className="aspect-[4/3] bg-white m-2 rounded-[1.5rem] flex items-center justify-center p-6 relative overflow-hidden group-hover:p-4 transition-all">
                                    <img 
                                        src={p.image || PLACEHOLDER} 
                                        alt={p.name}
                                        className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => { e.target.src = PLACEHOLDER; }}
                                    />
                                    {p.discount > 0 && (
                                        <div className="absolute top-3 right-3 bg-red-600 text-white text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter">
                                            {p.discount}% OFF
                                        </div>
                                    )}
                                </div>

                                {/* Content Section */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center gap-1.5 text-blue-500/80 mb-2">
                                        <Zap size={10} className="fill-current" />
                                        <span className="text-[9px] font-black tracking-widest uppercase truncate">{p.brand || 'Premium Quality'}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors mb-4 line-clamp-1">
                                        {p.name || p.medicineName || "Verified Asset"}
                                    </h3>
                                    
                                    <div className="mt-auto flex justify-between items-center pt-2 border-t border-white/5">
                                        <div>
                                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Price starting at</p>
                                            <p className="text-2xl font-black text-white flex items-baseline tracking-tighter">
                                                <span className="text-blue-500 text-sm mr-0.5 font-bold">₹</span>
                                                {p.price || "0"}
                                            </p>
                                        </div>
                                        <div className="bg-slate-800 p-3 rounded-xl group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-6 text-slate-400 transition-all duration-300 shadow-lg">
                                            <ShoppingBag size={18} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-32 border-2 border-dashed border-slate-900 rounded-[3rem] bg-slate-900/10">
                                <PackageSearch size={48} className="text-slate-800 mb-4" />
                                <p className="text-slate-600 font-bold uppercase tracking-widest text-sm text-center px-4">No assets found in "{categoryName}" sector</p>
                                <button 
                                    onClick={() => setSearchTerm("")}
                                    className="mt-6 text-blue-500 text-[10px] font-black uppercase underline tracking-widest hover:text-blue-400 transition-colors"
                                >
                                    Reset Discovery Filters
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryProducts;