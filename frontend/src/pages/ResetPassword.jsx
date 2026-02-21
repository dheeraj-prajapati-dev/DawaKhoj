import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { Lock, Eye, EyeOff, Loader2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { API } from '../context/AuthContext';

export default function ResetPassword() {
  const { token } = useParams(); // URL se token nikalne ke liye
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords match nahi kar rahe!');
    }
    if (formData.password.length < 6) {
      return toast.error('Password kam se kam 6 characters ka hona chahiye.');
    }

    setLoading(true);
    try {
      const res = await API.put(`/auth/reset-password/${token}`, { password: formData.password });
      if (res.data.success) {
        toast.success('Security Key Updated! Redirecting to login...', {
          style: { background: '#0f172a', color: '#fff', borderRadius: '20px', border: '1px solid #10b981' }
        });
        setTimeout(() => navigate('/login'), 2500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Link expire ho gaya hai.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 font-sans text-white relative overflow-hidden">
      <Toaster position="top-center" />
      
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"></div>

      <div className="bg-slate-900/40 backdrop-blur-2xl p-8 md:p-12 rounded-[3.5rem] shadow-2xl w-full max-w-md border border-slate-800/60 relative">
        
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-slate-950 rounded-[2rem] border-2 border-slate-800 flex items-center justify-center mx-auto mb-6">
             <ShieldCheck className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter italic uppercase">
            New<span className="text-emerald-500"> Security Key</span>
          </h1>
          <p className="text-slate-500 mt-2 font-black uppercase text-[9px] tracking-[0.4em] opacity-80">Update your access credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">New Password</label>
            <div className="relative group/input">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within/input:text-emerald-500 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-14 pr-14 py-5 bg-slate-950 border border-slate-800 rounded-[1.8rem] focus:border-emerald-500/50 outline-none transition-all text-sm font-bold"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-700 hover:text-emerald-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Confirm New Password</label>
            <div className="relative group/input">
              <CheckCircle2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within/input:text-emerald-500 transition-colors" />
              <input
                type="password"
                className="w-full pl-14 pr-6 py-5 bg-slate-950 border border-slate-800 rounded-[1.8rem] focus:border-emerald-500/50 outline-none transition-all text-sm font-bold"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-[1.8rem] shadow-[0_20px_40px_rgba(16,185,129,0.2)] transition-all active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[11px] mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update & Verify'}
          </button>
        </form>
      </div>
    </div>
  );
}