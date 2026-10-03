import os
import math
import shutil
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def get_font(name, size):
    paths = [
        f"C:/Windows/Fonts/{name}",
        f"C:/Windows/Fonts/{name.lower()}",
        f"C:/Windows/Fonts/{name.upper()}",
    ]
    for p in paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    for fallback in ["georgiab.ttf", "georgia.ttf", "segoeuib.ttf", "segoeui.ttf", "arialbd.ttf", "arial.ttf"]:
        p = f"C:/Windows/Fonts/{fallback}"
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

def draw_pill(draw, x1, y1, x2, y2, bg_color, outline_color=None, radius=16, width=1):
    draw.rounded_rectangle([x1, y1, x2, y2], radius=radius, fill=bg_color, outline=outline_color, width=width)

def draw_star(draw, cx, cy, radius, fill_color, points=5):
    coords = []
    inner_radius = radius * 0.42
    for i in range(points * 2):
        r = radius if i % 2 == 0 else inner_radius
        angle = i * math.pi / points - math.pi / 2
        x = cx + r * math.cos(angle)
        y = cy + r * math.sin(angle)
        coords.append((x, y))
    draw.polygon(coords, fill=fill_color)

def draw_star_rating(draw, start_x, start_y, star_size=9, gap=4, count=5, fill_color=(212, 175, 55, 255)):
    for i in range(count):
        cx = start_x + i * (star_size * 2 + gap) + star_size
        cy = start_y + star_size
        draw_star(draw, cx, cy, star_size, fill_color)

# =========================================================================
# CLEAN META FEED ADS (1:1 Square - 1080 x 1080)
# Designed specifically for Instagram/Facebook Feed without clutter
# =========================================================================
def create_meta_feed_ad(src_path, out_path, headline, sub_benefit, discount_text, trust_points, theme="rose", crop_rect=None):
    W, H = 1080, 1080
    
    if theme == "dark":
        bg_main = (16, 12, 18, 255)
        text_brand = (212, 175, 55, 255)
        text_head = (255, 250, 245, 255)
        text_sub = (205, 185, 195, 255)
        card_border = (212, 175, 55, 180)
        badge_bg = (212, 175, 55, 255)
        badge_text = (16, 12, 18, 255)
        strip_bg = (28, 20, 30, 255)
        strip_border = (80, 55, 75, 255)
        strip_text_color = (235, 210, 160, 255)
        star_color = (212, 175, 55, 255)
    else:
        bg_main = (253, 244, 245, 255)
        text_brand = (140, 50, 75, 255)
        text_head = (35, 18, 28, 255)
        text_sub = (110, 70, 85, 255)
        card_border = (235, 205, 215, 255)
        badge_bg = (185, 28, 70, 255)
        badge_text = (255, 255, 255, 255)
        strip_bg = (255, 255, 255, 255)
        strip_border = (235, 205, 215, 255)
        strip_text_color = (150, 25, 60, 255)
        star_color = (200, 135, 35, 255)

    base = Image.new("RGBA", (W, H), bg_main)
    draw = ImageDraw.Draw(base)

    # Fonts
    font_brand = get_font("segoeuib.ttf", 16)
    font_head = get_font("georgiab.ttf", 36)
    font_sub = get_font("segoeui.ttf", 17)
    font_badge = get_font("segoeuib.ttf", 17)
    font_strip = get_font("segoeuib.ttf", 16)

    # 1. TOP HEADER (40px padding, clean breathing room)
    brand_t = "M I D N I G H T   B L O O M"
    bb = font_brand.getbbox(brand_t)
    bw = bb[2] - bb[0]
    draw.text(((W - bw) // 2, 38), brand_t, fill=text_brand, font=font_brand)

    hb = font_head.getbbox(headline)
    hw = hb[2] - hb[0]
    draw.text(((W - hw) // 2, 68), headline, fill=text_head, font=font_head)

    # Rating & Benefit Row
    sb = font_sub.getbbox(sub_benefit)
    sw = sb[2] - sb[0]
    stars_w = 5 * 18 + 4 * 4
    total_r_w = stars_w + 12 + sw
    start_rx = (W - total_r_w) // 2
    draw_star_rating(draw, start_rx, 114, star_size=9, gap=4, count=5, fill_color=star_color)
    draw.text((start_rx + stars_w + 12, 112), sub_benefit, fill=text_sub, font=font_sub)

    # 2. HERO IMAGE CARD (Full 980 x 780 Area - Fills the main frame elegantly)
    card_x = 50
    card_y = 150
    card_w = 980
    card_h = 780
    card_radius = 24

    src = Image.open(src_path).convert("RGBA")
    if crop_rect:
        src = src.crop(crop_rect)

    scale = max(card_w / src.width, card_h / src.height)
    new_w = int(src.width * scale)
    new_h = int(src.height * scale)
    src_scaled = src.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    crop_x = (new_w - card_w) // 2
    crop_y = (new_h - card_h) // 2
    src_card = src_scaled.crop((crop_x, crop_y, crop_x + card_w, crop_y + card_h))

    # Soft Shadow
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow)
    shadow_color = (0, 0, 0, 50) if theme == "dark" else (180, 130, 140, 45)
    s_draw.rounded_rectangle([card_x + 6, card_y + 8, card_x + card_w - 6, card_y + card_h + 8], radius=card_radius, fill=shadow_color)
    shadow = shadow.filter(ImageFilter.GaussianBlur(16))
    base.alpha_composite(shadow)

    mask = Image.new("L", (card_w, card_h), 0)
    m_draw = ImageDraw.Draw(mask)
    m_draw.rounded_rectangle([0, 0, card_w, card_h], radius=card_radius, fill=255)
    base.paste(src_card, (card_x, card_y), mask)

    draw = ImageDraw.Draw(base)
    draw.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=card_radius, outline=card_border, width=2)

    # Floating Discount Badge (Top-Right inside Card)
    badge_w = 190
    badge_h = 46
    bx1 = card_x + card_w - badge_w - 20
    by1 = card_y + 20
    draw_pill(draw, bx1, by1, bx1 + badge_w, by1 + badge_h, badge_bg, (255, 255, 255, 255), radius=14, width=2)
    
    db = font_badge.getbbox(discount_text)
    dw = db[2] - db[0]
    draw.text((bx1 + (badge_w - dw) // 2, by1 + 12), discount_text, fill=badge_text, font=font_badge)

    # 3. BOTTOM TRUST STRIP (980px Width, Clean & Uncluttered)
    strip_y = 950
    strip_h = 80
    draw_pill(draw, card_x, strip_y, card_x + card_w, strip_y + strip_h, strip_bg, strip_border, radius=20, width=1)
    
    # 3 Trust items with dividers
    trust_text = "   •   ".join(trust_points)
    tb = font_strip.getbbox(trust_text)
    tw = tb[2] - tb[0]
    draw.text((card_x + (card_w - tw) // 2, strip_y + 28), trust_text, fill=strip_text_color, font=font_strip)

    final_img = base.convert("RGB")
    final_img.save(out_path, "JPEG", quality=95)
    print(f"Saved Feed Ad: {out_path}")


# =========================================================================
# 4:5 VERTICAL PORTRAIT FEED ADS (1080 x 1350)
# The highest converting mobile Instagram/Facebook feed format
# =========================================================================
def create_portrait_4_5_ad(src_path, out_path, headline, sub_benefit, discount_text, trust_points, theme="rose", crop_rect=None):
    W, H = 1080, 1350
    
    if theme == "dark":
        bg_main = (16, 12, 18, 255)
        text_brand = (212, 175, 55, 255)
        text_head = (255, 250, 245, 255)
        text_sub = (205, 185, 195, 255)
        card_border = (212, 175, 55, 180)
        badge_bg = (212, 175, 55, 255)
        badge_text = (16, 12, 18, 255)
        strip_bg = (28, 20, 30, 255)
        strip_border = (80, 55, 75, 255)
        strip_text_color = (235, 210, 160, 255)
        star_color = (212, 175, 55, 255)
    else:
        bg_main = (253, 244, 245, 255)
        text_brand = (140, 50, 75, 255)
        text_head = (35, 18, 28, 255)
        text_sub = (110, 70, 85, 255)
        card_border = (235, 205, 215, 255)
        badge_bg = (185, 28, 70, 255)
        badge_text = (255, 255, 255, 255)
        strip_bg = (255, 255, 255, 255)
        strip_border = (235, 205, 215, 255)
        strip_text_color = (150, 25, 60, 255)
        star_color = (200, 135, 35, 255)

    base = Image.new("RGBA", (W, H), bg_main)
    draw = ImageDraw.Draw(base)

    font_brand = get_font("segoeuib.ttf", 17)
    font_head = get_font("georgiab.ttf", 40)
    font_sub = get_font("segoeui.ttf", 18)
    font_badge = get_font("segoeuib.ttf", 18)
    font_strip = get_font("segoeuib.ttf", 17)

    # 1. Top Header
    brand_t = "M I D N I G H T   B L O O M"
    bb = font_brand.getbbox(brand_t)
    bw = bb[2] - bb[0]
    draw.text(((W - bw) // 2, 45), brand_t, fill=text_brand, font=font_brand)

    hb = font_head.getbbox(headline)
    hw = hb[2] - hb[0]
    draw.text(((W - hw) // 2, 78), headline, fill=text_head, font=font_head)

    # Rating Row
    sb = font_sub.getbbox(sub_benefit)
    sw = sb[2] - sb[0]
    stars_w = 5 * 20 + 4 * 5
    total_r_w = stars_w + 14 + sw
    start_rx = (W - total_r_w) // 2
    draw_star_rating(draw, start_rx, 130, star_size=10, gap=5, count=5, fill_color=star_color)
    draw.text((start_rx + stars_w + 14, 128), sub_benefit, fill=text_sub, font=font_sub)

    # 2. Hero Card (980 x 1030 px)
    card_x = 50
    card_y = 175
    card_w = 980
    card_h = 1030
    card_radius = 26

    src = Image.open(src_path).convert("RGBA")
    if crop_rect:
        src = src.crop(crop_rect)

    scale = max(card_w / src.width, card_h / src.height)
    new_w = int(src.width * scale)
    new_h = int(src.height * scale)
    src_scaled = src.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    crop_x = (new_w - card_w) // 2
    crop_y = (new_h - card_h) // 2
    src_card = src_scaled.crop((crop_x, crop_y, crop_x + card_w, crop_y + card_h))

    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow)
    shadow_color = (0, 0, 0, 50) if theme == "dark" else (180, 130, 140, 45)
    s_draw.rounded_rectangle([card_x + 6, card_y + 8, card_x + card_w - 6, card_y + card_h + 8], radius=card_radius, fill=shadow_color)
    shadow = shadow.filter(ImageFilter.GaussianBlur(16))
    base.alpha_composite(shadow)

    mask = Image.new("L", (card_w, card_h), 0)
    m_draw = ImageDraw.Draw(mask)
    m_draw.rounded_rectangle([0, 0, card_w, card_h], radius=card_radius, fill=255)
    base.paste(src_card, (card_x, card_y), mask)

    draw = ImageDraw.Draw(base)
    draw.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=card_radius, outline=card_border, width=2)

    # Floating Discount Badge
    badge_w = 210
    badge_h = 50
    bx1 = card_x + card_w - badge_w - 24
    by1 = card_y + 24
    draw_pill(draw, bx1, by1, bx1 + badge_w, by1 + badge_h, badge_bg, (255, 255, 255, 255), radius=15, width=2)
    
    db = font_badge.getbbox(discount_text)
    dw = db[2] - db[0]
    draw.text((bx1 + (badge_w - dw) // 2, by1 + 13), discount_text, fill=badge_text, font=font_badge)

    # 3. Bottom Trust Strip
    strip_y = 1230
    strip_h = 80
    draw_pill(draw, card_x, strip_y, card_x + card_w, strip_y + strip_h, strip_bg, strip_border, radius=20, width=1)
    
    trust_text = "   •   ".join(trust_points)
    tb = font_strip.getbbox(trust_text)
    tw = tb[2] - tb[0]
    draw.text((card_x + (card_w - tw) // 2, strip_y + 27), trust_text, fill=strip_text_color, font=font_strip)

    final_img = base.convert("RGB")
    final_img.save(out_path, "JPEG", quality=95)
    print(f"Saved 4:5 Portrait Feed Ad: {out_path}")


if __name__ == "__main__":
    img1 = r"C:\Users\20092\.gemini\antigravity\brain\e8f01de8-8d5e-4112-84e4-02f1b613f50d\.user_uploaded\media_1791038633944.jpg"
    img2 = r"C:\Users\20092\.gemini\antigravity\brain\e8f01de8-8d5e-4112-84e4-02f1b613f50d\.user_uploaded\media_1791038672388.jpg"
    img3 = r"C:\Users\20092\.gemini\antigravity\brain\e8f01de8-8d5e-4112-84e4-02f1b613f50d\.user_uploaded\media_1791038633915.jpg"

    os.makedirs("public/ads", exist_ok=True)

    # =========================================================
    # AD 1: The Modern Wellness Edit (Mint/Pastel)
    # =========================================================
    trust_1 = ["100% DISCREET PACKAGING", "CASH ON DELIVERY", "WHISPER-QUIET & WATERPROOF"]
    
    # 1:1 Feed
    create_meta_feed_ad(
        img1, "public/ads/ad_1_mint_feed.jpg",
        headline="The Intimate Wellness Edit",
        sub_benefit="4.9 / 5 Rated by 2,400+ Women Across India",
        discount_text="FLAT 40% OFF",
        trust_points=trust_1,
        theme="rose",
        crop_rect=(10, 140, 672, 820)
    )
    # 4:5 Mobile Feed
    create_portrait_4_5_ad(
        img1, "public/ads/ad_1_mint_portrait.jpg",
        headline="The Intimate Wellness Edit",
        sub_benefit="4.9 / 5 Rated by 2,400+ Women Across India",
        discount_text="FLAT 40% OFF",
        trust_points=trust_1,
        theme="rose",
        crop_rect=(10, 140, 672, 920)
    )

    # =========================================================
    # AD 2: Luxury Self-Care Redefined (Silk Robe Lifestyle)
    # Adjusted to left as requested: crop_rect shifted leftwards!
    # =========================================================
    trust_2 = ["100% DISCREET DELIVERY", "CASH ON DELIVERY", "1-YEAR REPLACEMENT WARRANTY"]
    
    # 1:1 Feed
    create_meta_feed_ad(
        img2, "public/ads/ad_2_luxury_lifestyle_feed.jpg",
        headline="Luxury Self-Care Redefined",
        sub_benefit="Rated 4.95 / 5 by Luxury Wellness Aficionados",
        discount_text="SAVE 40% TODAY",
        trust_points=trust_2,
        theme="dark",
        crop_rect=(100, 140, 660, 740) # Shifted leftwards!
    )
    # 4:5 Mobile Feed
    create_portrait_4_5_ad(
        img2, "public/ads/ad_2_lifestyle_portrait.jpg",
        headline="Luxury Self-Care Redefined",
        sub_benefit="Rated 4.95 / 5 by Luxury Wellness Aficionados",
        discount_text="SAVE 40% TODAY",
        trust_points=trust_2,
        theme="dark",
        crop_rect=(80, 120, 660, 840) # Shifted leftwards!
    )

    # =========================================================
    # AD 3: Curated Essentials Collection (Pastel Essentials)
    # =========================================================
    trust_3 = ["100% UNBRANDED PLAIN BOX", "FREE COD SHIPPING", "100% MEDICAL GRADE SILICONE"]
    
    # 1:1 Feed
    create_meta_feed_ad(
        img3, "public/ads/ad_3_pastel_bundle_feed.jpg",
        headline="Curated Wellness Essentials",
        sub_benefit="4.9 / 5 Rated by 1,850+ Verified Buyers",
        discount_text="FROM ₹1,499",
        trust_points=trust_3,
        theme="rose",
        crop_rect=(10, 320, 674, 820)
    )
    # 4:5 Mobile Feed
    create_portrait_4_5_ad(
        img3, "public/ads/ad_3_bundle_portrait.jpg",
        headline="Curated Wellness Essentials",
        sub_benefit="4.9 / 5 Rated by 1,850+ Verified Buyers",
        discount_text="FROM ₹1,499",
        trust_points=trust_3,
        theme="rose",
        crop_rect=(10, 280, 674, 900)
    )

    # Copy files to artifact dir
    dest_dir = r"C:\Users\20092\.gemini\antigravity\brain\e8f01de8-8d5e-4112-84e4-02f1b613f50d"
    for f in os.listdir("public/ads"):
        if f.endswith(".jpg"):
            shutil.copy(os.path.join("public/ads", f), os.path.join(dest_dir, f))
    print("All Meta Feed & Portrait ads generated successfully!")
