
## Modern Product Catalog — Plan

A fast, mobile-first catalog that pulls live from your API and lets visitors browse, search, filter, and enquire via WhatsApp.

### Pages & navigation
- `/` — Catalog (grid + search + category filter)
- `/product/:id` — Product detail view
- Client-side routing; back button returns to catalog with scroll position preserved

### Layout & design
- **Style**: clean, minimal, modern. White background, neutral grays, **black as the single accent**. Generous spacing, large readable typography (Inter or similar system stack).
- **Header**: minimal, brand name on the left (placeholder "Catalog" — you'll send the real name to swap in).
- **Sticky search bar** under the header with a subtle shadow on scroll.
- **Category filter**: horizontally scrollable pill row under the search (auto-derived from API `category` field, plus "All").
- Smooth scrolling, no heavy animations — only subtle hover/press states.

### Catalog grid
- 2 columns on mobile, 3 on tablet, 4 on desktop.
- **Product card**: square image on top, name, price (bold), 2-line truncated description. Entire card is clickable.
- Consistent card heights via fixed image aspect ratio and clamped text.
- **Lazy-loaded images** (`loading="lazy"`) with a neutral placeholder while loading and a graceful fallback icon if the image fails.

### Product detail view
- Large hero image (with same fallback handling).
- Product name, price (prominent), category tag, full description.
- **Back button** (top-left) returns to the catalog.
- **Sticky bottom CTA**: full-width black "Enquire on WhatsApp" button. Opens `https://wa.me/<NUMBER>?text=Hi, I'm interested in <Product Name> (<Price>)`. The number will be a clearly-marked placeholder constant (`WHATSAPP_NUMBER`) you can swap in one place later.

### Data handling
- Single fetch on app load via React Query — cached, no refetch storms.
- **Loading**: skeleton cards in the grid; skeleton block on detail page.
- **Empty state**: friendly "No products found" message (also used when search/filter returns nothing).
- **Error state**: clean retry message if the API fails.
- **Image errors**: swap to a neutral placeholder automatically.

### Search & filter
- Real-time filter by product name (case-insensitive, debounced).
- Category pills filter combined with search.
- Both run client-side over the cached product list — instant, no extra requests.

### Performance
- React Query caching, lazy images, no large animation libraries, minimal CSS.
- Tailwind utility classes only; no extra UI dependencies beyond what's already in the project.

### What I'll need from you after approval
- Your **brand name** for the header.
- Your **WhatsApp number** (when ready) — until then it stays as a clearly-marked placeholder.
