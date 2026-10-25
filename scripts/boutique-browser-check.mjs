import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const output = path.resolve('artifacts');
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const check = (condition, message) => { assert.ok(condition, message); console.log('PASS ' + message); };
const readyImages = async (scope = page) => {
  await scope.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode().catch(() => {}))));
  check(await scope.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)), 'All displayed garment images load');
};
const tabs = page.getByRole('group', { name: 'Choose a collection' });
const previewOnly = process.argv.includes('--preview');
try {
  await page.goto(process.env.DEMO_URL || 'http://localhost:5173', { waitUntil: 'networkidle' });
  await readyImages();
  await page.screenshot({ path: path.join(output, 'boutique-desktop.png'), fullPage: true });
  await page.locator('#rack').screenshot({ path: path.join(output, 'rack-diwali.png') });
  if (previewOnly) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(output, 'boutique-mobile.png'), fullPage: true });
  } else {
    const backgrounds = [];
    for (const occasion of ['diwali', 'wedding', 'everyday']) {
      await page.getByLabel('Change occasion backdrop').selectOption(occasion);
      await page.waitForTimeout(450);
      backgrounds.push(await page.locator('.boutique-stage').evaluate(element => getComputedStyle(element).backgroundColor));
      check(await page.locator('.theme-' + occasion).count() === 1, occasion + ' backdrop changes');
      await page.locator('#rack').screenshot({ path: path.join(output, 'rack-' + occasion + '.png') });
    }
    check(new Set(backgrounds).size === 3, 'Occasions have three distinct backgrounds');
    await page.getByLabel('Change occasion backdrop').selectOption('diwali');
    for (const audience of ['Men', 'Women', 'Girls', 'Boys']) {
      await tabs.getByRole('button', { name: audience, exact: true }).click();
      const clothes = page.locator('.hanging-garment');
      check(await clothes.count() === 5, audience + ' contains exactly five pieces');
      const sources = await clothes.locator('img').evaluateAll(images => images.map(image => image.getAttribute('src')));
      check(new Set(sources).size === 5 && sources.every(source => source.includes('/garments/' + audience.toLowerCase() + '-')), audience + ' has five separate, correct images');
      for (let index = 0; index < 5; index++) {
        await clothes.nth(index).click();
        const name = await page.locator('.selected-piece h3').innerText();
        await page.locator('.selected-piece .size-choices button').first().click();
        await page.getByRole('button', { name: 'View this piece' }).click();
        const dialog = page.getByRole('dialog');
        check(await dialog.isVisible(), name + ' opens its drawer');
        const views = [];
        for (const angle of ['front', 'left', 'right']) {
          await dialog.getByRole('group', { name: 'Garment view' }).getByRole('button', { name: angle, exact: true }).click();
          await readyImages(dialog);
          const source = await dialog.locator('.gallery-image-button img').getAttribute('src');
          check(source.includes(audience.toLowerCase() + '-' + (index + 1) + '-' + angle), name + ': correct ' + angle + ' asset');
          views.push(source);
        }
        check(new Set(views).size === 3, name + ' has distinct views');
        if (audience === 'Men' && index === 0) {
          await dialog.locator('.gallery-image-button').click();
          check((await dialog.locator('.gallery-image-button img').getAttribute('src')).includes('-left.'), 'Clicking the garment changes its angle');
          await page.keyboard.press('ArrowRight');
          check((await dialog.locator('.gallery-image-button img').getAttribute('src')).includes('-front.'), 'Keyboard arrows change garment angle');
        }
        if (audience === 'Women' && index === 0) {
          await dialog.screenshot({ path: path.join(output, 'garment-drawer.png') });
          for (let i = 0; i < 25; i++) {
            await page.keyboard.press('Tab');
            assert.ok(await dialog.evaluate(element => element.contains(document.activeElement)), 'Focus must stay inside drawer');
          }
          console.log('PASS Keyboard focus stays in drawer');
        }
        await page.keyboard.press('Escape');
        check(await page.getByRole('dialog').count() === 0, 'Escape closes drawer');
        check(await page.getByRole('button', { name: 'View this piece' }).evaluate(element => element === document.activeElement), 'Focus returns to View button');
      }
    }
    await page.getByRole('button', { name: 'Pause garment motion' }).click();
    check(await page.locator('.garment-suspension').evaluateAll(elements => elements.every(element => getComputedStyle(element).animationPlayState === 'paused')), 'Motion pauses on all five garments');
    await page.getByRole('button', { name: 'Play garment motion' }).click();
    await tabs.getByRole('button', { name: 'Custom / Family', exact: true }).click();
    check(await page.locator('.empty-rack-slot').count() === 5, 'Family starts with five empty hangers');
    for (const role of ['man', 'woman', 'girl', 'boy', 'man']) await page.getByRole('button', { name: 'Add ' + role, exact: true }).click();
    check(await page.locator('.hanging-garment').count() === 5 && await page.locator('.family-editor').count() === 1, 'One family editor fills all five hangers');
    check(await page.locator('.family-add-buttons button').evaluateAll(buttons => buttons.every(button => button.disabled)), 'Family limit is enforced');
    await page.locator('.family-row').first().getByLabel('Choose a stock style').selectOption('men-4');
    check((await page.locator('.hanging-garment img').first().getAttribute('src')).includes('men-4-rack'), 'Stock selection changes family garment');
    await page.locator('.family-row').first().getByLabel('Size', { exact: true }).selectOption('XL');
    await page.locator('.hanging-garment').first().click();
    check(await page.locator('.selected-piece .size-choices button[aria-pressed="true"]').innerText().then(value => value.startsWith('XL')), 'Family size reaches product controls');
    await page.locator('.selected-piece .style-swatches button').nth(1).click();
    check(await page.locator('.family-row').first().getByLabel('Choose a stock style').inputValue() === 'men-2', 'Product style updates family selection');
    await page.getByLabel('Change occasion backdrop').selectOption('wedding');
    check(await page.locator('.hanging-garment').count() === 5, 'Backdrop preserves family');
    await tabs.getByRole('button', { name: 'Women', exact: true }).click();
    await tabs.getByRole('button', { name: 'Custom / Family', exact: true }).click();
    check(await page.locator('.hanging-garment').count() === 5, 'Family survives category switches');
    await page.getByRole('button', { name: 'Remove family member 2' }).click();
    check(await page.locator('.empty-rack-slot').count() === 1, 'Removing a member restores an empty hanger');
    await page.locator('#rack').screenshot({ path: path.join(output, 'family-rack.png') });
    await page.getByRole('button', { name: 'Next featured slide' }).click();
    check(await page.locator('.campaign-count').innerText() === '02 / 03', 'New arrivals hero works');
    await page.getByRole('button', { name: 'Next featured slide' }).click();
    check(await page.locator('.campaign-count').innerText() === '03 / 03', 'Family hero works');
    await page.getByRole('link', { name: 'Build your family edit' }).click();
    check(await page.locator('.hanging-garment').count() === 4, 'Hero navigation preserves family edit');
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      check(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'No page overflow at ' + width + 'px');
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await tabs.getByRole('button', { name: 'Women', exact: true }).click();
    await page.getByLabel('Change occasion backdrop').selectOption('diwali');
    await readyImages();
    await page.locator('#rack').screenshot({ path: path.join(output, 'rack-mobile.png') });
    await page.screenshot({ path: path.join(output, 'boutique-mobile.png'), fullPage: true });
    const scroll = page.locator('.rack-scroll');
    const before = await scroll.evaluate(element => element.scrollLeft);
    await page.getByRole('button', { name: 'Scroll rack right' }).click();
    await page.waitForTimeout(500);
    check(await scroll.evaluate(element => element.scrollLeft) > before, 'Mobile rack scroll control works');
    await page.locator('.hanging-garment').nth(4).click();
    await page.getByRole('button', { name: 'View this piece' }).click();
    await page.getByRole('group', { name: 'Garment view' }).getByRole('button', { name: 'left', exact: true }).click();
    await readyImages(page.getByRole('dialog'));
    await page.getByRole('dialog').screenshot({ path: path.join(output, 'drawer-mobile.png') });
    await page.getByRole('button', { name: 'Close garment details' }).click();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    check(await page.locator('.garment-suspension').evaluateAll(elements => elements.every(element => getComputedStyle(element).animationName === 'none')), 'Reduced-motion preference is respected');
    check(errors.length === 0, 'No browser runtime errors: ' + errors.join('; '));
  }
} finally { await browser.close(); }

