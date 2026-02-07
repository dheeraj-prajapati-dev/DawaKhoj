import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // --- PWA INSTALL LOGIC START ---
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    // Browser jab install prompt ready karta hai
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    });

    // Install hone ke baad button chhupane ke liye
    window.addEventListener('appinstalled', () => {
      setShowInstallBtn(false);
      setDeferredPrompt(null);
      console.log('DawaKhoj+ Installed Successfully! 🎉');
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallBtn(false);
      }
      setDeferredPrompt(null);
    }
  };
  // --- PWA INSTALL LOGIC END ---

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-2xl font-black text-blue-600 italic">DawaKhoj+</Link>
        
        <div className="hidden lg:flex gap-6 font-bold text-gray-500 text-sm">
          <Link to="/doctors" className="hover:text-blue-600 transition">Doctor</Link>
          <Link to="/labs" className="hover:text-blue-600 transition">Lab Test</Link>
          <Link to="/ambulance" className="text-red-500 hover:scale-105 transition flex items-center gap-1">
            Ambulance 🚑
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* ✨ PWA INSTALL BUTTON ✨ */}
        {showInstallBtn && (
          <button 
            onClick={handleInstallClick}
            className="bg-yellow-400 text-blue-900 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-black text-[10px] md:text-xs shadow-md hover:bg-yellow-300 transition-all animate-pulse flex items-center gap-1 border-2 border-white"
          >
            <span className="hidden md:inline">INSTALL</span> APP 📲
          </button>
        )}

        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin/dashboard" className="bg-blue-600 text-white text-[10px] md:text-xs font-black px-4 py-2 rounded-full shadow-md tracking-wider">
                ADMIN PANEL
              </Link>
            )}
            
            {user.role === 'pharmacy' && (
              <Link to="/pharmacy/dashboard" className="bg-green-600 text-white text-[10px] md:text-xs font-black px-4 py-2 rounded-full shadow-md tracking-wider">
                PHARMACY PANEL
              </Link>
            )}

            {(user.role === 'user' || user.role === 'patient') && (
              <Link to="/my-orders" className="text-gray-700 font-bold text-sm hover:text-blue-600 px-2">
                My Orders
              </Link>
            )}
            
            <button 
              onClick={handleLogout}
              className="ml-1 md:ml-2 text-gray-400 font-bold text-sm hover:text-red-500 transition border-l pl-3 md:pl-4"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-blue-600 font-bold text-sm hover:underline">
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
            >
              Join Now
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}