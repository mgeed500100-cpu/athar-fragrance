# v0.4.1 verification and limitations

- Upgraded both official Salla Twilight packages to 2.14.575 and regenerated the lockfile.
- Added the required `salla-review-factors-tags` integration to the customer order page and a regression test covering both marketplace requirements.

- Removed six inherited Raed custom-component declarations and all inherited component feature flags from theme metadata. The editor now advertises Athar components only. Existing saved page items belong to the linked demo store and may require a clean demo store to disappear from its saved editor composition.
- The theme never creates catalog records. Real product cards require products in the linked Salla demo store. The current `nasaq-one` catalog contains clothing and no matching fragrance products; GitHub theme code has no authority to delete those records or create perfume inventory.

- Empty automatic product sections collapse after Salla confirms that no real catalog item matched. This removes large empty gaps in fresh demo stores while allowing populated sections to render normally.

- Preview activation fix: Athar now renders unless the new explicit opt-out settings athar_use_editor_home / athar_use_classic_header are enabled. Missing/null/false values no longer disable the design. This addresses a plausible activation failure; the live preview's setting values were not accessible, so its root cause is not confirmed.
- The document body includes data-athar-build="0.4.1" to distinguish stale assets/templates from setting issues.

- Automatic homepage uses bundled original artwork. Existing merchant components remain available by enabling athar_use_editor_home.
- Implemented adaptive header, cinematic hero, pausable scent marquee, native product lists with redesigned cards, scent bento, campaign, five-scene sticky journey, gifts, editorial cards, genuine store reviews and native footer integrations.
- Arabic/English copy, touch-visible shopping controls and reduced-motion fallback are included.
- Product lists search the real catalog (default keyword: عطر). Prices, stock, reviews, wishlist and cart remain native. Artistic bottles have no fabricated prices or ratings.
- Second product list now uses Salla's native latest source across the real catalog. Hero mini-card remains editorial scent information. Lifestyle visuals are artwork, not customer UGC.
- Product spotlight now uses a native horizontal product card, true image/price/rating/cart and optional merchant story and selected product. Without selection it searches the catalog keyword.
- Mailing-list section supports a merchant-provided HTTPS hosted signup page. It remains hidden without a provider URL. No email provider account or backend is configured; no fake success forms are shipped.
- Arabic merchant guide added at docs/MERCHANT-GUIDE-AR.md. Temporary development support uses GitHub Issues; a production support channel still needs owner details.
- Production build and source/motion tests run locally. Supplementary Twig checks do not certify Salla runtime behavior.
- Live Salla editor, visual browser/mobile Safari, cart/variants/checkout and Lighthouse verification remain required release gates.
- Local browser harness added (scripts/qa-browser.cjs); Chromium was unavailable and its download timed out in this environment. Browser assertions have not run. Template-only checks use a supplementary TwigJS renderer, not Salla's engine.
- Build retains upstream Sass deprecation and entrypoint-size warnings. Bundled WebP artwork totals approximately 323 KB.
- Palette is scene-order based; adaptive header responds to section contrast states.
- Before marketplace submission: complete live QA, license/dependency audit, support channel and merchant documentation. This version is not marketplace-ready.
