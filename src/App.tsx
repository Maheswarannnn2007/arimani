import React, { useState, useEffect } from 'react';
import { TabType, GrainItem } from './types';
import { INITIAL_GRAINS } from './data/initialGrains';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ScanAndPickScreen } from './components/ScanAndPickScreen';
import { WriteNameScreen } from './components/WriteNameScreen';
import { MyGrainsScreen } from './components/MyGrainsScreen';
import { ComicToast } from './components/ComicToast';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('my-grains');
  const [grains, setGrains] = useState<GrainItem[]>(() => {
    try {
      const stored = localStorage.getItem('arimanihub_grains');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read saved grains:', e);
    }
    return INITIAL_GRAINS;
  });

  const [capturedGrainImage, setCapturedGrainImage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('arimanihub_grains', JSON.stringify(grains));
    } catch (e) {
      console.warn('Could not save grains to localStorage:', e);
    }
  }, [grains]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2400);
  };

  const handleSaveGrain = (newGrain: GrainItem) => {
    setGrains((prev) => [newGrain, ...prev]);
  };

  const handleProceedToWriteName = (img?: string) => {
    if (img) {
      setCapturedGrainImage(img);
    }
    setCurrentTab('write-name');
  };

  const handleCameraHeaderClick = () => {
    setCurrentTab('scan-&-pick');
    showToast('ACTIVATING CAMERA VIEWFINDER...');
  };

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#1e1b19] flex flex-col selection:bg-[#39b8fd] selection:text-[#004666]">
      {/* Fixed Comic Header */}
      <Header
        currentTab={currentTab}
        onCameraClick={handleCameraHeaderClick}
        grainsCount={grains.length}
      />

      {/* Main Screen Content */}
      <main className="flex-1 w-full overflow-y-auto">
        {currentTab === 'scan-&-pick' && (
          <ScanAndPickScreen
            onProceedToWriteName={handleProceedToWriteName}
            onToast={showToast}
          />
        )}

        {currentTab === 'write-name' && (
          <WriteNameScreen
            capturedGrainImage={capturedGrainImage}
            onSaveGrain={handleSaveGrain}
            onToast={showToast}
            onNavigateToVault={() => setCurrentTab('my-grains')}
          />
        )}

        {currentTab === 'my-grains' && (
          <MyGrainsScreen
            grains={grains}
            onInscribeNew={() => setCurrentTab('write-name')}
            onToast={showToast}
          />
        )}
      </main>

      {/* Floating Retro Comic Toast */}
      <ComicToast message={toastMessage} />

      {/* Fixed Bottom Navigation */}
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
}
