import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Stethoscope, Baby, Sparkles, Apple, 
  Leaf, PlusSquare, ArrowRight, LayoutGrid 
} from 'lucide-react';

const categories = [
  { id: 3, name: 'Devices', icon: <Stethoscope size={32} />, color: 'from-blue-500/10 to-blue-600/5', border: 'border-blue-500/20', text: 'text-blue-400' },
  { id: 4, name: 'Baby Care', icon: <Baby size={32} />, color: 'from-orange-500/10 to-orange-600/5', border: 'border-orange-500/20', text: 'text-orange-400' },
  { id: 5, name: 'Personal Care', icon: <Sparkles size={32} />, color: 'from-purple-500/10 to-purple-600/5', border: 'border-purple-500/20', text: 'text-purple-400' },
  { id: 6, name: 'Supplements', icon: <Apple size={32} />, color: 'from-red-500/10 to-red-600/5', border: 'border-red-500/20', text: 'text-red-400' },
  { id: 7, name: 'Ayurvedic', icon: <Leaf size={32} />, color: 'from-green-500/10 to-green-600/5', border: 'border-green-500/20', text: 'text-green-400' },
  { id: 8, name: 'First Aid', icon: <PlusSquare size={32} />, color: 'from-rose-500/10 to-rose-600/5', border: 'border-rose-500/20', text: 'text-rose-400' },
];

const CategoryList = ({ isFullPage = false }) => {
  const navigate = useNavigate();

  return (
    <section className={`py-20 px-6 max-w-7xl mx-auto relative ${isFullPage ? 'min-h-screen' : ''}`}>
      
      {/* 🌌 Top Accent Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">
            <LayoutGrid size={12} className="text-blue-500" /> Catalog Nodes
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic uppercase leading-none">
            Shop by <span className="text-blue-500">Category</span>
          </h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] max-w-md">
            {isFullPage 
              ? 'Access our complete neural network of medical supplies and wellness assets.' 
              : 'Browse specialized medical nodes for non-prescription health essentials.'}
          </p>
        </div>

        {!isFullPage && (
          <button 
            onClick={() => navigate('/categories')}
            className="group flex items-center gap-3 bg-slate-900 text-slate-300 border border-slate-800 px-8 py-4 rounded-2xl text-[10px] font-black tracking-[0.2em] hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-500 shadow-2xl"
          >
            VIEW ALL PROTOCOLS
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((cat) => (
          <div 
            key={cat.id}
            onClick={() => navigate(`/search?category=${encodeURIComponent(cat.name)}`)}
            className={`group relative p-10 rounded-[3rem] cursor-pointer transition-all duration-700 hover:-translate-y-3 border ${cat.border} bg-gradient-to-br ${cat.color} backdrop-blur-xl overflow-hidden flex flex-col items-center shadow-lg hover:shadow-2xl`}
          >
            {/* Animated Inner Glow */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* Icon Container with Floating Effect */}
            <div className={`relative z-10 w-20 h-20 mb-6 flex items-center justify-center rounded-3xl bg-slate-950/50 border border-white/5 shadow-inner transition-all duration-700 group-hover:scale-110 group-hover:rotate-[10deg] ${cat.text}`}>
              {cat.icon}
            </div>

            <div className="relative z-10 text-center">
              <span className="text-[11px] font-black text-slate-400 group-hover:text-white uppercase tracking-[0.2em] transition-colors duration-500">
                {cat.name}
              </span>
            </div>
            
            {/* Decorative Geometric Element */}
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/5 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all duration-700"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryList;