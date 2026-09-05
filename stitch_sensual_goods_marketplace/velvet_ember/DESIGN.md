---
name: Velvet & Ember
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#37393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#d7c1c3'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#9f8c8e'
  outline-variant: '#524345'
  surface-tint: '#ffb2bc'
  primary: '#ffb2bc'
  on-primary: '#551e29'
  primary-container: '#c77b86'
  on-primary-container: '#4c1722'
  inverse-primary: '#8c4b55'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#98d4a8'
  on-tertiary: '#00391d'
  tertiary-container: '#649d75'
  on-tertiary-container: '#003118'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffd9dd'
  primary-fixed-dim: '#ffb2bc'
  on-primary-fixed: '#3a0915'
  on-primary-fixed-variant: '#70343e'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#b4f1c3'
  tertiary-fixed-dim: '#98d4a8'
  on-tertiary-fixed: '#00210e'
  on-tertiary-fixed-variant: '#16512f'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
  matte-black: '#1A1A1A'
  rose-gold: '#B76E79'
  onyx-surface: '#242424'
  obsidian-container: '#121212'
  muted-gold: '#8E565E'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 32px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.1em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 80px
  section-gap: 160px
  container-max: 1440px
---

## Brand & Style

This design system embodies the essence of "Modern Opulence." It is crafted for a discerning audience that seeks exclusivity, sophistication, and a high-end sensory experience. The brand personality is poised, mysterious, and unapologetically luxurious, leaning into a **Minimalist / High-Contrast** aesthetic that prioritizes quality over quantity.

The visual narrative is driven by the juxtaposition of "Matte" and "Metallic." By using heavy whitespace (or "blackspace"), the design creates a digital environment that feels like a private gallery or a luxury boutique at midnight. Every interaction should feel deliberate and weighted, evoking an emotional response of calm confidence and prestige.

## Colors

The palette is strictly dark-mode by default to maintain the "Midnight" allure.

- **Primary (Rose Gold):** This is the "Ember" of the system. It is used sparingly for high-impact brand moments, primary calls to action, and critical highlights. It represents the glow of luxury against the dark.
- **Secondary (Matte Black):** The foundation of the system. It provides a deep, non-reflective base that allows other elements to breathe and the Rose Gold to shimmer.
- **Neutral (White/High-Contrast):** Pure white is used exclusively for typography and essential iconography to ensure maximum readability and a crisp, modern finish.

**Functional Application:**
- Surfaces use "Onyx" (#242424) to create subtle separation from the "Matte Black" background.
- Interactive states for Rose Gold elements should transition to a deeper "Muted Gold" or utilize a soft glow rather than a traditional brightness shift.

## Typography

The typographic strategy relies on a dramatic contrast between high-fashion Serifs and utilitarian Sans-Serifs.

- **Playfair Display (Headlines):** Used for all display and headline levels. The high contrast of this font family mimics the look of mastheads in luxury editorial magazines. It should be typeset with tight tracking for larger sizes to emphasize its elegance.
- **Inter (Body & UI):** Chosen for its clinical precision and exceptional readability. It acts as the functional anchor, ensuring that even in a high-fashion environment, information remains accessible and clear.
- **Styling Note:** Labels and small navigation items should frequently use Inter in Uppercase with increased letter spacing to create a "technical luxury" feel.

## Layout & Spacing

This design system employs a **Fixed Grid** philosophy on desktop to ensure a curated, editorial composition that never feels over-stretched.

- **Philosophy:** Spacing is used as a luxury commodity. Generous "Section Gaps" (160px) are used to separate content blocks, forcing the user to slow down and appreciate each element.
- **Grid:** A 12-column grid on desktop with wide margins (80px) provides a centered, cinematic focus. Mobile layouts shift to a fluid 4-column grid with a 20px safety margin.
- **Rhythm:** All spatial relationships are built on an 8px scale. Component internal padding should favor "airy" vertical spacing (e.g., 24px top/bottom) to maintain the premium aesthetic.

## Elevation & Depth

In a matte black environment, elevation is conveyed through **Tonal Layers** and **Subtle Sheen** rather than traditional dropshadows.

- **Tonal Tiers:** The background is #1A1A1A. Surface containers (cards, menus) use #242424. This subtle shift creates depth without introducing visual noise.
- **Outer Glow:** Instead of shadows, primary interactive elements (like active buttons) may use a very faint Rose Gold outer glow (15% opacity, 30px blur) to simulate the light of an ember.
- **Hairline Outlines:** To define boundaries without weight, use 1px solid borders in #333333. For high-importance containers, a 1px Rose Gold border at 30% opacity provides a "jewelry-like" frame.
- **Backdrop Blurs:** For overlays and modals, use a high-density backdrop blur (20px+) with a semi-transparent Matte Black fill to maintain focus while suggesting depth.

## Shapes

The shape language is **Soft (Level 1)**, leaning toward a sharp, architectural look.

- **Primary UI:** Buttons and inputs use a 0.25rem (4px) radius. This small roundness removes the "aggression" of pure sharp corners while maintaining a sophisticated, structured silhouette.
- **Large Containers:** Product cards and hero sections may scale up to `rounded-lg` (0.5rem) to provide a subtle hint of organic softness, but should never appear "bubbly."
- **Icons:** Use sharp, geometric icons with a 1.5px or 2px stroke weight to match the architectural feel of the UI.

## Components

- **Buttons:** 
    - **Primary:** Solid Rose Gold (#B76E79) with Matte Black text. The finish should appear "satin." 
    - **Secondary:** Outlined with a 1px Rose Gold border and white text. 
    - **Ghost:** White text with a Rose Gold underline that expands on hover.
- **Input Fields:** Minimalist design. A bottom-only border in #333333 that transforms into a full 1px Rose Gold outline upon focus. Placeholders should be in a muted grey to ensure the user's input (in white) is the hero.
- **Cards:** Use the Onyx Surface (#242424) for the container. Images should occupy the majority of the card area. Typography on cards should be limited to a Playfair headline and a small Inter label.
- **Lists:** High-contrast separators using 1px lines in #242424. Use Rose Gold for bullet points or "chevron-right" indicators to draw the eye.
- **Selection Controls:** Checkboxes and Radio buttons should be Rose Gold when selected. The "unselected" state should be a simple #333333 outline to remain "invisible" until needed.
- **Navigation:** Top navigation should be sticky with a 90% opaque Matte Black background and a Backdrop Blur, creating a high-end "frosted" glass effect as users scroll through content.