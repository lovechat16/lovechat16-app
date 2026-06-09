# 実装 TODO リスト
作成日: 2026-06-08
担当: 07_dev-engineer
更新日: 2026-06-08

---

## 即時実装可能（外部URL不要）

### ✅ 完了済み
- [x] chars-desc.js 作成（16タイプ結果文章）
- [x] index.html に chars-desc.js 組み込み（結果ページにintro/traits/strength/caution表示）
- [x] partner.html に chars-desc.js 組み込み（相手の会話像 + あるある表示）
- [x] aishou.html に partner.html リンク追加（相性診断結果から相手診断へ）

### 🔄 実装可能だが後回し
- [ ] index.html: `og:url` メタタグ追加（公開ドメイン確定後）
- [ ] 全ページ: `<link rel="canonical">` タグ追加（公開ドメイン確定後）
- [ ] index.html: `twitter:site` に `@lovechat16` を追加（X開設後）

---

## 外部サービス設定後に実装

### LINE公式アカウント開設後
- [ ] index.html 結果ページCTAに「LINEで詳しく受け取る」ボタン追加
  ```html
  <a class="btn sub" href="https://lin.ee/[ID]" target="_blank" rel="noopener">
    🟢 LINEで詳しい結果を受け取る（無料）
  </a>
  ```
- [ ] partner.html 結果ページにも同様のLINEボタン追加
- [ ] aishou.html 結果ページにも追加

### note記事公開後
- [ ] index.html の「タイプ別・返信設計ガイドを見る →」ボタンのURLを差し替え
  ```javascript
  // 現状（変更前）
  onclick="alert('近日公開：ラブチャット16 返信設計ガイド')"
  
  // 変更後（noteURL確定後）
  onclick="window.open('https://note.com/[作者名]/n/[記事ID]','_blank')"
  ```
- [ ] partner.html の同様のボタンも差し替え

### アフィリエイト設定後
- [ ] chars.js の AFFILIATES 配列にアフィリエイトURLを設定
  ```javascript
  // 現状（変更前）
  { url: "https://例-アフィリエイトURLをここに", ... }
  
  // 変更後（実際のアフィリエイトURLに差し替え）
  { name: "Pairs", url: "https://[実際のアフィリエイトURL]", ... }
  ```

---

## 中長期実装（工数大）

### タイプ別動的note誘導CTA（優先度: 中）

診断結果のタイプコードを使って、ボタンのテキストを動的に変える。

```javascript
// index.html の renderResult 内に追加
const noteUrl = 'https://note.com/[...]/n/[記事ID]';
const noteLabel = `「${NAMES[code]}」への上手な返し方を読む →`;
// CTAボタンのテキストをタイプ名入りに更新
```

### OGP動的生成（優先度: 低）

URLパラメータでタイプコードを受け取り、タイプ別OGP画像を生成する。

- 実装コスト: 高（サーバーサイド or Canvaなどの画像生成API が必要）
- 代替案: 固定のOGP画像（assets/ogp.jpg）のままで拡散し、後から動的生成に移行

### SEO改善（優先度: 低）

```html
<!-- 全ページ共通で追加 -->
<link rel="canonical" href="https://[ドメイン]/[ページ名].html">
<meta property="og:url" content="https://[ドメイン]/[ページ名].html">
<meta name="twitter:site" content="@lovechat16">
```

---

## 公開環境セットアップ（ドメイン確定後）

- [ ] assets/ogp.jpg の絶対URLへの置換（全ページのog:imageタグ）
- [ ] GitHub Pages / Netlify / Vercel などでの公開設定
- [ ] カスタムドメインの設定
- [ ] HTTPS証明書の確認

---

## 動作確認チェックリスト（実装後に必ず確認）

- [ ] index.html: 診断 → 結果表示 → シェア画像生成が正常に動くか
- [ ] index.html: chars-desc.js が読み込まれ、結果文章が表示されるか
- [ ] partner.html: 相手診断 → 結果表示 → シェア画像生成が正常に動くか
- [ ] partner.html: chars-desc.js の「相手の会話像」「あるある」が表示されるか
- [ ] aishou.html: 相性診断 → 結果表示 → partner.html へのリンクが機能するか
- [ ] モバイル（iPhone Safari / Android Chrome）での表示確認
- [ ] OGP画像がSNSシェア時に表示されるか（OGP確認ツールで確認）
