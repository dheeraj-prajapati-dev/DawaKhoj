import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext'; 
import ProtectedRoute from './components/ProtectedRoute'; 

// Pages Import
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
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
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0f172a',
              color: '#fff',
              border: '1px solid #1e293b',
              fontSize: '12px',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            },
          }}
        />
        <ScrollToTop />
        <div className="flex flex-col min-h-screen font-sans bg-slate-950 text-white selection:bg-blue-600 selection:text-white">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* --- Public & Discovery --- */}
              <Route path="/" element={<Home />} />
              <Route path="/categories" element={<CategoryList isFullPage={true} />} />
              <Route path="/category-products" element={<CategoryProducts />} /> 
              <Route path="/product/:id" element={<ProductDetails />} />
              
              {/* --- Healthcare Services --- */}
              <Route path="/doctors" element={<DoctorConsult />} />
              <Route path="/labs" element={<LabTests />} />
              <Route path="/ambulance" element={<Ambulance />} />
              
              {/* --- User Authentication --- */}
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              <Route path="/reset-password/:token" element={<ResetPassword />} />

              <Route path="/register" element={<Register />} /> 
              
              {/* --- Secured User Account Area --- */}
              <Route path="/search" element={<MedicineSearch />} />
              <Route path="/results" element={<Results />} />
              <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
              <Route path="/upload" element={<ProtectedRoute><UploadPrescription /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
              
              {/* --- Administrative Control --- */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              {/* --- Pharmacy Partner Network --- */}
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