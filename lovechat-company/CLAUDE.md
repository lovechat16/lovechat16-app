# ラブチャット16 Company｜会社方針

## 会社概要
ラブチャット16診断を改善・拡散・収益化するためのAIチーム。
恋愛LINE/DMの会話傾向を16タイプに分類し、ユーザーが「当たってる」「シェアしたい」と感じる診断体験を作る。

## このフォルダの目的

ラブチャット16診断（恋愛LINE/DMの会話タイプ診断）を、SNSで自然に拡散され、将来的に収益化できるプロダクトへ育てるための作業チームです。

## プロジェクト概要


- **プロダクト名**: ラブチャット16診断
- **コンセプト**: 恋愛LINE/DMにおける会話タイプをMBTI的な16類型で診断する
- **現在地**: `index.html`（診断）、`partner.html`（相性）、`aishou.html`、`kanri.html`、`chars.js` が稼働中
- **目指すゴール**: 診断→拡散→収益化の導線を完成させる

## プロダクトの目的
- 恋愛メッセージのクセを可視化する
- 自分と相手の会話タイプを理解できるようにする
- 相性・すれ違い・返信改善のヒントを提供する
- SNSで自然に広がる診断コンテンツにする
- 将来的に有料の返信設計ガイド、note、LINE導線へ接続する

## 最重要方針

診断結果は、正確な心理学解説よりも「うわ、当たってる…」という体験を優先する。
占い的な言い当て感は出すが、**人格否定・不安煽り・操作的恋愛テクには絶対に寄せない**。

## トーン
- かわいい
- 少し毒がある
- でも人を傷つけすぎない
- SNSでスクショしたくなる
- 若者が友達に送りたくなる
- 説明ではなく、言い当てる

## フォルダ構成

```
lovechat-company/
├── CLAUDE.md              ← このファイル（全員が必ず読む）
├── dashboard.html         ← AI社員ダッシュボード（ブラウザで開く）
├── dashboard.css          ← ダッシュボードスタイル
├── dashboard.js           ← ダッシュボードロジック（1秒ポーリング）
├── agent-status.json      ← 各社員のリアルタイム稼働状態
├── scripts/
│   └── update-status.js   ← agent-status.json を更新する CLI
├── reports/               ← 秘書レポート（ダッシュボードに表示）
│   └── YYYY-MM-DD-daily.md ← 日次レポート
├── context/               ← プロジェクト共通知識
│   ├── about-project.md   ← プロジェクト詳細
│   ├── target.md          ← ターゲットユーザー
│   ├── tone.md            ← 文章トーン・禁止事項
│   ├── diagnosis-theory.md ← 診断の設計理論
│   ├── monetization.md    ← 収益化戦略
│   └── current-issues.md  ← 現在の課題一覧
└── employee/              ← 各担当者の役割定義
    ├── 00_secretary/       ← 秘書・全部門報告集約・レポート作成
    ├── 01_diagnosis-planner/   ← 診断設計
    ├── 02_result-copywriter/   ← 結果文章
    ├── 03_sns-growth/          ← SNS拡散
    ├── 04_viral-creative/      ← バイラルコンテンツ
    ├── 05_product-maker/       ← 派生プロダクト
    ├── 06_lp-line/             ← LP・LINE導線
    ├── 07_dev-engineer/        ← 実装・技術
    ├── 08_design-director/     ← ビジュアル方針・ブランド設計
    ├── 09_ui-designer/         ← UI/CSS実装・スマホ対応
    └── 10_visual-critic/       ← デザインレビュー・辛口評価
```

## 作業ルール

1. **context/ を必ず読んでから作業を始める**
2. 既存ファイル（`index.html`, `partner.html`, `aishou.html`, `kanri.html`, `chars.js`）は壊さない
3. 変更を加える前に、担当 employee の CLAUDE.md を読む
4. 出力物は日本語（診断テキスト・SNS文章）または日本語コメント付き（コード）

## ダッシュボード運用ルール（agent-status.json 更新）

社員タスクを実行するときは、作業前後に `scripts/update-status.js` で `agent-status.json` を更新する。
これにより `dashboard.html` がリアルタイムで稼働状況を表示できる。

### ステータス定義

| status     | 意味                       |
|------------|--------------------------|
| working    | ファイルを生成・編集している   |
| reviewing  | 既存ファイルを読んで確認中    |
| testing    | テスト・検証を実行中          |
| idle       | 待機中・何もしていない        |
| done       | タスク完了                  |

### 更新コマンド

```bash
node lovechat-company/scripts/update-status.js <agent-id> <status> "<task>" <progress> "<log>"
```

### agent-id 一覧

| agent-id          | 担当                    |
|-------------------|-------------------------|
| secretary         | 00 秘書・調整           |
| ceo               | CEO（全体方針）          |
| diagnosis-planner | 01 診断設計             |
| result-copywriter | 02 結果文章             |
| sns-growth        | 03 SNS拡散              |
| viral-creative    | 04 バイラル             |
| product-maker     | 05 プロダクト           |
| lp-line-designer  | 06 LP・LINE            |
| dev-engineer      | 07 開発・技術           |
| design-director   | 08 デザイン統括         |
| ui-designer       | 09 UIデザイン           |
| visual-critic     | 10 デザインレビュー     |

### 作業フロー例（result-copywriter の場合）

```bash
# 1. 作業開始
node lovechat-company/scripts/update-status.js result-copywriter working "AFEPの結果文を改善中" 60 "作業開始"

# 2. ファイルを読んで確認するとき
node lovechat-company/scripts/update-status.js result-copywriter reviewing "chars-desc.js を確認中" 65 "既存テキストをレビュー"

# 3. 進捗更新
node lovechat-company/scripts/update-status.js result-copywriter working "RSCD の毒トーンを調整中" 80 "6タイプ完了"

# 4. 完了
node lovechat-company/scripts/update-status.js result-copywriter done "16タイプ全文章を改善完了" 100 "完了"
```

### 注意事項
- 自律稼働中も作業の節目（開始・確認・完了）で更新する
- ログは最新10件まで自動保持される
- ダッシュボードはプロジェクトルートで `node server.js` を起動後、`http://localhost:3000/dashboard` で確認

## 必ず参照するファイル
- context/about-project.md
- context/target.md
- context/tone.md
- context/diagnosis-theory.md
- context/monetization.md
- context/current-issues.md


## 触れてはいけないファイル（変更禁止）

- `index.html`
- `partner.html`
- `aishou.html`
- `kanri.html`
- `chars.js`


## 禁止事項
- 薄い自己啓発
- 恋愛強者ぶった説教
- 女性蔑視・男性蔑視
- 「絶対沼らせる」などの操作的表現
- 根拠のない心理学風断定
- MBTIのような固定的人格決めつけ

