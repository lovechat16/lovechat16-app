# ビジュアルクリティックレポート
対象: lovechat-company/dashboard.html + dashboard.css
日時: 2026-06-08
担当: 10_visual-critic

---

## 総評
**A評価。**
ダークサイバーパンク × ラブチャット16 ピンク/パープルの融合は成立している。
CRT スキャンライン、ステータスアニメーション（グロー効果）、ピクセルフォントの方向性は正しい。
**小さな詰め込み感と視認性の問題**があるが、一部修正でSになれる。

---

## 問題点（優先度順）

### 🔴 CRITICAL（今すぐ直す）

#### 1. エージェントカードの情報密度が高すぎる
```css
/* 現在の agents-grid */
grid-template-columns: repeat(4, 1fr);
gap: 10px;
padding: 12px;
```
- 4カラム × 8エージェント = 各カードの幅が非常に狭い
- カード内に「ヘッダー・ステータス・タスク・プログレス・ラストログ」の5要素が入っている
- 横幅が足りず、テキストが `overflow:hidden` で切れる
- **修正案**: `grid-template-columns: repeat(4, 1fr)` → `repeat(auto-fill, minmax(200px, 1fr))` に変更。ウィンドウ幅に応じて2〜4カラムに自動調整

#### 2. `agent-last-log` が9pxで視認性が低い
```css
.agent-last-log { font-size: 9px; }
```
- 9px は多くのディスプレイで読めるギリギリのサイズ
- ダッシュボードの主要情報である「最後のログ」がこのサイズは矛盾している
- **修正案**: `font-size: 10px` に変更（1pxだが視認性が大きく変わる）

---

### 🟡 MAJOR（次の反復で直す）

#### 3. タスクパネル（右側）の `task-row-desc` が9pxで小さい
```css
.task-row-desc { font-size: 9px; }
```
- 右パネルはタスクの主要情報を表示するはずが、最重要テキストが9pxになっている
- **修正案**: `10px` に統一。右パネル全体のフォントサイズを最低10pxに引き上げる

#### 4. `status-badge` のテキストが9pxで薄い
```css
.status-badge { font-size: 9px; }
```
- ステータス（WORKING / REVIEWING 等）はカードの最重要情報
- 9px では一目で判断しにくい
- **修正案**: `10px` に統一

#### 5. ログフィードの `log-agent` が `min-width: 120px` で幅を取りすぎる
```css
.log-agent { min-width: 120px; }
```
- ログエリアが狭い（160px max-height）に対して `[Result Copywriter]` のような長い名前が120px固定で幅を使う
- 短い名前（CEO）でも120px取られるため、ログテキスト部分が窮屈
- **修正案**: `min-width` を `80px` に縮小するか、`flex-shrink: 1` で柔軟にする

#### 6. ログセクションの `max-height: 160px` が狭い
- 8エージェント × 複数ログ = 表示できる情報量が限られる
- `max-height: 160px` だと3〜4行しか見えない
- **修正案**: `max-height: 180px〜200px` に拡大

---

### 🟢 MINOR（余裕があれば）

#### 7. `.topbar-brand` の `brand-hearts` アニメーションは良い
- `♥♥♥` のパルスアニメーションはブランド感があって◯
- ただし `letter-spacing: -2px` で文字が重なっているため、`-1px` に調整すると見やすい

#### 8. `updated-badge` の文字が薄すぎる
```css
.updated-badge { color: var(--text-faint) }
```
- `--text-faint: #404060` は背景 `#0a0a0f` に対してコントラストが不足
- `--text-dim: #707090` に変更推奨

#### 9. `.floor::after` のデコレーションハートが少し邪魔
```css
.floor::after { content: '♥  ♡  ♥  ...'; opacity: 0.08 }
```
- 0.08 は薄くて気づかないレベル → 0.05 でほぼ不可視、0.12 では見えすぎ
- 削除するか、`opacity: 0.06` に下げて完全にテクスチャとして機能させる

#### 10. モバイル対応のブレークポイントが `900px` と `500px` の2段階のみ
- タブレット（768px前後）の表示が考慮されていない
- `768px` で2カラムになるブレークポイントを追加すると使いやすい

---

## SNS映え判定
- [x] スクリーンショットして「うちの会社これ」と言いたくなる → YES
- [ ] 一般ユーザーに見せられる美しさがあるか → まだワーキングプロトタイプ感

理由: 機能面は完成しているが「ゲーム会社の内部ダッシュボード」止まり。ラブチャット16ブランドとの融合をもう少し強化すると唯一無二の世界観になる。

---

## 09_ui-designer への指示

```
【優先度1】agents-grid のカラム設定を可変に変更:
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));

【優先度2】フォントサイズの最小値を10pxに統一:
  .agent-last-log { font-size: 10px; }
  .status-badge { font-size: 10px; }
  .task-row-desc { font-size: 10px; }
  .task-row-name { font-size: 11px; }

【優先度3】ログフィードの幅問題を修正:
  .log-agent { min-width: 80px; }
  .log-section { max-height: 190px; }

【優先度4】updated-badge のコントラスト改善:
  .updated-badge { color: var(--text-dim); }

【優先度5】768px ブレークポイントを追加:
  @media (max-width: 768px) {
    .agents-grid { grid-template-columns: repeat(2, 1fr); }
  }
```

---

## A → S にするための追加提案

現状はとても良い。以下を追加するとSになる：

1. **エージェントカードにタイプ別アクセントカラーを薄く入れる**
   - 各ステータスの色をカード左のボーダーだけでなく、カードの背景にも `opacity: 0.03` で滲ませる
   - より「生きている感」が出る

2. **working 状態のカードにキーボード入力風アニメーションを追加**
   - `::after` で点滅カーソルをカード下部に入れる
   - 「今まさに書いてる」感が強まる

3. **ダッシュボードタイトルにラブチャット16のハートモチーフを強調**
   - 現在の `♥♥♥` は小さい
   - タイトル部分を少し大きくして、ピンクのグローを追加
