/* ============================================
   WEST RAND EXAM PREP — Q&A Platform Backend
   Cloudflare Worker with KV Storage
   ============================================
   DEPLOYMENT:
   1. Create a KV namespace: dash.cloudflare.com → Workers & Pages → KV
   2. Bind it to this Worker as "QUESTIONS_KV"
   3. Deploy this Worker
   4. Copy the Worker URL into script.js
   KV BINDING NAME: QUESTIONS_KV
   ============================================ */

const TEST_MODE = true;
const YOCO_SECRET_KEY = TEST_MODE
  ? 'sk_test_118399e5bBbMmDZac2145cdb09ee'
  : 'sk_live_REPLACE_WITH_YOUR_LIVE_KEY';

const ADMIN_SECRET = 'westrand2026';
const DEFAULT_PRICE_CENTS = 2500;

const ALLOWED_ORIGINS = [
  'http://localhost:8000',
  'http://localhost:3000',
  'http://127.0.0.1:5500',
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const path = url.pathname;
    const method = request.method;

    if (method === 'OPTIONS') return handleCORS(origin);

    try {
      if (path === '/api/questions' && method === 'GET') return await listQuestions(env, origin);
      if (path === '/api/questions' && method === 'POST') return await createQuestion(request, env, origin);
      if (path.startsWith('/api/questions/') && path.endsWith('/solution') && method === 'GET') {
        const id = path.split('/')[3];
        return await getSolution(id, env, origin);
      }
      if (path === '/api/checkout' && method === 'POST') return await createCheckout(request, env, origin);
      if (path === '/api/verify-payment' && method === 'POST') return await verifyPayment(request, env, origin);
      if (path === '/api/admin/questions' && method === 'GET') return await adminListQuestions(request, env, origin);
      if (path === '/api/admin/solution' && method === 'POST') return await adminSubmitSolution(request, env, origin);
      if (path === '/api/admin/stats' && method === 'GET') return await adminStats(request, env, origin);

      return jsonResponse({ error: 'Not found' }, 404, origin);
    } catch (err) {
      return jsonResponse({ error: 'Internal error', details: err.message }, 500, origin);
    }
  }
};

async function listQuestions(env, origin) {
  const listJson = await env.QUESTIONS_KV.get('questions:list');
  const ids = listJson ? JSON.parse(listJson) : [];
  const questions = [];
  for (const id of ids.slice(-50).reverse()) {
    const qJson = await env.QUESTIONS_KV.get(`question:${id}`);
    if (qJson) {
      const q = JSON.parse(qJson);
      questions.push({
        id: q.id, name: q.name, subject: q.subject, grade: q.grade,
        questionText: q.questionText, imageBase64: q.imageBase64,
        postedAt: q.postedAt, status: q.status, price: q.price || DEFAULT_PRICE_CENTS,
      });
    }
  }
  return jsonResponse({ questions }, 200, origin);
}

async function createQuestion(request, env, origin) {
  const body = await request.json();
  const { name, email, subject, grade, questionText, imageBase64 } = body;
  if (!name || !email || !subject || !grade || !questionText) {
    return jsonResponse({ error: 'Missing required fields' }, 400, origin);
  }
  const id = 'q_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  const question = {
    id, name, email, subject, grade, questionText,
    imageBase64: imageBase64 || null,
    postedAt: new Date().toISOString(),
    status: 'pending',
    price: DEFAULT_PRICE_CENTS,
    solutionText: null, solutionImageBase64: null, solvedAt: null,
  };
  await env.QUESTIONS_KV.put(`question:${id}`, JSON.stringify(question));
  const listJson = await env.QUESTIONS_KV.get('questions:list');
  const ids = listJson ? JSON.parse(listJson) : [];
  ids.push(id);
  await env.QUESTIONS_KV.put('questions:list', JSON.stringify(ids));
  return jsonResponse({ success: true, questionId: id }, 201, origin);
}

async function getSolution(id, env, origin) {
  const qJson = await env.QUESTIONS_KV.get(`question:${id}`);
  if (!qJson) return jsonResponse({ error: 'Question not found' }, 404, origin);
  const q = JSON.parse(qJson);
  if (q.status !== 'solved') return jsonResponse({ error: 'Solution not available yet' }, 403, origin);
  return jsonResponse({
    solutionText: q.solutionText, solutionImageBase64: q.solutionImageBase64, solvedAt: q.solvedAt,
  }, 200, origin);
}

async function createCheckout(request, env, origin) {
  const body = await request.json();
  const { questionId, email, successUrl, cancelUrl } = body;
  if (!questionId || !email || !successUrl) return jsonResponse({ error: 'Missing required fields' }, 400, origin);
  const qJson = await env.QUESTIONS_KV.get(`question:${questionId}`);
  if (!qJson) return jsonResponse({ error: 'Question not found' }, 404, origin);
  const q = JSON.parse(qJson);
  const amount = q.price || DEFAULT_PRICE_CENTS;
  const yocoRes = await fetch('https://payments.yoco.com/api/checkouts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${YOCO_SECRET_KEY}` },
    body: JSON.stringify({
      amount: amount, currency: 'ZAR',
      description: `Solution: ${q.subject} — ${q.grade}`,
      metadata: { questionId: questionId, payerEmail: email, source: 'west-rand-qa' },
      successUrl: successUrl, cancelUrl: cancelUrl || successUrl,
    }),
  });
  const yocoData = await yocoRes.json();
  if (!yocoRes.ok) return jsonResponse({ error: 'Payment provider error', details: yocoData.message || 'Unknown error' }, 502, origin);
  await env.QUESTIONS_KV.put(`payment:${yocoData.id}`, JSON.stringify({
    checkoutId: yocoData.id, questionId, payerEmail: email, amount, status: 'pending', createdAt: new Date().toISOString(),
  }));
  return jsonResponse({ redirectUrl: yocoData.redirectUrl, checkoutId: yocoData.id }, 200, origin);
}

async function verifyPayment(request, env, origin) {
  const body = await request.json();
  const { checkoutId } = body;
  if (!checkoutId) return jsonResponse({ error: 'Missing checkoutId' }, 400, origin);
  const yocoRes = await fetch(`https://payments.yoco.com/api/checkouts/${checkoutId}`, {
    headers: { 'Authorization': `Bearer ${YOCO_SECRET_KEY}` },
  });
  const yocoData = await yocoRes.json();
  if (!yocoRes.ok) return jsonResponse({ error: 'Failed to verify payment' }, 502, origin);
  const payJson = await env.QUESTIONS_KV.get(`payment:${checkoutId}`);
  if (payJson) {
    const pay = JSON.parse(payJson);
    pay.status = yocoData.status;
    pay.verifiedAt = new Date().toISOString();
    await env.QUESTIONS_KV.put(`payment:${checkoutId}`, JSON.stringify(pay));
    if (yocoData.status === 'paid') {
      const unlockKey = `unlock:${pay.questionId}:${pay.payerEmail}`;
      await env.QUESTIONS_KV.put(unlockKey, JSON.stringify({
        questionId: pay.questionId, email: pay.payerEmail, paidAt: new Date().toISOString(), amount: pay.amount,
      }));
    }
  }
  return jsonResponse({ status: yocoData.status, paid: yocoData.status === 'paid', questionId: yocoData.metadata?.questionId }, 200, origin);
}

function checkAdmin(request) {
  return (request.headers.get('Authorization') || '') === `Bearer ${ADMIN_SECRET}`;
}

async function adminListQuestions(request, env, origin) {
  if (!checkAdmin(request)) return jsonResponse({ error: 'Unauthorized' }, 401, origin);
  const listJson = await env.QUESTIONS_KV.get('questions:list');
  const ids = listJson ? JSON.parse(listJson) : [];
  const questions = [];
  for (const id of ids.reverse()) {
    const qJson = await env.QUESTIONS_KV.get(`question:${id}`);
    if (qJson) questions.push(JSON.parse(qJson));
  }
  return jsonResponse({ questions }, 200, origin);
}

async function adminSubmitSolution(request, env, origin) {
  if (!checkAdmin(request)) return jsonResponse({ error: 'Unauthorized' }, 401, origin);
  const body = await request.json();
  const { questionId, solutionText, solutionImageBase64 } = body;
  if (!questionId || !solutionText) return jsonResponse({ error: 'Missing required fields' }, 400, origin);
  const qJson = await env.QUESTIONS_KV.get(`question:${questionId}`);
  if (!qJson) return jsonResponse({ error: 'Question not found' }, 404, origin);
  const q = JSON.parse(qJson);
  q.status = 'solved';
  q.solutionText = solutionText;
  q.solutionImageBase64 = solutionImageBase64 || null;
  q.solvedAt = new Date().toISOString();
  await env.QUESTIONS_KV.put(`question:${questionId}`, JSON.stringify(q));
  return jsonResponse({ success: true }, 200, origin);
}

async function adminStats(request, env, origin) {
  if (!checkAdmin(request)) return jsonResponse({ error: 'Unauthorized' }, 401, origin);
  const listJson = await env.QUESTIONS_KV.get('questions:list');
  const ids = listJson ? JSON.parse(listJson) : [];
  let pending = 0, solved = 0, totalRevenue = 0;
  for (const id of ids) {
    const qJson = await env.QUESTIONS_KV.get(`question:${id}`);
    if (qJson) {
      const q = JSON.parse(qJson);
      if (q.status === 'pending') pending++; else solved++;
    }
  }
  const payments = await env.QUESTIONS_KV.list({ prefix: 'payment:' });
  for (const key of payments.keys) {
    const pJson = await env.QUESTIONS_KV.get(key.name);
    if (pJson) {
      const p = JSON.parse(pJson);
      if (p.status === 'paid') totalRevenue += p.amount;
    }
  }
  return jsonResponse({ total: ids.length, pending, solved, totalRevenue }, 200, origin);
}

function handleCORS(origin) {
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

function jsonResponse(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
  });
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}