
import React, { useState } from 'react';
import { AuraObject, SocialPost, SocialComment } from '../types';
import { getSocialComment } from '../geminiService';

interface LifeStreamProps {
  objects: AuraObject[];
}

const LifeStream: React.FC<LifeStreamProps> = ({ objects }) => {
  const [posts, setPosts] = useState<SocialPost[]>([
    { 
      id: '1', 
      author: 'user', 
      content: 'Morning with the window open. Finally feeling the spring air.', 
      emotion: 'Hopeful',
      timestamp: Date.now() - 3600000, 
      tags: ['Daily'],
      comments: [
        { id: 'c1', objectId: objects[0]?.id || '1', text: 'The light is hitting your desk perfectly today.', timestamp: Date.now() - 1800000 }
      ]
    }
  ]);
  const [newPostText, setNewPostText] = useState('');
  const [emotion, setEmotion] = useState('Neutral');
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async () => {
    if (!newPostText.trim()) return;
    setIsPosting(true);

    const post: SocialPost = {
      id: Date.now().toString(),
      author: 'user',
      content: newPostText,
      emotion: emotion,
      timestamp: Date.now(),
      tags: ['Instant'],
      comments: []
    };

    setPosts(prev => [post, ...prev]);
    setNewPostText('');
    setEmotion('Neutral');

    // Simulate real-human logic: delay responses
    const selectedPals = [...objects].sort(() => 0.5 - Math.random()).slice(0, Math.min(objects.length, 3));
    
    selectedPals.forEach((pal, idx) => {
      setTimeout(async () => {
        const commentText = await getSocialComment(
          pal.name,
          pal.persona,
          post.content,
          pal.memories.map(m => m.content)
        );

        const newComment: SocialComment = {
          id: Math.random().toString(),
          objectId: pal.id,
          text: commentText,
          timestamp: Date.now()
        };

        setPosts(prev => prev.map(p => p.id === post.id ? { ...p, comments: [...p.comments, newComment] } : p));
      }, 5000 + (idx * 15000)); // Staggered responses
    });

    setIsPosting(false);
  };

  return (
    <div className="space-y-8 pb-20 animate-fade-in">
      <div className="glass p-6 rounded-[32px] shadow-lg border border-white/50 space-y-6">
        <textarea
          placeholder="Share a moment with your Pals..."
          className="w-full bg-transparent border-none focus:outline-none resize-none text-sm placeholder:text-gray-300"
          rows={3}
          value={newPostText}
          onChange={(e) => setNewPostText(e.target.value)}
        />
        
        <div className="flex items-center gap-4 border-y border-gray-50 py-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Emotion</span>
          <div className="flex-1 flex gap-2">
            {['Blue', 'Neutral', 'Warm', 'Electric'].map(e => (
              <button 
                key={e} 
                onClick={() => setEmotion(e)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${emotion === e ? 'bg-[#EBF5FF] text-[#007AFF]' : 'text-gray-300'}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs">📸</button>
            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs">🏷️</button>
          </div>
          <button
            onClick={handlePost}
            disabled={isPosting || !newPostText.trim()}
            className="px-8 py-2.5 bg-[#007AFF] text-white text-xs font-bold rounded-full shadow-md active:scale-95 transition-all"
          >
            {isPosting ? 'RELEASING...' : 'POST'}
          </button>
        </div>
      </div>

      <div className="space-y-12">
        {posts.map(post => (
          <div key={post.id} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#007AFF] font-bold border-2 border-white shadow-sm">U</div>
              <div>
                <h4 className="text-sm font-bold">Self</h4>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-300">{new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {post.emotion && <span className="text-[10px] bg-blue-50 text-[#007AFF] px-2 rounded-full font-bold">{post.emotion}</span>}
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-800 leading-relaxed font-medium pl-1">
              {post.content}
            </p>

            {/* Comments Matrix */}
            <div className="pl-4 space-y-6 border-l-2 border-blue-50 ml-4 py-1">
              {post.comments.map(comm => {
                const pal = objects.find(o => o.id === comm.objectId);
                return (
                  <div key={comm.id} className="space-y-2 group">
                    <div className="flex items-center gap-2">
                      <img src={pal?.imageUrl} className="w-6 h-6 rounded-full object-cover shadow-sm border border-white" alt="" />
                      <span className="text-[10px] font-bold text-gray-900">{pal?.name}</span>
                      <span className="text-[9px] text-gray-300">• {pal?.persona.relation}</span>
                    </div>
                    <div className="bg-[#F8F9FA] p-4 rounded-[20px] rounded-tl-none relative border border-white shadow-sm">
                      <p className="text-xs text-gray-600 leading-snug">"{comm.text}"</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LifeStream;
