import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));

// 17 November 2026, 00:00:00 Pakistan Standard Time (Asia/Karachi, UTC+05:00)
// In UTC: 16 November 2026, 19:00:00 UTC
const BIRTHDAY_DEADLINE_ISO = '2026-11-17T00:00:00+05:00';
export const TARGET_TIMESTAMP = new Date(BIRTHDAY_DEADLINE_ISO).getTime(); // 1794855600000

const SESSION_SECRET = process.env.SESSION_SECRET || 'blackrose_mt_shonabhai_secret_key_2026';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

// In-memory or filesystem storage for uploaded assets
const assetsDir = path.resolve(__dirname, 'public', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// In-memory asset fallback store
const inMemoryAssets: { logo?: string; portrait?: string } = {};

// Helper: Sign preview token
function generateToken(payload: object): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
  return `${data}.${signature}`;
}

// Helper: Verify preview token
function verifyToken(token?: string): { valid: boolean; payload?: any } {
  if (!token || typeof token !== 'string') return { valid: false };
  const parts = token.split('.');
  if (parts.length !== 2) return { valid: false };
  const [data, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
  if (signature !== expectedSig) return { valid: false };
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) {
      return { valid: false };
    }
    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}

// 1. Authoritative server time
app.get('/api/time', (_req: Request, res: Response) => {
  const now = Date.now();
  res.json({
    serverTime: now,
    iso: new Date(now).toISOString(),
    timezone: 'Asia/Karachi',
    target: TARGET_TIMESTAMP,
    remainingMs: Math.max(0, TARGET_TIMESTAMP - now),
    isUnlocked: now >= TARGET_TIMESTAMP,
  });
});

// 2. Cryptographic server-side unlock check
app.get('/api/verify-unlock', (req: Request, res: Response) => {
  const now = Date.now();
  const previewToken = req.headers['x-admin-preview-token'] as string | undefined;

  // Check preview token
  if (previewToken) {
    const { valid, payload } = verifyToken(previewToken);
    if (valid && payload?.preview) {
      const previewStart = payload.start || now;
      const previewDuration = payload.durationMs || 20000;
      const previewTarget = previewStart + previewDuration;
      const isPreviewUnlocked = now >= previewTarget;
      return res.json({
        unlocked: isPreviewUnlocked,
        isPreview: true,
        remainingMs: Math.max(0, previewTarget - now),
        serverTime: now,
        target: previewTarget,
      });
    }
  }

  // Real authoritative production deadline
  const isUnlocked = now >= TARGET_TIMESTAMP;
  res.json({
    unlocked: isUnlocked,
    isPreview: false,
    remainingMs: Math.max(0, TARGET_TIMESTAMP - now),
    serverTime: now,
    target: TARGET_TIMESTAMP,
  });
});

// 3. Admin configuration status
app.get('/api/admin/status', (_req: Request, res: Response) => {
  res.json({
    configured: Boolean(ADMIN_PASSWORD),
    message: ADMIN_PASSWORD
      ? 'Admin security active with server environment password'
      : 'Notice: ADMIN_PASSWORD is not set in .env. Default setup required for production.',
  });
});

// 4. Admin login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password } = req.body || {};
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password is required' });
  }

  const expectedPassword = ADMIN_PASSWORD || 'shonabhai2026';
  const passBuffer = Buffer.from(password);
  const expectedBuffer = Buffer.from(expectedPassword);

  let match = false;
  if (passBuffer.length === expectedBuffer.length) {
    match = crypto.timingSafeEqual(passBuffer, expectedBuffer);
  }

  if (!match) {
    return res.status(401).json({ error: 'Galat Password! (Invalid admin password)' });
  }

  const token = generateToken({
    admin: true,
    iat: Date.now(),
    exp: Date.now() + 4 * 60 * 60 * 1000, // 4 hours
  });

  res.json({
    success: true,
    token,
    configured: Boolean(ADMIN_PASSWORD),
    message: 'Admin login successful',
  });
});

// 5. Admin Preview Token Generation (30s test preview, does NOT modify real deadline)
app.post('/api/admin/preview-token', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');
  const { valid, payload } = verifyToken(token);

  if (!valid || !payload?.admin) {
    return res.status(403).json({ error: 'Unauthorized: Admin access required' });
  }

  const now = Date.now();
  const durationSec = 30; // Separate 30-second test countdown
  const previewToken = generateToken({
    preview: true,
    start: now,
    durationMs: durationSec * 1000,
    exp: now + 5 * 60 * 1000, // token expires in 5 minutes
  });

  res.json({
    previewToken,
    durationSeconds: durationSec,
    message: '30-second test preview initialized without altering real deadline',
  });
});

// 6. Asset management: Check status
app.get('/api/admin/assets', (_req: Request, res: Response) => {
  const logoFs = fs.existsSync(path.join(assetsDir, 'logo.png'));
  const portraitFs = fs.existsSync(path.join(assetsDir, 'portrait.png'));
  const aistudioMp4 = path.join(assetsDir, 'aistudio', 'videoplayback__2__8dd731cb.mp4');
  const standardMp4 = path.join(assetsDir, 'videoplayback (2).mp4');
  const videoUrl = fs.existsSync(aistudioMp4)
    ? '/assets/aistudio/videoplayback__2__8dd731cb.mp4'
    : fs.existsSync(standardMp4)
    ? '/assets/videoplayback (2).mp4'
    : null;

  res.json({
    logo: logoFs ? '/assets/logo.png' : inMemoryAssets.logo || null,
    portrait: portraitFs ? '/assets/portrait.png' : inMemoryAssets.portrait || null,
    video: videoUrl,
  });
});

// 7. Asset management: Upload logo or portrait
app.post('/api/admin/assets', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');
  const { valid, payload } = verifyToken(token);

  if (!valid || !payload?.admin) {
    return res.status(403).json({ error: 'Unauthorized: Admin access required' });
  }

  const { type, data } = req.body;
  if (!type || !['logo', 'portrait'].includes(type) || !data) {
    return res.status(400).json({ error: 'Invalid asset payload' });
  }

  try {
    // Save to memory
    if (type === 'logo') inMemoryAssets.logo = data;
    if (type === 'portrait') inMemoryAssets.portrait = data;

    // Also attempt write to public/assets
    const base64Data = data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const targetFile = path.join(assetsDir, `${type}.png`);
    fs.writeFileSync(targetFile, buffer);

    res.json({
      success: true,
      type,
      path: `/assets/${type}.png`,
      message: `Successfully updated original ${type}`,
    });
  } catch (err: any) {
    res.json({
      success: true,
      type,
      inMemoryOnly: true,
      message: 'Asset stored in application memory successfully',
    });
  }
});

// Mount Vite or static server
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  // Serve static public assets
  app.use(express.static(path.resolve(__dirname, 'public')));

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      // Express owns the HTTP server, so Vite cannot handle its HMR upgrade
      // requests here. Disable the client websocket to avoid reconnect errors.
      server: {
        middlewareMode: true,
        hmr: false,
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log(`Authoritative Asia/Karachi Birthday Deadline: ${BIRTHDAY_DEADLINE_ISO}`);
  });
}

startServer();

export default app;
