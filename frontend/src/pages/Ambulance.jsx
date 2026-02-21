import React from 'react';
import { Phone, Navigation, Clock, ShieldAlert, HeartPulse, AlertCircle } from 'lucide-react';

const Ambulance = () => {
  return (
    <div className="min-h-screen bg-slate-950 p-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Pulse Effect for Urgency */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-600/10 blur-[150px] rounded-full -z-10 animate-pulse"></div>

      <div className="max-w-md w-full bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] border border-red-500/20 shadow-2xl shadow-red-950/30 p-8 text-center relative">
        
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 mb-8 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-[0.2em]">
          <HeartPulse className="w-3 h-3 animate-pulse" /> 24/7 Dispatch Active
        </div>

        <div className="relative mb-8 group">
            <span className="text-8xl block transition-transform group-hover:scale-110 duration-500">🚑</span>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-2 bg-black/60 blur-md rounded-full"></div>
        </div>

        <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-3">
          Emergency <span className="text-red-600">Ambulance</span>
        </h1>
        
        <p className="text-slate-400 text-sm font-semibold mb-10 leading-relaxed px-2">
          Critical care within minutes. Connect instantly with private and government emergency medical responders in your vicinity.
        </p>
        
        {/* --- Primary Emergency Call Button --- */}
        <a 
          href="tel:102" 
          className="group relative flex items-center justify-center gap-5 w-full bg-red-600 hover:bg-red-500 text-white py-7 rounded-3xl shadow-[0_20px_40px_rgba(220,38,38,0.25)] transition-all active:scale-95 mb-8 overflow-hidden border-b-4 border-red-800"
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
          
          <div className="bg-white p-3 rounded-2xl text-red-600 shadow-lg">
            <Phone className="w-7 h-7 fill-current" />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80 leading-none mb-1.5">Immediate Dispatch</p>
            <p className="text-3xl font-black tracking-tighter leading-none italic">DIAL 102</p>
          </div>
        </a>

        {/* --- Network Analytics Grid --- */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950/40 border border-slate-800 p-5 rounded-[2rem] flex flex-col items-center gap-3">
                <div className="bg-red-500/10 p-2 rounded-lg">
                   <Clock className="w-5 h-5 text-red-500" />
                </div>
                <div className="text-center">
                   <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Response Time</p>
                   <p className="text-base font-black text-white">8-12 Minutes</p>
                </div>
            </div>
            <div className="bg-slate-950/40 border border-slate-800 p-5 rounded-[2rem] flex flex-col items-center gap-3">
                <div className="bg-emerald-500/10 p-2 rounded-lg">
                   <Navigation className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="text-center">
                   <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Local Network</p>
                   <div className="flex items-center justify-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34d399]"></span>
                      <p className="text-base font-black text-white">Active Units</p>
                   </div>
                </div>
            </div>
        </div>

        {/* --- Footer Note --- */}
        <div className="mt-10 flex items-center justify-center gap-3 text-slate-600 bg-slate-900/20 py-3 rounded-2xl">
          <AlertCircle size={14} className="text-blue-500" />
          <p className="text-[10px] font-bold uppercase tracking-[0.15em]">
            DawaKhoj Quick Response Protocol
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Ambulance;