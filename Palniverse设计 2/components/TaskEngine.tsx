
import React, { useState } from 'react';
import { AuraObject, AuraTask } from '../types';

interface TaskEngineProps {
  objects: AuraObject[];
  tasks: AuraTask[];
  onAddTask: (task: AuraTask) => void;
  onUpdateTask: (id: string, status: 'completed' | 'failed') => void;
}

const TaskEngine: React.FC<TaskEngineProps> = ({ objects, tasks, onAddTask, onUpdateTask }) => {
  const [goal, setGoal] = useState('');
  const [assignedId, setAssignedId] = useState(objects[0]?.id || '');

  const createTask = () => {
    if (!goal || !assignedId) return;
    const newTask: AuraTask = {
      id: Date.now().toString(),
      goal,
      deadline: Date.now() + 86400000, // 24h default
      assignedObjectId: assignedId,
      status: 'pending'
    };
    onAddTask(newTask);
    setGoal('');
  };

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-[24px] shadow-sm space-y-4">
        <h3 className="text-xs font-bold tracking-[0.2em] text-[#007AFF]">EMOTIONAL CONTRACT</h3>
        <input 
          type="text" 
          value={goal}
          onChange={e => setGoal(e.target.value)}
          placeholder="I commit to..."
          className="w-full bg-transparent border-b border-[#007AFF22] py-2 focus:outline-none text-sm"
        />
        <select 
          value={assignedId}
          onChange={e => setAssignedId(e.target.value)}
          className="w-full bg-transparent text-xs text-gray-500 focus:outline-none"
        >
          {objects.map(o => <option key={o.id} value={o.id}>Witnessed by {o.name}</option>)}
        </select>
        <button 
          onClick={createTask}
          className="w-full py-3 bg-[#007AFF] text-white text-xs font-bold rounded-full tracking-widest"
        >
          SEAL BINDING
        </button>
      </div>

      <div className="space-y-3">
        {tasks.map(task => {
          const obj = objects.find(o => o.id === task.assignedObjectId);
          return (
            <div key={task.id} className="glass p-4 rounded-[24px] flex justify-between items-center group">
              <div className="flex items-center gap-3">
                <img src={obj?.imageUrl} className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                <div>
                  <p className="text-sm font-medium">{task.goal}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Guarded by {obj?.name}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {task.status === 'pending' && (
                  <>
                    <button onClick={() => onUpdateTask(task.id, 'completed')} className="w-8 h-8 rounded-full bg-green-50 text-green-500 text-xs">✓</button>
                    <button onClick={() => onUpdateTask(task.id, 'failed')} className="w-8 h-8 rounded-full bg-red-50 text-red-500 text-xs">✕</button>
                  </>
                )}
                {task.status !== 'pending' && <span className={`text-[10px] font-bold ${task.status === 'completed' ? 'text-green-400' : 'text-red-400'}`}>{task.status.toUpperCase()}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskEngine;
