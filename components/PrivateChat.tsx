
import React, { useState, useEffect, useRef } from 'react';
import { AuraObject, ChatMessage } from '../types';
import { getObjectChatResponse } from '../geminiService';
import { Icons } from './Icons';

interface PrivateChatProps {
  objects: AuraObject[];
  initialSelectedId: string;
  onAddMemory: (objectId: string, content: string) => void;
  onUpdateMotto: (objectId: string, motto: string) => void;
}

const PrivateChat: React.FC<PrivateChatProps> = ({ objects, initialSelectedId, onAddMemory, onUpdateMotto }) => {
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeObject = objects.find(o => o.id === initialSelectedId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !activeObject) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'user',
      text: input,
      timestamp: Date.now()
    };

    const currentChatMsgs = messages[activeObject.id] || [];
    const newMsgs = { ...messages, [activeObject.id]: [...currentChatMsgs, userMsg] };
    setMessages(newMsgs);
    setInput('');
    setIsTyping(true);

    if (window.navigator.vibrate) window.navigator.vibrate(10);

    const history = newMsgs[activeObject.id].slice(-10).map(m => ({
      role: (m.senderId === 'user' ? 'user' : 'model') as 'user' | 'model',
      text: m.text
    }));

    try {
      const response = await getObjectChatResponse(
        activeObject,
        history,
        activeObject.memories.map(m => m.content)
      );

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: activeObject.id,
        text: response.text,
        timestamp: Date.now()
      };

      setMessages(prev => ({
        ...prev,
        [activeObject.id]: [...(prev[activeObject.id] || []), botMsg]
      }));

      if (response.newMotto) {
        onUpdateMotto(activeObject.id, response.newMotto);
      }
      
      if (input.length > 30) {
        onAddMemory(activeObject.id, `Shared: ${input}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  if (!activeObject) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-280px)] animate-fade-in">
      <div className="flex items-center gap-4 pb-6 border-b border-gray-50 mb-4">
        <img src={activeObject.imageUrl} className="w-14 h-14 rounded-full object-cover shadow-md border-2 border-white" alt="" />
        <div>
          <h3 className="font-bold text-gray-800">{activeObject.name}</h3>
          <p className="text-[9px] text-green-500 font-bold uppercase tracking-widest">Resonating</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 px-1 no-scrollbar py-2">
        {(messages[initialSelectedId] || []).map(msg => (
          <div key={msg.id} className={`flex ${msg.senderId === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-5 py-3 rounded-[28px] shadow-sm ${
              msg.senderId === 'user' 
                ? 'bg-[#007AFF] text-white rounded-br-none' 
                : 'bg-[#F0F2F5] text-gray-700 rounded-bl-none'
            }`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <span className="text-[8px] opacity-40 mt-1 block uppercase font-bold tracking-tighter">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#F0F2F5] px-5 py-3 rounded-[28px] rounded-bl-none flex gap-1">
              <div className="w-1.5 h-1.5 bg-[#007AFF] rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-[#007AFF] rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-[#007AFF] rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <div className="flex-1 glass rounded-full flex items-center px-6 border border-gray-100 shadow-sm focus-within:ring-2 focus-within:ring-[#007AFF22]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Whisper..."
            className="flex-1 py-4 bg-transparent focus:outline-none text-sm"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90 ${
            input.trim() ? 'bg-[#007AFF] text-white' : 'bg-gray-100 text-gray-300'
          }`}
        >
          <Icons.Plus />
        </button>
      </div>
    </div>
  );
};

export default PrivateChat;
