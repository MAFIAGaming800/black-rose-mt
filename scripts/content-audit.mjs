// Content Audit: verifies Roman Urdu/English purity and friend message integrity
import { FRIEND_MESSAGES, DUAS_LIST, PERSONAL_LETTER_SHONA_BHAI, EMOTIONAL_CLOSING, MASTI_TEXT } from '../src/config/content.ts';

console.log('--- STARTING CONTENT & PURITY AUDIT ---');

let passed = 0;
let failed = 0;

function assert(desc, condition) {
  if (condition) {
    console.log(`[PASS] ${desc}`);
    passed++;
  } else {
    console.error(`[FAIL] ${desc}`);
    failed++;
  }
}

// Check for Arabic/Urdu script (Unicode range \u0600-\u06FF)
function hasUrduScript(str) {
  return /[\u0600-\u06FF]/.test(str);
}

// 1. Verify 6 Friends
const expectedFriends = ['PrimexAhmed', 'PrimexHaxx', 'Nexo gaming', 'AbhixPlayz', 'MSR', 'Vishal'];
assert('Exactly 6 friends configured', FRIEND_MESSAGES.length === 6);

expectedFriends.forEach((name) => {
  const found = FRIEND_MESSAGES.find((f) => f.name.toLowerCase() === name.toLowerCase());
  assert(`Friend "${name}" exists`, Boolean(found));
  if (found) {
    assert(`"${name}" has Roman Urdu dua`, Boolean(found.duaRomanUrdu && found.duaRomanUrdu.length > 20));
    assert(`"${name}" has NO Urdu script characters`, !hasUrduScript(found.duaRomanUrdu) && !hasUrduScript(found.name));
  }
});

// 2. Verify Duas
assert('Exactly 6 Duas configured', DUAS_LIST.length === 6);
DUAS_LIST.forEach((d) => {
  assert(`Dua "${d.categoryRomanUrdu}" has NO Urdu script`, !hasUrduScript(d.duaRomanUrdu) && !hasUrduScript(d.categoryRomanUrdu));
});

// 3. Verify Letter and Closing
assert('Personal letter has NO Urdu script', !hasUrduScript(PERSONAL_LETTER_SHONA_BHAI.paragraphs.join(' ')));
assert('Emotional closing has NO Urdu script', !hasUrduScript(EMOTIONAL_CLOSING.brotherlyNote));
assert('Masti text has NO Urdu script', !hasUrduScript(MASTI_TEXT.messageParagraph));

console.log(`\nCONTENT AUDIT RESULTS: ${passed} PASSED, ${failed} FAILED.`);
process.exit(failed > 0 ? 1 : 0);
