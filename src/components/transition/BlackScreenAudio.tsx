import React, { useState, useEffect, useRef } from 'react';
import { APP_CONFIG } from '../../config/content';

interface BlackScreenAudioProps {
  onComplete: () => void;
}

type Phase = 'SILENCE_5S' | 'HEARTBEAT' | 'CROWD_CHEER';

export const BlackScreenAudio: React.FC<BlackScreenAudioProps> = ({ onComplete }) => {
  const onCompleteRef = useRef(onComplete);
  const [phase, setPhase] = useState<Phase>('SILENCE_5S');
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const crowdAudioCtxRef = useRef<AudioContext | null>(null);
  const hasTriggeredCompleteRef = useRef(false);

  // Keep latest onComplete callback in ref without re-triggering the timer effect
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const videoId = APP_CONFIG.mediaUrls.blackScreenAudioVideoId || '-EMmxkqvoPQ';

  // Real heartbeat synthesis via Web Audio API so sound is guaranteed
  const startHeartbeatSynth = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      // Heartbeat pulse rhythm: Lub-dub pairs at ~1.1s intervals across the 5.5s duration
      const beatTimes = [0.25, 1.35, 2.45, 3.55, 4.65];
      const now = ctx.currentTime;

      beatTimes.forEach((t) => {
        // "Lub" pulse (lower frequency thump)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(65, now + t);
        osc1.frequency.exponentialRampToValueAtTime(32, now + t + 0.12);
        gain1.gain.setValueAtTime(0, now + t);
        gain1.gain.linearRampToValueAtTime(0.45, now + t + 0.02);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + t + 0.15);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now + t);
        osc1.stop(now + t + 0.16);

        // "Dub" pulse (0.13s after Lub, slightly firmer)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(82, now + t + 0.13);
        osc2.frequency.exponentialRampToValueAtTime(38, now + t + 0.25);
        gain2.gain.setValueAtTime(0, now + t + 0.13);
        gain2.gain.linearRampToValueAtTime(0.55, now + t + 0.15);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + t + 0.27);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + t + 0.13);
        osc2.stop(now + t + 0.29);
      });
    } catch {
      // Audio synthesis fallback
    }
  };

  // Cleanly stop heartbeat audio immediately to prevent track overlap
  const stopHeartbeat = () => {
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      try {
        audioCtxRef.current.close().catch(() => {});
      } catch {
        // Ignored
      }
    }
    if (iframeRef.current) {
      try {
        iframeRef.current.src = 'about:blank';
      } catch {
        // Ignored
      }
    }
  };

  // High-fidelity Happy Birthday crowd audio & cheering synthesis
  const startCrowdAudioSynth = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      crowdAudioCtxRef.current = ctx;

      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;

      // 1. Crowd Cheering & Applause synthesis via filtered modulated pink noise
      const bufferSize = ctx.sampleRate * 5.5;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2 + white * 0.5362) * 0.14;
      }

      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = noiseBuffer;

      // Bandpass filter to shape the human collective crowd cheer formant
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1150, now);
      filter.Q.setValueAtTime(1.2, now);

      // Cheering swell gain envelope
      const crowdGain = ctx.createGain();
      crowdGain.gain.setValueAtTime(0.01, now);
      crowdGain.gain.linearRampToValueAtTime(0.42, now + 0.8);
      crowdGain.gain.linearRampToValueAtTime(0.48, now + 2.5);
      crowdGain.gain.exponentialRampToValueAtTime(0.005, now + 5.2);

      noiseNode.connect(filter);
      filter.connect(crowdGain);
      crowdGain.connect(ctx.destination);
      noiseNode.start(now);
      noiseNode.stop(now + 5.4);

      // 2. Celebratory "Happy Birthday" harmonic vocal chime arpeggios
      // Notes: G4, G4, A4, G4, C5, B4 ("Hap-py Birth-day to you...")
      const melody = [
        { f: 392.00, t: 0.1, d: 0.35 },
        { f: 392.00, t: 0.5, d: 0.35 },
        { f: 440.00, t: 0.9, d: 0.7 },
        { f: 392.00, t: 1.7, d: 0.7 },
        { f: 523.25, t: 2.5, d: 0.7 },
        { f: 493.88, t: 3.3, d: 1.2 },
      ];

      melody.forEach(({ f, t, d }) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + t);
        g.gain.setValueAtTime(0.001, now + t);
        g.gain.linearRampToValueAtTime(0.22, now + t + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, now + t + d);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now + t);
        osc.stop(now + t + d + 0.05);
      });
    } catch {
      // Audio synthesis fallback
    }
  };

  const stopCrowdAudio = () => {
    if (crowdAudioCtxRef.current && crowdAudioCtxRef.current.state !== 'closed') {
      try {
        crowdAudioCtxRef.current.close().catch(() => {});
      } catch {
        // Ignored
      }
    }
  };

  const handleFinish = () => {
    if (hasTriggeredCompleteRef.current) return;
    hasTriggeredCompleteRef.current = true;

    stopHeartbeat();
    stopCrowdAudio();

    try {
      onCompleteRef.current?.();
    } catch (err) {
      console.error('Error invoking black screen onComplete:', err);
    }
  };

  // Monotonic, non-resetting multi-phase timeline:
  // Phase 1: 5.0s of complete silence (0 to 5000ms)
  // Phase 2: 5.5s of heartbeat sound & subtle pink pulse (5000ms to 10500ms)
  // Phase 3: Happy Birthday crowd audio allowed to finish (10500ms to 16000ms)
  // Phase 4: Advances to Cake Ceremony with zero track overlap
  useEffect(() => {
    hasTriggeredCompleteRef.current = false;
    const startTime = Date.now();

    const SILENCE_MS = 5000;   // Exactly 5 seconds total silence
    const HEARTBEAT_MS = 5500; // 5.5 seconds heartbeat sound & subtle pink pulse
    const CROWD_AUDIO_MS = 5500; // Crowd cheering audio allowed to finish
    const TOTAL_MS = SILENCE_MS + HEARTBEAT_MS + CROWD_AUDIO_MS;

    // Step 2: Transition from silence to heartbeat at 5000ms
    const heartbeatTimer = setTimeout(() => {
      setPhase('HEARTBEAT');
      startHeartbeatSynth();
    }, SILENCE_MS);

    // Step 3: Transition from heartbeat to crowd audio at 10500ms
    const crowdAudioTimer = setTimeout(() => {
      stopHeartbeat();
      setPhase('CROWD_CHEER');
      startCrowdAudioSynth();
    }, SILENCE_MS + HEARTBEAT_MS);

    // Step 4: Complete and transition to cake entrance
    const completeTimer = setTimeout(() => {
      handleFinish();
    }, TOTAL_MS);

    // Watchdog interval ensures tab throttling never leaves app stuck
    const watchdogInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= TOTAL_MS) {
        handleFinish();
      } else if (elapsed >= SILENCE_MS + HEARTBEAT_MS && phase !== 'CROWD_CHEER') {
        stopHeartbeat();
        setPhase('CROWD_CHEER');
      } else if (elapsed >= SILENCE_MS && phase === 'SILENCE_5S') {
        setPhase('HEARTBEAT');
      }
    }, 200);

    return () => {
      clearTimeout(heartbeatTimer);
      clearTimeout(crowdAudioTimer);
      clearTimeout(completeTimer);
      clearInterval(watchdogInterval);
      stopHeartbeat();
      stopCrowdAudio();
    };
  }, []); // Strictly empty dependency array: NEVER restarts or clears prematurely

  return (
    <div
      className="fixed inset-0 z-50 bg-[#000000] flex flex-col items-center justify-center overflow-hidden cursor-none select-none"
      aria-label="Pure Black Audio Interlude"
    >
      {/* Stage 2: 5s Complete Silence - screen is pure black with nothing visible or audible */}

      {/* Stage 3: Heartbeat & subtle pink heartbeat animation (only active during HEARTBEAT phase) */}
      {phase === 'HEARTBEAT' && (
        <div
          className="w-56 h-56 rounded-full bg-[#EFA7C4]/25 blur-3xl pointer-events-none animate-pulse"
          style={{ animationDuration: '1.1s' }}
        />
      )}

      {/* Stage 4: Crowd celebration audio visual ambiance (subtle sparkling warmth on pure black) */}
      {phase === 'CROWD_CHEER' && (
        <div className="relative flex flex-col items-center justify-center pointer-events-none">
          <div
            className="w-72 h-72 rounded-full bg-[#F8C8DC]/20 blur-3xl pointer-events-none animate-pulse"
            style={{ animationDuration: '0.8s' }}
          />
        </div>
      )}

      {/* Hidden YouTube IFrame playing audio from -EMmxkqvoPQ only during HEARTBEAT phase */}
      {phase === 'HEARTBEAT' && (
        <iframe
          ref={iframeRef}
          className="w-1 h-1 opacity-0 pointer-events-none absolute"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&controls=0&playsinline=1`}
          title="Black Screen Audio"
          allow="autoplay"
        />
      )}
    </div>
  );
};
