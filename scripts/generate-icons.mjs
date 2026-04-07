import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '..', 'public');

function svgToPng(svgPath, outPath, width, height) {
  const svg = readFileSync(svgPath, 'utf-8');
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
  });
  const pngData = resvg.render();
  writeFileSync(outPath, pngData.asPng());
  console.log(`Created ${outPath.split(/[\\/]/).pop()} (${width}x${height || width})`);
}

// App icons
svgToPng(resolve(publicDir, 'icon.svg'), resolve(publicDir, 'icon-192.png'), 192, 192);
svgToPng(resolve(publicDir, 'icon.svg'), resolve(publicDir, 'icon-512.png'), 512, 512);
svgToPng(resolve(publicDir, 'icon.svg'), resolve(publicDir, 'apple-touch-icon.png'), 180, 180);

// OG image (1200x630)
svgToPng(resolve(publicDir, 'og.svg'), resolve(publicDir, 'og.png'), 1200, 630);

console.log('All icons generated.');
