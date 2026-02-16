import React from 'react';
import { 
  MapPin, Pill, ShieldCheck, ShoppingCart, 
  Info, CheckCircle2, AlertCircle, ArrowRight 
} from 'lucide-react';

export default function PharmacyPriceCard({ option, isBest, onOrder }) {
  return (
    <div className={`relative p-6 md:p-8 border-2 rounded-[2.5rem] flex flex-col lg:flex-row justify-between items-center transition-all duration-500 group ${
      isBest 
      ? 'bg-emerald-500/5 border-emerald-500/20 shadow-2xl shadow-emerald-900/10' 
      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 shadow-xl'
    }`}>
      
      {/* ⭐ Best Price Badge */}
      {isBest && (
        <div className="absolute -top-4 left-10 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[9px] font-black px-5 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg border border-emerald-400/30">
          SABSE SASTA (Best Price)
        </div>
      )}

      <div className="flex items-center gap-6 w-full lg:w-auto">
        {/* 💊 Icon */}
        <div className={`hidden sm:flex p-5 rounded-[2rem] transition-transform duration-500 group-hover:scale-110 ${
          isBest ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
        }`}>
          <Pill size={32} />
        </div>

        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h4 className="font-black text-white text-xl italic tracking-tighter uppercase">
              {option.pharmacy}
            </h4>
            <div className="flex items-center gap-1 bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-md border border-blue-500/20">
              <ShieldCheck size={12} />
              <span className="text-[8px] font-black uppercase tracking-widest text-[10px]">Verified Store</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-blue-400 font-black text-sm uppercase tracking-wider">
              {option.medicineName || "Medicine Name"}
            </p>
            <div className="flex items-center gap-2 text-slate-500">
              <Info size={14} className="text-slate-700" />
              <p className="text-[10px] font-bold uppercase tracking-widest leading-none">
                Salt: <span className="text-slate-300 italic">{option.salt || "Generic"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {option.stock > 0 ? (
              <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl uppercase border border-emerald-500/20">
                <CheckCircle2 size={12} /> {option.stock} In Stock
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[9px] font-black text-red-400 bg-red-500/10 px-3 py-1.5 rounded-xl uppercase border border-red-500/20">
                <AlertCircle size={12} /> Out of Stock
              </span>
            )}
            <div className="flex items-center gap-1 text-[9px] font-black text-slate-500 uppercase">
              <MapPin size={12} /> 1.5 KM
            </div>
          </div>
        </div>
      </div>

      {/* Pricing & Order */}
      <div className="flex items-center justify-between w-full lg:w-auto mt-8 lg:mt-0 gap-10 border-t lg:border-t-0 lg:border-l border-slate-800/50 pt-6 lg:pt-0 lg:pl-10">
        <div className="text-left lg:text-right">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Final Price</p>
          <div className="flex items-baseline gap-1">
            <span className="text-slate-400 text-sm font-bold">₹</span>
            <p className="text-4xl font-black text-white tracking-tighter">
              {option.price}
            </p>
          </div>
        </div>

        {option.stock > 0 ? (
          <button
            onClick={() => onOrder(option)}
            className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-blue-900/30 active:scale-95 transition-all"
          >
            <ShoppingCart size={16} /> Order
          </button>
        ) : (
          <button
            disabled
            className="bg-slate-800 text-slate-600 px-8 py-4 rounded-[1.5rem] font-black text-[11px] uppercase cursor-not-allowed border border-slate-700/50"
          >
            N/A
          </button>
        )}
      </div>
    </div>
  );
}