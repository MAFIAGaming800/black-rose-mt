# BLACK ROSE MT — Official Birthday Celebration & Admin Suite

A cinematic, mobile-first birthday application built with **React 19**, **Vite**, **Tailwind CSS v4**, and **Express.js**, presented by her brother and friend **Shona Bhai** for **BLACK ROSE MT**.

The celebration is anchored to **17 November 2026 at 00:00 Pakistan Standard Time (Asia/Karachi, UTC+05:00)** with server-side countdown verification.

---

## 🌸 Design & Aesthetic Palette (Light Pink / Rose Gold)

- **Primary Background (`#FFF0F5`)**: Lavender Blush / Soft Rose Milk.
- **Secondary Background (`#FFE4EC`)**: Soft Strawberry Cream.
- **Rose Gold Accents (`#B98575`, `#F7E7CE`)**: Warm luxury champagne and antique rose gold.
- **Soft Pink (`#F8C8DC`) & Pearl White (`#FFFAFC`)**: Soft silk accents and card backgrounds.
- **Deep Wine / Rose Maroon (`#54263D`)**: High-contrast, elegant typography.
- **Zero Purple / No Dark Mode Enforced**: Light-pink themed aesthetic.
- **Language**: Strictly 100% Roman Urdu and Roman English. Never Arabic or Urdu script (`\u0600-\u06FF`).

---

## 🗂️ Asset Manifest & Mapping (`src/config/assetManifest.ts`)

All media assets are centrally declared in `src/config/assetManifest.ts`. If a local or custom asset is missing, graceful styled fallbacks (CSS rose gold illustrations, initials emblems, or ambient effects) render automatically.

| Logical Identifier | Description | Current Location / Fallback |
| :--- | :--- | :--- |
| `brandLogo` | Original BLACK ROSE MT Logo | `/src/assets/images/assets/logo.png` |
| `countdownVideo` | Spoken countdown intro MP4 | `/assets/aistudio/videoplayback__2__8dd731cb.mp4` |
| `cakeReferenceImage` | Barbie-doll trolley cake | `/src/assets/images/cake_doll_barbie_trolley.png` / 3D Canvas cake |
| `birthdayGirlPhoto` | Birthday girl portrait | Uploadable via Admin Modal / Rose Gold Monogram Emblem |
| `jumpScareVideo` | Ek Choti Si Masti reveal video | `/src/assets/videos/jump_scare_masti.mp4` / Playful cat meme card |
| `friendLogos` | 6 friend squad emblems | PrimexAhmed, PrimexHaxx, Nexo gaming, AbhixPlayz, MSR, Vishal |

### How to Add / Replace Media Assets:
1. **Brand Logo**: Place PNG at `/public/assets/logo.png` or `/src/assets/images/assets/logo.png`.
2. **Portrait Photo**: Place PNG at `/public/assets/portrait.png` or upload via Admin Panel.
3. **Videos**: Place in `/public/assets/videos/` and update `src/config/assetManifest.ts`.

---

## ⏱️ Complete Celebration Sequence (Sections 1–16)

1. **Countdown Stage (Fixed 17 Nov 2026, 00:00 Asia/Karachi)**: Server-authoritative anti-tamper monotonic clock. Audio permission consent button.
2. **Media Countdown Video Transition**: Edge-to-edge full-screen playback of the MP4 countdown video (`videoplayback__2__8dd731cb.mp4`).
3. **Pure Black Screen with Audio Interlude**: 5.5-second pure black screen with subtle pink pulse on heartbeats, audio from `https://youtu.be/-EMmxkqvoPQ`.
4. **Cake Ceremony**: Barbie-doll cake on decorated trolley with wheels, tap or mic blow to extinguish candles with smoke and haptic feedback (`navigator.vibrate`), multi-directional swipe cut.
5. **Friend Introductions & Identity Reveals (Section 7)**:
   - First: **BLACK ROSE MT** with official brand logo.
   - Followed by 6 friends: **PrimexAhmed**, **PrimexHaxx**, **Nexo gaming**, **AbhixPlayz**, **MSR**, **Vishal**.
6. **Birthday Reveal Hero & Squad Wishes Scrolling Ticker**:
   - Hero banner with rose gold confetti and badges.
   - Scrolling ticker of wishes submitted by friends below the hero.
7. **Squad Envelopes (Section 8)**: All 6 ribbon envelopes displayed in a single unified grid. Clicking opens a wax-sealed popup modal with Roman Urdu prayers and English wishes. Auto-advances when all 6 have been opened.
8. **Special Gift (Section 9)**: Unwrappable luxury gift box revealing Shona Bhai's grand entry.
9. **Ek Choti Si Masti (Section 10)**: "Pakro Mujhe! 😜" button that playfully dodges cursor/taps for 20–25s within safe viewport boundaries, then becomes stationary for the click, triggering the hilarious jump-scare video / transition to games.
10. **Three Playable Mini-Games (Section 11)**:
    - *The Trick Door*: 3 mystery doors where only one unlocks the next clue.
    - *Memory Trap*: Flip cards to match brother-sister inside jokes and squad icons.
    - *Don't Trust Your Eyes*: A visual optical puzzle test.
11. **A Sky Full of Duas 🌙 (Section 12)**: 4 separate full-screen interactive scenes under a starry crescent moon sky:
    - *Dua 1*: Salamati aur Lambi Zindagi
    - *Dua 2*: Kamiyabi aur Roshan Mustaqbil
    - *Dua 3*: Chehre Ki Muskaan aur Dil Ka Sukoon
    - *Dua 4*: Hamesha Ki Hifazat
12. **From Shona Bhai, With Duas 💌 (Section 13)**: Shona Bhai's sincere handwritten-style letter (*strictly NO video*).
13. **Brotherly Emotional Closing (Section 15)**:
    - *"Zindagi ke har mor par tera bhai tera dhaal ban kar khara rahega..."*
    - *"Jab bhi dil udaas ho, bas yaad rakhna ek bhai hai jo hamesha tere peeche khara hai..."*
    - *"Love From Your Shona Bhai"*
14. **Grand Finale & Replay (Sections 14 & 15)**:
    - Option C: 3D illuminated "THANK YOU" typography with sparkling particles and confetti burst.
    - Replay button (only place replay is available).
15. **Safe Replay State Reset (Section 16)**: Resets state, stops audio, and scrolls cleanly to top.

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```bash
# Server port (default 3000)
PORT=3000

# Admin Passphrase for Shona Bhai's control panel
ADMIN_PASSWORD="shonabhai2026"

# 32+ character random secret for signing preview tokens
SESSION_SECRET="blackrose_mt_shonabhai_secret_key_2026"
```

---

## 🧪 Admin Preview Testing

You do not need to wait until 17 November 2026 to test the full sequence:
1. Click the **Admin** button in the top right.
2. Enter the admin password (`shonabhai2026`).
3. Click **"Launch 20s Preview Simulation"**.
4. The site enters preview mode with a temporary 30-second countdown:
   - At 10s: Video sequence activates.
   - At 0s: Black screen audio interlude (5.5s).
   - Cake ceremony, identity reveals, envelopes, masti, games, sky of duas, Shona Bhai's letter, and grand finale!
5. **The public production deadline (17 Nov 2026) remains completely untouched.**

---

## 🚀 Running Verification Tests

To run the complete automated test suite:

```bash
npm test
```

This verifies:
1. Anti-tamper server time & preview token integrity.
2. Content audit: Roman Urdu purity, 0 forbidden Arabic script characters, exact duas & letter texts, and zero occurrences of "Thank You for Being You".
3. Monotonic transition timing & audio guard verification.
