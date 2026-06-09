// ラブチャット16 開発サーバー
// 診断サイト + Company Dashboard を1ポートで配信
const http    = require('http');
const fs      = require('fs');
const path    = require('path');
const { fork } = require('child_process');

const PORT = 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'text/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.md':   'text/plain; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
};

// URL redirects: /dashboard → /lovechat-company/dashboard.html
// (redirect preserves relative path resolution in the browser)
const REDIRECTS = {
  '/dashboard': '/lovechat-company/dashboard.html',
  '/company':   '/lovechat-company/dashboard.html',
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);

  // Redirect shortcuts
  if (REDIRECTS[urlPath]) {
    res.writeHead(302, { 'Location': REDIRECTS[urlPath] });
    return res.end();
  }

  // Default to index.html
  if (urlPath === '/' || urlPath === '') urlPath = '/index.html';

  const file = path.join(ROOT, urlPath);

  // Path traversal guard
  if (!file.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found: ' + urlPath);
    }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });

}).listen(PORT, () => {
  console.log('');
  console.log('  ♥ ラブチャット16 Dev Server');
  console.log('  ─────────────────────────────────');
  console.log('  診断サイト  → http://localhost:' + PORT + '/');
  console.log('  相手診断    → http://localhost:' + PORT + '/partner.html');
  console.log('  相性診断    → http://localhost:' + PORT + '/aishou.html');
  console.log('  ダッシュボード → http://localhost:' + PORT + '/dashboard');
  console.log('  ─────────────────────────────────');
  console.log('');

  // auto-watcher を子プロセスで起動
  const watcherPath = path.join(__dirname, 'lovechat-company', 'scripts', 'auto-watcher.js');
  if (fs.existsSync(watcherPath)) {
    const watcher = fork(watcherPath, [], { silent: false });
    watcher.on('error', err => console.error('[watcher] error:', err.message));
    watcher.on('exit',  code => { if (code !== 0) console.warn('[watcher] 終了 code:', code); });
  }
});
