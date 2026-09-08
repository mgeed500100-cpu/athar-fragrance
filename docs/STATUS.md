# v0.2 verification and limitations

- Automatic homepage uses bundled original artwork. Existing merchant components remain available behind the athar_auto_home switch.
- Implemented adaptive header, cinematic hero, pausable scent marquee, native product lists with redesigned cards, scent bento, campaign, five-scene sticky journey, gifts, editorial cards, genuine store reviews and native footer integrations.
- Arabic/English copy, touch-visible shopping controls and reduced-motion fallback are included.
- Product lists search the real catalog (default keyword: عطر). Prices, stock, reviews, wishlist and cart remain native. Artistic bottles have no fabricated prices or ratings.
- Second product list is recommendations, not date-sorted new arrivals. Hero mini-card is editorial scent information, not a purchased SKU. Lifestyle visuals are artwork, not customer UGC.
- Newsletter subscription and a dedicated live-product story remain pending. No fake success forms are shipped.
- Production build and source/motion tests run locally. Supplementary Twig checks do not certify Salla runtime behavior.
- Live Salla editor, visual browser/mobile Safari, cart/variants/checkout and Lighthouse verification remain required release gates.
- Build retains upstream Sass deprecation and entrypoint-size warnings. Bundled WebP artwork totals approximately 323 KB.
- Palette is scene-order based; adaptive header responds to section contrast states.
- Before marketplace submission: complete live QA, license/dependency audit, support channel and merchant documentation. This version is not marketplace-ready.
