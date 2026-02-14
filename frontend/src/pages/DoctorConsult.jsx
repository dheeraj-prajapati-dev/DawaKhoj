import React from 'react';
import { Stethoscope, HeartPulse, Baby, Sparkles, Video, CalendarCheck, Users } from 'lucide-react';

const specialities = [
    { name: "General Physician", icon: <Stethoscope className="w-8 h-8" />, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { name: "Cardiologist", icon: <HeartPulse className="w-8 h-8" />, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
    { name: "Pediatrician", icon: <Baby className="w-8 h-8" />, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { name: "Dermatologist", icon: <Sparkles className="w-8 h-8" />, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" }
];

const DoctorConsult = () => {
  return (
    <div className="p-6 md:p-12 bg-slate-950 min-h-screen relative overflow-hidden text-white">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full -z-10"></div>

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="mb-16 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Live Consultation
            </div>
            <h1 className="text-5xl font-black tracking-tighter italic uppercase">
              Talk to <span className="text-blue-500">Specialists</span>
            </h1>
            <p className="text-slate-500 font-medium mt-2 max-w-md">
              Top-rated doctors ke saath turant video call par paramarsh lein. Ghar baithe sahi ilaaj.
            </p>
          </div>
          
          <div className="hidden lg:flex gap-8 border-l border-slate-800 pl-8">
             <div className="text-center">
                <p className="text-2xl font-black text-white italic">50+</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Doctors Online</p>
             </div>
             <div className="text-center">
                <p className="text-2xl font-black text-blue-500 italic">24/7</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Support</p>
             </div>
          </div>
        </header>

        {/* Specialities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialities.map((s, i) => (
            <div 
              key={i} 
              className={`group relative bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border ${s.border} hover:border-white/20 transition-all duration-500 cursor-pointer overflow-hidden`}
            >
              {/* Subtle Hover Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${s.bg} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className={`w-20 h-20 ${s.bg} ${s.color} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl shadow-black/20`}>
                  {s.icon}
                </div>
                <h3 className="text-lg font-black text-slate-200 group-hover:text-white transition-colors uppercase tracking-tight">
                  {s.name}
                </h3>
                
                <div className="mt-4 flex items-center gap-2 bg-slate-950/50 px-4 py-1.5 rounded-full border border-slate-800 group-hover:border-blue-500/50 transition-all">
                  <Video className="w-3 h-3 text-blue-500" />
                  <span className="text-[10px] text-blue-500 font-black tracking-widest uppercase">COMING SOON</span>
                </div>
              </div>

              {/* Decorative Corner Icon */}
              <div className="absolute -bottom-2 -right-2 text-white/5 group-hover:text-white/10 transition-colors">
                 <CalendarCheck className="w-16 h-16" />
              </div>
            </div>
          ))}
        </div>

        {/* Why Choose Us Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
           <Feature icon={<Users className="text-blue-500" />} title="Verified Doctors" desc="Har doctor ka certification hum check karte hain." />
           <Feature icon={<Video className="text-emerald-500" />} title="Private & Safe" desc="Aapki baatein aur data ekdum encrypted hain." />
           <Feature icon={<CalendarCheck className="text-purple-500" />} title="Instant Booking" desc="No waiting room, turant connect karein." />
        </div>
      </div>
    </div>
  );
};

const Feature = ({ icon, title, desc }) => (
  <div className="flex gap-4 p-6 bg-slate-900/20 rounded-3xl border border-slate-900">
    <div className="mt-1">{icon}</div>
    <div>
      <h4 className="font-black text-sm uppercase tracking-tight text-slate-200">{title}</h4>
      <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">{desc}</p>
    </div>
  </div>
);

export default DoctorConsult;