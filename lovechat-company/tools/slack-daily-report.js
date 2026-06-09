/**
 * slack-daily-report.js
 * 最新の日次レポートを整形して Slack へ送る
 *
 * 使い方:
 *   node lovechat-company/tools/slack-daily-report.js
 *
 * 送信先:
 *   - SLACK_WEBHOOK_DAILY  → #lovechat-daily-report（日報全文）
 *   - SLACK_WEBHOOK_CEO    → #lovechat-ceo-room（CEO確認事項のみ）
 */

const fs   = require('fs');
const path = require('path');
const { sendSlack } = require('./slack-notify');

const REPORTS_DIR = path.join(__dirname, '../reports');
const STATUS_FILE = path.join(__dirname, '../agent-status.json');

/* ── 最新日次レポートを検索 ──────────────────────────────────── */

function getLatestReport() {
  const files = fs.readdirSync(REPORTS_DIR)
    .filter(f => /^\d{4}-\d{2}-\d{2}-daily\.md$/.test(f))
    .sort()
    .reverse();
  return files.length ? path.join(REPORTS_DIR, files[0]) : null;
}

/* ── Markdown → Slack mrkdwn（最小変換） ────────────────────── */

function mdToSlack(md) {
  return md
    .replace(/^## (.+)$/gm, '*$1*')
    .replace(/^### (.+)$/gm, '_$1_')
    .replace(/\*\*(.+?)\*\*/g, '*$1*')
    .replace(/^---$/gm, '────────────────────')
    .slice(0, 3000); // Slack テキスト上限
}

/* ── メイン ─────────────────────────────────────────────────── */

async function main() {
  // 日報全文 → #lovechat-daily-report
  const reportPath = getLatestReport();
  if (reportPath) {
    const md   = fs.readFileSync(reportPath, 'utf8');
    const date = path.basename(reportPath).slice(0, 10);
    const text = `📋 *${date} 日次レポート*\n\n${mdToSlack(md)}`;
    await sendSlack('SLACK_WEBHOOK_DAILY', text, {
      username:   '秘書',
      icon_emoji: ':memo:',
    });
    console.log(`[daily-report] ${date} → SLACK_WEBHOOK_DAILY 送信`);
  } else {
    console.log('[daily-report] 日次レポートが見つかりませんでした');
  }

  // CEO確認事項のみ → #lovechat-ceo-room
  const status    = JSON.parse(fs.readFileSync(STATUS_FILE, 'utf8'));
  const ceoItems  = status.secretary?.ceoAttention || [];
  const blockers  = status.secretary?.blockers     || [];

  if (ceoItems.length) {
    const items = ceoItems.map((item, i) => `${i + 1}. ${item}`).join('\n');
    const block = blockers.length
      ? `\n\n⛔ *ブロッカー*\n${blockers.map(b => `• ${b}`).join('\n')}`
      : '';
    const text = `🚨 *CEO確認事項*\n\n${items}${block}`;
    await sendSlack('SLACK_WEBHOOK_CEO', text, {
      username:   '秘書',
      icon_emoji: ':bell:',
    });
    console.log('[daily-report] CEO確認事項 → SLACK_WEBHOOK_CEO 送信');
  }
}

main().catch(err => {
  console.error('[daily-report] エラー:', err.message);
  process.exit(1);
});
