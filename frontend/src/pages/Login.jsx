import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom'; 
import { toast, Toaster } from 'react-hot-toast';
import { useAuth, API } from '../context/AuthContext';
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';

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
        toast.success(`Swagat hai, ${res.data.user.name}!`, {
          style: { background: '#1e293b', color: '#fff', borderRadius: '15px' }
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login fail ho gaya!');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 font-sans text-white">
      <Toaster position="top-center" />
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl p-10 rounded-[3rem] shadow-2xl w-full max-w-md border border-slate-800/60 relative overflow-hidden">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600/10 rounded-3xl mb-6 border border-blue-500/20 shadow-lg shadow-blue-500/5">
            <Lock className="w-10 h-10 text-blue-500" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter italic bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">DawaKhoj<span className="text-blue-500">+</span></h1>
          <p className="text-slate-500 mt-2 font-bold uppercase text-[10px] tracking-[0.3em]">Secure Access Required</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="email"
                className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-white placeholder:text-slate-700 font-bold"
                placeholder="naam@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-12 pr-12 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-white placeholder:text-slate-700 font-bold"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-900/20 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login Access'}
          </button>
        </form>

        <p className="text-center mt-10 text-xs text-slate-500 font-bold uppercase tracking-widest">
          Naya account? <Link to="/register" className="text-blue-500 font-black ml-1 hover:text-blue-400">Join Platform</Link>
        </p>
      </div>
    </div>
  );
}