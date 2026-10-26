import { useState, useEffect, useRef, useCallback } from 'react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export interface PlayerControls {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  hasAudioPermission: boolean;
  isReady: boolean;
  activeTrack: 'none' | 'video_10s' | 'teaser_6s' | 'birthday_anthem';
  error: string | null;
  grantAudioPermission: () => void;
  playBirthdaySong: () => void;
  pauseBirthdaySong: () => void;
  togglePlayPause: () => void;
  toggleMute: () => void;
  setVolume: (val: number) => void;
  stopAll: () => void;
}

export function useYouTubePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(85);
  const [hasAudioPermission, setHasAudioPermission] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [activeTrack, setActiveTrack] = useState<'none' | 'video_10s' | 'teaser_6s' | 'birthday_anthem'>('none');
  const [error, setError] = useState<string | null>(null);

  const playerInstanceRef = useRef<any>(null);
  const isApiReadyRef = useRef<boolean>(false);
  const pendingPlayRef = useRef<boolean>(false);

  // Initialize YouTube IFrame API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      isApiReadyRef.current = true;
      initPlayer();
      return;
    }

    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      isApiReadyRef.current = true;
      if (previousCallback) previousCallback();
      initPlayer();
    };

    if (!document.getElementById('yt-iframe-api-script')) {
      const tag = document.createElement('script');
      tag.id = 'yt-iframe-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  const initPlayer = useCallback(() => {
    const container = document.getElementById('yt-birthday-player-container');
    if (!container || !window.YT || !window.YT.Player || playerInstanceRef.current) return;

    try {
      playerInstanceRef.current = new window.YT.Player('yt-birthday-player-container', {
        height: '1',
        width: '1',
        videoId: 'sqkzN2Ye_pk',
        playerVars: {
          autoplay: 0,
          controls: 0,
          enablejsapi: 1,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: any) => {
            setIsReady(true);
            event.target.setVolume(volume);
            if (pendingPlayRef.current) {
              pendingPlayRef.current = false;
              try {
                event.target.playVideo();
                setIsPlaying(true);
              } catch {
                setError('Autoplay restricted by browser. Tap Play button.');
              }
            }
          },
          onStateChange: (event: any) => {
            // YT.PlayerState: 1 = PLAYING, 2 = PAUSED, 0 = ENDED
            if (event.data === 1) {
              setIsPlaying(true);
              setError(null);
            } else if (event.data === 2 || event.data === 0) {
              setIsPlaying(false);
            }
          },
          onError: (event: any) => {
            // Error codes: 2 = invalid param, 100 = not found, 101/150 = embed blocked
            console.warn('YouTube Player Event Error:', event.data);
            setError('YouTube playback restricted or network issue. Use audio controls.');
          },
        },
      });
    } catch (e: any) {
      console.warn('Could not initialize YT.Player instance:', e);
      setIsReady(true);
    }
  }, [volume]);

  const grantAudioPermission = useCallback(() => {
    setHasAudioPermission(true);
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
      }
    } catch {
      // Ignored
    }
  }, []);

  const playBirthdaySong = useCallback(() => {
    setActiveTrack('birthday_anthem');
    const player = playerInstanceRef.current;

    if (!player || !player.playVideo) {
      pendingPlayRef.current = true;
      initPlayer();
      return;
    }

    try {
      player.unMute();
      player.setVolume(volume);
      player.playVideo();
      setIsPlaying(true);
      setError(null);
    } catch {
      setError('Autoplay blocked. Tap Play on the music dock.');
    }
  }, [volume, initPlayer]);

  const pauseBirthdaySong = useCallback(() => {
    const player = playerInstanceRef.current;
    if (player?.pauseVideo) {
      try {
        player.pauseVideo();
      } catch {
        // Ignored
      }
    }
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pauseBirthdaySong();
    } else {
      playBirthdaySong();
    }
  }, [isPlaying, pauseBirthdaySong, playBirthdaySong]);

  const toggleMute = useCallback(() => {
    const player = playerInstanceRef.current;
    if (!player) return;
    try {
      if (isMuted) {
        if (player.unMute) player.unMute();
        setIsMuted(false);
      } else {
        if (player.mute) player.mute();
        setIsMuted(true);
      }
    } catch {
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const setVolume = useCallback(
    (val: number) => {
      const clamped = Math.max(0, Math.min(100, val));
      setVolumeState(clamped);
      const player = playerInstanceRef.current;
      if (player?.setVolume) {
        try {
          player.setVolume(clamped);
          if (clamped > 0 && isMuted) {
            player.unMute();
            setIsMuted(false);
          }
        } catch {
          // Ignored
        }
      }
    },
    [isMuted]
  );

  const stopAll = useCallback(() => {
    const player = playerInstanceRef.current;
    if (player?.stopVideo) {
      try {
        player.stopVideo();
      } catch {
        // Ignored
      }
    }
    setIsPlaying(false);
    setActiveTrack('none');
  }, []);

  return {
    isPlaying,
    isMuted,
    volume,
    hasAudioPermission,
    isReady,
    activeTrack,
    error,
    grantAudioPermission,
    playBirthdaySong,
    pauseBirthdaySong,
    togglePlayPause,
    toggleMute,
    setVolume,
    stopAll,
  };
}
