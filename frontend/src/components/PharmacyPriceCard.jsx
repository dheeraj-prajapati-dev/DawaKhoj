export default function PharmacyPriceCard({ option, isBest }) {
  return (
    <div
      className={`border rounded-lg p-4 flex justify-between items-center transition
        ${isBest ? "border-green-500 bg-green-50" : "hover:shadow-sm"}
      `}
    >
      <div>
        <div className="flex items-center gap-2">
          <p className="font-semibold">{option.pharmacy}</p>

          {isBest && (
            <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">
              Best Price
            </span>
          )}
        </div>

        <p className="text-sm text-gray-500">
          Stock: {option.stock}
        </p>

        {option.homeDelivery && (
          <span className="text-xs text-green-600">
            🚚 Home Delivery Available
          </span>
        )}
      </div>

      <div className="text-right">
        <p className="text-xl font-bold text-blue-600">
          ₹{option.price}
        </p>
        <button className="mt-2 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
          Contact Store
        </button>
      </div>
    </div>
  );
}
