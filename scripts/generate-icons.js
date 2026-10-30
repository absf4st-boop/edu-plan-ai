import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const toCrc = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function generatePng(width, height, isMaskable = false) {
  const header = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Scanlines with filter byte 0
  const scanlineLength = 1 + width * 4;
  const rawData = Buffer.alloc(scanlineLength * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = isMaskable ? width * 0.45 : width * 0.42;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // filter byte

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Base background: #0f172a (15, 23, 42)
      let r = 15;
      let g = 23;
      let b = 42;
      let a = 255;

      // Subtle gradient towards bottom right: #0284c7 (2, 132, 199)
      const gradFactor = (x + y) / (width + height);
      r = Math.round(r * (1 - gradFactor) + 2 * gradFactor);
      g = Math.round(g * (1 - gradFactor) + 132 * gradFactor);
      b = Math.round(b * (1 - gradFactor) + 199 * gradFactor);

      // Central symbol: Mortarboard diamond and book
      // Diamond: |dx| / (w*0.28) + |dy + h*0.08| / (h*0.14) <= 1
      const capNormX = Math.abs(dx) / (width * 0.30);
      const capNormY = Math.abs(dy + height * 0.12) / (height * 0.14);
      if (capNormX + capNormY <= 1.0) {
        // Bright cyan / blue: #38bdf8 (56, 189, 248)
        r = 56;
        g = 189;
        b = 248;
      }

      // Book block in lower center: dy between 0.05 and 0.35, |dx| <= w*0.26
      if (dy >= height * 0.02 && dy <= height * 0.32 && Math.abs(dx) <= width * 0.26) {
        // Book white / light slate: #f8fafc
        r = 248;
        g = 250;
        b = 252;

        // Center spine divider
        if (Math.abs(dx) <= width * 0.015) {
          r = 2;
          g = 132;
          b = 199;
        }
      }

      // Gold Sparkle stars
      const spark1Dist = Math.sqrt(Math.pow(x - width * 0.75, 2) + Math.pow(y - height * 0.25, 2));
      if (spark1Dist <= width * 0.05) {
        r = 250;
        g = 204;
        b = 21; // #facc15
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', deflated);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), generatePng(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), generatePng(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), generatePng(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generatePng(180, 180, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), generatePng(64, 64, false));

console.log('All PWA and touch icons generated successfully in /public!');
