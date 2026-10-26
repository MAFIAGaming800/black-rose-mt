import React, { useState, useEffect } from 'react';
import { X, Lock, Play, Upload, ShieldAlert, CheckCircle, Image as ImageIcon } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart20sPreview: (token: string) => void;
  onAssetsUpdated: (assets: { logo: string | null; portrait: string | null }) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  onStart20sPreview,
  onAssetsUpdated,
}) => {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isEnvConfigured, setIsEnvConfigured] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);

  const readJsonResponse = async (res: Response) => {
    const text = await res.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      throw new Error(res.ok ? 'The server returned an invalid response.' : 'Admin service is unavailable. Please try again later.');
    }
  };

  // Check admin setup status on open
  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/admin/status')
      .then(readJsonResponse)
      .then((data) => {
        setIsEnvConfigured(data.configured);
      })
      .catch(() => {
        setIsEnvConfigured(false);
      });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await readJsonResponse(res);
      if (!res.ok) throw new Error(data.error || 'Login failed');

      setToken(data.token);
      setStatusMsg('Admin login successful!');
    } catch (err: any) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrigger20sPreview = async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/preview-token', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await readJsonResponse(res);
      if (!res.ok) throw new Error(data.error || 'Failed to start preview');

      onStart20sPreview(data.previewToken);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (type: 'logo' | 'portrait', file: File) => {
    if (!token) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch('/api/admin/assets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ type, data: base64 }),
        });
        const data = await readJsonResponse(res);
        if (res.ok) {
          setStatusMsg(`Successfully uploaded original ${type}!`);
          const assetsRes = await fetch('/api/admin/assets');
          const assetsData = await assetsRes.json();
          onAssetsUpdated(assetsData);
        }
      } catch (err: any) {
        setError('Asset upload failed');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-title"
    >
      <div className="relative w-full max-w-md glass-card border border-[#B98575]/40 rounded-3xl p-6 sm:p-8 text-[#54263D] shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Close admin modal"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FFE4EC] hover:bg-[#F8C8DC] border border-[#B98575]/30 flex items-center justify-center text-[#54263D] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#B98575]/20">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FFE4EC] to-[#F8C8DC] border border-[#B98575] flex items-center justify-center text-[#B98575]">
            <Lock className="w-5 h-5 text-[#B98575]" />
          </div>
          <div>
            <h3 id="admin-title" className="font-serif text-xl font-bold text-[#54263D]">
              Admin Control Panel
            </h3>
            <p className="text-xs text-[#834F6A] font-medium">
              Shona Bhai Suite • Server Verification
            </p>
          </div>
        </div>

        {/* Environment status disclosure */}
        {!isEnvConfigured && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
            <div>
              <p className="font-semibold">Notice for Production:</p>
              <p className="text-[11px] opacity-90">
                To customize the admin password on Vercel/Node, set <code className="bg-amber-100 px-1 py-0.5 rounded">ADMIN_PASSWORD</code> in your environment variables.
              </p>
            </div>
          </div>
        )}

        {/* Not Logged In */}
        {!token ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-pass" className="block text-xs text-[#54263D] mb-1 font-semibold">
                Admin Passphrase
              </label>
              <input
                id="admin-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#FFFAFC] border border-[#B98575]/40 text-[#54263D] placeholder-[#834F6A]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#B98575]"
                required
              />
            </div>

            {error && (
              <p className="text-xs text-rose-800 bg-rose-50 border border-rose-300 rounded-lg p-2 font-medium">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#B98575] via-[#EFA7C4] to-[#B98575] text-[#FFFAFC] font-bold text-xs uppercase tracking-wider hover:brightness-105 active:scale-95 transition-all shadow-md disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Verifying...' : 'Login As Shona Bhai'}
            </button>
          </form>
        ) : (
          /* Authenticated Admin Suite */
          <div className="space-y-5 animate-in fade-in duration-300">
            <button
              type="button"
              onClick={() => {
                setToken(null);
                setPassword('');
                setStatusMsg(null);
              }}
              className="text-xs text-[#834F6A] underline hover:text-[#54263D]"
            >
              Log out
            </button>
            {statusMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{statusMsg}</span>
              </div>
            )}

            {/* 30-Second Preview Button */}
            <div className="p-4 rounded-2xl bg-[#FFFAFC] border border-[#B98575]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif font-bold text-[#54263D]">
                  Test Birthday Sequence
                </span>
                <span className="text-[10px] text-amber-700 font-mono font-semibold">30 Seconds</span>
              </div>
              <p className="text-[11px] text-[#834F6A] leading-relaxed">
                Test the exact 30s countdown: when 20s remain, the video plays, followed by the black-screen audio interlude, seven name reveals, Barbie cake cutting, and reveal without changing the permanent 17 Nov 2026 deadline.
              </p>
              <button
                onClick={handleTrigger20sPreview}
                className="w-full py-2 rounded-xl bg-[#FFE4EC] hover:bg-[#F8C8DC] border border-[#B98575] text-[#54263D] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current text-[#B98575]" />
                <span>Launch 30s Preview Simulation</span>
              </button>
            </div>

            {/* Asset Management Upload */}
            <div className="p-4 rounded-2xl bg-[#FFFAFC] border border-[#B98575]/30 space-y-3">
              <span className="text-xs font-serif font-bold text-[#54263D] block">
                Original Image & Video Upload Tool
              </span>

              {/* Upload Logo */}
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#B98575]" />
                  <span>Official Logo</span>
                </div>
                <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-[#FFE4EC] hover:bg-[#F8C8DC] border border-[#B98575]/40 text-[#54263D] text-[11px] font-semibold flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  <span>Upload Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload('logo', e.target.files[0]);
                    }}
                  />
                </label>
              </div>

              {/* Upload Portrait */}
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#B98575]" />
                  <span>Portrait Photo</span>
                </div>
                <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-[#FFE4EC] hover:bg-[#F8C8DC] border border-[#B98575]/40 text-[#54263D] text-[11px] font-semibold flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload('portrait', e.target.files[0]);
                    }}
                  />
                </label>
              </div>

              {/* Upload / Notice for videoplayback (2).mp4 */}
              <div className="p-2.5 rounded-xl bg-[#FFE4EC]/60 border border-[#B98575]/25 text-[11px] text-[#54263D] space-y-1">
                <div className="font-semibold flex items-center gap-1">
                  <span>Countdown MP4:</span>
                  <span className="font-mono text-[#B98575]">videoplayback (2).mp4</span>
                </div>
                <p className="text-[10px] text-[#834F6A]">
                  Place file in <code className="bg-white/80 px-1 py-0.5 rounded">public/assets/videoplayback (2).mp4</code> or upload here.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
