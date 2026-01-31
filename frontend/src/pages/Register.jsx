import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    password: '', 
    role: 'patient' // Default role patient rakha hai
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend URL check karein (Postman wala hi hai)
      await axios.post('http://localhost:5000/api/auth/register', formData);
      toast.success('Registration safal raha! Ab login karein.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration fail ho gaya.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Toaster />
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-black text-blue-600 text-center mb-6 italic">DawaKhoj+</h2>
        <p className="text-center text-gray-500 mb-6 font-medium">Naya Account Banayein</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection - Postman ki tarah yahan se role jayega */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Account Type</label>
            <select 
              className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-700"
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
            >
              <option value="patient">Patient (User) 👤</option>
              <option value="pharmacy">Pharmacy Owner 🏥</option>
              {/* Admin ko hum register se nahi, seedha DB se banate hain safety ke liye */}
            </select>
          </div>

          <input type="text" placeholder="Pura Naam" className="w-full p-4 bg-gray-50 rounded-2xl border" 
            onChange={e => setFormData({...formData, name: e.target.value})} required />
          
          <input type="email" placeholder="Email Address" className="w-full p-4 bg-gray-50 rounded-2xl border" 
            onChange={e => setFormData({...formData, email: e.target.value})} required />

          <input type="text" placeholder="Mobile Number (Mandatory)" className="w-full p-4 bg-gray-50 rounded-2xl border" 
            onChange={e => setFormData({...formData, phone: e.target.value})} required />

          <input type="password" placeholder="Password" className="w-full p-4 bg-gray-50 rounded-2xl border" 
            onChange={e => setFormData({...formData, password: e.target.value})} required />

          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-700 transition-all active:scale-95 mt-4">
            Register Karein
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          Pehle se account hai? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}