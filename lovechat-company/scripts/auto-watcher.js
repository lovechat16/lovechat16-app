#!/usr/bin/env node
/**
 * auto-watcher.js
 * ファイル変更を検知して agent-status.json を自動更新する
 *
 * 起動: node lovechat-company/scripts/auto-watcher.js
 */

const fs   = require('fs');
const path = require('path');
const { sendSlack } = require('../tools/slack-notify');

const ROOT        = path.join(__dirname, '..', '..');  // プロジェクトルート
const STATUS_FILE = path.join(__dirname, '..', 'agent-status.json');
const DONE_DELAY  = 5000; // 最後の変更から5秒後に "done" にする

/* ── パス → エージェントID マッピング ──────────────────────────── */

const AGENT_MAP = [
  { test: p => p.includes('employee/01'), id: 'diagnosis-planner',  label: '診断設計' },
  { test: p => p.includes('employee/02'), id: 'result-copywriter',  label: '結果文章' },
  { test: p => p.includes('employee/03'), id: 'sns-growth',         label: 'SNS拡散' },
  { test: p => p.includes('employee/04'), id: 'viral-creative',     label: 'バイラル' },
  { test: p => p.includes('employee/05'), id: 'product-maker',      label: 'プロダクト' },
  { test: p => p.includes('employee/06'), id: 'lp-line-designer',   label: 'LP・LINE' },
  { test: p => p.includes('employee/07'), id: 'dev-engineer',       label: '開発・技術' },
  { test: p => p.includes('employee/08'), id: 'design-director',    label: 'デザイン統括' },
  { test: p => p.includes('employee/09'), id: 'ui-designer',        label: 'UIデザイン' },
  { test: p => p.includes('employee/10'), id: 'visual-critic',      label: 'デザインレビュー' },
  { test: p => p.includes('employee/11'), id: 'strategy-validator', label: '戦略検証' },
  // プロジェクトルートのファイル
  { test: p => /lc16-.*\.css/.test(p),   id: 'ui-designer',        label: 'UIデザイン' },
  { test: p => p.includes('assets/'),    id: 'design-director',    label: 'デザイン統括' },
  { test: p => p.includes('share/'),     id: 'dev-engineer',       label: '開発・技術' },
  { test: p => /\.(html|js)$/.test(p) && !p.includes('lovechat-company'),
                                          id: 'dev-engineer',       label: '開発・技術' },
  { test: p => p.includes('lovechat-company/reports'), id: 'secretary', label: '秘書・調整' },
  { test: p => p.includes('lovechat-company/context'), id: 'secretary', label: '秘書・調整' },
];

/* ── 無視するパス ────────────────────────────────────────────── */

const IGNORE = [
  'agent-status.json',
  '.git',
  'node_modules',
  '.claude',
];

function shouldIgnore(filepath) {
  return IGNORE.some(ig => filepath.includes(ig));
}

/* ── エージェント判定 ────────────────────────────────────────── */

function detectAgent(filepath) {
  const normalized = filepath.replace(/\\/g, '/');
  for (const rule of AGENT_MAP) {
    if (rule.test(normalized)) return rule;
  }
  return null;
}

/* ── agent-status.json 読み書き ──────────────────────────────── */

function readStatus() {
  try {
    return JSON.parse(fs.readFileSync(STATUS_FILE, 'utf8'));
  } catch {
    return null;
  }
}

function writeStatus(data) {
  data.updatedAt = new Date().toISOString();
  fs.writeFileSync(STATUS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function updateAgent(agentId, status, task, progress, logMsg) {
  const data = readStatus();
  if (!data) return;

  const agent = data.agents.find(a => a.id === agentId);
  if (!agent) return;

  agent.status   = status;
  agent.task     = task;
  agent.progress = progress;

  if (logMsg) {
    const now = new Date();
    const ts  = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
    agent.log.push(`${ts} ${logMsg}`);
    if (agent.log.length > 10) agent.log = agent.log.slice(-10);
  }

  writeStatus(data);
}

/* ── デバウンスタイマー（エージェントごと）────────────────────── */

const timers    = {};  // agentId → setTimeout
const lastFiles = {};  // agentId → 最後に変更されたファイル名
const progress  = {};  // agentId → 現在の進捗

function onFileChange(filepath) {
  if (shouldIgnore(filepath)) return;

  const rule = detectAgent(filepath);
  if (!rule) return;

  const { id: agentId } = rule;
  const filename = path.basename(filepath);

  // 進捗をインクリメント（working中）
  if (!progress[agentId] || progress[agentId] >= 95) progress[agentId] = 30;
  else progress[agentId] = Math.min(progress[agentId] + 10, 95);

  lastFiles[agentId] = filename;

  // working に更新
  updateAgent(agentId, 'working', `${filename} を編集中`, progress[agentId], `${filename} 変更検知`);

  const color = agentId === 'sns-growth' ? '\x1b[32m' : '\x1b[36m';
  console.log(`${color}[${agentId}]\x1b[0m working → ${filename}`);

  // タイマーをリセット
  if (timers[agentId]) clearTimeout(timers[agentId]);
  timers[agentId] = setTimeout(() => {
    const doneFile = lastFiles[agentId];
    progress[agentId] = 100;
    updateAgent(agentId, 'done', `${doneFile} 完了`, 100, `${doneFile} 保存完了`);
    console.log(`\x1b[35m[${agentId}]\x1b[0m done ✓`);

    // Slack 通知（SLACK_WEBHOOK_CEO が未設定なら自動スキップ）
    const { label } = rule;
    sendSlack('SLACK_WEBHOOK_CEO',
      `✅ *[${label}]* \`${doneFile}\` 保存完了`,
      { username: 'auto-watcher', icon_emoji: ':robot_face:' }
    ).catch(() => {});
  }, DONE_DELAY);
}

/* ── ファイル監視 ────────────────────────────────────────────── */

function startWatcher() {
  // Windows の fs.watch は recursive オプションをサポート
  const options = { recursive: true };

  // プロジェクトルートを監視
  fs.watch(ROOT, options, (eventType, filename) => {
    if (!filename) return;
    const full = path.join(ROOT, filename);
    onFileChange(full);
  });

  console.log('\x1b[1m\x1b[32m✅ auto-watcher 起動完了\x1b[0m');
  console.log(`   監視対象: ${ROOT}`);
  console.log(`   更新先:   ${STATUS_FILE}`);
  console.log('   Ctrl+C で停止\n');
}

/* ── 起動 ───────────────────────────────────────────────────── */

startWatcher();
