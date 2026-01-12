import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function UploadPrescription() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleSubmit = () => {
    if (!image) {
      setError("Please select a prescription image");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const formData = new FormData();
          formData.append("image", image);
          formData.append("lat", pos.coords.latitude);
          formData.append("lng", pos.coords.longitude);

          const res = await api.post(
            "/flow/prescription-search",
            formData
          );

          navigate("/results", { state: res.data });
        } catch (err) {
          console.error(err);
          setError(
            err?.response?.data?.message ||
            "Failed to process prescription"
          );
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location permission is required");
        setLoading(false);
      }
    );
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">

      <h2 className="text-2xl font-semibold text-center mb-4">
        Upload Prescription
      </h2>

      {/* Preview INSIDE card */}
{preview && (
  <div className="mt-4 flex justify-center">
    <img
      src={preview}
      alt="Prescription Preview"
      className="max-h-60 w-auto object-contain rounded-lg border shadow"
    />
  </div>
)}


      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4 w-full"
      />

      {error && (
        <p className="text-red-500 text-sm mb-3 text-center">
          {error}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded w-full disabled:opacity-50"
      >
        {loading ? "Processing..." : "Find Medicines"}
      </button>

    </div>
  </div>
);
}
