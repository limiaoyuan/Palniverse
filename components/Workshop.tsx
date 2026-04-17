
import React, { useState, useRef } from 'react';
import { AuraObject } from '../types';

interface WorkshopProps {
  objects: AuraObject[];
  onInteract: (objectId: string, energy: number) => void;
}

const Workshop: React.FC<WorkshopProps> = ({ objects, onInteract }) => {
  const [selectedId, setSelectedId] = useState<string | null>(objects[0]?.id || null);
  const [sparkles, setSparkles] = useState<{x: number, y: number, id: number}[]>([]);
  const [divination, setDivination] = useState<string | null>(null);
  const [isDivining, setIsDivining] = useState(false);
  
  const activeObject = objects.find(o => o.id === selectedId);

  const handleRub = (e: React.MouseEvent | React.TouchEvent) => {
    if (!activeObject) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const newSparkle = { x: clientX, y: clientY, id: Date.now() };
    setSparkles(prev => [...prev.slice(-20), newSparkle]);
    
    // Low chance to boost energy on move
    if (Math.random() > 0.95) {
      onInteract(activeObject.id, 1);
    }
  };

  const startDivination = () => {
    setIsDivining(true);
    setDivination(null);
    setTimeout(() => {
      const answers = [
        "The threads of time are weaving in your favor.",
        "Silence is your most powerful ally today.",
        "A connection lost will soon be refound.",
        "Your energy is clouded, seek clarity in still water.",
        "The object resonates with a warm future."
      ];
      setDivination(answers[Math.floor(Math.random() * answers.length)]);
      setIsDivining(false);
    }, 2000);
  };

  if (objects.length === 0) return <div className="p-8 text-center text-gray-400">Bind a soul first.</div>;

  return (
    <div className="space-y-6">
      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {objects.map(obj => (
          <button
            key={obj.id}
            onClick={() => { setSelectedId(obj.id); setDivination(null); }}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${selectedId === obj.id ? 'bg-[#007AFF] text-white shadow-lg' : 'glass text-gray-400'}`}
          >
            {obj.name}
          </button>
        ))}
      </div>

      <div 
        className="relative w-full h-[300px] glass rounded-[24px] overflow-hidden flex items-center justify-center cursor-crosshair group"
        onMouseMove={handleRub}
        onTouchMove={handleRub}
      >
        <img 
          src={activeObject?.imageUrl} 
          className="max-w-[70%] max-h-[70%] object-contain drop-shadow-2xl transition-transform duration-1000 group-hover:scale-105" 
          alt="Object" 
        />
        {sparkles.map(s => (
          <div 
            key={s.id} 
            className="absolute w-2 h-2 bg-blue-300 rounded-full animate-ping opacity-60"
            style={{ left: s.x % 300, top: s.y % 200 }} // Hacky positioning for demo
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-4 text-center w-full">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">Stroke to Resonate</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-4">
          <span className="text-xs text-gray-400">Energy Resonance</span>
          <span className="text-xs font-bold text-[#007AFF]">{activeObject?.energyLevel}%</span>
        </div>
        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#007AFF] transition-all duration-500" style={{ width: `${activeObject?.energyLevel}%` }}></div>
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={startDivination}
          disabled={isDivining}
          className="w-full py-4 glass text-[#007AFF] text-xs font-bold rounded-[24px] shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {isDivining ? 'CONSULTING NARRATIVE...' : '✨ OBJECT DIVINATION'}
        </button>
        
        {divination && (
          <div className="mt-4 p-6 glass border-l-4 border-[#007AFF] rounded-[24px] animate-fade-in">
            <p className="text-sm italic text-gray-600">"{divination}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workshop;
