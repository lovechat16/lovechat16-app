/**
 * slack-notify.js
 * Slack Incoming Webhook 送信の共通モジュール（外部ライブラリなし）
 *
 * 使い方:
 *   const { sendSlack } = require('./slack-notify');
 *   await sendSlack('SLACK_WEBHOOK_CEO', 'テストメッセージ');
 */

const https = require('https');
const url   = require('url');
const fs    = require('fs');
const path  = require('path');

/* ── .env を手動ロード（dotenvなし） ──────────────────────────── */

let envLoaded = false;

function loadEnv() {
  if (envLoaded) return;
  envLoaded = true;

  // lovechat-company/tools/ → プロジェクトルートの .env
  const envPath = path.join(__dirname, '../../.env');
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (key && !process.env[key]) process.env[key] = val;
  }
}

/* ── Webhook 送信 ──────────────────────────────────────────────── */

/**
 * @param {string} webhookEnvKey - process.env のキー名（例: 'SLACK_WEBHOOK_CEO'）
 * @param {string} text          - 送信テキスト（mrkdwn使用可）
 * @param {object} [extra]       - payload に追加するプロパティ（username, icon_emoji など）
 * @returns {Promise<void>}      - Webhook未設定時は即 resolve
 */
function sendSlack(webhookEnvKey, text, extra = {}) {
  loadEnv();

  const webhookUrl = process.env[webhookEnvKey];
  if (!webhookUrl) return Promise.resolve(); // 未設定なら静かにスキップ

  const payload = JSON.stringify({ text, ...extra });
  const parsed  = url.parse(webhookUrl);

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: parsed.hostname,
      path:     parsed.path,
      method:   'POST',
      headers:  {
        'Content-Type':   'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    }, res => {
      res.resume();
      res.on('end', resolve);
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

module.exports = { sendSlack, loadEnv };
