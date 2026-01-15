import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import UploadPrescription from "./pages/UploadPrescription";
import Results from "./pages/Results";
import PharmacyInventory from "./pages/PharmacyInventory"; // ✅ ADD THIS

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<UploadPrescription />} />
        <Route path="/results" element={<Results />} />

        {/* ✅ PHARMACY INVENTORY */}
        <Route
          path="/pharmacy/inventory"
          element={<PharmacyInventory />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
