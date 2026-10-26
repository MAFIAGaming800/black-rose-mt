import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2 } from 'lucide-react';
import { APP_CONFIG } from '../../config/content';

interface CountdownVideoTransitionProps {
  videoUrl?: string | null;
  onVideoComplete: () => void;
}

// Video playback begins from the very start (0.0s)
const VIDEO_START_TIME = 0.0;
// Countdown voice reaches "1... GO!" and celebration burst at ~40.5s, where trailing silence begins
const GO_CUE_FINISH_TIME = 40.5;

export const CountdownVideoTransition: React.FC<CountdownVideoTransitionProps> = ({
  videoUrl,
  onVideoComplete,
}) => {
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const hasCompletedRef = useRef(false);

  // Reliable local file paths for uploaded asset
  const primaryVideoSrc =
    videoUrl ||
    APP_CONFIG.mediaUrls.mp4VideoPath ||
    '/assets/videoplayback%20(2).mp4';

  const stopAndComplete = useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;

    if (videoElementRef.current) {
      try {
        videoElementRef.current.pause();
        videoElementRef.current.currentTime = 0;
      } catch {
        // Safe catch on video pause
      }
    }
    onVideoComplete();
  }, [onVideoComplete]);

  // Handle setting initial cue timestamp on loadedmetadata
  const handleLoadedMetadata = () => {
    if (videoElementRef.current) {
      try {
        if (videoElementRef.current.currentTime < VIDEO_START_TIME) {
          videoElementRef.current.currentTime = VIDEO_START_TIME;
        }
      } catch {
        // Browser may defer seek until playback begins
      }
    }
  };

  // Monitor playback progress to cleanly end at the intended GO moment (~40.5s) or on ended
  const handleTimeUpdate = () => {
    if (!videoElementRef.current) return;
    const current = videoElementRef.current.currentTime;
    if (current >= GO_CUE_FINISH_TIME) {
      stopAndComplete();
    }
  };

  const handleEnded = () => {
    stopAndComplete();
  };

  // Attempt autoplay with sound on mount
  useEffect(() => {
    hasCompletedRef.current = false;
    const video = videoElementRef.current;
    if (!video) return;

    // Start video from beginning
    try {
      video.currentTime = VIDEO_START_TIME;
    } catch {
      // Seek on loadedmetadata fallback
    }

    video.muted = false;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setAutoplayBlocked(false);
        })
        .catch(() => {
          // Autoplay with sound restricted by browser policy
          setAutoplayBlocked(true);
          setIsPlaying(false);
        });
    }

    // Safety timeout: in case video fails to fire events or is completely blocked
    // Total playback duration from 6.0s to 46.0s is 40s (+ 5s safety cushion)
    const safetyTimeout = setTimeout(() => {
      if (!hasCompletedRef.current && isPlaying) {
        stopAndComplete();
      }
    }, 45000);

    return () => {
      clearTimeout(safetyTimeout);
      if (video) {
        try {
          video.pause();
          video.currentTime = 0;
        } catch {
          // Ignored
        }
      }
    };
  }, [stopAndComplete, isPlaying]);

  const handleManualPlay = () => {
    const video = videoElementRef.current;
    if (!video) return;

    try {
      if (video.currentTime < VIDEO_START_TIME) {
        video.currentTime = VIDEO_START_TIME;
      }
    } catch {
      // Ignored
    }

    video.muted = false;
    video
      .play()
      .then(() => {
        setIsPlaying(true);
        setAutoplayBlocked(false);
      })
      .catch(() => {
        // Try muted if sound strictly blocked
        video.muted = true;
        video
          .play()
          .then(() => {
            setIsPlaying(true);
            setAutoplayBlocked(false);
            // Once playback begins, unmute
            setTimeout(() => {
              video.muted = false;
            }, 300);
          })
          .catch(() => {
            // If still blocked, user may tap again
          });
      });
  };

  return (
    <div className="fixed inset-0 w-screen h-screen z-50 bg-black overflow-hidden flex items-center justify-center p-0 m-0">
      {/* FULL SCREEN edge-to-edge video with object-fit: cover and object-position: center */}
      <video
        ref={videoElementRef}
        playsInline
        autoPlay
        preload="auto"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="fixed inset-0 w-full h-full object-cover object-center bg-black border-none outline-none cursor-none"
      >
        <source src={primaryVideoSrc} type="video/mp4" />
        <source src="/assets/aistudio/videoplayback__2__8dd731cb.mp4" type="video/mp4" />
        <source src="/assets/videoplayback (2).mp4" type="video/mp4" />
      </video>

      {/* Autoplay restriction prompt: Only shown if browser blocks audio autoplay.
          Centered, minimal, strictly NO skip buttons, disappears immediately once playing. */}
      {autoplayBlocked && !isPlaying && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="flex flex-col items-center text-center space-y-4 max-w-sm">
            <div className="w-12 h-12 rounded-full bg-[#FFE4EC]/20 border border-[#B98575] flex items-center justify-center">
              <Volume2 className="w-6 h-6 text-[#F7E7CE] animate-pulse" />
            </div>
            <p className="text-xs text-[#F7E7CE] font-serif tracking-wider uppercase">
              Browser sound policy requires a tap to play
            </p>
            <button
              onClick={handleManualPlay}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#B98575] via-[#EFA7C4] to-[#B98575] text-[#09090B] font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-xl cursor-pointer"
            >
              Tap to Enable Sound & Video
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
