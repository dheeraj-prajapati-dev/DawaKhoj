import { useNavigate } from "react-router-dom";
import CategoryList from "../components/CategoryList"; // 🔥 Naya component import kiya

export default function Home() {
  const navigate = useNavigate();

  const services = [
    { title: "Doctor Consult", icon: "👨‍⚕️", path: "/doctors", desc: "Specialist se baat karein" },
    { title: "Lab Tests", icon: "🧪", path: "/labs", desc: "Ghar se sample collection" },
    { title: "Ambulance", icon: "🚑", path: "/ambulance", desc: "Emergency SOS service" },
    { title: "Order Medicine", icon: "💊", path: "/search", desc: "Dawa dhoondhein aur mangayein" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center p-6 pt-20">
      
      {/* 🌟 Premium Hero Section */}
      <div className="text-center mb-12 relative">
        {/* Background Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-600/20 blur-[120px] rounded-full"></div>
        
        <h1 className="relative text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent italic tracking-tighter">
          DawaKhoj+
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto text-lg font-medium leading-relaxed">
          India ka sabse tez healthcare network. <br />
          <span className="text-gray-600">Categories browse karein ya prescription upload karein.</span>
        </p>
      </div>

      {/* ⚡ Main Action Buttons (Professional Look) */}
      <div className="flex flex-wrap gap-6 mb-20 justify-center relative z-10">
        <button
          onClick={() => navigate("/upload")}
          className="group relative px-10 py-5 bg-blue-600 rounded-2xl font-black hover:bg-blue-500 transition-all duration-300 shadow-[0_20px_50px_rgba(8,_112,_184,_0.3)] flex items-center gap-3 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="text-xl">📄</span> Upload Prescription
        </button>

        <button
          onClick={() => navigate("/search")}
          className="px-10 py-5 bg-slate-900 border border-slate-800 rounded-2xl font-black hover:bg-slate-800 hover:border-slate-700 transition-all duration-300 flex items-center gap-3 shadow-2xl"
        >
          <span className="text-xl">🔍</span> Search Medicine
        </button>
      </div>

      {/* 🏥 Shop by Category (Now using the Professional Component) */}
      <div className="w-full max-w-7xl">
         <CategoryList /> 
      </div>

      {/* 🚀 Main Services Section */}
      <div className="w-full max-w-7xl mt-12 mb-20 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div 
              key={index}
              onClick={() => navigate(service.path)}
              className="p-8 bg-slate-900/40 border border-slate-800/60 rounded-[2.5rem] hover:border-blue-500/50 hover:bg-slate-900 cursor-pointer transition-all duration-500 group backdrop-blur-sm"
            >
              <div className="text-5xl mb-6 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2 tracking-tight">{service.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">{service.desc}</p>
              <div className="inline-flex items-center text-xs font-black text-blue-500 uppercase tracking-[0.2em] group-hover:gap-2 transition-all">
                  EXPLORE NOW <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🟢 Online Status Indicator */}
      <div className="mb-10 px-6 py-3 bg-slate-900/80 rounded-full border border-blue-500/10 flex items-center gap-4 backdrop-blur-xl">
        <div className="flex items-center gap-2">
           <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></span>
           <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Live Status</p>
        </div>
        <div className="h-4 w-[1px] bg-slate-800"></div>
        <p className="text-xs text-blue-400 font-medium tracking-tight">150+ Pharmacies & 50+ Doctors currently online</p>
      </div>
    </div>
  );
}