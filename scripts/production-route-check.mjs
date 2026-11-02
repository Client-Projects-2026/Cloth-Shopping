import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';

const base = process.env.DEMO_URL || 'http://127.0.0.1:4174';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));

try {
  await page.goto(base, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('#rack').count(), 1);
  assert.equal(await page.locator('.hanging-garment').count(), 5);
  await page.goto(`${base}/admin`, { waitUntil: 'networkidle' });
  assert.equal(await page.getByRole('heading', { name: 'Welcome back.' }).count(), 1);
  await page.getByRole('button', { name: 'Explore read-only admin preview' }).click();
  await page.getByRole('button', { name: /Rack inventory/ }).first().click();
  assert.equal(await page.locator('.admin-inventory-row').count(), 20);
  assert.deepEqual(errors, []);
  console.log('PASS production storefront and admin routes load without browser errors');
} finally {
  await browser.close();
}
