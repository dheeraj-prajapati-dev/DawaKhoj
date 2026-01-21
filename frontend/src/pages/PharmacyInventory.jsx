import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useInventory } from '../hooks/useInventory';
import { getMyPharmacyProfile } from '../services/pharmacy.service';

import InventoryTable from '../components/inventory/InventoryTable';
import AddMedicineModal from '../components/inventory/AddMedicineModal';

export default function PharmacyInventory() {
  const navigate = useNavigate();

  const { inventory, loading, fetchInventory } = useInventory();
  const [showModal, setShowModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // ✅ SINGLE SOURCE OF TRUTH
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getMyPharmacyProfile();

        // pharmacy exists
        setIsVerified(res.data.isVerified);
      } catch (err) {
        // ❗ pharmacy NOT registered
        navigate('/pharmacy/register');
      }
    };

    loadProfile();
  }, [navigate]);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>

      {!isVerified && (
        <div
          style={{
            background: '#fff3cd',
            border: '1px solid #ffeeba',
            padding: 12,
            marginBottom: 12,
            borderRadius: 6
          }}
        >
          ⚠️ Pharmacy not verified. Inventory is read-only.
        </div>
      )}

      <h2>My Inventory</h2>

      <button
        disabled={!isVerified}
        onClick={() => setShowModal(true)}
      >
        ➕ Add Medicine
      </button>

      <button
        style={{ marginLeft: 10 }}
        onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }}
      >
        Logout
      </button>

      <InventoryTable
        inventory={inventory}
        refresh={fetchInventory}
        isVerified={isVerified}
      />

      {showModal && isVerified && (
        <AddMedicineModal
          onClose={() => setShowModal(false)}
          refresh={fetchInventory}
        />
      )}
    </div>
  );
}
