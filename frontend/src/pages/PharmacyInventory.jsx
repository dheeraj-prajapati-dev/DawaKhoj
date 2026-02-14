import { useEffect, useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import { API, useAuth } from '../context/AuthContext';
import { getMyPharmacyProfile } from '../services/pharmacy.service';
import AddMedicineModal from '../components/inventory/AddMedicineModal';
import EditMedicineModal from '../components/inventory/EditMedicineModal';
import { toast, Toaster } from 'react-hot-toast';
import { 
  Plus, Upload, Package, Search, 
  Trash2, Edit3, ShieldAlert, Beaker, ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PharmacyInventory() {
  const { inventory, loading, fetchInventory } = useInventory();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    const loadingToast = toast.loading("Uploading records...");

    try {
      const res = await API.post('/inventory/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        toast.success(res.data.message || "Upload Success!", { id: loadingToast });
        fetchInventory();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload Failed", { id: loadingToast });
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Kya aap is medicine ko inventory se hatana chahte hain?")) {
      try {
        await API.delete(`/inventory/delete/${id}`);
        toast.success("Medicine Purged");
        fetchInventory();
      } catch (err) {
        toast.error("Operation failed");
      }
    }
  };

  const filteredItems = inventory.filter(item => 
    (item.medicine?.name || item.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-slate-950 font-black text-blue-500 animate-pulse uppercase tracking-[0.3em]">
      ACCESSING DATA VAULT...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 font-sans text-white relative">
      <Toaster position="top-right" />
      
      {/* 🚀 Header Area */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
          <button 
            onClick={() => navigate(-1)} 
            className="text-slate-500 hover:text-blue-500 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest mb-2 transition-colors"
          >
            <ChevronLeft size={14} /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-black tracking-tighter italic flex items-center gap-3 uppercase">
            Manage <span className="text-blue-500">Inventory</span> 
            <Package className="text-blue-500 w-6 h-6" />
          </h1>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          {/* Tactical Search */}
          <div className="relative flex-grow lg:flex-grow-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Filter Terminal..."
              className="bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all w-full lg:w-64"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <label className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border-2 ${isVerified ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500 hover:text-white' : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'}`}>
            <Upload size={14} />
            {uploading ? "⏳" : "Bulk CSV"}
            <input type="file" accept=".csv" hidden disabled={!isVerified || uploading} onChange={handleBulkUpload} />
          </label>

          <button
            disabled={!isVerified}
            onClick={() => setShowAddModal(true)}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isVerified ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/20 hover:bg-blue-500' : 'bg-slate-900 text-slate-600 border-slate-800'}`}
          >
            <Plus size={14} /> Add New
          </button>
        </div>
      </div>

      {!isVerified && (
        <div className="mb-8 rounded-[1.5rem] bg-amber-500/10 border-2 border-amber-500/20 text-amber-500 px-6 py-4 font-bold text-xs flex items-center gap-3 animate-pulse uppercase tracking-widest">
          <ShieldAlert /> Admin Clearance Required. Operations Restricted.
        </div>
      )}

      {/* 📊 Main Terminal Table */}
      <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-slate-800/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-950/50 border-b border-slate-800">
              <tr className="text-left text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Medicine & Type</th>
                <th className="px-8 py-6">Chemical Salt</th>
                <th className="px-8 py-6">Unit Price</th>
                <th className="px-8 py-6">Stock Level</th>
                <th className="px-8 py-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-24 text-slate-600 font-black uppercase italic tracking-widest">
                    <Beaker className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    Database Empty
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-blue-600/5 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-200 group-hover:text-blue-400 italic uppercase text-base transition-colors">
                          {item.medicine?.name || item.name}
                        </span>
                        <span className="text-[10px] font-bold text-blue-500/60 uppercase tracking-tight">
                          {item.medicine?.category || 'Pharma'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-slate-400 font-medium">
                      {item.medicine?.salt || 'N/A'}
                    </td>
                    <td className="px-8 py-6 font-black text-emerald-400 text-lg italic">
                      ₹{item.price}
                    </td>
                    
                    <td className="px-8 py-6">
                      {item.stock === 0 ? (
                        <span className="px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/30">
                          OUT OF STOCK
                        </span>
                      ) : (
                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${item.stock <= 10 ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 animate-pulse' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                          {item.stock} Units Available
                        </span>
                      )}
                    </td>

                    <td className="px-8 py-6">
                      {/* Actions hamesha visible rahengi but hover par highlight hongi */}
                      <div className="flex justify-center gap-3">
                        <button
                          disabled={!isVerified}
                          onClick={() => setEditingItem(item)}
                          className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white transition-all disabled:opacity-10 border border-slate-700/50"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          disabled={!isVerified}
                          onClick={() => handleDelete(item._id)}
                          className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:bg-red-600 hover:text-white transition-all disabled:opacity-10 border border-slate-700/50"
                        >
                          <Trash2 size={16} />
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