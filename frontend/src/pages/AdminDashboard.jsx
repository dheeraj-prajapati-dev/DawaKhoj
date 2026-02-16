import { useEffect, useState, useMemo } from 'react';
import { getAllPharmacies, approvePharmacy, deletePharmacy } from '../services/admin.service';
import { toast, Toaster } from 'react-hot-toast';
import { 
  Users, Store, Package, IndianRupee, 
  ShieldCheck, Search, Trash2, TrendingUp 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

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
      toast.error("Access Denied or Connection Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchData(); 
    const interval = setInterval(fetchData, 10000); 
    return () => clearInterval(interval);
  }, []);

  // 📈 Logic: Backend strings (YYYY-MM-DD) ko current weekday se map karna
  const formattedChartData = useMemo(() => {
    const chartArr = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      
      // ✅ Manual format to match Backend string perfectly: YYYY-MM-DD
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const dayEntry = data.stats?.chartData?.find(item => item._id === dateStr);
      
      chartArr.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }), 
        orders: dayEntry ? dayEntry.orders : 0
      });
    }
    return chartArr;
  }, [data.stats?.chartData]);

  const handleApprove = async (id) => {
    if (!confirm('Approve this Pharmacy?')) return;
    try {
      await approvePharmacy(id);
      toast.success("Pharmacy Verified! 🎉");
      fetchData();
    } catch (err) { toast.error("Approval failed"); }
  };

  const handleReject = async (id) => {
    if (!confirm('🚨 REJECT this registration?')) return;
    try {
      await deletePharmacy(id);
      toast.success("Record Deleted");
      fetchData();
    } catch (err) { toast.error("Action failed"); }
  };

  const filteredPharmacies = data.pharmacies.filter(p => {
    const matchesSearch = p.storeName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' ? true : filter === 'verified' ? p.isVerified : !p.isVerified;
    return matchesSearch && matchesFilter;
  });

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 gap-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Syncing Neural Data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-10 font-sans text-white relative overflow-hidden">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <div className="bg-blue-600 p-2 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-white" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Live Analytics Engine</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter italic uppercase leading-none">Command Center</h1>
          </div>
          
          <div className="flex bg-slate-900/50 p-1.5 rounded-[1.5rem] border border-slate-800/50 backdrop-blur-xl">
             {['all', 'pending', 'verified'].map((type) => (
               <button 
                key={type}
                onClick={() => setFilter(type)} 
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === type ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-500 hover:text-slate-300'
                }`}
               >
                 {type}
               </button>
             ))}
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Patients" value={data.stats?.totalUsers} icon={<Users />} color="blue" trend="+12%" />
          <StatCard title="Verified Stores" value={data.stats?.totalPharmacies} icon={<Store />} color="indigo" trend="+5%" />
          <StatCard title="Successful Orders" value={data.stats?.totalOrders} icon={<Package />} color="purple" trend="+18%" />
          <StatCard title="Net Revenue" value={`₹${data.stats?.totalRevenue}`} icon={<IndianRupee />} color="emerald" trend="+22%" />
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl p-8 rounded-[3rem] border border-slate-800/60 shadow-2xl">
            <h3 className="text-xl font-black italic uppercase tracking-tight flex items-center gap-3 mb-10">
              <TrendingUp className="text-blue-500" /> Order Velocity (Last 7 Days)
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedChartData}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontWeight="bold" />
                  <YAxis stroke="#64748b" fontSize={10} fontWeight="bold" allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#3b82f6" 
                    strokeWidth={4} 
                    fill="url(#colorOrders)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick List */}
          <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[3rem] border border-slate-800/60 shadow-2xl">
             <h3 className="text-xl font-black italic uppercase mb-8">System Feed</h3>
             <div className="space-y-6">
                {data.pharmacies.slice(0, 6).map((p, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-slate-800/50 pb-4 last:border-0">
                    <div>
                      <p className="text-sm font-black uppercase text-slate-200">{p.storeName}</p>
                      <p className="text-[9px] text-slate-500 font-bold">{p.isVerified ? 'ACTIVE' : 'AWAITING'}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${p.isVerified ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500'}`}></div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Registry Table */}
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-[3rem] border border-slate-800/60 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <h2 className="text-2xl font-black italic uppercase">Pharmacy Registry</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search database..." 
                className="bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm w-full md:w-[350px] outline-none font-bold focus:border-blue-500 transition-colors"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-x-auto px-4 pb-4">
            <table className="w-full border-separate border-spacing-y-4">
              <thead className="text-slate-500 text-[10px] uppercase font-black tracking-widest">
                <tr>
                  <th className="p-4 text-left">Store Identity</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-right">Operations</th>
                </tr>
              </thead>
              <tbody>
                {filteredPharmacies.map((p) => (
                  <tr key={p._id} className="bg-slate-950/40 hover:bg-slate-900 transition-all rounded-2xl">
                    <td className="p-4 rounded-l-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-black italic">
                          {p.storeName?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-200 uppercase text-xs">{p.storeName}</p>
                          <p className="text-slate-600 text-[9px] font-bold uppercase">{p.owner?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full font-black text-[8px] ${
                        p.isVerified ? 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20' : 'text-amber-500 bg-amber-500/10 border border-amber-500/20'
                      }`}>
                        {p.isVerified ? 'VERIFIED' : 'PENDING'}
                      </span>
                    </td>
                    <td className="p-4 text-right rounded-r-2xl">
                      <div className="flex items-center justify-end gap-3">
                        {!p.isVerified && (
                          <button onClick={() => handleApprove(p._id)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all">Authorize</button>
                        )}
                        <button onClick={() => handleReject(p._id)} className="p-2 text-slate-600 hover:text-red-500 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, trend }) {
  const colors = {
    blue: "text-blue-400 bg-blue-400/10 border-blue-400/20 shadow-blue-400/5",
    indigo: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20 shadow-indigo-400/5",
    purple: "text-purple-400 bg-purple-400/10 border-purple-400/20 shadow-purple-400/5",
    emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20 shadow-emerald-400/5",
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800/60 transition-all hover:-translate-y-2 group">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-[1.25rem] ${colors[color]}`}>
          {icon}
        </div>
        <div className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-lg text-[9px] font-black">{trend}</div>
      </div>
      <div>
        <p className="text-slate-500 text-[10px] font-black uppercase mb-2 italic">{title}</p>
        <h3 className="text-4xl font-black italic text-white leading-none">
            {value === 0 ? '0' : value || '---'}
        </h3>
      </div>
    </div>
  );
}