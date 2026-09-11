import React, { useState } from 'react';
import { GrainItem, CategoryType } from '../types';
import { downloadImage } from '../utils/grainCanvas';

interface MyGrainsScreenProps {
  grains: GrainItem[];
  onInscribeNew: () => void;
  onToast: (msg: string) => void;
}

export const MyGrainsScreen: React.FC<MyGrainsScreenProps> = ({
  grains,
  onInscribeNew,
  onToast,
}) => {
  const [filter, setFilter] = useState<CategoryType>('all');
  const [selectedGrainForModal, setSelectedGrainForModal] = useState<GrainItem | null>(null);

  const filteredGrains = grains.filter((g) => {
    if (filter === 'all') return true;
    return g.category === filter;
  });

  const handleDownloadGrain = (grain: GrainItem) => {
    onToast('POW! HIGH-RES GRAIN EXTRACTED!');
    downloadImage(grain.image, `${grain.title.toLowerCase()}-${grain.name}.png`);
  };

  const handleSendGrain = async (grain: GrainItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Arimanihub - ${grain.title}`,
          text: `Inscribed Grain "${grain.name}" — Arimanihub Lore Relic`,
          url: window.location.href,
        });
        onToast('RELIC DISPATCHED TO SHARE SHEET!');
        return;
      } catch (err) {
        // Ignored or cancelled
      }
    }
    // Fallback: copy description or download
    navigator.clipboard?.writeText(
      `Arimanihub Inscribed Grain: "${grain.name}" [${grain.title} - ${grain.specRight}]`
    );
    onToast('RELIC DETAILS COPIED TO CLIPBOARD!');
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-4 pb-28 pt-20 gap-4">
      {/* COMIC ISSUE HEADER BANNER */}
      <div className="relative bg-[#ffffff] p-4 shadow-[4px_4px_0px_#1e1b19] border-2 border-[#1e1b19] overflow-hidden">
        {/* Halftone matrix decorative backdrop */}
        <div className="absolute inset-0 opacity-10 pointer-events-none halftone-amber"></div>

        {/* Comic Issue Ribbon */}
        <div className="flex items-center justify-between gap-2 pb-3">
          <div className="flex items-center gap-1.5 bg-[#8d4b00] px-2 py-0.5 shadow-[2px_2px_0px_#1e1b19] border border-[#1e1b19]">
            <span className="material-symbols-outlined text-[#ffffff] text-[14px]">auto_awesome</span>
            <span className="font-label-sm text-[9px] uppercase text-[#ffffff] tracking-widest font-black">
              VOL. 04 • GRAIN LORE
            </span>
          </div>
          <div className="bg-[#39b8fd] px-2 py-0.5 shadow-[2px_2px_0px_#1e1b19] border border-[#1e1b19]">
            <span className="font-label-sm text-[9px] uppercase text-[#004666] tracking-wider font-black">
              RETRO POP ISSUE
            </span>
          </div>
        </div>

        {/* Editorial Narrative Block */}
        <div className="relative z-10 flex flex-col gap-2">
          <div className="inline-block bg-[#a33900] px-2.5 py-1 shadow-[3px_3px_0px_#1e1b19] border-2 border-[#1e1b19] w-fit">
            <h2 className="font-headline-lg-mobile text-[26px] uppercase tracking-tight text-[#ffffff] font-black leading-tight">
              The Inscribed Grains!
            </h2>
          </div>

          {/* Comic Dialogue Strip with Tail */}
          <div className="relative bg-[#eee7e3] p-3 mt-1 shadow-[3px_3px_0px_#1e1b19] border-2 border-[#1e1b19]">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[#8d4b00] text-[20px] shrink-0 mt-0.5">
                format_quote
              </span>
              <p className="font-body-sm text-[12px] text-[#1e1b19] font-bold leading-relaxed">
                “ഓരോ അരിമണിയിലും അത് കഴിക്കേണ്ട ആളുടെ പേര് എഴുതിവെച്ചിട്ടുണ്ട്”
              </p>
            </div>
            <p className="font-label-sm text-[10px] text-[#554336] uppercase mt-1 tracking-wider text-right font-bold">
              — Malayalam Folklore Lore
            </p>
          </div>
        </div>
      </div>

      {/* FILTER / SORT COMIC STRIP */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          className={`flex items-center gap-1 px-3 py-1.5 shadow-[2px_2px_0px_#1e1b19] border border-[#1e1b19] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all shrink-0 cursor-pointer font-bold ${
            filter === 'all'
              ? 'bg-[#b15f00] text-[#fffbff]'
              : 'bg-[#f4ece8] text-[#1e1b19] hover:bg-[#eee7e3]'
          }`}
          onClick={() => setFilter('all')}
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">stars</span>
          <span className="font-label-md text-[11px] uppercase">All Relics ({grains.length})</span>
        </button>

        <button
          className={`flex items-center gap-1 px-3 py-1.5 shadow-[2px_2px_0px_#1e1b19] border border-[#1e1b19] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all shrink-0 cursor-pointer font-bold ${
            filter === 'vows'
              ? 'bg-[#a33900] text-[#ffffff]'
              : 'bg-[#f4ece8] text-[#1e1b19] hover:bg-[#eee7e3]'
          }`}
          onClick={() => setFilter('vows')}
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">favorite</span>
          <span className="font-label-md text-[11px] uppercase">Vows &amp; Love</span>
        </button>

        <button
          className={`flex items-center gap-1 px-3 py-1.5 shadow-[2px_2px_0px_#1e1b19] border border-[#1e1b19] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all shrink-0 cursor-pointer font-bold ${
            filter === 'personal'
              ? 'bg-[#006591] text-[#ffffff]'
              : 'bg-[#f4ece8] text-[#1e1b19] hover:bg-[#eee7e3]'
          }`}
          onClick={() => setFilter('personal')}
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">fingerprint</span>
          <span className="font-label-md text-[11px] uppercase">Personal</span>
        </button>
      </div>

      {/* COMIC 2-COLUMN PANELS GRID */}
      <div className="grid grid-cols-2 gap-3">
        {filteredGrains.map((grain) => {
          const isVow = grain.category === 'vows';
          const headerBg =
            grain.badgeType === 'cyber'
              ? 'bg-[#006591] text-[#ffffff]'
              : grain.badgeType === 'vow'
              ? 'bg-[#a33900] text-[#ffffff]'
              : grain.badgeType === 'love'
              ? 'bg-[#b15f00] text-[#ffffff]'
              : 'bg-[#8d4b00] text-[#ffffff]';

          return (
            <div
              key={grain.id}
              className="flex flex-col bg-[#ffffff] shadow-[4px_4px_0px_#1e1b19] border-2 border-[#1e1b19] relative group"
            >
              {/* Header Banner Strip */}
              <div className={`${headerBg} px-2 py-1 flex items-center justify-between border-b border-[#1e1b19]`}>
                <span className="font-label-sm text-[9px] uppercase tracking-wide font-black">
                  {grain.panelNum}
                </span>
                <span className="font-label-sm text-[9px] font-bold uppercase truncate max-w-[80px]">
                  {grain.title}
                </span>
              </div>

              {/* Comic Burst Badge */}
              <div
                className={`absolute top-7 z-20 px-2 py-0.5 shadow-[2px_2px_0px_#1e1b19] border border-[#1e1b19] ${
                  grain.badgeType === 'vow'
                    ? '-left-1 bg-[#ffdad6] text-[#ba1a1a] -rotate-3 flex items-center gap-0.5'
                    : grain.badgeType === 'love'
                    ? '-left-1 bg-[#c9e6ff] text-[#001e2f] -rotate-6'
                    : grain.badgeType === 'cyber'
                    ? '-right-1 bg-[#ffdcc3] text-[#2f1500] rotate-3'
                    : '-right-1 bg-[#39b8fd] text-[#004666] rotate-6'
                }`}
              >
                {grain.badgeType === 'vow' && (
                  <span className="material-symbols-outlined text-[12px] text-[#ba1a1a]">favorite</span>
                )}
                <span className="font-label-sm text-[9px] uppercase font-black tracking-tight">
                  {grain.badgeText}
                </span>
              </div>

              {/* Grain Micro Visual Box */}
              <div
                className="relative bg-[#faf2ee] p-3 flex flex-col items-center justify-center min-h-[160px] overflow-hidden cursor-pointer"
                onClick={() => setSelectedGrainForModal(grain)}
              >
                <div
                  className={`absolute inset-0 opacity-10 ${
                    grain.badgeType === 'cyber'
                      ? 'halftone-cyan'
                      : grain.badgeType === 'vow'
                      ? 'halftone-tertiary'
                      : 'halftone-amber'
                  }`}
                ></div>

                <img
                  className="w-28 h-28 object-contain drop-shadow-md z-10 transition-transform group-hover:scale-105"
                  alt={`Inscribed grain ${grain.name}`}
                  src={grain.image}
                />

                {/* Overlayed Inscribed Name Badge */}
                <div className="z-10 mt-1 bg-[#ffffff] px-2.5 py-0.5 shadow-[2px_2px_0px_#1e1b19] border border-[#1e1b19] text-center max-w-[130px]">
                  <span
                    className={`font-headline-sm text-[13px] tracking-tight font-black block truncate ${
                      grain.badgeType === 'cyber'
                        ? 'text-[#006591]'
                        : grain.badgeType === 'vow'
                        ? 'text-[#a33900]'
                        : 'text-[#8d4b00]'
                    }`}
                  >
                    {grain.name}
                  </span>
                </div>
              </div>

              {/* Grain Specs & Actions */}
              <div className="p-2.5 flex flex-col gap-2 bg-[#ffffff] border-t border-[#1e1b19]">
                <div className="flex items-center justify-between text-[9px]">
                  <span className="font-label-sm text-[#554336] uppercase font-bold">
                    {grain.specLeft}
                  </span>
                  <span className={`font-label-sm font-black ${grain.specRightColor}`}>
                    {grain.specRight}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <button
                    className={`flex items-center justify-center gap-1 text-[#ffffff] py-1.5 px-1 shadow-[2px_2px_0px_#1e1b19] border border-[#1e1b19] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer font-black ${
                      grain.badgeType === 'cyber'
                        ? 'bg-[#006591]'
                        : grain.badgeType === 'vow'
                        ? 'bg-[#a33900]'
                        : 'bg-[#8d4b00]'
                    }`}
                    onClick={() => handleDownloadGrain(grain)}
                    type="button"
                    title="Extract high-res PNG"
                  >
                    <span className="material-symbols-outlined text-[14px]">download</span>
                    <span className="font-label-sm text-[9px] uppercase">PNG</span>
                  </button>

                  <button
                    className="flex items-center justify-center gap-1 bg-[#eee7e3] text-[#1e1b19] py-1.5 px-1 shadow-[2px_2px_0px_#1e1b19] border border-[#1e1b19] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer font-black"
                    onClick={() => handleSendGrain(grain)}
                    type="button"
                    title="Send or share grain"
                  >
                    <span className="material-symbols-outlined text-[14px]">share</span>
                    <span className="font-label-sm text-[9px] uppercase">SEND</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* POP DIALOGUE STAT BOX */}
      <div className="relative bg-[#eee7e3] p-4 shadow-[4px_4px_0px_#1e1b19] border-2 border-[#1e1b19] flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="font-label-sm text-[10px] uppercase text-[#554336] tracking-wider font-bold">
            YOUR ARTIFACT LOG
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-headline-lg-mobile text-[28px] text-[#8d4b00] font-black">
              {String(grains.length).padStart(2, '0')}
            </span>
            <span className="font-label-md text-[11px] text-[#1e1b19] uppercase font-bold">
              Grains Vaulted
            </span>
          </div>
          <p className="font-body-sm text-[11px] text-[#554336]">
            Printed on archival 300 DPI canvas
          </p>
        </div>

        {/* Comic Trophy Icon Stamp */}
        <div className="w-12 h-12 bg-[#8d4b00] flex items-center justify-center shadow-[2px_2px_0px_#1e1b19] border-2 border-[#1e1b19] shrink-0 text-[#ffffff]">
          <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
        </div>
      </div>

      {/* FLOATING COMIC ACTION BUTTON */}
      <div className="sticky bottom-20 z-30 self-center w-full max-w-xs mt-2">
        <button
          className="w-full bg-[#8d4b00] hover:bg-[#b15f00] text-[#ffffff] py-3.5 px-4 shadow-[4px_4px_0px_#1e1b19] border-2 border-[#1e1b19] flex items-center justify-center gap-2 active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0px_#1e1b19] transition-all cursor-pointer font-black"
          onClick={onInscribeNew}
          type="button"
        >
          <span className="material-symbols-outlined text-[24px]">edit_note</span>
          <span className="font-headline-sm text-[16px] uppercase tracking-wide">
            + INSCRIBE NEW GRAIN
          </span>
        </button>
      </div>

      {/* Quick Modal Preview */}
      {selectedGrainForModal && (
        <div className="fixed inset-0 z-50 bg-[#1e1b19]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#ffffff] max-w-sm w-full p-4 shadow-[6px_6px_0px_#1e1b19] border-3 border-[#1e1b19] flex flex-col gap-3 relative">
            <div className="flex items-center justify-between border-b-2 border-[#1e1b19] pb-2">
              <div className="flex items-center gap-2">
                <span className="bg-[#8d4b00] text-[#ffffff] text-[10px] font-black px-1.5 py-0.5">
                  {selectedGrainForModal.panelNum}
                </span>
                <span className="font-headline-sm text-[16px] uppercase font-black">
                  {selectedGrainForModal.title}
                </span>
              </div>
              <button
                onClick={() => setSelectedGrainForModal(null)}
                className="w-7 h-7 flex items-center justify-center bg-[#eee7e3] border border-[#1e1b19] cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="bg-[#faf2ee] p-4 flex flex-col items-center justify-center border border-[#1e1b19]">
              <img
                src={selectedGrainForModal.image}
                alt={selectedGrainForModal.name}
                className="w-48 h-48 object-contain drop-shadow-lg"
              />
              <div className="mt-2 bg-[#ffffff] px-4 py-1 border-2 border-[#1e1b19] shadow-[2px_2px_0px_#1e1b19]">
                <span className="font-headline-md text-[20px] text-[#8d4b00] font-black">
                  {selectedGrainForModal.name}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-bold px-1">
              <span>{selectedGrainForModal.specLeft}</span>
              <span className={selectedGrainForModal.specRightColor}>
                {selectedGrainForModal.specRight}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                className="bg-[#8d4b00] text-[#ffffff] py-2 shadow-[2px_2px_0px_#1e1b19] border border-[#1e1b19] font-bold uppercase text-[12px] flex items-center justify-center gap-1 cursor-pointer"
                onClick={() => handleDownloadGrain(selectedGrainForModal)}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                Download
              </button>
              <button
                className="bg-[#eee7e3] text-[#1e1b19] py-2 shadow-[2px_2px_0px_#1e1b19] border border-[#1e1b19] font-bold uppercase text-[12px] flex items-center justify-center gap-1 cursor-pointer"
                onClick={() => handleSendGrain(selectedGrainForModal)}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">share</span>
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
