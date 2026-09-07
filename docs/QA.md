# Acceptance checklist

## Source/build

- Run `node --test tests/athar-source.test.cjs`.
- Run `pnpm install --frozen-lockfile` then `pnpm production`.
- Review generated assets; no secrets or unintended deletions.
- Verify twilight schema and component fields in Salla's actual editor (source tests are not schema certification).

## Journey live test

- Add the component from the theme editor and populate 2–5 owned bottle images.
- Verify changes to images, titles, notes, CTA and scene count survive save/reload.
- Scroll both directions: correct bottle/text/background; no sudden layout shifts.
- Test 0/1/5 scenes, missing optional fields, repeated component, reorder and removal.
- No JavaScript: readable stacked scenes and working links.
- Reduced motion: stacked layout, no sticky crossfade/parallax.
- Short/landscape screens: stacked layout; no hidden content.
- Mobile 360/390px, desktop, keyboard navigation, Safari, Chrome and Firefox.
- CTA must point to its own product; absent URL must not produce a dead link.

## Commerce regression

- Search, categories, filters, pagination, login, wishlist and cart.
- Simple/options/variant products; discount, out-of-stock and loading/error states.
- Real price/currency/rating and no per-card data fetch storm.
- Add/remove/update cart and continue native checkout.
- Footer links, policies and newsletter submission if enabled.

## Release gates

- All home components and product/search/collection/cart pages visually reviewed.
- RTL/LTR and Arabic text wrapping with long merchant content.
- Minimum 44px touch targets, visible focus, contrast checks at every scene.
- Optimize imagery and prioritize LCP; avoid eager loading all large scene images.
- Lighthouse home/product/collection, mobile and desktop. Target performance 85+
  under controlled preview conditions; actual scores depend on platform/apps/media.
- Current Salla documentation states average performance minimum 60 and accessibility
  minimum 90; recheck before submission. Confirm platform interpretation of size budget.
- No approval guarantee; Salla decides publication eligibility.
