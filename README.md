# The Sunday Edit — local clothing shop concept

A responsive, public facing boutique website demo built with React, TypeScript and Vite. The supplied reference photos in `public/Refernce/` are used only as image-generation inspiration. The rack switches between generated five-look collections for Men, Women, Girls, and Boys; garments sway gently and open size/color controls with clearly labeled demo stock counts. The View drawer focuses on a single garment and includes a 3D-style visual turntable; actual side/back photography or a product model is still needed for a true 3D preview. The Custom / Family rack begins empty; adding a member fills a hanger with a role-specific sample outfit. The hero has Diwali preview, new-stock preview, and family-edit slides. All campaign text and stock counts are demo content; there is no real discount, inventory, contact detail, order, or payment flow.

## Customize before using for a real shop

Everything currently shown as **The Sunday Edit** and every garment name, description, color and category is illustrative demo content. The placeholder introduction and shop visit details must be replaced before publishing as the real shop website.

1. Change the editable wordmark in `src/App.tsx` and the page title, description, and social sharing title in `index.html`.
2. Replace the owner note in the About section with a short, accurate shop introduction.
3. Replace the visit card with the real phone, WhatsApp number, email, street address, opening/visit details and social links. Add `tel:`, `mailto:` and `https://wa.me/` links only after verifying the supplied values. Keep this card as a placeholder until then.
4. Update the structured demo products in `src/products.ts`. Names and descriptions are samples; size, price and availability should be added only when supplied and confirmed.
5. Replace the illustrated garments in `src/Garment.tsx` with distinct, owned product images when available. Add descriptive alt text, and store image assets under `public/images/`.
6. Update the Diwali sample content in `src/diwali.ts`. Replace the generated five-look assets (`public/diwali-men-five.png`, `public/diwali-women-five.png`, `public/diwali-girls-five.png`, and `public/diwali-boys-five.png`), sample size counts, and color options with the shop’s actual garments and options before launch. Add sale amounts/dates only after the owner confirms the offer. A true 3D turntable needs product-angle photos or a 3D garment model.

## Run locally

Requires Node.js and npm. Install dependencies with `npm install`, start the development server with `npm run dev`, and create a production build with `npm run build`.

## Deploy to Vercel

Import this project into Vercel. It detects Vite automatically; use `npm run build` as the build command and `dist` as the output directory. No environment variables or secrets are required. A Vercel-provided project address is enough; configure a custom domain separately only if the owner chooses to.

This phase contains only the public website. It has no admin area, database, account system, contact submission endpoint, checkout, or payment integration.

## Owner assets and details still needed

- Real shop name and preferred wordmark, customer audience, town/village and accurate shop introduction.
- Distinct clothing photographs with permission to use them, plus accurate product names, descriptions, color, sizes and prices if the owner wants to publish those details.
- Confirmed Diwali campaign terms, discount, dates and eligible products if a real sale is planned.
- Verified phone and WhatsApp numbers, email, street address and social profile URLs. Confirm visit information before displaying it.
