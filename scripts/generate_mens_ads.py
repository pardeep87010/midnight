import os
import shutil
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from generate_meta_feed_ads import create_meta_feed_ad, create_portrait_4_5_ad, get_font, draw_pill, draw_star_rating

def generate_mens_ads():
    mens_src = "public/ads/ad_creative_3_mens.jpg"
    if not os.path.exists(mens_src):
        print("Men src not found")
        return

    trust_men = ["100% DISCREET PACKAGING", "CASH ON DELIVERY", "1-YEAR REPLACEMENT WARRANTY"]

    # 1:1 Feed Ad for Men
    create_meta_feed_ad(
        mens_src, "public/ads/ad_mens_feed.jpg",
        headline="Precision Intimate Wellness for Men",
        sub_benefit="Rated 4.9 / 5 by Modern Gentlemen Across India",
        discount_text="FLAT 40% OFF",
        trust_points=trust_men,
        theme="dark",
        crop_rect=None
    )

    # 4:5 Portrait Feed Ad for Men
    create_portrait_4_5_ad(
        mens_src, "public/ads/ad_mens_portrait.jpg",
        headline="Precision Intimate Wellness for Men",
        sub_benefit="Rated 4.9 / 5 by Modern Gentlemen Across India",
        discount_text="FLAT 40% OFF",
        trust_points=trust_men,
        theme="dark",
        crop_rect=None
    )

    dest_dir = r"C:\Users\20092\.gemini\antigravity\brain\e8f01de8-8d5e-4112-84e4-02f1b613f50d"
    shutil.copy("public/ads/ad_mens_feed.jpg", os.path.join(dest_dir, "ad_mens_feed.jpg"))
    shutil.copy("public/ads/ad_mens_portrait.jpg", os.path.join(dest_dir, "ad_mens_portrait.jpg"))
    print("Men ads generated successfully!")

if __name__ == "__main__":
    generate_mens_ads()
