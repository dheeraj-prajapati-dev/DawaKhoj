import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom'; 
import { toast, Toaster } from 'react-hot-toast';
import { useAuth, API } from '../context/AuthContext';
import { Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      const destination = location.state?.from?.pathname || 
                          (user.role === 'admin' ? '/admin/dashboard' : 
                           user.role === 'pharmacy' ? '/pharmacy/dashboard' : '/');
      navigate(destination, { replace: true });
    }
  }, [user, authLoading, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        login(res.data.user);
        toast.success(`Welcome back, ${res.data.user.name}!`, {
          icon: '🔓',
          style: { background: '#0f172a', color: '#fff', borderRadius: '20px', border: '1px solid #1e293b' }
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification Failed!');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 font-sans text-white relative overflow-hidden">
      <Toaster position="top-center" />
      
      {/* 🌌 Animated Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/5 blur-[150px] rounded-full"></div>

      <div className="bg-slate-900/40 backdrop-blur-2xl p-8 md:p-12 rounded-[3.5rem] shadow-2xl w-full max-w-md border border-slate-800/60 relative group">
        
        {/* Floating Icon Decoration */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
           <div className="w-20 h-20 bg-slate-950 rounded-[2rem] border-2 border-slate-800 flex items-center justify-center shadow-2xl group-hover:border-blue-500/50 transition-all duration-500">
              <ShieldCheck className="w-10 h-10 text-blue-500" />
           </div>
        </div>

        <div className="text-center mt-8 mb-10">
          <h1 className="text-4xl font-black tracking-tighter italic bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
            DawaKhoj<span className="text-blue-500 text-glow">+</span>
          </h1>
          <p className="text-slate-500 mt-2 font-black uppercase text-[9px] tracking-[0.4em] opacity-80">
            Secure Authentication Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Credentials ID</label>
            <div className="relative group/input">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within/input:text-blue-500 transition-colors" />
              <input
                type="email"
                className="w-full pl-14 pr-6 py-5 bg-slate-950 border border-slate-800 rounded-[1.8rem] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all text-sm font-bold placeholder:text-slate-800"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Access Key</label>
            <div className="relative group/input">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within/input:text-blue-500 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-14 pr-14 py-5 bg-slate-950 border border-slate-800 rounded-[1.8rem] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all text-sm font-bold placeholder:text-slate-800"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-700 hover:text-blue-400 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-[1.8rem] shadow-[0_20px_40px_rgba(37,99,235,0.2)] transition-all active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[11px] mt-4"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>Verify & Enter <ShieldCheck className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <div className="mt-12 flex flex-col items-center gap-4">
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
              Don't have an account? 
              <Link to="/register" className="text-blue-500 font-black ml-2 hover:underline decoration-2 underline-offset-4">
                Join Platform
              </Link>
            </p>
        </div>
      </div>
    </div>
  );
}