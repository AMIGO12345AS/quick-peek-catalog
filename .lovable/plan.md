
## Plan: Smarter pricing display + curation logic

### 1. Pricing display (offer_price support)

Currently `ProductCard.tsx` and `ProductDetail.tsx` use `original_price` vs `price`. The user is now describing an `offer_price` field — meaning `price` is the original and `offer_price` is the discounted one. I'll support **both** shapes so nothing breaks:

- If `offer_price` exists and `< price` → `offer_price` is the main (red) price, `price` is strikethrough, show "X% OFF" badge.
- Else if `original_price` exists and `> price` → keep current behavior (price is the deal, `original_price` strikethrough), show badge.
- Else → just show `price`, no badge.

**Files**:
- `src/lib/catalog.ts`: add `offer_price?: number | string` to `ProductExtra`. Add helper `getPricing(product)` returning `{ display, original, discountPct, hasDeal }` so the logic lives in one place.
- `src/components/ProductCard.tsx`: use `getPricing` — render red `display`, strikethrough `original`, and a small "X% OFF" pill (rounded-full, bg red/10, text red, text-[10px], next to price).
- `src/pages/ProductDetail.tsx`: same `getPricing` usage, with a slightly bigger badge.

### 2. Promo banner — biggest discount product

In `src/pages/Index.tsx` replace `const featured = allProducts[0]` with: pick the product with the highest discount % (using `getPricing`). If no product has a deal, fall back to `allProducts[0]`.

### 3. Curated For You — top 8 by discount %

Replace `const curated = allProducts.slice(0, 8)` with: sort by discount % desc, take top 8. If fewer than 8 have discounts, fill the remainder with a stable shuffle of the rest (seeded by date so it stays consistent within a session, not jumping on every render).

### 4. Category circle thumbnails — highest-priced item per category

In `src/pages/Index.tsx`, replace the "first product per category" logic in `categoryThumbs` with "highest-priced product per category" (using `parsePrice` on the displayed/original price).

### Files touched
- `src/lib/catalog.ts` — add `offer_price` type + `getPricing` helper
- `src/components/ProductCard.tsx` — pricing block + discount badge
- `src/pages/ProductDetail.tsx` — pricing block + discount badge
- `src/pages/Index.tsx` — featured pick, curated pick, category thumb pick

No new dependencies. No layout shifts beyond a small badge next to the price.
