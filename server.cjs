'use strict';

const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs/promises');

const root = path.join(__dirname, 'public');
const port = Number(process.env.PORT || 3000);
const host = '127.0.0.1';
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2'
};

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('PORT must be an integer between 1 and 65535.');
  process.exit(1);
}

const server = http.createServer(async (req, res) => {
  const reply = (status, message) => {
    res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(req.method === 'HEAD' ? undefined : message);
  };
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return reply(405, 'Method Not Allowed');
  }

  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname.includes('\0') || pathname.includes('\\')) return reply(400, 'Bad Request');
    let filename = path.resolve(root, '.' + pathname);
    if (filename !== root && !filename.startsWith(root + path.sep)) return reply(403, 'Forbidden');
    let stats = await fs.stat(filename);
    if (stats.isDirectory()) filename = path.join(filename, 'index.html');
    // Also prevent symlinks from exposing files outside the public directory.
    filename = await fs.realpath(filename);
    if (!filename.startsWith(root + path.sep)) return reply(403, 'Forbidden');
    stats = await fs.stat(filename);
    if (!stats.isFile()) return reply(404, 'Not Found');
    const content = req.method === 'HEAD' ? undefined : await fs.readFile(filename);
    res.writeHead(200, {
      'Content-Type': types[path.extname(filename).toLowerCase()] || 'application/octet-stream',
      'Content-Length': stats.size,
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    });
    res.end(content);
  } catch (error) {
    if (error instanceof URIError || error.code === 'ERR_INVALID_URL') return reply(400, 'Bad Request');
    if (['ENOENT', 'ENOTDIR', 'EISDIR'].includes(error.code)) return reply(404, 'Not Found');
    console.error(error.message);
    reply(500, 'Internal Server Error');
  }
});

server.on('error', error => {
  console.error(error.code === 'EADDRINUSE'
    ? `Port ${port} is in use. Try PORT=3001 npm start.`
    : `Server error: ${error.message}`);
  process.exitCode = 1;
});
server.listen(port, host, () => {
  console.log(`Local: http://localhost:${port}`);
  console.log('Press Ctrl+C to stop.');
});
