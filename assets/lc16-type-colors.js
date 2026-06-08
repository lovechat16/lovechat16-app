/**
 * lc16-type-colors.js
 * 1. タイプ別アクセントカラーをCSS変数で設定（08_design-director仕様）
 * 2. Xシェアボタンのテキストをタイプ固有コピーに差し替え（02_result-copywriter仕様）
 *    ← これが+10000%リーチの最重要レバー
 */

/* ── タイプ別カラーマップ ──────────────────────── */
const LC16_TYPE_COLORS = {
  AFED:'#f43f5e', AFEP:'#fb7185', AFCD:'#7c3aed', AFCP:'#8b5cf6',
  ASED:'#be185d', ASEP:'#e879f9', ASCD:'#4338ca', ASCP:'#6d28d9',
  RFED:'#ec4899', RFEP:'#f472b6', RFCD:'#a855f7', RFCP:'#c084fc',
  RSED:'#9d174d', RSEP:'#fda4af', RSCD:'#3730a3', RSCP:'#818cf8',
};

/* ── タイプ別Xシェアテキスト（言い当て感最重視） ── */
const LC16_SHARE_TEXTS = {
  AFED: `ラブチャット16で診断したら「直感アタッカー型」だった。

「既読後3分でそわそわする」「盛り上がると句点なしで送り続ける」

言い当てられすぎて怖い。

あなたも #ラブチャット16`,

  AFEP: `「ノリよく沼らせ型」って診断された。

「気づいたらあなたがいないと会話が回らなくなってる」

自覚なかったけど確かにそれ……

#ラブチャット16`,

  AFCD: `恋愛メッセージ診断したら「静かな直球型」。

「引かなくていい、ドキっとさせてる全部褒め言葉」

これで救われた気がする。

#ラブチャット16`,

  AFCP: `「テンポ職人型」が出た。

「気づいたら会話の設計を全部自分でやっている」

これ、損してるのかな……って少し思う。

#ラブチャット16`,

  ASED: `「じっくり情熱型」が出た。

「返信遅いのに来た時の熱量が違う」って、完全に自分の話だった。

下書き3回書き直す民、仲間いる？

#ラブチャット16`,

  ASEP: `診断したら「マイペース甘え型」だって。

「コントロールしてるわけじゃなくて、ただ正直に生きてるだけ」

これが全部わかってもらえて満足。

#ラブチャット16`,

  ASCD: `「熟考カウンセラー型」が出た。

「相談は乗るのに自分のことはほとんど話さない、そうすると相手は私だけが開いてると思い始める」

刺さりすぎた。 #ラブチャット16`,

  ASCP: `「余白キープ型」だった。

「前のめりになるだけで相手の顔が変わる」

これ知ってたけど実行できてなかったやつ……

#ラブチャット16`,

  RFED: `「反応濃いめ共感型」が出た。

「一言だけ先に送ってみて、それだけで関係のバランスが変わる」

これずっと言えなかったけど今日試してみる。

#ラブチャット16`,

  RFEP: `「わちゃわちゃリアクション型」だって笑

「盛り上げ役が自分の役割だと、どこかで知っている」

知ってたよ……知ってたけど認めたくなかった。

#ラブチャット16`,

  RFCD: `「即レス誠実型」が出た。

「誠実さに好意のサインを一さじ足す、即レスできる時こそ自分から次の話題を」

即レスだけじゃ足りなかったんだ…… #ラブチャット16`,

  RFCP: `「省エネ即レス型」って出たんだけど

「返事はする人」って自覚あるし「そうなんだ」で終わるのわかってる

でも直せないやつが診断されるやつです

#ラブチャット16`,

  RSED: `「深海共感型」が出た。

「深夜に突然、核心をついた一言を送ってくる」

これやりがちで、それが良くも悪くも自分だな……と。

#ラブチャット16`,

  RSEP: `「気まぐれリアクター型」だって。

「スタンプ爆撃の日と返信なしの日が交互に来る」

完全に私じゃん……相手ごめん。

#ラブチャット16`,

  RSCD: `「慎重観察型」が出た。

「相手の絵文字量に自分の絵文字量を合わせる」

これ無意識にやってた……やっぱり観察してたんだ自分。

#ラブチャット16`,

  RSCP: `「既読温存型」だった。

「16タイプ中、最も自然消滅しやすいタイプ」

って書かれてて笑えなかった。

返信してない人いたらごめんなさい。 #ラブチャット16`,
};

/* ── 結果ページ検出 → カラー + シェアテキスト適用 ── */

function getTypeCode(resultEl) {
  const codeEl = resultEl.querySelector('.rcode');
  if (!codeEl) return null;
  return codeEl.textContent.trim().replace(/[^A-Z]/g, '').slice(0, 4) || null;
}

function applyTypeColor(resultEl, code) {
  const color = LC16_TYPE_COLORS[code];
  if (!color) return;
  resultEl.style.setProperty('--type-color', color);
  resultEl.style.setProperty('--type-color-dim', color + '55');
}

function upgradeXShareButton(resultEl, code) {
  const shareText = LC16_SHARE_TEXTS[code];
  if (!shareText) return;

  const url = location.href.split('#')[0];
  const buttons = resultEl.querySelectorAll('button');
  for (const btn of buttons) {
    if (btn.textContent.includes('𝕏') || btn.textContent.includes('テキストでシェア')) {
      btn.onclick = function() {
        const u = 'https://twitter.com/intent/tweet?text='
          + encodeURIComponent(shareText)
          + '&url=' + encodeURIComponent(url);
        window.open(u, '_blank');
      };
      break;
    }
  }
}

function onResultActive(resultEl) {
  const code = getTypeCode(resultEl);
  if (!code) return;
  applyTypeColor(resultEl, code);
  upgradeXShareButton(resultEl, code);
}

const resultEl = document.getElementById('result');
if (resultEl) {
  new MutationObserver(() => {
    if (resultEl.classList.contains('active') && resultEl.innerHTML.trim().length > 100) {
      setTimeout(() => onResultActive(resultEl), 50);
    }
  }).observe(resultEl, { attributes: true, childList: true });
}
