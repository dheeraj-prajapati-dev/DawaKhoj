import { useState } from 'react';
import EditInventoryModal from './EditInventoryModal';
import { deleteInventory } from '../../services/inventory.service';

export default function InventoryRow({ item, refresh, isVerified }) {
  const [showEdit, setShowEdit] = useState(false);

  const handleDelete = async () => {
    if (!isVerified) return;

    if (window.confirm('Delete this medicine?')) {
      await deleteInventory(item._id);
      refresh();
    }
  };

  return (
    <>
      <tr>
        <td>{item.medicine.name}</td>
        <td>{item.medicine.salt}</td>
        <td>₹{item.price}</td>
        <td>{item.stock}</td>
        <td>
          <button
            disabled={!isVerified}
            onClick={() => setShowEdit(true)}
          >
            Edit
          </button>

          <button
            disabled={!isVerified}
            onClick={handleDelete}
          >
            Delete
          </button>
        </td>
      </tr>

      {showEdit && isVerified && (
        <EditInventoryModal
          item={item}
          onClose={() => setShowEdit(false)}
          refresh={refresh}
        />
      )}
    </>
  );
}
