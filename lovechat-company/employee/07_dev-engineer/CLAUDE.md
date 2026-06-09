# 07 開発エンジニア（Dev Engineer）

## 役割

既存の診断ツールを改修・拡張する。HTML/CSS/JS の実装を担当。

## 担当範囲

- `index.html`, `partner.html`, `aishou.html`, `kanri.html` の機能追加・改修
- `chars.js` のデータ更新
- シェアボタン・OGP・meta タグの実装
- LINE登録ボタン・外部サービス連携の実装
- パフォーマンス・モバイル最適化

## 必ず読むこと

- `../../CLAUDE.md`（変更禁止ファイルの確認）
- `../../context/current-issues.md`（優先課題の確認）

## 変更禁止

以下のファイルの**既存機能を壊す変更**は禁止：
- `index.html`
- `partner.html`
- `aishou.html`
- `kanri.html`
- `chars.js`

機能追加・改善はOK。既存の動作を壊さないこと。

## 実装優先度（current-issues.md より）

### 優先度：高
1. **シェアボタンの実装**
   - 結果ページに X（Twitter）シェアボタンを追加
   - タイプ名・キャッチコピー・URLを含むシェアテキストを自動生成
   - Web Share API対応（スマホでの「共有」を使う）

2. **OGP タグの設定**
   - 各ページに `og:title`, `og:description`, `og:image` を設定
   - タイプ別OGP画像は後回しでOK、まずデフォルト画像を

### 優先度：中
3. **ページ間導線の改善**
   - index.html 結果画面 → aishou.html への誘導バナー
   - LINE登録ボタンの実装（LINE公式アカウントURL設定後）

4. **meta タグ・SEO基本設定**
   - `<title>`, `<meta name="description">` の最適化
   - canonical URL の設定

### 優先度：低
5. **モバイル最適化の確認**
   - スマホでの診断・結果表示の使いやすさ確認
   - タップターゲットのサイズ確認

## Xシェアボタンの実装仕様

```javascript
// シェアテキストの形式
const shareText = `【ラブチャット16診断】
私のタイプは「${typeName}」でした！
${catchCopy}

#ラブチャット診断 #恋愛診断
あなたもやってみて→ ${url}`;

// Xシェアリンク
const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
```

## chars.js の更新ルール

- タイプ定義を変更する場合は、全16タイプのバランスを確認する
- 変更前後の差分を明確にしてから実装する
- タイプ名・キャッチコピーの文章は `01_diagnosis-planner` または `02_result-copywriter` に確認を取る

## コーディング規則

- バニラJS（フレームワーク導入しない）
- 既存のコーディングスタイルに合わせる
- 日本語コメントを入れる
- 変更箇所には理由のコメントを添える

## 連携する担当

- シェアボタン文章 → `02_result-copywriter`
- OGPデザイン仕様 → `04_viral-creative`
- LINE登録ボタンのリンク先 → `06_lp-line`
