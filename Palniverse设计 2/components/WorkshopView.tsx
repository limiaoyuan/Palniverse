
import React, { useState } from 'react';
import { AuraObject, AuraTask } from '../types';
import NexusGraph from './NexusGraph';
import MissionCenter from './MissionCenter';
import { getDivination } from '../geminiService';
import { Icons } from './Icons';

interface WorkshopViewProps {
  objects: AuraObject[];
  tasks: AuraTask[];
  onUpdateTask: (id: string, s: 'completed' | 'failed') => void;
  onAddTask: (t: AuraTask) => void;
}

const WorkshopView: React.FC<WorkshopViewProps> = ({ objects, tasks, onUpdateTask, onAddTask }) => {
  const [activeFeature, setActiveFeature] = useState<'hub' | 'nexus' | 'missions' | 'divination' | 'gallery'>('hub');
  const [divinationQuestion, setDivinationQuestion] = useState('');
  const [divinationResult, setDivinationResult] = useState('');
  const [isDivining, setIsDivining] = useState(false);
  const [selectedPalId, setSelectedPalId] = useState(objects[0]?.id || '');

  const FeatureHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
    <div className="pt-4 pb-10 space-y-1">
      <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">{subtitle}</p>
    </div>
  );

  if (activeFeature === 'nexus') return (
    <div className="animate-fade-in">
      <button onClick={() => setActiveFeature('hub')} className="py-6"><Icons.Back /></button>
      <FeatureHeader title="Nexus" subtitle="Relationship Topology" />
      <NexusGraph objects={objects} />
    </div>
  );

  if (activeFeature === 'missions') return (
    <div className="animate-fade-in">
      <button onClick={() => setActiveFeature('hub')} className="py-6"><Icons.Back /></button>
      <FeatureHeader title="Contracts" subtitle="Emotional Commitment" />
      <MissionCenter objects={objects} tasks={tasks} onAddTask={onAddTask} onUpdateTask={onUpdateTask} />
    </div>
  );

  if (activeFeature === 'divination') return (
    <div className="animate-fade-in">
      <button onClick={() => setActiveFeature('hub')} className="py-6"><Icons.Back /></button>
      <FeatureHeader title="Mystic" subtitle="Narrative Path" />
      <div className="glass p-8 rounded-[40px] space-y-6 border border-white shadow-xl">
        <select 
          value={selectedPalId} 
          onChange={(e) => setSelectedPalId(e.target.value)}
          className="w-full p-4 rounded-2xl bg-[#F8F9FA] border-none text-xs font-bold uppercase tracking-widest"
        >
          {objects.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
        <textarea 
          placeholder="What do you seek?"
          value={divinationQuestion}
          onChange={(e) => setDivinationQuestion(e.target.value)}
          className="w-full p-6 rounded-[28px] bg-[#F8F9FA] border-none text-sm min-h-[120px] focus:ring-2 focus:ring-blue-100"
        />
        <button 
          onClick={async () => {
            const pal = objects.find(o => o.id === selectedPalId);
            if (!pal) return;
            setIsDivining(true);
            const res = await getDivination(pal, divinationQuestion);
            setDivinationResult(res);
            setIsDivining(false);
          }}
          disabled={isDivining || !divinationQuestion}
          className="w-full py-5 bg-[#007AFF] text-white rounded-full font-bold uppercase tracking-widest shadow-xl active:scale-95 transition-all"
        >
          {isDivining ? 'REVEALING...' : 'ASK ORACLE'}
        </button>
      </div>
      {divinationResult && (
        <div className="mt-8 bg-blue-50/30 p-8 rounded-[32px] italic text-sm text-gray-700 leading-relaxed border border-blue-50">
          "{divinationResult}"
        </div>
      )}
    </div>
  );

  if (activeFeature === 'gallery') return (
    <div className="animate-fade-in">
      <button onClick={() => setActiveFeature('hub')} className="py-6"><Icons.Back /></button>
      <FeatureHeader title="Gallery" subtitle="Memory Echoes" />
      <div className="grid grid-cols-1 gap-4">
        {objects.flatMap(o => o.memories).map(m => (
          <div key={m.id} className="bg-[#F8F9FA] p-5 rounded-[32px] flex items-center gap-4 shadow-sm border border-gray-50">
             {m.imageUrl && <img src={m.imageUrl} className="w-16 h-16 rounded-2xl object-cover" />}
             <div>
               <p className="text-xs font-bold text-gray-800">{m.content}</p>
               <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">{new Date(m.timestamp).toLocaleDateString()}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-12 animate-fade-in pb-32">
      <div className="text-center py-12 space-y-2">
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Workshop</h2>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em]">Soul Interaction Hub</p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {[
          { id: 'nexus', title: 'Nexus', sub: 'Social Topology', icon: <Icons.World /> },
          { id: 'missions', title: 'Contracts', sub: 'Emotional Ties', icon: <Icons.Plus /> },
          { id: 'divination', title: 'Mystic', sub: 'Narrative Insight', icon: <Icons.Stream /> },
          { id: 'gallery', title: 'Gallery', sub: 'Echo Archive', icon: <Icons.Chat /> },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFeature(f.id as any)}
            className="glass p-8 rounded-[40px] flex items-center gap-8 text-left hover:bg-blue-50/40 transition-all border border-white shadow-xl group"
          >
            <div className="w-14 h-14 rounded-[20px] bg-white flex items-center justify-center text-[#007AFF] shadow-md group-hover:scale-110 transition-transform">
              {f.icon}
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900">{f.title}</h3>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">{f.sub}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WorkshopView;
