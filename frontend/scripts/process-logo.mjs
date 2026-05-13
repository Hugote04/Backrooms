/**
 * Elimina el fondo negro del logo y genera:
 *  - public/logo.png        → PNG transparente (para usar en la app)
 *  - public/favicon-32.png  → 32×32 para favicon PNG
 *  - public/favicon-16.png  → 16×16
 *  - public/favicon.ico     → ICO 32×32 (raw RGBA → ICO)
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');
const input     = path.join(publicDir, 'logo-raw.jpeg');

// ── 1. Leer la imagen original ──────────────────────────────────────────────
const rawBuffer = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { data, info } = rawBuffer;
const { width, height, channels } = info;  // channels == 4 (RGBA)

// ── 2. Eliminar fondo negro: poner transparente cada píxel oscuro ───────────
//   Umbral: si R+G+B < 120 → transparente; el logo es blanco puro (255,255,255)
const pixels = new Uint8ClampedArray(data);
for (let i = 0; i < pixels.length; i += 4) {
  const r = pixels[i], g = pixels[i+1], b = pixels[i+2];
  const brightness = (r + g + b) / 3;
  if (brightness < 80) {
    pixels[i+3] = 0;   // alpha = 0 → transparente
  } else if (brightness < 160) {
    // zona de suavizado (antialiasing del logo)
    pixels[i+3] = Math.round((brightness - 80) / 80 * 255);
  }
}

// ── 3. Reconstruir imagen PNG transparente (tamaño original) ─────────────────
const logoPng = await sharp(Buffer.from(pixels.buffer), {
  raw: { width, height, channels: 4 }
}).png().toBuffer();

fs.writeFileSync(path.join(publicDir, 'logo.png'), logoPng);
console.log('✓ logo.png generado');

// ── 4. Versiones pequeñas para favicon ───────────────────────────────────────
const fav32 = await sharp(logoPng).resize(32, 32).png().toBuffer();
const fav16 = await sharp(logoPng).resize(16, 16).png().toBuffer();
fs.writeFileSync(path.join(publicDir, 'favicon-32.png'), fav32);
fs.writeFileSync(path.join(publicDir, 'favicon-16.png'), fav16);
console.log('✓ favicon-32.png y favicon-16.png generados');

// ── 5. Generar favicon.ico (formato ICO mínimo: 32×32 RGBA) ──────────────────
//   Estructura ICO: header + directory entry + imagen BMP/PNG incrustada
//   La forma más simple compatible es embeber el PNG directamente (ICO v2)
function buildIco(pngBuffer) {
  const ICO_HEADER  = Buffer.alloc(6);   // ICONDIR
  ICO_HEADER.writeUInt16LE(0, 0);        // reserved
  ICO_HEADER.writeUInt16LE(1, 2);        // type: 1 = ICO
  ICO_HEADER.writeUInt16LE(1, 4);        // count: 1 imagen

  const ICO_ENTRY = Buffer.alloc(16);    // ICONDIRENTRY
  ICO_ENTRY.writeUInt8(32, 0);           // width  (0 = 256)
  ICO_ENTRY.writeUInt8(32, 1);           // height
  ICO_ENTRY.writeUInt8(0,  2);           // color count (0 = sin paleta)
  ICO_ENTRY.writeUInt8(0,  3);           // reserved
  ICO_ENTRY.writeUInt16LE(1, 4);         // planes
  ICO_ENTRY.writeUInt16LE(32, 6);        // bit count
  ICO_ENTRY.writeUInt32LE(pngBuffer.length, 8);  // bytes in image
  ICO_ENTRY.writeUInt32LE(22, 12);       // offset: 6 + 16 = 22

  return Buffer.concat([ICO_HEADER, ICO_ENTRY, pngBuffer]);
}

fs.writeFileSync(path.join(publicDir, 'favicon.ico'), buildIco(fav32));
console.log('✓ favicon.ico generado');
console.log('\n¡Listo! Archivos en frontend/public/');
