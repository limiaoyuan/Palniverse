
import React, { useState } from 'react';
import { generateObjectSoul } from '../geminiService';
import { AuraObject } from '../types';
import { Icons } from './Icons';

interface SoulBindingEngineProps {
  onBound: (obj: AuraObject) => void;
  onCancel: () => void;
}

const SoulBindingEngine: React.FC<SoulBindingEngineProps> = ({ onBound, onCancel }) => {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [binding, setBinding] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const bindSoul = async () => {
    if (!image || !description || !name) return;
    setBinding(true);
    
    const b64 = image.split(',')[1];
    try {
      const soulData = await generateObjectSoul(b64, description);

      const newObj: AuraObject = {
        id: Math.random().toString(36).substr(2, 9),
        palNum: Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
        name,
        title: soulData.persona.attitude.split(' ').slice(0, 2).join(' '),
        imageUrl: image,
        bio: description,
        description,
        motto: soulData.motto,
        persona: soulData.persona,
        energyLevel: 100,
        relationshipScore: 10,
        memories: [{ id: 'init', timestamp: Date.now(), content: `Awakened into Palniverse.`, type: 'EP' }],
        facts: soulData.facts,
        createdAt: Date.now()
      };

      onBound(newObj);
    } catch (err) {
      console.error(err);
    } finally {
      setBinding(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-32">
      <button onClick={onCancel} className="py-6"><Icons.Back /></button>
      
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Initiate Soul Binding</h2>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Capturing Reality</p>
      </div>

      <div className="flex flex-col items-center">
        <label className="w-full aspect-square glass border-2 border-dashed border-blue-100 rounded-[40px] flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/20 transition-all overflow-hidden relative shadow-xl">
          {image ? (
            <img src={image} className="w-full h-full object-cover" alt="Portrait" />
          ) : (
            <div className="flex flex-col items-center text-gray-300 gap-4">
              <Icons.Camera />
              <span className="text-xs font-bold uppercase tracking-widest">Portrait Capture</span>
            </div>
          )}
          <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
        </label>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-md overflow-hidden p-2">
          <input
            type="text"
            placeholder="Name your Companion..."
            className="w-full px-8 py-5 text-sm font-bold focus:outline-none placeholder:text-gray-300"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="h-px bg-gray-50 mx-8"></div>
          <textarea
            placeholder="Describe its origin or a shared memory..."
            rows={5}
            className="w-full px-8 py-6 text-sm focus:outline-none resize-none placeholder:text-gray-300 leading-relaxed"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <button
        disabled={binding || !image || !description || !name}
        onClick={bindSoul}
        className={`w-full py-6 rounded-full text-white font-bold tracking-[0.2em] transition-all duration-500 shadow-2xl uppercase ${
          binding ? 'bg-gray-200' : 'bg-[#007AFF] active:scale-95'
        }`}
      >
        {binding ? 'WAKING SOUL...' : 'INITIATE BINDING'}
      </button>
    </div>
  );
};

export default SoulBindingEngine;
