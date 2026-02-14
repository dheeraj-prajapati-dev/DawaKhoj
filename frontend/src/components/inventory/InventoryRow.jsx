import { useState } from 'react';
import EditMedicineModal from './EditMedicineModal';
import { API } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Edit2, Trash2, AlertTriangle, CheckCircle, ShieldOff } from 'lucide-react';

export default function InventoryRow({ item, refresh, isVerified }) {
  const [showEdit, setShowEdit] = useState(false);

  const handleDelete = async () => {
    if (!isVerified) return;

    if (window.confirm(`Permanently delete ${item.medicine?.name} from local node?`)) {
      try {
        await API.delete(`/inventory/delete/${item._id}`);
        toast.success("Entry Purged! 🗑️", {
          style: { background: '#0f172a', color: '#fff', border: '1px solid #ef4444' }
        });
        refresh();
      } catch (error) {
        toast.error("Deletion Protocol Failed");
      }
    }
  };

  return (
    <>
      <tr className="border-b border-slate-800/50 hover:bg-slate-900/40 transition-all group">
        {/* Medicine Identity */}
        <td className="px-6 py-5">
          <div className="flex flex-col">
            <span className="font-black text-slate-100 uppercase italic tracking-tighter text-base group-hover:text-blue-400 transition-colors">
              {item.medicine?.name || "Unknown Asset"}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              {item.medicine?.salt || "No Salt Data"}
            </span>
          </div>
        </td>

        {/* Pricing Node */}
        <td className="px-6 py-5">
          <div className="flex items-center gap-1">
            <span className="text-xs font-black text-emerald-500/50">₹</span>
            <span className="font-black text-emerald-400 text-lg tracking-tighter">
              {item.price}
            </span>
          </div>
        </td>

        {/* Stock Level with Conditional Glowing Pulse */}
        <td className="px-6 py-5">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
            item.stock < 10 
              ? 'bg-red-500/10 border-red-500/20 text-red-500' 
              : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${
              item.stock < 10 ? 'bg-red-500 animate-pulse' : 'bg-blue-500'
            }`} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {item.stock < 10 ? 'Low Stock:' : 'Available:'} {item.stock} Units
            </span>
          </div>
        </td>

        {/* Action Protocols */}
        <td className="px-6 py-5 text-right">
          <div className="flex items-center justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
            {isVerified ? (
              <>
                <button
                  onClick={() => setShowEdit(true)}
                  className="p-2.5 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-xl transition-all shadow-lg"
                  title="Modify Entry"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2.5 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-xl transition-all shadow-lg"
                  title="Delete Entry"
                >
                  <Trash2 size={16} />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 text-slate-600 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800">
                <ShieldOff size={14} />
                <span className="text-[8px] font-black uppercase tracking-tighter">Read Only</span>
              </div>
            )}
          </div>
        </td>
      </tr>

      {/* Edit Modal Logic */}
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