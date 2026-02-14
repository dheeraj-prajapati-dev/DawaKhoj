import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  UserCircle, LogOut, Package, 
  LayoutDashboard, Smartphone, Siren, 
  Menu, X 
} from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <nav className="bg-slate-950/90 backdrop-blur-xl border-b border-slate-900 px-6 md:px-12 py-4 flex justify-between items-center sticky top-0 z-[100] shadow-2xl">
      
      {/* 1. Logo Section */}
      <div className="flex items-center gap-10">
        <Link to="/" className="text-2xl font-black text-white tracking-tighter italic flex items-center gap-1">
          DawaKhoj<span className="text-blue-500 font-black">+</span>
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-500">
          <Link to="/doctors" className="hover:text-blue-400 transition-colors">Doctors</Link>
          <Link to="/labs" className="hover:text-blue-400 transition-colors">Lab Tests</Link>
          <Link to="/ambulance" className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-all animate-pulse">
            <Siren size={14} /> Ambulance 
          </Link>
        </div>
      </div>

      {/* 2. Actions Section */}
      <div className="flex items-center gap-4">
        
        {/* App Install Button */}
        {showInstallBtn && (
          <button 
            onClick={handleInstallClick}
            className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20 active:scale-95 border border-blue-400/20"
          >
            <Smartphone size={14} /> Install App
          </button>
        )}

        {user ? (
          <div className="flex items-center gap-3">
            {/* Professional Role Badges */}
            {user.role === 'admin' && (
              <Link to="/admin/dashboard" className="hidden md:flex items-center gap-2 bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-black px-4 py-2 rounded-xl uppercase">
                <LayoutDashboard size={14} /> Admin Dashboard
              </Link>
            )}
            
            {user.role === 'pharmacy' && (
              <Link to="/pharmacy/dashboard" className="hidden md:flex items-center gap-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-tighter">
                <LayoutDashboard size={14} /> Pharmacy Dashboard
              </Link>
            )}

            {/* Profile & Logout Container */}
            <div className="flex items-center bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
              <Link 
                to="/profile" 
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-800 transition-all group"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <UserCircle className="w-5 h-5 text-white" />
                </div>
                <span className="hidden md:block text-[10px] text-slate-200 font-black uppercase tracking-widest max-w-[70px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              </Link>

              {(user.role === 'user' || user.role === 'patient') && (
                <Link to="/my-orders" className="p-2 text-slate-500 hover:text-blue-400 transition-colors border-l border-slate-800 ml-1">
                  <Package size={18} />
                </Link>
              )}
              
              <button 
                onClick={() => { logout(); navigate('/login'); }}
                className="p-2 text-slate-600 hover:text-red-500 transition-colors ml-1"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-5">
            <Link to="/login" className="text-slate-500 font-black text-[11px] uppercase tracking-widest hover:text-white transition-colors">
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-white text-black px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95"
            >
              Join Now
            </Link>
          </div>
        )}

        {/* Mobile Menu Icon */}
        <button className="lg:hidden p-2 text-slate-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
           {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}