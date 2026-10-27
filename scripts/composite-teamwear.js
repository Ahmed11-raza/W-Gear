const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processKits() {
  const cricketSrc = 'C:/Users/WALI/.gemini/antigravity/brain/1c463819-64ba-49a3-8807-4da0fc13b5f4/teamwear_cricket_kit_1792959743879.jpg';
  const footballSrc = 'C:/Users/WALI/.gemini/antigravity/brain/1c463819-64ba-49a3-8807-4da0fc13b5f4/teamwear_football_kit_1792959768508.jpg';
  const workoutSrc = 'C:/Users/WALI/.gemini/antigravity/brain/1c463819-64ba-49a3-8807-4da0fc13b5f4/teamwear_workout_wear_1792959967201.jpg';

  const logoWhitePath = path.resolve('public/images/logo/w-gear-white.png');

  // Load logo and prepare sizes
  const logoWhite = await sharp(logoWhitePath).toBuffer();

  // Create an authentic silicone athletic chest badge (Volt and White)
  const createChestBadge = async (width = 180) => {
    return sharp(logoWhite)
      .resize({ width })
      .toBuffer();
  };

  // Create a sleek W-GEAR main chest sponsor bar (for football jersey)
  const createChestBanner = async (width = 380, height = 85) => {
    const resizedLogo = await sharp(logoWhite)
      .resize({ width: 220, height: 55, fit: 'inside' })
      .toBuffer();
    const bannerSvg = Buffer.from(`
      <svg width="${width}" height="${height}">
        <rect width="${width}" height="${height}" rx="6" fill="#0b1b3d" fill-opacity="0.95" />
        <rect width="${width}" height="${height}" rx="6" stroke="#C4F319" stroke-width="2" fill="none" />
      </svg>
    `);
    
    return sharp(bannerSvg)
      .composite([{ input: resizedLogo, gravity: 'center' }])
      .png()
      .toBuffer();
  };

  // Create an authentic bottom hem authenticity tag (W-GEAR SIALKOT ATELIER)
  const createAuthenticTag = (sportName) => {
    const svg = `
      <svg width="240" height="48">
        <rect width="240" height="48" rx="4" fill="#141618" fill-opacity="0.92" />
        <rect width="240" height="48" rx="4" stroke="rgba(196,243,25,0.4)" stroke-width="1.5" fill="none" />
        <circle cx="20" cy="24" r="6" fill="#C4F319" />
        <text x="36" y="20" font-family="monospace" font-size="11" font-weight="bold" fill="#C4F319" letter-spacing="1.5">W-GEAR TEAMWEAR</text>
        <text x="36" y="34" font-family="monospace" font-size="9" fill="rgba(255,255,255,0.7)" letter-spacing="1">SIALKOT // ${sportName.toUpperCase()} 01</text>
      </svg>
    `;
    return Buffer.from(svg);
  };

  // 1. Cricket Kit
  const cricketBadge = await createChestBadge(150);
  const cricketTag = createAuthenticTag('CRICKET');
  
  await sharp(cricketSrc)
    .composite([
      // Right chest W-GEAR logo
      { input: cricketBadge, top: 410, left: 240 },
      // Top left authentic badge watermark
      { input: cricketTag, top: 40, left: 40 }
    ])
    .jpeg({ quality: 92 })
    .toFile('public/images/teamwear/cricket.jpg');
  console.log('✓ Cricket kit composited');

  // 2. Football Kit
  const footballBanner = await createChestBanner(380, 80);
  const footballCrest = await createChestBadge(120);
  const footballTag = createAuthenticTag('MATCH FOOTBALL');

  await sharp(footballSrc)
    .composite([
      // Main chest banner covering previous text
      { input: footballBanner, top: 375, left: 258 },
      // Top chest crest
      { input: footballCrest, top: 290, left: 480 },
      // Top left authentic tag
      { input: footballTag, top: 40, left: 40 }
    ])
    .jpeg({ quality: 92 })
    .toFile('public/images/teamwear/football.jpg');
  console.log('✓ Football kit composited');

  // 3. Workout Wear
  const workoutBadge = await createChestBadge(140);
  const workoutTag = createAuthenticTag('WORKOUT // TRAINING');

  await sharp(workoutSrc)
    .composite([
      // Upper chest / sleeve area W-GEAR badge
      { input: workoutBadge, top: 240, left: 378 },
      // Authentic tag
      { input: workoutTag, top: 40, left: 40 }
    ])
    .jpeg({ quality: 92 })
    .toFile('public/images/teamwear/workout.jpg');
  console.log('✓ Workout wear composited');
}

processKits().catch(err => {
  console.error('Error compositing kits:', err);
  process.exit(1);
});
