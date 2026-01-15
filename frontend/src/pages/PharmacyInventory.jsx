import { useEffect, useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import { getMyPharmacyProfile } from '../services/pharmacy.service';

import InventoryTable from '../components/inventory/InventoryTable';
import AddMedicineModal from '../components/inventory/AddMedicineModal';

export default function PharmacyInventory() {
  const { inventory, loading, fetchInventory } = useInventory();
  const [showModal, setShowModal] = useState(false);
  const [isVerified, setIsVerified] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getMyPharmacyProfile();
        setIsVerified(res.data.isVerified);
      } catch (err) {
        console.error(err);
      }
    };

    loadProfile();
  }, []);

  if (loading) return <p>Loading inventory...</p>;

  return (
    <div style={{ padding: 20 }}>

      {/* 🚨 NOT VERIFIED BANNER */}
      {!isVerified && (
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffeeba',
          padding: '12px',
          marginBottom: '16px',
          borderRadius: '6px',
          color: '#856404'
        }}>
          ⚠️ Your pharmacy is not verified yet.  
          You can view inventory but cannot modify it.
        </div>
      )}

      <h2>My Inventory</h2>

      <button
        onClick={() => setShowModal(true)}
        disabled={!isVerified}
      >
        ➕ Add Medicine
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
