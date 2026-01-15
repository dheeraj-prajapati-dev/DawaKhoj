import { useState } from 'react';
import { addInventory } from '../../services/inventory.service';

export default function AddMedicineModal({ onClose, refresh }) {
  const [form, setForm] = useState({
    medicineName: '',
    salt: '',
    category: '',
    price: '',
    stock: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await addInventory({
      medicineName: form.medicineName.trim(),
      salt: form.salt.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      stock: Number(form.stock)
    });

    refresh();      // inventory reload
    onClose();      // modal close
  } catch (error) {
    console.error(error);
    alert('Failed to add medicine');
  }
};




  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>Add Medicine</h3>

        <form onSubmit={handleSubmit}>
          <input name="medicineName" placeholder="Medicine name" onChange={handleChange} required />
          <input name="salt" placeholder="Salt" onChange={handleChange} />
          <input name="category" placeholder="Category" onChange={handleChange} />
          <input name="price" type="number" placeholder="Price" onChange={handleChange} required />
          <input name="stock" type="number" placeholder="Stock" onChange={handleChange} required />

          <div style={{ marginTop: 10 }}>
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const modal = {
  background: '#fff',
  padding: 20,
  width: 300,
  borderRadius: 6
};
