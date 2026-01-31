// PharmacyPriceCard.jsx

export default function PharmacyPriceCard({ option, isBest, onOrder }) {
  return (
    <div className={`p-4 border rounded-lg flex justify-between items-center ${isBest ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
      <div>
        <h4 className="font-bold text-gray-800">{option.pharmacy}</h4>
        
        {/* 🔥 Medicine ka Asli Naam (Dolo/Crocin) dikhao */}
        <p className="text-sm font-bold text-blue-600">
          {option.medicineName} 
        </p>
        <p className="text-xs text-gray-500">Salt: {option.salt}</p>
        
        <div className="mt-1">
          {option.stock > 0 ? (
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded">
              In Stock: {option.stock}
            </span>
          ) : (
            <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      <div className="text-right">
        <p className="text-xl font-bold text-gray-900">₹{option.price}</p>
        
        {option.stock > 0 ? (
          <button
            onClick={() => onOrder(option)}
            className="mt-2 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            Order Now
          </button>
        ) : (
          <button
            disabled
            className="mt-2 bg-gray-300 text-gray-500 px-4 py-1.5 rounded-lg text-sm font-semibold cursor-not-allowed"
          >
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
}