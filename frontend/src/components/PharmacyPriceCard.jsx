import React from 'react';
import { MapPin, Pill, ShieldCheck, ShoppingCart, Info, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PharmacyPriceCard({ option, isBest, onOrder }) {
  return (
    <div className={`relative p-6 border-2 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center transition-all duration-300 ${
      isBest 
      ? 'bg-green-50/50 border-green-200 shadow-lg shadow-green-100' 
      : 'bg-white border-slate-100 shadow-sm hover:shadow-md'
    }`}>
      
      {/* ⭐ Best Price Badge */}
      {isBest && (
        <div className="absolute -top-3 left-8 bg-green-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-tighter">
          Best Price Match
        </div>
      )}

      <div className="flex items-center gap-5 w-full md:w-auto">
        {/* 💊 Icon Section */}
        <div className={`p-4 rounded-[1.5rem] ${isBest ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
          <Pill className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight">
              {option.pharmacy}
            </h4>
            <ShieldCheck className="w-4 h-4 text-blue-500" />
          </div>
          
          {/* 🔥 Medicine & Salt Info */}
          <div>
            <p className="text-blue-600 font-black text-sm uppercase">
              {option.medicineName}
            </p>
            <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1 italic">
              <Info className="w-3 h-3" /> Salt: {option.salt}
            </p>
          </div>

          {/* 📦 Stock Status */}
          <div className="pt-1">
            {option.stock > 0 ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-black text-green-700 bg-green-100 px-3 py-1 rounded-full uppercase">
                <CheckCircle2 className="w-3 h-3" /> {option.stock} In Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-black text-red-600 bg-red-100 px-3 py-1 rounded-full uppercase">
                <AlertCircle className="w-3 h-3" /> Out of Stock
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 💰 Price & Action Section */}
      <div className="flex items-center justify-between w-full md:w-auto mt-6 md:mt-0 gap-8 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8">
        <div className="text-left md:text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing</p>
          <p className="text-3xl font-black text-slate-900 tracking-tighter">
            ₹{option.price}
          </p>
        </div>

        {option.stock > 0 ? (
          <button
            onClick={() => onOrder(option)}
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 active:scale-95 transition-all"
          >
            <ShoppingCart className="w-4 h-4" /> Order
          </button>
        ) : (
          <button
            disabled
            className="flex items-center gap-2 bg-slate-100 text-slate-400 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest cursor-not-allowed border border-slate-200"
          >
            N/A
          </button>
        )}
      </div>
    </div>
  );
}