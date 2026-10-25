# The Sunday Edit — clothing shop demo

React, TypeScript and Vite. The shop name, products, stock counts and campaign copy are illustrative. No orders, payments or messages are sent.

## Try the demo

- In **Take a peek at the rack**, use **Rack backdrop** above the rack to choose **Diwali**, **Wedding** or **Everyday**. This changes the setting without clearing the family edit.
- Men, Women, Girls and Boys each have five individual garment images. Each complete transparent image moves from its own hanger; the brass rail stays still. Use **Pause motion** to stop the animation.
- Select a piece to reveal size counts and color/style choices below the rack. Choosing a different color/style changes the garment too.
- **View this piece** opens the right drawer. Select **Left / Front / Right**, click the garment, or use the arrow keys to change views. These are three separate AI-generated images, not a continuous 3D model or slices from a collection photo.
- **Custom / Family** starts with five empty hangers. Add a person, then select their stock style and size. Changes appear on the rack; the edit survives category and hero navigation. Removing a person restores an empty hanger.
- The hero has three manually controlled slides: Diwali, new-season stock inspiration and the family edit.

On phones the rack scrolls horizontally. The drawer supports Escape, a keyboard focus loop and focus restoration. Motion respects the device's reduced-motion preference.

## Run and verify

- Install: `npm install`
- Local demo: `npm run dev`
- Production build: `npm run build`
- Browser checks, with a local server running: `node scripts/boutique-browser-check.mjs`
- Set `DEMO_URL` to test another local URL. The checks use installed Google Chrome through Playwright and save screenshots in `artifacts/`.

Playwright and Sharp are development tools only; neither is bundled into the storefront.

## Main files

| File | Purpose |
| --- | --- |
| `src/diwali.ts` | The 20 demo garments, image paths, sizes, stock counts and occasion labels |
| `src/components/ClothingRack.tsx` | Categories, backdrop, independent hangers and selection state |
| `src/components/FamilyBuilder.tsx` | Five-person family edit and stock-style selection |
| `src/components/GarmentDrawer.tsx` | Complete single-garment angle gallery |
| `src/components/GarmentOptions.tsx` | Shared size and color/style controls |
| `src/components/Dialog.tsx` | Accessible modal behavior |
| `src/components/HeroCarousel.tsx` | Three campaign slides |
| `src/boutique.css` | Rack, backdrop, gallery and responsive styles |
| `public/garments/` | 60 separate view images and 20 small rack thumbnails |

The old collection-sheet assets remain available as reference material; the interactive rack, hero and drawer do not use them.

## Replace the demo content

1. Change the temporary wordmark in `src/App.tsx` and the title, description and sharing metadata in `index.html`.
2. Replace the About placeholder with the real shop's introduction.
3. Supply the real address, visit hours, phone, WhatsApp, email and social profiles before adding contact links.
4. Replace the product records in `src/diwali.ts`, including names, descriptions, accurate size quantities and garment colors. Color/style swatches currently select other demo designs in the same category.
5. For each product, replace `{id}-front.webp`, `{id}-left.webp`, `{id}-right.webp` and `{id}-rack.webp` with complete, owned photographs. Preserve transparent backgrounds for hanging pieces. Do not crop a collection sheet into product images.
6. The everyday illustrated collection is configured separately in `src/products.ts` and `src/Garment.tsx`.
7. Confirm any sale discount, terms, dates and eligible products before publishing an offer. This demo does not invent a discount or claim real availability.

Generated asset provenance and the final prompt set are documented in [garment asset notes](public/garments/ASSET-NOTES.md). `scripts/prepare-garments.mjs <original-image-directory>` recreates the web formats from those original generated PNG files; it preserves the entire image and transparency.

## Deploy

For Vercel or another static host, use `npm run build` and publish `dist/`. No environment variables, secret keys or database are required. Use the host-provided address for the client demo. This project remains a public website template without an admin area, customer accounts or checkout.
