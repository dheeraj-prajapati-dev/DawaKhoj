import { useEffect, useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import { API, useAuth } from '../context/AuthContext'; // 🔥 Use API and logout from context
import { getMyPharmacyProfile } from '../services/pharmacy.service';
import AddMedicineModal from '../components/inventory/AddMedicineModal';
import EditMedicineModal from '../components/inventory/EditMedicineModal';
import { toast } from 'react-hot-toast';

export default function PharmacyInventory() {
  const { inventory, loading, fetchInventory } = useInventory();
  const { logout } = useAuth(); // 🔥 Get logout function
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
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

  const handleDelete = async (id) => {
    if (window.confirm("Kya aap is medicine ko inventory se hatana chahte hain?")) {
      try {
        // 🔥 Use API instance
        await API.delete(`/inventory/delete/${id}`);
        toast.success("Medicine deleted successfully!");
        fetchInventory();
      } catch (err) {
        toast.error(err.response?.data?.message || "Delete failed");
      }
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen font-black text-blue-600 animate-pulse">
      LOADING INVENTORY...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="bg-white border-b border-gray-100 px-8 py-6 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">🏥 Inventory</h1>
        <div className="flex gap-4">
          <button
            disabled={!isVerified}
            onClick={() => setShowAddModal(true)}
            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isVerified ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 hover:bg-blue-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            + Add Medicine
          </button>
          <button
            onClick={logout} // 🔥 Use context logout
            className="px-6 py-2.5 rounded-2xl bg-white border-2 border-red-50 text-red-500 hover:bg-red-50 text-[10px] font-black uppercase tracking-widest transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        {!isVerified && (
          <div className="mb-8 rounded-[1.5rem] bg-yellow-50 border-2 border-yellow-100 text-yellow-700 px-6 py-4 font-bold text-sm flex items-center gap-3">
            <span className="text-xl">⚠️</span> Admin verification pending. You can only view items.
          </div>
        )}

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr className="text-left text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Medicine</th>
                <th className="px-8 py-5">Salt</th>
                <th className="px-8 py-5">Price</th>
                <th className="px-8 py-5">Stock Status</th>
                <th className="px-8 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inventory.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-20 text-gray-300 font-black uppercase italic tracking-widest">No items found.</td>
                </tr>
              ) : (
                inventory.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-all">
                    <td className="px-8 py-5 font-black text-gray-800 italic uppercase text-base">{item.medicine?.name || item.name}</td>
                    <td className="px-8 py-5 text-gray-500 font-medium">{item.medicine?.salt || item.salt}</td>
                    <td className="px-8 py-5 font-black text-gray-900">₹{item.price}</td>
                    
                    <td className="px-8 py-5">
                      {item.stock === 0 ? (
                        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-red-100 text-red-600">
                          Out of Stock
                        </span>
                      ) : item.stock <= 10 ? (
                        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-yellow-100 text-yellow-700 animate-pulse">
                          Low Stock: {item.stock}
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-green-100 text-green-700">
                          {item.stock} Available
                        </span>
                      )}
                    </td>

                    <td className="px-8 py-5">
                      <div className="flex justify-center gap-6">
                        <button
                          disabled={!isVerified}
                          onClick={() => setEditingItem(item)}
                          className="text-blue-600 hover:text-blue-800 font-black text-[10px] uppercase tracking-widest disabled:opacity-30"
                        >
                          Edit
                        </button>
                        <button
                          disabled={!isVerified}
                          onClick={() => handleDelete(item._id)}
                          className="text-red-500 hover:text-red-700 font-black text-[10px] uppercase tracking-widest disabled:opacity-30"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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