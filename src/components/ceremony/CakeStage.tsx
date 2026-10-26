import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, CheckCircle2, Heart, Mic, Wind, Flame } from 'lucide-react';
import { Typewriter } from '../common/Typewriter';
import { SmokeParticles } from './SmokeParticles';
import { ConfettiCanvas } from './ConfettiCanvas';

interface CakeStageProps {
  onCeremonyComplete: () => void;
}

interface Point {
  x: number;
  y: number;
}

type SwipeVectorType = 'horizontal' | 'vertical' | 'diagonal';

interface CutData {
  angleDeg: number;
  vectorType: SwipeVectorType;
  start: Point;
  end: Point;
  mid: Point;
  tangent: Point;
  normal: Point;
  polygonA: string;
  polygonB: string;
  distance: number;
  timestamp: number;
}

// Minimum threshold in local SVG units to distinguish intentional slice from accidental micro-gestures
const MIN_SWIPE_DISTANCE = 48;

export const CakeStage: React.FC<CakeStageProps> = ({ onCeremonyComplete }) => {
  // Trolley arrival state
  const [trolleySettled, setTrolleySettled] = useState(false);

  // Candles: false = unlit, true = ignited (blow into mic to ignite!)
  const [candles, setCandles] = useState<boolean[]>([false, false, false]);
  const [smokingCandles, setSmokingCandles] = useState<boolean[]>([false, false, false]);
  const [areCandlesIgnited, setAreCandlesIgnited] = useState(false);
  const [ignitionSparkle, setIgnitionSparkle] = useState(false);

  // Microphone and blow detection states
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [blowProgress, setBlowProgress] = useState(0);
  const [currentVolume, setCurrentVolume] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const progressRef = useRef(0);

  // Slicing states
  const [isCut, setIsCut] = useState(false);
  const [activeCut, setActiveCut] = useState<CutData | null>(null);
  const [cutHistory, setCutHistory] = useState<CutData[]>([]);
  const [burstOrigin, setBurstOrigin] = useState<{ x: number; y: number } | null>(null);

  // Pointer & swipe tracking
  const [isPointerActive, setIsPointerActive] = useState(false);
  const [swipeTrail, setSwipeTrail] = useState<Point[]>([]);
  const [swipeHint, setSwipeHint] = useState<string | null>(null);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<number | null>(null);

  const pointerStartRef = useRef<Point | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Trolley arrives smoothly and settles after 1.4s
  useEffect(() => {
    const arrivalTimer = setTimeout(() => {
      setTrolleySettled(true);
    }, 1400);
    return () => clearTimeout(arrivalTimer);
  }, []);

  // Guarantee page scrolling is strictly prevented during cake interaction on all mobile and touch devices
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const preventDefaultScroll = (e: TouchEvent) => {
      // Prevent browser default pull-to-refresh or page scrolling while interacting with the cake
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    container.addEventListener('touchmove', preventDefaultScroll, { passive: false });
    container.addEventListener('touchstart', preventDefaultScroll, { passive: false });

    return () => {
      container.removeEventListener('touchmove', preventDefaultScroll);
      container.removeEventListener('touchstart', preventDefaultScroll);
    };
  }, []);

  // When cake is cut, auto-advance after 3.8s celebration
  useEffect(() => {
    if (isCut) {
      const timer = window.setTimeout(() => {
        onCeremonyComplete();
      }, 3800);
      setAutoAdvanceTimer(3.8);

      const countdown = setInterval(() => {
        setAutoAdvanceTimer((prev) => (prev && prev > 0.5 ? Math.round((prev - 0.5) * 10) / 10 : 0));
      }, 500);

      return () => {
        clearTimeout(timer);
        clearInterval(countdown);
      };
    }
  }, [isCut, onCeremonyComplete]);

  // Convert client viewport coordinates (clientX, clientY) accurately to local SVG coordinate space (viewBox 0 0 500 360)
  const getSvgCoordinates = useCallback((clientX: number, clientY: number): Point | null => {
    const svg = svgRef.current;
    if (!svg) return null;

    try {
      const pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      const ctm = svg.getScreenCTM();
      if (ctm) {
        const transformed = pt.matrixTransform(ctm.inverse());
        return { x: transformed.x, y: transformed.y };
      }
    } catch {
      // Fallback calculation using bounding client rect
    }

    const rect = svg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    return {
      x: ((clientX - rect.left) / rect.width) * 500,
      y: ((clientY - rect.top) / rect.height) * 360,
    };
  }, []);

  // Cleanup audio & mic on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Web Audio magical arpeggio chime on candle ignition
  const playIgnitionSound = useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      // Sparkling harmonic arpeggio (C5, E5, G5, C6)
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + idx * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.65);
      });
    } catch {
      // Audio synthesis fallback
    }
  }, []);

  // Ignite all candles and enable cake cutting
  const triggerCandleIgnition = useCallback(() => {
    // Stop microphone stream & analysis
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }

    setMicActive(false);
    setBlowProgress(100);
    setCandles([true, true, true]);
    setAreCandlesIgnited(true);
    setIgnitionSparkle(true);
    playIgnitionSound();

    // Haptic vibration feedback on successful candle ignition
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([100, 50, 150]);
      } catch {
        // Haptic not supported or blocked
      }
    }

    setTimeout(() => {
      setIgnitionSparkle(false);
    }, 2400);
  }, [playIgnitionSound]);

  // Start microphone listener and analyze breath/blow sound pressure
  const startListening = async () => {
    try {
      setMicError(null);
      progressRef.current = 0;
      setBlowProgress(0);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.25;
      source.connect(analyser);
      analyserRef.current = analyser;

      setMicActive(true);

      const timeBuffer = new Float32Array(analyser.fftSize);
      const freqBuffer = new Uint8Array(analyser.frequencyBinCount);

      const checkAudio = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getFloatTimeDomainData(timeBuffer);
        analyserRef.current.getByteFrequencyData(freqBuffer);

        // 1. Calculate RMS audio volume
        let sumSq = 0;
        for (let i = 0; i < timeBuffer.length; i++) {
          sumSq += timeBuffer[i] * timeBuffer[i];
        }
        const rms = Math.sqrt(sumSq / timeBuffer.length);

        // 2. Blowing creates strong turbulence in lower frequency bins
        let lowFreqSum = 0;
        const checkBins = Math.min(25, freqBuffer.length);
        for (let i = 0; i < checkBins; i++) {
          lowFreqSum += freqBuffer[i];
        }
        const lowAvg = lowFreqSum / checkBins;

        // Visual breeze intensity (0 - 100%)
        const visualVol = Math.min(100, Math.round(rms * 450));
        setCurrentVolume(visualVol);

        // Blow detection criteria: breath turbulence or significant volume
        const isBlowing = rms > 0.05 || lowAvg > 38;

        if (isBlowing) {
          progressRef.current = Math.min(100, progressRef.current + 8);
        } else {
          progressRef.current = Math.max(0, progressRef.current - 2);
        }

        setBlowProgress(progressRef.current);

        if (progressRef.current >= 100) {
          triggerCandleIgnition();
          return;
        }

        animationFrameRef.current = requestAnimationFrame(checkAudio);
      };

      animationFrameRef.current = requestAnimationFrame(checkAudio);
    } catch (err: unknown) {
      console.warn('Microphone permission or hardware error:', err);
      setMicError('Microphone not available or blocked. You can tap below to ignite directly!');
      setMicActive(false);
    }
  };

  // Classify swipe vector orientation (horizontal, vertical, diagonal)
  const classifyVector = (dx: number, dy: number): { type: SwipeVectorType; angleDeg: number } => {
    const angleRad = Math.atan2(dy, dx);
    const angleDeg = (angleRad * 180) / Math.PI;
    const absAngle = Math.abs(angleDeg);

    // Horizontal: within 25 degrees of 0 or 180
    if (absAngle <= 25 || absAngle >= 155) {
      return { type: 'horizontal', angleDeg };
    }
    // Vertical: within 25 degrees of 90
    if (absAngle >= 65 && absAngle <= 115) {
      return { type: 'vertical', angleDeg };
    }
    // Diagonal: all intermediate angles
    return { type: 'diagonal', angleDeg };
  };

  // Calculate geometric cut vector, unit normal, and bounding clipping polygons for SVG masking
  const computeCutData = (start: Point, end: Point): CutData => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.hypot(dx, dy) || 1;

    // Unit tangent vector along cut path
    const tx = dx / distance;
    const ty = dy / distance;

    // Unit normal vector perpendicular to cut path (-ty, tx)
    const nx = -ty;
    const ny = tx;

    // Midpoint of cut in local SVG space
    const mx = (start.x + end.x) / 2;
    const my = (start.y + end.y) / 2;

    const { type: vectorType, angleDeg } = classifyVector(dx, dy);

    // Extend cut line far beyond SVG viewBox (R = 2500)
    const R = 2500;
    const p1 = { x: mx - R * tx, y: my - R * ty };
    const p2 = { x: mx + R * tx, y: my + R * ty };

    // Side A polygon: extends into positive normal (+N) half-plane
    const a3 = { x: p2.x + R * nx, y: p2.y + R * ny };
    const a4 = { x: p1.x + R * nx, y: p1.y + R * ny };
    const polygonA = `${p1.x.toFixed(1)},${p1.y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)} ${a3.x.toFixed(1)},${a3.y.toFixed(1)} ${a4.x.toFixed(1)},${a4.y.toFixed(1)}`;

    // Side B polygon: extends into negative normal (-N) half-plane
    const b3 = { x: p1.x - R * nx, y: p1.y - R * ny };
    const b4 = { x: p2.x - R * nx, y: p2.y - R * ny };
    const polygonB = `${p2.x.toFixed(1)},${p2.y.toFixed(1)} ${p1.x.toFixed(1)},${p1.y.toFixed(1)} ${b3.x.toFixed(1)},${b3.y.toFixed(1)} ${b4.x.toFixed(1)},${b4.y.toFixed(1)}`;

    return {
      angleDeg,
      vectorType,
      start,
      end,
      mid: { x: mx, y: my },
      tangent: { x: tx, y: ty },
      normal: { x: nx, y: ny },
      polygonA,
      polygonB,
      distance,
      timestamp: Date.now(),
    };
  };

  // Pointer event gesture handlers with coordinate space mapping & micro-gesture filtering
  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    // Prevent default scroll behavior
    e.preventDefault();

    if (!trolleySettled) return;

    if (!areCandlesIgnited) {
      setSwipeHint('Pehle mic mein phoonk maar kar candles jalao! 🎙️💨 (Blow into mic to light the candles first)');
      setTimeout(() => setSwipeHint(null), 3500);
      return;
    }

    const coords = getSvgCoordinates(e.clientX, e.clientY);
    if (!coords) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture is not supported
    }

    pointerStartRef.current = coords;
    setIsPointerActive(true);
    setSwipeTrail([coords]);
    setSwipeHint(null);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!areCandlesIgnited || !isPointerActive || !pointerStartRef.current) return;
    e.preventDefault();

    const coords = getSvgCoordinates(e.clientX, e.clientY);
    if (!coords) return;

    setSwipeTrail((prev) => {
      const next = [...prev, coords];
      return next.length > 16 ? next.slice(next.length - 16) : next;
    });

    const dx = coords.x - pointerStartRef.current.x;
    const dy = coords.y - pointerStartRef.current.y;
    const distance = Math.hypot(dx, dy);

    // Threshold check: once pointer travels beyond MIN_SWIPE_DISTANCE, trigger deliberate cut
    if (distance >= MIN_SWIPE_DISTANCE) {
      const cut = computeCutData(pointerStartRef.current, coords);
      setActiveCut(cut);
      setCutHistory((prev) => [...prev, cut]);
      setBurstOrigin({ x: e.clientX, y: e.clientY });
      setIsCut(true);
      setIsPointerActive(false);
      pointerStartRef.current = null;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!areCandlesIgnited) {
      setIsPointerActive(false);
      pointerStartRef.current = null;
      return;
    }

    if (isPointerActive && pointerStartRef.current) {
      const coords = getSvgCoordinates(e.clientX, e.clientY) || pointerStartRef.current;
      const distance = Math.hypot(coords.x - pointerStartRef.current.x, coords.y - pointerStartRef.current.y);

      // Ignore micro-gestures (< MIN_SWIPE_DISTANCE) and prompt user
      if (distance >= MIN_SWIPE_DISTANCE - 6) {
        const cut = computeCutData(pointerStartRef.current, coords);
        setActiveCut(cut);
        setCutHistory((prev) => [...prev, cut]);
        setBurstOrigin({ x: e.clientX, y: e.clientY });
        setIsCut(true);
      } else if (!isCut) {
        setSwipeHint('Accidental tap! Cake par lamba swipe karein! 🍰');
        setTimeout(() => setSwipeHint(null), 3000);
      }
    }

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }

    setIsPointerActive(false);
    pointerStartRef.current = null;
    setTimeout(() => setSwipeTrail([]), 350);
  };

  const handlePointerCancel = (e: React.PointerEvent<SVGSVGElement>) => {
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }
    setIsPointerActive(false);
    pointerStartRef.current = null;
    setSwipeTrail([]);
  };

  // Separation distance for the cut pieces along the normal vector
  const separationDistance = isCut ? 26 : 0;
  const normal = activeCut?.normal || { x: 0, y: 1 };
  const pieceATransform = `translate(${normal.x * separationDistance}px, ${normal.y * separationDistance}px)`;
  const pieceBTransform = `translate(${-normal.x * separationDistance}px, ${-normal.y * separationDistance}px)`;

  // Generate SVG path for live swipe blade trail
  const swipeTrailPath =
    swipeTrail.length > 1
      ? swipeTrail.reduce((acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`), '')
      : '';

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-6 max-w-4xl mx-auto z-10 text-center select-none text-[#54263D]">
      {/* Canvas Confetti Explosion upon Cake Cut */}
      <ConfettiCanvas trigger={isCut} origin={burstOrigin} />

      {/* Title Header */}
      <div className="mb-3 space-y-1.5">
        <span className="text-xs tracking-widest uppercase text-[#B98575] font-semibold flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#EFA7C4]" />
          <span>Saalgirah Ki Rasam • Royal Barbie Celebration Cake</span>
          <Sparkles className="w-3.5 h-3.5 text-[#EFA7C4]" />
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#54263D] tracking-tight">
          Cake & Candle Ceremony
        </h2>
        <div className="text-sm text-[#834F6A] max-w-lg mx-auto min-h-[2.5rem] flex items-center justify-center">
          {!trolleySettled ? (
            <span className="italic font-serif text-[#B98575] animate-pulse">
              Joy Bear aur Star Bunny trolley par Barbie cake le kar aa rahe hain... 🌸
            </span>
          ) : !areCandlesIgnited ? (
            <Typewriter
              text="Mic mein phoonk maar kar candles jalao! (Blow into microphone to ignite candles 🕯️💨)"
              speedMs={25}
              showSkip={false}
            />
          ) : !isCut ? (
            <div className="flex items-center gap-2 text-base font-serif font-bold text-[#54263D] animate-pulse">
              <Sparkles className="w-4 h-4 text-[#B98575]" />
              <span>Candles roshan ho gayin! Ab cake ko swipe karke cut karo! 🎂</span>
              <Sparkles className="w-4 h-4 text-[#B98575]" />
            </div>
          ) : (
            <div className="text-emerald-700 font-semibold flex flex-col items-center justify-center gap-0.5 animate-in fade-in duration-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  Cake kamyabi se cut ho gaya! ({activeCut?.vectorType ? `${activeCut.vectorType.toUpperCase()} SWIPE` : 'PERFECT CUT'}) 💖
                </span>
              </span>
              <span className="text-[11px] text-[#834F6A] font-mono">
                Agla manzar shuru ho raha hai... {autoAdvanceTimer !== null ? `(${autoAdvanceTimer}s)` : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Decorated Trolley & Cake Assembly */}
      <div
        className={`relative w-full max-w-xl transition-all duration-1000 ease-out flex flex-col items-center ${
          !trolleySettled ? '-translate-x-28 opacity-0' : 'translate-x-0 opacity-100'
        }`}
      >
        {/* Companions escorting trolley */}
        <div className="w-full flex items-center justify-between px-6 mb-1">
          {/* Joy Bear */}
          <div className="flex flex-col items-center group">
            <div
              className={`w-12 h-12 rounded-full bg-gradient-to-br from-[#FFE4EC] to-[#F8C8DC] border-2 border-[#B98575]/60 flex items-center justify-center text-2xl shadow-md transition-transform ${
                !trolleySettled ? 'animate-bounce' : isCut ? 'animate-bounce' : 'group-hover:scale-105'
              }`}
            >
              🧸
            </div>
            <span className="text-[11px] text-[#834F6A] font-serif font-bold mt-1">Joy Bear</span>
            <span className="text-[9px] text-[#B98575]">
              {isCut ? 'Mubarak! 🎉' : 'Pushing Trolley'}
            </span>
          </div>

          <div className="text-center px-2">
            <span className="text-xs font-serif text-[#B98575] font-semibold italic block">
              Royal Barbie-Doll Confectionery Trolley
            </span>
            <span className="text-[10px] text-[#834F6A] font-medium">
              Pure Brotherhood & Respect • Shona Bhai
            </span>
          </div>

          {/* Star Bunny */}
          <div className="flex flex-col items-center group">
            <div
              className={`w-12 h-12 rounded-full bg-gradient-to-br from-[#FFE4EC] to-[#F8C8DC] border-2 border-[#B98575]/60 flex items-center justify-center text-2xl shadow-md transition-transform ${
                !trolleySettled ? 'animate-bounce delay-150' : isCut ? 'animate-bounce delay-150' : 'group-hover:scale-105'
              }`}
            >
              🐰
            </div>
            <span className="text-[11px] text-[#834F6A] font-serif font-bold mt-1">Star Bunny</span>
            <span className="text-[9px] text-[#B98575]">
              {isCut ? 'Celebration! ✨' : 'Guiding Wheels'}
            </span>
          </div>
        </div>

        {/* Interactive Microphone & Blow Console */}
        {trolleySettled && !areCandlesIgnited && (
          <div className="w-full max-w-sm mx-auto mb-2 px-3.5 py-2.5 rounded-2xl bg-[#FFE4EC]/90 border border-[#B98575]/40 shadow-md flex flex-col items-center gap-1.5 animate-in fade-in zoom-in-95 duration-300 z-30">
            {!micActive ? (
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full justify-center">
                <button
                  type="button"
                  onClick={startListening}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#B98575] via-[#EFA7C4] to-[#B98575] text-[#FFFAFC] font-serif font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                >
                  <Mic className="w-4 h-4 animate-pulse" />
                  <span>Mic On Karein & Phoonk Maarein 💨</span>
                </button>
                <button
                  type="button"
                  onClick={triggerCandleIgnition}
                  className="text-[11px] text-[#834F6A] hover:text-[#54263D] underline cursor-pointer font-medium py-1 px-1.5"
                >
                  Ya Tap Kar Ke Ignite Karein ✨
                </button>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center gap-1.5">
                <div className="flex items-center justify-between w-full text-xs font-serif font-bold text-[#54263D]">
                  <span className="flex items-center gap-1.5 text-emerald-800 animate-pulse">
                    <Wind className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                    <span>Mic Active: Mic mein phoonk maarein! 💨</span>
                  </span>
                  <span className="text-[11px] font-mono font-bold text-[#B98575]">{blowProgress}%</span>
                </div>
                {/* Blow Progress Intensity Bar */}
                <div className="w-full h-3 bg-[#FFFAFC] rounded-full overflow-hidden border border-[#B98575]/40 p-0.5 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-[#B98575] via-[#EFA7C4] to-[#54263D] rounded-full transition-all duration-75 shadow-[0_0_8px_rgba(239,167,196,0.9)]"
                    style={{ width: `${Math.max(4, blowProgress)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between w-full text-[10px] text-[#834F6A]">
                  <span className="italic">Audio level: {currentVolume}%</span>
                  <button
                    type="button"
                    onClick={triggerCandleIgnition}
                    className="underline hover:text-[#54263D] cursor-pointer font-serif"
                  >
                    Tap to Ignite Directly ✨
                  </button>
                </div>
              </div>
            )}
            {micError && (
              <div className="flex items-center gap-2 text-[10px] text-amber-900 font-medium bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                <span>{micError}</span>
                <button
                  type="button"
                  onClick={triggerCandleIgnition}
                  className="underline font-bold text-[#54263D] cursor-pointer"
                >
                  Ignite Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* Candles Ignited Banner */}
        {areCandlesIgnited && !isCut && (
          <div className="mb-2 px-3.5 py-1 rounded-full bg-[#FFE4EC] border border-amber-400/60 shadow-sm flex items-center gap-2 text-xs font-serif font-bold text-[#54263D] animate-in fade-in duration-300 z-30">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-bounce" />
            <span>Candles Roshan Ho Gayin! Ab Cake Ko Swipe Kar Ke Cut Karein! 🎂✨</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>
        )}

        {/* 3 Candles on top: unlit -> blow into mic to ignite */}
        <div className="flex items-end justify-center gap-8 sm:gap-12 -mb-5 z-30">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              onClick={() => {
                if (!areCandlesIgnited) {
                  triggerCandleIgnition();
                }
              }}
              disabled={!trolleySettled}
              aria-label={`Candle ${idx + 1} - ${candles[idx] ? 'Ignited' : 'Unlit (blow into mic or tap to ignite)'}`}
              className={`relative flex flex-col items-center focus:outline-none p-1.5 transition-transform ${
                !areCandlesIgnited
                  ? 'cursor-pointer hover:scale-110 active:scale-95'
                  : 'cursor-default opacity-95'
              }`}
            >
              {/* Flame or Unlit Wick */}
              <div className="h-9 w-6 flex items-center justify-center relative overflow-visible">
                {candles[idx] ? (
                  <div className="w-3.5 h-6 rounded-full bg-gradient-to-t from-[#B98575] via-[#F7E7CE] to-amber-100 animate-flame shadow-[0_0_16px_rgba(239,167,196,0.95)]" />
                ) : (
                  <div className="w-1 h-3 bg-stone-700 rounded-full mt-4 shadow-xs" />
                )}
                {smokingCandles[idx] && <SmokeParticles />}
                {ignitionSparkle && candles[idx] && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-ping">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </div>
                )}
              </div>

              {/* Candle Body */}
              <div className="w-3.5 h-9 rounded-t-sm bg-gradient-to-b from-[#FFFAFC] via-[#F8C8DC] to-[#EFA7C4] border-x border-[#B98575]/40 shadow-xs relative">
                <div className="w-0.5 h-2 bg-stone-700 mx-auto -mt-2" />
              </div>

              <span className="text-[9px] text-[#B98575] font-sans mt-0.5 font-bold tracking-tight">
                {candles[idx] ? '🔥 Lit' : '💨 Blow/Tap'}
              </span>
            </button>
          ))}
        </div>

        {/* Floating Hint Pill */}
        {swipeHint && (
          <div className="absolute top-12 z-40 px-3.5 py-1 rounded-full bg-[#54263D] text-[#FFFAFC] text-[11px] font-medium shadow-xl animate-bounce">
            {swipeHint}
          </div>
        )}

        {/* Swipe Instruction Banner above cake when ready */}
        {areCandlesIgnited && !isCut && (
          <div className="absolute top-16 z-40 pointer-events-none animate-pulse">
            <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#B98575] via-[#EFA7C4] to-[#B98575] text-[#FFFAFC] font-serif font-bold text-xs shadow-xl border border-white/40">
              <Sparkles className="w-3.5 h-3.5 text-[#F7E7CE]" />
              <span>Swipe in any direction (horizontal, vertical, or diagonal)!</span>
              <Sparkles className="w-3.5 h-3.5 text-[#F7E7CE]" />
            </div>
          </div>
        )}

        {/* Interactive SVG Cake Canvas Container with strictly disabled scroll gestures */}
        <div
          ref={containerRef}
          style={{ touchAction: 'none' }}
          className="relative w-full max-w-lg aspect-[500/360] flex items-center justify-center touch-none select-none"
        >
          <svg
            ref={svgRef}
            viewBox="0 0 500 360"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            style={{ touchAction: 'none' }}
            className={`w-full h-full overflow-visible touch-none select-none ${
              areCandlesIgnited && !isCut ? 'cursor-crosshair' : 'cursor-not-allowed'
            }`}
          >
            <defs>
              {/* Dynamic Clipping Masks for Separated Halves */}
              <clipPath id="cake-clip-piece-a">
                {activeCut ? (
                  <polygon points={activeCut.polygonA} />
                ) : (
                  <rect x="-1000" y="-1000" width="3000" height="3000" />
                )}
              </clipPath>

              <clipPath id="cake-clip-piece-b">
                {activeCut ? (
                  <polygon points={activeCut.polygonB} />
                ) : (
                  <rect x="-1000" y="-1000" width="3000" height="3000" />
                )}
              </clipPath>

              {/* Shimmer & Glow Filters */}
              <filter id="cake-shimmer" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#54263D" floodOpacity="0.18" />
              </filter>
              <filter id="cut-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Luxury Gradients */}
              <linearGradient id="barbie-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F7E7CE" />
                <stop offset="50%" stopColor="#B98575" />
                <stop offset="100%" stopColor="#8A5A44" />
              </linearGradient>

              <linearGradient id="tier1-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFF0F5" />
                <stop offset="60%" stopColor="#FFE4EC" />
                <stop offset="100%" stopColor="#F8C8DC" />
              </linearGradient>

              <linearGradient id="tier2-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFE4EC" />
                <stop offset="50%" stopColor="#F8C8DC" />
                <stop offset="100%" stopColor="#EFA7C4" />
              </linearGradient>

              <linearGradient id="tier3-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F8C8DC" />
                <stop offset="50%" stopColor="#EFA7C4" />
                <stop offset="100%" stopColor="#D89B8C" />
              </linearGradient>

              <linearGradient id="blade-spark-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFAFC" />
                <stop offset="50%" stopColor="#B98575" />
                <stop offset="100%" stopColor="#EFA7C4" />
              </linearGradient>

              {/* Exposed Cake Interior Sponge & Strawberry Cream Pattern */}
              <linearGradient id="sponge-interior-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#54263D" />
                <stop offset="25%" stopColor="#FFF0F5" />
                <stop offset="50%" stopColor="#EFA7C4" />
                <stop offset="75%" stopColor="#F7E7CE" />
                <stop offset="100%" stopColor="#54263D" />
              </linearGradient>

              {/* Master Barbie Cake Graphic Definition */}
              <g id="master-barbie-cake" filter="url(#cake-shimmer)">
                {/* Cake Platter Base */}
                <ellipse cx="250" cy="330" rx="195" ry="16" fill="url(#barbie-gold)" />
                <ellipse cx="250" cy="328" rx="190" ry="13" fill="#FFFAFC" opacity="0.9" />
                {/* Platter Pearls */}
                {Array.from({ length: 24 }).map((_, i) => {
                  const angle = (i / 24) * Math.PI;
                  const px = 250 + 185 * Math.cos(angle);
                  const py = 328 + 11 * Math.sin(angle);
                  return <circle key={`plat-${i}`} cx={px} cy={py} r="2.5" fill="url(#barbie-gold)" />;
                })}

                {/* TIER 3: Grand Ballerina Skirt Flounce (Bottom Tier) */}
                <path
                  d="M 85 320 C 85 240, 110 230, 150 230 L 350 230 C 390 230, 415 240, 415 320 Z"
                  fill="url(#tier3-grad)"
                  stroke="#B98575"
                  strokeWidth="1.5"
                />
                {/* Tier 3 Ruffles & Swags */}
                <path
                  d="M 95 315 Q 150 330 205 315 Q 250 330 295 315 Q 350 330 405 315"
                  fill="none"
                  stroke="#FFFAFC"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 115 285 Q 180 300 250 285 Q 320 300 385 285"
                  fill="none"
                  stroke="url(#barbie-gold)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Tier 3 Pearl Drop Garlands */}
                {[130, 170, 210, 250, 290, 330, 370].map((cx, i) => (
                  <circle key={`t3-pearl-${i}`} cx={cx} cy={275 + (i % 2) * 5} r="3" fill="#FFFAFC" />
                ))}
                {/* Rose Gold Badge on Tier 3 */}
                <rect x="180" y="285" width="140" height="20" rx="10" fill="#FFFAFC" opacity="0.85" />
                <text
                  x="250"
                  y="298"
                  textAnchor="middle"
                  fill="#54263D"
                  fontSize="8.5"
                  fontWeight="bold"
                  fontFamily="Cinzel, serif"
                  letterSpacing="1.5"
                >
                  ROYAL CELEBRATION • 2026
                </text>

                {/* TIER 2: Quilted Diamond Tier (Middle Tier) */}
                <rect
                  x="145"
                  y="155"
                  width="210"
                  height="75"
                  rx="10"
                  fill="url(#tier2-grad)"
                  stroke="#B98575"
                  strokeWidth="1.5"
                />
                {/* Quilted Diamond Lattice Pattern */}
                <path
                  d="M 155 165 L 210 225 M 190 165 L 245 225 M 225 165 L 280 225 M 260 165 L 315 225 M 295 165 L 345 220"
                  stroke="#FFFAFC"
                  strokeWidth="1.2"
                  opacity="0.65"
                />
                <path
                  d="M 345 165 L 290 225 M 310 165 L 255 225 M 275 165 L 220 225 M 240 165 L 185 225 M 205 165 L 155 220"
                  stroke="#FFFAFC"
                  strokeWidth="1.2"
                  opacity="0.65"
                />
                {/* Gold Beads at Lattice Intersections */}
                {[
                  [182, 195],
                  [218, 195],
                  [250, 195],
                  [282, 195],
                  [318, 195],
                ].map(([bx, by], i) => (
                  <circle key={`bead-${i}`} cx={bx} cy={by} r="2.5" fill="url(#barbie-gold)" />
                ))}
                {/* Middle Tier Cameo Ribbon */}
                <g>
                  <rect
                    x="170"
                    y="180"
                    width="160"
                    height="24"
                    rx="12"
                    fill="#FFFAFC"
                    stroke="#B98575"
                    strokeWidth="1.5"
                    filter="url(#cake-shimmer)"
                  />
                  <text
                    x="250"
                    y="196"
                    textAnchor="middle"
                    fill="#54263D"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="Cinzel, serif"
                    letterSpacing="1"
                  >
                    BLACK ROSE MT
                  </text>
                </g>

                {/* TIER 1: Bodice Ruffle Tier (Top Tier) */}
                <path
                  d="M 185 155 C 185 100, 205 90, 250 90 C 295 90, 315 100, 315 155 Z"
                  fill="url(#tier1-grad)"
                  stroke="#B98575"
                  strokeWidth="1.5"
                />
                {/* Rosette Rim around Top Tier */}
                {Array.from({ length: 9 }).map((_, i) => {
                  const rx = 195 + i * 13.5;
                  return (
                    <g key={`rosette-${i}`}>
                      <circle cx={rx} cy="155" r="5" fill="#FFE4EC" stroke="#B98575" strokeWidth="0.8" />
                      <circle cx={rx} cy="155" r="2.5" fill="#EFA7C4" />
                    </g>
                  );
                })}

                {/* Barbie Royal Tiara / Crown Topper */}
                <g transform="translate(250, 80)">
                  <path
                    d="M -30 0 L -25 -18 L -12 -8 L 0 -26 L 12 -8 L 25 -18 L 30 0 Z"
                    fill="url(#barbie-gold)"
                    stroke="#FFFAFC"
                    strokeWidth="1"
                  />
                  <circle cx="0" cy="-26" r="3" fill="#FFFAFC" />
                  <circle cx="-25" cy="-18" r="2.5" fill="#EFA7C4" />
                  <circle cx="25" cy="-18" r="2.5" fill="#EFA7C4" />
                  <circle cx="0" cy="-10" r="2.5" fill="#54263D" />
                </g>
              </g>
            </defs>

            {/* Cake Piece A (Positive Normal Half) with Independent SVG Translation */}
            <g
              clipPath={isCut ? 'url(#cake-clip-piece-a)' : undefined}
              style={{
                transform: pieceATransform,
                transition: 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
                willChange: 'transform',
              }}
            >
              <use href="#master-barbie-cake" />

              {/* Cut Surface Highlight & Sponge Cross-Section */}
              {isCut && activeCut && (
                <g filter="url(#cut-glow)">
                  <line
                    x1={activeCut.start.x}
                    y1={activeCut.start.y}
                    x2={activeCut.end.x}
                    y2={activeCut.end.y}
                    stroke="url(#sponge-interior-grad)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <line
                    x1={activeCut.start.x}
                    y1={activeCut.start.y}
                    x2={activeCut.end.x}
                    y2={activeCut.end.y}
                    stroke="#FFFAFC"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                </g>
              )}
            </g>

            {/* Cake Piece B (Negative Normal Half) with Independent SVG Translation */}
            <g
              clipPath={isCut ? 'url(#cake-clip-piece-b)' : undefined}
              style={{
                transform: pieceBTransform,
                transition: 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
                willChange: 'transform',
              }}
            >
              <use href="#master-barbie-cake" />

              {/* Cut Surface Highlight & Sponge Cross-Section */}
              {isCut && activeCut && (
                <g filter="url(#cut-glow)">
                  <line
                    x1={activeCut.start.x}
                    y1={activeCut.start.y}
                    x2={activeCut.end.x}
                    y2={activeCut.end.y}
                    stroke="url(#sponge-interior-grad)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <line
                    x1={activeCut.start.x}
                    y1={activeCut.start.y}
                    x2={activeCut.end.x}
                    y2={activeCut.end.y}
                    stroke="#B98575"
                    strokeWidth="1.5"
                  />
                </g>
              )}
            </g>

            {/* Historical Cut Seams if Multiple Slices Were Made */}
            {cutHistory.map((hist, idx) => (
              <line
                key={`cut-hist-${idx}`}
                x1={hist.start.x}
                y1={hist.start.y}
                x2={hist.end.x}
                y2={hist.end.y}
                stroke="#FFFAFC"
                strokeWidth="2"
                opacity="0.8"
                strokeDasharray="3 3"
              />
            ))}

            {/* Live Swipe Blade Trail with Shimmering Particles */}
            {isPointerActive && swipeTrailPath && (
              <g filter="url(#cut-glow)" pointerEvents="none">
                <path
                  d={swipeTrailPath}
                  fill="none"
                  stroke="url(#blade-spark-gradient)"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {swipeTrail[swipeTrail.length - 1] && (
                  <circle
                    cx={swipeTrail[swipeTrail.length - 1].x}
                    cy={swipeTrail[swipeTrail.length - 1].y}
                    r="6"
                    fill="#FFFAFC"
                    stroke="#B98575"
                    strokeWidth="2"
                  />
                )}
              </g>
            )}

            {/* Celebration Sparks Bursting Outward Upon Cut */}
            {isCut && activeCut && (
              <g pointerEvents="none" className="animate-in fade-in duration-500">
                {[-35, -20, 0, 20, 35].map((offset, i) => {
                  const cx = activeCut.mid.x + activeCut.normal.x * offset + (i % 2) * 12;
                  const cy = activeCut.mid.y + activeCut.normal.y * offset - 15;
                  return (
                    <g key={`sparkle-${i}`} transform={`translate(${cx}, ${cy})`}>
                      <circle cx="0" cy="0" r="3" fill="#B98575" />
                      <path d="M -6 0 L 6 0 M 0 -6 L 0 6" stroke="#FFFAFC" strokeWidth="1.5" />
                    </g>
                  );
                })}
              </g>
            )}
          </svg>
        </div>

        {/* Decorated Tea Trolley Stand with Rolling Wheels */}
        <div className="w-full max-w-md -mt-4 flex flex-col items-center">
          {/* Trolley Top Shelf */}
          <div className="w-84 sm:w-96 h-2.5 rounded-full bg-gradient-to-r from-[#B98575] via-[#F8C8DC] to-[#B98575] shadow-xs" />

          {/* Trolley Frame Legs */}
          <div className="w-72 sm:w-80 flex justify-between h-9 items-center px-4">
            <div className="w-2 h-full bg-gradient-to-b from-[#B98575] to-[#D89B8C] rounded-full shadow-inner" />
            <div className="text-[10px] text-[#834F6A] font-serif italic flex items-center gap-1">
              <Heart className="w-3 h-3 text-[#EFA7C4] fill-[#EFA7C4]" />
              <span>Royal Confectionery Trolley</span>
              <Heart className="w-3 h-3 text-[#EFA7C4] fill-[#EFA7C4]" />
            </div>
            <div className="w-2 h-full bg-gradient-to-b from-[#B98575] to-[#D89B8C] rounded-full shadow-inner" />
          </div>

          {/* Trolley Bottom Rail & Moving Wheels */}
          <div className="w-80 sm:w-92 flex items-center justify-between px-6 -mt-1">
            {/* Left Rolling Wheel */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full border-2 border-[#B98575] bg-[#FFFAFC] shadow-sm flex items-center justify-center ${
                  !trolleySettled ? 'animate-spin' : ''
                }`}
              >
                <div className="w-3 h-3 rounded-full bg-[#B98575]" />
              </div>
            </div>

            <div className="flex-1 h-1 bg-[#B98575]/40 mx-2 rounded-full" />

            {/* Right Rolling Wheel */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full border-2 border-[#B98575] bg-[#FFFAFC] shadow-sm flex items-center justify-center ${
                  !trolleySettled ? 'animate-spin' : ''
                }`}
              >
                <div className="w-3 h-3 rounded-full bg-[#B98575]" />
              </div>
            </div>
          </div>
        </div>

        {/* Celebration Announcement */}
        {isCut && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-serif text-[#834F6A] animate-pulse">
            <span>🎉 Mubarak Ho! Cake kamyabi se cut ho gaya! Shona Bhai ki duaen aap ke sath hain! 🌸</span>
          </div>
        )}
      </div>
    </div>
  );
};
