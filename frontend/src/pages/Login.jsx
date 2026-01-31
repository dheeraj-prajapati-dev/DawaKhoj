import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // 🔥 Link import kiya
import { toast, Toaster } from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        'https://dawakhoj.onrender.com/api/auth/login',
        { email, password }
      );

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      toast.success(`Swagat hai, ${res.data.user.name}!`);

      setTimeout(() => {
        if (res.data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (res.data.user.role === 'pharmacy') {
          navigate('/pharmacy/dashboard');
        } else {
          navigate('/'); // 🔥 Change: Login ke baad Home dikhao taaki user services dekh sake
        }
      }, 1000);

    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed! Details check karein.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans text-gray-900">
      <Toaster />
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-blue-600 tracking-tight">DawaKhoj</h1>
          <p className="text-gray-500 mt-2 font-medium">Apne account mein login karein</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
            <input
              type="email"
              className="w-full mt-1 p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="naam@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
            <input
              type="password"
              className="w-full mt-1 p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Login Karein'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500 font-medium">
          Account nahi hai? 
          <Link to="/register" className="text-blue-600 font-black ml-1 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}