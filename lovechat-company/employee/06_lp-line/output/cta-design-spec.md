# 結果ページCTA設計仕様書
作成日: 2026-06-08
担当: 06_lp-line
実装依頼先: 07_dev-engineer

---

## 設計方針

CTAは最大3グループ（シェア・関係深化・収益化）。押し付けず、体験の流れの中に置く。

```
結果ページの流れ
  ↓ タイプ診断結果（ヒーロー・あるある・強み・アドバイス）
  ↓ ①シェアCTA（拡散）
  ↓ ②相手診断・相性へのリンク（関係深化）
  ↓ ③note誘導 / LINE登録（収益化・将来）
  ↓ もう一度診断する
```

---

## index.html 結果ページ CTA実装仕様

### 現状の構成（変更不要なもの）
```html
<button class="btn" onclick="shareImage()">📸 結果画像を保存してシェア</button>
<button class="btn sub" onclick="shareX(...)">𝕏 にテキストでシェア</button>
<button class="btn sub" onclick="copyShare(...)">結果をコピー</button>
<button class="btn sub" onclick="location.href='partner.html'">相手の返信タイプも診断する →</button>
```

### 変更案：「タイプ別・返信設計ガイドを見る →」ボタン

**現状**: `alert('近日公開：ラブチャット16 返信設計ガイド')`
**変更後**: note URLが決まり次第、下記に差し替える

```html
<!-- note URL確定後にこのコメントを差し替える -->
<button class="btn sub" onclick="window.open('https://note.com/[作者名]/n/[記事ID]','_blank')">
  📖 タイプ別・返信設計ガイドを読む（note）
</button>
```

**コピー（ボタン文言）案**:
- `「${typeNameVar}」への上手な返し方 → note で読む` （タイプ名を動的に入れるとクリック率が上がる）
- `あなたのタイプ、もっと詳しく知りたい？ →`

### 追加推奨CTA：LINE登録ボタン（LINE公式アカウント開設後）

```html
<a class="btn sub" href="https://lin.ee/[アカウントID]" target="_blank" rel="noopener">
  🟢 LINEで詳しい結果を受け取る（無料）
</a>
```

設置位置: シェアボタン群の後、partner.html リンクの前

---

## partner.html 結果ページ CTA実装仕様

### 現状の構成（変更不要なもの）
```html
<button class="btn" onclick="sharePartnerImage()">📸 結果画像を保存してシェア</button>
<button class="btn sub" onclick="alert('近日公開...')">タイプ別・返信設計ガイドを見る →</button>
<button class="btn sub" onclick="location.href='index.html'">自分のメッセージタイプも診断する →</button>
<button class="btn sub" onclick="resetAll()">別の相手をもう一度診断する</button>
```

### 変更案（partner.html は「相手へのアクション」が目的）

```html
<!-- 相手の返信タイプを把握した次の一手として自然に誘導 -->
<button class="btn sub" onclick="window.open('https://note.com/[...]/n/[相手タイプ別記事]','_blank')">
  📖 この相手タイプへの返し方を詳しく読む →
</button>
```

---

## LINE公式アカウント配信設計

### ステップ配信（開設後に設定）

| 送信タイミング | 内容 | 目的 |
|---|---|---|
| 登録直後 | 「ようこそ！あなたのタイプは…」+ 1行アドバイス | 最初の体験価値 |
| 3日後 | 「相手のタイプ、知ってみませんか？」+ partner.htmlへのURL | 関係強化 |
| 7日後 | 「あなたと相性のいいタイプ」の紹介 | 相性診断への誘導 |
| 14日後 | 「返信設計ガイド、先行公開します」+ note URL | 有料コンテンツへ |

### 定期配信（週1回・毎週火曜）

```
件名: ラブチャット16 ｜ 今週の恋愛ヒント

[タイプ別一言アドバイス]

今週は「○○タイプ」に送りやすい一手を紹介します。

→ 今すぐ試す: [診断URL]
```

---

## 実装の優先順位

| 優先度 | 実装内容 | 条件 |
|---|---|---|
| 即時実装可 | partner.html に「自分の診断→」ボタン目立つ配置 | 実装完了（既存あり） |
| noteURL確定後 | 「返信設計ガイドを読む」ボタンのURLを差し替え | note記事公開後 |
| LINE開設後 | 「LINEで詳しく受け取る」ボタンを追加 | LINE公式アカウント開設後 |
| 中長期 | タイプ別動的note誘導（typeNameをボタンテキストに埋める） | 07_dev-engineerへ依頼 |
