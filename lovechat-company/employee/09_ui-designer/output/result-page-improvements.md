# 結果ページ UI改善仕様書
作成日: 2026-06-08
担当: 09_ui-designer
参照: 10_visual-critic/output/review-index-result-page.md
前提: index.html の JS ロジックは一切変更しない。HTML/CSS の改善点を定義する。

---

## 改善方針

「診断結果シート」→「占いカードの開封体験」に格上げする。
実装方法：`lc16-result.css` を新規作成し、`index.html` の `</head>` 直前に1行追加するだけで適用可能。

```html
<!-- index.html の </head> の直前に以下を1行追加 -->
<link rel="stylesheet" href="lc16-result.css">
```

---

## 改善ファイル: `lc16-result.css`

以下の内容をそのまま `lc16-result.css` として保存する。

```css
/* ============================================================
   lc16-result.css
   ラブチャット16 結果ページ UI 改善スタイル
   ※ index.html の既存スタイルを上書きする形で適用
   ============================================================ */

/* ── 1. キャッチコピーを主役に格上げ ─────────────────────── */
.rcatch {
  /* 現在: font-size:15px; font-style:italic; color:var(--muted) */
  font-size: 19px !important;
  font-style: normal !important;
  font-weight: 700 !important;
  color: var(--text) !important;        /* #f4eeff: ほぼ白 */
  line-height: 1.55 !important;
  margin: 0 0 28px !important;
  letter-spacing: 0.02em;
}

/* ── 2. タイプコードをより洗練させる ──────────────────────── */
.rcode {
  font-size: 11px !important;
  letter-spacing: 0.4em !important;
  color: var(--accent2) !important;
  margin-bottom: 4px !important;
  opacity: 0.8;
}

/* ── 3. タイプ名をわずかに大きく、余白を整える ────────────── */
.rname {
  font-size: 32px !important;
  letter-spacing: -0.01em;
  margin: 4px 0 10px !important;
}

/* ── 4. セクション見出しを整える ──────────────────────────── */
.sec h3 {
  font-size: 11px !important;
  letter-spacing: 0.14em !important;
  text-transform: uppercase;
  font-weight: 700 !important;
  margin-bottom: 10px !important;
  opacity: 0.85;
}

/* ── 5. セクションカードの内側パディングを統一 ────────────── */
.sec {
  padding: 20px 18px !important;
  margin-bottom: 12px !important;
}

/* ── 6. intro文（chars-desc.js）をより読みやすく ──────────── */
.desc-intro {
  font-size: 16px !important;
  line-height: 1.9 !important;
  color: var(--text) !important;
  margin: 0 0 20px !important;
}

/* ── 7. あるある箇条書きの行間を広げる ────────────────────── */
.desc-traits {
  line-height: 2.4 !important;
  font-size: 14px !important;
}

.desc-traits li {
  margin-bottom: 4px !important;
}

/* ── 8. ヒーローカード（マスコットエリア）のパディングを増やす */
.hero {
  padding: 32px 18px 28px !important;
  margin-bottom: 22px !important;
}

/* ── 9. スマホ420px以下の相性セクション余白を統一 ─────────── */
@media (max-width: 420px) {
  .match {
    gap: 10px !important;
  }
  .match .sec {
    margin-bottom: 0 !important;
  }
}

/* ── 10. CTAエリアの上部マージンを確保 ────────────────────── */
.cta {
  margin-top: 32px !important;
}

/* ── 11. bars（4軸スコア）を少し下げて視覚的順序を改善 ─────── */
/* ※ JS で動的に生成されるため、CSS の order では制御不可 */
/* 代わりに bars の見出しを整えて「参考情報」感を出す */
.bars {
  margin-top: 0 !important;
  margin-bottom: 28px !important;
  border-color: rgba(71,49,99,0.6) !important;   /* 少し透明にして存在感を下げる */
}

/* ── 12. レアリティの font-size を整数に統一 ─────────────── */
.rarity {
  font-size: 13px !important;
}

/* ── 13. キャッチコピーの前に装飾ライン（視覚的な見せ場） ─── */
.rcatch::before {
  content: "── ";
  color: var(--accent);
  opacity: 0.6;
}

.rcatch::after {
  content: " ──";
  color: var(--accent);
  opacity: 0.6;
}

/* ── 14. 結果ページ全体のフェードインを少し遅らせて「開封感」を演出 */
#result.active {
  animation: result-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) both !important;
}

@keyframes result-reveal {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.99);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
```

---

## 実装手順

```
1. 上記の CSS を lovechat-company/employee/09_ui-designer/output/lc16-result.css として保存
2. （実際の適用時）lc16-result.css を index.html と同じフォルダに配置
3. index.html の </head> 直前に以下を追加:
   <link rel="stylesheet" href="lc16-result.css">
4. ブラウザで診断→結果を確認
5. Visual Critic（10_visual-critic）にレビュー依頼
```

---

## Before / After 比較

| 要素 | Before | After |
|---|---|---|
| キャッチコピー | 15px italic 薄グレー | 19px bold 白 |
| タイプ名 | 30px | 32px |
| タイプコード | 13px | 11px (より小さく洗練) |
| セクション見出し | 14px | 11px uppercase |
| intro文 | 17px | 16px 行間1.9 |
| ヒーロー padding | 26px 18px 22px | 32px 18px 28px |
| 結果アニメーション | 0.35s ease | 0.5s cubic-bezier |

---

## 注意事項

- `!important` を使用しているのは既存のインラインスタイルを上書きするため
- JS で生成される `.bars` の順序変更は CSS では不可。構造変更は 07_dev-engineer に依頼
- `lc16-result.css` のリンク追加は index.html の 1行変更のみ。既存機能に影響なし
