
import { test } from '@playwright/test';
import { expect } from '@playwright/test';

test('HomeDemoNavigation_2025-10-06', async ({ page, context }) => {
  
    // Navigate to URL
    await page.goto('http://localhost:3001/');

    // Click element
    await page.click('text="Khám phá trang demo mới"');
});