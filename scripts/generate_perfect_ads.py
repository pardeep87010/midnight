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

def draw_star_rating(draw, start_x, start_y, star_size=8, gap=4, count=5, fill_color=(200, 140, 40, 255)):
    for i in range(count):
        cx = start_x + i * (star_size * 2 + gap) + star_size
        cy = start_y + star_size
        draw_star(draw, cx, cy, star_size, fill_color)

# =========================================================================
# 1:1 SQUARE FEED ADS (1080 x 1080)
# =========================================================================
def build_feed_ad(src_path, out_path, headline, rating_text, discount_text, trust_items, theme="rose", crop_rect=None):
    W, H = 1080, 1080
    
    if theme == "dark":
        bg_main = (18, 14, 22, 255)
        text_brand = (212, 175, 55, 255)
        text_head = (255, 250, 245, 255)
        text_sub = (195, 175, 185, 255)
        card_border = (212, 175, 55, 180)
        badge_bg = (212, 175, 55, 255)
        badge_text = (18, 14, 22, 255)
        trust_bg = (32, 22, 34, 255)
        trust_border = (80, 55, 75, 255)
        trust_title_color = (235, 210, 160, 255)
        trust_sub_color = (185, 165, 175, 255)
        cta_bg = (212, 175, 55, 255)
        cta_text_color = (18, 14, 22, 255)
        cta_border = (255, 235, 170, 255)
        star_color = (212, 175, 55, 255)
    else:
        bg_main = (253, 244, 245, 255)
        text_brand = (130, 60, 80, 255)
        text_head = (35, 18, 28, 255)
        text_sub = (120, 75, 90, 255)
        card_border = (235, 205, 215, 255)
        badge_bg = (185, 28, 70, 255)
        badge_text = (255, 255, 255, 255)
        trust_bg = (255, 255, 255, 255)
        trust_border = (235, 205, 215, 255)
        trust_title_color = (160, 28, 65, 255)
        trust_sub_color = (110, 80, 90, 255)
        cta_bg = (28, 16, 24, 255)
        cta_text_color = (255, 240, 245, 255)
        cta_border = (185, 28, 70, 220)
        star_color = (200, 135, 35, 255)

    base = Image.new("RGBA", (W, H), bg_main)
    draw = ImageDraw.Draw(base)

    font_brand = get_font("segoeuib.ttf", 15)
    font_head = get_font("georgiab.ttf", 34)
    font_sub = get_font("segoeui.ttf", 16)
    font_badge = get_font("segoeuib.ttf", 16)
    font_trust_title = get_font("segoeuib.ttf", 15)
    font_trust_sub = get_font("segoeui.ttf", 13)
    font_cta = get_font("segoeuib.ttf", 21)

    # 1. Header
    brand_t = "M I D N I G H T   B L O O M"
    bb = font_brand.getbbox(brand_t)
    bw = bb[2] - bb[0]
    draw.text(((W - bw) // 2, 42), brand_t, fill=text_brand, font=font_brand)

    hb = font_head.getbbox(headline)
    hw = hb[2] - hb[0]
    draw.text(((W - hw) // 2, 72), headline, fill=text_head, font=font_head)

    # Star Rating Row
    rb = font_sub.getbbox(rating_text)
    rw = rb[2] - rb[0]
    stars_w = 5 * 16 + 4 * 4
    total_r_w = stars_w + 12 + rw
    start_rx = (W - total_r_w) // 2
    draw_star_rating(draw, start_rx, 116, star_size=8, gap=4, count=5, fill_color=star_color)
    draw.text((start_rx + stars_w + 12, 115), rating_text, fill=text_sub, font=font_sub)

    # 2. Hero Image Card (960 x 635, Margins: 60px Left/Right)
    card_x = 60
    card_y = 152
    card_w = 960
    card_h = 635
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

    # Shadow
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
    badge_w = 175
    badge_h = 44
    bx1 = card_x + card_w - badge_w - 18
    by1 = card_y + 18
    draw_pill(draw, bx1, by1, bx1 + badge_w, by1 + badge_h, badge_bg, (255, 255, 255, 255), radius=12, width=2)
    
    db = font_badge.getbbox(discount_text)
    dw = db[2] - db[0]
    draw.text((bx1 + (badge_w - dw) // 2, by1 + 12), discount_text, fill=badge_text, font=font_badge)

    # 3. Trust Badges
    t_y = 808
    t_h = 66
    gap = 20
    item_w = (card_w - (gap * 2)) // 3

    for idx, (title, sub) in enumerate(trust_items):
        ix1 = card_x + idx * (item_w + gap)
        ix2 = ix1 + item_w
        draw_pill(draw, ix1, t_y, ix2, t_y + t_h, trust_bg, trust_border, radius=14, width=1)
        
        tb = font_trust_title.getbbox(title)
        tw = tb[2] - tb[0]
        draw.text((ix1 + (item_w - tw) // 2, t_y + 12), title, fill=trust_title_color, font=font_trust_title)
        
        sb = font_trust_sub.getbbox(sub)
        sw = sb[2] - sb[0]
        draw.text((ix1 + (item_w - sw) // 2, t_y + 36), sub, fill=trust_sub_color, font=font_trust_sub)

    # 4. Bottom CTA Button
    cta_y = 896
    cta_h = 76
    draw_pill(draw, card_x, cta_y, card_x + card_w, cta_y + cta_h, cta_bg, cta_border, radius=38, width=2)
    
    cta_text = "SHOP THE COLLECTION  •  FLAT 40% OFF  →"
    cb = font_cta.getbbox(cta_text)
    cw = cb[2] - cb[0]
    draw.text((card_x + (card_w - cw) // 2, cta_y + 24), cta_text, fill=cta_text_color, font=font_cta)

    final_img = base.convert("RGB")
    final_img.save(out_path, "JPEG", quality=95)
    print(f"Saved Feed Ad: {out_path}")


# =========================================================================
# 9:16 VERTICAL STORY ADS (1080 x 1920)
# =========================================================================
def build_story_ad(src_path, out_path, headline, rating_text, discount_text, trust_items, theme="rose", crop_rect=None):
    W, H = 1080, 1920
    
    if theme == "dark":
        bg_main = (18, 14, 22, 255)
        text_brand = (212, 175, 55, 255)
        text_head = (255, 250, 245, 255)
        text_sub = (195, 175, 185, 255)
        card_border = (212, 175, 55, 180)
        badge_bg = (212, 175, 55, 255)
        badge_text = (18, 14, 22, 255)
        trust_bg = (32, 22, 34, 255)
        trust_border = (80, 55, 75, 255)
        trust_title_color = (235, 210, 160, 255)
        trust_sub_color = (185, 165, 175, 255)
        cta_bg = (212, 175, 55, 255)
        cta_text_color = (18, 14, 22, 255)
        cta_border = (255, 235, 170, 255)
        star_color = (212, 175, 55, 255)
    else:
        bg_main = (253, 244, 245, 255)
        text_brand = (130, 60, 80, 255)
        text_head = (35, 18, 28, 255)
        text_sub = (120, 75, 90, 255)
        card_border = (235, 205, 215, 255)
        badge_bg = (185, 28, 70, 255)
        badge_text = (255, 255, 255, 255)
        trust_bg = (255, 255, 255, 255)
        trust_border = (235, 205, 215, 255)
        trust_title_color = (160, 28, 65, 255)
        trust_sub_color = (110, 80, 90, 255)
        cta_bg = (28, 16, 24, 255)
        cta_text_color = (255, 240, 245, 255)
        cta_border = (185, 28, 70, 220)
        star_color = (200, 135, 35, 255)

    base = Image.new("RGBA", (W, H), bg_main)
    draw = ImageDraw.Draw(base)

    font_brand = get_font("segoeuib.ttf", 20)
    font_head = get_font("georgiab.ttf", 46)
    font_sub = get_font("segoeui.ttf", 21)
    font_badge = get_font("segoeuib.ttf", 22)
    font_trust_title = get_font("segoeuib.ttf", 20)
    font_trust_sub = get_font("segoeui.ttf", 17)
    font_cta = get_font("segoeuib.ttf", 27)

    # 1. Top Header
    brand_t = "M I D N I G H T   B L O O M"
    bb = font_brand.getbbox(brand_t)
    bw = bb[2] - bb[0]
    draw.text(((W - bw) // 2, 130), brand_t, fill=text_brand, font=font_brand)

    hb = font_head.getbbox(headline)
    hw = hb[2] - hb[0]
    draw.text(((W - hw) // 2, 175), headline, fill=text_head, font=font_head)

    # Rating Row
    rb = font_sub.getbbox(rating_text)
    rw = rb[2] - rb[0]
    stars_w = 5 * 22 + 4 * 6
    total_r_w = stars_w + 14 + rw
    start_rx = (W - total_r_w) // 2
    draw_star_rating(draw, start_rx, 238, star_size=11, gap=6, count=5, fill_color=star_color)
    draw.text((start_rx + stars_w + 14, 235), rating_text, fill=text_sub, font=font_sub)

    # 2. Hero Image Card (940 x 960)
    card_x = 70
    card_y = 295
    card_w = 940
    card_h = 960
    card_radius = 28

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
    shadow_color = (0, 0, 0, 55) if theme == "dark" else (180, 130, 140, 50)
    s_draw.rounded_rectangle([card_x + 8, card_y + 10, card_x + card_w - 8, card_y + card_h + 10], radius=card_radius, fill=shadow_color)
    shadow = shadow.filter(ImageFilter.GaussianBlur(20))
    base.alpha_composite(shadow)

    mask = Image.new("L", (card_w, card_h), 0)
    m_draw = ImageDraw.Draw(mask)
    m_draw.rounded_rectangle([0, 0, card_w, card_h], radius=card_radius, fill=255)
    base.paste(src_card, (card_x, card_y), mask)

    draw = ImageDraw.Draw(base)
    draw.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=card_radius, outline=card_border, width=2)

    # Floating Discount Badge
    badge_w = 230
    badge_h = 56
    bx1 = card_x + card_w - badge_w - 24
    by1 = card_y + 24
    draw_pill(draw, bx1, by1, bx1 + badge_w, by1 + badge_h, badge_bg, (255, 255, 255, 255), radius=16, width=2)
    
    db = font_badge.getbbox(discount_text)
    dw = db[2] - db[0]
    draw.text((bx1 + (badge_w - dw) // 2, by1 + 14), discount_text, fill=badge_text, font=font_badge)

    # 3. Trust Pills (2x2 Grid)
    grid_y = 1290
    card_pw = (card_w - 24) // 2
    card_ph = 92
    
    positions = [
        (card_x, grid_y),
        (card_x + card_pw + 24, grid_y),
        (card_x, grid_y + card_ph + 18),
        (card_x + card_pw + 24, grid_y + card_ph + 18),
    ]

    for idx, (title, sub) in enumerate(trust_items):
        px, py = positions[idx]
        draw_pill(draw, px, py, px + card_pw, py + card_ph, trust_bg, trust_border, radius=18, width=1)
        
        tb = font_trust_title.getbbox(title)
        tw = tb[2] - tb[0]
        draw.text((px + (card_pw - tw) // 2, py + 18), title, fill=trust_title_color, font=font_trust_title)
        
        sb = font_trust_sub.getbbox(sub)
        sw = sb[2] - sb[0]
        draw.text((px + (card_pw - sw) // 2, py + 50), sub, fill=trust_sub_color, font=font_trust_sub)

    # 4. Bottom CTA Button
    cta_y = 1530
    cta_h = 92
    draw_pill(draw, card_x, cta_y, card_x + card_w, cta_y + cta_h, cta_bg, cta_border, radius=46, width=2)
    
    cta_text = "SWIPE UP / TAP TO SHOP NOW  →"
    cb = font_cta.getbbox(cta_text)
    cw = cb[2] - cb[0]
    draw.text((card_x + (card_w - cw) // 2, cta_y + 28), cta_text, fill=cta_text_color, font=font_cta)

    final_img = base.convert("RGB")
    final_img.save(out_path, "JPEG", quality=95)
    print(f"Saved Story Ad: {out_path}")


if __name__ == "__main__":
    img1 = r"C:\Users\20092\.gemini\antigravity\brain\e8f01de8-8d5e-4112-84e4-02f1b613f50d\.user_uploaded\media_1791038633944.jpg"
    img2 = r"C:\Users\20092\.gemini\antigravity\brain\e8f01de8-8d5e-4112-84e4-02f1b613f50d\.user_uploaded\media_1791038672388.jpg"
    img3 = r"C:\Users\20092\.gemini\antigravity\brain\e8f01de8-8d5e-4112-84e4-02f1b613f50d\.user_uploaded\media_1791038633915.jpg"

    os.makedirs("public/ads", exist_ok=True)

    # =========================================================
    # AD 1: The Modern Wellness Edit (Mint/Pastel)
    # =========================================================
    trust_1_feed = [
        ("100% DISCREET BOX", "Plain Outer Carton"),
        ("CASH ON DELIVERY", "Pay at Doorstep"),
        ("100% WATERPROOF", "Easy Clean & Quiet")
    ]
    trust_1_story = [
        ("100% DISCREET BOX", "Plain Unmarked Carton"),
        ("CASH ON DELIVERY", "Pay safely at doorstep"),
        ("BODY-SAFE SILICONE", "Medical Grade & Soft Touch"),
        ("100% WATERPROOF", "Whisper Quiet & Easy Clean")
    ]
    build_feed_ad(
        img1, "public/ads/ad_1_mint_feed.jpg",
        headline="The Intimate Wellness Edit",
        rating_text="4.9 / 5 (2,400+ Verified Reviews)",
        discount_text="FLAT 40% OFF",
        trust_items=trust_1_feed,
        theme="rose",
        crop_rect=(10, 150, 672, 750)
    )
    build_story_ad(
        img1, "public/ads/ad_1_mint_story.jpg",
        headline="The Intimate Wellness Edit",
        rating_text="4.9 / 5 (2,400+ Verified Reviews)",
        discount_text="FLAT 40% OFF",
        trust_items=trust_1_story,
        theme="rose",
        crop_rect=(10, 160, 672, 850)
    )

    # =========================================================
    # AD 2: Luxury Self-Care Redefined (Silk Robe Lifestyle)
    # =========================================================
    trust_2_feed = [
        ("100% DISCREET BOX", "Zero Product Labels"),
        ("CASH ON DELIVERY", "Pan-India Doorstep"),
        ("1-YEAR WARRANTY", "Quality Replacement")
    ]
    trust_2_story = [
        ("100% DISCREET BOX", "Zero Product Labels"),
        ("CASH ON DELIVERY", "Pay safely at doorstep"),
        ("VELVET-TOUCH SILICONE", "10 Ergonomic Frequencies"),
        ("1-YEAR WARRANTY", "100% Replacement Shield")
    ]
    build_feed_ad(
        img2, "public/ads/ad_2_luxury_lifestyle_feed.jpg",
        headline="Luxury Self-Care Redefined",
        rating_text="Rated 4.95 / 5 by Luxury Aficionados",
        discount_text="SAVE 40% TODAY",
        trust_items=trust_2_feed,
        theme="dark",
        crop_rect=(330, 200, 682, 660)
    )
    build_story_ad(
        img2, "public/ads/ad_2_lifestyle_story.jpg",
        headline="Luxury Self-Care Redefined",
        rating_text="Rated 4.95 / 5 by Luxury Aficionados",
        discount_text="SAVE 40% TODAY",
        trust_items=trust_2_story,
        theme="dark",
        crop_rect=(310, 180, 682, 700)
    )

    # =========================================================
    # AD 3: Curated Essentials Collection (Pastel Essentials)
    # =========================================================
    trust_3_feed = [
        ("100% DISCREET BOX", "Unbranded Brown Box"),
        ("FREE COD SHIPPING", "All Over India"),
        ("MEDICAL SILICONE", "Soft Touch & Safe")
    ]
    trust_3_story = [
        ("100% DISCREET BOX", "Unbranded Brown Box"),
        ("FREE COD SHIPPING", "Pay safely at doorstep"),
        ("100% WATERPROOF", "Easy Clean & Rechargeable"),
        ("BODY-SAFE SILICONE", "Medical Grade & Soft Touch")
    ]
    build_feed_ad(
        img3, "public/ads/ad_3_pastel_bundle_feed.jpg",
        headline="Curated Wellness Essentials",
        rating_text="4.9 / 5 (1,850+ Verified Reviews)",
        discount_text="FROM ₹1,499",
        trust_items=trust_3_feed,
        theme="rose",
        crop_rect=(10, 320, 674, 820)
    )
    build_story_ad(
        img3, "public/ads/ad_3_bundle_story.jpg",
        headline="Curated Wellness Essentials",
        rating_text="4.9 / 5 (1,850+ Verified Reviews)",
        discount_text="FROM ₹1,499",
        trust_items=trust_3_story,
        theme="rose",
        crop_rect=(10, 300, 674, 900)
    )

    # Copy files to artifact dir for instant view
    dest_dir = r"C:\Users\20092\.gemini\antigravity\brain\e8f01de8-8d5e-4112-84e4-02f1b613f50d"
    for f in ["ad_1_mint_feed.jpg", "ad_1_mint_story.jpg", "ad_2_luxury_lifestyle_feed.jpg", "ad_2_lifestyle_story.jpg", "ad_3_pastel_bundle_feed.jpg", "ad_3_bundle_story.jpg"]:
        shutil.copy(os.path.join("public/ads", f), os.path.join(dest_dir, f))
    print("All ads generated and copied to artifact directory!")
