import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import PharmacyRegister from './pages/PharmacyRegister';
import PharmacyInventory from './pages/PharmacyInventory';
import AdminDashboard from './pages/AdminDashboard';
import UploadPrescription from './pages/UploadPrescription';
import Results from './pages/Results';
import Home from './pages/Home';
import PharmacyOrders from './pages/PharmacyOrders';
import PharmacyDashboard from './pages/PharmacyDashboard'; // Dashboard import karein

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* User Routes */}
        <Route path="/upload" element={<UploadPrescription />} />
        <Route path="/results" element={<Results />} />
        
        {/* Pharmacy Routes */}
        <Route path="/pharmacy/register" element={<PharmacyRegister />} />
        <Route path="/pharmacy/dashboard" element={<PharmacyDashboard />} />
        <Route path="/pharmacy/inventory" element={<PharmacyInventory />} />
        <Route path="/pharmacy/orders" element={<PharmacyOrders />} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;