import { useLocation, useNavigate } from "react-router-dom";
import PharmacyPriceCard from "../components/PharmacyPriceCard";
import { API } from "../context/AuthContext"; 
import { toast, Toaster } from "react-hot-toast";
import { ArrowLeft, FileText, Search } from "lucide-react";

export default function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.results) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="bg-white p-10 rounded-[3rem] shadow-xl text-center">
          <Search className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 font-black text-xl italic uppercase">Data missing, try again!</p>
          <button onClick={() => navigate("/upload")} className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-2xl font-black">BACK TO UPLOAD</button>
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
          toast.success("Order Created Successfully! 🎉");
          setTimeout(() => navigate('/my-orders'), 1500);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed");
      if (err.response?.status === 401) navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-10 px-4">
      <Toaster />
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate("/upload")} className="flex items-center gap-2 font-black text-slate-400 hover:text-blue-600 transition-colors uppercase text-sm">
            <ArrowLeft className="w-5 h-5" /> Back to Upload
          </button>
          <div className="text-right">
            <h1 className="text-3xl font-black text-slate-900 italic tracking-tighter">DAWAKHOJ<span className="text-blue-600"> RESULTS</span></h1>
          </div>
        </div>

        {/* Prescription View Section */}
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-blue-100/50 p-6 md:p-8 mb-12 border border-slate-50">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" /> Captured Prescription
          </h2>
          <div className="flex flex-col lg:flex-row gap-10">
            {imageUrl && (
              <div className="w-full lg:w-72 h-96 shrink-0 rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-inner group">
                <img src={imageUrl} alt="Prescription" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
            )}
            <div className="flex-1">
              <div className="bg-slate-50 rounded-[2rem] p-6 h-full border border-slate-100">
                <p className="text-xs font-black text-blue-600 uppercase mb-3">Extracted Text:</p>
                <div className="text-slate-700 font-bold text-sm leading-relaxed whitespace-pre-wrap italic">
                  "{extractedText || "No text detected"}"
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Medicine Wise Results */}
        <div className="space-y-10">
          {results.map((item, idx) => {
            const minPrice = item.options.length > 0 ? Math.min(...item.options.map(o => o.price)) : null;

            return (
              <div key={idx} className="space-y-4">
                <div className="flex items-center gap-4 ml-4">
                  <div className="h-2 w-2 rounded-full bg-blue-600" />
                  <h3 className="text-xl font-black text-slate-800 uppercase italic">
                    {item.requestedMedicine.brand} <span className="text-slate-400 text-sm not-italic ml-2">({item.requestedMedicine.salt})</span>
                  </h3>
                </div>

                {item.options.length === 0 ? (
                  <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-8 rounded-[2.5rem] text-center">
                    <p className="text-slate-400 font-black uppercase text-sm italic tracking-widest">Out of stock in nearby pharmacies</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
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