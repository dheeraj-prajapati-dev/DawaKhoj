export default function PharmacyPriceCard({ option, isBest, onOrder }) {
  return (
    <div className={`p-4 border rounded-lg flex justify-between items-center ${
      isBest ? 'border-green-500 bg-green-50' : 'border-gray-200'
    }`}>
      <div>
        <h4 className="font-bold text-lg text-gray-800">{option.pharmacy}</h4>
        <p className="text-sm text-gray-600 italic">Salt: {option.salt}</p>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-xl font-bold text-blue-700">₹{option.price}</p>
          {isBest && (
            <span className="text-[10px] bg-green-600 text-white px-2 py-0.5 rounded uppercase font-bold">
              Best Match
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {option.homeDelivery ? "✅ Home Delivery Available" : "🏠 Store Pickup Only"}
        </p>
      </div>

      <button
        onClick={() => onOrder(option)}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
      >
        Order Now
      </button>
    </div>
  );
}