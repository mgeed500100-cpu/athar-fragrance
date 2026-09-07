# أثر | Athar Fragrance

Status: foundation and initial Fragrance Journey implementation; not marketplace-ready.

## Approved direction

Luxury Arabian Fragrance × Modern Editorial E-commerce. Standalone from Nasaq One.
Target perfumes, oud, incense, luxury care and gifts. Spacious layouts, strong Arabic
typography, subtle radii, large product photography, very limited gold.

Palette sequence: Cream #F3EFE5 → Rose #D9AAA8 → Amber #A87545 →
Burgundy #5A1825 → Night #11100F. Amber uses dark text for legibility.

## Signature feature (non-negotiable)

A bottle remains sticky only within a dedicated section. Scroll switches between
fresh/floral/woody/oud/night scenes. Each scene has its own image, title, story,
top/heart/base notes and optional product link. Bottle and background crossfade.
No page-wide scroll capture. No 15 compulsory screens for five sets of three notes.
Single-scene, missing-image, no-JS, reduced-motion and short-screen layouts must work.
Use merchant-owned transparent images; no external brand photography bundled.

## Homepage roadmap

1. Adaptive transparent header: desktop 80→64px, mobile 60px, search/cart/account.
2. Cinematic hero: Arabic heading, 2–3 bottle composition, CTA, optional genuine product mini-card.
3. Quiet benefits marquee: merchant-controlled claims and pause/reduced-motion behavior.
4. Best sellers: custom cards, 4:5 media, genuine rating/price, wishlist and quick add.
5. Scent bento: oud, musk, amber, floral, fresh; asymmetric desktop, responsive mobile.
6. Full-width editorial campaign.
7. Fragrance Journey (initial implementation in this foundation).
8. New arrivals with alternate layout.
9. Gift sets: large feature + supporting cards, actual store gift/bundle functionality.
10. Featured product story with real product data.
11. Reviews: readable static/scroll-snap cards, no fabricated endorsements.
12. Editorial UGC using licensed/merchant-owned media.
13. Newsletter only when a working subscription integration exists.
14. Luxury footer with valid navigation, policies, social and actual payment options.

## Commercial requirements

All components remain reorderable/removable from the editor. Homepage color changes
must not depend on fixed section indices. Future adaptive header should use explicit
section contrast tokens, including when components are repeated or reordered.
Product/collection/search/cart/account pages must receive the same visual system.
Simple products can quick-add; options/variants must follow Salla's selection flow.
Do not fetch each card's product individually. Hide missing optional data.

## Architecture

- `twilight.json`: metadata and merchant fields.
- `src/views/components/home/athar-journey.twig`: optional storytelling component.
- `src/assets/js/athar/fragrance-journey.js`: lifecycle-safe custom element.
- `src/assets/styles/06-athar/journey.scss`: scoped responsive/reduced-motion styles.
- Existing `home.js` and `app.scss`: minimal additive imports.
- Existing commerce code, hooks and template paths are preserved.
- `public/`: production build output only; do not hand-edit bundles.

## Delivery stages

- Foundation: metadata, repository documentation, journey component and checks.
- Visual build: hero/header/cards/bento and imagery, then remaining home sections.
- Commerce integration: live product data and complete product/collection/cart QA.
- Release: RTL/LTR, Safari/mobile, editor settings, accessibility, performance,
  screenshots, help guide, support details and marketplace submission.

No claim of Salla import acceptance, visual quality or marketplace readiness without live verification.
