import InventoryRow from './InventoryRow';
import { Box, Layers, Database, Activity, ShieldAlert } from 'lucide-react';

export default function InventoryTable({ inventory, refresh, isVerified }) {
  if (!inventory || inventory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-slate-800/50 group hover:border-blue-500/30 transition-all">
        <div className="p-6 rounded-full bg-slate-900 border border-slate-800 mb-6 group-hover:scale-110 transition-transform">
          <Box className="w-12 h-12 text-slate-700 group-hover:text-blue-500" />
        </div>
        <p className="text-slate-400 font-black text-xl italic uppercase tracking-tighter">Inventory Node Empty</p>
        <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.4em] mt-2 italic">Awaiting first data entry...</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-800/60 bg-slate-900/20 backdrop-blur-md shadow-2xl">
      {/* 🌌 Table Header Glow */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/60 text-slate-500 uppercase font-black text-[10px] tracking-[0.2em] border-b border-slate-800">
              <th className="px-6 py-6 flex items-center gap-2">
                <Layers size={14} className="text-blue-500" /> Medicine Identity
              </th>
              <th className="px-6 py-6">
                 <div className="flex items-center gap-2">
                   <Database size={14} className="text-slate-600" /> Composition
                 </div>
              </th>
              <th className="px-6 py-6">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-emerald-500" /> Market Value
                </div>
              </th>
              <th className="px-6 py-6 text-center">
                 Level
              </th>
              <th className="px-6 py-6 text-right pr-10">
                Protocols
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/30">
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

      {/* Table Footer Info */}
      <div className="bg-slate-900/40 px-8 py-4 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
             Live Inventory Feed Active
           </span>
        </div>
        {!isVerified && (
          <div className="flex items-center gap-2 text-orange-500 bg-orange-500/5 px-4 py-1.5 rounded-full border border-orange-500/20">
             <ShieldAlert size={12} />
             <span className="text-[9px] font-black uppercase tracking-widest">Read-Only Mode: Verification Pending</span>
          </div>
        )}
        <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
          Total Entries: {inventory.length}
        </div>
      </div>
    </div>
  );
}