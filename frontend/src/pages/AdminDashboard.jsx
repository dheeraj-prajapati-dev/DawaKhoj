import { useEffect, useState } from 'react';
import { getAllPharmacies, approvePharmacy } from '../services/admin.service';
import { toast, Toaster } from 'react-hot-toast';

export default function AdminDashboard() {
  const [data, setData] = useState({ stats: {}, pharmacies: [] });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await getAllPharmacies(); // Service mein getAdminDashboardData wala API call hoga
      setData({
        stats: res.data.stats,
        pharmacies: res.data.pharmacies
      });
    } catch (err) {
      toast.error("Data load nahi ho paya");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!confirm('Kya aap is Pharmacy ko approve karna chahte hain?')) return;
    try {
      await approvePharmacy(id);
      toast.success("Pharmacy Approved! 🎉");
      fetchData();
    } catch (err) {
      toast.error("Approval fail ho gaya");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="p-20 text-center font-bold text-blue-600">Admin Control Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-slate-800 mb-8">Admin Dashboard 👑</h1>

        {/* 📊 Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total Patients" value={data?.stats?.totalUsers || 0} icon="👥" color="bg-blue-500" />
          <StatCard title="Active Pharmacies" value={data?.stats?.totalPharmacies || 0} icon="🏥" color="bg-green-500" />
          <StatCard title="Total Revenue" value={`₹${data.stats.totalRevenue}`} icon="💰" color="bg-orange-500" />
        </div>

        {/* 🏥 Pharmacy Management Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-white">
            <h2 className="text-xl font-bold text-slate-800">Pharmacy Verification Queue</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 font-bold">Store Name</th>
                  <th className="p-4 font-bold">Owner Email</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.pharmacies.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-semibold text-slate-700">{p.storeName}</td>
                    <td className="p-4 text-slate-600">{p.owner?.email}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-black rounded-full ${
                        p.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {p.isVerified ? 'VERIFIED' : 'PENDING'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {!p.isVerified ? (
                        <button
                          onClick={() => handleApprove(p._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all transform active:scale-95"
                        >
                          Approve Now
                        </button>
                      ) : (
                        <span className="text-slate-300 font-medium italic">Already Verified</span>
                      )}
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

// Reusable Stat Card Component
function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
      <div className={`${color} text-white w-14 h-14 flex items-center justify-center rounded-2xl text-2xl shadow-lg`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-wide">{title}</p>
        <h3 className="text-2xl font-black text-slate-800">{value}</h3>
      </div>
    </div>
  );
}