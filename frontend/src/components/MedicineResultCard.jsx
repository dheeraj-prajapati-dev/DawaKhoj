import React from 'react';
import { ShoppingBag, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MedicineResultCard({ medicine, onOrder }) {
  const navigate = useNavigate();
  if (!medicine) return null;

  // 🔥 ID Logic: Medicine ID ko sabse upar rakho
  const productId = medicine.medicineId || medicine._id;

  const handleCardClick = (e) => {
    if (e.target.closest('button')) return;
    
    if (productId) {
      navigate(`/product/${productId.toString()}`);
    } else {
      console.error("ID Missing in:", medicine);
    }
  };

  const FALLBACK_IMAGE = 'https://cdn-icons-png.flaticon.com/512/883/883356.png';

  return (
    <div 
      onClick={handleCardClick}
      className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2.5rem] backdrop-blur-xl mb-6 hover:border-blue-500/50 transition-all group cursor-pointer"
    >
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="w-40 h-40 bg-white rounded-[2rem] flex-shrink-0 flex items-center justify-center p-4">
          <img 
            src={medicine.image || FALLBACK_IMAGE} 
            alt={medicine.name || medicine.medicineName}
            className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform"
          />
        </div>

        <div className="flex-1 text-left w-full">
          <span className="text-blue-500 text-[10px] font-black uppercase italic tracking-widest">
            {medicine.brand || 'Generic'}
          </span>
          <h3 className="text-4xl font-black italic text-white uppercase tracking-tighter mb-2 group-hover:text-blue-400 truncate">
            {medicine.medicineName || medicine.name}
          </h3>
          <div className="flex items-center gap-1.5 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg border border-blue-500/20 w-fit">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">{medicine.pharmacy || "Verified Node"}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-4 w-full md:w-auto">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Price</p>
            <div className="flex items-baseline gap-1 text-white font-black">
                <span className="text-blue-500 text-xl italic">₹</span>
                <span className="text-6xl tracking-tighter leading-none">{medicine.price}</span>
            </div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onOrder(medicine); }} 
            className="py-5 px-8 rounded-2xl font-black text-[11px] uppercase bg-blue-600 hover:bg-blue-500 text-white transition-all flex items-center gap-3 active:scale-95"
          >
            <ShoppingBag size={18} /> Initiate Order
          </button>
        </div>
      </div>
    </div>
  );
}