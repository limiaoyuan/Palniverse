
import React, { useState } from 'react';
import { AuraObject } from '../types';
import { Icons } from './Icons';

interface PalDetailViewProps {
  pal: AuraObject;
  onBack: () => void;
  onChat: () => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<AuraObject>) => void;
  onAddMemory: (id: string) => void;
}

const PalDetailView: React.FC<PalDetailViewProps> = ({ pal, onBack, onChat, onDelete, onUpdate, onAddMemory }) => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(pal.name);
  const [editBio, setEditBio] = useState(pal.bio);

  const handleSave = () => {
    onUpdate(pal.id, { name: editName, bio: editBio });
    setIsEditing(false);
  };

  return (
    <div className="animate-fade-in space-y-8 pb-32">
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors"
      >
        <Icons.Back />
        <span>BACK</span>
      </button>

      <div className="glass p-8 rounded-[40px] shadow-xl border border-white relative overflow-hidden bg-white/40">
        <div className="flex flex-col items-center gap-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl relative">
             <img src={pal.imageUrl} className="w-full h-full object-cover" alt="" />
             <button 
              onClick={onChat}
              className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#007AFF] text-white flex items-center justify-center shadow-lg border-2 border-white active:scale-90 transition-transform"
             >
               <Icons.Chat />
             </button>
          </div>
          
          <div className="text-center space-y-2 w-full">
            {isEditing ? (
              <input 
                className="text-2xl font-bold text-center w-full bg-blue-50/30 rounded-lg p-1 focus:outline-none border border-blue-100"
                value={editName}
                onChange={e => setEditName(e.target.value)}
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                {pal.name} 
                <button onClick={() => setIsEditing(true)} className="text-[#007AFF] opacity-50 hover:opacity-100">
                  <Icons.Edit />
                </button>
              </h2>
            )}
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">{pal.title}</p>
            
            <div className="pt-4 px-4">
               <div className="bg-[#EBF5FF55] p-5 rounded-[28px] relative italic text-xs font-medium text-[#007AFF] leading-relaxed shadow-sm">
                 "{pal.motto}"
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex bg-[#F8F9FA] p-1.5 rounded-full border border-gray-100">
        {['Profile', 'Memory', 'Connection'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 rounded-full text-[10px] font-bold transition-all uppercase tracking-widest ${
              activeTab === tab ? 'bg-white shadow-md text-[#007AFF]' : 'text-gray-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="animate-fade-in min-h-[300px]">
        {activeTab === 'Profile' && (
          <div className="space-y-8">
            <section className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bio</h3>
                {isEditing && <button onClick={handleSave} className="text-[10px] font-bold text-[#007AFF]">SAVE</button>}
              </div>
              <div className="bg-[#F8F9FA] p-6 rounded-[32px] border border-gray-50 shadow-inner">
                {isEditing ? (
                  <textarea 
                    className="w-full bg-transparent text-sm text-gray-600 leading-relaxed min-h-[100px] focus:outline-none"
                    value={editBio}
                    onChange={e => setEditBio(e.target.value)}
                  />
                ) : (
                  <p className="text-sm text-gray-600 leading-relaxed">{pal.bio}</p>
                )}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Facts</h3>
              <div className="flex flex-wrap gap-2">
                {pal.facts.map((fact, idx) => (
                  <span key={idx} className="px-4 py-2 bg-white rounded-full text-[10px] font-bold shadow-sm border border-gray-50 text-gray-600">
                    {fact}
                  </span>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'Memory' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gallery</h3>
              <button onClick={() => onAddMemory(pal.id)} className="text-[10px] font-bold text-[#007AFF]">+ ADD</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {pal.memories.map((m, i) => (
                <div key={i} className="aspect-square bg-[#F8F9FA] rounded-[32px] overflow-hidden border border-gray-50 relative group shadow-sm">
                  {m.imageUrl ? (
                    <img src={m.imageUrl} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300 font-bold uppercase p-4 text-center">
                      {m.content}
                    </div>
                  )}
                </div>
              ))}
              <button onClick={() => onAddMemory(pal.id)} className="aspect-square bg-blue-50/20 border-2 border-dashed border-blue-100 rounded-[32px] flex items-center justify-center text-[#007AFF]/20 transition-colors">
                <Icons.Plus />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'Connection' && (
          <div className="space-y-8">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Social Topology</h3>
            <div className="bg-[#F8F9FA] p-8 rounded-[40px] flex flex-col items-center gap-6 border border-gray-50 shadow-inner">
               <div className="w-48 h-48 rounded-full border border-blue-100 flex items-center justify-center relative">
                  <div className="w-24 h-24 rounded-full border-2 border-[#007AFF22] animate-ping absolute" />
                  <div className="w-4 h-4 rounded-full bg-[#007AFF] shadow-lg shadow-[#007AFF]/50 z-10" />
               </div>
               <div className="text-center space-y-1">
                 <p className="text-xs font-bold text-gray-800">Resonance Level: {pal.relationshipScore}%</p>
                 <p className="text-[9px] text-gray-400 uppercase tracking-widest">{pal.persona.relation} Phase</p>
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center pt-20">
        <button 
          onClick={() => { if(confirm('Erase this soul forever?')) onDelete(pal.id); }}
          className="text-red-400 text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity"
        >
          DELETE THIS PAL
        </button>
      </div>
    </div>
  );
};

export default PalDetailView;
