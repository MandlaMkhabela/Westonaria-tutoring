/* ============================================
   WEST RAND EXAM PREP — Q&A Frontend
   ============================================ */

const API_URL = 'https://west-rand-api-v2.westonaria-connect.workers.dev';
const SITE_URL = window.location.origin;

let allQuestions = [];
let currentImageBase64 = null;
let currentUnlockQuestion = null;

document.addEventListener('DOMContentLoaded', () => {
    loadQuestions();
    checkConfig();
});

async function loadQuestions() {
    const grid = document.getElementById('questionsGrid');
    grid.innerHTML = `<div class="loading-state"><i class="fas fa-spinner fa-spin"></i><p>Loading questions...</p></div>`;

    try {
        const res = await fetch(`${API_URL}/api/questions`);
        const data = await res.json();
        allQuestions = data.questions || [];
        updateStats();
        applyFilters();
    } catch (err) {
        grid.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-circle"></i><h3>Could not load questions</h3><p>Please check your internet connection and try again.</p></div>`;
    }
}

function updateStats() {
    const total = allQuestions.length;
    const solved = allQuestions.filter(q => q.status === 'solved').length;
    const pending = allQuestions.filter(q => q.status === 'pending').length;
    animateNumber('statTotal', total);
    animateNumber('statSolved', solved);
    animateNumber('statPending', pending);
}

function animateNumber(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    const start = parseInt(el.textContent) || 0;
    const duration = 600;
    const startTime = performance.now();
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(start + (target - start) * ease);
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

function renderQuestions(questions) {
    const grid = document.getElementById('questionsGrid');
    const empty = document.getElementById('emptyState');
    if (questions.length === 0) {
        grid.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }
    empty.classList.add('hidden');
    grid.innerHTML = questions.map((q, i) => `
        <div class="question-card" onclick="openDetailModal('${q.id}')" style="animation: fadeInUp 0.4s ease ${i * 0.05}s both;">
            <div class="question-image">
                ${q.imageBase64 ? `<img src="${q.imageBase64}" alt="Question image" loading="lazy">` : `<div class="no-image"><i class="fas fa-image"></i></div>`}
                <span class="question-status ${q.status === 'solved' ? 'status-solved' : 'status-pending'}">${q.status === 'solved' ? 'Solved' : 'Pending'}</span>
            </div>
            <div class="question-body">
                <div class="question-meta">
                    <span class="meta-tag grade">${q.grade}</span>
                    <span class="meta-tag subject">${q.subject}</span>
                </div>
                <p class="question-text">${escapeHtml(q.questionText)}</p>
                <div class="question-footer">
                    <span class="question-author">by ${escapeHtml(q.name)}</span>
                    ${q.status === 'solved' ? `<span class="question-action action-unlock"><i class="fas fa-lock"></i> Unlock R${(q.price / 100).toFixed(0)}</span>` : `<span class="question-action action-waiting"><i class="fas fa-clock"></i> Waiting</span>`}
                </div>
            </div>
        </div>
    `).join('');
}

function applyFilters() {
    const grade = document.getElementById('filterGrade').value;
    const subject = document.getElementById('filterSubject').value;
    const status = document.getElementById('filterStatus').value;
    const search = document.getElementById('searchInput').value.toLowerCase();
    let filtered = allQuestions;
    if (grade) filtered = filtered.filter(q => q.grade === grade);
    if (subject) filtered = filtered.filter(q => q.subject === subject);
    if (status) filtered = filtered.filter(q => q.status === status);
    if (search) filtered = filtered.filter(q => q.questionText.toLowerCase().includes(search) || q.subject.toLowerCase().includes(search) || q.name.toLowerCase().includes(search));
    renderQuestions(filtered);
}

function openPostModal() {
    document.getElementById('postModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePostModal() {
    document.getElementById('postModal').classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('postForm').reset();
    removeImage();
}

function handleImageSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
        showToast('Image too large. Max 2MB.', 4000, 'error');
        event.target.value = '';
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        currentImageBase64 = e.target.result;
        document.getElementById('uploadPlaceholder').classList.add('hidden');
        document.getElementById('uploadPreview').classList.remove('hidden');
        document.getElementById('previewImg').src = currentImageBase64;
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    currentImageBase64 = null;
    document.getElementById('postImage').value = '';
    document.getElementById('uploadPlaceholder').classList.remove('hidden');
    document.getElementById('uploadPreview').classList.add('hidden');
}

async function handlePostSubmit(event) {
    event.preventDefault();
    if (API_URL.includes('REPLACE_WITH')) {
        showToast('Backend not configured yet. Deploy the Worker first.', 5000, 'error');
        return;
    }
    const btn = document.getElementById('postSubmitBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...';
    const data = {
        name: document.getElementById('postName').value.trim(),
        email: document.getElementById('postEmail').value.trim(),
        grade: document.getElementById('postGrade').value,
        subject: document.getElementById('postSubject').value,
        questionText: document.getElementById('postText').value.trim(),
        imageBase64: currentImageBase64,
    };
    try {
        const res = await fetch(`${API_URL}/api/questions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await res.json();
        if (res.ok) {
            showToast('Question posted! We will solve it soon.', 4000, 'success');
            closePostModal();
            loadQuestions();
        } else {
            showToast(result.error || 'Failed to post question.', 4000, 'error');
        }
    } catch (err) {
        showToast('Network error. Please try again.', 4000, 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Post Question';
    }
}

function openDetailModal(questionId) {
    const q = allQuestions.find(q => q.id === questionId);
    if (!q) return;
    const content = document.getElementById('detailContent');
    content.innerHTML = `
        <div class="detail-question">
            <div class="detail-meta">
                <span class="meta-tag grade">${q.grade}</span>
                <span class="meta-tag subject">${q.subject}</span>
                <span class="meta-tag">${q.status === 'solved' ? 'Solved' : 'Pending'}</span>
            </div>
            ${q.imageBase64 ? `<div class="detail-image"><img src="${q.imageBase64}" alt="Question"></div>` : ''}
            <div class="detail-text">${escapeHtml(q.questionText)}</div>
            <p style="color: var(--text-muted); font-size: 0.8rem;">Posted by ${escapeHtml(q.name)} &middot; ${formatDate(q.postedAt)}</p>
        </div>
        ${q.status === 'solved' ? `
            <div class="solution-section solved" id="solutionArea">
                <div class="paywall">
                    <div class="paywall-icon"><i class="fas fa-lock"></i></div>
                    <h4>Solution Locked</h4>
                    <p>This question has been solved. Unlock to view the full step-by-step solution.</p>
                    <div class="paywall-price">R${(q.price / 100).toFixed(0)}</div>
                    <button class="btn-primary" onclick="openUnlockModal('${q.id}')" style="padding: 12px 28px; font-size: 1rem;">
                        <i class="fas fa-unlock"></i> Unlock Solution
                    </button>
                </div>
            </div>
        ` : `
            <div class="solution-section">
                <div class="paywall" style="border-color: rgba(245,158,11,0.3);">
                    <div class="paywall-icon"><i class="fas fa-clock" style="color: var(--warning);"></i></div>
                    <h4>Solution Coming Soon</h4>
                    <p>This question is in the queue. Check back soon or browse solved questions.</p>
                </div>
            </div>
        `}
    `;
    document.getElementById('detailModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDetailModal() {
    document.getElementById('detailModal').classList.remove('active');
    document.body.style.overflow = '';
}

function openUnlockModal(questionId) {
    const q = allQuestions.find(q => q.id === questionId);
    if (!q) return;
    currentUnlockQuestion = q;
    const body = document.getElementById('unlockBody');
    body.innerHTML = `
        <div class="unlock-question">
            <h4>${escapeHtml(q.subject)} — ${q.grade}</h4>
            <p>${escapeHtml(q.questionText.substring(0, 100))}${q.questionText.length > 100 ? '...' : ''}</p>
        </div>
        <div class="unlock-price">R${(q.price / 100).toFixed(0)}</div>
        <p class="unlock-note">One-time payment. Lifetime access to this solution.</p>
        <div class="unlock-form">
            <div class="form-group">
                <label>Your Email *</label>
                <input type="email" id="unlockEmail" placeholder="your@email.com" required>
            </div>
            <button class="btn-primary" style="width: 100%; padding: 14px; font-size: 1rem;" onclick="processUnlock()">
                <i class="fas fa-credit-card"></i> Pay & Unlock
            </button>
        </div>
    `;
    closeDetailModal();
    document.getElementById('unlockModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeUnlockModal() {
    document.getElementById('unlockModal').classList.remove('active');
    document.body.style.overflow = '';
    currentUnlockQuestion = null;
}

async function processUnlock() {
    const email = document.getElementById('unlockEmail')?.value.trim();
    if (!email) {
        showToast('Please enter your email.', 3000, 'error');
        return;
    }
    if (API_URL.includes('REPLACE_WITH')) {
        showToast('Payments not configured yet. Deploy the Worker first.', 5000, 'error');
        return;
    }
    showLoading('Redirecting to secure checkout...');
    try {
        const res = await fetch(`${API_URL}/api/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                questionId: currentUnlockQuestion.id,
                email: email,
                successUrl: `${SITE_URL}/solution.html?question=${currentUnlockQuestion.id}`,
                cancelUrl: `${SITE_URL}/payment-cancelled.html?question=${currentUnlockQuestion.id}`,
            }),
        });
        const data = await res.json();
        hideLoading();
        if (!res.ok || !data.redirectUrl) throw new Error(data.error || 'Checkout failed');
        window.location.href = data.redirectUrl;
    } catch (err) {
        hideLoading();
        showToast('Payment failed. Please try again.', 4000, 'error');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const diff = (now - date) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
}

function showToast(message, duration = 4000, type = 'info') {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toastMessage');
    if (!toast || !msg) return;
    toast.className = 'toast ' + type;
    msg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
}

function showLoading(text = 'Processing...') {
    const overlay = document.getElementById('loadingOverlay');
    const txt = document.getElementById('loadingText');
    if (txt) txt.textContent = text;
    overlay?.classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingOverlay')?.classList.remove('active');
}

function checkConfig() {
    if (API_URL.includes('REPLACE_WITH')) {
        console.warn('[West Rand Exam Prep] API_URL not set. Update script.js before deploying.');
    }
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
        document.body.style.overflow = '';
    }
});