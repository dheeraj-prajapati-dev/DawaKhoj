import { useState } from 'react';
import { updateInventory } from '../../services/inventory.service';

export default function EditInventoryModal({ item, onClose, refresh }) {
  const [price, setPrice] = useState(item.price);
  const [stock, setStock] = useState(item.stock);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateInventory(item._id, {
        price,
        stock
      });

      refresh();     // table reload
      onClose();     // modal close
    } catch (err) {
      alert('Update failed');
      console.error(err);
    }
  };

  return (
    <div style={{ background: '#fff', padding: 20, border: '1px solid #000' }}>
      <h3>Edit Inventory</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
        />

        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Stock"
        />

        <br /><br />
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
}
