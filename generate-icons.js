const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_IMAGE = './public/favicon.png';
const OUTPUT_DIR = './public';
const APP_DIR = './app';

const ICON_SIZES = [
  { size: 16, name: 'icon-16x16.png' },
  { size: 32, name: 'icon-32x32.png' },
  { size: 48, name: 'icon-48x48.png' },
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' },
];

async function generateIcons() {
  // Check if source image exists
  if (!fs.existsSync(SOURCE_IMAGE)) {
    console.error(`Source image not found: ${SOURCE_IMAGE}`);
    process.exit(1);
  }

  console.log(`Generating icons from ${SOURCE_IMAGE}...`);

  // Generate all icon sizes for public folder
  for (const { size, name } of ICON_SIZES) {
    const outputPath = path.join(OUTPUT_DIR, name);
    await sharp(SOURCE_IMAGE)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 33, b: 71, alpha: 1 } // #002147
      })
      .png()
      .toFile(outputPath);
    console.log(`✓ Generated ${name} (${size}x${size})`);
  }

  // Generate icon.png for app folder (32x32 - browser tab)
  await sharp(SOURCE_IMAGE)
    .resize(32, 32, {
      fit: 'contain',
      background: { r: 0, g: 33, b: 71, alpha: 1 }
    })
    .png()
    .toFile(path.join(APP_DIR, 'icon.png'));
  console.log('✓ Generated app/icon.png (32x32)');

  // Generate apple-icon.png for app folder (180x180)
  await sharp(SOURCE_IMAGE)
    .resize(180, 180, {
      fit: 'contain',
      background: { r: 0, g: 33, b: 71, alpha: 1 }
    })
    .png()
    .toFile(path.join(APP_DIR, 'apple-icon.png'));
  console.log('✓ Generated app/apple-icon.png (180x180)');

  console.log('\n✅ All icons generated successfully!');
}

generateIcons().catch(console.error);
