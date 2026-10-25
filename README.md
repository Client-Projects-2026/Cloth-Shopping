# The Sunday Edit — local clothing shop concept

A responsive, public facing boutique website demo built with React, TypeScript and Vite. The rack garments are original inline SVG illustrations; no product photo URLs, store claims, prices, contact details, inventory, checkout, or payment flow are fabricated.

## Customize before using for a real shop

Everything currently shown as **The Sunday Edit** and every garment name, description, color and category is illustrative demo content. The placeholder introduction and shop visit details must be replaced before publishing as the real shop website.

1. Change the editable wordmark in `src/App.tsx` and the page title, description, and social sharing title in `index.html`.
2. Replace the owner note in the About section with a short, accurate shop introduction.
3. Replace the visit card with the real phone, WhatsApp number, email, street address, opening/visit details and social links. Add `tel:`, `mailto:` and `https://wa.me/` links only after verifying the supplied values. Keep this card as a placeholder until then.
4. Update the structured demo products in `src/products.ts`. Names and descriptions are samples; size, price and availability should be added only when supplied and confirmed.
5. Replace the illustrated garments in `src/Garment.tsx` with distinct, owned product images when available. Add descriptive alt text, and store image assets under `public/images/`.

## Run locally

Requires Node.js and npm. Install dependencies with `npm install`, start the development server with `npm run dev`, and create a production build with `npm run build`.

## Deploy to Vercel

Import this project into Vercel. It detects Vite automatically; use `npm run build` as the build command and `dist` as the output directory. No environment variables or secrets are required. A Vercel-provided project address is enough; configure a custom domain separately only if the owner chooses to.

This phase contains only the public website. It has no admin area, database, account system, contact submission endpoint, checkout, or payment integration.

## Owner assets and details still needed

- Real shop name and preferred wordmark, customer audience, town/village and accurate shop introduction.
- Distinct clothing photographs with permission to use them, plus accurate product names, descriptions, color, sizes and prices if the owner wants to publish those details.
- Verified phone and WhatsApp numbers, email, street address and social profile URLs. Confirm visit information before displaying it.
