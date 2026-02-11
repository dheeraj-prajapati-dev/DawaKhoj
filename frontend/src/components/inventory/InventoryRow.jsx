import { useState } from 'react';
import EditMedicineModal from './EditMedicineModal'; // 🔥 Naam sahi kar lena file ka
import { API } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function InventoryRow({ item, refresh, isVerified }) {
  const [showEdit, setShowEdit] = useState(false);

  const handleDelete = async () => {
    if (!isVerified) return;

    if (window.confirm(`Delete ${item.medicine?.name}?`)) {
      try {
        // 🔥 URL matches backend: /inventory/delete/:id
        await API.delete(`/inventory/delete/${item._id}`);
        toast.success("Item deleted");
        refresh();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  return (
    <>
      <tr className="border-b hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3 font-bold text-gray-800 uppercase italic">
            {item.medicine?.name || "Unknown"}
        </td>
        <td className="px-4 py-3 text-gray-600">{item.medicine?.salt || "-"}</td>
        <td className="px-4 py-3 font-semibold text-blue-700">₹{item.price}</td>
        <td className="px-4 py-3">
            <span className={`px-2 py-1 rounded text-xs ${item.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {item.stock} in stock
            </span>
        </td>
        <td className="px-4 py-3 flex gap-2">
          <button
            disabled={!isVerified}
            onClick={() => setShowEdit(true)}
            className="text-blue-600 hover:underline disabled:text-gray-400"
          >
            Edit
          </button>
          <button
            disabled={!isVerified}
            onClick={handleDelete}
            className="text-red-600 hover:underline disabled:text-gray-400"
          >
            Delete
          </button>
        </td>
      </tr>

      {showEdit && isVerified && (
        <EditMedicineModal
          item={item}
          onClose={() => setShowEdit(false)}
          refresh={refresh}
        />
      )}
    </>
  );
}