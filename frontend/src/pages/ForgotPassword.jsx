import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { Mail, Loader2, ChevronLeft, Send, ShieldAlert } from 'lucide-react';
import { API } from '../context/AuthContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/forgot-password', { email });
      if (res.data.success) {
        toast.success('Recovery link sent to your email!', {
          style: { background: '#0f172a', color: '#fff', borderRadius: '20px', border: '1px solid #3b82f6' }
        });
        setIsSent(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send recovery mail.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 font-sans text-white relative overflow-hidden">
      <Toaster position="top-center" />
      
      {/* Glow effects matches your Login screen */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full"></div>

      <div className="bg-slate-900/40 backdrop-blur-2xl p-8 md:p-12 rounded-[3.5rem] shadow-2xl w-full max-w-md border border-slate-800/60 relative group">
        
        <Link to="/login" className="absolute top-8 left-8 text-slate-500 hover:text-white transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
          <ChevronLeft size={14} /> Back
        </Link>

        <div className="text-center mt-8 mb-10">
          <div className="w-20 h-20 bg-slate-950 rounded-[2rem] border-2 border-slate-800 flex items-center justify-center mx-auto mb-6 shadow-2xl">
             <ShieldAlert className="w-10 h-10 text-blue-500 animate-pulse" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter italic uppercase">
            Account<span className="text-blue-500 text-glow"> Recovery</span>
          </h1>
          <p className="text-slate-500 mt-2 font-black uppercase text-[9px] tracking-[0.4em] opacity-80 leading-relaxed">
            {isSent ? "Check your inbox for instructions" : "Enter your ID to receive reset link"}
          </p>
        </div>

        {!isSent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Authorized Email</label>
              <div className="relative group/input">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within/input:text-blue-500 transition-colors" />
                <input
                  type="email"
                  className="w-full pl-14 pr-6 py-5 bg-slate-950 border border-slate-800 rounded-[1.8rem] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all text-sm font-bold placeholder:text-slate-800"
                  placeholder="name@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-[1.8rem] shadow-[0_20px_40px_rgba(37,99,235,0.2)] transition-all active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[11px]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send Recovery Link <Send size={14} /></>}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
              <p className="text-xs font-bold text-slate-400">Mail sent to: <span className="text-blue-400">{email}</span></p>
            </div>
            <button 
              onClick={() => setIsSent(false)}
              className="text-[10px] font-black text-blue-500 hover:underline uppercase tracking-widest"
            >
              Didn't get it? Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}