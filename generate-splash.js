const sharp = require('sharp');
const fs = require('fs');

const sizes = [
    { width: 2048, height: 2732, name: 'apple-splash-2048.png' }, // iPad Pro 12.9"
    { width: 1668, height: 2388, name: 'apple-splash-1668.png' }, // iPad Pro 11"
    { width: 1536, height: 2048, name: 'apple-splash-1536.png' }, // iPad Mini, Air
    { width: 1242, height: 2688, name: 'apple-splash-1242.png' }, // iPhone XS Max
    { width: 1125, height: 2436, name: 'apple-splash-1125.png' }, // iPhone X/XS
    { width: 1334, height: 1334, name: 'apple-splash-1334.png' }, // iPhone 6/7/8
    { width: 2436, height: 1125, name: 'apple-splash-2436.png' }, // iPhone X landscape
    { width: 2688, height: 1242, name: 'apple-splash-2688.png' }, // iPhone XS Max landscape
    { width: 1792, height: 828, name: 'apple-splash-1792.png' }   // iPhone XR/11
];

async function generateSplashScreens() {
    if (!fs.existsSync('./splash')) {
        fs.mkdirSync('./splash');
    }

    for (const size of sizes) {
        const svgBackground = `
            <svg width="${size.width}" height="${size.height}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#4f46e5;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grad)"/>
            </svg>
        `;

        const logoSize = Math.min(size.width, size.height) * 0.3;
        const logoX = (size.width - logoSize) / 2;
        const logoY = (size.height - logoSize) / 2;

        await sharp(Buffer.from(svgBackground))
            .composite([
                {
                    input: 'icon-512.png',
                    top: Math.round(logoY),
                    left: Math.round(logoX),
                    width: Math.round(logoSize),
                    height: Math.round(logoSize)
                }
            ])
            .png()
            .toFile(`./splash/${size.name}`);
        
        console.log(`✅ Generata: ${size.name}`);
    }
}

generateSplashScreens().catch(console.error);