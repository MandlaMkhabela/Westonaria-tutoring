/**
 * products.js — West Rand Exam Prep product catalog
 *
 * Single source of truth for every subject pack sold on the site.
 * Used by:
 *   - script.js          (renders the shop grid, builds Yoco checkouts)
 *   - payment-success.html (looks up what to unlock after payment)
 *
 * ── HOW TO EDIT THIS FILE ─────────────────────────────────────────────────
 * 1. `price` is in RANDS (script.js converts to cents for Yoco automatically).
 * 2. `driveUrl` — a Google Drive folder link containing the notes, past
 *    papers and memos for that subject. Set sharing to "Anyone with the link
 *    can view".
 * 3. `youtubeUrl` — a YouTube playlist link with the video lessons for that
 *    subject. Set the playlist visibility to "Unlisted" (not Private) so the
 *    link works for buyers but the playlist doesn't show up in search.
 * 4. `id` must be unique and URL-safe (letters, numbers, dashes only) — it's
 *    used in the success-page URL, e.g. payment-success.html?product=g12-maths
 * ─────────────────────────────────────────────────────────────────────────
 */

const PRODUCTS = [

    // ── Grade 12 (Matric) — Trial Exam Packs ──────────────────────────────
    {
        id: 'g12-maths', grade: 12, subject: 'Mathematics', price: 60,
        icon: 'fa-square-root-variable',
        includes: ['Full video lesson playlist', 'Topic summary notes (PDF)', 'Past paper solutions', '5 years of past papers'],
        driveUrl: 'https://drive.google.com/drive/folders/REPLACE_G12_MATHS',
        youtubeUrl: 'https://youtube.com/playlist?list=REPLACE_G12_MATHS',
    },
    {
        id: 'g12-maths-lit', grade: 12, subject: 'Mathematical Literacy', price: 60,
        icon: 'fa-calculator',
        includes: ['Full video lesson playlist', 'Topic summary notes (PDF)', 'Past paper solutions', '5 years of past papers'],
        driveUrl: 'https://drive.google.com/drive/folders/REPLACE_G12_MATHLIT',
        youtubeUrl: 'https://youtube.com/playlist?list=REPLACE_G12_MATHLIT',
    },
    {
        id: 'g12-physical-sciences', grade: 12, subject: 'Physical Sciences', price: 60,
        icon: 'fa-flask',
        includes: ['Full video lesson playlist', 'Topic summary notes (PDF)', 'Past paper solutions', '5 years of past papers'],
        driveUrl: 'https://drive.google.com/drive/folders/REPLACE_G12_PHYSCI',
        youtubeUrl: 'https://youtube.com/playlist?list=REPLACE_G12_PHYSCI',
    },
    {
        id: 'g12-life-sciences', grade: 12, subject: 'Life Sciences', price: 60,
        icon: 'fa-dna',
        includes: ['Full video lesson playlist', 'Topic summary notes (PDF)', 'Past paper solutions', '5 years of past papers'],
        driveUrl: 'https://drive.google.com/drive/folders/REPLACE_G12_LIFESCI',
        youtubeUrl: 'https://youtube.com/playlist?list=REPLACE_G12_LIFESCI',
    },
    {
        id: 'g12-accounting', grade: 12, subject: 'Accounting', price: 60,
        icon: 'fa-file-invoice-dollar',
        includes: ['Full video lesson playlist', 'Topic summary notes (PDF)', 'Past paper solutions', '5 years of past papers'],
        driveUrl: 'https://drive.google.com/drive/folders/REPLACE_G12_ACC',
        youtubeUrl: 'https://youtube.com/playlist?list=REPLACE_G12_ACC',
    },
    {
        id: 'g12-economics', grade: 12, subject: 'Economics', price: 60,
        icon: 'fa-chart-line',
        includes: ['Full video lesson playlist', 'Topic summary notes (PDF)', 'Past paper solutions', '5 years of past papers'],
        driveUrl: 'https://drive.google.com/drive/folders/REPLACE_G12_ECON',
        youtubeUrl: 'https://youtube.com/playlist?list=REPLACE_G12_ECON',
    },
    {
        id: 'g12-business-studies', grade: 12, subject: 'Business Studies', price: 60,
        icon: 'fa-briefcase',
        includes: ['Full video lesson playlist', 'Topic summary notes (PDF)', 'Past paper solutions', '5 years of past papers'],
        driveUrl: 'https://drive.google.com/drive/folders/REPLACE_G12_BSTUD',
        youtubeUrl: 'https://youtube.com/playlist?list=REPLACE_G12_BSTUD',
    },
    {
        id: 'g12-geography', grade: 12, subject: 'Geography', price: 60,
        icon: 'fa-earth-africa',
        includes: ['Full video lesson playlist', 'Topic summary notes (PDF)', 'Past paper solutions', '5 years of past papers'],
        driveUrl: 'https://drive.google.com/drive/folders/REPLACE_G12_GEO',
        youtubeUrl: 'https://youtube.com/playlist?list=REPLACE_G12_GEO',
    },

    // ── Grade 11 — Exam Prep Packs ─────────────────────────────────────────
    {
        id: 'g11-maths', grade: 11, subject: 'Mathematics', price: 50,
        icon: 'fa-square-root-variable',
        includes: ['Full video lesson playlist', 'Topic summary notes (PDF)', 'Past paper solutions', '3 years of past papers'],
        driveUrl: 'https://drive.google.com/drive/folders/REPLACE_G11_MATHS',
        youtubeUrl: 'https://youtube.com/playlist?list=REPLACE_G11_MATHS',
    },
    {
        id: 'g11-physical-sciences', grade: 11, subject: 'Physical Sciences', price: 50,
        icon: 'fa-flask',
        includes: ['Full video lesson playlist', 'Topic summary notes (PDF)', 'Past paper solutions', '3 years of past papers'],
        driveUrl: 'https://drive.google.com/drive/folders/REPLACE_G11_PHYSCI',
        youtubeUrl: 'https://youtube.com/playlist?list=REPLACE_G11_PHYSCI',
    },
    {
        id: 'g11-life-sciences', grade: 11, subject: 'Life Sciences', price: 50,
        icon: 'fa-dna',
        includes: ['Full video lesson playlist', 'Topic summary notes (PDF)', 'Past paper solutions', '3 years of past papers'],
        driveUrl: 'https://drive.google.com/drive/folders/REPLACE_G11_LIFESCI',
        youtubeUrl: 'https://youtube.com/playlist?list=REPLACE_G11_LIFESCI',
    },
    {
        id: 'g11-accounting', grade: 11, subject: 'Accounting', price: 50,
        icon: 'fa-file-invoice-dollar',
        includes: ['Full video lesson playlist', 'Topic summary notes (PDF)', 'Past paper solutions', '3 years of past papers'],
        driveUrl: 'https://drive.google.com/drive/folders/REPLACE_G11_ACC',
        youtubeUrl: 'https://youtube.com/playlist?list=REPLACE_G11_ACC',
    },

    // ── Bundles ─────────────────────────────────────────────────────────────
    {
        id: 'g12-bundle-all', grade: 12, subject: 'All Subjects Bundle', price: 250,
        icon: 'fa-crown', bundle: true,
        includes: ['Every Grade 12 subject pack above', 'All video playlists', 'All notes & memos', 'All past papers'],
        driveUrl: 'https://drive.google.com/drive/folders/REPLACE_G12_BUNDLE',
        youtubeUrl: 'https://youtube.com/playlist?list=REPLACE_G12_BUNDLE',
    },
    {
        id: 'g11-bundle-all', grade: 11, subject: 'All Subjects Bundle', price: 200,
        icon: 'fa-crown', bundle: true,
        includes: ['Every Grade 11 subject pack above', 'All video playlists', 'All notes & memos', 'All past papers'],
        driveUrl: 'https://drive.google.com/drive/folders/REPLACE_G11_BUNDLE',
        youtubeUrl: 'https://youtube.com/playlist?list=REPLACE_G11_BUNDLE',
    },
];

// Quick lookup helper used by payment-success.html
function getProductById(id) {
    return PRODUCTS.find(p => p.id === id) || null;
}

if (typeof window !== 'undefined') {
    window.PRODUCTS = PRODUCTS;
    window.getProductById = getProductById;
}
