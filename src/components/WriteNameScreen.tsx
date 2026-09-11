import React, { useState } from 'react';
import { PenStyle, InkColor, GrainItem } from '../types';
import { generateGrainCardDataUrl, downloadImage } from '../utils/grainCanvas';

interface WriteNameScreenProps {
  capturedGrainImage?: string | null;
  onSaveGrain: (newGrain: GrainItem) => void;
  onToast: (msg: string) => void;
  onNavigateToVault: () => void;
}

export const WriteNameScreen: React.FC<WriteNameScreenProps> = ({
  capturedGrainImage,
  onSaveGrain,
  onToast,
  onNavigateToVault,
}) => {
  const [name, setName] = useState<string>('അർജുൻ');
  const [lang, setLang] = useState<'mal' | 'eng'>('mal');
  const [penStyle, setPenStyle] = useState<PenStyle>('brush');
  const [inkColor, setInkColor] = useState<InkColor>('black');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const maxChars = 16;

  const suggestions = [
    { label: 'അർജുൻ', lang: 'mal' },
    { label: 'സ്നേഹം', lang: 'mal' },
    { label: 'Ananya', lang: 'eng' },
    { label: 'Lucky 2025', lang: 'eng' },
    { label: 'സന്തോഷം', lang: 'mal' },
    { label: 'പ്രിയ', lang: 'mal' },
    { label: 'Aswathy', lang: 'eng' },
  ];

  const handleLangToggle = (selectedLang: 'mal' | 'eng') => {
    setLang(selectedLang);
    if (selectedLang === 'mal') {
      setName('അർജുൻ');
    } else {
      setName('Arjun');
    }
  };

  const getTextColorClass = () => {
    switch (inkColor) {
      case 'amber':
        return 'text-[#8d4b00]';
      case 'cyan':
        return 'text-[#006591]';
      case 'red':
        return 'text-[#ba1a1a]';
      case 'black':
      default:
        return 'text-[#1e1b19]';
    }
  };

  const getFontFamilyClass = () => {
    switch (penStyle) {
      case 'marker':
        return 'font-headline-sm text-[22px] tracking-normal font-black';
      case 'fine':
        return 'font-body-md text-[18px] tracking-tight font-bold';
      case 'brush':
      default:
        return 'font-headline-md text-[26px] tracking-tight font-black';
    }
  };

  const handleSaveToVault = async () => {
    const trimmed = name.trim() || 'അർജുൻ';
    const cardDataUrl = await generateGrainCardDataUrl(
      trimmed,
      penStyle,
      inkColor,
      capturedGrainImage
    );

    let specRightColor = 'text-[#1e1b19]';
    let specRight = 'JET #00';
    if (inkColor === 'amber') {
      specRightColor = 'text-[#8d4b00]';
      specRight = 'GOLD LEAF';
    } else if (inkColor === 'cyan') {
      specRightColor = 'text-[#006591]';
      specRight = 'CYAN PUNCH';
    } else if (inkColor === 'red') {
      specRightColor = 'text-[#ba1a1a]';
      specRight = 'RUBY VOW';
    }

    const newGrain: GrainItem = {
      id: `grain-${Date.now()}`,
      panelNum: `PANEL #${Math.floor(Math.random() * 90) + 10}`,
      title: penStyle === 'brush' ? 'CALLIGRAPHY' : penStyle === 'marker' ? 'CYBERPOP' : 'MICRO ENGRAVE',
      badgeText: '★ NEW RELIC',
      badgeType: 'classic',
      category: inkColor === 'red' || trimmed.includes('♥') ? 'vows' : 'personal',
      name: trimmed,
      specLeft: penStyle === 'brush' ? '0.82MM TIP' : penStyle === 'marker' ? '0.70MM LINE' : '0.50MM FINE',
      specRight: `INK: ${specRight}`,
      specRightColor,
      image: cardDataUrl || (capturedGrainImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzrslSLmcK4sGQE2GNIp2OvXZaWOrI9yQz1VWWhhK7WAlW7pUVahyxb4Y-jIczlKocSFYXqVHhQlJJAsM_PTVFuLQBKfStW-WW2fPEkznf6MZYHc2HuvipI3-4yexNdolBkjBkoL4Bkj1JftFXrgHTjwQ6yQ0uVvz5Mcc1lG1SjrJKJto-3HnLwQq6cTLZtVUtgPohJ0Le8fpq5P4ZKfgYfOM2Dg0AJSRBcznUITh91Gny-Rdq3LBtqQ'),
      isCustom: true,
      penStyle,
      inkColor,
      dateAdded: new Date().toLocaleDateString(),
    };

    onSaveGrain(newGrain);
    onToast(`GRAIN "${trimmed}" VAULTED SUCCESSFULLY!`);
    setTimeout(() => {
      onNavigateToVault();
    }, 600);
  };

  const handleDownload = async () => {
    setIsExporting(true);
    onToast('RENDERING HIGH-RES 1200 DPI GRAIN PNG...');
    try {
      const dataUrl = await generateGrainCardDataUrl(
        name.trim() || 'അർജുൻ',
        penStyle,
        inkColor,
        capturedGrainImage
      );
      downloadImage(dataUrl, `arimanihub-grain-${Date.now()}.png`);
      onToast('POW! HIGH-RES GRAIN EXTRACTED!');
    } catch (e) {
      console.error(e);
      onToast('EXPORT FAILED');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    onToast('GENERATING COMIC CARD...');
    try {
      const dataUrl = await generateGrainCardDataUrl(
        name.trim() || 'അർജുൻ',
        penStyle,
        inkColor,
        capturedGrainImage
      );
      if (navigator.share && navigator.canShare) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'inscribed-grain.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Arimanihub - Inscribed Grain',
            text: `Inscribed grain: "${name}" — Arimanihub Folklore Relic`,
            files: [file],
          });
          onToast('CARD SHARED!');
          return;
        }
      }
      // Fallback: download
      downloadImage(dataUrl, `grain-card-${Date.now()}.png`);
      onToast('CARD SAVED TO DOWNLOADS!');
    } catch (err) {
      console.log('Share dismissed or failed', err);
      onToast('LINK READY / DOWNLOADED');
    }
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-4 pb-28 pt-20 gap-4">
      {/* Issue & Lore Narrative Ribbon */}
      <section className="w-full bg-[#ffdbce] text-[#370e00] p-2.5 shadow-[3px_3px_0px_#1e1b19] border-2 border-[#1e1b19] flex items-center justify-between gap-2 relative overflow-hidden">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#a33900] text-[20px]">auto_awesome</span>
          <span className="font-label-sm text-[10px] uppercase tracking-wider font-black">
            COMIC MICRO-STUDIO
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#ffffff] px-2 py-0.5 shadow-[1px_1px_0px_#1e1b19] border border-[#1e1b19]">
          <span className="w-2 h-2 rounded-full bg-[#cc4900] animate-ping"></span>
          <span className="font-label-sm text-[9px] text-[#1e1b19] uppercase font-black">
            Ink Ready
          </span>
        </div>
      </section>

      {/* Comic Panel Stage: Rice Grain Live Preview */}
      <section className="w-full bg-[#ffffff] p-4 shadow-[4px_4px_0px_#1e1b19] border-2 border-[#1e1b19] flex flex-col items-center relative overflow-hidden">
        {/* Halftone Decorative Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none halftone-amber"></div>

        {/* Comic Panel Header Tag */}
        <div className="w-full flex items-center justify-between z-10 mb-2">
          <div className="bg-[#c9e6ff] text-[#001e2f] px-2 py-0.5 font-label-sm text-[10px] uppercase tracking-wide flex items-center gap-1 shadow-[2px_2px_0px_#1e1b19] border border-[#1e1b19] font-black">
            <span className="material-symbols-outlined text-[14px]">photo_size_select_actual</span>
            <span>Panel #01: The Tiny Canvas</span>
          </div>
          <span className="font-label-sm text-[10px] text-[#554336] uppercase font-bold">
            Zoom: 1200x
          </span>
        </div>

        {/* Central Micro-Canvas Stage */}
        <div className="relative w-full aspect-[4/3] flex items-center justify-center bg-[#faf2ee] p-3 shadow-inner border border-[#1e1b19] overflow-hidden">
          {/* Halftone Burst Glow */}
          <div className="absolute w-56 h-56 rounded-full bg-[#ffdcc3]/60 blur-xl"></div>

          {/* Isolated Rice Grain Container */}
          <div
            className="relative z-10 w-4/5 max-w-[320px] h-36 flex items-center justify-center transition-transform duration-300 transform hover:scale-105"
            id="grainContainer"
          >
            {capturedGrainImage ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={capturedGrainImage}
                  alt="Captured Rice Grain"
                  className="max-w-full max-h-full object-contain drop-shadow-md rounded-md"
                />
                <div className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none">
                  <p
                    className={`text-center ${getFontFamilyClass()} ${getTextColorClass()} break-all select-none transition-all duration-200 rotate-[-4deg] drop-shadow-[0_2px_2px_rgba(255,255,255,0.9)]`}
                  >
                    {name || '✨'}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Stylized Graphic Rice Grain SVG Backdrop */}
                <svg className="w-full h-full drop-shadow-md overflow-visible" viewBox="0 0 320 140">
                  {/* Outer Shadow / Ink Contour */}
                  <path
                    d="M 25,70 C 45,20 160,15 295,50 C 315,65 310,80 290,95 C 220,135 75,130 25,70 Z"
                    fill="#eee7e3"
                    stroke="#1e1b19"
                    strokeWidth="3"
                  ></path>
                  {/* Grain Body Base */}
                  <path
                    d="M 28,70 C 48,24 158,20 290,53 C 308,66 303,77 285,91 C 218,128 78,124 28,70 Z"
                    fill="#fff8f5"
                  ></path>
                  {/* Comic Golden Shimmer Line */}
                  <path
                    d="M 45,66 C 90,38 180,35 270,58"
                    fill="none"
                    stroke="#ffb77d"
                    strokeLinecap="round"
                    strokeWidth="4"
                  ></path>
                  <path
                    d="M 50,78 C 110,110 210,105 275,82"
                    fill="none"
                    stroke="#faf2ee"
                    strokeLinecap="round"
                    strokeWidth="3"
                  ></path>
                </svg>

                {/* Live Inscribed Text Layer */}
                <div className="absolute inset-0 flex items-center justify-center px-8 z-20 pointer-events-none">
                  <p
                    className={`text-center ${getFontFamilyClass()} ${getTextColorClass()} break-all select-none transition-all duration-200 rotate-[-4deg] drop-shadow-sm`}
                  >
                    {name || '✨'}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Comic Action Callout Bubble */}
          <div className="absolute bottom-2 right-2 bg-[#a33900] text-[#ffffff] px-2 py-1 shadow-[2px_2px_0px_#1e1b19] border border-[#1e1b19] flex items-center gap-1 z-20">
            <span className="material-symbols-outlined text-[13px]">pinch</span>
            <span className="font-label-sm text-[9px] uppercase font-black">1:1 Miniature Grain</span>
          </div>
        </div>

        {/* Sacred Adage Banner */}
        <div className="w-full mt-2 bg-[#f4ece8] p-2 border border-[#1e1b19] shadow-[2px_2px_0px_#1e1b19] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#8d4b00] text-[18px] shrink-0">history_edu</span>
          <p className="font-body-sm text-[11px] text-[#554336] italic truncate">
            “ഓരോ അരിമണിയിലും അത് കഴിക്കേണ്ട ആളുടെ പേര് എഴുതിവെച്ചിട്ടുണ്ട്”
          </p>
        </div>
      </section>

      {/* Speech-Bubble Customizer Card */}
      <section className="w-full bg-[#ffffff] p-4 shadow-[4px_4px_0px_#1e1b19] border-2 border-[#1e1b19] flex flex-col gap-4">
        {/* Header with Language Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#8d4b00] text-[20px]">draw</span>
            <label className="font-headline-sm text-[18px] uppercase font-black text-[#1e1b19]" htmlFor="nameInput">
              Type Name or Wish
            </label>
          </div>

          {/* Quick Script Toggle */}
          <div className="flex items-center bg-[#f4ece8] border border-[#1e1b19] p-0.5 shadow-[1.5px_1.5px_0px_#1e1b19]">
            <button
              className={`px-2 py-0.5 font-label-sm text-[10px] uppercase font-bold transition-all cursor-pointer ${
                lang === 'mal'
                  ? 'bg-[#8d4b00] text-[#ffffff] shadow-[1px_1px_0px_#1e1b19]'
                  : 'text-[#554336] hover:text-[#1e1b19]'
              }`}
              onClick={() => handleLangToggle('mal')}
              type="button"
            >
              മലയാളം
            </button>
            <button
              className={`px-2 py-0.5 font-label-sm text-[10px] uppercase font-bold transition-all cursor-pointer ${
                lang === 'eng'
                  ? 'bg-[#8d4b00] text-[#ffffff] shadow-[1px_1px_0px_#1e1b19]'
                  : 'text-[#554336] hover:text-[#1e1b19]'
              }`}
              onClick={() => handleLangToggle('eng')}
              type="button"
            >
              English
            </button>
          </div>
        </div>

        {/* Input Box */}
        <div className="relative w-full">
          <div className="bg-[#faf2ee] p-2.5 shadow-inner border-2 border-[#1e1b19] flex items-center gap-2 focus-within:ring-2 focus-within:ring-[#8d4b00]">
            <span className="material-symbols-outlined text-[#887364] text-[20px]">edit_note</span>
            <input
              className="w-full bg-transparent font-body-lg text-[16px] text-[#1e1b19] placeholder:text-[#554336]/50 focus:outline-none font-bold"
              id="nameInput"
              maxLength={maxChars}
              placeholder="Enter lucky name..."
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {name.length > 0 && (
              <button
                aria-label="Clear text input"
                className="w-6 h-6 flex items-center justify-center bg-[#eee7e3] text-[#554336] hover:text-[#1e1b19] border border-[#1e1b19] cursor-pointer"
                onClick={() => setName('')}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
          {/* Max Char Tag */}
          <div className="flex justify-between items-center px-1 mt-1">
            <span className="font-label-sm text-[10px] text-[#554336]">Max 16 micro-letters</span>
            <span className="font-label-sm text-[10px] text-[#8d4b00] font-black">
              {name.length} / {maxChars}
            </span>
          </div>
        </div>

        {/* Quick Suggestions */}
        <div className="flex flex-col gap-1.5">
          <span className="font-label-sm text-[10px] text-[#554336] uppercase tracking-wider font-bold">
            QUICK SUGGESTIONS:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {suggestions.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setName(item.label);
                  onToast(`LOADED "${item.label}"`);
                }}
                className="shrink-0 px-2.5 py-1 bg-[#f4ece8] text-[#1e1b19] font-label-sm text-[10px] hover:bg-[#ffdcc3] hover:text-[#2f1500] transition-all shadow-[1.5px_1.5px_0px_#1e1b19] border border-[#1e1b19] cursor-pointer font-bold"
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Styling Tools: Comic Pens & Color Palette */}
        <div className="flex flex-col gap-3 pt-2 border-t border-[#f4ece8]">
          {/* Cartoon Pen Style Selection */}
          <div className="flex flex-col gap-1.5">
            <span className="font-label-sm text-[10px] text-[#554336] uppercase tracking-wider font-bold">
              INSCRIBING PEN:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                className={`flex items-center justify-center gap-1 py-2 px-1 text-[11px] font-bold shadow-[2px_2px_0px_#1e1b19] border border-[#1e1b19] transition-all cursor-pointer ${
                  penStyle === 'brush'
                    ? 'bg-[#eee7e3] text-[#8d4b00] border-2 border-[#8d4b00]'
                    : 'bg-[#f4ece8] text-[#554336] hover:bg-[#eee7e3]'
                }`}
                onClick={() => setPenStyle('brush')}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">brush</span>
                <span>Brush Ink</span>
              </button>

              <button
                className={`flex items-center justify-center gap-1 py-2 px-1 text-[11px] font-bold shadow-[2px_2px_0px_#1e1b19] border border-[#1e1b19] transition-all cursor-pointer ${
                  penStyle === 'marker'
                    ? 'bg-[#eee7e3] text-[#8d4b00] border-2 border-[#8d4b00]'
                    : 'bg-[#f4ece8] text-[#554336] hover:bg-[#eee7e3]'
                }`}
                onClick={() => setPenStyle('marker')}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">stylus</span>
                <span>Marker Pop</span>
              </button>

              <button
                className={`flex items-center justify-center gap-1 py-2 px-1 text-[11px] font-bold shadow-[2px_2px_0px_#1e1b19] border border-[#1e1b19] transition-all cursor-pointer ${
                  penStyle === 'fine'
                    ? 'bg-[#eee7e3] text-[#8d4b00] border-2 border-[#8d4b00]'
                    : 'bg-[#f4ece8] text-[#554336] hover:bg-[#eee7e3]'
                }`}
                onClick={() => setPenStyle('fine')}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">ink_pen</span>
                <span>Fine Nib</span>
              </button>
            </div>
          </div>

          {/* Comic Ink Colors */}
          <div className="flex flex-col gap-1.5">
            <span className="font-label-sm text-[10px] text-[#554336] uppercase tracking-wider font-bold">
              INK COLOR:
            </span>
            <div className="flex items-center gap-3">
              {/* Black Ink */}
              <button
                className="w-8 h-8 rounded-full bg-[#1e1b19] shadow-[2px_2px_0px_#1e1b19] border-2 border-[#1e1b19] flex items-center justify-center cursor-pointer"
                onClick={() => setInkColor('black')}
                type="button"
                title="Jet Black Ink"
              >
                {inkColor === 'black' && (
                  <span className="material-symbols-outlined text-[#ffffff] text-[16px]">check</span>
                )}
              </button>

              {/* Molten Amber */}
              <button
                className="w-8 h-8 rounded-full bg-[#8d4b00] shadow-[2px_2px_0px_#1e1b19] border-2 border-[#1e1b19] flex items-center justify-center cursor-pointer"
                onClick={() => setInkColor('amber')}
                type="button"
                title="Molten Amber Gold"
              >
                {inkColor === 'amber' && (
                  <span className="material-symbols-outlined text-[#ffffff] text-[16px]">check</span>
                )}
              </button>

              {/* Cyan Pop */}
              <button
                className="w-8 h-8 rounded-full bg-[#006591] shadow-[2px_2px_0px_#1e1b19] border-2 border-[#1e1b19] flex items-center justify-center cursor-pointer"
                onClick={() => setInkColor('cyan')}
                type="button"
                title="Cyan Punch"
              >
                {inkColor === 'cyan' && (
                  <span className="material-symbols-outlined text-[#ffffff] text-[16px]">check</span>
                )}
              </button>

              {/* Comic Red */}
              <button
                className="w-8 h-8 rounded-full bg-[#ba1a1a] shadow-[2px_2px_0px_#1e1b19] border-2 border-[#1e1b19] flex items-center justify-center cursor-pointer"
                onClick={() => setInkColor('red')}
                type="button"
                title="Ruby Vow Red"
              >
                {inkColor === 'red' && (
                  <span className="material-symbols-outlined text-[#ffffff] text-[16px]">check</span>
                )}
              </button>

              <div className="ml-auto flex items-center gap-1 text-[#554336]">
                <span className="material-symbols-outlined text-[16px]">palette</span>
                <span className="font-label-sm text-[10px] font-bold">Press Grade</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Big Bold Action Area */}
      <section className="w-full flex flex-col gap-2">
        <button
          className="w-full py-3.5 px-4 bg-[#8d4b00] hover:bg-[#b15f00] text-[#ffffff] shadow-[4px_4px_0px_#1e1b19] border-2 border-[#1e1b19] font-headline-sm text-[18px] uppercase tracking-wide flex items-center justify-center gap-2 active:scale-[0.98] transition-transform cursor-pointer font-black"
          onClick={handleSaveToVault}
          type="button"
        >
          <span className="material-symbols-outlined text-[24px]">save</span>
          <span>ADD TO MY COMIC GRAINS!</span>
        </button>

        <div className="flex items-center justify-center gap-4 pt-1">
          <button
            className="flex items-center gap-1 font-label-md text-[11px] text-[#006591] hover:underline font-bold cursor-pointer"
            onClick={handleShare}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">ios_share</span>
            <span>Share Comic Card</span>
          </button>
          <span className="w-1.5 h-1.5 bg-[#dbc2b0]"></span>
          <button
            className="flex items-center gap-1 font-label-md text-[11px] text-[#554336] hover:text-[#1e1b19] font-bold cursor-pointer disabled:opacity-50"
            disabled={isExporting}
            onClick={handleDownload}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>{isExporting ? 'Exporting...' : 'Download PNG'}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
