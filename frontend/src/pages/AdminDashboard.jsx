import { useEffect, useState, useMemo } from 'react';
import { getAllPharmacies, approvePharmacy, deletePharmacy } from '../services/admin.service';
import { toast, Toaster } from 'react-hot-toast';
import { 
  Users, Store, Package, IndianRupee, 
  ShieldCheck, Search, Trash2, TrendingUp, Activity 
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
      toast.error("Security Alert: System access denied or connection timeout.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchData(); 
    const interval = setInterval(fetchData, 10000); 
    return () => clearInterval(interval);
  }, []);

  const formattedChartData = useMemo(() => {
    const chartArr = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
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
    if (!window.confirm('Are you sure you want to authorize this pharmacy?')) return;
    try {
      await approvePharmacy(id);
      toast.success("Identity Verified: Pharmacy authorized successfully.");
      fetchData();
    } catch (err) { toast.error("Authorization protocol failed."); }
  };

  const handleReject = async (id) => {
    if (!window.confirm('WARNING: Are you sure you want to purge this record?')) return;
    try {
      await deletePharmacy(id);
      toast.success("Security Note: Pharmacy record purged.");
      fetchData();
    } catch (err) { toast.error("Action interrupted by system."); }
  };

  const filteredPharmacies = data.pharmacies.filter(p => {
    const matchesSearch = p.storeName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' ? true : filter === 'verified' ? p.isVerified : !p.isVerified;
    return matchesSearch && matchesFilter;
  });

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 gap-6">
      <div className="relative">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500 border-opacity-50"></div>
        <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 w-8 h-8" />
      </div>
      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em]">Synchronizing Central Database...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-10 font-sans text-white relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Visual background element */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 blur-[150px] rounded-full -z-0"></div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-600/20">
                  <ShieldCheck className="w-5 h-5 text-white" />
               </div>
               <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500 italic">Central Intelligence Unit</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter uppercase leading-none">Command <span className="text-blue-600">Center</span></h1>
          </div>
          
          <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800/50 backdrop-blur-xl">
             {['all', 'pending', 'verified'].map((type) => (
               <button 
                key={type}
                onClick={() => setFilter(type)} 
                className={`px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                  filter === type ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                }`}
               >
                 {type}
               </button>
             ))}
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Patients" value={data.stats?.totalUsers} icon={<Users size={20} />} color="blue" trend="+12%" />
          <StatCard title="Verified Pharmacy" value={data.stats?.totalPharmacies} icon={<Store size={20} />} color="indigo" trend="+5%" />
          <StatCard title="Total Transactions" value={data.stats?.totalOrders} icon={<Package size={20} />} color="purple" trend="+18%" />
          <StatCard title="Gross Revenue" value={`₹${data.stats?.totalRevenue}`} icon={<IndianRupee size={20} />} color="emerald" trend="+22%" />
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800/60 shadow-2xl">
            <h3 className="text-lg font-bold uppercase tracking-tight flex items-center gap-3 mb-10">
              <TrendingUp className="text-blue-500 w-5 h-5" /> Transaction Velocity (Last 7 Days)
            </h3>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedChartData}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#475569" fontSize={10} fontWeight="bold" />
                  <YAxis stroke="#475569" fontSize={10} fontWeight="bold" allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    fill="url(#colorOrders)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800/60">
             <h3 className="text-lg font-bold uppercase mb-8">System Activity</h3>
             <div className="space-y-6">
                {data.pharmacies.slice(0, 6).map((p, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-slate-800/50 pb-4 last:border-0">
                    <div>
                      <p className="text-xs font-bold uppercase text-slate-200">{p.storeName}</p>
                      <p className="text-[9px] text-slate-500 font-bold tracking-wider">{p.isVerified ? 'VERIFIED_PARTNER' : 'VERIFICATION_REQUIRED'}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${p.isVerified ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500 animate-pulse'}`}></div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Pharmacy Registry Table */}
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-slate-800/60 overflow-hidden">
          <div className="p-8 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <h2 className="text-xl font-bold uppercase tracking-tight">Pharmacy Registry</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search global database..." 
                className="bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-6 py-4 text-xs w-full md:w-[400px] outline-none font-bold focus:border-blue-500 transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-x-auto px-6 pb-6">
            <table className="w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em]">
                  <th className="px-4 py-2 text-left font-bold">Organization Identity</th>
                  <th className="px-4 py-2 text-left font-bold">Network Status</th>
                  <th className="px-4 py-2 text-right font-bold">Administrative Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPharmacies.map((p) => (
                  <tr key={p._id} className="bg-slate-950/40 hover:bg-slate-900 transition-all">
                    <td className="p-4 rounded-l-2xl border-l border-y border-slate-800/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-500 font-black italic shadow-inner">
                          {p.storeName?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-100 uppercase text-xs">{p.storeName}</p>
                          <p className="text-slate-500 text-[9px] font-bold tracking-tighter">{p.owner?.email?.toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 border-y border-slate-800/50">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full font-bold text-[8px] tracking-widest ${
                        p.isVerified ? 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20' : 'text-amber-500 bg-amber-500/10 border border-amber-500/20'
                      }`}>
                        {p.isVerified ? 'OPERATIONAL' : 'PENDING_APPROVAL'}
                      </span>
                    </td>
                    <td className="p-4 text-right rounded-r-2xl border-r border-y border-slate-800/50">
                      <div className="flex items-center justify-end gap-3">
                        {!p.isVerified && (
                          <button 
                            onClick={() => handleApprove(p._id)} 
                            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-[9px] font-bold uppercase transition-all shadow-lg shadow-blue-600/20"
                          >
                            Authorize Access
                          </button>
                        )}
                        <button onClick={() => handleReject(p._id)} className="p-2.5 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
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
    <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-800/60 transition-all hover:border-blue-500/30 group">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-xl ${colors[color]}`}>
          {icon}
        </div>
        <div className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-md text-[9px] font-bold">{trend}</div>
      </div>
      <div>
        <p className="text-slate-500 text-[10px] font-bold uppercase mb-2 tracking-widest">{title}</p>
        <h3 className="text-3xl font-black text-white leading-none tracking-tight">
            {value === 0 ? '0' : value || '---'}
        </h3>
      </div>
    </div>
  );
}