import { useEffect, useState } from 'react';
import { getAllPharmacies, approvePharmacy, deletePharmacy } from '../services/admin.service';
import { toast, Toaster } from 'react-hot-toast';

export default function AdminDashboard() {
  const [data, setData] = useState({ stats: {}, pharmacies: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); 

  const fetchData = async () => {
    try {
      const res = await getAllPharmacies();
      // Backend agar 'success' true bhej raha hai toh data set karein
      setData({
        stats: res.data.stats || {},
        pharmacies: res.data.pharmacies || []
      });
    } catch (err) {
      console.error(err);
      toast.error("Security Check: Admin access denied or data load failed");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!confirm('Kya aap is Pharmacy ko approve karna chahte hain?')) return;
    try {
      await approvePharmacy(id);
      toast.success("Pharmacy Approved! 🎉");
      fetchData(); // List refresh karein
    } catch (err) {
      toast.error(err.response?.data?.message || "Approval fail ho gaya");
    }
  };

  const handleReject = async (id) => {
    if (!confirm('🚨 CRITICAL: Kya aap is registration ko REJECT (Delete) karna chahte hain?')) return;
    try {
      await deletePharmacy(id);
      toast.success("Pharmacy Record Deleted");
      fetchData(); // List refresh karein
    } catch (err) {
      toast.error(err.response?.data?.message || "Rejection fail ho gaya");
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-600"></div>
      <p className="text-slate-500 font-bold animate-pulse">Authenticating Admin Access...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto">
        {/* --- Header Section --- */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-block px-4 py-1.5 mb-4 rounded-xl bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest">
              Executive Panel
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Command Center 👑</h1>
            <p className="text-slate-500 font-medium mt-2">DawaKhoj Network Administration & Quality Control</p>
          </div>
          
          <div className="flex bg-white p-1.5 rounded-[1.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 items-center">
             {['all', 'pending', 'verified'].map((type) => (
               <button 
                key={type}
                onClick={() => setFilter(type)} 
                className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                  filter === type ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                }`}
               >
                 {type} {type === 'pending' && data.stats?.pendingVerifications > 0 && 
                  <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px] animate-pulse">
                    {data.stats.pendingVerifications}
                  </span>}
               </button>
             ))}
          </div>
        </header>

        {/* --- Stats Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Patients" value={data.stats?.totalUsers || 0} icon="👥" color="bg-blue-600" />
          <StatCard title="Total Stores" value={data.stats?.totalPharmacies || 0} icon="🏥" color="bg-indigo-600" />
          <StatCard title="Total Orders" value={data.stats?.totalOrders || 0} icon="📦" color="bg-purple-600" />
          <StatCard title="Revenue" value={`₹${data.stats?.totalRevenue || 0}`} icon="💰" color="bg-emerald-600" />
        </div>

        {/* --- Table Section --- */}
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden transition-all">
          <div className="p-8 border-b border-slate-100 flex flex-col lg:flex-row justify-between lg:items-center gap-6">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Pharmacy Queue</h2>
              <p className="text-slate-400 text-sm font-medium">Verify or remove stores from your network</p>
            </div>
            <div className="relative group">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              <input 
                type="text" 
                placeholder="Search store or email..." 
                className="bg-slate-50 border-2 border-transparent rounded-[2rem] pl-12 pr-6 py-4 text-sm w-full lg:w-[400px] focus:bg-white focus:border-blue-100 focus:outline-none transition-all font-medium shadow-inner"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/70 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
                <tr>
                  <th className="p-8">Pharmacy / Owner</th>
                  <th className="p-8">Account Status</th>
                  <th className="p-8 text-right pr-12">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPharmacies.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/50 transition-all duration-300 group">
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-xl shadow-inner font-bold text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                          {p.storeName?.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-800 text-lg tracking-tight">{p.storeName}</span>
                          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{p.owner?.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <span className={`inline-flex items-center px-5 py-2 rounded-2xl text-[10px] font-black tracking-widest uppercase ${
                        p.isVerified ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-2.5 ${p.isVerified ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                        {p.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-8">
                      <div className="flex items-center justify-end gap-3">
                        {!p.isVerified ? (
                          <button
                            onClick={() => handleApprove(p._id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-200 transition-all hover:-translate-y-1"
                          >
                            Approve
                          </button>
                        ) : (
                          <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest border-2 border-slate-50 px-6 py-2.5 rounded-2xl cursor-not-allowed">Active</span>
                        )}
                        <button 
                          onClick={() => handleReject(p._id)}
                          className="bg-white hover:bg-red-50 text-red-500 border border-slate-100 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:border-red-100"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredPharmacies.length === 0 && (
              <div className="py-32 flex flex-col items-center justify-center text-slate-300">
                <span className="text-6xl mb-4 opacity-20">📂</span>
                <p className="font-black uppercase tracking-widest text-xs">No entries found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group cursor-default">
      <div className={`${color} text-white w-16 h-16 flex items-center justify-center rounded-[1.5rem] text-3xl shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
      </div>
    </div>
  );
}