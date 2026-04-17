
import React from 'react';
import { Icons } from './Icons';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', icon: <Icons.World /> },
    { id: 'chat', icon: <Icons.Chat /> },
    { id: 'stream', icon: <Icons.Stream /> },
    { id: 'workshop', icon: <Icons.Workshop /> },
    { id: 'settings', icon: <Icons.Settings /> },
  ];

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto bg-white shadow-2xl relative overflow-hidden text-[#333]">
      <header className="pt-10 pb-4 px-6 flex justify-center items-center bg-white border-b border-gray-50">
        <h1 className="text-xl font-bold tracking-tight text-black capitalize">
          {activeTab === 'home' ? 'Palniverse' : activeTab}
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto pb-32 px-6 no-scrollbar">
        {children}
      </main>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[340px] z-50">
        <nav className="glass py-4 px-6 flex justify-between items-center rounded-full shadow-2xl border border-white/40">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`transition-all duration-300 transform ${
                activeTab === tab.id 
                ? 'text-[#007AFF] scale-125' 
                : 'text-gray-300 hover:scale-110'
              }`}
            >
              {tab.icon}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Layout;
