'use client';

import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { zzfx } from 'zzfx';

interface SoundContextType {
  playHover: () => void;
  playClick: () => void;
  playSuccess: () => void;
  playError: () => void;
  playStart: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Initialize sound preference from local storage
  useEffect(() => {
    const saved = localStorage.getItem('soundEnabled');
    if (saved !== null) {
      // eslint-disable-next-line
      setSoundEnabled(saved === 'true');
    }
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const newValue = !prev;
      localStorage.setItem('soundEnabled', String(newValue));
      return newValue;
    });
  }, []);

  const playSound = useCallback((...params: (number | undefined)[]) => {
    if (soundEnabled) {
      try {
        zzfx(...params);
      } catch (e) {
        console.error('Audio playback failed', e);
      }
    }
  }, [soundEnabled]);

  // Generated ZzFX sounds
  // Hover: Short high blip
  const playHover = useCallback(() => {
    playSound(1.1,.05,568,0,.03,0,1,1.6,0,0,568,.06,0,0,0,0,.06,.55,.03,0); 
  }, [playSound]);

  // Click: Standard UI select
  const playClick = useCallback(() => {
    playSound(1.05,0,226,.02,.06,.13,1,1.6,0,0,0,0,0,.1,0,0,0,.66,.05,0);
  }, [playSound]);

  // Success: Ascending major arpeggio
  const playSuccess = useCallback(() => {
    playSound(1.02,0,367,.06,.21,.34,1,1.7,0,0,0,0,0,0,0,0,.08,.68,.06,.16);
  }, [playSound]);

  // Error: Low buzz
  const playError = useCallback(() => {
    playSound(1.05,0,126,.08,.23,.34,3,2.8,0,0,0,0,0,.4,0,0,.1,.56,.08,.16);
  }, [playSound]);

  // Start: Power up sound
  const playStart = useCallback(() => {
    playSound(1.01,0,209,.04,.29,.46,0,1.4,-5.6,0,0,0,0,0,0,0,.08,.62,.07,.06);
  }, [playSound]);

  return (
    <SoundContext.Provider value={{ 
      playHover, 
      playClick, 
      playSuccess, 
      playError, 
      playStart,
      soundEnabled, 
      toggleSound 
    }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}
