"use client";

import React, { useState, useEffect, useRef } from 'react';

export default function AudioPlayer({ musicUrl, autoplay = true }: { musicUrl: string, autoplay?: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Only initialized on client
    const audio = new Audio(musicUrl);
    audio.loop = true;
    audioRef.current = audio;

    let interactionHandled = false;

    const events = ['click', 'touchstart', 'touchend', 'wheel', 'keydown'];

    const unlockAudio = () => {
      if (!interactionHandled) {
        interactionHandled = true;
        setHasInteracted(true);
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.then(() => setIsPlaying(true)).catch(() => {
            // if play fails, reset so next interaction can try
            interactionHandled = false;
            setHasInteracted(false);
          });
        }
        events.forEach(e => document.removeEventListener(e, unlockAudio, true));
      }
    };

    events.forEach(e => document.addEventListener(e, unlockAudio, true));

    return () => {
      audio.pause();
      audio.src = '';
      events.forEach(e => document.removeEventListener(e, unlockAudio, true));
    };
  }, [musicUrl]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-60">
      <button
        onClick={togglePlay}
        className="relative flex items-center justify-center w-12 h-12 bg-[#3D0A14]/90 backdrop-blur-md rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-[#C9A961]/30 text-[#C9A961] hover:bg-[#3D0A14] transition-all duration-300 group"
        aria-label={isPlaying ? "Pause Music" : "Play Music"}
      >
        {isPlaying ? (
          <div className="flex space-x-[2px] items-end h-4 w-4 justify-center">
            <span className="w-1 h-3/4 bg-[#C9A961] animate-pulse"></span>
            <span className="w-1 h-full bg-[#C9A961] animate-[pulse_1s_ease-in-out_infinite_reverse]"></span>
            <span className="w-1 h-1/2 bg-[#C9A961] animate-[pulse_1.5s_ease-in-out_infinite]"></span>
          </div>
        ) : (
          <svg className="w-5 h-5 -ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        )}
      </button>
    </div>
  );
}
