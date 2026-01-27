{/* <div className="bg-red-500 text-white p-6 text-2xl">
  TAILWIND WORKING
</div> */}


import { useEffect, useState } from 'react';
import { getAllPharmacies, approvePharmacy } from '../services/admin.service';

export default function AdminDashboard() {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPharmacies = async () => {
    try {
      const res = await getAllPharmacies();
      setPharmacies(res.data.pharmacies);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!confirm('Approve this pharmacy?')) return;
    await approvePharmacy(id);
    fetchPharmacies();
  };

  useEffect(() => {
    fetchPharmacies();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold">Store</th>
              <th className="p-4 font-semibold">Owner</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {pharmacies.map((p) => (
              <tr
                key={p._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-4">{p.storeName}</td>
                <td className="p-4 text-gray-600">{p.owner?.email}</td>

                <td className="p-4">
                  {p.isVerified ? (
                    <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
                      Verified
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-700">
                      Pending
                    </span>
                  )}
                </td>

                <td className="p-4">
                  {!p.isVerified ? (
                    <button
                      onClick={() => handleApprove(p._id)}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
                    >
                      Approve
                    </button>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
