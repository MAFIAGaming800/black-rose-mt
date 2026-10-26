import React from 'react';
import { Play, Pause, Volume2, VolumeX, Music, AlertCircle } from 'lucide-react';
import { PlayerControls } from '../../hooks/useYouTubePlayer';

interface MusicDockProps {
  player: PlayerControls;
}

export const MusicDock: React.FC<MusicDockProps> = ({ player }) => {
  return (
    <aside
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 max-w-md ml-auto"
      role="region"
      aria-label="Birthday Music Controls"
    >
      <div className="glass-card border border-[#B98575]/40 rounded-2xl p-3 shadow-[0_8px_32px_rgba(185,133,117,0.22)] flex items-center justify-between gap-3 text-[#54263D]">
        {/* Track Info */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFE4EC] to-[#F8C8DC] border border-[#B98575]/40 flex items-center justify-center shrink-0">
            <Music className={`w-4 h-4 text-[#B98575] ${player.isPlaying ? 'animate-bounce' : ''}`} />
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-[#54263D] truncate font-serif">
              Birthday Anthem
            </p>
            <p className="text-[10px] text-[#834F6A] truncate font-medium">
              {player.isPlaying && !player.isMuted
                ? 'Sound ON • BLACK ROSE MT'
                : player.isMuted
                ? 'Sound Muted / OFF'
                : 'Paused • Tap Play'}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Sound ON/OFF Toggle Button */}
          <button
            onClick={player.toggleMute}
            aria-label={player.isMuted ? 'Turn Sound ON' : 'Turn Sound OFF'}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              player.isMuted
                ? 'bg-[#FFE4EC] border-rose-300 text-rose-800'
                : 'bg-[#FFFAFC] border-[#B98575]/50 text-[#54263D] hover:bg-[#FFE4EC]'
            }`}
          >
            {player.isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden xs:inline">OFF</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#B98575]" />
                <span className="hidden xs:inline">ON</span>
              </>
            )}
          </button>

          {/* Volume Slider */}
          <div className="hidden sm:flex items-center gap-1.5 w-16">
            <input
              type="range"
              min="0"
              max="100"
              value={player.isMuted ? 0 : player.volume}
              onChange={(e) => player.setVolume(parseInt(e.target.value, 10))}
              aria-label="Volume slider"
              className="w-full h-1 bg-[#FFE4EC] rounded-lg appearance-none cursor-pointer accent-[#B98575]"
            />
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={player.togglePlayPause}
            aria-label={player.isPlaying ? 'Pause birthday anthem' : 'Play birthday anthem'}
            className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#B98575] via-[#EFA7C4] to-[#B98575] hover:brightness-105 text-[#FFFAFC] flex items-center justify-center font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            {player.isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Autoplay Warning Banner if error */}
      {player.error && (
        <div className="mt-2 text-[11px] bg-[#FFE4EC] text-[#54263D] border border-[#B98575]/40 rounded-lg p-2 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#B98575]" />
          <span>Tap Play button to allow birthday music on this device.</span>
        </div>
      )}
    </aside>
  );
};
