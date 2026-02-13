import { useState } from 'react';
import { API } from '../context/AuthContext';

export default function BulkUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!file) return alert("Bhai, pehle file toh select karo!");

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const res = await API.post('/inventory/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.success) {
        setMessage(`🚀 Gazab! ${res.data.message}`);
        setFile(null);
        if (onUploadSuccess) onUploadSuccess();
      }
    } catch (err) {
      setMessage("❌ Kuch gadbad ho gayi: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl w-full max-w-xl">
      <h3 className="text-xl font-bold mb-4 text-blue-400">Bulk Inventory Upload 📦</h3>
      
      <div className="mb-6 p-4 bg-slate-950 rounded-2xl border border-dashed border-slate-700">
        <p className="text-xs text-gray-500 mb-2">CSV Format: name, brand, salt, category, price, stock</p>
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange}
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        className={`w-full py-3 rounded-xl font-bold transition-all ${
          loading ? 'bg-slate-700 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
        }`}
      >
        {loading ? "Processing..." : "Upload & Sync Inventory"}
      </button>

      {message && (
        <p className={`mt-4 text-sm font-medium ${message.includes('🚀') ? 'text-emerald-400' : 'text-red-400'}`}>
          {message}
        </p>
      )}
    </div>
  );
}