import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { UserPlus, Mail, Phone, Lock, Eye, EyeOff, Loader2, User, ChevronDown } from 'lucide-react';
import { register } from '../services/auth.service';

export default function Register() {
  const [formData, setFormData] = useState({ 
    name: '', email: '', phone: '', password: '', role: 'patient' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setFormData({ ...formData, phone: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.phone.length !== 10) {
      setLoading(false);
      return toast.error('Mobile number 10 digit ka hona chahiye.');
    }

    try {
      await register(formData);
      toast.success('Registration safal! Ab login karein.', {
        style: { background: '#1e293b', color: '#fff', borderRadius: '15px' }
      });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration fail ho gaya.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 font-sans text-white">
      <Toaster position="top-center" />
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl p-10 rounded-[3rem] shadow-2xl w-full max-w-md border border-slate-800/60 relative overflow-hidden my-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/10 rounded-2xl mb-4 border border-blue-500/20 shadow-lg shadow-blue-500/5">
            <UserPlus className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-3xl font-black tracking-tighter italic">DawaKhoj<span className="text-blue-500">+</span></h2>
          <p className="text-slate-500 mt-2 font-bold uppercase text-[10px] tracking-[0.3em]">Create Your Health Profile</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Account Type</label>
            <div className="relative">
              <select 
                className="w-full p-4 bg-slate-950/50 rounded-2xl border border-slate-800 focus:border-blue-500 outline-none font-bold text-slate-300 cursor-pointer appearance-none transition-all"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
              >
                <option value="patient" className="bg-slate-900">Patient (User) 👤</option>
                <option value="pharmacy" className="bg-slate-900">Pharmacy Owner 🏥</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 pointer-events-none" />
            </div>
          </div>

          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-blue-500" />
            <input type="text" placeholder="Pura Naam" className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl outline-none focus:border-blue-500 text-white font-bold transition-all" 
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-blue-500" />
            <input type="email" placeholder="Email Address" className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl outline-none focus:border-blue-500 text-white font-bold transition-all" 
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>

          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-blue-500" />
            <input type="tel" placeholder="Mobile Number" className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl outline-none focus:border-blue-500 text-white font-bold transition-all" 
              value={formData.phone} onChange={handlePhoneChange} required />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-blue-500" />
            <input type={showPassword ? "text" : "password"} placeholder="Set Password" className="w-full pl-12 pr-12 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl outline-none focus:border-blue-500 text-white font-bold transition-all" 
              value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-all">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-900/20 transition-all active:scale-[0.98] uppercase tracking-widest text-xs flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-8 text-xs text-slate-500 font-bold uppercase tracking-widest">
          Pehle se account hai? <Link to="/login" className="text-blue-500 font-black hover:text-blue-400 ml-1">Login</Link>
        </p>
      </div>
    </div>
  );
}