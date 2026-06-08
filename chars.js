/* ===== ラブチャット16 共有：キャラ表示系（index.html / partner.html 共通） =====
   NAMES（型名）/ CATCH（キャッチ）/ CHAR（キャラ名・絵文字・配色）/ EAR / mascot（SVG）/
   charVisual・画像ローダー。イラストは assets/chars/<キャラ名>.png を優先表示し、無ければSVG。 */
const NAMES = {
  AFED:"直感アタッカー型",AFEP:"ノリよく沼らせ型",AFCD:"静かな直球型",AFCP:"テンポ職人型",
  ASED:"じっくり情熱型",ASEP:"マイペース甘え型",ASCD:"熟考カウンセラー型",ASCP:"余白キープ型",
  RFED:"反応濃いめ共感型",RFEP:"わちゃわちゃリアクション型",RFCD:"即レス誠実型",RFCP:"省エネ即レス型",
  RSED:"深海共感型",RSEP:"気まぐれリアクター型",RSCD:"慎重観察型",RSCP:"既読温存型"
};

const CATCH = {
  AFED:"思ったら即送信。感情をのせて深く踏み込む、攻めの会話。",
  AFEP:"テンションとノリで距離を詰める、楽しい空気の作り手。",
  AFCD:"感情は抑えめ。でも核心を、自分からまっすぐ。",
  AFCP:"ラリーは途切れさせない。心地よい間の設計者。",
  ASED:"遅いけど、一通が重い。言葉で心を動かす。",
  ASEP:"のんびり、たまに甘える。隙のある可愛げ。",
  ASCD:"落ち着いて深掘り。相手が本音を話したくなる聞き役。",
  ASCP:"詰めない、追わせる派。余裕のある距離感。",
  RFED:"即レスで全力共感。話していて気持ちいい聞き上手。",
  RFEP:"ノリには全力で乗る。会話が弾むムードメーカー。",
  RFCD:"速くて誠実、でも受け身。安定感で信頼される。",
  RFCP:"速いけど短い。プレッシャーを与えず緩く繋がる。",
  RSED:"遅いけど深く受け止める。言葉が刺さる聞き手。",
  RSEP:"気が向いた時に全力。自然体で飾らない。",
  RSCD:"じっくり見て、慎重に返す。言葉に信頼が宿る。",
  RSCP:"のんびり、重くならない派。最も自然消滅しやすい注意タイプ。"
};

/* 16タイプのキャラクター（名前・サイン絵文字・体の配色） */
const CHAR = {
  AFED:{name:"アタッキュン", emoji:"🔥", c1:"#ff8aa0", c2:"#ff4d6d"}, // 熱血忍者うさぎ
  AFEP:{name:"ノリぴょん",  emoji:"😆", c1:"#ffc06b", c2:"#ff8fab"}, // LOVEキャップのうさぎ
  AFCD:{name:"しずワン",    emoji:"💌", c1:"#8fb8ff", c2:"#6b8bff"}, // ラブレターを持つプードル
  AFCP:{name:"テンポッター", emoji:"🏓", c1:"#caa17a", c2:"#a8784f"}, // テンポを刻むカワウソDJ
  ASED:{name:"じくハリー",  emoji:"❤️", c1:"#ffab85", c2:"#ff6a88"}, // ハートを抱くハリネズミ
  ASEP:{name:"あまぐま",    emoji:"🍮", c1:"#bfe6cf", c2:"#9fd0c0"}, // 雲で眠るくま
  ASCD:{name:"ふくロン",    emoji:"📖", c1:"#a8baff", c2:"#7d8fe0"}, // メガネのふくろう博士
  ASCP:{name:"よはクス",    emoji:"🌙", c1:"#cfe2f2", c2:"#9fb6d6"}, // マフラーの白ぎつね
  RFED:{name:"きょうモフ",  emoji:"🥹", c1:"#ffaecd", c2:"#ff7aa8"}, // うるうる共感うさぎ
  RFEP:{name:"わちゃワン",  emoji:"🎉", c1:"#ffd96b", c2:"#ff9a76"}, // はしゃぐ柴
  RFCD:{name:"そくワン",    emoji:"📨", c1:"#9fd6ff", c2:"#5fb0f0"}, // スマホを持つ誠実な子犬
  RFCP:{name:"省エネモン",    emoji:"⚡", c1:"#aacbe6", c2:"#7fa6cc"}, // パーカーのナマケモノ
  RSED:{name:"ふかメル",    emoji:"🌊", c1:"#7fb6e6", c2:"#4a7fc0"}, // 水晶玉の深海人魚
  RSEP:{name:"きまニャン",  emoji:"🍃", c1:"#c4b4e0", c2:"#9a86c0"}, // 黒猫パーカーの気まぐれ
  RSCD:{name:"みまモウル",  emoji:"🔍", c1:"#aab8cc", c2:"#7689a8"}, // 虫めがねの探偵ふくろう
  RSCP:{name:"きどニャン",  emoji:"🌫️", c1:"#bcb6c8", c2:"#928ca8"}  // フードの既読温存ねこ
};

/* 各タイプの動物モチーフ（耳の形に反映。リファレンスの動物像に対応） */
const EAR = {
  AFED:"bunny", AFEP:"bunny", AFCD:"dog", AFCP:"cat", ASED:"round", ASEP:"round", ASCD:"owl", ASCP:"cat",
  RFED:"bunny", RFEP:"dog", RFCD:"round", RFCP:"round", RSED:"round", RSEP:"cat", RSCD:"owl", RSCP:"cat"
};

/* ===== レア度（希少性）＝シェアの動機 =====
   設計ベースの推定出現率（合計100）。localStorageの実データとブレンドして安定表示。
   将来サーバ集計の母数に差し替えれば「実際の出現率」になる（rarityFor の K と tally を置換）。 */
const BASELINE = { AFED:7,AFEP:8,AFCD:5,AFCP:6,ASED:5,ASEP:7,ASCD:4,ASCP:6,RFED:9,RFEP:8,RFCD:6,RFCP:7,RSED:4,RSEP:6,RSCD:5,RSCP:7 };
function rarityFor(code, tally){
  tally = tally || {};
  const K = 600; // 仮想サンプル数（推定を安定させる重み）
  const pcts = {}; let total = K;
  for(const c in NAMES) total += (tally[c]||0);
  for(const c in NAMES) pcts[c] = ((BASELINE[c]/100*K) + (tally[c]||0)) / total * 100;
  const pct = pcts[code];
  const oneIn = Math.max(2, Math.round(100/pct));
  let top = 0; for(const c in NAMES) if(pcts[c] <= pct) top += pcts[c]; // 上位X%（自分以下のレア度合計）
  let stars, label;
  if(pct<4.5){stars=5;label='激レア';}
  else if(pct<5.5){stars=4;label='レア';}
  else if(pct<6.5){stars=3;label='ややレア';}
  else if(pct<7.5){stars=2;label='定番';}
  else {stars=1;label='王道タイプ';}
  return { pct:Math.round(pct*10)/10, oneIn, stars, label, top:Math.max(1,Math.round(top)),
    starStr:'★★★★★☆☆☆☆☆'.slice(5-stars,10-stars) };
}

/* かわいいマスコットSVG（画像が無いときのフォールバック）。
   大きな潤んだ目・丸い体・肉球・ほっぺ。動物ごとに耳の形を変える。 */
function mascot(code, size){
  size = size || 132;
  const ch = CHAR[code], id = 'grad_'+code, e = EAR[code];
  // 体（頭の後ろ→下に丸い体と肉球）
  const body = `<ellipse cx="66" cy="128" rx="33" ry="21" fill="url(#${id})"/>
    <circle cx="50" cy="141" r="8" fill="url(#${id})"/><circle cx="82" cy="141" r="8" fill="url(#${id})"/>
    <ellipse cx="50" cy="141" rx="3.4" ry="2.6" fill="#fff" opacity=".5"/><ellipse cx="82" cy="141" rx="3.4" ry="2.6" fill="#fff" opacity=".5"/>`;
  // 耳（動物別）
  let ears;
  if(e==='bunny') ears = `<g fill="url(#${id})"><ellipse cx="51" cy="24" rx="9" ry="23" transform="rotate(-13 51 24)"/><ellipse cx="81" cy="24" rx="9" ry="23" transform="rotate(13 81 24)"/></g>
    <g fill="#ffe1ec" opacity=".75"><ellipse cx="51" cy="26" rx="4" ry="15" transform="rotate(-13 51 26)"/><ellipse cx="81" cy="26" rx="4" ry="15" transform="rotate(13 81 26)"/></g>`;
  else if(e==='cat') ears = `<path d="M39 46 L41 16 L63 38 Z" fill="url(#${id})"/><path d="M93 46 L91 16 L69 38 Z" fill="url(#${id})"/>
    <path d="M45 42 L46 26 L58 39 Z" fill="#ffe1ec" opacity=".75"/><path d="M87 42 L86 26 L74 39 Z" fill="#ffe1ec" opacity=".75"/>`;
  else if(e==='dog') ears = `<ellipse cx="34" cy="58" rx="13" ry="24" fill="url(#${id})" transform="rotate(8 34 58)"/><ellipse cx="98" cy="58" rx="13" ry="24" fill="url(#${id})" transform="rotate(-8 98 58)"/>`;
  else if(e==='owl') ears = `<path d="M43 34 L38 14 L57 30 Z" fill="url(#${id})"/><path d="M89 34 L94 14 L75 30 Z" fill="url(#${id})"/>`;
  else ears = `<circle cx="43" cy="36" r="13" fill="url(#${id})"/><circle cx="89" cy="36" r="13" fill="url(#${id})"/>`; // round
  // 大きな潤んだ目（ハイライト2つ）
  const eyes = `<g>
    <ellipse cx="50" cy="72" rx="11.5" ry="13.5" fill="#41304f"/><ellipse cx="82" cy="72" rx="11.5" ry="13.5" fill="#41304f"/>
    <circle cx="54" cy="67" r="4.6" fill="#fff"/><circle cx="86" cy="67" r="4.6" fill="#fff"/>
    <circle cx="46.5" cy="77" r="2.3" fill="#fff" opacity=".85"/><circle cx="78.5" cy="77" r="2.3" fill="#fff" opacity=".85"/></g>`;
  const blush = `<ellipse cx="38" cy="84" rx="7.5" ry="5" fill="#ff8fb0" opacity=".55"/><ellipse cx="94" cy="84" rx="7.5" ry="5" fill="#ff8fb0" opacity=".55"/>`;
  const mouth = `<path d="M60 88 q6 6 12 0" fill="none" stroke="#a85a78" stroke-width="3.4" stroke-linecap="round"/>`;
  return `<svg viewBox="0 0 132 156" width="${size}" height="${Math.round(size*156/132)}" role="img" aria-label="${ch.name}">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${ch.c1}"/><stop offset="1" stop-color="${ch.c2}"/></linearGradient></defs>
    ${body}
    ${ears}
    <ellipse cx="66" cy="76" rx="47" ry="45" fill="url(#${id})"/>
    <ellipse cx="50" cy="58" rx="18" ry="12" fill="#fff" opacity=".22"/>
    ${blush}${eyes}${mouth}
    <circle cx="103" cy="34" r="15" fill="#fff" opacity=".9"/>
    <text x="103" y="41" font-size="18" text-anchor="middle">${ch.emoji}</text>
  </svg>`;
}

/* キャラ表示：実イラスト(assets/chars/<キャラ名>.png 等)があればそれを、無ければSVGを表示。 */
const CHAR_IMG_EXT = ['png','webp','jpg','svg'];
const CHAR_IMG_CACHE = {}; // code -> 解決済みURL | 'none'（再探索を防ぐ）
function charVisual(code, size){
  return `<span class="cv" data-code="${code}" data-size="${size}" style="display:inline-block;width:${size}px">${mascot(code,size)}</span>`;
}
function applyCharImg(el, code, size, url){
  const img = new Image();
  img.width=size; img.height=size; img.alt=CHAR[code].name;
  img.style.cssText='width:'+size+'px;height:'+size+'px;object-fit:contain;border-radius:18px';
  img.src = url; el.dataset.done='1'; el.innerHTML=''; el.appendChild(img);
}
function upgradeCharVisuals(root){
  (root||document).querySelectorAll('.cv').forEach(el=>{
    if(el.dataset.done) return;
    const code = el.dataset.code, size = +el.dataset.size;
    const cached = CHAR_IMG_CACHE[code];
    if(cached==='none') return;                 // 既に全滅確認済み → SVGのまま
    if(cached){ applyCharImg(el, code, size, cached); return; } // 既知のURLを即適用
    let i = 0;
    const tryNext = ()=>{
      if(i >= CHAR_IMG_EXT.length){ CHAR_IMG_CACHE[code]='none'; return; }
      const url = 'assets/chars/'+encodeURIComponent(CHAR[code].name)+'.'+CHAR_IMG_EXT[i];
      const img = new Image();
      img.onload = ()=>{ CHAR_IMG_CACHE[code]=url; applyCharImg(el, code, size, url); };
      img.onerror = ()=>{ i++; tryNext(); };
      img.src = url;
    };
    tryNext();
  });
}

/* ===== シェア画像（縦型カードをcanvasで生成） =====
   バズの主レバー：キャラ＋型＋強度バー＋キャッチを1枚のかわいい画像に。
   同一オリジン画像なのでcanvasは汚染されず toBlob 可能（CSPはcanvas/blobを妨げない）。 */
function loadCharImage(code){
  return new Promise(res=>{
    const img = new Image();
    img.onload = ()=>res(img); img.onerror = ()=>res(null);
    img.src = 'assets/chars/'+encodeURIComponent(CHAR[code].name)+'.png';
  });
}
function _wrapText(ctx, text, maxW){
  const lines=[]; let line='';
  for(const chr of text){ if(ctx.measureText(line+chr).width>maxW && line){ lines.push(line); line=chr; } else line+=chr; }
  if(line) lines.push(line); return lines;
}
async function renderShareCanvas(code, opts){
  opts = opts || {};
  const W=1080, H=1350, JP='"Hiragino Kaku Gothic ProN","Yu Gothic",Meiryo,sans-serif';
  const c=document.createElement('canvas'); c.width=W; c.height=H;
  const x=c.getContext('2d'); x.textAlign='center';
  function rr(px,py,pw,ph,r){x.beginPath();x.moveTo(px+r,py);x.arcTo(px+pw,py,px+pw,py+ph,r);x.arcTo(px+pw,py+ph,px,py+ph,r);x.arcTo(px,py+ph,px,py,r);x.arcTo(px,py,px+pw,py,r);x.closePath();}
  // 背景
  let g=x.createLinearGradient(0,0,W,H); g.addColorStop(0,'#1a1130'); g.addColorStop(1,'#2b1645'); x.fillStyle=g; x.fillRect(0,0,W,H);
  let rg=x.createRadialGradient(W/2,150,0,W/2,150,560); rg.addColorStop(0,'rgba(255,93,143,.28)'); rg.addColorStop(1,'rgba(255,93,143,0)'); x.fillStyle=rg; x.fillRect(0,0,W,H);
  // タイトル
  x.fillStyle='#a06bff'; x.font='600 30px '+JP; x.fillText('LOVECHAT 16 ｜ 恋愛メッセージ診断', W/2, 78);
  // キャラ画像
  const ch=CHAR[code], img=await loadCharImage(code);
  const isz=420, ix=(W-isz)/2, iy=110;
  x.fillStyle='rgba(255,255,255,.10)'; rr(ix-12,iy-12,isz+24,isz+24,46); x.fill();
  if(img){ x.save(); rr(ix,iy,isz,isz,38); x.clip();
    const ar=img.width/img.height; let dw=isz,dh=isz,dx=ix,dy=iy;
    if(ar>=1){ dh=isz; dw=isz*ar; dx=ix-(dw-isz)/2; } else { dw=isz; dh=isz/ar; dy=iy-(dh-isz)/2; }
    x.drawImage(img,dx,dy,dw,dh); x.restore();
  }
  // コード／キャラ名／型名／キャッチ
  x.fillStyle='#a06bff'; x.font='700 34px '+JP; x.fillText(code.split('').join('  '), W/2, iy+isz+66);
  x.fillStyle='#ff5d8f'; x.font='800 40px '+JP; x.fillText((opts.charLabel||'会話キャラ：')+ch.name+' '+ch.emoji, W/2, iy+isz+120);
  x.fillStyle='#f4eeff'; x.font='800 68px '+JP; x.fillText(NAMES[code], W/2, iy+isz+196);
  x.fillStyle='#b6a8d6'; x.font='400 30px '+JP;
  const catchLines=_wrapText(x, opts.catch||'', W-200);
  catchLines.slice(0,2).forEach((ln,i)=>x.fillText(ln, W/2, iy+isz+246+i*40));
  // レア度
  if(opts.rarity){ x.fillStyle='#ffd36b'; x.font='800 31px '+JP; x.fillText(opts.rarity, W/2, iy+isz+304); }
  // 強度バー
  const pad=90, bw=W-2*pad; let by=iy+isz+342;
  (opts.bars||[]).forEach((b,i)=>{
    const y=by+i*92;
    x.textAlign='left';  x.font='700 30px '+JP; x.fillStyle=b.aWin?'#ff5d8f':'#9b8fc0'; x.fillText(b.left, pad, y);
    x.textAlign='right'; x.fillStyle=b.aWin?'#9b8fc0':'#ff5d8f'; x.fillText(b.right, W-pad, y);
    x.textAlign='left';
    x.fillStyle='rgba(255,255,255,.08)'; rr(pad,y+18,bw,18,9); x.fill();
    const fw=Math.max(bw*b.aShare/100,18); let fg=x.createLinearGradient(pad,0,pad+bw,0); fg.addColorStop(0,'#ff5d8f'); fg.addColorStop(1,'#a06bff'); x.fillStyle=fg; rr(pad,y+18,fw,18,9); x.fill();
  });
  // フッター
  x.textAlign='center'; x.fillStyle='#f4eeff'; x.font='800 34px '+JP; x.fillText(opts.footer||'あなたの恋愛メッセージは？ #ラブチャット16', W/2, H-54);
  return c;
}
/* ===== アフィリエイト枠（PR明示・スクリプトなし・差し替え可能） =====
   ※広告ネットワークのタグは使わない（CSP connect-src 'none' とプライバシー保証を守るため、
     単なるリンクのみ）。url に各サービスのアフィリエイトURLを入れる。複数あればランダム表示。
     ブランド整合を考え、出会い系よりマッチングアプリ系の方が無難（差し替え自由）。 */
const AFFILIATES = [
  { name:"ハッピーメール", catch:"出会いの“母数”を増やすなら", desc:"国内最大級・登録無料。会えない悩みは、まず相手探しから。", url:"https://例-アフィリエイトURLをここに", cta:"無料登録を見る" }
  // 例（ブランド適合が高い候補）:
  // { name:"Pairs", catch:"まじめな出会いを増やすなら", desc:"会員数No.1のマッチングアプリ。", url:"https://...", cta:"無料で始める" }
];
function adCard(){
  if(!Array.isArray(AFFILIATES) || !AFFILIATES.length) return '';
  const a = AFFILIATES[Math.floor(Math.random()*AFFILIATES.length)];
  if(!a || !a.url || a.url.indexOf('http')!==0) return ''; // URL未設定なら出さない
  return `<a class="adcard" href="${a.url}" target="_blank" rel="sponsored noopener noreferrer">
    <span class="adtag">広告</span>
    <span class="adbody"><b>${a.catch}</b><span class="adname">${a.name}</span><span class="addesc">${a.desc}</span></span>
    <span class="adcta">${a.cta} →</span>
  </a>`;
}
/* 広告カードのCSSを一度だけ注入（style-src 'unsafe-inline' で許可される） */
(function injectAdCss(){
  try{
  if(typeof document==='undefined' || typeof document.createElement!=='function' || document.getElementById('lc16-ad-css')) return;
  const s=document.createElement('style'); s.id='lc16-ad-css';
  s.textContent='.adcard{display:flex;align-items:center;gap:12px;text-decoration:none;color:var(--text,#f4eeff);background:rgba(255,255,255,.04);border:1px dashed var(--line,#473163);border-radius:14px;padding:15px 14px;margin:14px 0;position:relative}'
    +'.adcard:hover{border-color:var(--accent2,#a06bff)}'
    +'.adtag{position:absolute;top:-9px;left:12px;font-size:10px;letter-spacing:.08em;color:#cbbfe0;background:#3a2c4a;border:1px solid var(--line,#473163);border-radius:6px;padding:1px 8px}'
    +'.adcard .adbody{flex:1;min-width:0}'
    +'.adcard .adbody b{display:block;font-size:14px;font-weight:800}'
    +'.adcard .adname{font-size:12px;color:var(--accent,#ff5d8f);font-weight:700}'
    +'.adcard .addesc{display:block;margin-top:3px;font-size:12px;color:var(--muted,#b6a8d6)}'
    +'.adcard .adcta{flex:0 0 auto;font-size:12px;font-weight:800;color:var(--accent2,#a06bff)}';
  (document.head||document.documentElement).appendChild(s);
  }catch(e){/* 非DOM環境では何もしない */}
})();

/* ===== 相性（任意の2タイプ） =====
   軸ルール：主導権A/R=補完が吉、テンポF/S=一致が吉、温度E/C=補完が安定、深さD/P=一致が吉。
   既存の導出◎（AR反転/FS同/EC反転/DP同）が最高点、△が最低付近になるよう配点。 */
function compatInfo(a,b){
  let s=0; const goods=[], cautions=[];
  if(a[0]!==b[0]){ s+=30; goods.push('片方が引っ張り、片方が受ける理想のバランス'); }
  else if(a[0]==='A'){ s+=18; cautions.push('二人とも自分から動くタイプ。主導権がぶつかることも'); }
  else { s+=8; cautions.push('二人とも受け身で、会話が止まりやすい'); }
  if(a[1]===b[1]){ s+=25; goods.push('返信テンポが似ていて心地よい'); }
  else { s+=8; cautions.push('返信テンポのズレで温度差が出やすい'); }
  if(a[2]!==b[2]){ s+=22; goods.push('感情と冷静さでバランスが取れる'); }
  else if(a[2]==='E'){ s+=16; cautions.push('感情豊か同士で盛り上がるが、燃え尽きに注意'); }
  else { s+=14; cautions.push('クール同士で安定だが、温度が上がりにくい'); }
  if(a[3]===b[3]){ s+=23; goods.push('話の深さ・ノリの好みが合う'); }
  else { s+=7; cautions.push('「重い／軽い」のすれ違いが起きやすい'); }
  let label, emoji;
  if(s>=85){label='運命級の相性';emoji='💞';}
  else if(s>=70){label='相性◎';emoji='😊';}
  else if(s>=55){label='なかなか良い';emoji='🙂';}
  else if(s>=42){label='すれ違い注意';emoji='⚠️';}
  else {label='試練の相性';emoji='🌧️';}
  return { score:s, label, emoji, goods, cautions };
}
/* 2キャラ相性のシェア画像 */
async function renderCompatCanvas(a,b,info){
  const W=1080,H=1080,JP='"Hiragino Kaku Gothic ProN","Yu Gothic",Meiryo,sans-serif';
  const c=document.createElement('canvas'); c.width=W;c.height=H; const x=c.getContext('2d'); x.textAlign='center';
  function rr(px,py,pw,ph,r){x.beginPath();x.moveTo(px+r,py);x.arcTo(px+pw,py,px+pw,py+ph,r);x.arcTo(px+pw,py+ph,px,py+ph,r);x.arcTo(px,py+ph,px,py,r);x.arcTo(px,py,px+pw,py,r);x.closePath();}
  function frame(img,fx,fy,s){ x.fillStyle='rgba(255,255,255,.10)';rr(fx-8,fy-8,s+16,s+16,34);x.fill(); if(img){x.save();rr(fx,fy,s,s,28);x.clip();const ar=img.width/img.height;let dw=s,dh=s,dx=fx,dy=fy;if(ar>=1){dh=s;dw=s*ar;dx=fx-(dw-s)/2;}else{dw=s;dh=s/ar;dy=fy-(dh-s)/2;}x.drawImage(img,dx,dy,dw,dh);x.restore();} }
  let g=x.createLinearGradient(0,0,W,H); g.addColorStop(0,'#1a1130'); g.addColorStop(1,'#2b1645'); x.fillStyle=g; x.fillRect(0,0,W,H);
  let rg=x.createRadialGradient(W/2,150,0,W/2,150,560); rg.addColorStop(0,'rgba(255,93,143,.26)'); rg.addColorStop(1,'rgba(255,93,143,0)'); x.fillStyle=rg; x.fillRect(0,0,W,H);
  x.fillStyle='#a06bff'; x.font='700 30px '+JP; x.fillText('LOVECHAT 16 ｜ 相性診断', W/2, 78);
  const [ia,ib]=await Promise.all([loadCharImage(a),loadCharImage(b)]);
  const isz=336, y=140, lx=110, rx=W-110-isz;
  frame(ia,lx,y,isz); frame(ib,rx,y,isz);
  x.fillStyle='#f4eeff'; x.font='800 36px '+JP; x.fillText(CHAR[a].name, lx+isz/2, y+isz+52); x.fillText(CHAR[b].name, rx+isz/2, y+isz+52);
  x.fillStyle='#b6a8d6'; x.font='400 24px '+JP; x.fillText(NAMES[a], lx+isz/2, y+isz+88); x.fillText(NAMES[b], rx+isz/2, y+isz+88);
  x.font='96px '+JP; x.fillText(info.emoji, W/2, y+isz/2+14);
  x.fillStyle='#ff5d8f'; x.font='800 92px '+JP; x.fillText(info.score+'%', W/2, y+isz+186);
  x.fillStyle='#ffd36b'; x.font='800 50px '+JP; x.fillText(info.label, W/2, y+isz+250);
  x.fillStyle='#5de0a8'; x.font='700 28px '+JP; if(info.goods[0]) x.fillText('◎ '+info.goods[0], W/2, y+isz+312);
  x.fillStyle='#ffb86b'; if(info.cautions[0]) x.fillText('△ '+info.cautions[0], W/2, y+isz+356);
  x.fillStyle='#f4eeff'; x.font='800 32px '+JP; x.fillText('あなたの相性は？ #ラブチャット16', W/2, H-48);
  return c;
}
function _shareCanvas(canvas, shareText){
  canvas.toBlob(blob=>{
    if(!blob){ alert('画像の生成に失敗しました'); return; }
    const file=new File([blob],'lovechat16.png',{type:'image/png'});
    if(navigator.canShare && navigator.canShare({files:[file]})){ navigator.share({files:[file],text:shareText}).catch(()=>{}); }
    else { const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='lovechat16.png'; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),4000);
      try{ window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent(shareText),'_blank'); }catch(e){} }
  }, 'image/png');
}
async function shareCompatImage(a,b,info,shareText){
  let canvas; try{ canvas=await renderCompatCanvas(a,b,info); }catch(e){ alert('画像の生成に失敗しました'); return; }
  _shareCanvas(canvas, shareText);
}

/* canvas→保存/シェア（モバイルは画像つきWeb Share、不可ならPNGダウンロード＋X intent） */
async function shareResultImage(code, opts, shareText){
  let canvas;
  try{ canvas = await renderShareCanvas(code, opts); }
  catch(e){ alert('画像の生成に失敗しました'); return; }
  canvas.toBlob(blob=>{
    if(!blob){ alert('画像の生成に失敗しました'); return; }
    const file = new File([blob], 'lovechat16.png', {type:'image/png'});
    if(navigator.canShare && navigator.canShare({files:[file]})){
      navigator.share({ files:[file], text: shareText }).catch(()=>{});
    } else {
      const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='lovechat16.png'; a.click();
      setTimeout(()=>URL.revokeObjectURL(a.href), 4000);
      // PC向け：画像を保存させつつ、X投稿文を開く
      try{ window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent(shareText), '_blank'); }catch(e){}
    }
  }, 'image/png');
}
