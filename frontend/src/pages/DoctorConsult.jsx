import React from 'react';

const specialities = [
    { name: "General Physician", icon: "👨‍⚕️", color: "bg-blue-100" },
    { name: "Cardiologist", icon: "🫀", color: "bg-red-100" },
    { name: "Pediatrician", icon: "👶", color: "bg-orange-100" },
    { name: "Dermatologist", icon: "🧴", color: "bg-pink-100" }
];

const DoctorConsult = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-black text-gray-800 mb-2">Doctor Se Baat Karein</h1>
      <p className="text-gray-500 mb-8 font-medium">Top specialists se video call par paramarsh lein.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {specialities.map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group text-center">
                <div className={`w-16 h-16 ${s.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    {s.icon}
                </div>
                <h3 className="font-bold text-gray-800">{s.name}</h3>
                <span className="text-[10px] text-blue-500 font-black mt-2 inline-block">COMING SOON</span>
            </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorConsult;