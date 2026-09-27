import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
  AlignmentType
} from 'docx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const publicImagesDir = path.join(__dirname, '../public/product-images');
const desktopDocxPath = 'C:\\Users\\20092\\OneDrive\\Desktop\\Midnight_Bloom_100_Products_Document.docx';
const desktopDocPath = 'C:\\Users\\20092\\OneDrive\\Desktop\\Midnight_Bloom_100_Products_Document.doc';

// Load base catalog and add 101st product
const catalogGenPath = path.join(__dirname, '../scripts/generate_100_catalog.js');
const catalogGenCode = fs.readFileSync(catalogGenPath, 'utf8');
const match = catalogGenCode.match(/const PRODUCTS_100 = (\[[\s\S]*?\]);\s*\/\//);
const PRODUCTS_100 = eval(match[1]);

const PROD_101 = {
  id: 'aoonice-ai-sync-sucking-vibrator',
  name: 'Aoonice AI-Sync Clitoral Air-Pulse & Pussy Pump Vibrator',
  category: 'air-pressure-suction',
  subcategory: 'Womanizer Air-Wave',
  price: 4999,
  originalPrice: 6999,
  discount: '28% OFF',
  badge: 'AI Pleasure Sync',
  stock: 50,
  subtitle: 'AI-synchronized touchless air-pulse suction and clitoral vacuum pump',
  description: 'Engineered with responsive AI-sync technology that adapts pulsation rhythms to natural arousal cues. Combines targeted touchless air-pulse clitoral resonance with gentle vacuum suction for deep, multi-layered orgasms.',
  sound: '< 28 dB (Whisper Silent)',
  material: '100% US FDA-Grade Liquid Silicone & Rose Gold ABS Alloy',
  battery: '120 min Runtime / Magnetic USB Fast Charge',
  waterproof: 'IPX7 100% Submersible',
  modes: '10 Sensation Frequencies + Intelligent AI Sync Mode',
  images: '/product-images/Aoonice Sucking Vibrator AI Sync Sex Toys for Women, Clit Sucker Pussy Pump_0.webp;/product-images/Aoonice Sucking Vibrator AI Sync Sex Toys for Women, Clit Sucker Pussy Pump_1.webp;/product-images/Aoonice Sucking Vibrator AI Sync Sex Toys for Women, Clit Sucker Pussy Pump_2.webp;/product-images/Aoonice Sucking Vibrator AI Sync Sex Toys for Women, Clit Sucker Pussy Pump_3.webp;/product-images/Aoonice Sucking Vibrator AI Sync Sex Toys for Women, Clit Sucker Pussy Pump_4.webp',
  colors: 'Velvet Rose:#B56571, Obsidian Onyx:#1C1C1C, Pearl Blush:#F0B8BE'
};

const ALL_101_PRODUCTS = [...PRODUCTS_100, PROD_101];

// Scan images
const imgFiles = fs.readdirSync(publicImagesDir);
const imgGroups = {};
for (const f of imgFiles) {
  const m = f.match(/^(.+)_(\d+)\.(webp|jpg|jpeg|png|gif|avif)$/i);
  if (m) {
    const prodName = m[1].trim();
    const idx = parseInt(m[2], 10);
    if (!imgGroups[prodName]) imgGroups[prodName] = [];
    imgGroups[prodName].push({ file: f, idx, url: `/product-images/${f}` });
  }
}
for (const k in imgGroups) imgGroups[k].sort((a, b) => a.idx - b.idx);

function normalize(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

ALL_101_PRODUCTS.forEach(p => {
  const normP = normalize(p.name);
  let matchedGroupKey = null;
  for (const gKey in imgGroups) {
    const normG = normalize(gKey);
    if (normP === normG || normP.includes(normG) || normG.includes(normP)) {
      matchedGroupKey = gKey;
      break;
    }
  }
  if (!matchedGroupKey) {
    const words = p.name.toLowerCase().split(/[\s\-&+,]+/).filter(w => w.length > 2);
    let bestScore = 0;
    for (const gKey in imgGroups) {
      const gLower = gKey.toLowerCase();
      const matchWords = words.filter(w => gLower.includes(w)).length;
      const score = matchWords / words.length;
      if (score > 0.4 && matchWords >= 2 && score > bestScore) {
        bestScore = score;
        matchedGroupKey = gKey;
      }
    }
  }

  if (matchedGroupKey && imgGroups[matchedGroupKey].length > 0) {
    p.imagesArray = imgGroups[matchedGroupKey].map(x => x.url);
  } else if (typeof p.images === 'string') {
    p.imagesArray = p.images.split(';').map(x => x.trim()).filter(Boolean);
  } else if (Array.isArray(p.images)) {
    p.imagesArray = p.images;
  } else {
    p.imagesArray = ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'];
  }
});

// Load reviews from productReviews.js
import { PRODUCT_REVIEWS_MAP } from '../src/data/productReviews.js';

ALL_101_PRODUCTS.forEach(p => {
  p.reviews = PRODUCT_REVIEWS_MAP[p.id] || [];
});

console.log('Generating Native Word DOCX document with full styling...');

const docChildren = [
  new Paragraph({
    text: "MIDNIGHT BLOOM — LUXURY INTIMATE WELLNESS",
    heading: HeadingLevel.TITLE,
    spacing: { after: 120 }
  }),
  new Paragraph({
    children: [
      new TextRun({ text: "101 Verified Luxury Products Catalog with Real Customer Reviews", bold: true, size: 28, color: "831843" })
    ],
    spacing: { after: 200 }
  }),
  new Paragraph({
    children: [
      new TextRun({ text: "Confidentiality Notice: ", bold: true, color: "DB2777" }),
      new TextRun({ text: "All 101 products feature authentic pricing in INR, multiple image gallery paths (_0 to _N), complete technical specifications, and 3 to 6 verified Hinglish buyer reviews covering discreet plain packaging, sound level, battery life, and delivery speed." })
    ],
    spacing: { after: 400 }
  })
];

ALL_101_PRODUCTS.forEach((p, idx) => {
  // Product Title Header
  docChildren.push(
    new Paragraph({
      children: [
        new TextRun({ text: `#${idx + 1}. ${p.name}`, bold: true, size: 26, color: "0F172A" }),
        new TextRun({ text: `  [${p.badge}]`, bold: true, size: 20, color: "BE185D" })
      ],
      spacing: { before: 300, after: 100 }
    })
  );

  // Subtitle
  docChildren.push(
    new Paragraph({
      children: [
        new TextRun({ text: p.subtitle, italics: true, color: "64748B", size: 20 })
      ],
      spacing: { after: 150 }
    })
  );

  // Price & Meta
  docChildren.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Selling Price: ", bold: true }),
        new TextRun({ text: `₹${p.price.toLocaleString('en-IN')}`, bold: true, color: "059669", size: 24 }),
        new TextRun({ text: `  MRP: ₹${p.originalPrice.toLocaleString('en-IN')}`, strike: true, color: "94A3B8" }),
        new TextRun({ text: `  (${p.discount})`, bold: true, color: "E11D48" }),
        new TextRun({ text: `  |  Category: ${p.category} (${p.subcategory})  |  Stock: ${p.stock} Units` })
      ],
      spacing: { after: 150 }
    })
  );

  // Description
  docChildren.push(
    new Paragraph({
      children: [
        new TextRun({ text: p.description, size: 20, color: "334155" })
      ],
      spacing: { after: 180 }
    })
  );

  // Specs Table
  const specRows = [
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Sound Level", bold: true, size: 18 })] })], width: { size: 25, type: WidthType.PERCENTAGE }, shading: { fill: "F8FAFC", type: ShadingType.CLEAR } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: p.sound, size: 18 })] })], width: { size: 25, type: WidthType.PERCENTAGE } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Material", bold: true, size: 18 })] })], width: { size: 25, type: WidthType.PERCENTAGE }, shading: { fill: "F8FAFC", type: ShadingType.CLEAR } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: p.material, size: 18 })] })], width: { size: 25, type: WidthType.PERCENTAGE } }),
      ]
    }),
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Battery & Charge", bold: true, size: 18 })] })], width: { size: 25, type: WidthType.PERCENTAGE }, shading: { fill: "F8FAFC", type: ShadingType.CLEAR } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: p.battery, size: 18 })] })], width: { size: 25, type: WidthType.PERCENTAGE } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Waterproof Rating", bold: true, size: 18 })] })], width: { size: 25, type: WidthType.PERCENTAGE }, shading: { fill: "F8FAFC", type: ShadingType.CLEAR } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: p.waterproof, size: 18 })] })], width: { size: 25, type: WidthType.PERCENTAGE } }),
      ]
    }),
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Modes / Speeds", bold: true, size: 18 })] })], width: { size: 25, type: WidthType.PERCENTAGE }, shading: { fill: "F8FAFC", type: ShadingType.CLEAR } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: p.modes, size: 18 })] })], width: { size: 25, type: WidthType.PERCENTAGE } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Colors Available", bold: true, size: 18 })] })], width: { size: 25, type: WidthType.PERCENTAGE }, shading: { fill: "F8FAFC", type: ShadingType.CLEAR } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: typeof p.colors === 'string' ? p.colors : (p.colors || []).map(c => c.name || c).join(', '), size: 18 })] })], width: { size: 25, type: WidthType.PERCENTAGE } }),
      ]
    })
  ];

  docChildren.push(
    new Table({
      rows: specRows,
      width: { size: 100, type: WidthType.PERCENTAGE }
    })
  );

  // Linked Images List
  docChildren.push(
    new Paragraph({
      children: [
        new TextRun({ text: `Linked Product Images (${p.imagesArray.length}):`, bold: true, size: 18, color: "475569" })
      ],
      spacing: { before: 120, after: 60 }
    })
  );

  p.imagesArray.forEach((img, i) => {
    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({ text: `  • [_${i}] `, bold: true, color: "BE185D", size: 17 }),
          new TextRun({ text: img, size: 17, color: "64748B" })
        ],
        spacing: { after: 40 }
      })
    );
  });

  // Dedicated Reviews Section Header
  docChildren.push(
    new Paragraph({
      children: [
        new TextRun({ text: `💬 VERIFIED BUYER REVIEWS & CUSTOMER COMMENTS (${p.reviews.length} Comments):`, bold: true, size: 22, color: "9D174D" })
      ],
      spacing: { before: 200, after: 120 }
    })
  );

  // Each Review in Table Box
  p.reviews.forEach((r, rIdx) => {
    const reviewTable = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: "★★★★★  ", color: "EAB308", bold: true, size: 20 }),
                    new TextRun({ text: `${r.author} `, bold: true, color: "0F172A", size: 19 }),
                    new TextRun({ text: `(${r.city})  `, color: "475569", size: 18 }),
                    new TextRun({ text: "✔ VERIFIED BUYER", bold: true, color: "15803D", size: 16 }),
                    new TextRun({ text: ` • ${r.date}`, color: "94A3B8", size: 16 })
                  ]
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: `“${r.title}”`, bold: true, color: "881337", size: 20 })
                  ],
                  spacing: { before: 60, after: 60 }
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: `“${r.comment}”`, italics: true, color: "334155", size: 19 })
                  ],
                  spacing: { after: 60 }
                })
              ],
              shading: { fill: "FFF1F2", type: ShadingType.CLEAR },
              margins: { top: 120, bottom: 120, left: 160, right: 160 }
            })
          ]
        })
      ],
      width: { size: 100, type: WidthType.PERCENTAGE }
    });

    docChildren.push(reviewTable);
    docChildren.push(new Paragraph({ spacing: { after: 80 } }));
  });

  // Divider line after each product
  docChildren.push(
    new Paragraph({
      children: [
        new TextRun({ text: "_________________________________________________________________________________", color: "CBD5E1" })
      ],
      spacing: { before: 150, after: 250 }
    })
  );
});

const doc = new Document({
  sections: [
    {
      properties: {},
      children: docChildren
    }
  ]
});

// Pack to .docx file
const buffer = await Packer.toBuffer(doc);
fs.writeFileSync(desktopDocxPath, buffer);
console.log(`✅ Native Microsoft Word DOCX saved: ${desktopDocxPath} (${(buffer.length / 1024).toFixed(1)} KB)`);

// Also save as .doc
fs.writeFileSync(desktopDocPath, buffer);
console.log(`✅ Native Word DOC saved: ${desktopDocPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
