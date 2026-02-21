import React from 'react';
import { ShoppingBag, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MedicineResultCard({ medicine, onOrder }) {
  const navigate = useNavigate();
  
  if (!medicine) return null;

  // Robust ID detection for MongoDB or Custom IDs
  const productId = medicine._id || medicine.id || medicine.medicineId;

  const handleCardClick = (e) => {
    // Prevent navigation if the user clicks the "Buy" button directly
    if (e.target.closest('button')) return;
    
    if (productId) {
      navigate(`/product/${productId.toString()}`);
    } else {
      console.warn("Product Synchronisation Error: Unique ID not found in record.");
    }
  };

  const FALLBACK_IMAGE = 'https://cdn-icons-png.flaticon.com/512/883/883356.png';

  return (
    <div 
      onClick={handleCardClick}
      className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-[2.5rem] backdrop-blur-2xl mb-6 hover:border-blue-500/40 hover:bg-slate-900/60 transition-all duration-300 group cursor-pointer relative overflow-hidden"
    >
      <div className="flex flex-col md:flex-row gap-8 items-center">
        
        {/* Product Visualization */}
        <div className="w-40 h-40 bg-white rounded-[2rem] flex-shrink-0 flex items-center justify-center p-5 shadow-inner relative z-10">
          <img 
            src={medicine.image || FALLBACK_IMAGE} 
            alt={medicine.medicineName || medicine.name}
            className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Product Information */}
        <div className="flex-1 text-left w-full z-10">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={10} className="text-blue-500 fill-blue-500" />
            <span className="text-blue-500 text-[10px] font-bold uppercase tracking-[0.2em]">
              {String(medicine.brand || 'Premium Quality').toUpperCase()}
            </span>
          </div>
          
          <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-3 group-hover:text-blue-400 transition-colors line-clamp-1">
            {medicine.medicineName || medicine.name || 'Catalogue Product'}
          </h3>
          
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full border border-emerald-500/20 w-fit">
            <ShieldCheck size={14} />
            <span className="text-[9px] font-bold uppercase tracking-widest">
              {medicine.pharmacy || medicine.storeName || "Verified Pharmacy Partner"}
            </span>
          </div>
        </div>

        {/* Pricing & CTA Section */}
        <div className="flex flex-col items-end justify-between gap-6 w-full md:w-auto min-w-[180px] z-10">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Price Per Unit</p>
            <div className="flex items-baseline justify-end gap-1 text-white font-black">
                <span className="text-blue-500 text-xl">₹</span>
                <span className="text-5xl tracking-tighter leading-none">{medicine.price || 0}</span>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={(e) => { 
              e.stopPropagation(); 
              onOrder(medicine);
            }} 
            className="w-full md:w-auto py-4 px-8 rounded-2xl font-bold text-[11px] uppercase bg-blue-600 hover:bg-blue-500 text-white transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20 active:scale-95 border-b-4 border-blue-800"
          >
            <ShoppingBag size={18} /> Buy Now
          </button>
        </div>
      </div>
      
      {/* Subtle Card Glow Effect */}
      <div className="absolute -right-20 -bottom-20 w-40 h-40 bg-blue-600/5 blur-[80px] rounded-full group-hover:bg-blue-600/10 transition-all"></div>
    </div>
  );
}