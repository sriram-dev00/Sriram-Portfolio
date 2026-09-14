import { useState, useEffect, useRef, useCallback } from 'react';

export function useAudioEngine() {
  const [isPlaying, setIsPlaying] = useState<boolean>(() => {
    try {
      return localStorage.getItem('portfolio_audio') === 'enabled';
    } catch {
      return false;
    }
  });

  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthNodesRef = useRef<{
    osc1: OscillatorNode;
    osc2: OscillatorNode;
    gainNode: GainNode;
  } | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  const initSynthDrone = useCallback(() => {
    if (audioCtxRef.current) {
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      return;
    }

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;

      const ctx = new AudioCtxClass();
      audioCtxRef.current = ctx;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, ctx.currentTime); // A1 note
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(110, ctx.currentTime); // A2 harmonic

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);

      gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 2.5);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();

      synthNodesRef.current = { osc1, osc2, gainNode };
    } catch (err) {
      console.warn('Web Audio synthesis drone unavailable:', err);
    }
  }, []);

  const stopSynthDrone = useCallback(() => {
    if (synthNodesRef.current && audioCtxRef.current) {
      try {
        synthNodesRef.current.gainNode.gain.linearRampToValueAtTime(
          0.0001,
          audioCtxRef.current.currentTime + 0.5
        );
      } catch {
        // Gain ramp failed, ignore
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
      audioCtxRef.current.suspend().catch(() => {});
    }
  }, []);

  const enableAudio = useCallback((userInitiated = true) => {
    if (!audioElRef.current) {
      const audio = new Audio('/media/ambient.mp3');
      audio.loop = true;
      audio.volume = 0.5;
      audioElRef.current = audio;
    }

    audioElRef.current
      .play()
      .then(() => {
        stopSynthDrone();
        setIsPlaying(true);
        try {
          localStorage.setItem('portfolio_audio', 'enabled');
        } catch {}
      })
      .catch(() => {
        // Synthesizer drone delivers atmospheric fallback ambiance if ambient.mp3 cannot be autoplayed
        initSynthDrone();
        setIsPlaying(true);
        try {
          localStorage.setItem('portfolio_audio', 'enabled');
        } catch {}
        if (userInitiated && audioCtxRef.current?.state === 'suspended') {
          audioCtxRef.current.resume().catch(() => {});
        }
      });
  }, [initSynthDrone, stopSynthDrone]);

  const disableAudio = useCallback(() => {
    if (audioElRef.current) {
      audioElRef.current.pause();
    }
    stopSynthDrone();
    setIsPlaying(false);
    try {
      localStorage.setItem('portfolio_audio', 'disabled');
    } catch {}
  }, [stopSynthDrone]);

  const toggleAudio = useCallback(() => {
    if (isPlaying) {
      disableAudio();
    } else {
      enableAudio(true);
    }
  }, [isPlaying, enableAudio, disableAudio]);

  useEffect(() => {
    return () => {
      if (audioElRef.current) {
        audioElRef.current.pause();
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return { isPlaying, enableAudio, disableAudio, toggleAudio };
}
