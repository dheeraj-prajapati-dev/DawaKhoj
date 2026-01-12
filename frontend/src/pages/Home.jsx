import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">DawaKhoj</h1>
      <p className="text-gray-400 text-center max-w-md">
        Upload prescription & find cheapest medicine near you
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/upload")}
          className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Upload Prescription
        </button>

        <button
          onClick={() => navigate("/search")}
          className="px-6 py-3 border border-gray-600 rounded-lg"
        >
          Search Medicine
        </button>
      </div>
    </div>
  );
}
