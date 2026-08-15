# West Rand Exam Prep — Setup Guide

Sells access to your YouTube video lessons, notes, and past-paper folders for
Matric (Grade 12) and Grade 11 students. Payment is handled by Yoco through a
Cloudflare Worker — the same pattern used in your West Rand Connect site.

## Files

| File | Purpose |
|---|---|
| `index.html` | Main shop page — subject packs, tabs, FAQ |
| `style.css` | All styling (dark red/black/cyan brand) |
| `products.js` | **Edit this** — your subjects, prices, YouTube & Drive links |
| `script.js` | Renders the shop, talks to the payment Worker |
| `cloudflare-worker.js` | Deploy this separately — it calls Yoco on your behalf |
| `payment-success.html` | Shown after payment — reveals the video/notes links |
| `payment-cancelled.html` | Shown if the buyer cancels checkout |

## 1. Get a Yoco account

1. Sign up at [business.yoco.com](https://business.yoco.com)
2. Go to **Settings → API Keys** and copy your **test** secret key
   (starts `sk_test_...`)

## 2. Deploy the payment Worker

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Worker**
2. Name it something like `west-rand-exam-prep-pay`
3. Click **Edit code**, delete the sample code, paste in the full contents of `cloudflare-worker.js`
4. Replace `sk_test_REPLACE_WITH_YOUR_TEST_KEY` with your real Yoco test key
5. Click **Deploy**
6. Copy the Worker's URL (looks like `https://west-rand-exam-prep-pay.<you>.workers.dev`)

**Before going live**, move the key into a Worker Secret instead of hardcoding it:
- Worker → **Settings** → **Variables and Secrets** → **Add** → name it `YOCO_SECRET_KEY`
- Update the Worker code: `const YOCO_SECRET_KEY = env.YOCO_SECRET_KEY;` and change
  `async fetch(request)` to `async fetch(request, env)`

## 3. Point the site at your Worker

Open `script.js` and update:

```js
const CHECKOUT_WORKER_URL = 'https://west-rand-exam-prep-pay.<you>.workers.dev';
const WHATSAPP_NUMBER = '27821234567'; // your WhatsApp, no + or spaces
```

Also set the same `WHATSAPP_NUMBER` in `payment-success.html` and
`payment-cancelled.html` (search for `27XXXXXXXXX` in each file).

## 4. Add your content

Open `products.js`. For each subject:

- **`price`** — in Rands (e.g. `60` = R60)
- **`youtubeUrl`** — an **Unlisted** YouTube playlist link (not Private — Unlisted
  means anyone with the link can watch, but it won't show up in search)
- **`driveUrl`** — a Google Drive folder link. Right-click the folder →
  **Share** → **General access: Anyone with the link (Viewer)**

Add or remove subjects/bundles freely — the shop grid and delivery page
rebuild themselves from this one file.

## 5. Upload to Cloudflare Pages

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Upload assets**
2. Upload: `index.html`, `style.css`, `script.js`, `products.js`,
   `payment-success.html`, `payment-cancelled.html`
3. Deploy — you'll get a URL like `https://west-rand-exam-prep.pages.dev`

## 6. Test a payment

1. Open your live site → pick a subject → **Unlock Pack**
2. On Yoco's test checkout, use test card `4000 0000 0000 0002`, any future
   expiry, any CVV
3. Confirm you land on `payment-success.html` with the right playlist/Drive
   links showing

## 7. Go live

1. In your Yoco dashboard, grab your **live** secret key
2. Update the Worker secret (`YOCO_SECRET_KEY`) with the live key
3. Flip `TEST_MODE = false` in `cloudflare-worker.js` if you kept the key
   hardcoded, or just swap the secret if you moved it to env vars
4. Re-test with a real small payment (e.g. R5) to yourself before announcing

## Notes on how delivery works

There's no login system here — it's kept intentionally simple for a fast
launch. After payment, Yoco redirects the buyer straight to
`payment-success.html?product=<id>`, which looks up that product in
`products.js` and shows the YouTube + Drive links immediately. Anyone who
loses that page can WhatsApp you their proof of payment for a resend — the
WhatsApp button on that page auto-fills the product name in the message so
you know exactly what to send.

If down the line you want buyers to create accounts, track purchases, or stop
casual link-sharing, that's a bigger build (a real backend + auth) — happy to
help with that when you're ready to scale.
