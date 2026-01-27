import { useLocation, useNavigate } from "react-router-dom";
import PharmacyPriceCard from "../components/PharmacyPriceCard";
import axios from "axios"; // API call ke liye

export default function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No results found</p>
      </div>
    );
  }

  const { results, extractedText, imageUrl } = state;

  // 🔥 NAYA ORDER FUNCTION
  const handleOrder = async (option) => {
    console.log("Ordering from option:", option);
  try {
    const name = option.medicineName || option.salt || "Medicine";
    const confirmOrder = window.confirm(`Confirm order for ${name} from ${option.pharmacy}?`);
    
    if (confirmOrder) {
      const token = localStorage.getItem("token"); // Auth check
      
      const response = await axios.post('http://localhost:5000/api/orders/create', { 
        pharmacyId: option.pharmacyId, 
        medicineName: name,
        price: option.price 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        alert(`Order sent for ${name} to ${option.pharmacy}!`);
      }
    }
  } catch (err) {
    console.error("FULL ERROR DETAILS:", err.response || err );
    alert(`Order failed: ${err.response?.data?.message || "Check Console"}`);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate("/upload")}
          className="text-blue-600 font-medium"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-semibold">Prescription Results</h1>
      </div>

      {/* Prescription Summary */}
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-5 mb-8">
        <h2 className="font-semibold mb-4">Detected Prescription</h2>
        <div className="flex flex-col md:flex-row gap-6">
          {imageUrl && (
            <div
              className="shrink-0 border rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden"
              style={{ width: 260, height: 360 }}
            >
              <img
                src={imageUrl}
                alt="Prescription"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
          <div className="flex-1 text-sm text-gray-700 whitespace-pre-wrap border rounded-lg p-4 bg-gray-50">
            {extractedText}
          </div>
        </div>
      </div>

      {/* Medicine Results */}
      <div className="max-w-5xl mx-auto space-y-6">
        {results.map((item, idx) => {
          const minPrice =
            item.options.length > 0
              ? Math.min(...item.options.map(o => o.price))
              : null;

          return (
            <div key={idx} className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-500">
              <h3 className="text-lg font-bold mb-3 text-blue-900">
                {item.requestedMedicine.brand?.toUpperCase()} ({item.requestedMedicine.salt})
              </h3>

              {item.options.length === 0 ? (
                <p className="text-gray-500 italic">
                  Medicine not available nearby
                </p>
              ) : (
                <div className="grid gap-3">
                  {item.options.map((opt, i) => (
                    <PharmacyPriceCard
                      key={i}
                      option={opt}
                      isBest={opt.price === minPrice}
                      onOrder={handleOrder} // 🔥 Function pass kiya
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}