/* ── Bhutan Lifestyle Study · script.js ── */

let visitorName = '';

// ── Toggle PDF/preview viewer ──────────────────────────────────────────────
function togglePdfReader(viewerId, btn) {
  const viewer = document.getElementById(viewerId);
  if (!viewer) return;
  const isOpen = viewer.style.display !== 'none';
  viewer.style.display = isOpen ? 'none' : 'block';
  if (btn) btn.classList.toggle('prc-toggle-btn--active', !isOpen);
}

// ── Show home section (tabs) ───────────────────────────────────────────────
function showHomeSection(sectionId, btn) {
  document.querySelectorAll('.home-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.home-tab').forEach(b => b.classList.remove('active'));
  const target = document.getElementById('home-' + sectionId);
  if (target) target.classList.add('active');
  if (btn) btn.classList.add('active');
}

// ── Google Sheets logging ──────────────────────────────────────────────────
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbys3-Yefk8RbNEMZFzBJ9xupG4WMWhitYAw1EfoJnQwDEI-miDb9jNC2bthJtGbLGib2A/exec';

function logVisitor(name) {
  if (!SHEET_URL || SHEET_URL === 'YOUR_APPS_SCRIPT_URL') return;
  const now = new Date().toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
  fetch(SHEET_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, time: now }),
    mode: 'no-cors',
  }).catch(() => {});
}

// ── Greeting helper ────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ── Name submission ────────────────────────────────────────────────────────
function submitName() {
  const input = document.getElementById('inp-name');
  const err   = document.getElementById('name-error');
  const name  = input.value.trim();

  if (!name) {
    err.style.display = 'block';
    input.focus();
    return;
  }

  err.style.display = 'none';
  visitorName = name;
  logVisitor(name);

  // Set avatar (first letter)
  const avatar = document.getElementById('sidebar-avatar');
  avatar.textContent = name.charAt(0).toUpperCase();

  // Set username in sidebar
  document.getElementById('sidebar-username').textContent = name;

  // Personalised greetings for page cards
  const greet = getGreeting();
  setGreetingCards(name, greet);

  // Show greeting bar
  const bar = document.getElementById('greeting-bar');
  document.getElementById('greeting-text').innerHTML =
    `${greet}, <strong>${name}</strong> — welcome to SomPel Tech website 2026.`;

  // Transition screens
  document.getElementById('name-screen').style.display = 'none';

  const appScreen = document.getElementById('app-screen');
  appScreen.classList.add('visible');
  appScreen.style.opacity = '0';
  appScreen.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { appScreen.style.opacity = '1'; });
  });

  // Animate market bars after a short delay (they'll be visible on market page)
  setTimeout(animateMarketBars, 600);

  window.scrollTo({ top: 0, behavior: 'instant' });
}

// ── Per-page personalised greeting cards ───────────────────────────────────
function setGreetingCards(name, greet) {
  const cards = [
    {
      id: 'about-greeting-text',
      text: `${name}, this section explains why this study was conducted, who carried it out, and what questions it set out to answer.`,
    },
    {
      id: 'findings-greeting-text',
      text: `${name}, here's a breakdown of the seven key findings from the study — from respondent distribution to market readiness for wellness tools.`,
    },
    {
      id: 'market-greeting-text',
      text: ` ${name}, this section examines whether Bhutan has a viable market for digital wellness tools — and what the data says.`,
    },
  ];
  cards.forEach(({ id, text }) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  });
}

// ── Pages that are live (others show "Coming Soon") ───────────────────────
const LIVE_PAGES = ['home', 'about', 'findings', 'market', 'tableau', 'report', 'products', 'quiz'];

// ── Navigation ─────────────────────────────────────────────────────────────
function navigateTo(pageId, btn) {
  // If page isn't live yet, show the coming-soon overlay
  if (!LIVE_PAGES.includes(pageId)) {
    showComingSoon(pageId);
    return;
  }

  // Deactivate all pages & nav items
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  // Activate target page
  const target = document.getElementById('page-' + pageId);
  if (target) {
    target.classList.add('active');
    target.style.animation = 'none';
    target.offsetHeight; // reflow
    target.style.animation = '';
  }

  // Activate nav button
  if (btn) btn.classList.add('active');

  // Animate bars if navigating to market page
  if (pageId === 'market') {
    setTimeout(animateMarketBars, 200);
  }

  // Init quiz when navigating to it
  if (pageId === 'quiz') {
    setTimeout(quizRenderStep, 50);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Coming Soon overlay ────────────────────────────────────────────────────
const PAGE_LABELS = {
  about:    { label: 'About This Project', icon: 'ℹ️' },
  findings: { label: 'Key Findings',        icon: '📊' },
  market:   { label: 'Market Readiness',    icon: '📱' },
  tableau:  { label: 'Tableau Story',       icon: '📐' },
  report:   { label: 'Report',              icon: '📄' },
};

function showComingSoon(pageId) {
  // Remove any existing overlay
  const old = document.getElementById('coming-soon-overlay');
  if (old) old.remove();

  const info = PAGE_LABELS[pageId] || { label: pageId, icon: '🔒' };

  const overlay = document.createElement('div');
  overlay.id = 'coming-soon-overlay';
  overlay.innerHTML = `
    <div class="cs-backdrop" onclick="closeComingSoon()"></div>
    <div class="cs-card">
      <div class="cs-icon">${info.icon}</div>
      <div class="cs-tag">Coming Soon</div>
      <h2 class="cs-title">${info.label}</h2>
      <p class="cs-text">This section is being prepared and will be available soon. Stay tuned!</p>
      <button class="cs-btn" onclick="closeComingSoon()">← Back to Home</button>
    </div>
  `;
  document.body.appendChild(overlay);

  // Trigger animation
  requestAnimationFrame(() => overlay.classList.add('cs-visible'));
}

function closeComingSoon() {
  const overlay = document.getElementById('coming-soon-overlay');
  if (!overlay) return;
  overlay.classList.remove('cs-visible');
  setTimeout(() => overlay.remove(), 280);
}

// ── Market bar animation ───────────────────────────────────────────────────
let barsAnimated = false;

function animateMarketBars() {
  // Animate both old .market-bar-fill and new .mkt-card-bar-fill
  const bars = document.querySelectorAll('.market-bar-fill, .mkt-card-bar-fill');
  bars.forEach(bar => {
    const target = bar.getAttribute('data-target');
    if (target) {
      bar.style.width = '0';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bar.style.width = target + '%';
        });
      });
    }
  });
}

// ── Scroll to finding card ─────────────────────────────────────────────────
function scrollToFinding(id) {
  // Make sure findings page is active
  const findingsBtn = document.querySelector('[data-page="findings"]');
  navigateTo('findings', findingsBtn);
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('finding-highlight');
      setTimeout(() => el.classList.remove('finding-highlight'), 1400);
    }
  }, 150);
}


function doSignOut() {
  const appScreen = document.getElementById('app-screen');
  appScreen.style.transition = 'opacity 0.3s ease';
  appScreen.style.opacity = '0';

  setTimeout(() => {
    appScreen.classList.remove('visible');
    appScreen.style.opacity = '';
    appScreen.style.transition = '';

    document.getElementById('name-screen').style.display = 'flex';
    document.getElementById('inp-name').value = '';
    document.getElementById('name-error').style.display = 'none';
    visitorName = '';

    // Reset nav to home
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-home').classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const homeBtn = document.querySelector('[data-page="home"]');
    if (homeBtn) homeBtn.classList.add('active');

    barsAnimated = false;
  }, 300);
}

// ── Keyboard: Enter on name screen ────────────────────────────────────────
document.addEventListener('keydown', function (e) {
  if (e.key !== 'Enter') return;
  const ns = document.getElementById('name-screen');
  if (ns && ns.style.display !== 'none') {
    submitName();
  }
});


// ── QUIZ PAGE ────────────────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  {
    section: 'Section 1 · Demographics',
    q: 'Where do you currently live?',
    key: 'residence',
    type: 'list',
    opts: [
      { val: 'urban',      label: '🏙️ Urban',      sub: 'City or town centre' },
      { val: 'semi-urban', label: '🏘️ Semi-urban',  sub: 'Town outskirts or peri-urban' },
      { val: 'rural',      label: '🌾 Rural',       sub: 'Village or remote area' },
    ],
  },
  {
    section: 'Section 1 · Demographics',
    q: 'What is your age group?',
    key: 'age',
    type: 'grid',
    opts: [
      { val: 'under18', label: 'Under 18' },
      { val: '18-25',   label: '18 – 25' },
      { val: '26-35',   label: '26 – 35' },
      { val: '36-50',   label: '36 – 50' },
      { val: '50+',     label: '50+' },
    ],
  },
  {
    section: 'Section 2 · Work & Daily Routine',
    q: 'What kind of work do you mostly do?',
    key: 'workType',
    type: 'list',
    opts: [
      { val: 'mental',   label: '🧠 Mostly mental',   sub: 'Study, office, screens' },
      { val: 'physical', label: '💪 Mostly physical',  sub: 'Farming, walking, labour' },
      { val: 'mixed',    label: '⚖️ Mixed',            sub: 'Both types equally' },
    ],
  },
  {
    section: 'Section 2 · Work & Daily Routine',
    q: 'How many hours do you work or study per day?',
    key: 'workHours',
    type: 'grid',
    opts: [
      { val: '0-4', label: '0 – 4 hrs' },
      { val: '5-6', label: '5 – 6 hrs' },
      { val: '7-8', label: '7 – 8 hrs' },
      { val: '8+',  label: 'More than 8 hrs' },
    ],
  },
  {
    section: 'Section 3 · Screen Habits',
    q: 'How long do you use your phone <em>before sleep</em>?',
    key: 'screenTime',
    type: 'list',
    opts: [
      { val: 'none', label: '📵 No phone before bed' },
      { val: '<30',  label: '⏱️ Under 30 minutes' },
      { val: '30-60',label: '🕐 30 – 60 minutes' },
      { val: '1-2h', label: '📱 1 – 2 hours' },
      { val: '2h+',  label: '🌀 More than 2 hours' },
    ],
  },
  {
    section: 'Section 4 · Sleep Duration',
    q: 'How many hours do you sleep per night on average?',
    key: 'sleepHours',
    type: 'grid',
    opts: [
      { val: '0-4', label: '0 – 4 hrs' },
      { val: '5-6', label: '5 – 6 hrs' },
      { val: '7-8', label: '7 – 8 hrs' },
      { val: '8+',  label: 'More than 8 hrs' },
    ],
  },
  {
    section: 'Section 5 · Sleep Quality',
    q: 'I fall asleep easily at night.',
    key: 'fallAsleep',
    type: 'likert',
    opts: [
      { val: '1', label: '😖', sub: 'Strongly\nDisagree' },
      { val: '2', label: '😕', sub: 'Disagree' },
      { val: '3', label: '😐', sub: 'Neutral' },
      { val: '4', label: '🙂', sub: 'Agree' },
      { val: '5', label: '😄', sub: 'Strongly\nAgree' },
    ],
  },
  {
    section: 'Section 5 · Sleep Quality',
    q: 'I wake up feeling rested and refreshed.',
    key: 'wakeRested',
    type: 'likert',
    opts: [
      { val: '1', label: '😖', sub: 'Strongly\nDisagree' },
      { val: '2', label: '😕', sub: 'Disagree' },
      { val: '3', label: '😐', sub: 'Neutral' },
      { val: '4', label: '🙂', sub: 'Agree' },
      { val: '5', label: '😄', sub: 'Strongly\nAgree' },
    ],
  },
  {
    section: 'Section 5 · Sleep Quality',
    q: 'I have enough energy throughout the day.',
    key: 'dayEnergy',
    type: 'likert',
    opts: [
      { val: '1', label: '😖', sub: 'Strongly\nDisagree' },
      { val: '2', label: '😕', sub: 'Disagree' },
      { val: '3', label: '😐', sub: 'Neutral' },
      { val: '4', label: '🙂', sub: 'Agree' },
      { val: '5', label: '😄', sub: 'Strongly\nAgree' },
    ],
  },
];

const BHUTAN_AVG = {
  urban:  { work: 6.09, screen: 1.97, sleep: 7.03 },
  rural:  { work: 5.64, screen: 2.15, sleep: 7.09 },
};

let quizStep = 0;
let quizAnswers = {};

function navigateToQuiz() {
  quizReset();
  navigateTo('quiz', null);
  // No nav item highlights for quiz — it's a sub-page of products
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function quizGoBack() {
  // Return to products
  navigateTo('products', document.querySelector('[data-page="products"]'));
}

function quizRenderStep() {
  const q = QUIZ_QUESTIONS[quizStep];
  const total = QUIZ_QUESTIONS.length;
  const pct = (quizStep / total) * 100;

  // Progress
  document.getElementById('quiz-progress-fill').style.width = pct + '%';
  document.getElementById('quiz-section-label').textContent = q.section;
  document.getElementById('quiz-count-label').textContent = `${quizStep + 1} of ${total}`;

  // Header
  document.getElementById('quiz-eyebrow').textContent = q.section;
  document.getElementById('quiz-question').innerHTML = q.q;

  // Back button visibility
  const backBtn = document.getElementById('quiz-nav-back');
  backBtn.style.visibility = quizStep > 0 ? 'visible' : 'hidden';

  // Next button
  const nextBtn = document.getElementById('quiz-nav-next');
  const isLast = quizStep === total - 1;
  nextBtn.textContent = isLast ? 'See my results →' : 'Next →';
  nextBtn.disabled = !quizAnswers[q.key];

  // Render options
  const container = document.getElementById('quiz-options-container');
  const selectedVal = quizAnswers[q.key] || null;

  if (q.type === 'likert') {
    container.innerHTML = `<div class="quiz-options--likert">` +
      q.opts.map(o => `
        <button class="quiz-opt quiz-opt--likert${selectedVal === o.val ? ' selected' : ''}"
          data-key="${q.key}" data-val="${o.val}" onclick="quizSelectOpt(this)">
          <div class="quiz-opt-check">${selectedVal === o.val ? '✓' : ''}</div>
          ${o.label}
          <small>${o.sub}</small>
        </button>`).join('') +
      `</div>`;
  } else if (q.type === 'grid') {
    container.innerHTML = `<div class="quiz-options--grid">` +
      q.opts.map(o => `
        <button class="quiz-opt${selectedVal === o.val ? ' selected' : ''}"
          data-key="${q.key}" data-val="${o.val}" onclick="quizSelectOpt(this)">
          <div class="quiz-opt-check">${selectedVal === o.val ? '✓' : ''}</div>
          ${o.label}
        </button>`).join('') +
      `</div>`;
  } else {
    container.innerHTML = `<div class="quiz-options">` +
      q.opts.map(o => `
        <button class="quiz-opt${selectedVal === o.val ? ' selected' : ''}"
          data-key="${q.key}" data-val="${o.val}" onclick="quizSelectOpt(this)">
          <div class="quiz-opt-check">${selectedVal === o.val ? '✓' : ''}</div>
          <div><div>${o.label}</div>${o.sub ? `<small>${o.sub}</small>` : ''}</div>
        </button>`).join('') +
      `</div>`;
  }

  // Re-animate card
  const card = document.getElementById('quiz-card');
  card.style.animation = 'none';
  card.offsetHeight;
  card.style.animation = '';
}

function quizSelectOpt(btn) {
  const key = btn.dataset.key;
  const val = btn.dataset.val;
  quizAnswers[key] = val;

  // Update selection UI
  btn.closest('[class*="quiz-options"]').querySelectorAll('.quiz-opt').forEach(b => {
    b.classList.remove('selected');
    const chk = b.querySelector('.quiz-opt-check');
    if (chk) chk.textContent = '';
  });
  btn.classList.add('selected');
  const chk = btn.querySelector('.quiz-opt-check');
  if (chk) chk.textContent = '✓';

  // Enable next
  document.getElementById('quiz-nav-next').disabled = false;

  // Auto-advance for non-likert
  const q = QUIZ_QUESTIONS[quizStep];
  if (q.type !== 'likert') {
    setTimeout(() => {
      if (quizStep < QUIZ_QUESTIONS.length - 1) {
        quizStep++;
        quizRenderStep();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        quizShowResults();
      }
    }, 300);
  }
}

function quizNext() {
  if (quizStep < QUIZ_QUESTIONS.length - 1) {
    quizStep++;
    quizRenderStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    quizShowResults();
  }
}

function quizBack() {
  if (quizStep > 0) {
    quizStep--;
    quizRenderStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function quizShowResults() {
  // Hide card, show results
  document.getElementById('quiz-card').style.display = 'none';
  document.getElementById('quiz-top-bar').style.display = 'none';
  const results = document.getElementById('quiz-results');
  results.style.display = 'block';

  const a = quizAnswers;
  const isUrban = a.residence !== 'rural';
  const avg = isUrban ? BHUTAN_AVG.urban : BHUTAN_AVG.rural;

  const myWork   = { '0-4':2,'5-6':5.5,'7-8':7.5,'8+':9 }[a.workHours] || 6;
  const myScreen = { 'none':0,'<30':0.25,'30-60':0.75,'1-2h':1.5,'2h+':2.5 }[a.screenTime] || 1;
  const mySleep  = { '0-4':3,'5-6':5.5,'7-8':7.5,'8+':8.5 }[a.sleepHours] || 7;
  const sleepScore = ((+a.fallAsleep||3)+(+a.wakeRested||3)+(+a.dayEnergy||3))/3;

  // Hero
  const name = visitorName || 'Your';
  document.getElementById('quiz-results-name').textContent = `${name}'s Lifestyle Report`;
  document.getElementById('quiz-results-sub').textContent =
    `Here's how your habits compare with ${isUrban ? 'urban' : 'rural'} respondents from across Bhutan.`;

  // Score badge
  const scoreLabel = sleepScore >= 4 ? '😄 Good Sleep Health' : sleepScore >= 3 ? '😐 Moderate Sleep Health' : '😔 Needs Attention';
  const scoreColor = sleepScore >= 4 ? '#6BA368' : sleepScore >= 3 ? '#B08D57' : '#C0392B';
  document.getElementById('quiz-score-row').innerHTML = `
    <div class="quiz-score-badge" style="background:${scoreColor}20;color:${scoreColor};border:1.5px solid ${scoreColor}40;">
      ${scoreLabel} · ${sleepScore.toFixed(1)}/5
    </div>
    <div class="quiz-score-badge" style="background:rgba(107,163,104,0.10);color:#3A7040;border:1.5px solid rgba(107,163,104,0.25);">
      📍 ${isUrban ? 'Urban' : 'Rural'} comparison
    </div>
  `;

  // Compare cards
  const comparisons = [
    {
      icon: '⏰', label: 'Daily Work Hours',
      you: myWork, avg: avg.work, unit: 'hrs',
      youLabel: a.workHours === '8+' ? '8+ hrs' : a.workHours + ' hrs',
      avgLabel: avg.work.toFixed(1) + ' hrs',
      status: myWork > avg.work + 1 ? 'high' : myWork < avg.work - 1 ? 'low' : 'avg',
    },
    {
      icon: '📱', label: 'Screen Before Sleep',
      you: myScreen, avg: avg.screen, unit: 'hrs',
      youLabel: { 'none':'No phone','<30':'<30 min','30-60':'30-60 min','1-2h':'1-2 hrs','2h+':'2+ hrs' }[a.screenTime],
      avgLabel: avg.screen.toFixed(2) + ' hrs',
      status: myScreen > avg.screen + 0.25 ? 'high' : myScreen < avg.screen - 0.25 ? 'low' : 'avg',
    },
    {
      icon: '🌙', label: 'Sleep Duration',
      you: mySleep, avg: avg.sleep, unit: 'hrs',
      youLabel: a.sleepHours === '8+' ? '8+ hrs' : a.sleepHours + ' hrs',
      avgLabel: avg.sleep.toFixed(1) + ' hrs',
      status: mySleep < avg.sleep - 0.5 ? 'low' : mySleep > avg.sleep + 0.5 ? 'high' : 'avg',
    },
  ];

  const statusLabels = { high:'▲ Above average', low:'▼ Below average', avg:'● On average' };
  const statusClasses = { high:'res-status--high', low:'res-status--low', avg:'res-status--avg' };

  document.getElementById('quiz-compare-grid').innerHTML = comparisons.map(c => {
    const maxVal = Math.max(c.you, c.avg) * 1.35 || 10;
    const youPct = Math.min((c.you / maxVal)*100, 100).toFixed(1);
    const avgPct = Math.min((c.avg / maxVal)*100, 100).toFixed(1);
    return `
      <div class="quiz-compare-card">
        <div class="quiz-compare-card-top">
          <span class="quiz-compare-icon">${c.icon}</span>
          <div>
            <div class="quiz-compare-label">${c.label}</div>
            <span class="quiz-compare-status ${statusClasses[c.status]}">${statusLabels[c.status]}</span>
          </div>
        </div>
        <div class="quiz-compare-bars">
          <div class="quiz-compare-bar-row">
            <span class="quiz-compare-bar-tag quiz-compare-bar-tag--you">You</span>
            <div class="quiz-compare-bar-track"><div class="quiz-compare-bar-fill quiz-compare-bar-fill--you" data-target="${youPct}"></div></div>
            <span class="quiz-compare-bar-val">${c.youLabel}</span>
          </div>
          <div class="quiz-compare-bar-row">
            <span class="quiz-compare-bar-tag quiz-compare-bar-tag--avg">Avg</span>
            <div class="quiz-compare-bar-track"><div class="quiz-compare-bar-fill quiz-compare-bar-fill--avg" data-target="${avgPct}"></div></div>
            <span class="quiz-compare-bar-val">${c.avgLabel}</span>
          </div>
        </div>
      </div>`;
  }).join('');

  // Animate bars
  setTimeout(() => {
    document.querySelectorAll('.quiz-compare-bar-fill').forEach(b => {
      const t = b.dataset.target;
      if (t) { b.style.width='0'; requestAnimationFrame(() => requestAnimationFrame(() => { b.style.width = t + '%'; })); }
    });
  }, 300);

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Fetch AI recommendation
  fetchAIRecommendation(a, { myWork, myScreen, mySleep, sleepScore, isUrban, avg });
}

async function fetchAIRecommendation(a, metrics) {
  const loading = document.getElementById('quiz-ai-loading');
  const content = document.getElementById('quiz-ai-content');
  loading.style.display = 'flex';
  content.style.display = 'none';

  const screenLabel = { 'none':'no phone before bed','<30':'under 30 minutes of screen time before sleep','30-60':'30-60 minutes of screen time before sleep','1-2h':'1-2 hours of screen time before sleep','2h+':'more than 2 hours of screen time before sleep' }[a.screenTime] || a.screenTime;
  const workLabel = { '0-4':'0-4 hours','5-6':'5-6 hours','7-8':'7-8 hours','8+':'more than 8 hours' }[a.workHours] || a.workHours;
  const sleepLabel = { '0-4':'0-4 hours','5-6':'5-6 hours','7-8':'7-8 hours','8+':'more than 8 hours' }[a.sleepHours] || a.sleepHours;

  const prompt = `You are a compassionate wellness advisor for SomPel Tech, a Bhutanese startup focused on sleep and lifestyle wellbeing.

User profile:
- Name: ${visitorName || 'the user'}
- Location: ${a.residence || 'Bhutan'}
- Age group: ${a.age || 'unknown'}
- Work type: ${a.workType || 'unknown'}
- Work hours: ${workLabel} per day (Bhutan ${metrics.isUrban ? 'urban' : 'rural'} average: ${metrics.avg.work.toFixed(1)} hrs)
- Screen time before sleep: ${screenLabel} (Bhutan average: ${metrics.avg.screen.toFixed(2)} hrs)
- Sleep duration: ${sleepLabel} per night (Bhutan average: ${metrics.avg.sleep.toFixed(1)} hrs)
- Falls asleep easily: ${['','Strongly disagree','Disagree','Neutral','Agree','Strongly agree'][+a.fallAsleep] || 'neutral'}
- Wakes up rested: ${['','Strongly disagree','Disagree','Neutral','Agree','Strongly agree'][+a.wakeRested] || 'neutral'}
- Daytime energy: ${['','Strongly disagree','Disagree','Neutral','Agree','Strongly agree'][+a.dayEnergy] || 'neutral'}
- Overall sleep quality score: ${metrics.sleepScore.toFixed(1)}/5

Write a personalised, warm, and motivating wellness recommendation for this person. Structure your response with:
1. A brief personal greeting using their name (1-2 sentences acknowledging their specific situation)
2. **What's working well** — highlight 1-2 positive habits or strengths from their data
3. **Your top 3 personalised recommendations** — specific, actionable, culturally sensitive to Bhutan. Each should be concrete (not generic). Reference their actual data points (e.g. their specific screen time, work hours).
4. **A motivational closing** — a short, warm sentence encouraging them.

Keep the tone warm, personal, non-judgmental, and encouraging. Use simple language. Format in clean HTML using <h4> for section titles, <ul><li> for lists. Keep total length to about 250-300 words. Do NOT use markdown. Start directly with the greeting, no preamble.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    const text = (data.content || []).map(b => b.text || '').join('');

    loading.style.display = 'none';
    content.style.display = 'block';
    content.innerHTML = text;
  } catch (err) {
    loading.style.display = 'none';
    content.style.display = 'block';
    // Fallback static recommendations
    const recos = [];
    if (metrics.myScreen > 1.5) recos.push('<li><strong>Reduce pre-sleep screen time:</strong> You\'re using your phone significantly more than average before bed. Try putting it away 45 minutes before sleep — even small reductions make a real difference.</li>');
    if (metrics.mySleep < 6.5) recos.push('<li><strong>Prioritise more sleep:</strong> You\'re sleeping less than the Bhutan average. Even going to bed 30 minutes earlier can improve your energy and focus the next day.</li>');
    if (metrics.myWork > 8)    recos.push('<li><strong>Build recovery time:</strong> Long work hours can accumulate stress. Try a 10-minute wind-down ritual after work before picking up your phone.</li>');
    if (metrics.sleepScore < 3) recos.push('<li><strong>Create a bedtime routine:</strong> A consistent routine — same sleep time, low light, no screens — can help signal your body it\'s time to rest.</li>');
    if (recos.length === 0)     recos.push('<li><strong>Keep it up!</strong> Your habits are well-aligned with healthy sleep. Maintain your consistent routine and low screen use before bed.</li>');

    content.innerHTML = `
      <h4>Your Personalised Recommendations</h4>
      <ul>${recos.join('')}</ul>
      <p>Small, consistent changes to your daily habits can make a big difference to your sleep quality and overall wellbeing. — SomPel Tech</p>`;
  }
}

function quizReset() {
  quizStep = 0;
  quizAnswers = {};
  document.getElementById('quiz-card').style.display = 'block';
  document.getElementById('quiz-top-bar').style.display = 'flex';
  document.getElementById('quiz-results').style.display = 'none';
  document.getElementById('quiz-ai-loading').style.display = 'flex';
  document.getElementById('quiz-ai-content').style.display = 'none';
  document.getElementById('quiz-ai-content').innerHTML = '';
  if (document.getElementById('page-quiz').classList.contains('active')) {
    quizRenderStep();
  }
}


// ── Benchmarking Tool ──────────────────────────────────────────────────────

// Survey dataset averages (from the 358-respondent study)
const BHUTAN_DATA = {
  avgWorkHoursUrban:  6.09,
  avgWorkHoursRural:  5.64,
  avgScreenUrban:     1.97,
  avgScreenRural:     2.15,
  avgSleepUrban:      7.03,
  avgSleepRural:      7.09,
  // % who said screen time harms sleep: ~70% based on findings
  screenHarmPct:      70,
  // willingness to use app: 55%+ yes
  appWillingPct:      55,
};

let bmarkAnswers  = {};
let bmarkStep     = 1;
const BMARK_TOTAL = 9;

function showBenchmarkTool() {
  const tool = document.getElementById('benchmark-tool');
  if (!tool) return;
  tool.style.display = 'block';
  tool.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function bmarkUpdateProgress() {
  const pct = ((bmarkStep - 1) / BMARK_TOTAL) * 100;
  const fill = document.getElementById('bmark-progress-fill');
  const label = document.getElementById('bmark-progress-label');
  if (fill)  fill.style.width = pct + '%';
  if (label) label.textContent = `Question ${bmarkStep} of ${BMARK_TOTAL}`;
}

function bmarkShowStep(n) {
  document.querySelectorAll('.bmark-step').forEach(s => s.classList.remove('active'));
  const target = document.querySelector(`.bmark-step[data-step="${n}"]`);
  if (target) target.classList.add('active');

  const backBtn = document.getElementById('bmark-back');
  const nextBtn = document.getElementById('bmark-next');
  if (backBtn) backBtn.style.display = n > 1 ? 'inline-flex' : 'none';

  // Check if current step has an answer
  const key = target ? target.querySelector('.bmark-options')?.dataset.key : null;
  if (nextBtn) {
    nextBtn.disabled = !(key && bmarkAnswers[key]);
    nextBtn.textContent = n === BMARK_TOTAL ? 'See my results →' : 'Next →';
  }

  bmarkUpdateProgress();
}

function bmarkNext() {
  if (bmarkStep < BMARK_TOTAL) {
    bmarkStep++;
    bmarkShowStep(bmarkStep);
  } else {
    bmarkShowResults();
  }
}

function bmarkBack() {
  if (bmarkStep > 1) {
    bmarkStep--;
    bmarkShowStep(bmarkStep);
  }
}

// Option click handler — delegated
document.addEventListener('click', function(e) {
  const opt = e.target.closest('.bmark-opt');
  if (!opt) return;
  const container = opt.closest('.bmark-options');
  if (!container) return;
  container.querySelectorAll('.bmark-opt').forEach(b => b.classList.remove('selected'));
  opt.classList.add('selected');
  const key = container.dataset.key;
  bmarkAnswers[key] = opt.dataset.value;

  const nextBtn = document.getElementById('bmark-next');
  if (nextBtn) nextBtn.disabled = false;

  // Auto-advance after brief delay for single-select (non-likert)
  if (!container.classList.contains('bmark-options--likert')) {
    setTimeout(() => {
      if (bmarkStep < BMARK_TOTAL) { bmarkStep++; bmarkShowStep(bmarkStep); }
      else { bmarkShowResults(); }
    }, 320);
  }
});

// ── Map answers to numeric values ─────────────────────────────────────────
function workHoursToNum(v) {
  return { '0-4': 2, '5-6': 5.5, '7-8': 7.5, '8+': 9 }[v] || 6;
}
function screenToNum(v) {
  return { 'none': 0, '<30': 0.25, '30-60': 0.75, '1-2h': 1.5, '2h+': 2.5 }[v] || 1;
}
function sleepToNum(v) {
  return { '0-4': 3, '5-6': 5.5, '7-8': 7.5, '8+': 8.5 }[v] || 7;
}

// ── Generate results ───────────────────────────────────────────────────────
function bmarkShowResults() {
  document.getElementById('bmark-survey').style.display = 'none';
  document.getElementById('bmark-nav').style.display = 'none';
  document.querySelector('.bmark-progress-wrap').style.display = 'none';
  document.getElementById('bmark-results').style.display = 'block';

  const a = bmarkAnswers;
  const isUrban = a.residence === 'urban' || a.residence === 'semi-urban';
  const avgWork  = isUrban ? BHUTAN_DATA.avgWorkHoursUrban : BHUTAN_DATA.avgWorkHoursRural;
  const avgScreen = isUrban ? BHUTAN_DATA.avgScreenUrban  : BHUTAN_DATA.avgScreenRural;
  const avgSleep  = isUrban ? BHUTAN_DATA.avgSleepUrban   : BHUTAN_DATA.avgSleepRural;

  const myWork   = workHoursToNum(a.workHours);
  const myScreen = screenToNum(a.screenTime);
  const mySleep  = sleepToNum(a.sleepHours);

  // Sleep quality score (1-5 avg of 3 likert answers)
  const sleepScore = ((+a.fallAsleep || 3) + (+a.wakeRested || 3) + (+a.dayEnergy || 3)) / 3;

  // Build comparison cards
  const comparisons = [
    {
      icon: '⏰',
      label: 'Daily Work Hours',
      you: myWork,
      avg: avgWork,
      unit: 'hrs',
      youLabel: formatHours(a.workHours),
      avgLabel: avgWork.toFixed(1) + ' hrs',
      status: myWork > avgWork + 1 ? 'high' : myWork < avgWork - 1 ? 'low' : 'avg',
      highMsg: 'You work more than the average. Long hours can impact sleep quality.',
      lowMsg:  'You work fewer hours than average — great for work-life balance!',
      avgMsg:  'Your work hours are in line with the average for your area.',
    },
    {
      icon: '📱',
      label: 'Screen Time Before Sleep',
      you: myScreen,
      avg: avgScreen,
      unit: 'hrs',
      youLabel: formatScreen(a.screenTime),
      avgLabel: avgScreen.toFixed(2) + ' hrs',
      status: myScreen > avgScreen + 0.25 ? 'high' : myScreen < avgScreen - 0.25 ? 'low' : 'avg',
      highMsg: 'Your pre-sleep screen time is above average — this is strongly linked to poorer sleep quality.',
      lowMsg:  'Great job! Your pre-sleep screen use is below average — this supports better sleep.',
      avgMsg:  'Your screen use before bed is similar to the average. Even this level can affect sleep.',
    },
    {
      icon: '🌙',
      label: 'Sleep Duration',
      you: mySleep,
      avg: avgSleep,
      unit: 'hrs',
      youLabel: formatSleep(a.sleepHours),
      avgLabel: avgSleep.toFixed(1) + ' hrs',
      status: mySleep < avgSleep - 0.5 ? 'low' : mySleep > avgSleep + 0.5 ? 'high' : 'avg',
      highMsg: 'You sleep more than average. Quality matters as much as quantity!',
      lowMsg:  'You sleep less than the Bhutan average. Try to aim for 7–8 hours.',
      avgMsg:  'Your sleep duration matches the Bhutanese average of ~7 hours.',
    },
  ];

  const grid = document.getElementById('bmark-results-grid');
  grid.innerHTML = comparisons.map(c => {
    const maxVal = Math.max(c.you, c.avg) * 1.3 || 10;
    const youPct = Math.min((c.you / maxVal) * 100, 100);
    const avgPct = Math.min((c.avg / maxVal) * 100, 100);
    const statusClass = c.status === 'high' ? 'res-status--high' : c.status === 'low' ? 'res-status--low' : 'res-status--avg';
    const statusText = c.status === 'high' ? '▲ Above average' : c.status === 'low' ? '▼ Below average' : '● On average';
    const msg = c.status === 'high' ? c.highMsg : c.status === 'low' ? c.lowMsg : c.avgMsg;
    return `
      <div class="res-card">
        <div class="res-card-header">
          <span class="res-card-icon">${c.icon}</span>
          <div>
            <div class="res-card-label">${c.label}</div>
            <div class="res-card-status ${statusClass}">${statusText}</div>
          </div>
        </div>
        <div class="res-bars">
          <div class="res-bar-row">
            <span class="res-bar-tag res-bar-tag--you">You</span>
            <div class="res-bar-track"><div class="res-bar-fill res-bar-fill--you" data-target="${youPct.toFixed(1)}"></div></div>
            <span class="res-bar-val">${c.youLabel}</span>
          </div>
          <div class="res-bar-row">
            <span class="res-bar-tag res-bar-tag--avg">Avg</span>
            <div class="res-bar-track"><div class="res-bar-fill res-bar-fill--avg" data-target="${avgPct.toFixed(1)}"></div></div>
            <span class="res-bar-val">${c.avgLabel}</span>
          </div>
        </div>
        <p class="res-card-msg">${msg}</p>
      </div>
    `;
  }).join('');

  // Sleep quality block
  const sleepLabel = sleepScore >= 4 ? '😄 Good' : sleepScore >= 3 ? '😐 Moderate' : '😔 Poor';
  const sleepColor = sleepScore >= 4 ? '#6BA368' : sleepScore >= 3 ? '#F4D06F' : '#C0392B';

  // Recommendations
  const recos = [];
  if (myScreen > 1.5) recos.push({ icon: '📵', title: 'Reduce screen time before bed', body: 'Your phone use before sleep is above average and is likely harming your sleep quality. Try stopping screens 30–60 minutes before bed.' });
  if (mySleep < 7)    recos.push({ icon: '🛏️', title: 'Sleep a little longer', body: 'You\'re sleeping less than the recommended 7–8 hours. Even 30 extra minutes can improve your energy and mood the next day.' });
  if (myWork > 8)     recos.push({ icon: '⏸️', title: 'Take breaks during your day', body: 'Working more than 8 hours daily can increase stress and reduce sleep quality. Try scheduling short breaks.' });
  if (sleepScore < 3) recos.push({ icon: '🧘', title: 'Build a wind-down routine', body: 'Your sleep quality scores suggest you\'re struggling to fall and stay asleep. A consistent bedtime routine — same time each night, relaxing activities — can help significantly.' });
  if (recos.length === 0) recos.push({ icon: '🌟', title: 'You\'re doing great!', body: 'Your lifestyle habits are well-aligned with healthy sleep. Keep maintaining consistent sleep times and limiting pre-bed screen use.' });

  const recoBox = document.getElementById('bmark-reco-box');
  recoBox.innerHTML = `
    <div class="reco-header">
      <h3 class="reco-title">Your Sleep Quality Score</h3>
      <div class="reco-score-pill" style="background:${sleepColor}20; color:${sleepColor}; border:1.5px solid ${sleepColor}40;">
        ${sleepLabel} · ${sleepScore.toFixed(1)} / 5
      </div>
    </div>
    <h3 class="reco-recs-title">Personalised Recommendations</h3>
    <div class="reco-list">
      ${recos.map(r => `
        <div class="reco-item">
          <div class="reco-item-icon">${r.icon}</div>
          <div>
            <div class="reco-item-title">${r.title}</div>
            <div class="reco-item-body">${r.body}</div>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="reco-data-note">
      Benchmarks are based on data from <strong>358 participants</strong> surveyed across urban, semi-urban, and rural Bhutan (SomPel Tech, 2026). 
      ${isUrban ? 'Urban averages applied.' : 'Rural averages applied.'}
    </div>
  `;

  // Animate result bars
  document.getElementById('bmark-results').scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => {
    document.querySelectorAll('.res-bar-fill').forEach(b => {
      const t = b.getAttribute('data-target');
      if (t) { b.style.width = '0'; requestAnimationFrame(() => requestAnimationFrame(() => { b.style.width = t + '%'; })); }
    });
  }, 400);

  // Update sub-header with name
  const sub = document.getElementById('bmark-results-sub');
  if (sub && visitorName) sub.textContent = `Here's how your habits compare, ${visitorName}.`;
}

function formatHours(v) {
  return { '0-4': '0–4 hrs', '5-6': '5–6 hrs', '7-8': '7–8 hrs', '8+': '8+ hrs' }[v] || v;
}
function formatScreen(v) {
  return { 'none': 'No phone', '<30': '<30 mins', '30-60': '30–60 mins', '1-2h': '1–2 hrs', '2h+': '2+ hrs' }[v] || v;
}
function formatSleep(v) {
  return { '0-4': '0–4 hrs', '5-6': '5–6 hrs', '7-8': '7–8 hrs', '8+': '8+ hrs' }[v] || v;
}

function bmarkReset() {
  bmarkAnswers = {};
  bmarkStep = 1;
  // Reset UI
  document.querySelectorAll('.bmark-opt').forEach(b => b.classList.remove('selected'));
  document.getElementById('bmark-results').style.display = 'none';
  document.getElementById('bmark-survey').style.display = 'block';
  document.getElementById('bmark-nav').style.display = 'flex';
  document.querySelector('.bmark-progress-wrap').style.display = 'flex';
  bmarkShowStep(1);
  document.getElementById('benchmark-tool').scrollIntoView({ behavior: 'smooth', block: 'start' });
}