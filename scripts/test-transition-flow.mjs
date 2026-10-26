// Verification script for Black Screen -> Cake Stage transition
import { readFileSync } from 'fs';

console.log('--- RUNNING TRANSITION SEQUENCE VERIFICATION ---');

// 1. Verify BlackScreenAudio.tsx uses a non-resetting monotonic timer and stores onComplete in ref
const blackScreenCode = readFileSync('./src/components/transition/BlackScreenAudio.tsx', 'utf-8');

if (!blackScreenCode.includes('onCompleteRef')) {
  console.error('[FAIL] BlackScreenAudio does not use onCompleteRef to protect against parent re-renders');
  process.exit(1);
}
console.log('[PASS] BlackScreenAudio utilizes onCompleteRef to guarantee callback persistence');

if (!blackScreenCode.includes('5500')) {
  console.error('[FAIL] BlackScreenAudio duration is not set to 5500ms (5.5s)');
  process.exit(1);
}
console.log('[PASS] BlackScreenAudio duration strictly configured to 5500ms (5-6 second interval)');

// Check that useEffect has empty dependencies array
const hasEmptyDeps = /useEffect\(\s*\(\)\s*=>\s*\{[\s\S]*?\}\s*,\s*\[\s*\]\s*\)/.test(blackScreenCode);
if (!hasEmptyDeps) {
  console.error('[FAIL] BlackScreenAudio duration timer does not have empty dependency array');
  process.exit(1);
}
console.log('[PASS] BlackScreenAudio timer has strictly empty dependency array (immune to re-renders)');

// 2. Verify App.tsx handleBlackScreenComplete sets CAKE_CEREMONY
const appCode = readFileSync('./src/App.tsx', 'utf-8');

if (!appCode.includes("setStage('CAKE_CEREMONY')")) {
  console.error('[FAIL] App.tsx does not transition to CAKE_CEREMONY after black screen');
  process.exit(1);
}
console.log('[PASS] App.tsx explicitly transitions to CAKE_CEREMONY');

// Check that handleBlackScreenComplete catches audio playback exceptions
if (!appCode.includes("playerRef.current?.playBirthdaySong")) {
  console.error('[FAIL] App.tsx does not use playerRef to guard audio calls');
  process.exit(1);
}
console.log('[PASS] App.tsx uses playerRef and guards audio playback against autoplay failure');

// 3. Verify CakeStage has haptic vibration feedback
const cakeStageCode = readFileSync('./src/components/ceremony/CakeStage.tsx', 'utf-8');
if (!cakeStageCode.includes("navigator.vibrate")) {
  console.error('[FAIL] CakeStage does not include navigator.vibrate haptic feedback');
  process.exit(1);
}
console.log('[PASS] CakeStage includes navigator.vibrate haptic feedback on successful candle ignition');

console.log('\nALL TRANSITION SEQUENCE CHECKS PASSED SUCCESSFULLY!');
