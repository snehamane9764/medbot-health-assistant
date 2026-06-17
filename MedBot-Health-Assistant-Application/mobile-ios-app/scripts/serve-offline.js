const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const root = path.resolve(process.argv[2] || 'dist');
const port = Number(process.argv[3] || 4173);
const host = process.argv[4] || '127.0.0.1';

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.map': 'application/json; charset=utf-8',
};

function send(res, file) {
  fs.readFile(file, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    res.writeHead(200, {
      'Content-Type': types[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  });
}

http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  const pathname = decodeURIComponent(url.pathname);
  const requested = path.join(root, pathname);
  const safe = requested.startsWith(root) ? requested : root;

  fs.stat(safe, (error, stats) => {
    if (!error && stats.isFile()) {
      send(res, safe);
      return;
    }

    send(res, path.join(root, 'index.html'));
  });
}).listen(port, host, () => {
  console.log(`MedBot offline web build: http://${host}:${port}`);
  console.log(`Serving: ${root}`);

  if (host === '0.0.0.0') {
    const addresses = Object.values(os.networkInterfaces())
      .flat()
      .filter((item) => item && item.family === 'IPv4' && !item.internal)
      .map((item) => item.address);

    addresses.forEach((address) => {
      console.log(`Open on phone: http://${address}:${port}`);
    });
  }
});
