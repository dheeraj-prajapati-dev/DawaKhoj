import React from 'react';
import { Phone, Navigation, Clock, ShieldAlert } from 'lucide-react';

const Ambulance = () => {
  return (
    <div className="min-h-screen bg-slate-950 p-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Red Glow for Urgency */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-red-600/20 blur-[120px] rounded-full -z-10 animate-pulse"></div>

      <div className="max-w-md w-full bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-red-500/30 shadow-2xl shadow-red-950/20 p-8 text-center relative">
        
        {/* Urgent Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.2em]">
          <ShieldAlert className="w-3 h-3" /> Emergency Response Active
        </div>

        <div className="relative mb-6">
            <span className="text-7xl block animate-bounce">🚑</span>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-2 bg-black/40 blur-md rounded-full"></div>
        </div>

        <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase mb-2">
          Ambulance <span className="text-red-600">Service</span>
        </h1>
        <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed px-4">
          Seconds matter. Apne location ke sabse kareeb private ya govt ambulance abhi bulayein.
        </p>
        
        {/* --- Primary Call Button --- */}
        <a 
          href="tel:102" 
          className="group relative flex items-center justify-center gap-4 w-full bg-red-600 hover:bg-red-500 text-white py-6 rounded-3xl shadow-[0_15px_30px_rgba(220,38,38,0.3)] transition-all active:scale-95 mb-8 overflow-hidden"
        >
          {/* Button Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          
          <div className="bg-white/20 p-2 rounded-xl">
            <Phone className="w-6 h-6 fill-current" />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 leading-none mb-1">Emergency Call</p>
            <p className="text-2xl font-black tracking-tighter leading-none">CALL 102 NOW</p>
          </div>
        </a>

        {/* --- Info Grid --- */}
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-2xl flex flex-col items-center gap-2">
                <Clock className="w-5 h-5 text-red-500" />
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Arrival Time</p>
                <p className="text-sm font-bold text-slate-200 tracking-tight">8-12 Mins</p>
            </div>
            <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-2xl flex flex-col items-center gap-2">
                <Navigation className="w-5 h-5 text-emerald-500" />
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Units</p>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                    <p className="text-sm font-bold text-slate-200 tracking-tight">24 Nearby</p>
                </div>
            </div>
        </div>

        <p className="mt-8 text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
          DawaKhoj Quick Response Network ⚡
        </p>
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Ambulance;