
import React, { useState } from 'react';
import { AuraObject, Chatroom, ChatMessage } from '../types';
import { Icons } from './Icons';

interface ChatViewProps {
  objects: AuraObject[];
  chatrooms: Chatroom[];
  onStartChatroom: (chatroom: Chatroom) => void;
  onEnterPrivateChat: (id: string) => void;
  onEnterChatroom: (id: string) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ objects, chatrooms, onStartChatroom, onEnterPrivateChat, onEnterChatroom }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [selectedPals, setSelectedPals] = useState<string[]>([]);

  const togglePal = (id: string) => {
    setSelectedPals(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const handleCreate = () => {
    if (!newName || selectedPals.length < 2) return;
    const room: Chatroom = {
      id: Date.now().toString(),
      name: newName,
      pals: selectedPals,
      topic: newTopic,
      messages: []
    };
    onStartChatroom(room);
    setIsCreating(false);
    setSelectedPals([]);
    setNewName('');
    setNewTopic('');
  };

  return (
    <div className="space-y-8 pb-32 animate-fade-in pt-4">
      <div className="flex justify-between items-center bg-blue-50/20 p-6 rounded-[32px] border border-blue-50 shadow-sm">
        <div className="space-y-1">
          <h2 className="font-bold text-gray-800">Theaters</h2>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Object Collective</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="w-12 h-12 rounded-full bg-[#007AFF] text-white flex items-center justify-center shadow-xl active:scale-90 transition-all"
        >
          <Icons.Plus />
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-2">Solo Links</h3>
        {objects.length === 0 ? (
          <p className="text-xs text-gray-300 p-4 italic">No active souls...</p>
        ) : objects.map(pal => (
          <div 
            key={pal.id} 
            onClick={() => onEnterPrivateChat(pal.id)}
            className="flex items-center gap-4 p-5 rounded-[32px] hover:bg-gray-50 active:scale-98 transition-all cursor-pointer group shadow-sm border border-transparent hover:border-gray-100 bg-white"
          >
            <div className="relative">
              <img src={pal.imageUrl} className="w-14 h-14 rounded-full object-cover shadow-md border-2 border-white" alt="" />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-bold text-sm text-gray-800">{pal.name}</h4>
                <span className="text-[9px] text-gray-300 font-bold">NOW</span>
              </div>
              <p className="text-xs text-gray-400 truncate w-48 italic">"{pal.motto}"</p>
            </div>
          </div>
        ))}
      </div >

      {chatrooms.length > 0 && (
         <div className="space-y-4">
           <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-2">Theater Logs</h3>
           {chatrooms.map(room => (
             <div 
              key={room.id} 
              onClick={() => onEnterChatroom(room.id)}
              className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-md flex items-center gap-5 active:scale-95 transition-all cursor-pointer hover:border-blue-100"
             >
               <div className="flex -space-x-5">
                 {room.pals.slice(0, 3).map(pid => (
                   <img key={pid} src={objects.find(o => o.id === pid)?.imageUrl} className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" alt="" />
                 ))}
               </div>
               <div className="flex-1">
                 <h4 className="text-sm font-bold text-gray-800">{room.name}</h4>
                 <p className="text-[10px] text-[#007AFF] font-bold uppercase tracking-widest">{room.pals.length} Souls Discussing "{room.topic.slice(0, 12)}..."</p>
               </div>
             </div>
           ))}
         </div>
      )}

      {isCreating && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end">
          <div className="w-full bg-white rounded-t-[50px] p-10 space-y-8 animate-slide-up shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">Theater Initiation</h3>
              <button onClick={() => setIsCreating(false)} className="text-gray-300"><Icons.Back /></button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Theater Name</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="E.g. The Quiet Archive"
                  className="w-full bg-[#F8F9FA] px-6 py-4 rounded-2xl focus:outline-none text-sm font-bold shadow-inner"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cast Members ({selectedPals.length}/6)</label>
                <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
                  {objects.map(pal => (
                    <button 
                      key={pal.id} 
                      onClick={() => togglePal(pal.id)}
                      className="flex-shrink-0 flex flex-col items-center gap-2"
                    >
                      <div className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all ${selectedPals.includes(pal.id) ? 'border-[#007AFF] p-1 scale-110 shadow-lg' : 'border-transparent opacity-40'}`}>
                        <img src={pal.imageUrl} className="w-full h-full rounded-full object-cover" alt="" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-tighter">{pal.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Discussion Focus</label>
                <textarea 
                  value={newTopic}
                  onChange={e => setNewTopic(e.target.value)}
                  placeholder="A gathering to discuss the nature of light..."
                  className="w-full bg-[#F8F9FA] p-6 rounded-[28px] focus:outline-none text-sm min-h-[100px] shadow-inner resize-none"
                />
              </div>

              <button 
                onClick={handleCreate}
                disabled={!newName || selectedPals.length < 2}
                className={`w-full py-5 rounded-full text-white font-bold tracking-widest shadow-2xl transition-all uppercase ${!newName || selectedPals.length < 2 ? 'bg-gray-200' : 'bg-[#007AFF] active:scale-95'}`}
              >
                OPEN THEATER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatView;
