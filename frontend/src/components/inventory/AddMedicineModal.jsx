import { useState } from 'react';
import { API } from '../../context/AuthContext'; // 🔥 API instance use karein
import { toast } from 'react-hot-toast';

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
      // 🔥 Backend path '/inventory/add' hai
      await API.post('/inventory/add', {
        medicineName: form.medicineName.trim(),
        salt: form.salt.trim(),
        category: form.category.trim(),
        price: Number(form.price),
        stock: Number(form.stock)
      });

      toast.success('Medicine added successfully!');
      refresh(); // Inventory reload
      onClose(); // Modal close
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to add medicine');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 w-[350px] rounded-lg shadow-xl">
        <h3 className="text-xl font-bold mb-4">Add Medicine</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input className="border p-2 rounded" name="medicineName" placeholder="Medicine name" onChange={handleChange} required />
          <input className="border p-2 rounded" name="salt" placeholder="Salt (e.g. Paracetamol)" onChange={handleChange} />
          <input className="border p-2 rounded" name="category" placeholder="Category" onChange={handleChange} />
          <input className="border p-2 rounded" name="price" type="number" placeholder="Price (₹)" onChange={handleChange} required />
          <input className="border p-2 rounded" name="stock" type="number" placeholder="Stock quantity" onChange={handleChange} required />

          <div className="flex gap-2 mt-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded flex-1">Save</button>
            <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}