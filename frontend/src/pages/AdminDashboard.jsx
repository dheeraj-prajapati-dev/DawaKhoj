import { useEffect, useState } from 'react';
import { getAllPharmacies, approvePharmacy, deletePharmacy } from '../services/admin.service';
import { toast, Toaster } from 'react-hot-toast';
import { 
  Users, Store, Package, IndianRupee, 
  ShieldCheck, Clock, Search, Trash2, CheckCircle 
} from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState({ stats: {}, pharmacies: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); 

  const fetchData = async () => {
    try {
      const res = await getAllPharmacies();
      setData({
        stats: res.data.stats || {},
        pharmacies: res.data.pharmacies || []
      });
    } catch (err) {
      toast.error("Security Check: Admin access denied");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!confirm('Approve this Pharmacy?')) return;
    try {
      await approvePharmacy(id);
      toast.success("Pharmacy Verified! 🎉");
      fetchData();
    } catch (err) {
      toast.error("Approval failed");
    }
  };

  const handleReject = async (id) => {
    if (!confirm('🚨 REJECT this registration?')) return;
    try {
      await deletePharmacy(id);
      toast.success("Record Deleted");
      fetchData();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredPharmacies = data.pharmacies.filter(p => {
    const matchesSearch = p.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.owner?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' ? true : filter === 'verified' ? p.isVerified : !p.isVerified;
    return matchesSearch && matchesFilter;
  });

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 gap-4">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <div className="absolute top-0 left-0 animate-pulse rounded-full h-16 w-16 bg-blue-500/10"></div>
      </div>
      <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em]">Authenticating Admin...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-10 font-sans text-white relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full -z-10"></div>

      <div className="max-w-7xl mx-auto">
        {/* --- Header --- */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <ShieldCheck className="w-3 h-3" /> Command Center
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic">ADMIN <span className="text-blue-500 text-glow">PANEL</span></h1>
            <p className="text-slate-500 font-medium mt-2 uppercase text-[10px] tracking-widest">Network Administration & Quality Control</p>
          </div>
          
          <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-md">
             {['all', 'pending', 'verified'].map((type) => (
               <button 
                key={type}
                onClick={() => setFilter(type)} 
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                  filter === type ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'text-slate-500 hover:text-slate-300'
                }`}
               >
                 {type} {type === 'pending' && data.stats?.pendingVerifications > 0 && 
                  <span className="ml-2 bg-red-500 text-white px-1.5 py-0.5 rounded-md text-[8px] animate-bounce">
                    {data.stats.pendingVerifications}
                  </span>}
               </button>
             ))}
          </div>
        </header>

        {/* --- Stats --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard title="Patients" value={data.stats?.totalUsers} icon={<Users />} color="blue" />
          <StatCard title="Stores" value={data.stats?.totalPharmacies} icon={<Store />} color="indigo" />
          <StatCard title="Orders" value={data.stats?.totalOrders} icon={<Package />} color="purple" />
          <StatCard title="Revenue" value={`₹${data.stats?.totalRevenue}`} icon={<IndianRupee />} color="emerald" />
        </div>

        {/* --- Search & Table --- */}
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-slate-800/60 shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-slate-800 flex flex-col md:flex-row justify-between md:items-center gap-6">
            <h2 className="text-xl font-black italic tracking-tight uppercase">Pharmacy Queue</h2>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search store or email..." 
                className="bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-6 py-3 text-sm w-full md:w-[350px] focus:border-blue-500/50 outline-none transition-all font-medium"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-950/50 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
                <tr>
                  <th className="p-6">Pharmacy Details</th>
                  <th className="p-6">Status</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredPharmacies.map((p) => (
                  <tr key={p._id} className="hover:bg-blue-500/[0.02] transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-sm font-black text-slate-400 group-hover:text-blue-500 transition-colors">
                          {p.storeName?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-200 uppercase tracking-tight text-sm">{p.storeName}</p>
                          <p className="text-slate-500 text-[10px] font-bold tracking-wider">{p.owner?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-xs">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-black uppercase tracking-widest text-[9px] ${
                        p.isVerified ? 'text-emerald-500 bg-emerald-500/10' : 'text-amber-500 bg-amber-500/10'
                      }`}>
                        <div className={`w-1 h-1 rounded-full ${p.isVerified ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                        {p.isVerified ? 'Verified' : 'Pending'}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-end gap-2">
                        {!p.isVerified ? (
                          <button
                            onClick={() => handleApprove(p._id)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            Approve
                          </button>
                        ) : (
                          <div className="flex items-center gap-1 text-slate-600 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-800">
                            <CheckCircle className="w-3 h-3 text-emerald-500" /> Active
                          </div>
                        )}
                        <button 
                          onClick={() => handleReject(p._id)}
                          className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredPharmacies.length === 0 && (
              <div className="py-24 flex flex-col items-center justify-center text-slate-700">
                <Clock className="w-10 h-10 mb-2 opacity-20" />
                <p className="font-black uppercase tracking-[0.2em] text-[10px]">No Records Found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: "text-blue-400 bg-blue-400/10 border-blue-400/20 shadow-blue-400/5",
    indigo: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20 shadow-indigo-400/5",
    purple: "text-purple-400 bg-purple-400/10 border-purple-400/20 shadow-purple-400/5",
    emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20 shadow-emerald-400/5",
  };

  return (
    <div className="bg-slate-900/60 p-6 rounded-[2rem] border border-slate-800 transition-all duration-500 hover:-translate-y-1 hover:border-slate-700 group overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${colors[color]}`}>
          {icon}
        </div>
      </div>
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</p>
      <h3 className="text-2xl font-black italic tracking-tighter text-slate-100">{value || 0}</h3>
    </div>
  );
}