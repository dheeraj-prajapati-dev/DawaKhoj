import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import PharmacyRegister from './pages/PharmacyRegister';
import PharmacyInventory from './pages/PharmacyInventory';
import AdminDashboard from './pages/AdminDashboard';
import UploadPrescription from './pages/UploadPrescription';
import Results from './pages/Results';
import Home from './pages/Home';
import PharmacyOrders from './pages/PharmacyOrders';
import PharmacyDashboard from './pages/PharmacyDashboard';
import MedicineSearch from './pages/MedicineSearch'; 
import UserProfile from './pages/UserProfile';
import MyOrders from './pages/MyOrders';
import Ambulance from './pages/Ambulance';
import DoctorConsult from './pages/DoctorConsult';
import LabTests from './pages/LabTests';
import Footer from './components/Footer'; 
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
    <Toaster position="top-right" reverseOrder={false}/>
    <ScrollToTop />
      <div className="flex flex-col min-h-screen"> {/* Footer ko hamesha niche rakhne ke liye */}
        <Navbar />
        
        <main className="flex-grow"> {/* Content area jo footer ko niche dhakelega */}
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/doctors" element={<DoctorConsult />} />
            <Route path="/labs" element={<LabTests />} />
            <Route path="/ambulance" element={<Ambulance />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> 
            
            {/* User Routes */}
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/upload" element={<UploadPrescription />} />
            <Route path="/results" element={<Results />} />
            <Route path="/search" element={<MedicineSearch />} /> 
            <Route path="/profile" element={<UserProfile />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            {/* Pharmacy Routes */}
            <Route path="/pharmacy/register" element={<PharmacyRegister />} />
            <Route path="/pharmacy/dashboard" element={<PharmacyDashboard />} />
            <Route path="/pharmacy/inventory" element={<PharmacyInventory />} />
            <Route path="/pharmacy/orders" element={<PharmacyOrders />} />
            
          </Routes>
        </main>

        <Footer /> {/* Sabse niche Footer */}
      </div>
    </BrowserRouter>
  );
}

export default App;