import React from 'react';
import { 
  ShoppingBag, MapPin, Zap, 
  ArrowRight, ShieldCheck, Info 
} from 'lucide-react';

export default function MedicineResultCard({ medicine, onOrder, onViewDetails }) {
  return (
    <div className="relative group overflow-hidden bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-xl transition-all duration-500 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/20">
      
      {/* ⚡ Glow Effect on Hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>

      <div className="flex flex-col md:flex-row justify-between gap-8 items-start md:items-center">
        
        {/* Left Side: Medicine Info */}
        <div className="space-y-4 flex-1">
          <div className="space-y-1">
            <h3 className="text-3xl font-black italic tracking-tighter text-white uppercase group-hover:text-blue-400 transition-colors">
              {medicine.brand || medicine.name}
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg border border-blue-500/20">
                <ShieldCheck size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">Original Product</span>
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                <MapPin size={12} /> {medicine.distance || "1.5"} KM Door
              </span>
            </div>
          </div>

          <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50 max-w-sm">
            <div className="flex items-start gap-3">
              <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
              <p className="text-[11px] font-bold text-slate-400 leading-relaxed italic">
                Salt: <span className="text-slate-200">{medicine.salt || "Information not available"}</span>
              </p>
            </div>
          </div>
          
          <p className="text-[10px] font-black text-blue-400/80 uppercase tracking-[0.3em] flex items-center gap-2">
            <Zap size={12} className="fill-blue-500" /> Rani Medical & General Store
          </p>
        </div>

        {/* Right Side: Pricing & Action */}
        <div className="flex flex-col md:items-end gap-6 w-full md:w-auto">
          <div className="text-left md:text-right">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Total Price</p>
            <div className="flex items-baseline gap-1">
               <span className="text-blue-500 text-lg font-black italic">₹</span>
               <span className="text-5xl font-black text-white tracking-tighter">
                {medicine.price || "00"}
               </span>
            </div>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={() => onOrder(medicine)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-900/40 active:scale-95 transition-all"
            >
              <ShoppingBag size={16} /> Order Now
            </button>
            
            <button 
              onClick={() => onViewDetails(medicine)}
              className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all"
              title="View Directions"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}