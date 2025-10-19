import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';

async function ensureHomeButton(page) {
  await page.waitForSelector('text="Khám phá trang demo mới"', { timeout: 15000 });
}

test('homepage buttons navigate correctly', async ({ page }) => {
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  await ensureHomeButton(page);

  await page.click('text="Xem danh mục hiện tại"');
  await page.waitForURL(/collections/, { timeout: 15000 });

  await page.goBack({ waitUntil: 'networkidle' });
  await ensureHomeButton(page);
  await page.click('text="Khám phá trang demo mới"');
  await page.waitForURL(`${BASE_URL}/demo-page`, { timeout: 15000 });

  await expect(page.locator('text="Quay lại trang chủ"')).toBeVisible();
});
