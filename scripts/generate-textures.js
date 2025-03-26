const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const TEXTURE_SIZE = 512;
const OUTPUT_DIR = path.join(__dirname, '../public/textures');

// Ensure the output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Create road texture
function createRoadTexture() {
  const canvas = createCanvas(TEXTURE_SIZE, TEXTURE_SIZE);
  const ctx = canvas.getContext('2d');

  // Background (dark asphalt)
  ctx.fillStyle = '#333333';
  ctx.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);

  // Road lines
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 4;

  // Dashed center line
  ctx.beginPath();
  ctx.setLineDash([20, 10]);
  ctx.moveTo(TEXTURE_SIZE / 2, 0);
  ctx.lineTo(TEXTURE_SIZE / 2, TEXTURE_SIZE);
  ctx.stroke();

  // Add some asphalt texture/noise
  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * TEXTURE_SIZE;
    const y = Math.random() * TEXTURE_SIZE;
    const size = Math.random() * 2 + 0.5;
    const color = Math.floor(Math.random() * 40 + 30);
    ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
    ctx.fillRect(x, y, size, size);
  }

  // Save the texture
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'road.jpg'), buffer);
  console.log('Road texture created at', path.join(OUTPUT_DIR, 'road.jpg'));
}

// Create sand texture
function createSandTexture() {
  const canvas = createCanvas(TEXTURE_SIZE, TEXTURE_SIZE);
  const ctx = canvas.getContext('2d');

  // Base sand color
  ctx.fillStyle = '#f5d7a3';
  ctx.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);

  // Add sand grains and variations
  for (let i = 0; i < 10000; i++) {
    const x = Math.random() * TEXTURE_SIZE;
    const y = Math.random() * TEXTURE_SIZE;
    const size = Math.random() * 3 + 0.5;

    // Vary the color slightly for realism
    const r = Math.floor(Math.random() * 20 + 235);
    const g = Math.floor(Math.random() * 20 + 200);
    const b = Math.floor(Math.random() * 20 + 150);

    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.4)`;
    ctx.fillRect(x, y, size, size);
  }

  // Save the texture
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'sand.jpg'), buffer);
  console.log('Sand texture created at', path.join(OUTPUT_DIR, 'sand.jpg'));
}

// Generate textures
createRoadTexture();
createSandTexture();

console.log('Texture generation complete!');
