#!/usr/bin/env node
/**
 * agent-status.json を更新する CLI スクリプト
 *
 * 使い方:
 *   node lovechat-company/scripts/update-status.js <agent-id> <status> <task> <progress> [log]
 *
 * 例:
 *   node lovechat-company/scripts/update-status.js result-copywriter working "AFEPの結果文を改善中" 72 "刺さる一言を調整中"
 *   node lovechat-company/scripts/update-status.js dev-engineer testing "ユニットテストを実行中" 50
 *   node lovechat-company/scripts/update-status.js ceo done "全体方針確認完了" 100 "スプリント完了"
 */

const fs = require('fs');
const path = require('path');

const STATUS_FILE = path.join(__dirname, '..', 'agent-status.json');
const VALID_STATUSES = ['working', 'reviewing', 'testing', 'idle', 'done'];

function usage() {
  console.log(`
使い方:
  node update-status.js <agent-id> <status> <task> <progress> [log]

引数:
  agent-id   エージェントID（下記参照）
  status     working | reviewing | testing | idle | done
  task       現在のタスク説明（スペースを含む場合はクォートで囲む）
  progress   進捗 0〜100 の整数
  log        ログメッセージ（省略可）

使用可能な agent-id:
  secretary
  ceo
  diagnosis-planner
  result-copywriter
  sns-growth
  viral-creative
  product-maker
  lp-line-designer
  dev-engineer
  design-director
  ui-designer
  visual-critic

例:
  node update-status.js result-copywriter working "AFEPの結果文を改善中" 72 "刺さる一言を調整中"
  node update-status.js dev-engineer testing "ユニットテストを実行中" 50
  node update-status.js ceo done "全体方針確認完了" 100 "スプリント完了"
  node update-status.js sns-growth idle "待機中" 0
`);
}

const args = process.argv.slice(2);

if (args.length < 4 || args[0] === '--help' || args[0] === '-h') {
  usage();
  process.exit(args.length < 4 ? 1 : 0);
}

const [agentId, status, task, progressStr, ...logParts] = args;
const logMsg = logParts.join(' ');
const progress = parseInt(progressStr, 10);

if (!VALID_STATUSES.includes(status)) {
  console.error(`\x1b[31mエラー:\x1b[0m status は以下のいずれかです: ${VALID_STATUSES.join(' | ')}`);
  process.exit(1);
}

if (isNaN(progress) || progress < 0 || progress > 100) {
  console.error('\x1b[31mエラー:\x1b[0m progress は 0〜100 の整数で指定してください');
  process.exit(1);
}

if (!fs.existsSync(STATUS_FILE)) {
  console.error(`\x1b[31mエラー:\x1b[0m ${STATUS_FILE} が見つかりません`);
  console.error('lovechat-company/ フォルダが存在するか確認してください');
  process.exit(1);
}

let data;
try {
  data = JSON.parse(fs.readFileSync(STATUS_FILE, 'utf8'));
} catch (e) {
  console.error(`\x1b[31mエラー:\x1b[0m JSON の読み込みに失敗しました: ${e.message}`);
  process.exit(1);
}

const agent = data.agents.find(a => a.id === agentId);
if (!agent) {
  const ids = data.agents.map(a => a.id).join(', ');
  console.error(`\x1b[31mエラー:\x1b[0m agent-id "${agentId}" が見つかりません`);
  console.error(`利用可能なID: ${ids}`);
  process.exit(1);
}

const now = new Date();
const hh = now.getHours().toString().padStart(2, '0');
const mm = now.getMinutes().toString().padStart(2, '0');
const timeStr = `${hh}:${mm}`;

const prevStatus = agent.status;
agent.status = status;
agent.task = task;
agent.progress = progress;

if (logMsg) {
  agent.log.push(`${timeStr} ${logMsg}`);
  if (agent.log.length > 10) {
    agent.log = agent.log.slice(-10);
  }
}

data.updatedAt = now.toISOString();

try {
  fs.writeFileSync(STATUS_FILE, JSON.stringify(data, null, 2), 'utf8');
} catch (e) {
  console.error(`\x1b[31mエラー:\x1b[0m ファイルの書き込みに失敗しました: ${e.message}`);
  process.exit(1);
}

const statusColors = {
  working:   '\x1b[32m', // green
  reviewing: '\x1b[33m', // yellow
  testing:   '\x1b[36m', // cyan
  idle:      '\x1b[90m', // gray
  done:      '\x1b[35m', // magenta
};
const reset = '\x1b[0m';
const bold  = '\x1b[1m';
const sc = statusColors[status] || '';

console.log(`\n${bold}✅ ${agent.name} を更新しました${reset}`);
console.log(`   ${prevStatus} → ${sc}${status}${reset}`);
console.log(`   task:     ${task}`);
console.log(`   progress: ${progress}%`);
if (logMsg) {
  console.log(`   log:      ${timeStr} ${logMsg}`);
}
console.log('');
