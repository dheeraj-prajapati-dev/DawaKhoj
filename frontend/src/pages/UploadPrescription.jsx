import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { 
  UploadCloud, FileImage, Camera, 
  MapPin, Loader2, AlertCircle, Sparkles 
} from "lucide-react";

export default function UploadPrescription() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleSubmit = () => {
    if (!image) {
      setError("Please select a prescription image first.");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const formData = new FormData();
          formData.append("image", image);
          formData.append("lat", pos.coords.latitude);
          formData.append("lng", pos.coords.longitude);

          const res = await api.post("/flow/prescription-search", formData);
          navigate("/results", { state: res.data });
        } catch (err) {
          console.error(err);
          setError(err?.response?.data?.message || "AI Analysis failed. Try again.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("GPS Access Required to find nearby pharmacies.");
        setLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 font-sans text-white relative overflow-hidden">
      
      {/* 🌌 Animated Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full -z-10 animate-pulse"></div>

      <div className="bg-slate-900/40 backdrop-blur-2xl p-8 md:p-12 rounded-[3.5rem] shadow-2xl w-full max-w-lg border border-slate-800/60 relative overflow-hidden">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <Sparkles size={14} className="animate-spin-slow" /> AI-Powered Analysis
          </div>
          <h2 className="text-4xl font-black tracking-tighter italic uppercase">
            Scan <span className="text-blue-500">Node</span>
          </h2>
          <p className="text-slate-500 mt-2 font-black uppercase text-[9px] tracking-[0.4em] opacity-80">Upload Prescription for Price Audit</p>
        </div>

        {/* 📸 Upload Area */}
        <div className="space-y-6">
          {!preview ? (
            <label className="flex flex-col items-center justify-center w-full h-72 border-2 border-dashed border-slate-800 rounded-[2.5rem] cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group overflow-hidden bg-slate-950/30">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 group-hover:scale-110 transition-transform shadow-xl mb-4">
                  <UploadCloud className="w-10 h-10 text-slate-500 group-hover:text-blue-500 transition-colors" />
                </div>
                <p className="mb-2 text-sm text-slate-400 font-bold uppercase tracking-widest italic group-hover:text-slate-200 transition-colors">Select Image File</p>
                <p className="text-[9px] text-slate-600 font-black uppercase tracking-tight">JPEG, PNG up to 10MB</p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          ) : (
            <div className="relative group">
              <div className="h-80 w-full rounded-[2.5rem] overflow-hidden border-2 border-blue-500/30 shadow-2xl relative">
                 <img src={preview} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              </div>
              
              <button 
                onClick={() => {setPreview(null); setImage(null);}}
                className="absolute top-4 right-4 p-3 bg-red-500/10 backdrop-blur-md border border-red-500/30 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-xl"
              >
                <AlertCircle size={20} />
              </button>

              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   Ready to Scan
                </div>
              </div>
            </div>
          )}

          {/* Location Badge */}
          <div className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-950/50 border border-slate-800 rounded-2xl">
             <MapPin size={14} className="text-blue-500" />
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">GPS Geolocation Protocol Active</span>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-[10px] font-black uppercase tracking-widest justify-center animate-shake">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[11px] transition-all flex items-center justify-center gap-3 shadow-2xl 
              ${loading 
                ? 'bg-slate-800 text-slate-500' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30 active:scale-[0.98] hover:-translate-y-1'
              }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Initializing AI Core...
              </>
            ) : (
              <>
                Analyze Prescription
                <Camera size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}