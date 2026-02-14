import { useState } from 'react';
import { API } from '../context/AuthContext';
import { 
  FileSpreadsheet, Upload, CheckCircle2, 
  AlertCircle, Loader2, Info, HelpCircle 
} from 'lucide-react';

export default function BulkUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage({ text: '', type: '' });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ text: "Bhai, pehle file toh select karo!", type: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const res = await API.post('/inventory/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.success) {
        setMessage({ 
          text: `🚀 Data Injected! ${res.data.message}`, 
          type: 'success' 
        });
        setFile(null);
        if (onUploadSuccess) onUploadSuccess();
      }
    } catch (err) {
      setMessage({ 
        text: "❌ Protocol Failed: " + (err.response?.data?.message || err.message), 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-[3rem] w-full max-w-xl shadow-2xl relative overflow-hidden group">
      {/* Subtle Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[80px] rounded-full group-hover:bg-blue-600/20 transition-colors"></div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase flex items-center gap-3">
            <FileSpreadsheet className="text-blue-500" /> Bulk <span className="text-blue-500">Upload</span>
          </h3>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Mass Inventory Synchronization</p>
        </div>
        <HelpCircle size={20} className="text-slate-700 hover:text-blue-500 cursor-help transition-colors" />
      </div>

      {/* 📊 Schema Guide Box */}
      <div className="mb-8 p-5 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-start gap-4">
        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
          <Info size={16} />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">CSV Column Mapping</p>
          <div className="flex flex-wrap gap-2">
            {['name', 'brand', 'salt', 'category', 'price', 'stock'].map((col) => (
              <span key={col} className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-md text-[9px] font-mono text-blue-400">
                {col}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 📁 File Drop Zone */}
      <div className={`relative mb-8 group/zone transition-all`}>
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className={`p-8 rounded-[2rem] border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 ${
          file 
          ? 'border-emerald-500/50 bg-emerald-500/5' 
          : 'border-slate-800 bg-slate-950/50 group-hover/zone:border-blue-500/50 group-hover/zone:bg-blue-500/5'
        }`}>
          <div className={`p-4 rounded-2xl ${file ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-900 text-slate-600 group-hover/zone:text-blue-500 group-hover/zone:scale-110 transition-all'}`}>
             <Upload size={24} />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-slate-300">
              {file ? file.name : "Choose CSV Data File"}
            </p>
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">
              {file ? `${(file.size / 1024).toFixed(2)} KB` : "Drag & Drop Protocol Active"}
            </p>
          </div>
        </div>
      </div>

      {/* ⚡ Action Button */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] transition-all flex items-center justify-center gap-3 shadow-xl ${
          loading 
            ? 'bg-slate-800 text-slate-500' 
            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20 active:scale-95'
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Uploading Node Data...
          </>
        ) : (
          <>
            Initiate Bulk Sync
            <CheckCircle2 size={18} />
          </>
        )}
      </button>

      {/* 📢 Status Messaging */}
      {message.text && (
        <div className={`mt-6 p-4 rounded-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
          message.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
            {message.text}
          </p>
        </div>
      )}
    </div>
  );
}