
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Icons } from './Icons';

interface ProfileViewProps {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile, setProfile }) => {
  const [avatar, setAvatar] = useState(profile.avatarUrl);

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        setProfile({ ...profile, avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in pb-32 pt-6 px-1">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative group cursor-pointer">
          <div className="w-32 h-32 rounded-full bg-[#F0F2F5] flex items-center justify-center overflow-hidden border-4 border-white shadow-2xl relative">
            {avatar ? <img src={avatar} className="w-full h-full object-cover" /> : <span className="opacity-20 text-6xl">👤</span>}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Icons.Camera />
            </div>
          </div>
          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleAvatar} />
        </div>
        <div className="text-center space-y-1">
           <h2 className="text-2xl font-bold">{profile.nickname}</h2>
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">User Identity</p>
        </div>
      </div>

      <div className="space-y-10">
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Settings</h3>
          <div className="bg-[#F8F9FA] rounded-[32px] overflow-hidden border border-gray-100 shadow-sm px-6">
            <div className="py-5 flex justify-between items-center border-b border-gray-100/50">
              <span className="text-gray-400 text-[10px] font-bold uppercase">Nickname</span>
              <input 
                className="text-sm font-bold bg-transparent text-right focus:outline-none text-[#007AFF]"
                value={profile.nickname}
                onChange={e => setProfile({...profile, nickname: e.target.value})}
              />
            </div>
            <div className="py-5 flex justify-between items-center border-b border-gray-100/50">
              <span className="text-gray-400 text-[10px] font-bold uppercase">Pronoun</span>
              <select 
                className="text-sm font-bold bg-transparent text-right focus:outline-none cursor-pointer text-[#007AFF]"
                value={profile.pronoun}
                onChange={e => setProfile({...profile, pronoun: e.target.value})}
              >
                <option value="he/him">he/him</option>
                <option value="she/her">she/her</option>
                <option value="they/them">they/them</option>
              </select>
            </div>
            <div className="py-5 flex justify-between items-center border-b border-gray-100/50">
              <span className="text-gray-400 text-[10px] font-bold uppercase">Birthday</span>
              <input 
                type="date"
                className="text-sm font-bold bg-transparent text-right focus:outline-none text-[#007AFF]"
                value={profile.birthday}
                onChange={e => setProfile({...profile, birthday: e.target.value})}
              />
            </div>
             <div className="py-5 flex justify-between items-center border-b border-gray-100/50">
              <span className="text-gray-400 text-[10px] font-bold uppercase">Language</span>
              <select 
                className="text-sm font-bold bg-transparent text-right focus:outline-none cursor-pointer text-[#007AFF]"
                value={profile.preferences.language}
                onChange={e => setProfile({...profile, preferences: {...profile.preferences, language: e.target.value as any}})}
              >
                <option value="English">English</option>
                <option value="Chinese">中文</option>
              </select>
            </div>
             <div className="py-5 flex justify-between items-center">
              <span className="text-gray-400 text-[10px] font-bold uppercase">Quiet Time</span>
              <input 
                className="text-sm font-bold bg-transparent text-right focus:outline-none text-[#007AFF]"
                value={profile.preferences.quietTime}
                onChange={e => setProfile({...profile, preferences: {...profile.preferences, quietTime: e.target.value}})}
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Biography</h3>
          <div className="bg-[#F8F9FA] p-8 rounded-[32px] border border-gray-100 shadow-inner">
            <textarea
              placeholder="Tell your pals about yourself..."
              className="w-full bg-transparent border-none focus:outline-none text-sm min-h-[120px] leading-relaxed resize-none"
              value={profile.bio}
              onChange={e => setProfile({...profile, bio: e.target.value})}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfileView;
