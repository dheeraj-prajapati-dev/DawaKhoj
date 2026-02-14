import React from 'react';
import { Beaker, Activity, Droplets, Microscope, ShieldCheck, ChevronRight } from 'lucide-react';

const packages = [
    { 
        title: "Full Body Checkup", 
        tests: "60+ Essential Tests", 
        price: "999", 
        icon: <Activity className="w-6 h-6" />,
        color: "blue",
        tag: "Best Seller"
    },
    { 
        title: "Diabetes Care", 
        tests: "HbA1c, FBS, PPBS & more", 
        price: "499", 
        icon: <Droplets className="w-6 h-6" />,
        color: "emerald",
        tag: "Fast Results"
    },
    { 
        title: "Vitamin Profile", 
        tests: "Vit-D, B12, Calcium", 
        price: "1299", 
        icon: <Beaker className="w-6 h-6" />,
        color: "purple",
        tag: "Expert Choice"
    }
];

const LabTests = () => {
  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full -z-10"></div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]">
            <Microscope className="w-3 h-3" /> NABL Accredited Labs
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase mb-4">
            Health <span className="text-blue-500">Packages</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-md mx-auto text-sm">
            Ghar baithe blood test karwayein. Safe, hygienic aur 24 ghante mein reports.
          </p>
        </header>

        {/* Packages List */}
        <div className="flex flex-col gap-6">
          {packages.map((p, i) => (
            <div 
              key={i} 
              className="group relative bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-slate-800 hover:border-blue-500/30 transition-all duration-500 overflow-hidden p-1"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between p-7 gap-6">
                
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-500`}>
                    {p.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-black text-slate-100 uppercase tracking-tight">{p.title}</h3>
                        <span className="text-[8px] font-black bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 uppercase tracking-widest">{p.tag}</span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">{p.tests}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Free Home Sample Collection</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-end gap-2 border-t md:border-t-0 border-slate-800 pt-4 md:pt-0">
                  <div className="flex flex-col md:items-end">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1 text-glow-none">Special Price</p>
                    <p className="text-3xl font-black text-white italic tracking-tighter">₹{p.price}</p>
                  </div>
                  <button className="group/btn flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-900/20">
                    Book Now <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>
              {/* Subtle Progress bar effect at bottom */}
              <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>

        {/* Info Footer */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-slate-600">
            <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Certified Labs</span>
            </div>
            <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Digital Reports</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LabTests;