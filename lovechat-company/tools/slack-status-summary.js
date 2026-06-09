/**
 * slack-status-summary.js
 * agent-status.json の現在状態を整形して Slack CEO ルームへ送る
 *
 * 使い方:
 *   node lovechat-company/tools/slack-status-summary.js
 *
 * 送信先:
 *   - SLACK_WEBHOOK_CEO → #lovechat-ceo-room
 */

const fs   = require('fs');
const path = require('path');
const { sendSlack } = require('./slack-notify');

const STATUS_FILE = path.join(__dirname, '../agent-status.json');

const STATUS_EMOJI = {
  working:   '🟡',
  reviewing: '🔵',
  testing:   '🟠',
  idle:      '⚪',
  done:      '✅',
};

async function main() {
  const data   = JSON.parse(fs.readFileSync(STATUS_FILE, 'utf8'));
  const agents = data.agents || [];

  const lines = agents.map(a => {
    const emoji    = STATUS_EMOJI[a.status] || '❓';
    const taskText = a.task ? ` — ${a.task}` : '';
    return `${emoji} *${a.name}* (${a.role})${taskText} [${a.progress}%]`;
  });

  const blockers  = data.secretary?.blockers || [];
  const blockText = blockers.length
    ? `\n\n⛔ *ブロッカー*\n${blockers.map(b => `• ${b}`).join('\n')}`
    : '';

  const nextActions = data.secretary?.nextActions || [];
  const nextText    = nextActions.length
    ? `\n\n➡️ *次のアクション*\n${nextActions.map((a, i) => `${i + 1}. ${a}`).join('\n')}`
    : '';

  const updatedAt = new Date(data.updatedAt).toLocaleString('ja-JP');
  const text = `📊 *AIチーム稼働状況* (${updatedAt})\n\n${lines.join('\n')}${blockText}${nextText}`;

  await sendSlack('SLACK_WEBHOOK_CEO', text, {
    username:   '秘書',
    icon_emoji: ':bar_chart:',
  });
  console.log('[status-summary] → SLACK_WEBHOOK_CEO 送信完了');
}

main().catch(err => {
  console.error('[status-summary] エラー:', err.message);
  process.exit(1);
});
