import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCircle, LogOut, Package, LayoutDashboard, Smartphone } from 'lucide-react';

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

    window.addEventListener('appinstalled', () => {
      setShowInstallBtn(false);
      setDeferredPrompt(null);
      console.log('DawaKhoj+ Installed! 🎉');
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

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b px-4 md:px-8 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm transition-all">
      <div className="flex items-center gap-10">
        <Link to="/" className="text-2xl font-black text-blue-600 tracking-tighter italic">
          DawaKhoj<span className="text-blue-400">+</span>
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden lg:flex gap-8 font-bold text-slate-500 text-[13px] uppercase tracking-wider">
          <Link to="/doctors" className="hover:text-blue-600 transition-colors">Doctor</Link>
          <Link to="/labs" className="hover:text-blue-600 transition-colors">Lab Test</Link>
          <Link to="/ambulance" className="text-red-500 hover:text-red-600 transition flex items-center gap-1.5 animate-pulse">
            Ambulance 🚑
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        {/* ✨ PWA INSTALL BUTTON ✨ */}
        {showInstallBtn && (
          <button 
            onClick={handleInstallClick}
            className="bg-yellow-400 text-blue-900 px-3 py-2 rounded-xl font-black text-[10px] md:text-xs shadow-lg shadow-yellow-100 hover:bg-yellow-300 transition-all flex items-center gap-2 border-2 border-white"
          >
            <Smartphone className="w-3 h-3" />
            <span className="hidden sm:inline">INSTALL APP</span>
          </button>
        )}

        {user ? (
          <div className="flex items-center gap-3 md:gap-5">
            {/* Dynamic Panel Buttons based on Role */}
            {user.role === 'admin' && (
              <Link to="/admin/dashboard" className="hidden sm:flex items-center gap-2 bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-xl shadow-lg">
                <LayoutDashboard className="w-3 h-3" /> ADMIN
              </Link>
            )}
            
            {user.role === 'pharmacy' && (
              <Link to="/pharmacy/dashboard" className="hidden sm:flex items-center gap-2 bg-green-600 text-white text-[10px] font-black px-4 py-2 rounded-xl shadow-lg">
                <LayoutDashboard className="w-3 h-3" /> PHARMACY
              </Link>
            )}

            {/* User Profile & Navigation Group */}
            <div className="flex items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-100 gap-1 md:gap-2">
              <Link 
                to="/profile" 
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white hover:shadow-sm transition-all text-slate-700 font-bold text-sm group"
                title="My Profile"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <UserCircle className="w-5 h-5 text-blue-600 group-hover:text-white" />
                </div>
                <span className="hidden md:block max-w-[80px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              </Link>

              {(user.role === 'user' || user.role === 'patient') && (
                <Link to="/my-orders" className="p-2 hover:text-blue-600 text-slate-500 transition-colors" title="My Orders">
                  <Package className="w-5 h-5" />
                </Link>
              )}
              
              <button 
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors border-l border-slate-200 ml-1"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-slate-600 font-bold text-sm hover:text-blue-600 transition-colors">
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
            >
              Join Now
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}