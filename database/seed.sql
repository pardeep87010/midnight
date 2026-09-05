-- ==============================================================================
-- MIDNIGHT BLOOM - COMPLETE 50 PRODUCTS SEED DATA
-- ==============================================================================

-- 1. Insert 8 Department Categories
INSERT INTO categories (id, name, subtitle, tagline, image_url, display_order) VALUES
('vibrators', 'Vibrators', 'Wands, Rabbits, Bullets & Wearables', 'Precision engineered vibrators for clitoral, G-spot, and all-over body stimulation with whisper-quiet motors.', 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80', 1),
('dildos-insertables', 'Dildos & Insertables', 'Silicone, Glass, Metal & Thrusting', 'Sensual insertable art pieces crafted from non-porous borosilicate glass, medical liquid silicone, and stainless steel.', 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80', 2),
('anal-toys', 'Anal & Prostate Toys', 'Plugs, Beads, Prostate & Hooks', 'Doctor-designed flared bases and ergonomic prostate stimulators for intense P-spot and perineum bliss.', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80', 3),
('male-masturbators', 'Male Masturbators & Pumps', 'Pocket Pussies, Strokers & Vacuum Pumps', 'High-tech robotic linear thrusting, thermal heated chambers, and vacuum cylinders for male stamina.', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80', 4),
('cock-rings', 'Cock Rings & Delay Rings', 'Vibrating, Elastic, Leather, Metal & Dual', 'Enhance stamina, prolong firm erections, and deliver synchronized clitoral stimulation for your partner.', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80', 5),
('air-pressure-suction', 'Air-Pressure & Suction', 'Womanizer, Arcwave & Clitoral Vacuum', 'Touchless air-wave resonance and pulsating vacuum technology that stimulates without friction.', 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80', 6),
('strap-ons', 'Strap-ons & Harnesses', 'Standard, Double & Strapless Harnesses', 'Ergonomic, fully adjustable leather and fabric harnesses for seamless shared couple play.', 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80', 7),
('bdsm-kink', 'BDSM & Kink Gear', 'Floggers, Cuffs, Blindfolds & Violet Wands', 'Artisanal leather restraints, sensory impact paddles, high-frequency violet wands, and silk blindfolds.', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', 8)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Core Products & Specs
INSERT INTO products (id, category_id, name, subcategory, base_price, original_price, discount_text, badge, subtitle, description, rating_avg, reviews_count) VALUES
('bullet-vibrator', 'vibrators', 'The Micro-Pulse Bullet Vibrator', 'Bullet Vibrators', 39.00, 49.00, '20% OFF', 'Beginner Essential', 'Discreet pinpoint external stimulation', 'Small, discreet, and focused for pinpoint external stimulation. Delivers concentrated high-frequency buzz with one-button simplicity.', 4.8, 310),
('rabbit-vibrator', 'vibrators', 'The Dual-Sensation Rabbit Vibrator', 'Rabbit Vibrators', 119.00, 149.00, '20% OFF', 'Best Seller', 'Shaft for internal use and clitoral bunny-ear arm', 'Contoured shaft for internal G-spot stimulation and an ergonomic clitoral arm shaped like bunny ears delivering synchronized dual climaxes.', 4.9, 540),
('g-spot-vibrator', 'vibrators', 'The Curved Euphoria G-Spot Vibrator', 'G-Spot Vibrators', 95.00, 120.00, '21% OFF', 'Popular', 'Curved slightly at the tip to target internal zones', 'Curved specifically at the anatomical angle to target internal G-spot pleasure centers with deep, low-frequency rumbles.', 4.9, 420),
('wand-vibrator', 'vibrators', 'The Aura Power High-Torque Wand Vibrator', 'Wand Vibrators', 129.00, 160.00, '19% OFF', 'Staff Pick', 'Powerful, large-headed massager for broad rumblings', 'Powerful, large-headed massager designed for broad, intense rumbling vibrations that penetrate deep muscle tissue.', 4.9, 610),
('fleshlight-stroker', 'male-masturbators', 'The Velvet-Skin Fleshlight Textured Stroker Case', 'Fleshlight Cases', 99.00, 125.00, '20% OFF', 'Male Best Seller', 'Handheld textured case with realistic internal sleeve', 'Iconic handheld discreet case with a patented SuperSkin internal sleeve that replicates natural anatomy with adjustable suction dial.', 4.9, 780),
('automatic-stroker', 'male-masturbators', 'The Apex Motion Heated Automatic Stroker', 'Automatic Strokers', 189.00, 240.00, '21% OFF', 'High-Tech Flagship', 'Motorized device that moves up and down automatically', 'Robotic linear motion auto-stroker with internal 40°C thermal heating. Moves up and down hands-free at up to 300 thrusts per minute.', 4.9, 650),
('prostate-massager', 'anal-toys', 'The Nexus Ergonomic Prostate Massager', 'Prostate Massagers', 119.00, 149.00, '20% OFF', '#1 Men Sex Toy', 'Angled specifically to stimulate the male P-spot', 'Angled specifically with an anatomical curve to target and massage the male P-spot and perineum with dual-motor synchronized vibration.', 4.9, 520),
('vibrating-cock-ring', 'cock-rings', 'The Eclipse Dual Resonance Vibrating Cock Ring', 'Vibrating Cock Rings', 68.00, 85.00, '20% OFF', 'Couples Top Choice', 'Restricts blood flow for stamina + buzzing vibrations', 'Restricts blood flow to prolong stamina while delivering powerful direct clitoral stimulation with twin micro-vibration motors.', 4.9, 520),
('womanizer-air-pulse', 'air-pressure-suction', 'The Empress Womanizer Air-Pulse Clitoral Massager', 'Womanizer Air-Wave', 159.00, 199.00, '20% OFF', 'Iconic Tech', 'Uses compressed air waves for touchless stimulation', 'Patented Pleasure Air technology envelops the clitoris in pulsating waves of air pressure without direct contact or friction.', 5.0, 890),
('arcwave-male-sonic', 'air-pressure-suction', 'The Arcwave Ion Pleasure Air-Wave Male Stroker', 'Arcwave Male Pleasure', 199.00, 249.00, '20% OFF', 'Revolutionary Men Toy', 'Sonic-stimulation designed specifically for male anatomy', 'Pioneering Pleasure Air sonic pressure wave technology engineered specifically for male anatomy to stimulate the sensitive frenulum.', 4.9, 310),
('violet-wand', 'bdsm-kink', 'The Electra High-Frequency Violet Wand Electro-Kit', 'Violet Wands', 149.00, 195.00, '23% OFF', 'Electrifying Tech', 'High-frequency glass electrode for tingling electrical chills', 'Professional high-frequency Tesla electro-stimulation wand with 4 specialized glass electrodes that emit crackling blue-violet sparks.', 4.9, 160)
ON CONFLICT (id) DO UPDATE SET base_price = EXCLUDED.base_price;

-- 3. Insert Product Specs
INSERT INTO product_specs (product_id, sound_level, material, battery_life, waterproof_rating, modes_count) VALUES
('bullet-vibrator', '< 28 dB (Whisper Silent)', '100% Medical Liquid Silicone', '90 min Fast USB Charge', 'IPX7 100% Waterproof', '10 Vibration Speeds'),
('rabbit-vibrator', '< 30 dB', 'Medical Liquid Silicone & Gold Alloy', '120 min USB Runtime', 'IPX7 Submersible', '12 Dual Vibration Patterns'),
('wand-vibrator', '< 34 dB', 'Hypoallergenic Silicone & Alloy', '180 min Runtime', 'IPX6 Splashproof', '8 Speeds + 12 Variable Patterns'),
('fleshlight-stroker', 'Whisper Soft', 'Patented RealFeel SuperSkin + ABS Shell', 'Manual Suction Dial', '100% Washable Core', 'Adjustable Air Suction Dial'),
('automatic-stroker', '< 38 dB', 'Ultra-Soft RealFeel TPE + Alloy Chassis', '90 min / Fast Charging Dock', 'Washable Core (IPX7)', '7 Auto-Stroking Speeds + 40°C Heating'),
('prostate-massager', '< 30 dB (Whisper Silent)', '100% Medical Liquid Silicone', '120 min Magnetic USB', 'IPX7 Waterproof', '8 Dual-Motor Vibration Modes'),
('vibrating-cock-ring', '< 25 dB', 'Stretch-Flex Liquid Silicone', '75 min Magnetic USB', 'IPX8 100% Submersible', '10 Synchronized Modes'),
('womanizer-air-pulse', '< 27 dB (Whisper Quiet)', '100% Medical Liquid Silicone', '120 min Magnetic USB', 'IPX7 Submersible', '12 Intensity Levels + Smart Silence'),
('violet-wand', 'Crackling Spark Arc', 'Insulated Bakelite & Borosilicate Gas Tubes', 'AC Mains Powered / Adjustable Dial', 'Keep Dry', 'Continuous Dial Voltage (10kV - 45kV)')
ON CONFLICT (product_id) DO NOTHING;
