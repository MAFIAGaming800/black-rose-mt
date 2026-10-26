// Automated QA Audit Script for BLACK ROSE MT Website
import http from 'http';
import dotenv from 'dotenv';
dotenv.config();

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING QA AUDIT TEST SUITE ---');
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

  try {
    // 1. Timezone and server time test
    const timeRes = await makeRequest({ host: 'localhost', port: 3000, path: '/api/time', method: 'GET' });
    assert('/api/time returns status 200', timeRes.status === 200);
    assert('Timezone is Asia/Karachi', timeRes.body.timezone === 'Asia/Karachi');
    assert('Target timestamp is exactly 1794855600000 (17 Nov 2026 00:00 PKT)', timeRes.body.target === 1794855600000);
    assert('Public unlock status is currently false', timeRes.body.isUnlocked === false);

    // 2. Unlock verification endpoint without preview token
    const unlockRes = await makeRequest({ host: 'localhost', port: 3000, path: '/api/verify-unlock', method: 'GET' });
    assert('/api/verify-unlock returns status 200', unlockRes.status === 200);
    assert('/api/verify-unlock reports unlocked: false for public visitors', unlockRes.body.unlocked === false);
    assert('/api/verify-unlock reports isPreview: false for public visitors', unlockRes.body.isPreview === false);

    // 3. Admin security: invalid password rejected
    const badLogin = await makeRequest(
      { host: 'localhost', port: 3000, path: '/api/admin/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { password: 'wrong_password_test_123' }
    );
    assert('Admin login rejects wrong password with 401', badLogin.status === 401);

    // 4. Admin security: valid password accepted
    const validPassword = process.env.ADMIN_PASSWORD || 'shonabhai2026';
    const goodLogin = await makeRequest(
      { host: 'localhost', port: 3000, path: '/api/admin/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { password: validPassword }
    );
    assert('Admin login accepts valid password', goodLogin.status === 200 && goodLogin.body.success === true);
    assert('Admin login issues signed token', typeof goodLogin.body.token === 'string' && goodLogin.body.token.includes('.'));

    const adminToken = goodLogin.body.token;

    // 5. Admin Preview Token generation
    const previewRes = await makeRequest({
      host: 'localhost',
      port: 3000,
      path: '/api/admin/preview-token',
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert('Admin can request 30-second preview token', previewRes.status === 200);
    assert('Preview duration is 30 seconds', previewRes.body.durationSeconds === 30);

    const previewToken = previewRes.body.previewToken;

    // 6. Verify preview token activates 30-second simulation without changing public deadline
    const previewUnlockRes = await makeRequest({
      host: 'localhost',
      port: 3000,
      path: '/api/verify-unlock',
      method: 'GET',
      headers: { 'x-admin-preview-token': previewToken },
    });
    assert('Preview token activates preview mode in /api/verify-unlock', previewUnlockRes.body.isPreview === true);
    assert('Preview token remainingMs is ~30s', previewUnlockRes.body.remainingMs <= 30000 && previewUnlockRes.body.remainingMs > 25000);

    // 7. Re-verify public deadline was not modified by preview token
    const recheckPublic = await makeRequest({ host: 'localhost', port: 3000, path: '/api/verify-unlock', method: 'GET' });
    assert('Public deadline is untouched at 1794855600000 after preview test', recheckPublic.body.target === 1794855600000);
    assert('Public unlock remains strictly false', recheckPublic.body.unlocked === false);

    // 8. Asset management endpoint
    const assetsRes = await makeRequest({ host: 'localhost', port: 3000, path: '/api/admin/assets', method: 'GET' });
    assert('/api/admin/assets returns 200', assetsRes.status === 200);

    console.log(`\nQA TEST RESULTS: ${passed} PASSED, ${failed} FAILED.`);
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTests();
