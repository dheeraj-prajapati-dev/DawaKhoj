import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  // Naye Services ka Data
  const services = [
    { title: "Doctor Consult", icon: "👨‍⚕️", path: "/doctors", desc: "Specialist se baat karein" },
    { title: "Lab Tests", icon: "🧪", path: "/labs", desc: "Ghar se sample collection" },
    { title: "Ambulance", icon: "🚑", path: "/ambulance", desc: "Emergency SOS service" },
    { title: "Order Medicine", icon: "💊", path: "/search", desc: "Dawa dhoondhein aur mangayein" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center p-6 pt-20">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent italic">
          DawaKhoj+
        </h1>
        <p className="text-gray-400 max-w-md mx-auto">
          India ka sabse tez healthcare network. Prescription upload karein ya specialist doctor se milein.
        </p>
      </div>

      {/* Main Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-16 justify-center">
  <button
    onClick={() => navigate("/upload")}
    className="px-8 py-4 bg-blue-600 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-900/40 transition-all active:scale-95 flex items-center gap-2 text-white"
  >
    Upload Prescription 📄
  </button>

  <button
    onClick={() => navigate("/search")}
    className="px-8 py-4 bg-slate-800 border border-slate-700 rounded-2xl font-bold hover:bg-slate-700 transition-all active:scale-95 flex items-center gap-2 text-white"
  >
    Search Medicine 🔍
  </button>
</div>

      {/* 🚀 New Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {services.map((service, index) => (
          <div 
            key={index}
            onClick={() => navigate(service.path)}
            className="p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:border-blue-500 cursor-pointer transition-all group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
              {service.icon}
            </div>
            <h3 className="text-xl font-bold mb-1">{service.title}</h3>
            <p className="text-gray-500 text-sm">{service.desc}</p>
            <div className="mt-4 text-xs font-black text-blue-500 uppercase tracking-widest">
                Explore Now →
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Status */}
      <div className="mt-20 p-4 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center gap-3">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        <p className="text-xs text-gray-500 font-medium">150+ Pharmacies & 50+ Doctors currently online</p>
      </div>
    </div>
  );
}