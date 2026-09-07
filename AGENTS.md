# Athar Fragrance — project rules

- This is a standalone premium Salla Twilight theme. Never modify Nasaq One.
- Read `docs/PROJECT.md` and `docs/QA.md` before substantial changes.
- Preserve Salla hooks, localization, product options, cart, wishlist and checkout behavior.
- Use Twig, SCSS and lightweight JavaScript. No React runtime, scroll hijacking or WebGL by default.
- Signature requirement: within Fragrance Journey, scrolling changes the bottle, background, name and scent notes smoothly. Do not replace this with a static banner.
- Homepage sections must be merchant-editable components, not a hardcoded homepage.
- Keep Arabic RTL and English LTR usable. Do not invent ratings, prices, stock or trust claims.
- Make essential shopping actions visible on touch devices and respect reduced motion.
- Keep reference links and license decisions in `docs/REFERENCES.md`. Do not copy reference artwork/code without permission.
- Use `design/athar-v1` for development. Preserve `baseline/raed-initial` as the untouched starting point.
- Run source checks and production build before syncing generated `public` assets. State explicitly if live Salla QA has not happened.
- Never commit credentials or merchant/customer data. Repository visibility is public at initialization.
