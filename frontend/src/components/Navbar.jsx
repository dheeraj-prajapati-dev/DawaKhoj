import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCircle, LogOut, Package, LayoutDashboard, Smartphone, ShieldAlert } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // --- PWA INSTALL LOGIC ---
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setShowInstallBtn(false);
      setDeferredPrompt(null);
    }
  };

  return (
    <nav className="bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-4 md:px-10 py-4 flex justify-between items-center sticky top-0 z-[100] transition-all">
      
      {/* 1. Logo Section */}
      <div className="flex items-center gap-12">
        <Link to="/" className="text-2xl font-black text-white tracking-tighter italic">
          DawaKhoj<span className="text-blue-500">+</span>
        </Link>
        
        {/* Desktop Links - Updated Styling */}
        <div className="hidden lg:flex gap-8 font-black text-slate-500 text-[11px] uppercase tracking-[0.2em]">
          <Link to="/doctors" className="hover:text-blue-400 transition-colors">Doctors</Link>
          <Link to="/labs" className="hover:text-blue-400 transition-colors">Lab Tests</Link>
          <Link to="/ambulance" className="text-red-500 hover:text-red-400 transition flex items-center gap-2 animate-pulse">
            Ambulance 🚑
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* ✨ PWA INSTALL BUTTON ✨ */}
        {showInstallBtn && (
          <button 
            onClick={handleInstallClick}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-black text-[10px] shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2 border border-blue-400/20"
          >
            <Smartphone className="w-3 h-3" />
            <span className="hidden sm:inline uppercase">Install App</span>
          </button>
        )}

        {user ? (
          <div className="flex items-center gap-4">
            {/* Role Badges */}
            {user.role === 'admin' && (
              <Link to="/admin/dashboard" className="hidden sm:flex items-center gap-2 bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-black px-4 py-2 rounded-xl">
                <LayoutDashboard className="w-3 h-3" /> ADMIN
              </Link>
            )}
            
            {user.role === 'pharmacy' && (
              <Link to="/pharmacy/dashboard" className="hidden sm:flex items-center gap-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-black px-4 py-2 rounded-xl">
                <LayoutDashboard className="w-3 h-3" /> PHARMACY
              </Link>
            )}

            {/* User Controls Glassmorphism */}
            <div className="flex items-center bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 gap-2">
              <Link 
                to="/profile" 
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-800 transition-all text-slate-300 font-bold text-sm group"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/40">
                  <UserCircle className="w-5 h-5 text-white" />
                </div>
                <span className="hidden md:block max-w-[80px] truncate text-xs uppercase tracking-widest font-black">
                  {user.name.split(' ')[0]}
                </span>
              </Link>

              {(user.role === 'user' || user.role === 'patient') && (
                <Link to="/my-orders" className="p-2 hover:text-blue-400 text-slate-500 transition-colors" title="My Orders">
                  <Package className="w-5 h-5" />
                </Link>
              )}
              
              <button 
                onClick={() => { logout(); navigate('/login'); }}
                className="p-2 text-slate-600 hover:text-red-500 transition-colors border-l border-slate-800 ml-1"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-slate-400 font-black text-[11px] uppercase tracking-[0.2em] hover:text-white transition-colors">
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-white text-black px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-500 hover:text-white active:scale-95 transition-all shadow-xl shadow-white/5"
            >
              Join Now
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}