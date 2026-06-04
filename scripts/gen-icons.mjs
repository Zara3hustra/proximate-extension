import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ICONS_DIR = join(__dirname, '../extension/icons');

const STATES = {
  off:     { bg: '#1f2937', dot1: '#6b7280', dot2: '#4b5563', arrow: '#6b7280' },
  routed:  { bg: '#064e3b', dot1: '#10b981', dot2: '#34d399', arrow: '#10b981' },
  direct:  { bg: '#1e3a5f', dot1: '#3b82f6', dot2: '#60a5fa', arrow: '#3b82f6' },
  error:   { bg: '#450a0a', dot1: '#ef4444', dot2: '#f87171', arrow: '#ef4444' },
};

const SIZES = [16, 32, 48, 128];

function makeSvg(size, colors) {
  const c = size / 2;
  const r = size * 0.46;
  const stroke = Math.max(1, size * 0.04);

  // Dots: left and right
  const dotR = size * 0.12;
  const leftX  = size * 0.28;
  const rightX = size * 0.72;
  const y = c;

  // Arrow line
  const arrowStart = leftX + dotR + size * 0.04;
  const arrowEnd   = rightX - dotR - size * 0.04;
  const headSize   = size * 0.1;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r * 0.45}" fill="${colors.bg}"/>
  <circle cx="${leftX}" cy="${y}" r="${dotR}" fill="${colors.dot1}"/>
  <line x1="${arrowStart}" y1="${y}" x2="${arrowEnd}" y2="${y}"
    stroke="${colors.arrow}" stroke-width="${stroke}" stroke-linecap="round"/>
  <polyline points="${arrowEnd - headSize},${y - headSize * 0.7} ${arrowEnd},${y} ${arrowEnd - headSize},${y + headSize * 0.7}"
    fill="none" stroke="${colors.arrow}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="${rightX}" cy="${y}" r="${dotR}" fill="${colors.dot2}"/>
</svg>`;
}

for (const [state, colors] of Object.entries(STATES)) {
  for (const size of SIZES) {
    const svg = makeSvg(size, colors);
    const outPath = join(ICONS_DIR, `${state}-${size}.png`);
    await sharp(Buffer.from(svg)).resize(size, size).png().toFile(outPath);
    console.log(`✓ ${state}-${size}.png`);
  }
}

console.log('Done.');
