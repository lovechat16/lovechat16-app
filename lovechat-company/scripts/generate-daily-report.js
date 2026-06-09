/**
 * generate-daily-report.js
 * agent-status.json を読み込み、日次レポートを生成する
 *
 * 使い方:
 *   node lovechat-company/scripts/generate-daily-report.js
 */

const fs   = require('fs');
const path = require('path');

const BASE    = path.join(__dirname, '..');
const STATUS  = path.join(BASE, 'agent-status.json');
const REPORTS = path.join(BASE, 'reports');

/* ── Date helpers ────────────────────────────────────────────── */

function today() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const n = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${n}`;
}

function timeNow() {
  const d = new Date();
  return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
}

/* ── Load agent-status.json ──────────────────────────────────── */

const raw    = fs.readFileSync(STATUS, 'utf8');
const data   = JSON.parse(raw);
const agents = data.agents || [];
const DATE   = today();
const TIME   = timeNow();

/* ── Categorise agents ────────────────────────────────────────── */

const working  = agents.filter(a => a.status === 'working');
const reviewing= agents.filter(a => a.status === 'reviewing');
const testing  = agents.filter(a => a.status === 'testing');
const done     = agents.filter(a => a.status === 'done');
const idle     = agents.filter(a => a.status === 'idle');

const active = [...working, ...reviewing, ...testing];

/* ── Build report ─────────────────────────────────────────────── */

function agentSection(agent) {
  const lastLog = agent.log.length ? agent.log[agent.log.length - 1] : '—';
  return `
### ${agent.role} / ${agent.name}

- ステータス: ${agent.status}
- 進捗: ${agent.progress}%
- タスク: ${agent.task}
- 最終ログ: ${lastLog}
`;
}

function listOrNone(items, fn) {
  if (!items.length) return '- なし\n';
  return items.map(fn).join('');
}

/* Secretary fields */
const sec    = data.secretary || {};
const attn   = (sec.ceoAttention || []).map(t => `- [ ] ${t}`).join('\n') || '- [ ] （なし）';
const blocks = (sec.blockers    || []).map(t => `- ${t}`).join('\n')       || '- なし';
const nexts  = (sec.nextActions || []).map((t,i) => `${i+1}. ${t}`).join('\n') || '1. （未設定）';

/* Build 現在の会社状態 section */
const activeDepts = active.map(a => `${a.role}（${a.status}・${a.progress}%）`).join('、') || 'なし（全員done/idle）';

/* 完了済み主要成果（done エージェントのタスクから上位3件） */
const majorDone = done.slice(0, 3).map(a => `${a.role}：${a.task.length > 40 ? a.task.slice(0,39)+'…' : a.task}`);
const majorDoneStr = majorDone.length ? majorDone.map(t => `- ${t}`).join('\n') : '- なし';

/* 最大ブロッカー（最初の1件を優先表示） */
const topBlocker = (sec.blockers || [])[0] || 'なし';

/* CEOが今日判断すべきこと（ceoAttentionの1件目） */
const topAttn = (sec.ceoAttention || [])[0] || 'なし';

/* 次に動くべき部署（working/reviewingのエージェント、なければnextActionsから推測） */
const nextDeptStr = active.length > 0
  ? active.map(a => a.role).join('・')
  : (sec.nextActions || []).length > 0 ? `nextAction: ${sec.nextActions[0]}` : '全部門 done — 次タスクの割り当てが必要';

const report = `# ラブチャット16 Company｜日次レポート

日付: ${DATE}
最終更新: ${TIME}
作成者: 統括秘書（自動生成）

---

## 現在の会社状態

- **稼働中の部署:** ${activeDepts}
- **完了済みの主要成果:**
${majorDoneStr}
- **現在の最大ブロッカー:** ${topBlocker}
- **CEOが今日判断すべきこと:** ${topAttn}
- **次に動くべき部署:** ${nextDeptStr}

---

## 1. 本日の総括

- 稼働中: ${active.length}名 / 全${agents.length}名
- 完了タスク: ${done.length}件
- 今日一番進んだこと: ${working[0] ? working[0].task : '稼働中タスクなし'}
- ブロッカー: ${(sec.blockers || []).length > 0 ? (sec.blockers || []).join(' / ') : 'なし'}

---

## 2. 部門別進捗

${agents.map(agentSection).join('')}

---

## 3. 稼働状況サマリー

| ステータス | 人数 |
|-----------|------|
| working | ${working.length} |
| reviewing | ${reviewing.length} |
| testing | ${testing.length} |
| done | ${done.length} |
| idle | ${idle.length} |

---

## 4. CEO確認事項

${attn}

---

## 5. 懸念事項・ブロッカー

${blocks}

---

## 6. 明日の優先タスク

${nexts}

---

## 7. 統括秘書コメント

${active.length > 0
  ? `現在 ${active.length}名が稼働中。${working.map(a => a.name).join('・')} が作業中。`
  : '全員 done または idle 状態。次タスクの割り当てが必要。'}

---

_自動生成: generate-daily-report.js | ${new Date().toISOString()}_
`;

/* ── Write report ─────────────────────────────────────────────── */

if (!fs.existsSync(REPORTS)) fs.mkdirSync(REPORTS, { recursive: true });

const REPORT_PATH    = path.join(REPORTS, `${DATE}-daily.md`);
const REPORT_REL     = `reports/${DATE}-daily.md`;

/* Append if same-day report exists, otherwise create */
if (fs.existsSync(REPORT_PATH)) {
  const existing = fs.readFileSync(REPORT_PATH, 'utf8');
  const separator = '\n\n---\n## 更新 ' + TIME + '\n\n';
  fs.writeFileSync(REPORT_PATH, existing + separator + report, 'utf8');
  console.log('[SecretaryBot] 既存レポートに追記: ' + REPORT_PATH);
} else {
  fs.writeFileSync(REPORT_PATH, report, 'utf8');
  console.log('[SecretaryBot] 新規レポート作成: ' + REPORT_PATH);
}

/* ── Update agent-status.json: secretary.latestReport ─────────── */

data.secretary = data.secretary || {};
data.secretary.latestReport = REPORT_REL;
data.secretary.updatedAt    = new Date().toISOString();

/* Keep existing ceoAttention/blockers/nextActions if present */
if (!data.secretary.ceoAttention) data.secretary.ceoAttention = [];
if (!data.secretary.blockers)     data.secretary.blockers     = [];
if (!data.secretary.nextActions)  data.secretary.nextActions  = [];

data.updatedAt = new Date().toISOString();

fs.writeFileSync(STATUS, JSON.stringify(data, null, 2), 'utf8');
console.log('[SecretaryBot] agent-status.json を更新しました');
console.log('[SecretaryBot] http://localhost:3000/dashboard でレポートを確認してください');
