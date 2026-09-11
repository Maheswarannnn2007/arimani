import React from 'react';

interface ComicToastProps {
  message: string | null;
}

export const ComicToast: React.FC<ComicToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#39b8fd] text-[#004666] px-4 py-2 shadow-[3px_3px_0px_#1e1b19] border-2 border-[#1e1b19] pointer-events-none transition-all duration-300 animate-bounce">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-[18px] text-[#004666]">verified</span>
        <span className="font-label-md text-[11px] uppercase font-black tracking-wider text-[#004666]">
          {message}
        </span>
      </div>
    </div>
  );
};
