
import React, { useState } from 'react';
import { AuraObject, AuraTask } from '../types';

interface MissionCenterProps {
  objects: AuraObject[];
  tasks: AuraTask[];
  onAddTask: (task: AuraTask) => void;
  onUpdateTask: (id: string, status: 'completed' | 'failed') => void;
}

const MissionCenter: React.FC<MissionCenterProps> = ({ objects, tasks, onAddTask, onUpdateTask }) => {
  const [goal, setGoal] = useState('');
  const [assignedId, setAssignedId] = useState(objects[0]?.id || '');
  const [isCreating, setIsCreating] = useState(false);

  const activeObj = objects.find(o => o.id === assignedId);

  const createTask = () => {
    if (!goal || !assignedId) return;
    setIsCreating(true);
    setTimeout(() => {
      const newTask: AuraTask = {
        id: Date.now().toString(),
        goal,
        deadline: Date.now() + 86400000,
        assignedObjectId: assignedId,
        status: 'pending'
      };
      onAddTask(newTask);
      setGoal('');
      setIsCreating(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Missions</h2>
        <button className="text-2xl text-gray-400">✕</button>
      </div>

      <div className="glass p-8 rounded-[32px] border border-blue-50 relative overflow-hidden min-h-[300px]">
        <div className="space-y-2">
          <p className="text-[#007AFF] text-sm">
            <span className="font-bold">@{activeObj?.name || 'A Pal'}</span> Daily Contract:
          </p>
          <textarea
            value={goal}
            onChange={e => setGoal(e.target.value)}
            placeholder="will remind me to..."
            className="w-full bg-transparent text-xl font-medium border-none focus:outline-none resize-none h-32 placeholder:text-gray-300"
          />
        </div>

        <div className="flex justify-center my-6">
          <div className="w-8 h-8 rounded-full border border-blue-100 flex items-center justify-center text-blue-400 animate-spin">
            🔄
          </div>
        </div>

        <div className="bg-[#F8F9FA] rounded-2xl p-4 flex items-center gap-3 border border-gray-100">
           <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
             {activeObj?.imageUrl && <img src={activeObj.imageUrl} className="w-full h-full object-cover" alt="" />}
           </div>
           <div>
             <p className="text-xs font-bold text-gray-600">{goal || 'Your Mission Goal'}</p>
             <p className="text-[10px] text-gray-400 tracking-tight">Contract with {activeObj?.name}</p>
           </div>
        </div>
      </div>

      <button
        onClick={createTask}
        disabled={isCreating || !goal}
        className={`w-full py-5 rounded-full text-white font-bold tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all ${
          isCreating ? 'bg-[#007AFF] opacity-80' : 'bg-[#007AFF] active:scale-95'
        }`}
      >
        {isCreating ? (
          <>
            <span className="animate-spin text-sm">💠</span>
            Creating Mission...
          </>
        ) : 'START MISSION'}
      </button>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active Bonds</h3>
        {tasks.filter(t => t.status === 'pending').map(task => {
          const obj = objects.find(o => o.id === task.assignedObjectId);
          return (
            <div key={task.id} className="glass p-5 rounded-[24px] flex justify-between items-center group shadow-sm border border-white/60">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  <img src={obj?.imageUrl} className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{task.goal}</p>
                  <p className="text-[10px] text-blue-500 font-semibold uppercase tracking-tighter">{obj?.name}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onUpdateTask(task.id, 'completed')} className="w-8 h-8 rounded-full bg-blue-50 text-[#007AFF] text-xs font-bold">✓</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MissionCenter;
