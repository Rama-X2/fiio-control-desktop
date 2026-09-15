const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.bin': 'application/octet-stream',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

class LocalServer {
  constructor(options = {}) {
    this.port = options.port || 41789;
    this.rootDir = options.rootDir || path.join(__dirname, '..', 'web_offline');
    this.presetsDir = options.presetsDir || path.join(__dirname, '..', 'presets');
    this.server = null;
    this.currentDevice = 'Scanning...';
    this.activePreset = 'Default';
    this.eqEnabled = true;
    this.globalGain = 0;
  }

  start() {
    return new Promise((resolve, reject) => {
      this.server = http.createServer((req, res) => this.handleRequest(req, res));
      this.server.listen(this.port, '127.0.0.1', () => {
        console.log(`[LocalServer] Offline FiiO Control server running on http://127.0.0.1:${this.port}`);
        resolve(this.port);
      });
      this.server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.warn(`[LocalServer] Port ${this.port} in use, trying next port...`);
          this.port += 1;
          this.server.listen(this.port, '127.0.0.1');
        } else {
          reject(err);
        }
      });
    });
  }

  stop() {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
  }

  handleRequest(req, res) {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // API Routes for offline preset management & device synchronization
    if (pathname === '/api/presets' && req.method === 'GET') {
      return this.handleGetPresets(req, res);
    }
    if (pathname === '/api/presets/save' && req.method === 'POST') {
      return this.handleSavePreset(req, res);
    }
    if (pathname === '/api/device/state') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({
        device: this.currentDevice,
        preset: this.activePreset,
        eqEnabled: this.eqEnabled,
        globalGain: this.globalGain
      }));
    }

    // Default route
    if (pathname === '/index.html') {
      res.writeHead(302, { 'Location': '/' });
      return res.end();
    }
    if (pathname === '/' || pathname === '') {
      pathname = '/index.html';
    }

    // Resolve local file path
    let filePath = path.join(this.rootDir, pathname.replace(/^\//, ''));

    // Check if file exists, fallback to index.html for SPA client-side routes (e.g. /equalizer/custom, /welcome)
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      if (pathname.startsWith('/static/') || pathname.endsWith('.png') || pathname.endsWith('.js') || pathname.endsWith('.css')) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('File not found: ' + pathname);
      }
      filePath = path.join(this.rootDir, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('Error loading file');
      }
      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      });
      res.end(content);
    });
  }

  handleGetPresets(req, res) {
    try {
      if (!fs.existsSync(this.presetsDir)) {
        fs.mkdirSync(this.presetsDir, { recursive: true });
      }
      const files = fs.readdirSync(this.presetsDir).filter(f => f.endsWith('.json'));
      const presets = [];
      for (const file of files) {
        if (file === 'presets_index.json') continue;
        try {
          const raw = fs.readFileSync(path.join(this.presetsDir, file), 'utf-8');
          const data = JSON.parse(raw);
          presets.push({
            id: path.basename(file, '.json'),
            name: data.name || path.basename(file, '.json'),
            description: data.description || '',
            globalGain: data.globalGain !== undefined ? data.globalGain : 0,
            bands: data.bands || []
          });
        } catch (e) {}
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(presets));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
  }

  handleSavePreset(req, res) {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (!data.name) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Preset name is required' }));
        }
        const safeName = data.name.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().replace(/\s+/g, '_').toLowerCase();
        const filePath = path.join(this.presetsDir, `${safeName}.json`);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, id: safeName, message: `Preset saved as ${safeName}.json` }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  }
}

module.exports = LocalServer;
