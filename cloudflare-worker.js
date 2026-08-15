// ── West Rand Exam Prep — Yoco checkout proxy ──────────────────────────────
// Deploy this as its own Cloudflare Worker (separate from any West Rand
// Connect worker you already have — one worker per Yoco account is simplest).
//
// Switch TEST_MODE to false (and swap the key) when you're ready to take
// real payments. Get your keys from: business.yoco.com → Settings → API Keys
//
// IMPORTANT: move YOCO_SECRET_KEY into a Worker "Secret" instead of hardcoding
// it here before you go live — see SETUP-GUIDE.md for how.

const TEST_MODE       = true;
const YOCO_SECRET_KEY = TEST_MODE
  ? 'sk_test_REPLACE_WITH_YOUR_TEST_KEY'   // ← test key
  : 'sk_live_REPLACE_WITH_YOUR_LIVE_KEY';  // ← live key

export default {
  async fetch(request) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const body = await request.json();
    const { currency = 'ZAR', successUrl, cancelUrl, description } = body;
    const amountInCents = body.amountInCents;

    if (!amountInCents || amountInCents < 100) {
      return new Response(JSON.stringify({ error: 'Amount must be at least 100 cents (R1.00)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    if (!successUrl || !cancelUrl) {
      return new Response(JSON.stringify({ error: 'successUrl and cancelUrl are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const yocoResponse = await fetch('https://payments.yoco.com/api/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${YOCO_SECRET_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `wrep-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      },
      body: JSON.stringify({
        amount: amountInCents,
        currency,
        successUrl,
        cancelUrl,
        ...(description && { description })
      })
    });

    const data = await yocoResponse.json();

    if (!yocoResponse.ok) {
      return new Response(JSON.stringify({ error: data.displayMessage || data.message || 'Yoco checkout failed' }), {
        status: yocoResponse.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    return new Response(JSON.stringify({ redirectUrl: data.redirectUrl, checkoutId: data.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
};
