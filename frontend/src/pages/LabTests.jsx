import React from 'react';

const packages = [
    { title: "Full Body Checkup", tests: "60+ Tests", price: "999", color: "blue" },
    { title: "Diabetes Care", tests: "HbA1c, Glucose", price: "499", color: "green" }
];

const LabTests = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-black text-gray-800 mb-8 text-center">Health Checkup Packages 🔬</h1>
      <div className="flex flex-col gap-4 max-w-2xl mx-auto">
        {packages.map((p, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-black text-gray-800">{p.title}</h3>
                    <p className="text-gray-500 text-sm font-medium">{p.tests}</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-black text-blue-600">₹{p.price}</p>
                    <button className="text-[10px] font-bold bg-gray-100 px-3 py-1 rounded-full mt-2">View Details</button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default LabTests;