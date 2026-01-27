import { useEffect, useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import { getMyPharmacyProfile } from '../services/pharmacy.service';
import AddMedicineModal from '../components/inventory/AddMedicineModal';
import EditMedicineModal from '../components/inventory/EditMedicineModal'; // ✅ Naya Import
import axios from 'axios';

export default function PharmacyInventory() {
  const { inventory, loading, fetchInventory } = useInventory();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // ✅ Selected item for edit
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getMyPharmacyProfile();
        setIsVerified(res.data.isVerified);
      } catch {
        window.location.href = '/pharmacy/register';
      }
    };
    loadProfile();
  }, []);

  // ✅ Delete Function
  const handleDelete = async (id) => {
    if (window.confirm("Kya aap is medicine ko inventory se hatana chahte hain?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/inventory/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Medicine deleted successfully!");
        fetchInventory();
      } catch (err) {
        alert(err.response?.data?.message || "Delete failed");
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading inventory...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">🏥 Pharmacy Inventory</h1>
        <div className="flex gap-3">
          <button
            disabled={!isVerified}
            onClick={() => setShowAddModal(true)}
            className={`px-4 py-2 rounded text-white text-sm ${isVerified ? 'bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            + Add Medicine
          </button>
          <button
            onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
            className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="p-6">
        {!isVerified && (
          <div className="mb-4 rounded bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3">
            ⚠️ Admin verification pending. You can only view items.
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left">
                <th className="px-4 py-3">Medicine</th>
                <th className="px-4 py-3">Salt</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-500">No items found.</td>
                </tr>
              ) : (
                inventory.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{item.medicine?.name || item.name}</td>
                    <td className="px-4 py-3 text-gray-600">{item.medicine?.salt || item.salt}</td>
                    <td className="px-4 py-3">₹{item.price}</td>
                    <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${item.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {item.stock} in stock
                        </span>
                    </td>
                    <td className="px-4 py-3 flex justify-center gap-4">
                      <button
                        disabled={!isVerified}
                        onClick={() => setEditingItem(item)} // ✅ Modal khulega
                        className="text-blue-600 hover:text-blue-800 font-medium disabled:text-gray-400"
                      >
                        Edit
                      </button>
                      <button
                        disabled={!isVerified}
                        onClick={() => handleDelete(item._id)}
                        className="text-red-500 hover:text-red-700 font-medium disabled:text-gray-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ MODALS SECTION */}
      {showAddModal && isVerified && (
        <AddMedicineModal onClose={() => setShowAddModal(false)} refresh={fetchInventory} />
      )}

      {editingItem && (
        <EditMedicineModal 
          item={editingItem} 
          onClose={() => setEditingItem(null)} 
          refresh={fetchInventory} 
        />
      )}
    </div>
  );
}