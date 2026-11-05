import { chromium } from '@playwright/test';
import sharp from 'sharp';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const base = process.env.DEMO_URL || 'http://127.0.0.1:5173';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
try {
  await page.goto(`${base}/admin`, { waitUntil: 'networkidle' });
  const catalogRules = await page.evaluate(async () => {
    const { mergeCatalog } = await import('/src/catalog.tsx');
    const base = mergeCatalog([]);
    const hidden = mergeCatalog([{ audience: 'Women', slot: 1, status: 'hidden' }]);
    const replaced = mergeCatalog([
      {
        id: 'sample-live-id',
        audience: 'Men',
        slot: 1,
        status: 'published',
        name: 'Live Kurta',
        garment_type: 'Kurta set',
        description: 'A live sample for the catalog check.',
        color_hex: '#214336',
        color_name: 'Forest green',
        price_minor: 249900,
        size_stock: [{ size: 'M', count: 3 }],
        front_path: '/garments/men-1-front.webp',
        rack_path: '/garments/men-1-rack.webp',
      },
    ]);
    return {
      base: base.length,
      hidden: hidden.length,
      hiddenStillVisible: hidden.some((item) => item.audience === 'Women' && item.slot === 1),
      replaced: replaced.find((item) => item.audience === 'Men' && item.slot === 1),
    };
  });
  assert.equal(catalogRules.base, 20);
  assert.equal(catalogRules.hidden, 19);
  assert.equal(catalogRules.hiddenStillVisible, false);
  assert.equal(catalogRules.replaced.name, 'Live Kurta');
  assert.equal(catalogRules.replaced.priceMinor, 249900);
  assert.equal(catalogRules.replaced.images.left, undefined);
  assert.equal(await page.getByRole('heading', { name: 'Welcome back.' }).count(), 1);
  await page.getByRole('button', { name: 'Explore read-only admin preview' }).click();
  assert.equal(await page.getByRole('heading', { name: 'Your shop, at a glance.' }).count(), 1);
  assert.equal(
    await page
      .locator('.admin-stats strong')
      .allTextContents()
      .then((values) => values.join(',')),
    '00,20,00,20',
  );
  await fs.mkdir('artifacts', { recursive: true });
  await page.screenshot({ path: 'artifacts/admin-desktop.png', fullPage: true });
  await page
    .getByRole('button', { name: /Everyday collection/ })
    .first()
    .click();
  assert.equal(await page.getByRole('heading', { name: 'Everyday collection.' }).count(), 1);
  assert.equal(await page.locator('.everyday-admin-item').count(), 6);
  await page.screenshot({ path: 'artifacts/everyday-admin-desktop.png', fullPage: true });
  await page.getByRole('button', { name: 'Add collection piece' }).click();
  assert.equal(await page.getByRole('heading', { name: 'Add a real-life piece.' }).count(), 1);
  assert.equal(await page.getByRole('button', { name: 'Publish piece' }).isDisabled(), true);
  const everydayPhoto = await sharp({
    create: { width: 600, height: 800, channels: 3, background: '#d0b9a2' },
  })
    .jpeg()
    .toBuffer();
  await page
    .locator('.everyday-upload-button input')
    .setInputFiles({ name: 'shirt.jpg', mimeType: 'image/jpeg', buffer: everydayPhoto });
  await page.getByText('Product photo converted to WebP, ready to publish.').waitFor();
  assert.ok(
    (await page.locator('.everyday-upload-preview img').getAttribute('src')).startsWith('blob:'),
  );
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(
    await page.locator('body').evaluate((element) => element.scrollWidth <= window.innerWidth),
    true,
  );
  await page.screenshot({ path: 'artifacts/everyday-editor-mobile.png', fullPage: true });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole('button', { name: 'Back to everyday collection' }).click();
  const everydayRules = await page.evaluate(async () => {
    const { resolveEverydayProducts } = await import('/src/everydayCatalog.ts');
    const row = {
      id: 'sample-live-id',
      status: 'published',
      position: 1,
      name: 'Live Linen Shirt',
      category: 'Shirts',
      description: 'A real shop shirt with a relaxed fit.',
      color_hex: '#d0b9a2',
      color_name: 'Oat',
      tag: 'New',
      price_minor: 249900,
      size_stock: [{ size: 'M', count: 3 }],
      image_path: '/garments/men-1-front.webp',
    };
    return {
      samples: resolveEverydayProducts([]).length,
      hidden: resolveEverydayProducts([{ status: 'hidden' }]).length,
      live: resolveEverydayProducts([row])[0],
    };
  });
  assert.equal(everydayRules.samples, 6);
  assert.equal(everydayRules.hidden, 0);
  assert.equal(everydayRules.live.name, 'Live Linen Shirt');
  assert.equal(everydayRules.live.priceMinor, 249900);
  await page
    .getByRole('button', { name: /Rack inventory/ })
    .first()
    .click();
  assert.equal(await page.locator('.admin-inventory-row').count(), 20);
  await page
    .getByRole('group', { name: 'Filter collection' })
    .getByRole('button', { name: 'Women' })
    .click();
  assert.equal(await page.locator('.admin-inventory-row').count(), 5);
  await page.getByRole('button', { name: 'Edit Women hanger 1' }).click();
  assert.equal(await page.getByRole('heading', { name: 'Make this look yours.' }).count(), 1);
  assert.equal(await page.getByLabel('Product name').inputValue(), 'Ruby Embroidered Lehenga');
  assert.equal(await page.getByRole('button', { name: 'Publish product' }).isDisabled(), true);
  await page
    .getByRole('button', { name: /Image guide/ })
    .first()
    .click();
  assert.equal(
    await page.getByRole('heading', { name: 'Images that hang beautifully.' }).count(),
    1,
  );
  await page
    .getByRole('button', { name: /Add product/ })
    .first()
    .click();
  const transparent = await sharp({
    create: { width: 600, height: 800, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      {
        input: Buffer.from(
          '<svg width="500" height="650"><path d="M200 0h100l140 120-50 160-60-30v390H170V250l-60 30-50-160z" fill="#a72b54"/></svg>',
        ),
        left: 50,
        top: 70,
      },
    ])
    .png()
    .toBuffer();
  await page
    .locator('input[type=file]')
    .first()
    .setInputFiles({ name: 'dress.png', mimeType: 'image/png', buffer: transparent });
  await page.getByText('Front and rack thumbnail converted to WebP, ready to publish.').waitFor();
  const frontPreview = await page.locator('.admin-image-preview img').first().getAttribute('src');
  assert.ok(frontPreview.startsWith('blob:'));
  await page
    .locator('input[type=file]')
    .nth(1)
    .setInputFiles({ name: 'left.png', mimeType: 'image/png', buffer: transparent });
  await page.getByText('left view converted to WebP, ready to publish.').waitFor();
  assert.equal(
    await page.evaluate(async (url) => (await fetch(url)).ok, frontPreview),
    true,
    'Adding a side view keeps the front preview alive',
  );
  const sampleImageRule = await page.evaluate(async () => {
    const { makeForm, seedFor, validateProduct } = await import('/src/admin/model.ts');
    const form = makeForm('Men', 1, undefined, seedFor('Men', 1));
    form.price = '2499';
    return validateProduct(form, {});
  });
  assert.match(
    sampleImageRule,
    /Upload a transparent front image/,
    'Publishing a demo slot needs a shop photo',
  );
  const opaque = await sharp({
    create: { width: 600, height: 800, channels: 3, background: '#ffffff' },
  })
    .png()
    .toBuffer();
  await page
    .locator('input[type=file]')
    .first()
    .setInputFiles({ name: 'opaque.png', mimeType: 'image/png', buffer: opaque });
  await page.getByText(/front image needs a transparent background/i).waitFor();
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(
    await page
      .getByRole('button', { name: /Image guide/ })
      .first()
      .isVisible(),
    true,
  );
  assert.equal(await page.getByRole('button', { name: /Back to sign in/ }).isVisible(), true);
  await page.screenshot({ path: 'artifacts/admin-mobile.png', fullPage: true });
  assert.equal(
    await page.locator('body').evaluate((element) => element.scrollWidth <= window.innerWidth),
    true,
  );
  assert.deepEqual(errors, []);
  console.log(
    'PASS admin sign-in gate, preview, navigation, inventory, editor, conversion, validation, mobile layout, and no runtime errors',
  );
} finally {
  await browser.close();
}
