import { useNavigate } from "react-router-dom";
import CategoryList from "../components/CategoryList";
import { 
  FileText, Search, Activity, 
  Stethoscope, TestTube, Truck, Pill 
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const services = [
    { title: "Doctor Consult", icon: <Stethoscope className="w-10 h-10" />, path: "/doctors", desc: "Top specialist se video call par baat karein" },
    { title: "Lab Tests", icon: <TestTube className="w-10 h-10" />, path: "/labs", desc: "Ghar se sample collection aur digital reports" },
    { title: "Ambulance", icon: <Truck className="w-10 h-10" />, path: "/ambulance", desc: "Emergency SOS: Fastest response nearby" },
    { title: "Order Medicine", icon: <Pill className="w-10 h-10" />, path: "/search", desc: "Local pharmacy se 60 min delivery" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center overflow-x-hidden">
      
      {/* 🌟 Global Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full -z-10"></div>

      {/* 🚀 Hero Section */}
      <section className="pt-32 pb-12 px-6 text-center relative w-full max-w-5xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
          <Activity className="w-3 h-3" /> Next-Gen Healthcare
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-b from-white via-white to-slate-500 bg-clip-text text-transparent italic tracking-tighter leading-none">
          DawaKhoj<span className="text-blue-500 font-black">+</span>
        </h1>
        
        <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed mb-12">
          Ab har dawai milegi turant. India ka pehla <span className="text-white italic">Real-Time</span> pharmacy network.
        </p>

        {/* ⚡ Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <button onClick={() => navigate("/upload")} className="group relative w-full sm:w-auto px-10 py-5 bg-blue-600 rounded-[2rem] font-black hover:bg-blue-500 transition-all duration-500 shadow-[0_20px_60px_rgba(37,99,235,0.3)] flex items-center justify-center gap-4 overflow-hidden">
            <FileText className="w-6 h-6" /> <span className="text-lg">Upload Prescription</span>
          </button>

          <button onClick={() => navigate("/search")} className="w-full sm:w-auto px-10 py-5 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[2rem] font-black hover:bg-slate-800 transition-all duration-500 flex items-center justify-center gap-4">
            <Search className="w-6 h-6 text-blue-500" /> <span className="text-lg">Search Medicine</span>
          </button>
        </div>

        {/* 🟢 NEW: Integrated Status Card (Not Fixed) */}
        <div className="max-w-3xl mx-auto px-8 py-4 bg-slate-900/30 rounded-3xl border border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-sm transition-all hover:border-blue-500/20">
            <div className="flex items-center gap-3">
               <div className="relative">
                 <span className="block w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                 <span className="absolute inset-0 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping opacity-40"></span>
               </div>
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Network Status</p>
            </div>
            <div className="hidden md:block h-4 w-[1px] bg-slate-800"></div>
            <p className="text-xs md:text-sm text-slate-300 font-bold italic">
               <span className="text-blue-500">150+ Pharmacies</span> & <span className="text-emerald-500">50+ Doctors</span> live in Silvassa area
            </p>
        </div>
      </section>

      {/* 🏥 Shop by Category Section */}
      <div className="w-full bg-slate-950/50 py-10">
          <CategoryList /> 
      </div>

      {/* 🚀 Other Services Section */}
      <section className="w-full max-w-7xl mt-12 mb-32 px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Essential <span className="text-blue-500">Services</span></h2>
                <p className="text-slate-500 font-medium mt-2">Healthcare ki har suvidha ab aapke mobile par.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div 
              key={index}
              onClick={() => navigate(service.path)}
              className="group relative p-10 bg-slate-900/40 border border-slate-800/60 rounded-[3rem] hover:border-blue-500/40 hover:bg-slate-900/80 cursor-pointer transition-all duration-500 backdrop-blur-xl overflow-hidden"
            >
              {/* Card Hover Glow */}
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
              
              <div className="text-blue-500 mb-8 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
                {service.icon}
              </div>
              
              <h3 className="text-2xl font-black mb-3 tracking-tight text-slate-100 group-hover:text-white">{service.title}</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 group-hover:text-slate-400">{service.desc}</p>
              
              <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">
                 Explore Service <div className="w-8 h-[1px] bg-blue-500/30 group-hover:w-12 transition-all"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      

    </div>
  );
}