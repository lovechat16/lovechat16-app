/**
 * ラブチャット16 Company Dashboard
 * Reference: lovechat-company/reference/dashboard-reference.png
 */

const POLL_MS = 1000;

const STATUS_LABELS = {
  working:   'Working',
  reviewing: 'Reviewing',
  testing:   'Testing',
  idle:      'Idle',
  done:      'Done',
};

const STATUS_ORDER = { working: 0, reviewing: 1, testing: 2, done: 3, idle: 4 };

/* Agent accent colors */
const AGENT_COLORS = {
  'secretary':          '#f0346a',
  'ceo':                '#fbbf24',
  'diagnosis-planner':  '#00d4aa',
  'result-copywriter':  '#f472b6',
  'sns-growth':         '#34d399',
  'viral-creative':     '#a78bfa',
  'product-maker':      '#60a5fa',
  'lp-line-designer':   '#fb7185',
  'dev-engineer':       '#38bdf8',
  'design-director':    '#c084fc',
  'ui-designer':        '#f9a8d4',
  'visual-critic':      '#fcd34d',
  'strategy-validator': '#818cf8',
};

const DEPT_FILES = {
  'dept-01': 'reports/departments/01-diagnosis-planner.md',
  'dept-02': 'reports/departments/02-result-copywriter.md',
  'dept-03': 'reports/departments/03-sns-growth.md',
  'dept-04': 'reports/departments/04-viral-creative.md',
  'dept-05': 'reports/departments/05-product-maker.md',
  'dept-06': 'reports/departments/06-lp-line-designer.md',
  'dept-07': 'reports/departments/07-dev-engineer.md',
  'dept-08': 'reports/departments/08-design-director.md',
  'dept-09': 'reports/departments/09-ui-designer.md',
  'dept-10': 'reports/departments/10-visual-critic.md',
};

const DEPT_LABELS = {
  'daily':   '📋 日次レポート',
  'dept-01': '🔍 01 診断設計',
  'dept-02': '✍️ 02 結果文章',
  'dept-03': '📱 03 SNS拡散',
  'dept-04': '🎨 04 バイラル',
  'dept-05': '📦 05 プロダクト',
  'dept-06': '🎯 06 LP・LINE',
  'dept-07': '⚙️ 07 開発・技術',
  'dept-08': '🎭 08 デザイン統括',
  'dept-09': '✏️ 09 UIデザイン',
  'dept-10': '🔎 10 レビュー',
};

/* ── Fetch ──────────────────────────────────────────────────── */

async function fetchJSON(path) {
  const res = await fetch('./' + path + '?_=' + Date.now());
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}

async function fetchText(path) {
  const res = await fetch('./' + path + '?_=' + Date.now());
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.text();
}

/* ── XSS-safe escape ─────────────────────────────────────────── */

function esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ── Clock ───────────────────────────────────────────────────── */

function startClock() {
  const timeEl = document.getElementById('tb-time');
  const dateEl = document.getElementById('tb-date');
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function tick() {
    const d = new Date();
    timeEl.textContent =
      d.getHours().toString().padStart(2,'0') + ':' +
      d.getMinutes().toString().padStart(2,'0') + ':' +
      d.getSeconds().toString().padStart(2,'0');
    dateEl.textContent =
      MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }
  tick();
  setInterval(tick, 1000);
}

/* ── Top Bar ─────────────────────────────────────────────────── */

function updateTopBar(data) {
  const agents = data.agents;
  const active = agents.filter(a => ['working','reviewing','testing'].includes(a.status)).length;
  const done   = agents.filter(a => a.status === 'done').length;

  document.getElementById('active-count').textContent = active;
  document.getElementById('task-count').textContent   = agents.length;

  /* Company status */
  const hasBlocker = data.secretary && (data.secretary.blockers || []).length > 0;
  const csEl = document.getElementById('cs-text');
  if (hasBlocker) { csEl.textContent = 'Issues Detected'; csEl.style.color = '#fbbf24'; }
  else            { csEl.textContent = 'All Systems Go';  csEl.style.color = ''; }

  /* Team energy */
  const pct = Math.round((active / Math.max(agents.length, 1)) * 100);
  const teEl = document.getElementById('te-text');
  teEl.textContent = pct >= 60 ? 'High' : pct >= 30 ? 'Normal' : 'Low';

  /* Floor updated */
  const updated = data.updatedAt ? new Date(data.updatedAt) : null;
  if (updated) {
    const hh = updated.getHours().toString().padStart(2,'0');
    const mm = updated.getMinutes().toString().padStart(2,'0');
    document.getElementById('fl-updated').textContent = '最終更新: ' + hh + ':' + mm;
  }
}

/* ── Office Grid ─────────────────────────────────────────────── */

const AGENT_ORDER = [
  'secretary','ceo','diagnosis-planner','result-copywriter',
  'sns-growth','viral-creative','product-maker','lp-line-designer',
  'dev-engineer','design-director','ui-designer','visual-critic','strategy-validator',
];

/* ── Pixel Character Sprites ─────────────────────────────────── */

const AGENT_HAIR = {
  'secretary':          '#d03070',
  'ceo':                '#9a7010',
  'diagnosis-planner':  '#008878',
  'result-copywriter':  '#a030a0',
  'sns-growth':         '#107858',
  'viral-creative':     '#6820c8',
  'product-maker':      '#1060b0',
  'lp-line-designer':   '#b82048',
  'dev-engineer':       '#0868a0',
  'design-director':    '#8830b0',
  'ui-designer':        '#c04880',
  'visual-critic':      '#a09020',
  'strategy-validator': '#3038a8',
};

const AGENT_SKIN = {
  'secretary':          '#eac090',
  'ceo':                '#c88848',
  'diagnosis-planner':  '#f2caa8',
  'result-copywriter':  '#e8a878',
  'sns-growth':         '#d09868',
  'viral-creative':     '#eac090',
  'product-maker':      '#c88848',
  'lp-line-designer':   '#f2caa8',
  'dev-engineer':       '#e0a878',
  'design-director':    '#d8a078',
  'ui-designer':        '#f2caa8',
  'visual-critic':      '#c88848',
  'strategy-validator': '#eac090',
};

/* 1=long hair  2=short  3=medium parted  4=voluminous  5=creative */
const AGENT_STYLE = {
  'secretary': 1, 'ceo': 2, 'diagnosis-planner': 3,
  'result-copywriter': 1, 'sns-growth': 4, 'viral-creative': 5,
  'product-maker': 2, 'lp-line-designer': 1, 'dev-engineer': 3,
  'design-director': 4, 'ui-designer': 1, 'visual-critic': 2,
  'strategy-validator': 3,
};

function buildPixelChar(agentId) {
  const H  = AGENT_HAIR[agentId]  || '#3a2010';
  const B  = AGENT_COLORS[agentId]|| '#7c3aed';
  const SK = AGENT_SKIN[agentId]  || '#e8b88a';
  const _  = null;
  const E  = '#100808';
  const M  = '#a05030';
  const D  = '#141228';
  const C  = '#e0e8ff';
  const W  = '#f4f8ff';  // white collar

  /* derived shades */
  function adj(hex, amt) {
    const c = parseInt(hex.replace('#',''), 16);
    return '#' + [c>>16,(c>>8)&0xff,c&0xff]
      .map(v => Math.min(255,Math.max(0,v+amt)).toString(16).padStart(2,'0')).join('');
  }
  const HL = adj(H, 55);   // hair highlight (lighter)
  const SH = adj(SK,-25);  // skin shadow (jaw/chin)
  const BL = adj(B, 50);   // shirt highlight

  /* 14 cols × 16 rows — each pixel = 4 px → 56 × 64 px */
  const GRIDS = {
    1: [ /* ─── long hair, falls past shoulders ─── */
      [_,_,_,H,HL,HL,HL,HL,HL,H,H,_,_,_],   // 0  hair top (highlight center)
      [_,_,H,H,H,H,H,H,H,H,H,H,_,_],         // 1  hair wide
      [_,H,H,H,SK,SK,SK,SK,SK,SK,H,H,H,_],   // 2  hair sides + face
      [H,H,H,SK,SK,SK,SK,SK,SK,SK,SK,H,H,H], // 3  wide face row
      [H,H,_,SK,H,H,SK,SK,H,H,SK,_,H,H],     // 4  eyebrows (H=hair color)
      [H,H,_,SK,E,E,SK,SK,E,E,SK,_,H,H],     // 5  eyes
      [H,H,_,SK,SK,SK,SK,SK,SK,SK,SK,_,H,H], // 6  mid-face
      [H,H,_,SK,SK,SK,M,M,SK,SK,SK,_,H,H],   // 7  mouth
      [_,H,_,SH,SK,SK,SK,SK,SK,SH,_,_,H,_],  // 8  chin/jaw shadow
      [H,_,_,W,B,BL,B,B,BL,B,W,_,_,H],       // 9  collar + hair draping
      [H,_,B,B,B,B,B,B,B,B,B,B,_,H],         // 10 body (hair on far edges)
      [_,SK,SK,B,B,B,B,B,B,B,B,SK,SK,_],     // 11 upper arms + body
      [SK,SK,_,_,_,_,_,_,_,_,_,_,SK,SK],     // 12 arms forward
      [_,SK,_,_,_,_,_,_,_,_,_,_,SK,_],       // 13 hands
      [_,_,D,D,D,D,D,D,D,D,D,_,_,_],         // 14 pants
      [_,_,D,D,D,D,D,D,D,D,D,_,_,_],         // 15 pants
    ],
    2: [ /* ─── short professional ─── */
      [_,_,_,H,HL,HL,H,H,HL,HL,H,_,_,_],    // 0  hair top
      [_,_,_,H,H,H,H,H,H,H,H,H,_,_],         // 1  hair
      [_,_,_,SK,SK,SK,SK,SK,SK,SK,SK,_,_,_], // 2  face (no side hair)
      [_,_,SK,SK,SK,SK,SK,SK,SK,SK,SK,SK,_,_],// 3  face wider
      [_,_,_,SK,H,H,SK,SK,H,H,SK,_,_,_],     // 4  eyebrows
      [_,_,_,SK,E,E,SK,SK,E,E,SK,_,_,_],     // 5  eyes
      [_,_,_,SK,SK,SK,SK,SK,SK,SK,SK,_,_,_], // 6  mid-face
      [_,_,_,SK,SK,SK,M,M,SK,SK,SK,_,_,_],   // 7  mouth
      [_,_,_,SH,SK,SK,SK,SK,SK,SH,_,_,_,_],  // 8  chin
      [_,_,W,B,B,BL,B,B,BL,B,B,W,_,_],      // 9  collar
      [_,B,B,B,B,B,B,B,B,B,B,B,B,_],         // 10 body
      [_,SK,SK,B,B,B,B,B,B,B,B,SK,SK,_],     // 11 arms
      [SK,SK,_,_,_,_,_,_,_,_,_,_,SK,SK],     // 12 arms forward
      [_,SK,_,_,_,_,_,_,_,_,_,_,SK,_],       // 13 hands
      [_,_,D,D,D,D,D,D,D,D,D,_,_,_],         // 14 pants
      [_,_,D,D,D,D,D,D,D,D,D,_,_,_],         // 15 pants
    ],
    3: [ /* ─── medium, asymmetric side part ─── */
      [_,_,_,_,H,HL,HL,HL,HL,H,H,_,_,_],    // 0  off-center hair top
      [_,_,_,H,H,H,H,H,H,H,H,H,H,_],         // 1  hair
      [_,_,H,H,H,SK,SK,SK,SK,SK,H,H,H,_],   // 2  hair sides + face
      [_,H,H,H,SK,SK,SK,SK,SK,SK,SK,H,H,_], // 3  face
      [_,H,H,SK,H,H,SK,SK,H,H,SK,H,H,_],    // 4  eyebrows
      [_,H,_,SK,E,E,SK,SK,E,E,SK,_,H,_],    // 5  eyes
      [_,_,_,SK,SK,SK,SK,SK,SK,SK,SK,_,_,_],// 6  mid-face
      [_,_,_,SK,SK,SK,M,M,SK,SK,SK,_,_,_],  // 7  mouth
      [_,_,_,SH,SK,SK,SK,SK,SK,SH,_,_,_,_], // 8  chin
      [_,_,W,B,B,BL,B,B,BL,B,B,W,_,_],      // 9  collar
      [_,B,B,B,B,B,B,B,B,B,B,B,B,_],         // 10 body
      [_,SK,SK,B,B,B,B,B,B,B,B,SK,SK,_],     // 11 arms
      [SK,SK,_,_,_,_,_,_,_,_,_,_,SK,SK],     // 12 arms forward
      [_,SK,_,_,_,_,_,_,_,_,_,_,SK,_],       // 13 hands
      [_,_,D,D,D,D,D,D,D,D,D,_,_,_],         // 14 pants
      [_,_,D,D,D,D,D,D,D,D,D,_,_,_],         // 15 pants
    ],
    4: [ /* ─── voluminous / big styled hair ─── */
      [_,H,H,HL,HL,HL,HL,HL,HL,H,H,H,_,_],  // 0  big hair top
      [_,H,H,H,HL,H,H,H,H,HL,H,H,H,_],       // 1  big hair
      [_,_,H,H,H,SK,SK,SK,SK,SK,H,H,_,_],   // 2  hair sides + face
      [_,_,H,SK,SK,SK,SK,SK,SK,SK,SK,H,_,_],// 3  face
      [_,_,_,SK,H,H,SK,SK,H,H,SK,_,_,_],    // 4  eyebrows
      [_,_,_,SK,E,E,SK,SK,E,E,SK,_,_,_],    // 5  eyes
      [_,_,_,SK,SK,SK,SK,SK,SK,SK,SK,_,_,_],// 6  mid-face
      [_,_,_,SK,SK,SK,M,M,SK,SK,SK,_,_,_],  // 7  mouth
      [_,_,_,SH,SK,SK,SK,SK,SK,SH,_,_,_,_], // 8  chin
      [_,_,W,B,B,BL,B,B,BL,B,B,W,_,_],      // 9  collar
      [_,B,B,B,B,B,B,B,B,B,B,B,B,_],         // 10 body
      [_,SK,SK,B,B,B,B,B,B,B,B,SK,SK,_],     // 11 arms
      [SK,SK,_,_,_,_,_,_,_,_,_,_,SK,SK],     // 12 arms forward
      [_,SK,_,_,_,_,_,_,_,_,_,_,SK,_],       // 13 hands
      [_,_,D,D,D,D,D,D,D,D,D,_,_,_],         // 14 pants
      [_,_,D,D,D,D,D,D,D,D,D,_,_,_],         // 15 pants
    ],
    5: [ /* ─── creative / asymmetric wild ─── */
      [_,_,H,H,H,_,_,H,H,H,H,H,_,_],        // 0  gap = spiky
      [H,H,H,H,H,H,HL,H,H,H,H,H,H,_],        // 1  full-width wild hair
      [H,H,H,H,SK,SK,SK,SK,SK,SK,H,H,H,_],  // 2  face + big hair
      [H,H,H,SK,SK,SK,SK,SK,SK,SK,SK,H,H,H],// 3  face wide
      [H,H,_,SK,H,H,SK,SK,H,H,SK,_,H,H],    // 4  eyebrows
      [H,H,_,SK,E,E,SK,SK,E,E,SK,_,H,_],    // 5  eyes
      [_,H,_,SK,SK,SK,SK,SK,SK,SK,SK,_,_,_],// 6  mid-face (hair one side)
      [_,_,_,SK,SK,SK,M,M,SK,SK,SK,_,_,_],  // 7  mouth
      [_,_,_,SH,SK,SK,SK,SK,SK,SH,_,_,_,_], // 8  chin
      [_,_,W,B,B,BL,B,B,BL,B,B,W,_,_],      // 9  collar
      [_,B,B,B,B,B,B,B,B,B,B,B,B,_],         // 10 body
      [_,SK,SK,B,B,B,B,B,B,B,B,SK,SK,_],     // 11 arms
      [SK,SK,_,_,_,_,_,_,_,_,_,_,SK,SK],     // 12 arms forward
      [_,SK,_,_,_,_,_,_,_,_,_,_,SK,_],       // 13 hands
      [_,_,D,D,D,D,D,D,D,D,D,_,_,_],         // 14 pants
      [_,_,D,D,D,D,D,D,D,D,D,_,_,_],         // 15 pants
    ],
  };

  const P    = 4;
  const COLS = 14;
  const ROWS = 16;
  const grid = GRIDS[AGENT_STYLE[agentId] || 1];

  let rects = '';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const col = grid[r][c];
      if (col) rects += `<rect x="${c*P}" y="${r*P}" width="${P}" height="${P}" fill="${col}"/>`;
    }
  }

  const W_px = COLS * P; // 56
  const H_px = ROWS * P; // 64
  return `<div class="or-char"><svg class="px-sprite" width="${W_px}" height="${H_px}" viewBox="0 0 ${W_px} ${H_px}" xmlns="http://www.w3.org/2000/svg">${rects}</svg></div>`;
}

function renderOfficeGrid(agents) {
  const grid = document.getElementById('office-grid');
  const sorted = [...agents].sort((a, b) => {
    const ai = AGENT_ORDER.indexOf(a.id);
    const bi = AGENT_ORDER.indexOf(b.id);
    return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi);
  });

  grid.innerHTML = sorted.map(agent => {
    const color   = AGENT_COLORS[agent.id] || '#7c3aed';
    const pct     = Math.max(0, Math.min(100, agent.progress));
    const label   = STATUS_LABELS[agent.status] || agent.status;
    const taskStr = agent.task.length > 30 ? agent.task.slice(0, 29) + '…' : agent.task;
    const roleStr = agent.role ? agent.role.replace(/^\d+\s*/, '') : '';

    return `
<div class="office-room" data-status="${esc(agent.status)}" style="--acolor:${color}">
  <div class="or-header">
    <span class="or-dot"></span>
    <span class="or-name">${esc(agent.name)}</span>
    <span class="or-badge">${esc(label)}</span>
  </div>
  <div class="or-scene">
    <div class="or-monitor">
      <div class="or-screen"></div>
      <div class="or-stand"></div>
      <div class="or-mbase"></div>
    </div>
    <div class="or-chair"></div>
    ${buildPixelChar(agent.id)}
    <div class="or-desk">
      <div class="or-keyboard"></div>
    </div>
  </div>
  <div class="or-footer">
    <div class="or-task">${esc(taskStr)}</div>
    <div class="or-prog-wrap">
      <div class="or-prog"><div class="or-prog-fill" style="width:${pct}%"></div></div>
      <span class="or-pct">${pct}%</span>
    </div>
  </div>
</div>`;
  }).join('');
}

/* ── Right Panel: Agent Task List ────────────────────────────── */

function renderRightPanel(agents) {
  const list = document.getElementById('rp-list');
  document.getElementById('rp-cnt').textContent = agents.length;

  const sorted = [...agents].sort((a, b) =>
    (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99)
  );

  list.innerHTML = sorted.map(agent => {
    const color = AGENT_COLORS[agent.id] || '#7c3aed';
    const pct   = Math.max(0, Math.min(100, agent.progress));
    const label = STATUS_LABELS[agent.status] || agent.status;
    const task  = agent.task.length > 34 ? agent.task.slice(0, 33) + '…' : agent.task;

    return `
<div class="rpl-item" data-status="${esc(agent.status)}" style="--acolor:${color}">
  <div class="rpl-row1">
    <span class="rpl-dot"></span>
    <span class="rpl-name">${esc(agent.name)}</span>
    <span class="rpl-status">${esc(label)}</span>
  </div>
  <div class="rpl-task">${esc(task)}</div>
  <div class="rpl-prog"><div class="rpl-fill" style="width:${pct}%"></div></div>
</div>`;
  }).join('');
}

/* ── Secretary Alert (CEO Attention) ─────────────────────────── */

function renderSecretaryAlert(data) {
  const alertEl = document.getElementById('rp-alert');
  const body    = document.getElementById('rpa-body');

  if (!data.secretary) { alertEl.style.display = 'none'; return; }

  const attn    = data.secretary.ceoAttention || [];
  const blocks  = data.secretary.blockers     || [];
  const actions = data.secretary.nextActions  || [];

  const items = [
    ...attn.map(t    => `<div class="rpa-attn">⚠ ${esc(t)}</div>`),
    ...blocks.map(t  => `<div class="rpa-block">🔴 ${esc(t)}</div>`),
    ...actions.map(t => `<div class="rpa-next">→ ${esc(t)}</div>`),
  ];

  if (!items.length) { alertEl.style.display = 'none'; return; }
  body.innerHTML = items.join('');
  alertEl.style.display = 'block';
}

/* ── Goals (from secretary.nextActions) ──────────────────────── */

function updateGoals(data) {
  if (!data.secretary || !data.secretary.nextActions) return;
  const actions = data.secretary.nextActions.slice(0, 4);
  if (!actions.length) return;
  document.getElementById('goals-list').innerHTML =
    actions.map(a => `<div class="goal-item">□ ${esc(a)}</div>`).join('');
}

/* ── Log Feed ────────────────────────────────────────────────── */

function renderLogFeed(agents) {
  const entries = [];
  agents.forEach(agent => {
    agent.log.forEach(entry => {
      const m = entry.match(/^(\d{2}:\d{2})/);
      entries.push({ time: m ? m[1] : '00:00', agent, text: entry });
    });
  });
  entries.sort((a, b) => b.time.localeCompare(a.time));

  const feed = document.getElementById('log-feed');
  feed.innerHTML = entries.slice(0, 20).map(({ agent, text }) => `
<div class="log-entry" data-status="${esc(agent.status)}">
  <span class="log-avatar">${esc(agent.avatar || '👤')}</span>
  <span class="log-agent">[${esc(agent.name)}]</span>
  <span class="log-text">${esc(text)}</span>
</div>`).join('');
}

/* ── Report Tabs ─────────────────────────────────────────────── */

let currentTab      = 'daily';
let dailyReportPath = null;
let reportCache     = {};

function initTabs() {
  document.getElementById('report-tabs').addEventListener('click', e => {
    const btn = e.target.closest('.rtab');
    if (!btn) return;
    const report = btn.dataset.report;
    if (!report) return;
    document.querySelectorAll('.rtab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTab = report;
    loadReport(report);
  });
}

async function loadReport(tabId) {
  const body    = document.getElementById('report-body');
  const updated = document.getElementById('report-updated');
  if (!reportCache[tabId]) body.innerHTML = '<div class="report-loading">読込中...</div>';

  let path;
  if (tabId === 'daily') {
    path = dailyReportPath;
    if (!path) return;
  } else {
    path = DEPT_FILES[tabId];
    if (!path) return;
  }

  try {
    if (!reportCache[tabId]) {
      reportCache[tabId] = await fetchText(path);
    }
    const label = DEPT_LABELS[tabId] || tabId;
    body.innerHTML = `
      <div class="report-doc-header">
        <span class="report-doc-title">${esc(label)}</span>
        <span class="report-doc-path">${esc(path)}</span>
      </div>
      <div class="report-md">${mdToHtml(reportCache[tabId])}</div>`;
    updated.textContent = '読込済み';
  } catch (e) {
    body.innerHTML = `<div class="report-error">⚠ 読込失敗: ${esc(path)}</div>`;
    updated.textContent = '読込失敗';
  }
}

async function syncDailyReport(data) {
  if (!data.secretary || !data.secretary.latestReport) return;
  const path = data.secretary.latestReport;

  if (path !== dailyReportPath) {
    dailyReportPath = path;
    delete reportCache['daily'];
    if (currentTab === 'daily') await loadReport('daily');
  } else if (currentTab === 'daily' && !reportCache['daily']) {
    await loadReport('daily');
  }

  const secUpdated = data.secretary.updatedAt
    ? new Date(data.secretary.updatedAt) : null;
  if (secUpdated && currentTab === 'daily') {
    const hh = secUpdated.getHours().toString().padStart(2,'0');
    const mm = secUpdated.getMinutes().toString().padStart(2,'0');
    document.getElementById('report-updated').textContent = '更新: ' + hh + ':' + mm;
  }
}

/* ── Markdown → HTML ─────────────────────────────────────────── */

function mdToHtml(md) {
  const lines = md.split('\n');
  const out   = [];
  let inTable = false, tableRows = [];

  function flushTable() {
    if (!tableRows.length) return;
    let html = '<table>';
    tableRows.forEach((row, i) => {
      if (/^\|[-| :]+\|$/.test(row.trim())) return;
      const cells = row.split('|').slice(1, -1).map(c => c.trim());
      const tag = i === 0 ? 'th' : 'td';
      html += '<tr>' + cells.map(c => `<${tag}>${inlineFmt(esc(c))}</${tag}>`).join('') + '</tr>';
    });
    html += '</table>';
    out.push(html);
    tableRows = []; inTable = false;
  }

  lines.forEach(line => {
    if (line.startsWith('|')) { inTable = true; tableRows.push(line); return; }
    if (inTable) flushTable();
    if (/^# /.test(line))        { out.push('<h1>' + inlineFmt(esc(line.slice(2)))  + '</h1>'); return; }
    if (/^## /.test(line))       { out.push('<h2>' + inlineFmt(esc(line.slice(3)))  + '</h2>'); return; }
    if (/^### /.test(line))      { out.push('<h3>' + inlineFmt(esc(line.slice(4)))  + '</h3>'); return; }
    if (/^---$/.test(line))      { out.push('<hr>'); return; }
    if (/^- \[ \] /.test(line))  { out.push('<div class="todo todo-open">☐ '  + inlineFmt(esc(line.slice(6))) + '</div>'); return; }
    if (/^- \[x\] /i.test(line)) { out.push('<div class="todo todo-done">☑ ' + inlineFmt(esc(line.slice(6))) + '</div>'); return; }
    if (/^- /.test(line))        { out.push('<li>' + inlineFmt(esc(line.slice(2))) + '</li>'); return; }
    if (line.trim() === '')      { out.push('<br>'); return; }
    out.push('<p>' + inlineFmt(esc(line)) + '</p>');
  });
  if (inTable) flushTable();
  return out.join('');
}

function inlineFmt(s) {
  return s
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/✅/g, '<span class="badge-ok">✅</span>')
    .replace(/⚠️ (.+)$/, '<span class="warn-row">⚠️ $1</span>');
}

/* ── Progress Timeline ───────────────────────────────────────── */

let progressLoaded = false;

async function renderProgress() {
  if (progressLoaded) return;
  try {
    const data = await fetchJSON('reports/progress-history.json');
    progressLoaded = true;
    buildTimeline(data);
    updateImpact(data.totals);
  } catch (_) {}
}

function buildTimeline(data) {
  const { sprints, totals } = data;
  const maxFiles = Math.max(...sprints.map(s => s.filesCreated + s.filesModified), 1);

  document.getElementById('sprint-badge').textContent =
    'SPRINT ' + totals.sprintsCompleted + '  |  FILES ' + (totals.filesCreated + totals.filesModified);

  document.getElementById('sprint-timeline').innerHTML = sprints.map(sprint => {
    const total  = sprint.filesCreated + sprint.filesModified;
    const barPct = Math.round((total / maxFiles) * 100);
    const tags   = (sprint.departments || []).map(d => `<span class="dept-tag">${d}</span>`).join('');
    const hls    = (sprint.highlights  || []).map(h => `<span class="sprint-highlight">${esc(h)}</span>`).join('');
    return `
<div class="sprint-row">
  <div class="sprint-meta">
    <div class="sprint-num">S${sprint.id}</div>
    <div class="sprint-date">${sprint.date}</div>
  </div>
  <div class="sprint-content">
    <div class="sprint-title">${esc(sprint.title)}</div>
    <div class="sprint-bar-row">
      <div class="sprint-bar"><div class="sprint-bar-fill" style="width:${barPct}%"></div></div>
      <span class="sprint-file-count">
        <span class="fc-new">+${sprint.filesCreated}</span>
        <span class="fc-mod">Δ${sprint.filesModified}</span>
      </span>
    </div>
    <div class="sprint-footer"><div class="sprint-depts">${tags}</div><div class="sprint-highlights">${hls}</div></div>
  </div>
</div>`;
  }).join('');

  document.getElementById('progress-totals').innerHTML = `
<div class="totals-strip">
  <div class="total-chip"><div class="total-num">${totals.filesCreated}</div><div class="total-label">FILES CREATED</div></div>
  <div class="total-chip"><div class="total-num">${totals.filesModified}</div><div class="total-label">FILES MODIFIED</div></div>
  <div class="total-chip"><div class="total-num">${totals.sprintsCompleted}</div><div class="total-label">SPRINTS</div></div>
  <div class="total-chip"><div class="total-num">${totals.daysActive}</div><div class="total-label">DAYS ACTIVE</div></div>
</div>`;
}

function updateImpact(totals) {
  if (!totals) return;
  document.getElementById('imp-created').textContent  = totals.filesCreated  ?? '—';
  document.getElementById('imp-modified').textContent = totals.filesModified ?? '—';
  document.getElementById('imp-sprints').textContent  = totals.sprintsCompleted ?? '—';
}

/* ── Sidebar navigation ──────────────────────────────────────── */

function initSidebar() {
  document.getElementById('sidebar').addEventListener('click', e => {
    const btn = e.target.closest('.sb-btn');
    if (!btn) return;
    const targetId = btn.dataset.target;
    if (!targetId) return;
    document.querySelectorAll('.sb-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const target = document.getElementById(targetId);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

/* ── Mobile nav ──────────────────────────────────────────────── */

function mobileSec(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.querySelectorAll('.mn-btn').forEach(b => b.classList.remove('active'));
  const idx  = ['sec-floor','sec-progress','sec-log','sec-report'].indexOf(id);
  const btns = document.querySelectorAll('.mn-btn');
  if (btns[idx]) btns[idx].classList.add('active');
}

/* ── Main render ─────────────────────────────────────────────── */

function render(data) {
  updateTopBar(data);
  renderOfficeGrid(data.agents);
  renderRightPanel(data.agents);
  renderSecretaryAlert(data);
  updateGoals(data);
  renderLogFeed(data.agents);

  /* DONE count for impact */
  const doneCount = data.agents.filter(a => a.status === 'done').length;
  document.getElementById('imp-done').textContent = doneCount;

  syncDailyReport(data);
}

/* ── Polling loop ─────────────────────────────────────────────── */

let errCount = 0;

async function poll() {
  try {
    const data = await fetchJSON('agent-status.json');
    errCount = 0;
    render(data);
  } catch (err) {
    errCount++;
    if (errCount === 1 && location.protocol === 'file:') {
      document.getElementById('error-modal').style.display = 'flex';
      return;
    }
    console.warn('[Dashboard] fetch failed, retrying…', err.message);
  }
  setTimeout(poll, POLL_MS);
}

/* ── Bootstrap ───────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  startClock();
  initSidebar();
  initTabs();
  renderProgress();
  poll();
});
