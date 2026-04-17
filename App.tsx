
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import SoulBindingEngine from './components/SoulBindingEngine';
import PrivateChat from './components/PrivateChat';
import HomeView from './components/HomeView';
import PalDetailView from './components/PalDetailView';
import ProfileView from './components/ProfileView';
import ChatView from './components/ChatView';
import LifeStream from './components/LifeStream';
import WorkshopView from './components/WorkshopView';
import { AuraObject, AuraTask, UserProfile, Chatroom, ChatMessage } from './types';
import { getObjectChatResponse } from './geminiService';
// Fix: Added missing Icons import to resolve ReferenceErrors
import { Icons } from './components/Icons';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home'); 
  const [subView, setSubView] = useState<'main' | 'binding' | 'detail' | 'chat_dialog' | 'room_dialog'>('main');
  const [selectedPalId, setSelectedPalId] = useState<string | null>(null);
  const [activeChatPalId, setActiveChatPalId] = useState<string | null>(null);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [objects, setObjects] = useState<AuraObject[]>([]);
  const [tasks, setTasks] = useState<AuraTask[]>([]);
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [profile, setProfile] = useState<UserProfile>({
    nickname: 'Human',
    pronoun: 'she/her',
    birthday: '',
    bio: '',
    preferences: { language: 'English', notifications: true, quietTime: '01:00 - 09:00' }
  });

  useEffect(() => {
    const savedObjs = localStorage.getItem('aura_objects');
    const savedTasks = localStorage.getItem('aura_tasks');
    const savedProfile = localStorage.getItem('aura_profile');
    const savedRooms = localStorage.getItem('aura_rooms');
    if (savedObjs) setObjects(JSON.parse(savedObjs));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedRooms) setChatrooms(JSON.parse(savedRooms));
  }, []);

  useEffect(() => {
    localStorage.setItem('aura_objects', JSON.stringify(objects));
    localStorage.setItem('aura_tasks', JSON.stringify(tasks));
    localStorage.setItem('aura_profile', JSON.stringify(profile));
    localStorage.setItem('aura_rooms', JSON.stringify(chatrooms));
  }, [objects, tasks, profile, chatrooms]);

  const handleBound = (obj: AuraObject) => {
    setObjects(prev => [...prev, obj]);
    setSubView('main');
  };

  const updatePal = (id: string, updates: Partial<AuraObject>) => {
    setObjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePal = (id: string) => {
    setObjects(prev => prev.filter(p => p.id !== id));
    setSubView('main');
  };

  const addPalMemory = (id: string, content: string, imageUrl?: string) => {
    setObjects(prev => prev.map(p => {
      if (p.id === id) {
        return { 
          ...p, 
          memories: [{ id: Date.now().toString(), timestamp: Date.now(), content, imageUrl, type: 'EP' }, ...p.memories] 
        };
      }
      return p;
    }));
  };

  const sendRoomMessage = async (roomId: string, text: string) => {
    const room = chatrooms.find(r => r.id === roomId);
    if (!room) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), senderId: 'user', senderName: profile.nickname, text, timestamp: Date.now() };
    setChatrooms(prev => prev.map(r => r.id === roomId ? { ...r, messages: [...r.messages, userMsg] } : r));

    // Simple Group AI logic
    const replierId = room.pals[Math.floor(Math.random() * room.pals.length)];
    const replier = objects.find(o => o.id === replierId);
    if (replier) {
      const aiRes = await getObjectChatResponse(replier, [{role: 'user', text}], []);
      const botMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        senderId: replierId, 
        senderName: replier.name, 
        text: aiRes.text, 
        timestamp: Date.now() 
      };
      setChatrooms(prev => prev.map(r => r.id === roomId ? { ...r, messages: [...r.messages, botMsg] } : r));
    }
  };

  const selectedPal = objects.find(o => o.id === selectedPalId);
  const activeRoom = chatrooms.find(r => r.id === activeRoomId);

  const renderContent = () => {
    if (subView === 'binding') return <SoulBindingEngine onBound={handleBound} onCancel={() => setSubView('main')} />;
    
    if (subView === 'detail' && selectedPal) {
      return (
        <PalDetailView 
          pal={selectedPal} 
          onBack={() => setSubView('main')} 
          onDelete={deletePal}
          onUpdate={updatePal}
          onAddMemory={(id) => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.onchange = (e: any) => {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.onloadend = () => addPalMemory(id, "Added memory photo", reader.result as string);
              reader.readAsDataURL(file);
            };
            fileInput.click();
          }}
          onChat={() => {
            setActiveChatPalId(selectedPal.id);
            setSubView('chat_dialog');
          }} 
        />
      );
    }

    if (subView === 'chat_dialog' && activeChatPalId) {
      return (
        <div className="flex flex-col h-full animate-fade-in">
          <button onClick={() => setSubView('main')} className="py-6"><Icons.Back /></button>
          <PrivateChat 
            objects={objects} 
            initialSelectedId={activeChatPalId}
            onAddMemory={addPalMemory}
            onUpdateMotto={(id, motto) => updatePal(id, { motto })}
          />
        </div>
      );
    }

    if (subView === 'room_dialog' && activeRoom) {
      return (
        <div className="flex flex-col h-full animate-fade-in">
          <button onClick={() => setSubView('main')} className="py-6"><Icons.Back /></button>
          <div className="flex-1 flex flex-col h-[calc(100vh-280px)]">
             <div className="pb-6 border-b mb-4">
                <h2 className="text-xl font-bold">{activeRoom.name}</h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{activeRoom.topic}</p>
             </div>
             <div className="flex-1 overflow-y-auto space-y-6 no-scrollbar">
                {activeRoom.messages.map(m => (
                  <div key={m.id} className={`flex ${m.senderId === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] px-5 py-3 rounded-[28px] ${m.senderId === 'user' ? 'bg-[#007AFF] text-white rounded-br-none' : 'bg-gray-100 text-gray-700 rounded-bl-none'}`}>
                      <p className="text-[10px] opacity-60 font-bold uppercase mb-1">{m.senderName}</p>
                      <p className="text-sm leading-relaxed">{m.text}</p>
                    </div>
                  </div>
                ))}
             </div>
             <div className="mt-6 flex gap-3">
                <input 
                  className="flex-1 glass rounded-full px-6 py-4 text-sm focus:outline-none border border-gray-100" 
                  placeholder="Cast a thought..." 
                  onKeyDown={e => { if(e.key === 'Enter') { sendRoomMessage(activeRoom.id, (e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = ''; } }}
                />
             </div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return <HomeView objects={objects} onSelectPal={p => { setSelectedPalId(p.id); setSubView('detail'); }} onAddPal={() => setSubView('binding')} />;
      case 'chat':
        return <ChatView objects={objects} chatrooms={chatrooms} onStartChatroom={r => setChatrooms(prev => [r, ...prev])} onEnterPrivateChat={id => { setActiveChatPalId(id); setSubView('chat_dialog'); }} onEnterChatroom={id => { setActiveRoomId(id); setSubView('room_dialog'); }} />;
      case 'stream':
        return <LifeStream objects={objects} />;
      case 'workshop':
        return <WorkshopView objects={objects} tasks={tasks} onAddTask={t => setTasks(prev => [t, ...prev])} onUpdateTask={(id, s) => setTasks(prev => prev.map(t => t.id === id ? {...t, status: s} : t))} />;
      case 'settings':
        return <ProfileView profile={profile} setProfile={setProfile} />;
      default:
        return null;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); setSubView('main'); }}>
      {renderContent()}
    </Layout>
  );
};

export default App;
