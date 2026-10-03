import os
import math
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

def draw_pill(draw, x1, y1, x2, y2, bg_color, outline_color=None, radius=20, width=1):
    draw.rounded_rectangle([x1, y1, x2, y2], radius=radius, fill=bg_color, outline=outline_color, width=width)

def draw_glass_card(base, x1, y1, x2, y2, bg_color=(255, 255, 255, 220), border_color=(255, 255, 255, 240), radius=20, width=1):
    card = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(card)
    d.rounded_rectangle([x1, y1, x2, y2], radius=radius, fill=bg_color, outline=border_color, width=width)
    base.alpha_composite(card)

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

def draw_star_rating(draw, start_x, start_y, star_size=10, gap=6, count=5, fill_color=(212, 175, 55, 255)):
    for i in range(count):
        cx = start_x + i * (star_size * 2 + gap) + star_size
        cy = start_y + star_size
        draw_star(draw, cx, cy, star_size, fill_color)

# ==========================================
# AD 1: MINT WELLNESS EDIT (1:1 FEED)
# ==========================================
def create_ad_1_feed(src_path, out_path):
    w, h = 1080, 1080
    bg_color = (244, 217, 219, 255)
    base = Image.new("RGBA", (w, h), bg_color)
    
    src = Image.open(src_path).convert("RGBA")
    crop_box = (15, 200, 665, 780)
    src_cropped = src.crop(crop_box)
    
    target_w = 880
    target_h = int(src_cropped.height * (target_w / src_cropped.width))
    src_resized = src_cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    img_x = (w - target_w) // 2
    img_y = 160
    base.paste(src_resized, (img_x, img_y))

    # Seamless Feather
    gradient = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(gradient)
    for y in range(img_y, img_y + 80):
        alpha = int(255 * (1 - ((y - img_y) / 80)))
        g_draw.line([(0, y), (w, y)], fill=(244, 217, 219, alpha))
    for y in range(img_y + target_h - 80, img_y + target_h + 30):
        progress = max(0, min(1, (y - (img_y + target_h - 80)) / 110))
        alpha = int(255 * progress)
        g_draw.line([(0, y), (w, y)], fill=(244, 217, 219, alpha))
    base.alpha_composite(gradient)

    draw = ImageDraw.Draw(base)
    
    font_brand = get_font("georgiab.ttf", 36)
    font_sub = get_font("segoeuib.ttf", 15)
    font_rating = get_font("segoeui.ttf", 17)
    font_badge = get_font("segoeuib.ttf", 17)
    font_cta = get_font("segoeuib.ttf", 22)
    font_cta_sub = get_font("segoeui.ttf", 14)

    # Header
    brand_text = "M I D N I G H T  B L O O M"
    b_bbox = font_sub.getbbox(brand_text)
    b_w = b_bbox[2] - b_bbox[0]
    draw.text(((w - b_w) // 2, 28), brand_text, fill=(130, 75, 90, 255), font=font_sub)

    head_text = "The Intimate Wellness Edit"
    h_bbox = font_brand.getbbox(head_text)
    h_w = h_bbox[2] - h_bbox[0]
    draw.text(((w - h_w) // 2, 54), head_text, fill=(35, 18, 28, 255), font=font_brand)

    # Star Rating Row
    rating_label = "4.9 / 5  (2,400+ Verified Reviews)"
    rt_b = font_rating.getbbox(rating_label)
    rt_w = rt_b[2] - rt_b[0]
    total_rating_w = 5 * 20 + 4 * 4 + 12 + rt_w
    start_rx = (w - total_rating_w) // 2
    draw_star_rating(draw, start_rx, 98, star_size=9, gap=4, count=5, fill_color=(200, 140, 40, 255))
    draw.text((start_rx + 5 * 20 + 4 * 4 + 12, 98), rating_label, fill=(130, 75, 90, 255), font=font_rating)

    # Floating Discount Badge
    draw_pill(draw, 810, 150, 1020, 205, (185, 28, 70, 255), (255, 255, 255, 255), radius=16, width=2)
    disc_text = "FLAT 40% OFF"
    d_bbox = font_badge.getbbox(disc_text)
    d_w = d_bbox[2] - d_bbox[0]
    draw.text((810 + (210 - d_w) // 2, 166), disc_text, fill=(255, 255, 255, 255), font=font_badge)

    # Floating Feature Badge
    draw_glass_card(base, 55, 150, 310, 205, (255, 255, 255, 225), (240, 210, 220, 255), radius=16, width=1)
    draw = ImageDraw.Draw(base)
    f_text = "100% Medical Silicone"
    f_bbox = font_badge.getbbox(f_text)
    f_w = f_bbox[2] - f_bbox[0]
    draw.text((55 + (255 - f_w) // 2, 166), f_text, fill=(90, 40, 55, 255), font=font_badge)

    # Trust Badges
    b_y = 885
    badge_w = 300
    spacing = 30
    start_x = (w - (badge_w * 3 + spacing * 2)) // 2

    badges = [
        ("100% DISCREET BOX", "Plain Unbranded Outer Carton"),
        ("CASH ON DELIVERY", "Pay safely at your doorstep"),
        ("IPX7 WATERPROOF", "Whisper Quiet & Easy Clean")
    ]

    for idx, (title, subtitle) in enumerate(badges):
        bx = start_x + idx * (badge_w + spacing)
        draw_glass_card(base, bx, b_y, bx + badge_w, b_y + 74, (255, 255, 255, 235), (235, 205, 215, 255), radius=16, width=1)
        draw = ImageDraw.Draw(base)
        
        t_b = font_sub.getbbox(title)
        t_bw = t_b[2] - t_b[0]
        draw.text((bx + (badge_w - t_bw) // 2, b_y + 15), title, fill=(160, 28, 65, 255), font=font_sub)
        
        s_b = font_cta_sub.getbbox(subtitle)
        s_bw = s_b[2] - s_b[0]
        draw.text((bx + (badge_w - s_bw) // 2, b_y + 42), subtitle, fill=(110, 80, 90, 255), font=font_cta_sub)

    # CTA Button
    draw_pill(draw, 140, 980, 940, 1052, (28, 16, 24, 255), (185, 28, 70, 220), radius=36, width=2)
    cta_text = "SHOP THE BESTSELLERS  •  USE CODE: BLOOM40 →"
    c_bbox = font_cta.getbbox(cta_text)
    c_w = c_bbox[2] - c_bbox[0]
    draw.text(((w - c_w) // 2, 1003), cta_text, fill=(255, 235, 240, 255), font=font_cta)

    final_img = base.convert("RGB")
    final_img.save(out_path, "JPEG", quality=95)
    print(f"Saved: {out_path}")


# ==========================================
# AD 2: LUXURY LIFESTYLE CLOSE-UP (1:1 FEED)
# ==========================================
def create_ad_2_feed(src_path, out_path):
    w, h = 1080, 1080
    base = Image.new("RGBA", (w, h), (16, 12, 20, 255))
    
    src = Image.open(src_path).convert("RGBA")
    crop_box = (350, 220, 682, 640)
    src_cropped = src.crop(crop_box)
    
    target_w = 640
    target_h = int(src_cropped.height * (target_w / src_cropped.width))
    src_resized = src_cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    draw = ImageDraw.Draw(base)
    for y in range(h):
        r = int(16 + (32 - 16) * (y / h))
        g = int(10 + (16 - 10) * (y / h))
        b = int(22 + (36 - 22) * (y / h))
        draw.line([(0, y), (w, y)], fill=(r, g, b, 255))

    img_x = (w - target_w) // 2
    img_y = 150
    
    draw_pill(draw, img_x - 6, img_y - 6, img_x + target_w + 6, img_y + target_h + 6, (30, 20, 32, 255), (212, 175, 55, 200), radius=26, width=2)

    mask = Image.new("L", (target_w, target_h), 0)
    m_draw = ImageDraw.Draw(mask)
    m_draw.rounded_rectangle([0, 0, target_w, target_h], radius=20, fill=255)
    base.paste(src_resized, (img_x, img_y), mask)

    draw = ImageDraw.Draw(base)
    
    font_brand = get_font("georgiab.ttf", 36)
    font_sub = get_font("segoeuib.ttf", 15)
    font_rating = get_font("segoeui.ttf", 17)
    font_badge = get_font("segoeuib.ttf", 17)
    font_cta = get_font("segoeuib.ttf", 22)
    font_cta_sub = get_font("segoeui.ttf", 14)

    # Header
    brand_text = "M I D N I G H T  B L O O M"
    b_bbox = font_sub.getbbox(brand_text)
    b_w = b_bbox[2] - b_bbox[0]
    draw.text(((w - b_w) // 2, 28), brand_text, fill=(212, 175, 55, 255), font=font_sub)

    head_text = "Luxury Self-Care Redefined"
    h_bbox = font_brand.getbbox(head_text)
    h_w = h_bbox[2] - h_bbox[0]
    draw.text(((w - h_w) // 2, 54), head_text, fill=(255, 245, 240, 255), font=font_brand)

    # Star Rating Row
    rating_label = "Rated 4.95 / 5 by Luxury Wellness Aficionados"
    rt_b = font_rating.getbbox(rating_label)
    rt_w = rt_b[2] - rt_b[0]
    total_rating_w = 5 * 20 + 4 * 4 + 12 + rt_w
    start_rx = (w - total_rating_w) // 2
    draw_star_rating(draw, start_rx, 98, star_size=9, gap=4, count=5, fill_color=(212, 175, 55, 255))
    draw.text((start_rx + 5 * 20 + 4 * 4 + 12, 98), rating_label, fill=(215, 195, 205, 255), font=font_rating)

    # Floating Discount Badge
    draw_pill(draw, img_x + target_w - 190, img_y + 15, img_x + target_w - 15, img_y + 65, (212, 175, 55, 245), (255, 255, 255, 255), radius=14, width=2)
    disc_text = "SAVE 40% TODAY"
    d_bbox = font_badge.getbbox(disc_text)
    d_w = d_bbox[2] - d_bbox[0]
    draw.text((img_x + target_w - 190 + (175 - d_w) // 2, img_y + 26), disc_text, fill=(20, 12, 18, 255), font=font_badge)

    # Floating Feature Badge
    draw_pill(draw, img_x + 15, img_y + 15, img_x + 230, img_y + 65, (25, 18, 28, 220), (212, 175, 55, 160), radius=14, width=1)
    feat_t = "10 Ergonomic Modes"
    f_b = font_sub.getbbox(feat_t)
    f_bw = f_b[2] - f_b[0]
    draw.text((img_x + 15 + (215 - f_bw) // 2, img_y + 27), feat_t, fill=(235, 210, 160, 255), font=font_sub)

    # Trust Badges
    b_y = 885
    badge_w = 300
    spacing = 30
    start_x = (w - (badge_w * 3 + spacing * 2)) // 2

    badges = [
        ("DISCREET DELIVERY", "Zero Product Mentions on Box"),
        ("CASH ON DELIVERY", "Pay safely upon delivery"),
        ("1-YEAR WARRANTY", "100% Replacement Guarantee")
    ]

    for idx, (title, subtitle) in enumerate(badges):
        bx = start_x + idx * (badge_w + spacing)
        draw_pill(draw, bx, b_y, bx + badge_w, b_y + 74, (36, 22, 34, 235), (100, 70, 90, 200), radius=16, width=1)
        
        t_b = font_sub.getbbox(title)
        t_bw = t_b[2] - t_b[0]
        draw.text((bx + (badge_w - t_bw) // 2, b_y + 15), title, fill=(235, 210, 160, 255), font=font_sub)
        
        s_b = font_cta_sub.getbbox(subtitle)
        s_bw = s_b[2] - s_b[0]
        draw.text((bx + (badge_w - s_bw) // 2, b_y + 42), subtitle, fill=(195, 175, 185, 255), font=font_cta_sub)

    # Bottom CTA Bar (Gold)
    draw_pill(draw, 140, 980, 940, 1052, (212, 175, 55, 255), (255, 240, 180, 255), radius=36, width=2)
    cta_text = "EXPLORE THE PRIVATE COLLECTION →"
    c_bbox = font_cta.getbbox(cta_text)
    c_w = c_bbox[2] - c_bbox[0]
    draw.text(((w - c_w) // 2, 1003), cta_text, fill=(20, 12, 18, 255), font=font_cta)

    final_img = base.convert("RGB")
    final_img.save(out_path, "JPEG", quality=95)
    print(f"Saved: {out_path}")


# ==========================================
# AD 3: CURATED WELLNESS ESSENTIALS (1:1 FEED)
# ==========================================
def create_ad_3_feed(src_path, out_path):
    w, h = 1080, 1080
    bg_color = (246, 224, 226, 255)
    base = Image.new("RGBA", (w, h), bg_color)
    
    src = Image.open(src_path).convert("RGBA")
    crop_box = (20, 500, 670, 950)
    src_cropped = src.crop(crop_box)

    target_w = 840
    target_h = int(src_cropped.height * (target_w / src_cropped.width))
    src_resized = src_cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    img_x = (w - target_w) // 2
    img_y = 200
    base.paste(src_resized, (img_x, img_y))

    # Seamless Feather Gradients
    gradient = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(gradient)
    for y in range(img_y, img_y + 80):
        alpha = int(255 * (1 - ((y - img_y) / 80)))
        g_draw.line([(0, y), (w, y)], fill=(246, 224, 226, alpha))
    for y in range(img_y + target_h - 80, img_y + target_h + 30):
        progress = max(0, min(1, (y - (img_y + target_h - 80)) / 110))
        alpha = int(255 * progress)
        g_draw.line([(0, y), (w, y)], fill=(246, 224, 226, alpha))
    base.alpha_composite(gradient)

    draw = ImageDraw.Draw(base)
    
    font_brand = get_font("georgiab.ttf", 36)
    font_sub = get_font("segoeuib.ttf", 15)
    font_rating = get_font("segoeui.ttf", 17)
    font_badge = get_font("segoeuib.ttf", 17)
    font_cta = get_font("segoeuib.ttf", 22)
    font_cta_sub = get_font("segoeui.ttf", 14)

    # Header
    brand_text = "M I D N I G H T  B L O O M"
    b_bbox = font_sub.getbbox(brand_text)
    b_w = b_bbox[2] - b_bbox[0]
    draw.text(((w - b_w) // 2, 28), brand_text, fill=(130, 75, 90, 255), font=font_sub)

    head_text = "Curated Wellness Essentials"
    h_bbox = font_brand.getbbox(head_text)
    h_w = h_bbox[2] - h_bbox[0]
    draw.text(((w - h_w) // 2, 54), head_text, fill=(35, 18, 28, 255), font=font_brand)

    # Star Rating Row
    rating_label = "4.9 / 5  (1,850+ Verified Reviews)"
    rt_b = font_rating.getbbox(rating_label)
    rt_w = rt_b[2] - rt_b[0]
    total_rating_w = 5 * 20 + 4 * 4 + 12 + rt_w
    start_rx = (w - total_rating_w) // 2
    draw_star_rating(draw, start_rx, 98, star_size=9, gap=4, count=5, fill_color=(200, 140, 40, 255))
    draw.text((start_rx + 5 * 20 + 4 * 4 + 12, 98), rating_label, fill=(130, 75, 90, 255), font=font_rating)

    # Badges
    draw_pill(draw, 810, 150, 1020, 205, (185, 28, 70, 255), (255, 255, 255, 255), radius=16, width=2)
    disc_text = "STARTING ₹1,499"
    d_bbox = font_badge.getbbox(disc_text)
    d_w = d_bbox[2] - d_bbox[0]
    draw.text((810 + (210 - d_w) // 2, 166), disc_text, fill=(255, 255, 255, 255), font=font_badge)

    draw_glass_card(base, 55, 150, 310, 205, (255, 255, 255, 225), (240, 210, 220, 255), radius=16, width=1)
    draw = ImageDraw.Draw(base)
    f_text = "Free COD Shipping"
    f_bbox = font_badge.getbbox(f_text)
    f_w = f_bbox[2] - f_bbox[0]
    draw.text((55 + (255 - f_w) // 2, 166), f_text, fill=(90, 40, 55, 255), font=font_badge)

    # 3 Trust Badges
    b_y = 885
    badge_w = 300
    spacing = 30
    start_x = (w - (badge_w * 3 + spacing * 2)) // 2

    badges = [
        ("100% DISCREET BOX", "Unbranded Brown Outer Box"),
        ("CASH ON DELIVERY", "Pay safely at your doorstep"),
        ("100% WATERPROOF", "Easy Clean & Rechargeable")
    ]

    for idx, (title, subtitle) in enumerate(badges):
        bx = start_x + idx * (badge_w + spacing)
        draw_glass_card(base, bx, b_y, bx + badge_w, b_y + 74, (255, 255, 255, 235), (235, 205, 215, 255), radius=16, width=1)
        draw = ImageDraw.Draw(base)
        
        t_b = font_sub.getbbox(title)
        t_bw = t_b[2] - t_b[0]
        draw.text((bx + (badge_w - t_bw) // 2, b_y + 15), title, fill=(160, 28, 65, 255), font=font_sub)
        
        s_b = font_cta_sub.getbbox(subtitle)
        s_bw = s_b[2] - s_b[0]
        draw.text((bx + (badge_w - s_bw) // 2, b_y + 42), subtitle, fill=(110, 80, 90, 255), font=font_cta_sub)

    # CTA Button
    draw_pill(draw, 140, 980, 940, 1052, (28, 16, 24, 255), (185, 28, 70, 220), radius=36, width=2)
    cta_text = "SHOP BESTSELLING ESSENTIALS →"
    c_bbox = font_cta.getbbox(cta_text)
    c_w = c_bbox[2] - c_bbox[0]
    draw.text(((w - c_w) // 2, 1003), cta_text, fill=(255, 235, 240, 255), font=font_cta)

    final_img = base.convert("RGB")
    final_img.save(out_path, "JPEG", quality=95)
    print(f"Saved: {out_path}")


# ==========================================
# STORY ADS (9:16 - 1080x1920)
# ==========================================
def create_ad_1_story(src_path, out_path):
    w, h = 1080, 1920
    bg_color = (244, 217, 219, 255)
    base = Image.new("RGBA", (w, h), bg_color)
    
    src = Image.open(src_path).convert("RGBA")
    crop_box = (15, 200, 665, 780)
    src_cropped = src.crop(crop_box)
    
    target_w = 900
    target_h = int(src_cropped.height * (target_w / src_cropped.width))
    src_resized = src_cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    img_x = (w - target_w) // 2
    img_y = 350
    base.paste(src_resized, (img_x, img_y))

    gradient = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(gradient)
    for y in range(img_y, img_y + 100):
        alpha = int(255 * (1 - ((y - img_y) / 100)))
        g_draw.line([(0, y), (w, y)], fill=(244, 217, 219, alpha))
    for y in range(img_y + target_h - 100, img_y + target_h + 40):
        progress = max(0, min(1, (y - (img_y + target_h - 100)) / 140))
        alpha = int(255 * progress)
        g_draw.line([(0, y), (w, y)], fill=(244, 217, 219, alpha))
    base.alpha_composite(gradient)

    draw = ImageDraw.Draw(base)

    font_brand = get_font("georgiab.ttf", 46)
    font_sub = get_font("segoeuib.ttf", 20)
    font_rating = get_font("segoeui.ttf", 22)
    font_badge = get_font("segoeuib.ttf", 22)
    font_cta = get_font("segoeuib.ttf", 28)
    font_cta_sub = get_font("segoeui.ttf", 18)

    # Brand Pill
    draw_glass_card(base, 310, 100, 770, 155, (255, 255, 255, 220), (220, 180, 190, 200), radius=28, width=1)
    draw = ImageDraw.Draw(base)
    brand_text = "M I D N I G H T  B L O O M"
    b_bbox = font_sub.getbbox(brand_text)
    b_w = b_bbox[2] - b_bbox[0]
    draw.text((310 + (460 - b_w) // 2, 116), brand_text, fill=(130, 75, 90, 255), font=font_sub)

    # Headline
    head_text = "The Intimate Wellness Edit"
    h_bbox = font_brand.getbbox(head_text)
    h_w = h_bbox[2] - h_bbox[0]
    draw.text(((w - h_w) // 2, 175), head_text, fill=(35, 18, 28, 255), font=font_brand)

    # Rating
    rating_label = "4.9 / 5  (2,400+ Verified Reviews)"
    rt_b = font_rating.getbbox(rating_label)
    rt_w = rt_b[2] - rt_b[0]
    total_rating_w = 5 * 24 + 4 * 6 + 14 + rt_w
    start_rx = (w - total_rating_w) // 2
    draw_star_rating(draw, start_rx, 235, star_size=11, gap=6, count=5, fill_color=(200, 140, 40, 255))
    draw.text((start_rx + 5 * 24 + 4 * 6 + 14, 235), rating_label, fill=(130, 75, 90, 255), font=font_rating)

    # Discount Pill (Top Right)
    draw_pill(draw, 780, 290, 1020, 355, (185, 28, 70, 255), (255, 255, 255, 255), radius=18, width=2)
    disc_text = "FLAT 40% OFF"
    d_bbox = font_badge.getbbox(disc_text)
    d_w = d_bbox[2] - d_bbox[0]
    draw.text((780 + (240 - d_w) // 2, 310), disc_text, fill=(255, 255, 255, 255), font=font_badge)

    # 4 Trust Pills (2x2 Grid)
    grid_y = 1240
    card_w = 420
    card_h = 98
    gx1 = (w - (card_w * 2 + 40)) // 2
    gx2 = gx1 + card_w + 40
    
    badges = [
        ("100% DISCREET BOX", "Plain Outer Box, No Mention"),
        ("CASH ON DELIVERY", "Pay safely at doorstep"),
        ("BODY-SAFE SILICONE", "Medical Grade & Ultra Soft"),
        ("100% WATERPROOF", "Whisper Quiet & Easy Clean")
    ]

    positions = [(gx1, grid_y), (gx2, grid_y), (gx1, grid_y + card_h + 20), (gx2, grid_y + card_h + 20)]

    for idx, (title, subtitle) in enumerate(badges):
        bx, by = positions[idx]
        draw_glass_card(base, bx, by, bx + card_w, by + card_h, (255, 255, 255, 235), (235, 205, 215, 255), radius=18, width=1)
        draw = ImageDraw.Draw(base)
        
        t_b = font_sub.getbbox(title)
        t_bw = t_b[2] - t_b[0]
        draw.text((bx + (card_w - t_bw) // 2, by + 22), title, fill=(160, 28, 65, 255), font=font_sub)
        
        s_b = font_cta_sub.getbbox(subtitle)
        s_bw = s_b[2] - s_b[0]
        draw.text((bx + (card_w - s_bw) // 2, by + 54), subtitle, fill=(110, 80, 90, 255), font=font_cta_sub)

    # CTA Bar
    cta_y = grid_y + card_h * 2 + 45
    draw_pill(draw, 120, cta_y, 960, cta_y + 85, (28, 16, 24, 255), (185, 28, 70, 220), radius=42, width=2)
    cta_text = "SWIPE UP / TAP TO SHOP NOW  →"
    c_bbox = font_cta.getbbox(cta_text)
    c_w = c_bbox[2] - c_bbox[0]
    draw.text(((w - c_w) // 2, cta_y + 26), cta_text, fill=(255, 235, 240, 255), font=font_cta)

    final_img = base.convert("RGB")
    final_img.save(out_path, "JPEG", quality=95)
    print(f"Saved: {out_path}")


def create_ad_2_story(src_path, out_path):
    w, h = 1080, 1920
    base = Image.new("RGBA", (w, h), (16, 12, 20, 255))
    
    src = Image.open(src_path).convert("RGBA")
    crop_box = (350, 220, 682, 640)
    src_cropped = src.crop(crop_box)
    
    target_w = 680
    target_h = int(src_cropped.height * (target_w / src_cropped.width))
    src_resized = src_cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    draw = ImageDraw.Draw(base)
    for y in range(h):
        r = int(16 + (32 - 16) * (y / h))
        g = int(10 + (16 - 10) * (y / h))
        b = int(22 + (36 - 22) * (y / h))
        draw.line([(0, y), (w, y)], fill=(r, g, b, 255))

    img_x = (w - target_w) // 2
    img_y = 330

    border_pad = 8
    draw_pill(draw, img_x - border_pad, img_y - border_pad, img_x + target_w + border_pad, img_y + target_h + border_pad, (30, 20, 32, 255), (212, 175, 55, 200), radius=28, width=2)

    mask = Image.new("L", (target_w, target_h), 0)
    m_draw = ImageDraw.Draw(mask)
    m_draw.rounded_rectangle([0, 0, target_w, target_h], radius=22, fill=255)
    base.paste(src_resized, (img_x, img_y), mask)

    draw = ImageDraw.Draw(base)

    font_brand = get_font("georgiab.ttf", 46)
    font_sub = get_font("segoeuib.ttf", 20)
    font_rating = get_font("segoeui.ttf", 22)
    font_badge = get_font("segoeuib.ttf", 22)
    font_cta = get_font("segoeuib.ttf", 28)
    font_cta_sub = get_font("segoeui.ttf", 18)

    # Brand Pill
    draw_pill(draw, 310, 100, 770, 155, (38, 24, 35, 230), (212, 175, 55, 180), radius=28, width=1)
    brand_text = "M I D N I G H T  B L O O M"
    b_bbox = font_sub.getbbox(brand_text)
    b_w = b_bbox[2] - b_bbox[0]
    draw.text((310 + (460 - b_w) // 2, 116), brand_text, fill=(235, 210, 160, 255), font=font_sub)

    # Headline
    head_text = "Luxury Self-Care Redefined"
    h_bbox = font_brand.getbbox(head_text)
    h_w = h_bbox[2] - h_bbox[0]
    draw.text(((w - h_w) // 2, 175), head_text, fill=(255, 245, 240, 255), font=font_brand)

    # Rating
    rating_label = "Rated 4.95 / 5 by Luxury Wellness Aficionados"
    rt_b = font_rating.getbbox(rating_label)
    rt_w = rt_b[2] - rt_b[0]
    total_rating_w = 5 * 24 + 4 * 6 + 14 + rt_w
    start_rx = (w - total_rating_w) // 2
    draw_star_rating(draw, start_rx, 235, star_size=11, gap=6, count=5, fill_color=(212, 175, 55, 255))
    draw.text((start_rx + 5 * 24 + 4 * 6 + 14, 235), rating_label, fill=(215, 195, 205, 255), font=font_rating)

    # Discount Pill
    draw_pill(draw, 780, 290, 1020, 355, (212, 175, 55, 245), (255, 255, 255, 255), radius=18, width=2)
    disc_text = "SAVE 40% TODAY"
    d_bbox = font_badge.getbbox(disc_text)
    d_w = d_bbox[2] - d_bbox[0]
    draw.text((780 + (240 - d_w) // 2, 310), disc_text, fill=(20, 12, 18, 255), font=font_badge)

    # 4 Trust Pills (2x2 Grid)
    grid_y = 1260
    card_w = 420
    card_h = 98
    gx1 = (w - (card_w * 2 + 40)) // 2
    gx2 = gx1 + card_w + 40
    
    badges = [
        ("DISCREET DELIVERY", "Zero Product Labels on Box"),
        ("CASH ON DELIVERY", "Pay safely at doorstep"),
        ("BODY-SAFE SILICONE", "Medical Grade & Velvet Soft"),
        ("1-YEAR WARRANTY", "100% Replacement Guarantee")
    ]

    positions = [(gx1, grid_y), (gx2, grid_y), (gx1, grid_y + card_h + 20), (gx2, grid_y + card_h + 20)]

    for idx, (title, subtitle) in enumerate(badges):
        bx, by = positions[idx]
        draw_pill(draw, bx, by, bx + card_w, by + card_h, (36, 22, 34, 235), (100, 70, 90, 200), radius=18, width=1)
        
        t_b = font_sub.getbbox(title)
        t_bw = t_b[2] - t_b[0]
        draw.text((bx + (card_w - t_bw) // 2, by + 22), title, fill=(235, 210, 160, 255), font=font_sub)
        
        s_b = font_cta_sub.getbbox(subtitle)
        s_bw = s_b[2] - s_b[0]
        draw.text((bx + (card_w - s_bw) // 2, by + 54), subtitle, fill=(195, 175, 185, 255), font=font_cta_sub)

    # CTA Bar (Gold)
    cta_y = grid_y + card_h * 2 + 45
    draw_pill(draw, 120, cta_y, 960, cta_y + 85, (212, 175, 55, 255), (255, 240, 180, 255), radius=42, width=2)
    cta_text = "SWIPE UP / TAP TO SHOP NOW  →"
    c_bbox = font_cta.getbbox(cta_text)
    c_w = c_bbox[2] - c_bbox[0]
    draw.text(((w - c_w) // 2, cta_y + 26), cta_text, fill=(20, 12, 18, 255), font=font_cta)

    final_img = base.convert("RGB")
    final_img.save(out_path, "JPEG", quality=95)
    print(f"Saved: {out_path}")

def create_ad_3_story(src_path, out_path):
    w, h = 1080, 1920
    bg_color = (246, 224, 226, 255)
    base = Image.new("RGBA", (w, h), bg_color)
    
    src = Image.open(src_path).convert("RGBA")
    crop_box = (20, 500, 670, 950)
    src_cropped = src.crop(crop_box)
    
    target_w = 900
    target_h = int(src_cropped.height * (target_w / src_cropped.width))
    src_resized = src_cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    img_x = (w - target_w) // 2
    img_y = 380
    base.paste(src_resized, (img_x, img_y))

    gradient = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(gradient)
    for y in range(img_y, img_y + 100):
        alpha = int(255 * (1 - ((y - img_y) / 100)))
        g_draw.line([(0, y), (w, y)], fill=(246, 224, 226, alpha))
    for y in range(img_y + target_h - 100, img_y + target_h + 40):
        progress = max(0, min(1, (y - (img_y + target_h - 100)) / 140))
        alpha = int(255 * progress)
        g_draw.line([(0, y), (w, y)], fill=(246, 224, 226, alpha))
    base.alpha_composite(gradient)

    draw = ImageDraw.Draw(base)

    font_brand = get_font("georgiab.ttf", 46)
    font_sub = get_font("segoeuib.ttf", 20)
    font_rating = get_font("segoeui.ttf", 22)
    font_badge = get_font("segoeuib.ttf", 22)
    font_cta = get_font("segoeuib.ttf", 28)
    font_cta_sub = get_font("segoeui.ttf", 18)

    # Brand Pill
    draw_glass_card(base, 310, 100, 770, 155, (255, 255, 255, 220), (220, 180, 190, 200), radius=28, width=1)
    draw = ImageDraw.Draw(base)
    brand_text = "M I D N I G H T  B L O O M"
    b_bbox = font_sub.getbbox(brand_text)
    b_w = b_bbox[2] - b_bbox[0]
    draw.text((310 + (460 - b_w) // 2, 116), brand_text, fill=(130, 75, 90, 255), font=font_sub)

    # Headline
    head_text = "Curated Wellness Essentials"
    h_bbox = font_brand.getbbox(head_text)
    h_w = h_bbox[2] - h_bbox[0]
    draw.text(((w - h_w) // 2, 175), head_text, fill=(35, 18, 28, 255), font=font_brand)

    # Rating
    rating_label = "4.9 / 5  (1,850+ Verified Reviews)"
    rt_b = font_rating.getbbox(rating_label)
    rt_w = rt_b[2] - rt_b[0]
    total_rating_w = 5 * 24 + 4 * 6 + 14 + rt_w
    start_rx = (w - total_rating_w) // 2
    draw_star_rating(draw, start_rx, 235, star_size=11, gap=6, count=5, fill_color=(200, 140, 40, 255))
    draw.text((start_rx + 5 * 24 + 4 * 6 + 14, 235), rating_label, fill=(130, 75, 90, 255), font=font_rating)

    # Discount Pill
    draw_pill(draw, 780, 290, 1020, 355, (185, 28, 70, 255), (255, 255, 255, 255), radius=18, width=2)
    disc_text = "STARTING ₹1,499"
    d_bbox = font_badge.getbbox(disc_text)
    d_w = d_bbox[2] - d_bbox[0]
    draw.text((780 + (240 - d_w) // 2, 310), disc_text, fill=(255, 255, 255, 255), font=font_badge)

    # Feature Bullet Highlight Bar
    draw_glass_card(base, 140, 1040, 940, 1160, (255, 255, 255, 230), (235, 205, 215, 255), radius=22, width=1)
    draw = ImageDraw.Draw(base)
    feat_line1 = "100% Medical Silicone  •  Whisper Quiet  •  Rechargeable"
    fl1_b = font_sub.getbbox(feat_line1)
    fl1_w = fl1_b[2] - fl1_b[0]
    draw.text(((w - fl1_w) // 2, 1060), feat_line1, fill=(130, 60, 80, 255), font=font_sub)

    feat_line2 = "Shipped in 100% unmarked brown discreet packaging"
    fl2_b = font_cta_sub.getbbox(feat_line2)
    fl2_w = fl2_b[2] - fl2_b[0]
    draw.text(((w - fl2_w) // 2, 1105), feat_line2, fill=(110, 80, 90, 255), font=font_cta_sub)

    # 4 Trust Pills (2x2 Grid)
    grid_y = 1230
    card_w = 420
    card_h = 98
    gx1 = (w - (card_w * 2 + 40)) // 2
    gx2 = gx1 + card_w + 40
    
    badges = [
        ("100% DISCREET BOX", "Unbranded Brown Outer Box"),
        ("FREE COD SHIPPING", "Pay safely at your doorstep"),
        ("100% WATERPROOF", "Easy Clean & Rechargeable"),
        ("BODY-SAFE SILICONE", "Medical Grade & Soft Touch")
    ]

    positions = [(gx1, grid_y), (gx2, grid_y), (gx1, grid_y + card_h + 20), (gx2, grid_y + card_h + 20)]

    for idx, (title, subtitle) in enumerate(badges):
        bx, by = positions[idx]
        draw_glass_card(base, bx, by, bx + card_w, by + card_h, (255, 255, 255, 235), (235, 205, 215, 255), radius=18, width=1)
        draw = ImageDraw.Draw(base)
        
        t_b = font_sub.getbbox(title)
        t_bw = t_b[2] - t_b[0]
        draw.text((bx + (card_w - t_bw) // 2, by + 22), title, fill=(160, 28, 65, 255), font=font_sub)
        
        s_b = font_cta_sub.getbbox(subtitle)
        s_bw = s_b[2] - s_b[0]
        draw.text((bx + (card_w - s_bw) // 2, by + 54), subtitle, fill=(110, 80, 90, 255), font=font_cta_sub)

    # CTA Bar
    cta_y = grid_y + card_h * 2 + 45
    draw_pill(draw, 120, cta_y, 960, cta_y + 85, (28, 16, 24, 255), (185, 28, 70, 220), radius=42, width=2)
    cta_text = "SWIPE UP / TAP TO SHOP NOW  →"
    c_bbox = font_cta.getbbox(cta_text)
    c_w = c_bbox[2] - c_bbox[0]
    draw.text(((w - c_w) // 2, cta_y + 26), cta_text, fill=(255, 235, 240, 255), font=font_cta)

    final_img = base.convert("RGB")
    final_img.save(out_path, "JPEG", quality=95)
    print(f"Saved: {out_path}")

if __name__ == "__main__":
    img1 = r"C:\Users\20092\.gemini\antigravity\brain\e8f01de8-8d5e-4112-84e4-02f1b613f50d\.user_uploaded\media_1791038633944.jpg"
    img2 = r"C:\Users\20092\.gemini\antigravity\brain\e8f01de8-8d5e-4112-84e4-02f1b613f50d\.user_uploaded\media_1791038672388.jpg"
    img3 = r"C:\Users\20092\.gemini\antigravity\brain\e8f01de8-8d5e-4112-84e4-02f1b613f50d\.user_uploaded\media_1791038633915.jpg"

    os.makedirs("public/ads", exist_ok=True)
    
    # Generate 1:1 Feed Creatives (1080x1080)
    create_ad_1_feed(img1, "public/ads/ad_1_mint_feed.jpg")
    create_ad_2_feed(img2, "public/ads/ad_2_luxury_lifestyle_feed.jpg")
    create_ad_3_feed(img3, "public/ads/ad_3_pastel_bundle_feed.jpg")

    # Generate 9:16 Story Creatives (1080x1920)
    create_ad_1_story(img1, "public/ads/ad_1_mint_story.jpg")
    create_ad_2_story(img2, "public/ads/ad_2_lifestyle_story.jpg")
    create_ad_3_story(img3, "public/ads/ad_3_bundle_story.jpg")
