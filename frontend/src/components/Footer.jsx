import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-black text-blue-600 italic">DawaKhoj+</Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              India ka sabse tez healthcare network. Hum medicines, doctor consultation aur ambulance services ko aapke darwaze tak laate hain.
            </p>
            <div className="flex gap-4 text-gray-400">
              <span className="hover:text-blue-600 cursor-pointer">🌐</span>
              <span className="hover:text-blue-600 cursor-pointer">📱</span>
              <span className="hover:text-blue-600 cursor-pointer">📧</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-500 font-medium">
              <li><Link to="/doctors" className="hover:text-blue-600 transition">Find Doctors</Link></li>
              <li><Link to="/labs" className="hover:text-blue-600 transition">Lab Tests</Link></li>
              <li><Link to="/ambulance" className="hover:text-red-500 transition">Emergency Ambulance</Link></li>
              <li><Link to="/medicine" className="hover:text-blue-600 transition">Order Medicines</Link></li>
            </ul>
          </div>

          {/* Column 3: For Partners */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Partnerships</h4>
            <ul className="space-y-2 text-sm text-gray-500 font-medium">
              <li><Link to="/register" className="hover:text-blue-600 transition">Register Pharmacy</Link></li>
              <li><Link to="/register" className="hover:text-blue-600 transition">Join as Doctor</Link></li>
              <li><Link to="/register" className="hover:text-blue-600 transition">Drive with us</Link></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Help & Support</h4>
            <div className="bg-blue-50 p-4 rounded-2xl">
              <p className="text-xs text-blue-600 font-bold uppercase mb-1">Emergency 24/7</p>
              <p className="text-lg font-black text-gray-800">+91 99999-XXXXX</p>
              <button className="mt-3 w-full bg-blue-600 text-white text-xs font-bold py-2 rounded-xl shadow-md">
                Contact Support
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <p>© 2026 DawaKhoj+ Healthcare Pvt Ltd.</p>
          <div className="flex gap-6">
            <span className="hover:text-gray-900 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-900 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}