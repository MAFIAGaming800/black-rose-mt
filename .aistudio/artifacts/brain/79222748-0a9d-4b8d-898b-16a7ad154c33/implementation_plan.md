# BLACK ROSE MT — Cinematic Birthday Experience & Admin Suite (Revised Plan)

A mobile-first, high-fashion gothic birthday web application honoring **BLACK ROSE MT**, presented by her brother and friend **Shona Bhai**. The public celebration unlocks at **17 November 2026, 00:00 Pakistan Standard Time (Asia/Karachi, UTC+05:00)** through a cryptographically verified server-side countdown, followed by an interactive multi-sensory celebration and a secure administrative suite.

---

### Critical Confirmations & Architectural Decisions

> [!IMPORTANT]
> - **Asset Integrity**: Never invent a logo, redraw the brand mark, or fabricate her real name. The application references original assets via `/public/assets/logo.png` and `/public/assets/portrait.png`. When assets are not yet uploaded, a high-fashion rose-gold monogram frame and gothic rose placeholder are displayed alongside an intuitive asset manager in the Admin Dashboard.
> - **Aesthetic Palette**: Dominated by Midnight Black (`#09090B`), Antique Rose Gold (`#B9905A`), Warm Champagne (`#F5E8D5`), Blush Pink (`#E8BFC5`), Pearl White (`#F7F3F0`), with deep wine accents (`#2A0813`). **Purple is strictly prohibited as the primary theme.**
> - **Language Guarantee**: 100% Roman Urdu and Roman English for all copy, dialogs, toasts, and buttons. **No Urdu (Arabic script) is used anywhere.**
> - **Immutable Server Deadline**: Public unlock is locked to `2026-11-17T00:00:00+05:00`. Client clock manipulation is prevented via server-side timestamp signing (`/api/time` and `/api/verify-unlock`).
> - **Admin 20s Preview Isolation**: The Admin panel provides a separate 20-second preview simulation that operates strictly on signed temporary session tokens (`mock_preview=true`). It **never** alters the permanent server deadline.
> - **Real Admin Security**: Admin routes strictly enforce server-side validation against `ADMIN_PASSWORD` and `SESSION_SECRET`. The application explicitly informs the administrator if environment variables are not yet configured rather than using fake client-side authentication.
> - **Audio State Machine & Fallbacks**: Coordinates the 3 YouTube media items (T-10s video, 6s teaser audio in the dark, and main birthday song) via official YouTube IFrame Player API. Autoplay restrictions are mitigated via a pre-unlock "Tap to Enable Music" prompt and a prominent "Start Birthday Experience" fallback button.

---

## 1. System Architecture & Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER (React 19 + Vite)                             │
│                                                                                         │
│   ┌─────────────────────────┐  ┌─────────────────────────┐  ┌───────────────────────┐   │
│   │   Time Sync Engine      │  │   YouTube Audio Engine  │  │  Particle & FX Engine │   │
│   │  (Offset Calculation +  │  │  (YT IFrame API Wrapper │  │  (Rose Gold Canvas +  │   │
│   │   Drift Compensation)   │  │   + Autoplay Fallback)  │  │   Smoke / Sparks)     │   │
│   └────────────┬────────────┘  └────────────┬────────────┘  └───────────┬───────────┘   │
│                │                            │                           │               │
│   ┌────────────┴────────────────────────────┴───────────────────────────┴───────────┐   │
│   │                          Master State Orchestrator                              │   │
│   │  [01: LOCKED_COUNTDOWN] ──> [02: T_MINUS_10S_VIDEO] ──> [03: BLACK_SILENCE]    │   │
│   │  ──> [04: FIRST_6S_AUDIO] ──> [05: CAKE_&_CANDLES] ──> [06: CAKE_CUTTING]      │   │
│   │  ──> [07: CINEMATIC_REVEAL] ──> [08: 6_ENVELOPES] ──> [09: SPECIAL_GIFT]       │   │
│   │  ──> [10: DODGING_MASTI] ──> [11: EMOTIONAL_DUAS] ──> [12: REPLAY_PANEL]        │   │
│   └─────────────────────────────────────────┬───────────────────────────────────────┘   │
│                                             │                                           │
│   ┌─────────────────────────────────────────┴───────────────────────────────────────┐   │
│   │                             Interactive Views                                   │   │
│   │  • Circular Portrait Frame & Animated "Shona Bhai" Badge                        │   │
│   │  • Typewriter Text Engine (Blinking cursor, skip, reduced motion)               │   │
│   │  • Interactive Candle Extinguisher & Smoke Particle Animator                    │   │
│   │  • Gesture-based Cake Cutting Knife with Golden Spark Trail                     │   │
│   │  • 6 Animated Envelope Modals (PrimexAhmed, Nexo, MSR, Vishal, etc.)           │   │
│   │  • "Pakro Mujhe! 😜" 12s Viewport Dodging Button (Safe boundary physics)       │   │
│   │  • Floating Gothic Music Dock (Play/Pause, Mute, Volume slider)                 │   │
│   │  • Admin Modal with Asset Upload & 20-Second Preview Launcher                   │   │
│   └─────────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────┬───────────────────────────────────────────┘
                                              │ HTTP JSON
┌─────────────────────────────────────────────┴───────────────────────────────────────────┐
│                    FULL-STACK BACKEND (Express / Vercel Serverless API)                 │
│                                                                                         │
│   ┌─────────────────────────┐  ┌─────────────────────────┐  ┌───────────────────────┐   │
│   │       /api/time         │  │   /api/verify-unlock    │  │   /api/admin/login    │   │
│   │ (Authoritative Server   │  │ (Cryptographic Check of │  │ (Constant-time check  │   │
│   │  Clock Asia/Karachi)    │  │  Deadline vs Real Time) │  │  with ADMIN_PASSWORD) │   │
│   └─────────────────────────┘  └─────────────────────────┘  └───────────────────────┘   │
│   ┌─────────────────────────┐  ┌─────────────────────────┐  ┌───────────────────────┐   │
│   │ /api/admin/preview-token│  │    /api/admin/assets    │  │  /api/admin/status    │   │
│   │ (Ephemeral 20s test     │  │ (Upload & manage logo/  │  │ (Reports environment  │   │
│   │  mode; real date intact)│  │  portrait images)       │  │  configuration state) │   │
│   └─────────────────────────┘  └─────────────────────────┘  └───────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Proposed File Structure

```
├── .env.example                  <- Environment template (ADMIN_PASSWORD, SESSION_SECRET)
├── api/                          <- Vercel Serverless Function entry point
│   └── index.ts                  <- Handles /api/* requests on Vercel deployment
├── server.ts                     <- Express backend for local development & full-stack mode
├── package.json                  <- Dependencies and build scripts
├── vite.config.ts                <- Vite configuration
├── tsconfig.json                 <- TypeScript compiler settings
├── README.md                     <- Beginner-friendly setup, testing, and deployment guide
├── index.html                    <- HTML entry point with luxury typography & meta
├── public/
│   ├── favicon.ico
│   └── assets/                   <- Storage directory for original logo and portrait
│       ├── logo.png              <- Official BLACK ROSE MT logo (when uploaded)
│       └── portrait.png          <- Official portrait photo (when uploaded)
└── src/
    ├── main.tsx                  <- React mount
    ├── App.tsx                   <- Master Controller & Screen Router
    ├── index.css                 <- Tailwind CSS, custom fonts, and root theme tokens
    ├── types/
    │   └── index.ts              <- TypeScript interfaces for time, stages, cards, and admin
    ├── config/
    │   ├── theme.ts              <- Palette tokens (midnight black, rose gold, champagne)
    │   └── content.ts            <- All Roman Urdu text, friend messages, and duas
    ├── hooks/
    │   ├── useServerTime.ts      <- Clock sync & drift calculation hook
    │   └── useYouTubePlayer.ts   <- YouTube IFrame API multi-track controller
    ├── components/
    │   ├── common/
    │   │   ├── BrandBadge.tsx    <- Animated "Shona Bhai" circular badge
    │   │   ├── LogoContainer.tsx <- Logo renderer with placeholder fallback
    │   │   ├── Typewriter.tsx    <- Roman Urdu typewriter with skip & cursor
    │   │   └── ParticleCanvas.tsx<- Canvas engine for falling rose gold particles & embers
    │   ├── countdown/
    │   │   ├── CountdownTimer.tsx<- Tabular countdown cards (days, hours, mins, secs)
    │   │   ├── SoundConsent.tsx  <- "Tap to Enable Music" ambient audio prompt
    │   │   └── AudioFallback.tsx <- "Start Birthday Experience" manual trigger
    │   ├── ceremony/
    │   │   ├── CakeStage.tsx     <- 2 animated characters escorting the cake
    │   │   ├── CandleGroup.tsx   <- Extinguishable candles with smoke particle effects
    │   │   └── CakeKnifeCut.tsx  <- Touch/mouse gesture slice with spark trail
    │   ├── celebration/
    │   │   ├── RevealHero.tsx    <- Central blooming black rose & champagne title
    │   │   ├── EnvelopeGrid.tsx  <- Responsive grid of 6 wax-sealed letter envelopes
    │   │   ├── LetterModal.tsx   <- Centered backdrop-blur modal for friend wishes
    │   │   ├── SpecialGift.tsx   <- Gift box unpack with Shona Bhai's personal letter
    │   │   ├── DodgingMasti.tsx  <- "Pakro Mujhe! 😜" 12-second evasive button game
    │   │   ├── DuasSection.tsx   <- 6 cards with prayers for health, peace, and future
    │   │   ├── EmotionalClosing.tsx <- Sincere brotherly bond & respect message
    │   │   └── ReplayScreen.tsx  <- "Thank You for Being You" & safe reset controller
    │   ├── audio/
    │   │   └── MusicDock.tsx     <- Floating glassmorphic audio player (Play/Pause/Vol)
    │   └── admin/
    │       ├── AdminModal.tsx    <- Admin login and control dashboard
    │       └── AssetUploader.tsx <- Dynamic logo/portrait upload with preview
    └── utils/
        ├── time.ts               <- Pakistan Standard Time (UTC+05:00) calculations
        └── sound.ts              <- Audio helpers and synthesizer cues
```

---

## 3. Feature-by-Feature Detailed Implementation Plan

### Stage 1: Pre-Unlock & Authoritative Countdown
- **Deadline Definition**: Target fixed to `2026-11-17T00:00:00+05:00` (Unix timestamp: `1794855600000`).
- **Clock Drift Calculation**: On mount, client fetches `/api/time`. The server responds with `{ serverTime: number, timezone: "Asia/Karachi", signature: string }`. The client computes `offset = serverTime - Date.now()` and continuously derives `authoritativeNow = Date.now() + offset`.
- **Opening Visuals**:
  - Circular portrait frame with metallic rose-gold breathing border.
  - Separate animated circular badge: **"From Shona Bhai"** (rotating orbit border, subtle sheen).
  - Main title: **"Happy Birthday BLACK ROSE MT"** with champagne typography.
  - Roman Urdu subtext: *"Waqt tham sa gaya hai... ek khoobsurat lamhe ka intezar hai."*
  - Tabular countdown display (`font-mono tabular-nums`) showing Days, Hours, Minutes, and Seconds.
- **Audio Consent Interaction**: Discreet luxury prompt in the bottom thumb zone: *"Tap for Audio Ambience"*. Clicking registers a user gesture with the browser, unlocking `AudioContext` and preparing the YouTube IFrame API for unmuted transitions.

### Stage 2: The Uploaded MP4 Countdown Video & Black-Screen Audio Sequence
- **Countdown Trigger**:
  - In 30s preview test mode: triggers when 20 seconds remain. In production: triggers upon deadline unlock.
  - The uploaded video `videoplayback (2).mp4` (`/assets/aistudio/videoplayback__2__8dd731cb.mp4`) plays edge-to-edge full-screen with `object-fit: cover` and `object-position: center`.
  - Playback starts cleanly at `t = 6.0s` (the spoken intro "Ladies and gentlemen...") and plays through the countdown ("10... 1... GO!") and celebration burst until `t = 46.0s`.
  - While playing, all page content, logos, buttons, particles, and text are hidden; no skip buttons.
- **The Black-Screen Audio Interlude (5.5s)**:
  - Video is paused and destroyed.
  - Screen cuts to pure pitch black (`#000000`) with no text, logo, animation, or visualizer.
  - Audio from `https://youtu.be/-EMmxkqvoPQ` plays strictly for 5.5 seconds, then stops with zero audio overlap before the Seven Names Reveal.

### Stage 3: Birthday Anthem & Floating Music Dock
- **Main Song Activation**: The main celebration track (`https://youtu.be/sqkzN2Ye_pk?si=hQRA_ok9LwoAGQ8Y`) begins playing.
- **Floating Gothic Dock**:
  - Positioned discreetly in the lower corner/bottom bar.
  - Controls: Play/Pause button, Mute/Unmute toggle, and a sleek volume slider.
  - Track indicator: *"Playing Birthday Anthem for BLACK ROSE MT"*.
  - Error Handling: If YouTube embed restrictions (Error 101/150) or mobile autoplay block playback, an elegant glassmorphic banner appears: *"Click to Play Birthday Music 🎵"*.

### Stage 4: Interactive Cake & Candle Ceremony
- **Character Entrance**: Two animated mascot characters (gothic chibi style with SVG animations) carry a lavish tiered birthday cake into the center of the screen.
- **Candle Extinguishing**:
  - 3 ornate candles atop the cake with animated flickering flames.
  - Each candle can be clicked or tapped individually.
  - On tap: Flame vanishes with an upward particle drift of gentle white smoke.
  - Guidance text: *"Candles ko tap kar ke bujhao!"* -> Updates to *"Shaabash! Ab cake cut karne ka waqt hai."*
- **Gesture Cake Cutting**:
  - A gold ceremonial knife appears.
  - User swipes across the cake (touch drag on mobile or mouse drag on desktop).
  - An animated golden spark incision lines the cut path.
  - The cake separates visually into distinct pieces, triggering celebratory rose-gold petal bursts and applause sound cue.

### Stage 5: Cinematic Reveal & The 6 Friend Envelopes
- **Cinematic Reveal**:
  - Central blooming black rose icon with ambient champagne radial lighting.
  - Original logo displayed prominently with champagne text reveal.
  - Typewriter effect: *"Janam Din Mubarak ho, BLACK ROSE MT! Yeh din aapke liye khushiyon ka paighaam laye."*
- **Six Friend Envelope Cards**:
  - Responsive grid (2 columns on mobile, 3 columns on tablet/desktop).
  - High-fashion wax-sealed envelope cards with hover/tap animations:
    1. **PrimexAhmed**: *"Bhai ki taraf se dhero duayein, hamesha hansti muskurati raho aur gaming mein sab ko pachadti raho!"*
    2. **PrimexHaxx**: *"Allah tumhein har mod par kamyabi aur zehni sukoon ata farmaye. Happy Birthday!"*
    3. **Nexo gaming**: *"Squad ki ronaq aur hamesha positive rehne wali dost ko janam din bohat bohat mubarak!"*
    4. **AbhixPlayz**: *"Zindagi ka har match jeeto aur hamesha aage badhti raho. Khush raho hamesha!"*
    5. **MSR**: *"Dua hai ke tumhara aane wala saal izzat, sehat aur barkaton se bhara ho. Mubarak ho!"*
    6. **Vishal**: *"Wishing you endless happiness, good health and grand success in every step. Happy Birthday!"*
  - Clicking any card opens a centered modal with backdrop blur (`backdrop-blur-xl bg-black/85`) and keyboard navigation (`Esc` to close).

### Stage 6: Special Gift from Shona Bhai
- An ornate gift box wrapped with rose-gold ribbon.
- Clicking unties the ribbon and reveals an intimate brotherly letter:
  - Header: *"A Special Gift For You — From Your Shona Bhai"*
  - Letter text: Warm Roman Urdu letter expressing how proud Shona Bhai is of her character, maturity, and presence, wishing her lifelong barakah, safety, and joy.

### Stage 7: "Ek Choti Si Masti" — Pakro Mujhe! 😜
- Playful interactive segment to make her smile.
- A button labeled **"Pakro Mujhe! 😜"** renders inside a dedicated interactive arena.
- **Physics & Evasion**:
  - When the cursor or finger gets within 60px of the button, it recalculates its position and smoothly glides to another quadrant.
  - Strict Boundary Guard: Uses viewport math to guarantee it never leaves the visible screen, never goes behind the top header, and never covers other controls.
  - Countdown Tracker: Evades for exactly 12 seconds.
- **Completion**:
  - After 12 seconds, the button stops dodging, pulses with a celebratory rose-gold border, and text changes to: *"Acha baba pakar lo! 😄"*.
  - Clicking it reveals a witty, affectionate Roman Urdu pop-up: *"Hahaha haar maan li! Par sach yeh hai ke aap jaisi behtareen behen aur dost ko hamesha khush dekhna hi hamari sab se badi jeet hai."*

### Stage 8: Emotional Brotherly Duas & Respectful Closing
- **Brotherly Bond & Respect**:
  - Clear, affectionate, and respectful message: Shona Bhai is her brother and true friend, deeply respecting her, standing by her side, and praying for her honor and happiness. Free from any romantic ambiguity.
- **The Six Core Duas**:
  1. **Sehat (Health)**: Long, vibrant, and energetic life.
  2. **Sukoon (Peace)**: A heart free of sorrow and filled with tranquility.
  3. **Hifazat (Protection)**: Guarded against evil eyes, troubles, and hardships.
  4. **Kamyabi (Success)**: Flourishing achievements in all ambitions.
  5. **Khushiyan (Joy)**: Pure, unceasing reasons to smile every single day.
  6. **Roshan Mustaqbil (Bright Future)**: Endless barakah and open doors.

### Stage 9: Final Screen & Safe Replay
- Headline: **"HAPPY BIRTHDAY BLACK ROSE MT"**
- Subtitle: *"With duas, respect & friendship — From Shona Bhai"*
- Card: *"Thank You for Being You"*
- **Replay Button**: Labeled *"Replay Birthday Experience"*.
  - Cleanly resets all state machine variables in React.
  - Stops any active YouTube playback and re-primes the audio engine.
  - Returns user safely to the opening presentation without page reload or broken tab close attempts.

---

## 4. Admin Suite, Security Design & Asset Management

### A. Server-Side Security Model
1. **No Client-Side Secrets**: `ADMIN_PASSWORD` and `SESSION_SECRET` reside solely in the server environment (`.env`).
2. **Authentication Flow**:
   - Admin enters password in the hidden Admin Modal (`/admin` shortcut or subtle footer click).
   - POST to `/api/admin/login`.
   - Server performs timing-safe comparison (`crypto.timingSafeEqual`).
   - If valid, returns a signed JWT or httpOnly session cookie valid for 4 hours.
3. **Environment Status Transparency**:
   - If `ADMIN_PASSWORD` is unset in `.env`, the API responds with `{ configured: false, message: "Server admin password not configured in .env" }`.
   - The UI displays a clear setup message with explicit instructions rather than pretending authentication succeeded.

### B. Admin 20-Second Preview Separation
- The Admin Dashboard features a button: **"Run 20-Second Test Preview"**.
- When clicked, the server issues a signed test token with `{ preview: true, testCountdownSeconds: 20 }`.
- The admin client loads with a 20-second countdown to verify the entire 10s video -> 2.5s silence -> 6s teaser -> main anthem -> cake -> envelopes sequence.
- **The public production deadline (`2026-11-17T00:00:00+05:00`) is never modified or bypassed for non-admin visitors.**

### C. Asset Upload & Storage Strategy
- Dedicated Asset Management tab inside the Admin Dashboard.
- **Upload Slots**:
  1. *Official BLACK ROSE MT Logo* (`/public/assets/logo.png`)
  2. *Official Portrait Photo* (`/public/assets/portrait.png`)
- **Handling & Fallback**:
  - Image files uploaded via the admin interface are saved to `/public/assets/` or persisted in memory/disk as base64 data URLs.
  - Immediate real-time preview in the admin modal with instant client re-render.
  - Until the user uploads their original files, the UI renders an elegant gothic rose emblem with "BLACK ROSE MT" typography and a subtle "Admin: Upload Official Logo" helper indicator in admin mode.

---

## 5. Deployment Guide & External Setup Requirements

### A. Vercel Free-Tier Deployment
1. **Repository Setup**: Push the project to GitHub.
2. **Import to Vercel**: Connect the repository to Vercel.
3. **Framework Preset**: Select **Vite**.
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Environment Variables on Vercel**:
   - `ADMIN_PASSWORD`: A secure passphrase chosen by Shona Bhai.
   - `SESSION_SECRET`: A 32-character random string for signing preview tokens.
7. **Serverless API Routing**: The included `api/index.ts` handles all `/api/*` endpoints natively on Vercel without requiring extra servers.

### B. External Services & Costs
- **Vercel**: 100% Free Tier (Hobby). Zero cost.
- **YouTube Embed API**: 100% Free official Google YouTube IFrame API. No API key required for client-side embeds.
- **Dependencies**: No paid third-party APIs, no database hosting required, zero recurring costs.

---

## 6. Comprehensive QA & Testing Checklist

- [ ] **Timezone Calculation**: Verify target timestamp strictly represents `2026-11-17T00:00:00+05:00` (Karachi time).
- [ ] **Client Clock Tampering**: Change computer/phone local clock forward by 2 years; verify the server verification endpoint rejects early access.
- [ ] **Admin Isolation**: Confirm running the 20-second admin preview does not unlock the experience in an incognito window.
- [ ] **Palette Compliance**: Inspect DOM to confirm zero purple tokens; verify dominant `#09090B` midnight black and `#B9905A` rose gold accents.
- [ ] **Copy & Typography**: Silently audit every label, card, and modal for Roman Urdu/English only. Confirm zero Arabic script.
- [ ] **Typewriter Controls**: Test typing animation, blinking cursor, "Skip" button, and `prefers-reduced-motion` instantaneous text display.
- [ ] **Full-Screen MP4 Countdown Video**: Verify uploaded `videoplayback (2).mp4` plays edge-to-edge full screen with object-fit: cover, starting at spoken intro (6.0s) and stopping after ending cue (46.0s), with zero old YouTube embeds.
- [ ] **Pure Black Screen Audio Interlude**: Confirm solid black screen and 5.5 seconds of audio from `-EMmxkqvoPQ` with zero audio overlap.
- [ ] **Main Birthday Track**: Verify `sqkzN2Ye_pk` starts cleanly; test Play/Pause, Mute/Unmute, and Volume Slider.
- [ ] **Autoplay Fallback**: Simulate autoplay restriction; verify "Start Birthday Experience" button appears and functions.
- [ ] **Candle Interaction**: Tap each candle individually; verify flame disappears and smoke particle animation triggers.
- [ ] **Cake Cutting Gesture**: Test swipe cut on touch (mobile) and mouse drag (desktop); verify visual split and celebratory particles.
- [ ] **Six Friend Envelopes**: Open each envelope (PrimexAhmed, PrimexHaxx, Nexo gaming, AbhixPlayz, MSR, Vishal); check content, modal focus, and backdrop blur.
- [ ] **Special Gift**: Verify gift opening animation and display of Shona Bhai's personal letter.
- [ ] **Dodging Button ("Pakro Mujhe! 😜")**: Test evasive behavior for 12 seconds; ensure button stays strictly within viewport margins on 375px mobile and 1440px desktop; verify it settles and reveals the message.
- [ ] **Brotherly Duas & Emotional Closing**: Verify heartfelt tone and respectful boundaries.
- [ ] **Replay Functionality**: Click "Replay Birthday Experience"; verify all stages reset cleanly without browser crash or window closure errors.
- [ ] **Responsive Ergonomics**: Test on iPhone SE (375px), modern smartphones (390-430px), tablets (768-1024px), and desktop (1440px). All touch targets $\ge 44\text{px}$.
