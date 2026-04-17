
import React, { useState } from 'react';
import { AuraObject } from '../types';

interface HomeViewProps {
  objects: AuraObject[];
  onSelectPal: (obj: AuraObject) => void;
  onAddPal: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ objects, onSelectPal, onAddPal }) => {
  const [activeCat, setActiveCat] = useState('Mundane');

  const categories = {
    Mundane: [
      { title: "A Glass of Wine", subtitle: "The Unflinching Rea...", icon: "🍷" },
      { title: "A Coffee Cup", subtitle: "The Morning Catalyst", icon: "☕" },
      { title: "A Lamp", subtitle: "The Twilight Philoso...", icon: "🏮" },
      { title: "A Pillow", subtitle: "The Dream Interpreter", icon: "☁️" },
    ],
    Nature: [
      { title: "An Owl", subtitle: "The Nocturnal Philo...", icon: "🦉" },
      { title: "A Plant", subtitle: "The Self-Care Speci...", icon: "🪴" },
      { title: "A Leaf", subtitle: "The Ephemeral Poet", icon: "🍃" },
      { title: "The Moon", subtitle: "The Constant Witne...", icon: "🌙" },
    ],
    Archetype: [
      { title: "The Sword", subtitle: "The Sharp Witness", icon: "🗡️" },
      { title: "The Key", subtitle: "The Secret Keeper", icon: "🔑" },
    ],
    Creative: [
      { title: "A Painting", subtitle: "The Silent Curator", icon: "🖼️" },
      { title: "A Doodle", subtitle: "The Subconscious M...", icon: "🌀" },
    ]
  };

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      <section className="space-y-4">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">My Pals</h2>
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
          {/* Add Pal Circle */}
          <button 
            onClick={onAddPal}
            className="flex-shrink-0 flex flex-col items-center gap-2 group"
          >
            <div className="w-16 h-16 rounded-full bg-[#EBF5FF] border-2 border-dashed border-[#007AFF] flex items-center justify-center text-[#007AFF] text-2xl group-active:scale-90 transition-transform shadow-sm">
              +
            </div>
            <span className="text-[10px] font-bold text-[#007AFF]">New Pal</span>
          </button>

          {/* Pal Circles */}
          {objects.map(pal => (
            <button
              key={pal.id}
              onClick={() => onSelectPal(pal)}
              className="flex-shrink-0 flex flex-col items-center gap-2 group"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md group-active:scale-95 transition-all">
                <img src={pal.imageUrl} className="w-full h-full object-cover" alt="" />
              </div>
              <span className="text-[10px] font-bold text-gray-800 max-w-[64px] truncate">{pal.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Try these ideas!</h2>
        
        {/* Category Selector */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {Object.keys(categories).map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCat(cat)}
              className={`px-6 py-2 rounded-full text-xs font-bold border transition-all ${
                activeCat === cat 
                ? 'bg-[#007AFF] text-white border-transparent shadow-lg' 
                : 'bg-white text-gray-400 border-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Idea Grid */}
        <div className="grid grid-cols-2 gap-4">
          {(categories as any)[activeCat].map((idea: any, idx: number) => (
            <button 
              key={idx} 
              onClick={onAddPal}
              className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4 flex flex-col items-center text-center hover:bg-[#EBF5FF55] transition-colors"
            >
              <span className="text-4xl filter drop-shadow-sm">{idea.icon}</span>
              <div>
                <h4 className="font-bold text-sm text-gray-800">{idea.title}</h4>
                <p className="text-[10px] text-gray-400">{idea.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeView;
