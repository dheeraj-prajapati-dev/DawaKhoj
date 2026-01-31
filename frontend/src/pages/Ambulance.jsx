import React from 'react';

const Ambulance = () => {
  return (
    <div className="min-h-screen bg-red-50 p-6 flex flex-col items-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border-t-8 border-red-600">
        <span className="text-6xl mb-4 block">🚑</span>
        <h1 className="text-3xl font-black text-gray-800 mb-2">Emergency Ambulance</h1>
        <p className="text-gray-500 mb-8">Apne location ke sabse kareeb private ambulance bulayein.</p>
        
        {/* Call Button */}
        <a href="tel:102" className="block w-full bg-red-600 hover:bg-red-700 text-white text-xl font-bold py-5 rounded-2xl shadow-lg shadow-red-200 transition-all active:scale-95 mb-6">
           Abhi Call Karein 📞
        </a>

        <div className="bg-gray-50 rounded-2xl p-4 text-left border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Live Status</p>
            <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                24 Ambulances aapke area mein active hain
            </p>
        </div>
      </div>
    </div>
  );
};

export default Ambulance;