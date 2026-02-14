import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Instagram, Mail, Globe, Phone, 
  ArrowUpRight, Heart, ShieldCheck, Zap 
} from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();

  const socialLinks = {
    web: "https://yourwebsite.com",
    instagram: "https://instagram.com/dheerajprajapati_",
    email: "mailto:adheeraj9781@gmail.com"
  };

  const handleSupportClick = () => {
    window.location.href = "tel:+919712841735";
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-900/50 pt-20 pb-10 px-6 mt-auto relative overflow-hidden">
      {/* 🌌 Background Glow Effect */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -z-10"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* 1. Branding Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-black italic tracking-tighter bg-gradient-to-br from-white via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                DawaKhoj+
              </h2>
              <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
                India ka sabse asaan healthcare network. Sahi dawai aur doctor ki khoj ab ek click door.
              </p>
            </div>
            
            {/* Social Icons */}
            <div className="flex gap-4">
              {[
                { icon: <Globe size={18} />, link: socialLinks.web, color: 'hover:text-blue-400' },
                { icon: <Instagram size={18} />, link: socialLinks.instagram, color: 'hover:text-pink-500' },
                { icon: <Mail size={18} />, link: socialLinks.email, color: 'hover:text-yellow-500' }
              ].map((social, idx) => (
                <a 
                  key={idx}
                  href={social.link} 
                  target="_blank" 
                  rel="noreferrer" 
                  className={`w-12 h-12 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 transition-all duration-300 hover:border-slate-700 hover:-translate-y-1 ${social.color}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* 2. Main Services */}
          <div>
            <h3 className="text-white text-[10px] font-black mb-8 uppercase tracking-[0.3em] flex items-center gap-2">
              <Zap size={14} className="text-blue-500" /> Hamari Suvidhayein
            </h3>
            <ul className="space-y-5 text-slate-500 text-[11px] font-black uppercase tracking-widest">
              {[
                { name: 'Doctor Dhoondhein', path: '/doctors' },
                { name: 'Lab Test Book Karein', path: '/labs' },
                { name: 'Ambulance Bulayein', path: '/ambulance' },
                { name: 'Dawai Order Karein', path: '/search' }
              ].map((item) => (
                <li 
                  key={item.name}
                  onClick={() => navigate(item.path)} 
                  className="hover:text-blue-400 cursor-pointer transition-colors flex items-center group"
                >
                  {item.name}
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ml-1" />
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Join Us Section */}
          <div>
            <h3 className="text-white text-[10px] font-black mb-8 uppercase tracking-[0.3em] flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" /> Humse Judyein
            </h3>
            <ul className="space-y-5 text-slate-500 text-[11px] font-black uppercase tracking-widest">
              {[
                { name: 'Pharmacy Register Karein', path: '/pharmacy/register' },
                { name: 'Doctor Ban kar Judyein', path: '#' },
                { name: 'Delivery Partner Baney', path: '#' }
              ].map((item) => (
                <li 
                  key={item.name}
                  onClick={() => navigate(item.path)} 
                  className="hover:text-emerald-400 cursor-pointer transition-colors flex items-center group"
                >
                  {item.name}
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ml-1" />
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Support Box */}
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-600/10 blur-2xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-xl">
              <h3 className="text-blue-400 font-black mb-6 uppercase tracking-[0.2em] text-[9px]">24/7 Helpline Number</h3>
              <div 
                onClick={handleSupportClick} 
                className="flex items-center gap-3 text-white text-xl font-black mb-6 cursor-pointer hover:text-blue-400 transition-colors tracking-tighter"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                +91 97128-41735
              </div>
              <button 
                onClick={() => window.location.href = socialLinks.email}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] tracking-[0.2em] transition-all active:scale-95 shadow-2xl shadow-blue-900/40 uppercase"
              >
                Help Desk Se Baat Karein
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-600 text-[9px] font-black uppercase tracking-[0.3em]">
          <div className="flex items-center gap-2">
            <span>© 2026 DAWAKHOJ+ HEALTHCARE</span>
            <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
            <span className="flex items-center gap-1">Made with <Heart size={10} className="text-red-500 fill-red-500" /> by Dheeraj</span>
          </div>
          
          <div className="flex gap-10">
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms & Conditions</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;