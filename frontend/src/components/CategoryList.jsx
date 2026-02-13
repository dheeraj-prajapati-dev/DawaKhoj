import React from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { id: 3, name: 'Devices', icon: '🩺', color: 'from-blue-500/10 to-blue-600/5', border: 'border-blue-500/20' },
  { id: 4, name: 'Baby Care', icon: '👶', color: 'from-orange-500/10 to-orange-600/5', border: 'border-orange-500/20' },
  { id: 5, name: 'Personal Care', icon: '🧴', color: 'from-purple-500/10 to-purple-600/5', border: 'border-purple-500/20' },
  { id: 6, name: 'Supplements', icon: '🍎', color: 'from-red-500/10 to-red-600/5', border: 'border-red-500/20' },
  { id: 7, name: 'Ayurvedic', icon: '🌿', color: 'from-green-500/10 to-green-600/5', border: 'border-green-500/20' },
  { id: 8, name: 'First Aid', icon: '🩹', color: 'from-rose-500/10 to-rose-600/5', border: 'border-rose-500/20' },
];

const CategoryList = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase">
            Shop by <span className="text-blue-500">Category</span>
          </h2>
          <p className="text-gray-500 font-medium mt-2">Dawaon ke alawa baki zarurat ka saman yahan se browse karein.</p>
        </div>
        <button 
          onClick={() => navigate('/search')}
          className="bg-blue-600/10 text-blue-400 border border-blue-500/20 px-6 py-2 rounded-full text-[10px] font-black tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all duration-300"
        >
          VIEW ALL PRODUCTS
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {categories.map((cat) => (
          <div 
            key={cat.id}
            onClick={() => navigate(`/search?category=${encodeURIComponent(cat.name)}`)}
            className={`group relative p-8 rounded-[2.5rem] cursor-pointer transition-all duration-500 hover:-translate-y-2 border ${cat.border} bg-gradient-to-br ${cat.color} backdrop-blur-md overflow-hidden`}
          >
            {/* Subtle Hover Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-16 h-16 mb-4 flex items-center justify-center text-4xl group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500">
                {cat.icon}
              </div>
              <span className="text-xs font-black text-gray-300 group-hover:text-white uppercase tracking-wider">
                {cat.name}
              </span>
            </div>
            
            {/* Corner Accent */}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white/5 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryList;