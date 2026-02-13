import React from 'react';
import { useNavigate } from 'react-router-dom';

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
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* 1. Branding Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-black italic bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            DawaKhoj+
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            India ka sabse tez healthcare network. Hum medicines, doctor consultation aur ambulance services ko aapke darwaze tak laate hain.
          </p>
          <div className="flex gap-4">
            {/* Website Icon */}
            <a href={socialLinks.web} target="_blank" rel="noreferrer" className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center hover:border-blue-500 transition-colors cursor-pointer">
              🌐
            </a>
            {/* Instagram Icon */}
            <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center hover:border-pink-500 transition-colors cursor-pointer">
              📱
            </a>
            {/* Email Icon */}
            <a href={socialLinks.email} className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center hover:border-yellow-500 transition-colors cursor-pointer">
              📧
            </a>
          </div>
        </div>

        {/* 2. Quick Services */}
        <div>
          <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Services</h3>
          <ul className="space-y-4 text-gray-500 text-sm font-medium">
            <li onClick={() => navigate('/doctors')} className="hover:text-blue-400 cursor-pointer transition-colors">Find Doctors</li>
            <li onClick={() => navigate('/labs')} className="hover:text-blue-400 cursor-pointer transition-colors">Lab Tests</li>
            <li onClick={() => navigate('/ambulance')} className="hover:text-blue-400 cursor-pointer transition-colors">Emergency Ambulance</li>
            <li onClick={() => navigate('/search')} className="hover:text-blue-400 cursor-pointer transition-colors">Order Medicines</li>
          </ul>
        </div>

        {/* 3. Partnerships */}
        <div>
          <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Partnerships</h3>
          <ul className="space-y-4 text-gray-500 text-sm font-medium">
            <li onClick={() => navigate('/pharmacy/register')} className="hover:text-emerald-400 cursor-pointer transition-colors">Register Pharmacy</li>
            <li className="hover:text-emerald-400 cursor-pointer transition-colors">Join as Doctor</li>
            <li className="hover:text-emerald-400 cursor-pointer transition-colors">Drive with us</li>
          </ul>
        </div>

        {/* 4. Help & Support - NOW WORKING */}
        <div className="bg-blue-600/5 border border-blue-500/10 p-6 rounded-3xl">
          <h3 className="text-blue-400 font-bold mb-4 uppercase tracking-widest text-[10px]">Emergency 24/7</h3>
          <p 
            onClick={handleSupportClick} 
            className="text-white text-xl font-black mb-4 cursor-pointer hover:text-blue-300 transition-colors"
          >
            +91 9712841735
          </p>
          <button 
            onClick={() => window.location.href = socialLinks.email}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs transition-all active:scale-95 shadow-lg shadow-blue-900/20"
          >
            CONTACT SUPPORT
          </button>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-600 text-[10px] font-bold tracking-widest uppercase">
          © 2026 DAWAKHOJ+ HEALTHCARE PVT LTD.
        </p>
        <div className="flex gap-8 text-gray-600 text-[10px] font-bold uppercase tracking-widest">
          <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;