import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext'; 
import ProtectedRoute from './components/ProtectedRoute'; 

// Pages Import
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
import CategoryList from './components/CategoryList'; 
import CategoryProducts from './pages/CategoryProducts';
import ProductDetails from './pages/ProductDetails';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" reverseOrder={false}/>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen font-sans bg-slate-950 text-white selection:bg-blue-500 selection:text-white">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* ✅ Public Discovery Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/categories" element={<CategoryList isFullPage={true} />} />
              <Route path="/category-products" element={<CategoryProducts />} /> 
              <Route path="/product/:id" element={<ProductDetails />} /> {/* 🔥 ID Based Dynamic Route */}
              
              {/* ✅ Services */}
              <Route path="/doctors" element={<DoctorConsult />} />
              <Route path="/labs" element={<LabTests />} />
              <Route path="/ambulance" element={<Ambulance />} />
              
              {/* ✅ Authentication */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} /> 
              
              {/* 🔐 User Protected Area */}
              <Route path="/search" element={<MedicineSearch />} />
              <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
              <Route path="/upload" element={<ProtectedRoute><UploadPrescription /></ProtectedRoute>} />
              <Route path="/results" element={<Results />} />
              <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
              
              {/* 🚫 Admin Control Panel */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              {/* 🏥 Pharmacy Operation Node */}
              <Route path="/pharmacy/register" element={<ProtectedRoute><PharmacyRegister /></ProtectedRoute>} />
              <Route path="/pharmacy/dashboard" element={
                <ProtectedRoute allowedRoles={['pharmacy']}>
                  <PharmacyDashboard />
                </ProtectedRoute>
              } />
              <Route path="/pharmacy/inventory" element={
                <ProtectedRoute allowedRoles={['pharmacy']}>
                  <PharmacyInventory />
                </ProtectedRoute>
              } />
              <Route path="/pharmacy/orders" element={
                <ProtectedRoute allowedRoles={['pharmacy']}>
                  <PharmacyOrders />
                </ProtectedRoute>
              } />
              
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;