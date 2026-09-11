import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const navItems: { id: TabType; label: string; icon: string }[] = [
    { id: 'scan-&-pick', label: 'Scan & Pick', icon: 'crop_free' },
    { id: 'write-name', label: 'Write Name', icon: 'draw' },
    { id: 'my-grains', label: 'My Grains', icon: 'grain' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-[#fff8f5]/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(30,27,25,0.05)] border-t border-[#1e1b19]/15">
      <div className="h-20 px-4 max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center min-w-[76px] h-14 gap-1 transition-all cursor-pointer ${
                isActive
                  ? 'text-[#8d4b00] font-bold'
                  : 'text-[#554336] hover:text-[#1e1b19]'
              }`}
              type="button"
            >
              <div
                className={`w-11 h-8 flex items-center justify-center rounded transition-all ${
                  isActive
                    ? 'bg-[#ffdcc3] text-[#8d4b00] shadow-[2px_2px_0px_#1e1b19] border border-[#1e1b19]'
                    : 'bg-[#f4ece8] border border-[#1e1b19]/10'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              </div>
              <span className="font-label-sm text-[10px] uppercase tracking-wider font-bold">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
