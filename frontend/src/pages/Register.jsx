import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { UserPlus, Mail, Phone, Lock, Eye, EyeOff, Loader2, User } from 'lucide-react';
import { register } from '../services/auth.service'; // 🔥 Service import

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
      toast.success('Registration safal! Ab login karein.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration fail ho gaya.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <Toaster />
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-2xl mb-4">
            <UserPlus className="w-7 h-7 text-blue-600" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">DawaKhoj+</h2>
          <p className="text-center text-gray-400 font-medium">Naya Account Banayein</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Type</label>
            <select 
              className="w-full p-4 bg-gray-50 rounded-2xl border-transparent focus:bg-white focus:border-blue-500 outline-none font-bold text-gray-700 cursor-pointer"
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
            >
              <option value="patient">Patient (User) 👤</option>
              <option value="pharmacy">Pharmacy Owner 🏥</option>
            </select>
          </div>

          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500" />
            <input type="text" placeholder="Pura Naam" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-2xl outline-none" 
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500" />
            <input type="email" placeholder="Email Address" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-2xl outline-none" 
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>

          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500" />
            <input type="tel" placeholder="Mobile Number" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-2xl outline-none" 
              value={formData.phone} onChange={handlePhoneChange} required />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500" />
            <input type={showPassword ? "text" : "password"} placeholder="Set Password" className="w-full pl-12 pr-12 py-4 bg-gray-50 border-transparent rounded-2xl outline-none" 
              value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register Karein'}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-500">
          Pehle se account hai? <Link to="/login" className="text-blue-600 font-black hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}