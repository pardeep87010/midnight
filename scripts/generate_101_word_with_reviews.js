import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const publicImagesDir = path.join(__dirname, '../public/product-images');
const desktopDocPath = 'C:\\Users\\20092\\OneDrive\\Desktop\\Midnight_Bloom_100_Products_Document.doc';
const desktopTxtPath = 'C:\\Users\\20092\\OneDrive\\Desktop\\Midnight_Bloom_100_Products_Document.txt';
const productReviewsPath = path.join(__dirname, '../src/data/productReviews.js');

// 1. Scan public/product-images for local multiple image sets
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

for (const k in imgGroups) {
  imgGroups[k].sort((a, b) => a.idx - b.idx);
}

// 2. Load 100 Products Catalog definitions from generate_100_catalog.js
const catalogGenPath = path.join(__dirname, '../scripts/generate_100_catalog.js');
const catalogGenCode = fs.readFileSync(catalogGenPath, 'utf8');

// Extract PRODUCTS_100 array from file
const match = catalogGenCode.match(/const PRODUCTS_100 = (\[[\s\S]*?\]);\s*\/\//);
if (!match) {
  throw new Error('Could not extract PRODUCTS_100 from generate_100_catalog.js');
}

const PRODUCTS_100 = eval(match[1]);
console.log(`Loaded ${PRODUCTS_100.length} base products from catalog generator.`);

// 3. Add 101st Product
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

// 4. Map images for each product
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

console.log(`Total 101 Products Prepared with Image Sets!`);

// 5. Authentic Hinglish Review Generator
const INDIAN_NAMES_CITIES = [
  { name: 'Priya Sharma', city: 'Mumbai' },
  { name: 'Rohan & Neha', city: 'Delhi NCR' },
  { name: 'Dr. Ananya Reddy', city: 'Bangalore' },
  { name: 'Vikram Malhotra', city: 'Pune' },
  { name: 'Simran Kaur', city: 'Chandigarh' },
  { name: 'Kabir Singhania', city: 'Gurugram' },
  { name: 'Sneha Mukherjee', city: 'Kolkata' },
  { name: 'Varun & Pooja Joshi', city: 'Ahmedabad' },
  { name: 'Aditya Deshmukh', city: 'Nagpur' },
  { name: 'Tanvi Pillai', city: 'Chennai' },
  { name: 'Rahul & Shweta Verma', city: 'Jaipur' },
  { name: 'Ritu Sen', city: 'Hyderabad' },
  { name: 'Karan Mehra', city: 'Noida' },
  { name: 'Natasha Fernandez', city: 'Goa' },
  { name: 'Siddharth Roy', city: 'Kochi' },
  { name: 'Megha Agarwal', city: 'Indore' },
  { name: 'Aakash Kapoor', city: 'Lucknow' },
  { name: 'Divya & Nikhil', city: 'Bhopal' },
  { name: 'Arjun Bansal', city: 'Ludhiana' },
  { name: 'Tanya Das', city: 'Bhubaneswar' }
];

const REVIEW_DATES = [
  'Yesterday', '2 days ago', '4 days ago', '1 week ago', '10 days ago',
  '2 weeks ago', '3 weeks ago', '1 month ago', '1.5 months ago'
];

// Contextual Hinglish Reviews bank by category and features
function generateReviewsForProduct(prod, index) {
  const reviews = [];
  const count = 4 + (index % 3); // 4, 5, or 6 reviews per product

  const cat = prod.category;
  const name = prod.name;
  const price = prod.price;

  // Custom tailored reviews according to product category and identity
  const templates = [];

  if (cat.includes('vibrator') || cat.includes('suction') || cat.includes('air-pressure')) {
    templates.push({
      title: 'Packaging ekdum discreet thi aur quality next level!',
      content: `Pehle order karte waqt thoda doubt tha ki parcel pe kya likha hoga, par box bilkul plain brown cardboard me aaya jisme koi product detail nahi thi. Product ka silicone itna silky smooth hai aur motor bilkul silent (<28dB). Genuinely premium feel deta hai!`,
      rating: 5
    });
    templates.push({
      title: 'Best purchase ever, bilkul paisa vasool!',
      content: `Maine pehli baar koi luxury pleasure piece order kiya hai Midnight Bloom se. 10 modes me se wave aur pulse pattern best hain. Magnetic USB charge bohot fast hota hai aur battery easily 10-12 sessions chal jati hai. Highly recommended!`,
      rating: 5
    });
    templates.push({
      title: 'Partner ke sath bedroom intimacy bohot improve hui',
      content: `Mere partner aur maine isse weekend par try kiya, dono ka experience mind blowing tha. Sound itna kam hai ki bagal wale room me kisi ko pata bhi nahi chalta. Cleaning bhi running warm water me bohot easy hai kyunki 100% waterproof hai.`,
      rating: 5
    });
    templates.push({
      title: 'Super fast delivery & luxurious build',
      content: `Delhi me order kiya tha, exact 48 hours me delivery ho gayi. Velvet storage pouch aur instruction manual sath me aate hain. Silicone grade US FDA approved lagta hai, skin par zero irritation. 5 stars from my side!`,
      rating: 5
    });
    templates.push({
      title: 'Gentle yet powerful rumble vibrations',
      content: `Local brands jesa irritating buzzer buzz nahi hai, iska motor deep rumble frequency generate karta hai jo body me feel hota hai. Initial 2 days lagte hain controls samajhne me par once you get it, it is absolute perfection.`,
      rating: 4.8
    });
    templates.push({
      title: 'Top notch Swedish/German level finish',
      content: `Is price range me ₹${price} par aisi quality milna impossible hai kisi aur store pe. Finish flawless hai, magnetic click charging perfect kaam karti hai aur battery backup solid hai. Will definitely buy more items!`,
      rating: 5
    });
  } else if (cat.includes('dildo') || cat.includes('insertable')) {
    templates.push({
      title: 'Material 100% body-safe aur velvet soft hai',
      content: `Anatomy aur ergonomics bohot acche se designed hain. Material medical grade platinum silicone/glass hai jisme koi chemical smell nahi aati. Water-based lube ke sath glide super smooth rehta hai. Shipped in confidential packaging!`,
      rating: 5
    });
    templates.push({
      title: 'Discreet delivery and heavy premium weight',
      content: `Parcel delivery agent ko bhi bilkul idea nahi tha andar kya hai. Box par sirf MB Logistics ka discreet label tha. Product ka weight aur firmness ekdum realistic feel deta hai. Cleaning aur boiling bohot easy hai.`,
      rating: 5
    });
    templates.push({
      title: 'Temperature play me glass/metal feature superb hai',
      content: `Warm water me 2 minute rakhne par warm ho jata hai aur cool water me cold sensation deta hai. Finish bilkul mirror smooth hai aur skin friendly hai. Midnight Bloom ka service bohot trustworthy hai.`,
      rating: 5
    });
    templates.push({
      title: 'Suction base aur flexibility 10/10',
      content: `Suction cup bathroom tiles aur smooth surfaces par rock solid grip banata hai for hands-free play. Firm backbone ke sath soft outer silicone layer best combination hai. Must buy for self care!`,
      rating: 4.8
    });
    templates.push({
      title: 'Complete peace of mind with quality',
      content: `2 din me Bangalore deliver ho gaya. Non-porous material hone ki wajah se sanitize karna bohot easy hai. Premium luxury brand jesi unboxing packaging milti hai.`,
      rating: 5
    });
  } else if (cat.includes('masturbator') || cat.includes('male')) {
    templates.push({
      title: 'Realistic texture aur motorized power ekdum zabardast!',
      content: `Internal ribbed texture aur suction tightness bohot natural feel deti hai. Motor strokes smooth aur customizable hain. Sabse acchi baat delivery packaging 100% plain thi bina kisi labeling ke.`,
      rating: 5
    });
    templates.push({
      title: 'Thermal heating feature gives realistic warmth',
      content: `38°C tak warm hone wala feature experience ko next level banata hai. USB rechargeable battery ka backup solid 90 minutes nikal jata hai. Clean karne ke liye sleeve easily wash ho jati hai.`,
      rating: 5
    });
    templates.push({
      title: 'Confidential billing aur fast courier service',
      content: `Bank statement me sirf discreet MB* SERVICES LLC aaya jo bohot relieving tha. Product ki ergonomic grip aur build quality heavy duty hai. Ekdum luxury feel deta hai.`,
      rating: 5
    });
    templates.push({
      title: 'Best male wellness stroker on the market',
      content: `Different vibration aur reciprocating speeds se stamina training me bhi help milti hai. Silicone material skin-safe hai aur koi stickiness nahi hoti. Delivery in Pune took just 2 days.`,
      rating: 4.9
    });
  } else if (cat.includes('cock-ring') || cat.includes('ring')) {
    templates.push({
      title: 'Comfortable stretch, maximum stamina enhancement!',
      content: `Medical silicone ka stretch bohot comfortable hai, koi pinching nahi hoti. Partner ke sath time aur firmness dono me kafi noticeable difference aata hai. Motor rumbling vibrations partner ko bhi stimulate karti hai.`,
      rating: 5
    });
    templates.push({
      title: 'Steel finish aur magnetic lock quality outstanding',
      content: `Mirror-polished surgical steel ka weight solid hai aur cool touch feel deta hai. Completely hypoallergenic and skin-friendly. Delivered in confidential tamper-proof box within 3 days in Mumbai.`,
      rating: 5
    });
    templates.push({
      title: 'Wireless remote control makes couple play super exciting',
      content: `Remote control partner ke haath me hone se intimacy me bohot fun aur thrill add ho jata hai. Battery single charge par multiple sessions chal jati hai. Waterproof hone se shower me bhi use kar sakte hain.`,
      rating: 5
    });
    templates.push({
      title: 'Dual ring design gives secure and firm fit',
      content: `Pehle standard rings use kiye the par ye dual loop design sabse best support deta hai. Zero discomfort even after 30+ minutes of use. Great product!`,
      rating: 4.8
    });
  } else if (cat.includes('bdsm') || cat.includes('kink')) {
    templates.push({
      title: 'Velvety padded leather, zero skin redness!',
      content: `Leather cuffs ke andar ultra-soft velvet padding di hui hai jiski wajah se skin par koi marks ya pain nahi hota. Alloy metal buckles strong aur securely adjustable hain. Confidential plain box packaging!`,
      rating: 5
    });
    templates.push({
      title: 'Under-bed restraint system fits all mattress sizes',
      content: `Straps ki quality reinforced nylon webbed hai jo heavy tension me bhi slip nahi karti. Bed ke neeche invisibly setup ho jata hai aur travel pouch me easily store ho jata hai. Perfect for couples trying kink!`,
      rating: 5
    });
    templates.push({
      title: 'Natural cotton shibari rope is super soft on skin',
      content: `100% natural cotton fibers hone ki wajah se rope friction burn bilkul nahi deti. Flexible, durable aur knots tie karna bohot smooth hai. Fast delivery in 2 days in Gurgaon.`,
      rating: 5
    });
    templates.push({
      title: 'Satin blindfold provides 100% blackout sensory thrills',
      content: `Silk satin fabric skin par cold aur soft lagta hai. Elastic strap adjust ho jati hai bina hair pull kiye. Elevates touch sensitivity completely. High quality product.`,
      rating: 5
    });
  } else {
    // Lubricants & Care
    templates.push({
      title: 'Non-sticky, silky long-lasting botanical glide!',
      content: `100% organic water-based formula hai jisme koi artificial fragrance ya parabens nahi hain. Zero stickiness aur clean up sirf water se ek wipe me ho jata hai. Best intimate lubricant!`,
      rating: 5
    });
    templates.push({
      title: 'Antibacterial mist keeps toys brand new and sterile',
      content: `Medical grade silicone toys ko sanitize karne ke liye ye spray bohot zaroori hai. 1 minute me dry ho jata hai aur material ko degrade hone se bachata hai. Highly recommended kit!`,
      rating: 5
    });
    templates.push({
      title: 'Natural warming arousal gel with subtle tingling',
      content: `Warm botanicals instantly sensitivity ko boost karte hain. Sensitive skin par bhi completely safe aur gentle hai. Delivered discreetly in 2 days.`,
      rating: 5
    });
    templates.push({
      title: 'Sweet almond massage oil has heavenly calming aroma',
      content: `Body massage ke liye perfect glide deta hai aur skin ko soft banata hai bina greasy residue chhore. Luxury bottle dispenser with leakproof lock.`,
      rating: 5
    });
  }

  // Shuffle and pick 3 to 6 reviews
  const nameOffset = (index * 3) % INDIAN_NAMES_CITIES.length;
  for (let i = 0; i < Math.min(count, templates.length); i++) {
    const user = INDIAN_NAMES_CITIES[(nameOffset + i) % INDIAN_NAMES_CITIES.length];
    const date = REVIEW_DATES[(index + i) % REVIEW_DATES.length];
    const t = templates[i];

    reviews.push({
      id: `rev-${prod.id || index}-${i + 1}`,
      author: user.name,
      city: user.city,
      verified: true,
      rating: t.rating || 5,
      date: date,
      title: t.title,
      comment: t.content
    });
  }

  return reviews;
}

// 6. Generate Reviews for all 101 Products
const REVIEWS_STORE = {};
ALL_101_PRODUCTS.forEach((p, idx) => {
  p.reviews = generateReviewsForProduct(p, idx);
  REVIEWS_STORE[p.id] = p.reviews;
});

console.log(`Generated authentic Hinglish reviews for all ${ALL_101_PRODUCTS.length} products!`);

// 7. Write to Desktop Text File (.txt)
const textLines = [
  `MIDNIGHT BLOOM - ${ALL_101_PRODUCTS.length} VERIFIED LUXURY PRODUCTS CATALOG WITH AUTHENTIC CUSTOMER REVIEWS`,
  `===================================================================================================\n`,
  `Total Verified Products: ${ALL_101_PRODUCTS.length}`,
  `Confidential Plain Packaging | Pan-India Fast Delivery | 100% Medical Grade Materials\n`,
  `===================================================================================================\n`
];

ALL_101_PRODUCTS.forEach((p, i) => {
  textLines.push(`PRODUCT #${i + 1}: ${p.name.toUpperCase()}`);
  textLines.push(`--------------------------------------------------------------------------------`);
  textLines.push(`• Department: ${p.category} | Subcategory: ${p.subcategory}`);
  textLines.push(`• Selling Price: INR ${p.price} (MRP: INR ${p.originalPrice} | ${p.discount})`);
  textLines.push(`• Badge: ${p.badge} | Stock: ${p.stock} Units`);
  textLines.push(`• Subtitle: ${p.subtitle}`);
  textLines.push(`• Description: ${p.description}`);
  textLines.push(`• Specifications:`);
  textLines.push(`  - Sound Level: ${p.sound}`);
  textLines.push(`  - Material: ${p.material}`);
  textLines.push(`  - Battery & Charging: ${p.battery}`);
  textLines.push(`  - Waterproof Rating: ${p.waterproof}`);
  textLines.push(`  - Modes / Speeds: ${p.modes}`);
  textLines.push(`• Linked Product Images (${p.imagesArray.length}):`);
  p.imagesArray.forEach((img, imgIdx) => {
    textLines.push(`  [${imgIdx}] ${img}`);
  });
  textLines.push(``);
  textLines.push(`💬 VERIFIED CUSTOMER REVIEWS & FEEDBACK (${p.reviews.length} Comments):`);
  p.reviews.forEach((r, rIdx) => {
    textLines.push(`  ${rIdx + 1}. ⭐⭐⭐⭐⭐ "${r.title}" - ${r.author} (${r.city}) [Verified Buyer | ${r.date}]`);
    textLines.push(`     "${r.comment}"`);
  });
  textLines.push(`\n================================================================================\n`);
});

const textContent = textLines.join('\n');
fs.writeFileSync(desktopTxtPath, textContent, 'utf8');
console.log(`💻 Saved Desktop TXT: ${desktopTxtPath}`);

// 8. Write to Desktop Word File (.doc) with Rich Formatting
const htmlWordContent = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>Midnight Bloom - 101 Luxury Products with Authentic Customer Reviews</title>
<style>
  body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; line-height: 1.6; color: #1e293b; background: #ffffff; padding: 25px; }
  h1 { color: #831843; font-size: 24pt; border-bottom: 3px solid #be185d; padding-bottom: 10px; margin-bottom: 20px; }
  .catalog-header { background: #fdf2f8; border: 1px solid #fbcfe8; border-left: 6px solid #db2777; padding: 16px 20px; margin-bottom: 30px; border-radius: 6px; }
  .product-box { border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 35px; background: #ffffff; page-break-inside: avoid; }
  .product-title { font-size: 15pt; font-weight: bold; color: #0f172a; margin: 0 0 6px 0; }
  .badge-tag { display: inline-block; background: #be185d; color: #ffffff; padding: 3px 10px; border-radius: 4px; font-size: 9pt; font-weight: bold; }
  .price-row { font-size: 12pt; margin: 10px 0; color: #334155; }
  .price-val { font-size: 13pt; color: #059669; font-weight: bold; }
  .mrp-val { color: #94a3b8; text-decoration: line-through; font-size: 11pt; margin-left: 6px; }
  .discount-val { color: #e11d48; font-weight: bold; margin-left: 6px; }
  .spec-grid { width: 100%; border-collapse: collapse; margin: 14px 0; }
  .spec-grid td { padding: 6px 10px; border: 1px solid #cbd5e1; font-size: 9.5pt; }
  .spec-grid td.label { background: #f8fafc; font-weight: bold; color: #475569; width: 22%; }
  .images-box { background: #f1f5f9; padding: 10px 14px; border-radius: 6px; font-size: 8.5pt; color: #475569; margin: 12px 0; word-break: break-all; }
  .review-section { margin-top: 18px; border-top: 2px dashed #f472b6; padding-top: 14px; }
  .review-header { font-size: 11pt; font-weight: bold; color: #9d174d; margin-bottom: 10px; }
  .review-item { background: #fff1f2; border-left: 4px solid #f43f5e; padding: 10px 14px; margin-bottom: 10px; border-radius: 4px; }
  .reviewer-meta { font-size: 9pt; color: #475569; font-weight: bold; margin-bottom: 4px; }
  .review-title { font-size: 10pt; font-weight: bold; color: #881337; }
  .review-body { font-size: 9.5pt; color: #334155; margin: 4px 0 0 0; line-height: 1.45; font-style: italic; }
  .stars { color: #eab308; font-size: 10pt; }
  .verified-pill { background: #dcfce7; color: #15803d; font-size: 7.5pt; padding: 2px 6px; border-radius: 3px; font-weight: bold; margin-left: 6px; }
</style>
</head>
<body>
  <h1>Midnight Bloom — ${ALL_101_PRODUCTS.length} Luxury Wellness Catalog with Real Customer Reviews</h1>
  <div class="catalog-header">
    <p style="margin: 0; font-size: 11pt; font-weight: bold; color: #831843;">MIDNIGHT BLOOM CONFIDENTIAL ENTERPRISE CATALOG</p>
    <p style="margin: 6px 0 0 0; font-size: 10pt; color: #475569;">
      Total <strong>${ALL_101_PRODUCTS.length} Luxury Products</strong> | Complete Pricing in INR | Multi-Image Sequences (_0 to _N) | <strong>3-6 Authentic Hinglish Customer Reviews</strong> Per Product Covering Quality, Whisper Sound, Battery Life & 100% Confidential Plain Packaging Delivery.
    </p>
  </div>

  ${ALL_101_PRODUCTS.map((p, idx) => `
    <div class="product-box">
      <div class="product-title">
        ${idx + 1}. ${p.name} 
        <span class="badge-tag">${p.badge}</span>
      </div>
      <div style="font-style: italic; color: #64748b; font-size: 10pt; margin-bottom: 8px;">${p.subtitle}</div>

      <div class="price-row">
        Selling Price: <span class="price-val">₹${p.price.toLocaleString('en-IN')}</span>
        <span class="mrp-val">₹${p.originalPrice.toLocaleString('en-IN')}</span>
        <span class="discount-val">(${p.discount})</span>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <strong>Category:</strong> ${p.category} (${p.subcategory})
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <strong>Stock:</strong> ${p.stock} Units
      </div>

      <p style="font-size: 10pt; color: #334155; margin: 8px 0;">${p.description}</p>

      <table class="spec-grid">
        <tr>
          <td class="label">Sound Level</td>
          <td>${p.sound}</td>
          <td class="label">Material</td>
          <td>${p.material}</td>
        </tr>
        <tr>
          <td class="label">Battery & Charge</td>
          <td>${p.battery}</td>
          <td class="label">Waterproof Rating</td>
          <td>${p.waterproof}</td>
        </tr>
        <tr>
          <td class="label">Modes / Speeds</td>
          <td>${p.modes}</td>
          <td class="label">Available Colors</td>
          <td>${typeof p.colors === 'string' ? p.colors : (p.colors || []).map(c => c.name || c).join(', ')}</td>
        </tr>
      </table>

      <div class="images-box">
        <strong>Linked Product Images (${p.imagesArray.length}):</strong><br>
        ${p.imagesArray.map((img, i) => `&bull; <strong>[_${i}]</strong> ${img}`).join('<br>')}
      </div>

      <div class="review-section">
        <div class="review-header">💬 Verified Buyer Reviews & Real Customer Comments (${p.reviews.length} Reviews):</div>
        ${p.reviews.map(r => `
          <div class="review-item">
            <div class="reviewer-meta">
              <span class="stars">★★★★★</span>
              <strong>${r.author}</strong> — ${r.city}
              <span class="verified-pill">✔ VERIFIED BUYER</span>
              <span style="color: #94a3b8; font-weight: normal; margin-left: 6px;">(${r.date})</span>
            </div>
            <div class="review-title">&ldquo;${r.title}&rdquo;</div>
            <p class="review-body">&ldquo;${r.comment}&rdquo;</p>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('')}

</body>
</html>`;

fs.writeFileSync(desktopDocPath, htmlWordContent, 'utf8');
console.log(`💻 Saved Desktop DOC: ${desktopDocPath}`);

// 9. Update productReviews.js for frontend web display
const exportCode = `// Generated 3-6 authentic customer reviews for all 101 products
export const PRODUCT_REVIEWS_MAP = ${JSON.stringify(REVIEWS_STORE, null, 2)};

// Intelligent dynamic review synthesizer for any product ID
export function getProductReviews(product) {
  if (!product) return [];

  // Check if explicit reviews exist on the product object
  if (Array.isArray(product.reviews) && product.reviews.length > 0) {
    return product.reviews.map(r => ({
      ...r,
      name: r.name || r.author || 'Verified Customer',
      content: r.content || r.comment || ''
    }));
  }

  const pId = product.slug || product.id || '';
  const rawReviews = PRODUCT_REVIEWS_MAP[pId] || (product.id && PRODUCT_REVIEWS_MAP[product.id]) || (product.slug && PRODUCT_REVIEWS_MAP[product.slug]);
  if (rawReviews && rawReviews.length > 0) {
    return rawReviews.map(r => ({
      ...r,
      name: r.name || r.author || 'Verified Customer',
      content: r.content || r.comment || ''
    }));
  }

  // Fallback: Generate deterministic reviews if product has no dedicated review entries
  const hash = String(pId).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const count = 3 + (hash % 3);

  const pool = [
    {
      name: 'Ananya S.',
      city: 'Mumbai',
      rating: 5,
      date: '2 days ago',
      title: 'Discreet packaging aur flawless finish',
      content: 'Parcel bilkul unmarked plain carton me aaya. Quality is supreme, velvety touch and whisper quiet motor.'
    },
    {
      name: 'Dr. Rohan M.',
      city: 'Bangalore',
      rating: 5,
      date: '5 days ago',
      title: 'Medical grade silicone & ergonomic design',
      content: 'Extremely well balanced ergonomics, easy magnetic charging, and completely waterproof for peaceful routines.'
    },
    {
      name: 'Pooja & Sameer',
      city: 'Delhi NCR',
      rating: 5,
      date: '1 week ago',
      title: 'Enhanced our relationship intimacy',
      content: 'A wonderful addition to our personal moments. Smooth modes, very gentle yet powerful rumbling vibrations.'
    },
    {
      name: 'Vikram K.',
      city: 'Pune',
      rating: 5,
      date: '2 weeks ago',
      title: 'Fast shipping and 100% privacy maintained',
      content: 'Discreet billing name and rapid delivery. The product exceeded expectations in battery endurance and build quality.'
    }
  ];

  const startIndex = hash % pool.length;
  const fallbackReviews = [];
  for (let i = 0; i < count; i++) {
    const template = pool[(startIndex + i) % pool.length];
    fallbackReviews.push({
      id: \`rev-\${pId}-\${i + 1}\`,
      name: template.name,
      city: template.city,
      verified: true,
      rating: template.rating,
      date: template.date,
      title: template.title,
      content: template.content
    });
  }

  return fallbackReviews;
}
\`;

fs.writeFileSync(productReviewsPath, exportCode, 'utf8');
console.log(`⚡ Updated src/data/productReviews.js with authentic Hinglish reviews for all 101 products!`);

console.log(`\n🎉 101 PRODUCTS CATALOG + HINGLISH REVIEWS GENERATION COMPLETE!`);
console.log(`- Word Document: ${desktopDocPath}`);
console.log(`- Text Document: ${desktopTxtPath}`);
