import InventoryRow from './InventoryRow';

export default function InventoryTable({ inventory, refresh, isVerified }) {
  if (!inventory || inventory.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 bg-white rounded-lg border-2 border-dashed">
        Inventory khali hai. Medicine add karein!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="w-full text-left bg-white">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-bold">
          <tr>
            <th className="px-4 py-3">Medicine Name</th>
            <th className="px-4 py-3">Salt</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <InventoryRow
              key={item._id}
              item={item}
              refresh={refresh}
              isVerified={isVerified}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}