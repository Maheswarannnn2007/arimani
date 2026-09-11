import React, { useState, useRef, useEffect } from 'react';

interface ScanAndPickScreenProps {
  onProceedToWriteName: (capturedImage?: string) => void;
  onToast: (msg: string) => void;
}

export const ScanAndPickScreen: React.FC<ScanAndPickScreenProps> = ({
  onProceedToWriteName,
  onToast,
}) => {
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedGrain, setCapturedGrain] = useState<string | null>(null);
  const [selectedGrainIndex, setSelectedGrainIndex] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(4.8);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async (mode: 'environment' | 'user' = facingMode) => {
    stopCamera();
    setCameraError(null);
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
      onToast('LIVE OPTICAL SENSOR INITIALIZED!');
    } catch (err: unknown) {
      console.error('Camera access error:', err);
      setIsCameraActive(false);
      const msg = err instanceof Error ? err.message : 'Camera permission not granted';
      setCameraError(msg);
      onToast('CAMERA OFFLINE // USE FILE UPLOAD OR DEMO FEED');
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const toggleCamera = () => {
    if (isCameraActive) {
      stopCamera();
      onToast('CAMERA FEED PAUSED');
    } else {
      startCamera(facingMode);
    }
  };

  const flipCamera = () => {
    const newMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newMode);
    if (isCameraActive) {
      startCamera(newMode);
    }
  };

  // Capture frame from active camera
  const captureFromVideo = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    setIsScanning(true);

    setTimeout(() => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedGrain(dataUrl);
        setIsScanning(false);
        onToast('ZAP! GRAIN FRAME CAPTURED & ISOLATED!');
      }
    }, 400);
  };

  // Handle manual file upload (photos of rice grains)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCapturedGrain(result);
        stopCamera();
        onToast('IMAGE LOADED // READY FOR GRAIN INSCRIBING!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProceed = () => {
    onProceedToWriteName(capturedGrain || undefined);
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-4 pb-28 pt-20 gap-4">
      {/* Comic Issue Banner Strip */}
      <div className="flex items-center justify-between bg-[#e9e1dd] px-3 py-1.5 shadow-[3px_3px_0px_#1e1b19] border border-[#1e1b19]">
        <div className="flex items-center gap-1.5">
          <span className="bg-[#8d4b00] text-[#ffffff] font-label-sm text-[9px] px-1.5 py-0.5 uppercase tracking-widest font-black">
            ACT I
          </span>
          <span className="font-label-md text-[11px] text-[#1e1b19] uppercase tracking-tight font-bold">
            GRAIN CAPTURE PROTOCOL
          </span>
        </div>
        <span className="font-label-sm text-[9px] text-[#cc4900] uppercase tracking-widest font-black">
          DEC 1989 ARCHIVE
        </span>
      </div>

      {/* Comic Speech Bubble Hero Callout */}
      <div className="relative bg-[#ffffff] p-4 shadow-[4px_4px_0px_#1e1b19] border-2 border-[#1e1b19]">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 shrink-0 bg-[#ffdcc3] border-2 border-[#1e1b19] flex items-center justify-center text-[#2f1500] shadow-[2px_2px_0px_#1e1b19]">
            <span className="material-symbols-outlined text-[28px]">add_a_photo</span>
          </div>
          <div className="flex flex-col">
            <span className="bg-[#006591] text-[#ffffff] font-label-sm text-[9px] uppercase px-1.5 py-0.5 self-start mb-1 tracking-wider font-bold shadow-[1px_1px_0px_#1e1b19]">
              SPEECH LOG
            </span>
            <h1 className="font-headline-md text-[24px] uppercase text-[#1e1b19] leading-tight tracking-tight font-black">
              Snap your rice or upload a photo!
            </h1>
            <p className="font-body-sm text-[12px] text-[#554336] mt-1 leading-relaxed">
              Lay grains on any flat paper. Let the retro comic-scanner do its magic cutout.
            </p>
          </div>
        </div>
        {/* Speech bubble pointer notch */}
        <div className="absolute -bottom-2.5 left-8 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-[#ffffff] drop-shadow-[0_3px_0_#1e1b19]"></div>
      </div>

      {/* Traditional Malayalam Lore Editorial Box */}
      <div className="bg-[#ffdbce] p-3 shadow-[3px_3px_0px_#1e1b19] border-2 border-[#1e1b19] mt-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-outlined text-[#a33900] text-[18px]">auto_stories</span>
          <span className="font-label-sm text-[9px] uppercase text-[#370e00] font-black tracking-widest">
            FOLKLORE ARCHIVE // KERALA TRADITION
          </span>
        </div>
        <p className="font-body-md text-[14px] text-[#370e00] font-bold leading-relaxed">
          “ഓരോ അരിമണിയിലും അത് കഴിക്കേണ്ട ആളുടെ പേര് എഴുതിവെച്ചിട്ടുണ്ട്.”
        </p>
        <span className="font-label-sm text-[10px] text-[#a33900] italic block mt-0.5 tracking-tight">
          — “Every grain of rice already holds the destined name of its bearer.”
        </span>
      </div>

      {/* Primary Interactive Viewfinder Panel */}
      <div className="relative bg-[#ffffff] p-2 shadow-[4px_4px_0px_#1e1b19] border-2 border-[#1e1b19] overflow-hidden">
        {/* Panel Header Strip */}
        <div className="flex items-center justify-between bg-[#1e1b19] text-[#fff8f5] px-2.5 py-1 mb-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isCameraActive ? 'bg-[#39b8fd] animate-ping' : 'bg-[#ffb77d]'
              }`}
            ></span>
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-[#c9e6ff] font-bold">
              {isCameraActive ? 'VIEWFINDER // LIVE OPTICAL SENSOR' : 'VIEWFINDER // RAW SENSOR FEED'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isCameraActive && (
              <button
                onClick={flipCamera}
                className="text-[10px] bg-[#39b8fd] text-[#001e2f] px-1.5 py-0.5 font-bold uppercase hover:bg-white cursor-pointer"
                title="Flip Camera"
                type="button"
              >
                FLIP
              </button>
            )}
            <span className="font-label-sm text-[10px] uppercase text-[#ffdcc3] font-bold">
              1200 DPI
            </span>
          </div>
        </div>

        {/* Viewfinder Screen */}
        <div className="relative w-full h-80 bg-[#e0d8d5] overflow-hidden shadow-[2px_2px_0px_#1e1b19] border border-[#1e1b19] select-none">
          {/* Live Video Feed or Static Background */}
          {isCameraActive ? (
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
          ) : capturedGrain ? (
            <img
              src={capturedGrain}
              alt="Captured rice grain"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              className="w-full h-full object-cover mix-blend-multiply opacity-95"
              alt="Raw basmati rice grains scattered across comic paper"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6nrLTDrhKal0BqrEMmnJHYN-WEGZVrNy9QDBhHnH8vKCZro4g_o-S2HQn6VW7HLecHsDOgmXzGBT2S0juath8y04Vi82X0_kBeUcg8R8-IwbPKZ3BHiY_fluWqL-zMhPm75-EChmMRAJPuwUVxTP-oYQYTUgdi9OREbAS9I898UqhEMs0h1xjoaBBfNufM3M9mc2yMAWwXhkQDYkNjqeQOA2Gw9bWbdVsVNaFj9-d0H5Nhv4NdpRsvA"
            />
          )}

          {/* Halftone Texture Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#8d4b00_1.5px,transparent_1.5px)] [background-size:8px_8px] opacity-15 pointer-events-none"></div>

          {/* Scanning animation beam */}
          {isScanning && (
            <div className="absolute inset-x-0 h-1 bg-[#39b8fd] shadow-[0_0_15px_#39b8fd] animate-pulse pointer-events-none top-1/2 -translate-y-1/2"></div>
          )}

          {/* Viewfinder Crosshairs (Brutalist HUD) */}
          <div className="absolute top-2 left-2 w-5 h-5 border-t-3 border-l-3 border-[#1e1b19] pointer-events-none"></div>
          <div className="absolute top-2 right-2 w-5 h-5 border-t-3 border-r-3 border-[#1e1b19] pointer-events-none"></div>
          <div className="absolute bottom-2 left-2 w-5 h-5 border-b-3 border-l-3 border-[#1e1b19] pointer-events-none"></div>
          <div className="absolute bottom-2 right-2 w-5 h-5 border-b-3 border-r-3 border-[#1e1b19] pointer-events-none"></div>

          {/* Center Target Box on Grain */}
          <div
            className={`absolute top-24 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer transition-transform duration-150 active:scale-95 ${
              selectedGrainIndex === 1 ? 'scale-100 opacity-100' : 'opacity-80'
            }`}
            onClick={() => {
              setSelectedGrainIndex(1);
              onToast('GRAIN #01 TARGET LOCKED');
            }}
          >
            {/* Floating Status Comic Badge */}
            <div className="bg-[#39b8fd] text-[#001e2f] px-2 py-0.5 shadow-[2px_2px_0px_#1e1b19] border border-[#1e1b19] mb-1.5 flex items-center gap-1 animate-bounce">
              <span className="material-symbols-outlined text-[14px]">stars</span>
              <span className="font-label-sm text-[9px] uppercase font-black tracking-tight">
                Selected Grain!
              </span>
            </div>

            {/* Cyan Pulse Ring surrounding the Rice Grain */}
            <div className="relative w-20 h-32 border-2 border-dashed border-[#006591] bg-[#c9e6ff]/25 shadow-[0_0_12px_rgba(57,184,253,0.6)] flex items-center justify-center backdrop-blur-[0.5px]">
              {/* Animated Corner Ticks */}
              <span className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-[#1e1b19]"></span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#1e1b19]"></span>
              <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-[#1e1b19]"></span>
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#1e1b19]"></span>

              {/* Grain SVG Silhouette */}
              <svg
                className="w-12 h-24 drop-shadow-[2px_2px_0px_#1e1b19]"
                fill="none"
                viewBox="0 0 40 80"
                xmlns="http://www.w3.org/2000/svg"
              >
                <ellipse
                  cx="20"
                  cy="40"
                  fill="#FFFDF9"
                  rx="14"
                  ry="34"
                  stroke="#1E1B19"
                  strokeWidth="3"
                ></ellipse>
                <path
                  d="M20 12 C 23 28, 23 52, 20 68"
                  stroke="#DBC2B0"
                  strokeDasharray="2 2"
                  strokeWidth="2"
                ></path>
              </svg>
            </div>

            {/* Monospaced Instruction Tag */}
            <div className="bg-[#ffffff] text-[#1e1b19] px-2 py-0.5 mt-1 shadow-[2px_2px_0px_#1e1b19] border border-[#1e1b19]">
              <span className="font-label-sm text-[9px] uppercase font-bold text-[#a33900]">
                Tap any grain to isolate PNG
              </span>
            </div>
          </div>

          {/* Secondary Grain targets in the field */}
          <button
            aria-label="Target alternate grain #02"
            onClick={() => {
              setSelectedGrainIndex(2);
              onToast('TARGET SHIFTED TO GRAIN #02');
            }}
            className={`absolute top-12 left-8 w-11 h-11 border-2 border-dashed flex items-center justify-center bg-[#ffffff]/80 shadow-[2px_2px_0px_#1e1b19] cursor-pointer ${
              selectedGrainIndex === 2 ? 'border-[#006591] bg-[#c9e6ff]' : 'border-[#1e1b19]/60'
            }`}
            type="button"
          >
            <span className="font-label-sm text-[11px] text-[#1e1b19] font-black">#02</span>
          </button>

          <button
            aria-label="Target alternate grain #03"
            onClick={() => {
              setSelectedGrainIndex(3);
              onToast('TARGET SHIFTED TO GRAIN #03');
            }}
            className={`absolute bottom-8 right-10 w-11 h-11 border-2 border-dashed flex items-center justify-center bg-[#ffffff]/80 shadow-[2px_2px_0px_#1e1b19] cursor-pointer ${
              selectedGrainIndex === 3 ? 'border-[#006591] bg-[#c9e6ff]' : 'border-[#1e1b19]/60'
            }`}
            type="button"
          >
            <span className="font-label-sm text-[11px] text-[#1e1b19] font-black">#03</span>
          </button>

          {/* Zoom Indicator HUD Badge */}
          <div className="absolute bottom-2 left-2 bg-[#1e1b19] text-[#fff8f5] px-2 py-0.5 flex items-center gap-1 shadow-[2px_2px_0px_#8d4b00] border border-[#8d4b00]">
            <span className="material-symbols-outlined text-[13px] text-[#ffdcc3]">zoom_in</span>
            <span className="font-label-sm text-[9px] font-bold">MAG: {zoomLevel.toFixed(1)}X</span>
          </div>

          {/* Live Camera shutter overlay button when camera is on */}
          {isCameraActive && (
            <button
              onClick={captureFromVideo}
              className="absolute bottom-3 right-3 bg-[#ba1a1a] text-[#ffffff] px-3 py-1.5 shadow-[3px_3px_0px_#1e1b19] border-2 border-[#1e1b19] flex items-center gap-1.5 font-headline-sm text-[13px] uppercase font-black active:translate-x-0.5 active:translate-y-0.5 cursor-pointer z-30"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">camera</span>
              SNAP GRAIN
            </button>
          )}
        </div>

        {/* Magic Cutout Status Bar */}
        <div className="mt-2 bg-[#f4ece8] p-2.5 flex items-center justify-between shadow-[2px_2px_0px_#1e1b19] border border-[#1e1b19]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#8d4b00] flex items-center justify-center text-[#ffffff] shadow-[1.5px_1.5px_0px_#1e1b19] border border-[#1e1b19]">
              <span className="material-symbols-outlined text-[16px]">auto_fix_high</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-[11px] text-[#1e1b19] uppercase tracking-tight font-bold">
                Instant Magic Cutout
              </span>
              <span className="font-body-sm text-[10px] text-[#a33900]">
                {capturedGrain
                  ? 'Custom Grain Ready & Transparent!'
                  : 'PNG Isolated! Transparent & Ready'}
              </span>
            </div>
          </div>
          <span className="bg-[#c9e6ff] text-[#001e2f] font-label-sm text-[9px] px-2 py-0.5 uppercase tracking-widest font-black shadow-[1px_1px_0px_#1e1b19] border border-[#1e1b19]">
            100% READY
          </span>
        </div>
      </div>

      {cameraError && (
        <div className="bg-[#ffdad6] text-[#93000a] p-2 border-2 border-[#ba1a1a] shadow-[2px_2px_0px_#1e1b19] text-[11px] font-bold">
          CAMERA NOTICE: {cameraError}. (You can still snap via the button or upload any photo).
        </div>
      )}

      {/* Primary Interactive Actions */}
      <div className="flex flex-col gap-2.5">
        {/* Main Call To Action Button */}
        <button
          className="w-full bg-[#8d4b00] hover:bg-[#b15f00] text-[#ffffff] py-3.5 px-4 shadow-[4px_4px_0px_#1e1b19] border-2 border-[#1e1b19] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1e1b19] transition-all flex items-center justify-between cursor-pointer"
          onClick={handleProceed}
          type="button"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px]">draw</span>
            <span className="font-headline-sm text-[18px] uppercase tracking-tight font-black">
              Pick Grain &amp; Write Name
            </span>
          </div>
          <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
        </button>

        {/* Secondary Capture/Upload Button */}
        <div className="grid grid-cols-2 gap-2">
          <button
            className="w-full bg-[#006591] hover:bg-[#39b8fd] text-[#ffffff] hover:text-[#001e2f] py-3 px-2 shadow-[4px_4px_0px_#1e1b19] border-2 border-[#1e1b19] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1e1b19] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            onClick={toggleCamera}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isCameraActive ? 'videocam_off' : 'photo_camera'}
            </span>
            <span className="font-label-lg text-[12px] uppercase tracking-wider font-black">
              {isCameraActive ? 'Close Lens' : 'Live Camera'}
            </span>
          </button>

          <button
            className="w-full bg-[#f4ece8] hover:bg-[#eee7e3] text-[#1e1b19] py-3 px-2 shadow-[4px_4px_0px_#1e1b19] border-2 border-[#1e1b19] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1e1b19] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">upload_file</span>
            <span className="font-label-lg text-[12px] uppercase tracking-wider font-black">
              Upload Photo
            </span>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      {/* Comic Sound-Effect Quick Tips Grid */}
      <div className="flex flex-col gap-1.5 mt-1">
        <div className="flex items-center gap-1.5 px-1">
          <span className="material-symbols-outlined text-[#8d4b00] text-[18px]">tips_and_updates</span>
          <span className="font-label-md text-[11px] uppercase tracking-wider text-[#1e1b19] font-bold">
            Field Guide &amp; Comic Tips
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {/* Callout Tip 1: SNAP! */}
          <div className="bg-[#ffffff] p-3 shadow-[3px_3px_0px_#1e1b19] border-2 border-[#1e1b19] relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="bg-[#8d4b00] text-[#ffffff] font-headline-sm text-[16px] px-1.5 py-0.5 uppercase tracking-tighter transform -rotate-3 inline-block shadow-[1px_1px_0px_#1e1b19] border border-[#1e1b19] font-black">
                SNAP!
              </span>
              <span className="material-symbols-outlined text-[#887364] text-[18px]">wb_sunny</span>
            </div>
            <p className="font-body-sm text-[11px] text-[#1e1b19] leading-tight mt-1">
              Keep bright natural light. Plain white paper makes rice cutout flawless!
            </p>
          </div>
          {/* Callout Tip 2: ZOOM! */}
          <div className="bg-[#ffffff] p-3 shadow-[3px_3px_0px_#1e1b19] border-2 border-[#1e1b19] relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="bg-[#006591] text-[#ffffff] font-headline-sm text-[16px] px-1.5 py-0.5 uppercase tracking-tighter transform rotate-2 inline-block shadow-[1px_1px_0px_#1e1b19] border border-[#1e1b19] font-black">
                ZOOM!
              </span>
              <span className="material-symbols-outlined text-[#887364] text-[18px]">
                center_focus_strong
              </span>
            </div>
            <p className="font-body-sm text-[11px] text-[#1e1b19] leading-tight mt-1">
              Pinch or tap to single out one unbroken, perfect slender grain.
            </p>
          </div>
        </div>
      </div>

      {/* Grain Preview Reel / Thumbnail Carousel */}
      <div className="bg-[#faf2ee] p-2 shadow-[3px_3px_0px_#1e1b19] border-2 border-[#1e1b19]">
        <div className="flex items-center justify-between mb-2">
          <span className="font-label-sm text-[9px] uppercase tracking-widest text-[#554336] font-bold">
            RECENT GRAINS CAPTURED
          </span>
          <span className="font-label-sm text-[9px] text-[#8d4b00] uppercase font-black">
            BATCH #89
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {/* Thumbnail 1 (Active) */}
          <div
            onClick={() => {
              setSelectedGrainIndex(1);
              setZoomLevel(4.8);
            }}
            className={`aspect-square bg-[#ffffff] shadow-[2px_2px_0px_#8d4b00] border-2 p-1 flex flex-col items-center justify-center relative cursor-pointer ${
              selectedGrainIndex === 1 ? 'border-[#8d4b00]' : 'border-[#1e1b19]'
            }`}
          >
            {selectedGrainIndex === 1 && (
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#8d4b00]"></span>
            )}
            <svg className="w-4 h-9" viewBox="0 0 20 40">
              <ellipse
                cx="10"
                cy="20"
                fill="#F4ECE8"
                rx="7"
                ry="17"
                stroke="#1E1B19"
                strokeWidth="1.5"
              ></ellipse>
            </svg>
            <span className="font-label-sm text-[9px] text-[#8d4b00] font-black mt-1">#01</span>
          </div>

          {/* Thumbnail 2 */}
          <div
            onClick={() => {
              setSelectedGrainIndex(2);
              setZoomLevel(5.2);
            }}
            className="aspect-square bg-[#ffffff] shadow-[2px_2px_0px_#1e1b19] border-2 border-[#1e1b19] p-1 flex flex-col items-center justify-center opacity-85 hover:opacity-100 cursor-pointer"
          >
            <svg className="w-4 h-9" viewBox="0 0 20 40">
              <ellipse
                cx="10"
                cy="20"
                fill="#F4ECE8"
                rx="6"
                ry="16"
                stroke="#1E1B19"
                strokeWidth="1.5"
              ></ellipse>
            </svg>
            <span className="font-label-sm text-[9px] text-[#554336] font-black mt-1">#02</span>
          </div>

          {/* Thumbnail 3 */}
          <div
            onClick={() => {
              setSelectedGrainIndex(3);
              setZoomLevel(4.2);
            }}
            className="aspect-square bg-[#ffffff] shadow-[2px_2px_0px_#1e1b19] border-2 border-[#1e1b19] p-1 flex flex-col items-center justify-center opacity-85 hover:opacity-100 cursor-pointer"
          >
            <svg className="w-4 h-9" viewBox="0 0 20 40">
              <ellipse
                cx="10"
                cy="20"
                fill="#F4ECE8"
                rx="7"
                ry="18"
                stroke="#1E1B19"
                strokeWidth="1.5"
              ></ellipse>
            </svg>
            <span className="font-label-sm text-[9px] text-[#554336] font-black mt-1">#03</span>
          </div>

          {/* Add New Grain Slot */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square bg-[#e9e1dd] shadow-[2px_2px_0px_#1e1b19] border-2 border-[#1e1b19] p-1 flex flex-col items-center justify-center hover:bg-[#f4ece8] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#8d4b00] text-[20px]">add</span>
            <span className="font-label-sm text-[9px] text-[#8d4b00] uppercase font-black mt-0.5">
              NEW
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
