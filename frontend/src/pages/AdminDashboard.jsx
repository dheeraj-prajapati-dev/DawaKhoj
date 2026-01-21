import { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/admin';

export default function AdminDashboard() {
  const [pharmacies, setPharmacies] = useState([]);

  const token = localStorage.getItem('token');

  const fetchPharmacies = async () => {
    try {
      const res = await axios.get(`${API}/pharmacies`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPharmacies(res.data.pharmacies);
    } catch (err) {
      console.error('Fetch pharmacies error:', err);
    }
  };

  const approvePharmacy = async (id) => {
    try {
      await axios.put(
        `${API}/pharmacy/approve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchPharmacies();
    } catch (err) {
      console.error('Approve error:', err);
    }
  };

  useEffect(() => {
    fetchPharmacies();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Store</th>
            <th>Owner</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {pharmacies.map((p) => (
            <tr key={p._id}>
              <td>{p.storeName}</td>
              <td>{p.owner?.email}</td>
              <td>{p.isVerified ? '✅ Verified' : '❌ Pending'}</td>
              <td>
                {!p.isVerified && (
                  <button onClick={() => approvePharmacy(p._id)}>
                    Approve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
