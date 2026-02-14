import { useLocation, useNavigate } from "react-router-dom";
import PharmacyPriceCard from "../components/PharmacyPriceCard";
import { API } from "../context/AuthContext"; 
import { toast, Toaster } from "react-hot-toast";
import { 
  ArrowLeft, FileText, Search, Sparkles, 
  MapPin, AlertCircle, ShoppingCart 
} from "lucide-react";

export default function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.results) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
        <div className="bg-slate-900/50 p-12 rounded-[3.5rem] border border-slate-800 text-center backdrop-blur-xl">
          <Search className="w-20 h-20 text-slate-800 mx-auto mb-6 animate-pulse" />
          <p className="text-slate-400 font-black text-xl italic uppercase tracking-tighter">Data Stream Interrupted</p>
          <button 
            onClick={() => navigate("/upload")} 
            className="mt-8 bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black transition-all hover:scale-105 shadow-xl shadow-blue-900/20"
          >
            RE-SCAN PRESCRIPTION
          </button>
        </div>
      </div>
    );
  }

  const { results, extractedText, imageUrl } = state;

  const handleOrder = async (option) => {
    try {
      const name = option.medicineName || "Medicine";
      const confirmOrder = window.confirm(`Confirm order for ${name} from ${option.pharmacy}?`);
      
      if (confirmOrder) {
        const response = await API.post('/orders/create', { 
          pharmacyId: option.pharmacyId, 
          medicineName: name,
          price: option.price 
        });

        if (response.data.success) {
          toast.success("Order Logged in Database! 🎉", {
            style: { background: '#0f172a', color: '#fff', border: '1px solid #3b82f6' }
          });
          setTimeout(() => navigate('/my-orders'), 1500);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed");
      if (err.response?.status === 401) navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-10 px-4 font-sans relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Background Neon Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -z-10"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <button 
            onClick={() => navigate("/upload")} 
            className="flex items-center gap-2 font-black text-slate-500 hover:text-blue-500 transition-colors uppercase text-[10px] tracking-[0.2em] group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            Back to Scanner
          </button>
          <div className="text-center md:text-right">
            <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
              Price <span className="text-blue-500">Analysis</span>
            </h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2 italic">Scanning local nodes for inventory...</p>
          </div>
        </div>

        {/* Prescription View Section */}
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-[3rem] border border-slate-800/60 p-6 md:p-10 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles className="w-24 h-24 text-blue-500" />
          </div>

          <h2 className="text-[10px] font-black text-blue-500/80 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
            <div className="w-8 h-[1px] bg-blue-500/30"></div>
            <FileText className="w-4 h-4" /> AI Interpretation
          </h2>

          <div className="flex flex-col lg:flex-row gap-10">
            {imageUrl && (
              <div className="w-full lg:w-80 h-[400px] shrink-0 rounded-[2.5rem] overflow-hidden border-2 border-slate-800 shadow-2xl group relative">
                <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-transparent transition-colors z-10"></div>
                <img src={imageUrl} alt="Prescription" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute bottom-4 left-4 z-20 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800">
                   <p className="text-[9px] font-black uppercase tracking-widest text-blue-400">Source Image</p>
                </div>
              </div>
            )}
            <div className="flex-1">
              <div className="bg-slate-950/50 rounded-[2.5rem] p-8 h-full border border-slate-800/50 relative">
                <div className="absolute top-4 right-6 text-blue-500 opacity-20"><Activity size={40} /></div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">OCR Data Extract:</p>
                <div className="text-slate-300 font-bold text-lg leading-relaxed whitespace-pre-wrap italic font-mono">
                  <span className="text-blue-500">"</span>
                  {extractedText || "Analyzing glyphs..."}
                  <span className="text-blue-500">"</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Medicine Wise Results */}
        <div className="space-y-16">
          {results.map((item, idx) => {
            const minPrice = item.options.length > 0 ? Math.min(...item.options.map(o => o.price)) : null;

            return (
              <div key={idx} className="space-y-6 relative">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-4 ml-2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                       <ShoppingCart size={20} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-100 uppercase italic tracking-tighter">
                        {item.requestedMedicine.brand}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Composition: {item.requestedMedicine.salt}
                      </p>
                    </div>
                  </div>
                  
                  {item.options.length > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                        {item.options.length} Local Sources Found
                      </span>
                    </div>
                  )}
                </div>

                {item.options.length === 0 ? (
                  <div className="bg-slate-900/30 border-2 border-dashed border-slate-800 p-12 rounded-[3rem] text-center group hover:border-red-500/30 transition-colors">
                    <AlertCircle className="w-10 h-10 text-slate-700 mx-auto mb-4 group-hover:text-red-500/50 transition-colors" />
                    <p className="text-slate-500 font-black uppercase text-xs italic tracking-[0.2em]">Inventory Exhausted in 5km Radius</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {item.options.map((opt, i) => (
                      <PharmacyPriceCard
                        key={i}
                        option={opt}
                        isBest={opt.price === minPrice}
                        onOrder={handleOrder}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}