import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, ShoppingCart, 
    ShieldCheck, Truck, Zap, Beaker, MapPin 
} from 'lucide-react';
import { API } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const PLACEHOLDER = 'https://placehold.co/600x600/1e293b/475569?text=Medicine';

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                const response = await API.get(`/medicines/${id}`);
                if (response.data.success) {
                    setProduct(response.data.medicine);
                }
            } catch (error) {
                console.error("Error fetching details:", error);
                toast.error("Failed to retrieve asset data");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProductDetails();
    }, [id]);

    const handleOrder = () => {
        toast.success(`Redirecting to order flow for ${product.name}`);
        // Yahan future mein navigate('/checkout') kar sakte hain
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
            <div className="text-blue-500 animate-spin mb-4"><Zap size={40} /></div>
            <p className="text-[10px] font-black tracking-[0.5em] text-slate-500 uppercase italic">Fetching Asset Data...</p>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-20 text-center">
            <h2 className="text-4xl font-black italic uppercase mb-4">Asset Not Found</h2>
            <button onClick={() => navigate(-1)} className="text-blue-500 font-bold border border-blue-500/30 px-6 py-2 rounded-full uppercase tracking-widest text-[10px] hover:bg-blue-500/10 transition-all">
                Return to Terminal
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 relative overflow-x-hidden">
            {/* Background Aesthetic Blur */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full -z-10"></div>

            <div className="max-w-6xl mx-auto mt-10">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-blue-500 font-black uppercase text-[10px] tracking-widest mb-10 transition-all">
                    <ArrowLeft size={16} /> Revert to Grid
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Section: Product Visualizer */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative bg-white rounded-[3rem] p-12 aspect-square flex items-center justify-center overflow-hidden shadow-2xl">
                            <img 
                                src={product.image || PLACEHOLDER} 
                                alt={product.name}
                                className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                                onError={(e) => { e.target.src = PLACEHOLDER; }}
                            />
                        </div>
                    </div>

                    {/* Right Section: Core Data */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-4 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest">
                                {product.category || 'Pharmaceutical'}
                            </span>
                            <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-black uppercase">
                                <ShieldCheck size={12} /> Verified Asset
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-4 leading-none text-white">
                            {product.name}
                        </h1>
                        
                        <div className="flex items-center gap-2 text-slate-400 mb-8 font-bold italic border-l-2 border-blue-500/50 pl-4">
                            <Beaker size={18} className="text-blue-500" />
                            <span className="text-lg">Composition: {product.salt || 'Special Formulation'}</span>
                        </div>

                        <p className="text-slate-500 text-lg mb-10 leading-relaxed font-medium max-w-lg">
                            Premium grade pharmaceutical unit. Ensure prescription compliance before deployment. 
                            Stored in temperature-controlled environments for maximum efficacy.
                        </p>

                        <div className="flex items-center gap-6 mb-12 bg-slate-900/40 p-8 rounded-[2rem] border border-slate-800/50 backdrop-blur-sm">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Best Price</p>
                                <p className="text-6xl font-black italic text-white flex items-center tracking-tighter">
                                    <span className="text-blue-500 text-3xl mt-2 mr-1">₹</span>{product.price}
                                </p>
                            </div>
                            <div className="h-16 w-[1px] bg-slate-800 mx-2"></div>
                            <div className="flex flex-col gap-1">
                                <span className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase italic">
                                    <Truck size={14} /> Rapid Delivery
                                </span>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${product.stock > 0 ? 'text-blue-400' : 'text-red-500'}`}>
                                    {product.stock > 0 ? `Stock: ${product.stock} Units` : 'Out of Stock'}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={handleOrder}
                                disabled={product.stock === 0}
                                className={`flex-[2] font-black py-6 rounded-3xl shadow-2xl transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 group ${product.stock > 0 ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/30 active:scale-95' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                            >
                                <ShoppingCart size={20} className={product.stock > 0 ? "group-hover:rotate-12 transition-transform" : ""} /> 
                                {product.stock > 0 ? 'Order Now' : 'Sold Out'}
                            </button>
                            
                            <button 
                                onClick={() => navigate(`/search?medicine=${product.name}`)}
                                className="flex-1 bg-slate-900 border border-slate-800 hover:border-blue-500/50 text-white font-black py-6 rounded-3xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl active:scale-95"
                            >
                                <MapPin size={20} className="text-blue-500" /> Find Nearby
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;