import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom'; 
import { toast, Toaster } from 'react-hot-toast';
import { useAuth, API } from '../context/AuthContext'; // 🔥 API import kiya
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, loading: authLoading } = useAuth();

  // Agar user pehle se logged in hai, toh use dashboard ya home bhej do
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
      // 🚀 Using secure API instance instead of default axios
      const res = await API.post('/auth/login', { email, password });

      if (res.data.success) {
        login(res.data.user);
        toast.success(`Swagat hai, ${res.data.user.name}!`);
        // Navigation useEffect sambhaal lega
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login fail ho gaya!');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null; // Don't show login form if checking session

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <Toaster />
      <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-md border border-gray-100">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-3xl mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">DawaKhoj+</h1>
          <p className="text-gray-400 mt-2 font-medium">Apne account mein login karein</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="email"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                placeholder="naam@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1 flex justify-between">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login Karein'}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-500 font-medium">
          Naya account? <Link to="/register" className="text-blue-600 font-black ml-1 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}