"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface AudioPlayerProps {
  musicUrl: string;
  autoplay?: boolean;
  targetVolume?: number;
  fadeInDuration?: number;
  fadeOutDuration?: number;
  loopFadeDuration?: number;
}

export default function AudioPlayer({
  musicUrl,
  autoplay = true,
  targetVolume = 1.0,
  fadeInDuration = 2000,
  fadeOutDuration = 1500,
  loopFadeDuration = 2500,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeAnimRef = useRef<number | null>(null);
  const loopStateRef = useRef<'idle' | 'fading_out' | 'fading_in'>('idle');
  const isPlayingRef = useRef(false);
  const isUserPausedRef = useRef(false);
  const cleanupListenersRef = useRef<(() => void) | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const cancelFade = useCallback(() => {
    if (fadeAnimRef.current !== null) {
      cancelAnimationFrame(fadeAnimRef.current);
      fadeAnimRef.current = null;
    }
  }, []);

  const fadeTo = useCallback(
    (targetVol: number, duration: number, onComplete?: () => void) => {
      const audio = audioRef.current;
      if (!audio) return;

      cancelFade();

      const startVol = audio.volume;
      // If already at target volume, invoke callback immediately
      if (Math.abs(startVol - targetVol) < 0.005 || duration <= 0) {
        try {
          audio.volume = targetVol;
        } catch {}
        onComplete?.();
        return;
      }

      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);

        // Smooth quadratic ease-in-out curve for natural auditory perception
        const ease =
          progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        const currentVol = startVol + (targetVol - startVol) * ease;
        try {
          audio.volume = Math.max(0, Math.min(1, currentVol));
        } catch {}

        if (progress < 1) {
          fadeAnimRef.current = requestAnimationFrame(step);
        } else {
          fadeAnimRef.current = null;
          try {
            audio.volume = targetVol;
          } catch {}
          onComplete?.();
        }
      };

      fadeAnimRef.current = requestAnimationFrame(step);
    },
    [cancelFade]
  );

  const playWithFadeIn = useCallback(
    (duration = fadeInDuration) => {
      const audio = audioRef.current;
      if (!audio) return;

      loopStateRef.current = 'idle';
      isPlayingRef.current = true;
      setIsPlaying(true);

      if (audio.paused) {
        try {
          audio.volume = 0;
        } catch {}
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              if (isPlayingRef.current) {
                fadeTo(targetVolume, duration);
              }
            })
            .catch((err) => {
              console.warn("Audio playback was prevented:", err);
              isPlayingRef.current = false;
              setIsPlaying(false);
            });
        } else {
          fadeTo(targetVolume, duration);
        }
      } else {
        fadeTo(targetVolume, duration);
      }
    },
    [fadeInDuration, targetVolume, fadeTo]
  );

  const pauseWithFadeOut = useCallback(
    (duration = fadeOutDuration) => {
      const audio = audioRef.current;
      if (!audio) return;

      loopStateRef.current = 'idle';
      isPlayingRef.current = false;
      setIsPlaying(false);

      fadeTo(0, duration, () => {
        // Only pause if playback hasn't been resumed during the fade
        if (!isPlayingRef.current && audioRef.current) {
          audioRef.current.pause();
        }
      });
    },
    [fadeOutDuration, fadeTo]
  );

  useEffect(() => {
    const audio = new Audio(musicUrl);
    audio.loop = true;
    try {
      audio.volume = 0;
    } catch {}
    audioRef.current = audio;

    let interactionHandled = false;
    const events = ['click', 'touchstart', 'touchend', 'wheel', 'keydown'] as const;

    const cleanupInteractionListeners = () => {
      events.forEach((e) => document.removeEventListener(e, unlockAudio, true));
    };
    cleanupListenersRef.current = cleanupInteractionListeners;

    const unlockAudio = () => {
      if (!interactionHandled && autoplay && !isUserPausedRef.current) {
        interactionHandled = true;
        cleanupInteractionListeners();
        playWithFadeIn(fadeInDuration);
      }
    };

    const onTimeUpdate = () => {
      const el = audioRef.current;
      if (!el || !isPlayingRef.current) return;

      const duration = el.duration;
      const currentTime = el.currentTime;

      if (isNaN(duration) || !isFinite(duration) || duration <= 8) return;

      const fadeSeconds = loopFadeDuration / 1000;
      const timeLeft = duration - currentTime;

      // 1. Approaching end of track: gently fade out before the loop boundary
      if (timeLeft <= fadeSeconds && timeLeft > 0 && loopStateRef.current === 'idle') {
        loopStateRef.current = 'fading_out';
        fadeTo(0, Math.max(500, timeLeft * 1000));
      }

      // 2. Track looped back to beginning: smoothly swell back in
      if (
        loopStateRef.current === 'fading_out' &&
        currentTime < duration - fadeSeconds - 1
      ) {
        loopStateRef.current = 'fading_in';
        fadeTo(targetVolume, fadeInDuration, () => {
          loopStateRef.current = 'idle';
        });
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);

    if (autoplay) {
      events.forEach((e) => document.addEventListener(e, unlockAudio, true));
    }

    return () => {
      cleanupInteractionListeners();
      cancelFade();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [musicUrl, autoplay, fadeInDuration, loopFadeDuration, targetVolume, playWithFadeIn, fadeTo, cancelFade]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    cleanupListenersRef.current?.();

    if (isPlayingRef.current) {
      isUserPausedRef.current = true;
      pauseWithFadeOut();
    } else {
      isUserPausedRef.current = false;
      playWithFadeIn();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] pointer-events-auto">
      <button
        onClick={togglePlay}
        className="relative flex items-center justify-center w-12 h-12 bg-[#3D0A14]/90 backdrop-blur-md rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-[#C9A961]/30 text-[#C9A961] hover:bg-[#3D0A14] transition-all duration-300 group cursor-pointer active:scale-95"
        aria-label={isPlaying ? "Pause Music" : "Play Music"}
        title={isPlaying ? "Pause Music" : "Play Music"}
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
