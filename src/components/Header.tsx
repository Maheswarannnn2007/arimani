import React from 'react';
import { TabType } from '../types';

interface HeaderProps {
  currentTab: TabType;
  onCameraClick: () => void;
  grainsCount: number;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onCameraClick }) => {
  const getTabTitle = () => {
    switch (currentTab) {
      case 'scan-&-pick':
        return 'Scan & Pick';
      case 'write-name':
        return 'Write Name';
      case 'my-grains':
      default:
        return 'My Grains';
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-[#fff8f5]/90 backdrop-blur-xl shadow-[0_2px_12px_rgba(30,27,25,0.06)] border-b border-[#1e1b19]/10">
      <div className="h-16 px-4 max-w-2xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <img
            alt="Arimanihub emblem"
            className="h-8 w-auto object-contain drop-shadow-sm"
            src="https://lh3.googleusercontent.com/aida/AEtjO1Vux9G03AljSj6wYPuadbWOWLEYXMeE9pa8BVFQDDrvUtlYn6YsbXkHJvbrnKEHLnqPaQGxiELFZy4FvvVpnA3oA_Ol8xY8Aq40tiIw4RHVBYJD_iIUlWiIdZT4Xxur7DnnAdxJ_zVwQhT62Zs3wSMk7ee-5oq4mafa1b2NDw-rhbBl2r0rVXR9Ji0RM87U_pwHKlUdtuT6FDEmRYEC0hT043HVvsFCpRQ6FEfvJc6MRf1B4kxjR-iwl4IA"
          />
          <div className="flex items-center gap-1.5 px-2 py-1 bg-[#f4ece8] rounded border border-[#1e1b19]/15 shadow-[1px_1px_0px_#1e1b19]">
            <span className="material-symbols-outlined text-[#8d4b00] text-[18px]">chat_bubble</span>
            <span className="font-headline-sm text-[16px] uppercase tracking-tight text-[#1e1b19] font-black">
              arimanihub
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex flex-col text-right">
            <span className="font-label-sm text-[9px] text-[#554336] uppercase font-bold tracking-wider">Issue #01</span>
            <span className="font-label-md text-[11px] text-[#8d4b00] truncate max-w-[100px] font-bold">
              {getTabTitle()}
            </span>
          </div>
          <button
            aria-label="Quick camera action"
            className="w-11 h-11 flex items-center justify-center rounded bg-[#f4ece8] text-[#1e1b19] hover:text-[#8d4b00] hover:border-[#8d4b00] border border-[#1e1b19]/20 shadow-[2px_2px_0px_#1e1b19] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            onClick={onCameraClick}
            type="button"
            title="Open Camera Scanner"
          >
            <span className="material-symbols-outlined text-[22px]">photo_camera</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-[#8d4b00] flex items-center justify-center shadow-[1.5px_1.5px_0px_#1e1b19] text-[#ffffff]">
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
};
