import { useState, useEffect, useCallback, useRef } from 'react';
import { UnlockVerificationData } from '../types';

export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalRemainingMs: number;
  isUnlocked: boolean;
  isPreview: boolean;
  isLoading: boolean;
  error: string | null;
  serverOffsetMs: number;
  isTampered: boolean;
}

export function useServerTime(previewToken: string | null = null) {
  const [state, setState] = useState<CountdownState>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalRemainingMs: Infinity,
    isUnlocked: false,
    isPreview: false,
    isLoading: true,
    error: null,
    serverOffsetMs: 0,
    isTampered: false,
  });

  // Monotonic reference baselines (immune to device clock manipulation)
  const serverBaselineRef = useRef<number>(Date.now());
  const perfBaselineRef = useRef<number>(performance.now());
  const targetRef = useRef<number>(1794855600000); // 17 Nov 2026, 00:00 PKT
  const isPreviewRef = useRef<boolean>(false);
  const serverUnlockedRef = useRef<boolean>(false);

  const syncWithServer = useCallback(async () => {
    try {
      const headers: Record<string, string> = {};
      if (previewToken) {
        headers['x-admin-preview-token'] = previewToken;
      }

      const res = await fetch('/api/verify-unlock', { headers });
      if (!res.ok) throw new Error('Server verification failed');
      const data: UnlockVerificationData = await res.json();

      // Record monotonic baselines from trusted server response
      serverBaselineRef.current = data.serverTime;
      perfBaselineRef.current = performance.now();
      targetRef.current = data.target;
      isPreviewRef.current = Boolean(data.isPreview);
      serverUnlockedRef.current = Boolean(data.unlocked);

      const remainingMs = Math.max(0, data.target - data.serverTime);

      const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

      const localClockOffset = data.serverTime - Date.now();
      // Detect if user's local clock is manipulated by > 2 minutes
      const hasClockTamper = Math.abs(localClockOffset) > 120000;

      setState({
        days,
        hours,
        minutes,
        seconds,
        totalRemainingMs: remainingMs,
        isUnlocked: Boolean(data.unlocked),
        isPreview: Boolean(data.isPreview),
        isLoading: false,
        error: null,
        serverOffsetMs: localClockOffset,
        isTampered: hasClockTamper,
      });
    } catch {
      // Fallback: strictly maintain locked state if offline
      const elapsed = performance.now() - perfBaselineRef.current;
      const effectiveNow = serverBaselineRef.current + elapsed;
      const target = targetRef.current;
      const remainingMs = Math.max(0, target - effectiveNow);

      const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

      setState((prev) => ({
        ...prev,
        days,
        hours,
        minutes,
        seconds,
        totalRemainingMs: remainingMs,
        isUnlocked: serverUnlockedRef.current, // NEVER grant unlock unless confirmed by server!
        isLoading: false,
        error: 'Offline time fallback active',
      }));
    }
  }, [previewToken]);

  // Initial server sync & periodic resync every 20 seconds
  useEffect(() => {
    syncWithServer();
    const syncInterval = setInterval(syncWithServer, 20000);
    return () => clearInterval(syncInterval);
  }, [syncWithServer]);

  // High-frequency tick using monotonic elapsed performance.now()
  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = performance.now() - perfBaselineRef.current;
      const effectiveNow = serverBaselineRef.current + elapsed;
      const target = targetRef.current;
      const remainingMs = Math.max(0, target - effectiveNow);

      const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

      // Check device clock disparity
      const localDisparity = Math.abs(Date.now() - effectiveNow);
      const isTampered = localDisparity > 120000;

      // In preview mode or once remaining reaches 0 on monotonic clock, check server unlock
      const isMonotonicallyFinished = remainingMs <= 0;
      const isUnlocked = isPreviewRef.current
        ? isMonotonicallyFinished
        : serverUnlockedRef.current && isMonotonicallyFinished;

      setState((prev) => ({
        ...prev,
        days,
        hours,
        minutes,
        seconds,
        totalRemainingMs: remainingMs,
        isUnlocked,
        isPreview: isPreviewRef.current,
        isTampered,
      }));
    }, 250);

    return () => clearInterval(timer);
  }, []);

  return {
    ...state,
    syncWithServer,
  };
}
