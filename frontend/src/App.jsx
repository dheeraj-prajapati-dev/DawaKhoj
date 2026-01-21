import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import PharmacyRegister from './pages/PharmacyRegister';
import PharmacyInventory from './pages/PharmacyInventory';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/pharmacy/register" element={<PharmacyRegister />} />
        <Route path="/pharmacy/inventory" element={<PharmacyInventory />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
