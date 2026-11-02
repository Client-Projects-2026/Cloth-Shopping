# The Sunday Edit — clothing shop demo

React, TypeScript and Vite. The shop name, products, stock counts and campaign copy are illustrative. No orders, payments or messages are sent.

## Try the demo

- Open `/admin` for the shop studio. The read-only preview shows the dashboard, rack inventory, editor and image guide without exposing write access. Once connected, approved admins can sign in and publish real pieces.

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
- Admin browser checks, with a local server running: `npm run test:admin`
- Built-route browser check, with `npm run preview` running: `npm run test:routes`
- Admin source formatting check: `npm run format:check`
- Set `DEMO_URL` to test another local URL. The checks use installed Google Chrome through Playwright and save screenshots in `artifacts/`.

Playwright and Sharp are development tools only; neither is bundled into the storefront.

## Main files

| File | Purpose |
| --- | --- |
| `src/diwali.ts` | The 20 demo garments, image paths, sizes, stock counts and occasion labels |
| `src/admin/AdminApp.tsx` | Admin route coordination and page state |
| `src/admin/pages/` | Sign-in, dashboard, inventory, editor, guide and shared shell |
| `src/admin/model.ts` | Product form types, defaults, validation and hanger slots |
| `src/admin/useAdminSession.ts` | Admin sign-in and membership checks |
| `src/admin/useInventory.ts` | Inventory loading, publish and hide state |
| `src/admin/catalogRepository.ts` | Supabase catalog queries and image uploads |
| `src/main.tsx` | Loads the storefront or admin route on demand |
| `src/admin/images.ts` | Browser image preparation and WebP conversion |
| `src/catalog.tsx` | Live catalog loading and demo-slot replacement |
| `supabase/migrations/20261101000000_catalog_admin.sql` | Database, admin authorization and upload policies |
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

For Vercel, connect the GitHub `main` branch, use the Vite framework preset, build with `npm run build`, and set the output directory to `dist`. Leave the install command on automatic so Vercel installs from `package-lock.json`. Commit the source and lockfile; `.gitignore` keeps local `node_modules`, `dist` and screenshots out of Git. The public demo works without environment variables. `/admin` is rewritten to the Vite app by `vercel.json`.

## Connect live admin management

1. Create a Supabase project. Apply `supabase/migrations/20261101000000_catalog_admin.sql` in its SQL editor. This creates the product table, a public catalog read function, a `catalog-garments` storage bucket, and row-level policies. Direct table writes and image uploads require administrator membership.
2. In Supabase Auth, disable public sign-ups for this private shop studio. Create an owner user in the Supabase dashboard, then copy that user's UUID and run `insert into public.admin_users (user_id) values ('YOUR-USER-UUID');` in the SQL editor. Give each additional manager a separate Auth account and membership row. Do not put a service-role key in this Vite project.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to the Vercel project's Production environment (and Preview if desired), using `.env.example` as the local template. These are public browser connection values; the SQL policies enforce access. Redeploy after adding them. For local testing, save them in `.env.local`.
4. Visit `/admin`, sign in, and use **Rack inventory** to edit a slot or **Add product** to replace a slot. Each of Men, Women, Girls and Boys has five slots. **Publish product** updates the live rack without another Git push; **Hide** removes the chosen hanger from the public rack. Unchanged slots continue to show the built-in demo pieces.

The editor accepts a separate front, left and right image. A transparent front PNG or WebP is required for a new hanging piece. It converts images to WebP on a 1200 × 1600 canvas without cropping and creates a smaller transparent rack thumbnail from the front. The optional side views appear only if supplied. Conversion preserves existing transparency; it does not remove a photographic background. The guide inside `/admin` describes size and format requirements. Uploaded files are public catalog assets; do not upload private photos. The storefront still has no checkout or customer account system.
