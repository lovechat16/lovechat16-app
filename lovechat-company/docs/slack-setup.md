# Slack 連携セットアップ手順

## 1. Slack アプリ作成

1. [https://api.slack.com/apps](https://api.slack.com/apps) を開く
2. **Create New App** → **From scratch** をクリック
3. App Name: `lovechat-bot`、Workspace を選択 → **Create App**

## 2. Incoming Webhooks を有効化

1. 左メニュー「Incoming Webhooks」をクリック
2. トグルを **On** にする
3. **Add New Webhook to Workspace** をクリック
4. チャンネルを選択して **Allow** する
5. 発行された URL（`https://hooks.slack.com/services/...`）をコピー

### 作成するチャンネルと対応する変数

| チャンネル名 | 用途 | 変数名 |
|---|---|---|
| `#lovechat-ceo-room` | CEO確認事項・ブロッカー・ステータス | `SLACK_WEBHOOK_CEO` |
| `#lovechat-daily-report` | 日報全文 | `SLACK_WEBHOOK_DAILY` |
| `#lovechat-03-sns` | SNS部署完了通知（任意） | `SLACK_WEBHOOK_SNS` |

**最小構成:** `SLACK_WEBHOOK_CEO` と `SLACK_WEBHOOK_DAILY` の2本だけでOK。

## 3. .env を作成

```bash
cp .env.example .env
```

`.env` を開いて、各 URL を貼り付ける:

```env
SLACK_WEBHOOK_CEO=https://hooks.slack.com/services/T.../B.../...
SLACK_WEBHOOK_DAILY=https://hooks.slack.com/services/T.../B.../...
SLACK_WEBHOOK_SNS=   # 使わないなら空のまま
```

⚠️ `.env` は `.gitignore` に含まれているので GitHub にはコミットされません。

## 4. 動作確認

### 手動テスト

```bash
# 接続テスト（CEOルームへメッセージ送信）
node -e "require('./lovechat-company/tools/slack-notify').sendSlack('SLACK_WEBHOOK_CEO', 'テスト: 接続成功 ✅').then(() => console.log('OK'))"

# 日報送信
node lovechat-company/tools/slack-daily-report.js

# 全員ステータスサマリー送信
node lovechat-company/tools/slack-status-summary.js
```

### 自動通知（auto-watcher 経由）

サーバーを起動すれば auto-watcher が動き、ファイルを保存するたびに CEOルームへ通知が飛びます:

```bash
node server.js
```

## 5. ツール一覧

| ファイル | 説明 | 実行タイミング |
|---|---|---|
| `tools/slack-notify.js` | Webhook送信の共通関数（require して使う） | - |
| `tools/slack-daily-report.js` | 日報 + CEO確認事項を送信 | 作業終了時に手動実行 |
| `tools/slack-status-summary.js` | 全員のステータスを送信 | 任意のタイミングで手動実行 |
| `scripts/auto-watcher.js` | ファイル変更検知 → done 時に自動送信 | server.js 起動で自動開始 |

## 将来の拡張（今は不要）

双方向連携（Slack から Claude への指示）が必要になったら:
- **Slack Bot Token** + **Events API** を追加
- ローカルエンドポイントに ngrok でトンネル
- `tools/slack-receive.js` を作成して指示を受け取る
