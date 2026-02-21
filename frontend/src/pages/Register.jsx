import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { 
  UserPlus, Mail, Phone, Lock, Eye, EyeOff, 
  Loader2, User, ChevronDown, ShieldCheck, Activity, CheckCircle2 
} from 'lucide-react';
import { register } from '../services/auth.service';

export default function Register() {
  const [formData, setFormData] = useState({ 
    name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'patient' 
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
    
    // Strict Validations
    if (formData.phone.length !== 10) {
      return toast.error('Mobile number 10 digits ka hona chahiye.');
    }
    if (formData.password.length < 6) {
      return toast.error('Password security ke liye kam se kam 6 digits ka rakhein.');
    }
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Confirm Password match nahi kar raha!');
    }

    setLoading(true);
    try {
      await register(formData);
      toast.success('Registration Successful! Redirecting...', {
        style: { background: '#0f172a', color: '#fff', borderRadius: '20px', border: '1px solid #3b82f6' }
      });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 font-sans text-white relative overflow-hidden">
      <Toaster position="top-center" />
      
      {/* Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full"></div>

      <div className="bg-slate-900/40 backdrop-blur-2xl p-8 md:p-12 rounded-[3.5rem] shadow-2xl w-full max-w-md border border-slate-800/60 relative overflow-hidden my-8">
        
        {/* Dynamic Top Bar Color */}
        <div className={`absolute top-0 left-0 w-full h-1 transition-all duration-500 ${formData.role === 'pharmacy' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]'}`}></div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-950 rounded-[2rem] mb-6 border border-slate-800 shadow-inner group transition-all">
            {formData.role === 'pharmacy' ? (
              <ShieldCheck className="w-10 h-10 text-emerald-500 animate-bounce" />
            ) : (
              <Activity className="w-10 h-10 text-blue-500 animate-pulse" />
            )}
          </div>
          <h2 className="text-4xl font-black tracking-tighter italic uppercase">
            DawaKhoj<span className={formData.role === 'pharmacy' ? 'text-emerald-500' : 'text-blue-500'}>+</span>
          </h2>
          <p className="text-slate-500 mt-2 font-black uppercase text-[10px] tracking-[0.4em] opacity-70">Initialize Security Protocol</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Access Level */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3">Access Level</label>
            <div className="relative">
              <select 
                className="w-full p-4 bg-slate-950/80 rounded-2xl border border-slate-800 focus:border-blue-500 outline-none font-black text-slate-200 cursor-pointer appearance-none transition-all text-xs tracking-widest uppercase italic"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
              >
                <option value="patient">Standard User (Patient)</option>
                <option value="pharmacy">Commercial (Pharmacy)</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
            </div>
          </div>

          {/* Name Input */}
          <div className="relative group">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="FULL NAME" 
              className="w-full pl-14 pr-6 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl outline-none focus:border-blue-500 text-white font-bold transition-all placeholder:text-slate-700 text-sm" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              required 
            />
          </div>
          
          {/* Email Input */}
          <div className="relative group">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="email" 
              placeholder="EMAIL ADDRESS" 
              className="w-full pl-14 pr-6 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl outline-none focus:border-blue-500 text-white font-bold transition-all placeholder:text-slate-700 text-sm" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              required 
            />
          </div>

          {/* Phone Input */}
          <div className="relative group">
            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="tel" 
              placeholder="MOBILE NUMBER" 
              className="w-full pl-14 pr-6 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl outline-none focus:border-blue-500 text-white font-bold transition-all placeholder:text-slate-700 text-sm" 
              value={formData.phone} 
              onChange={handlePhoneChange} 
              required 
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="SECURITY KEY" 
              className="w-full pl-14 pr-14 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl outline-none focus:border-blue-500 text-white font-bold transition-all placeholder:text-slate-700 text-sm" 
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})} 
              required 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-all"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Confirm Password with Visual Validation */}
          <div className="relative group">
            <CheckCircle2 className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${formData.confirmPassword ? (formData.password === formData.confirmPassword ? 'text-emerald-500' : 'text-red-500') : 'text-slate-600'}`} />
            <input 
              type="password" 
              placeholder="CONFIRM SECURITY KEY" 
              className={`w-full pl-14 pr-6 py-4 bg-slate-950/50 border rounded-2xl outline-none transition-all font-bold text-sm placeholder:text-slate-700 
                ${!formData.confirmPassword ? 'border-slate-800' : 
                  (formData.password === formData.confirmPassword ? 'border-emerald-500/50' : 'border-red-500/50')}`}
              value={formData.confirmPassword} 
              onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className={`w-full ${formData.role === 'pharmacy' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'} text-white font-black py-5 rounded-[2rem] shadow-xl transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 mt-4`}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Profile'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
            Existing Member? 
            <Link to="/login" className="text-blue-500 hover:text-blue-400 ml-2 transition-colors underline underline-offset-4 decoration-2">Authorize Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}