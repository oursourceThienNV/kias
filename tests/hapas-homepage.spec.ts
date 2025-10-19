/**
 * E2E Tests for HAPAS Homepage
 * 
 * Tests homepage implementation matching hapas.vn design
 * Verifies: layout, sections, navigation, responsive, accessibility
 */

import { test, expect } from '@playwright/test';

test.describe('HAPAS Homepage - Layout & Sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage without errors', async ({ page }) => {
    await expect(page).toHaveTitle(/HAPAS/i);
    
    // Check for console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.waitForLoadState('networkidle');
    expect(consoleErrors).toHaveLength(0);
  });

  test('should display hero slider section', async ({ page }) => {
    const heroSlider = page.locator('.hapas-hero-slider');
    await expect(heroSlider).toBeVisible();
    
    // Check for slides
    const slides = page.locator('.hero-slide');
    await expect(slides).toHaveCount(2); // Based on config: 2 slides
    
    // Check navigation buttons
    await expect(page.locator('.hero-nav-prev')).toBeVisible();
    await expect(page.locator('.hero-nav-next')).toBeVisible();
    
    // Check dots
    const dots = page.locator('.hero-dot');
    await expect(dots).toHaveCount(2);
  });

  test('should display category tiles section', async ({ page }) => {
    const categoryTiles = page.locator('.hapas-category-tiles');
    await expect(categoryTiles).toBeVisible();
    
    // Check section title
    await expect(page.locator('.category-tiles-title')).toContainText('DÁNG TÚI BẠN CẦN');
    
    // Check tiles (5 from config: Set Bộ, Váy & Đầm, Quần, Áo, New Arrivals)
    const tiles = page.locator('.category-tile');
    const tileCount = await tiles.count();
    expect(tileCount).toBeGreaterThanOrEqual(4); // At least 4 KIAS categories
    expect(tileCount).toBeLessThanOrEqual(5); // Max 5 tiles
    
    // Verify each tile has image and label
    const firstTile = tiles.first();
    await expect(firstTile.locator('img')).toBeVisible();
    await expect(firstTile.locator('.category-tile-label')).toBeVisible();
  });

  test('should display product carousel section', async ({ page }) => {
    const carousel = page.locator('.hapas-product-carousel');
    await expect(carousel).toBeVisible();
    
    // Check section title
    await expect(page.locator('.product-carousel-title')).toBeVisible();
    
    // Check products
    const products = page.locator('.product-card');
    const productCount = await products.count();
    expect(productCount).toBeGreaterThanOrEqual(1);
    expect(productCount).toBeLessThanOrEqual(12); // Max 12 per config
    
    // Verify product card structure
    const firstProduct = products.first();
    await expect(firstProduct.locator('.product-card-image img')).toBeVisible();
    await expect(firstProduct.locator('.product-card-name')).toBeVisible();
    await expect(firstProduct.locator('.product-card-price')).toBeVisible();
  });

  test('should display story banner section', async ({ page }) => {
    const storyBanner = page.locator('.hapas-story-banner');
    await expect(storyBanner).toBeVisible();
    
    // Check title
    await expect(page.locator('.story-banner-title')).toContainText('THE MAKING OF A BAG');
    
    // Check image and content
    await expect(page.locator('.story-banner-image img')).toBeVisible();
    await expect(page.locator('.story-banner-text')).toBeVisible();
  });

  test('should display news grid section', async ({ page }) => {
    const newsGrid = page.locator('.hapas-news-grid');
    await expect(newsGrid).toBeVisible();
    
    // Check section title
    await expect(page.locator('.news-grid-title')).toContainText('CÓ VÀI ĐIỀU VỪA CẬP NHẬT');
    
    // Check "View All" link
    await expect(page.locator('.news-grid-view-all')).toBeVisible();
  });
});

test.describe('HAPAS Homepage - Navigation', () => {
  test('should display main navigation', async ({ page }) => {
    await page.goto('/');
    
    const nav = page.locator('.hapas-main-navigation');
    await expect(nav).toBeVisible();
    
    // Check nav items (based on kias-hapas-mapping.json)
    const navItems = page.locator('.nav-item');
    const navCount = await navItems.count();
    expect(navCount).toBeGreaterThanOrEqual(4); // At least: MỚI, TÚI XÁCH, QUÀ TẶNG, SALE
  });

  test('should navigate via category tile click', async ({ page }) => {
    await page.goto('/');
    
    // Wait for category tiles to load
    await page.waitForSelector('.category-tile', { state: 'visible' });
    
    // Click first category tile
    const firstTile = page.locator('.category-tile').first();
    const tileLabel = await firstTile.locator('.category-tile-label').textContent();
    
    await firstTile.click();
    
    // Should navigate to category page
    await page.waitForLoadState('networkidle');
    const url = page.url();
    expect(url).toMatch(/\/(set-bo|vay-dam|quan|ao|new-arrivals)/);
  });

  test('should open navigation dropdown on hover', async ({ page }) => {
    await page.goto('/');
    
    // Find nav item with submenu
    const navWithSubmenu = page.locator('.nav-item.has-submenu').first();
    
    if (await navWithSubmenu.count() > 0) {
      // Hover over nav item
      await navWithSubmenu.hover();
      
      // Check submenu appears
      const submenu = navWithSubmenu.locator('.nav-submenu');
      await expect(submenu).toBeVisible();
      
      // Check submenu has links
      const submenuLinks = submenu.locator('a');
      const linkCount = await submenuLinks.count();
      expect(linkCount).toBeGreaterThanOrEqual(1);
    }
  });
});

test.describe('HAPAS Homepage - Responsive Design', () => {
  test('should be mobile responsive (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Hero should adjust height
    const hero = page.locator('.hapas-hero-slider');
    await expect(hero).toBeVisible();
    
    // Category tiles should stack (2 columns on mobile)
    const categoryGrid = page.locator('.category-tiles-grid');
    await expect(categoryGrid).toBeVisible();
    
    // Product carousel should show fewer columns
    const productTrack = page.locator('.product-carousel-track');
    await expect(productTrack).toBeVisible();
  });

  test('should be tablet responsive (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // All sections should be visible and properly sized
    await expect(page.locator('.hapas-hero-slider')).toBeVisible();
    await expect(page.locator('.hapas-category-tiles')).toBeVisible();
    await expect(page.locator('.hapas-product-carousel')).toBeVisible();
  });

  test('should be desktop responsive (1280px)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    
    // Full layout should be visible
    await expect(page.locator('.hapas-hero-slider')).toBeVisible();
    await expect(page.locator('.hapas-category-tiles')).toBeVisible();
    await expect(page.locator('.hapas-product-carousel')).toBeVisible();
    await expect(page.locator('.hapas-story-banner')).toBeVisible();
    await expect(page.locator('.hapas-news-grid')).toBeVisible();
  });
});

test.describe('HAPAS Homepage - Accessibility', () => {
  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/');
    
    // Check main navigation has aria-label
    const nav = page.locator('nav[aria-label="Main navigation"]');
    await expect(nav).toBeVisible();
    
    // Check hero slider has aria-label
    const hero = page.locator('[aria-label="Featured Collections"]');
    await expect(hero).toBeVisible();
    
    // Check sections have heading IDs
    await expect(page.locator('#category-tiles-title')).toBeVisible();
    await expect(page.locator('#product-carousel-title')).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Tab through navigation
    await page.keyboard.press('Tab');
    
    // Should focus on nav links
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should have alt text on images', async ({ page }) => {
    await page.goto('/');
    
    // Check product images have alt text
    const productImages = page.locator('.product-card-image img');
    const firstImage = productImages.first();
    
    if (await firstImage.count() > 0) {
      const alt = await firstImage.getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt?.length).toBeGreaterThan(0);
    }
    
    // Check category images have alt text
    const categoryImages = page.locator('.category-tile-image img');
    const firstCatImage = categoryImages.first();
    
    if (await firstCatImage.count() > 0) {
      const alt = await firstCatImage.getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt?.length).toBeGreaterThan(0);
    }
  });
});

test.describe('HAPAS Homepage - Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Should load in under 5 seconds (generous for E2E)
    expect(loadTime).toBeLessThan(5000);
  });

  test('should lazy load images below fold', async ({ page }) => {
    await page.goto('/');
    
    // Check that images below fold have loading="lazy"
    const lazyImages = page.locator('img[loading="lazy"]');
    const count = await lazyImages.count();
    
    // Should have some lazy loaded images
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('HAPAS Homepage - Interactive Elements', () => {
  test('should change hero slides on button click', async ({ page }) => {
    await page.goto('/');
    
    const nextButton = page.locator('.hero-nav-next');
    
    if (await nextButton.count() > 0) {
      // Click next button
      await nextButton.click();
      
      // Wait for transition
      await page.waitForTimeout(700);
      
      // Check that slides moved
      const slides = page.locator('.hero-slides');
      await expect(slides).toBeVisible();
    }
  });

  test('should scroll product carousel on nav click', async ({ page }) => {
    await page.goto('/');
    
    const nextBtn = page.locator('.carousel-nav-next');
    
    if (await nextBtn.count() > 0) {
      // Get initial scroll position
      const track = page.locator('.product-carousel-track');
      const initialScroll = await track.evaluate((el) => el.scrollLeft);
      
      // Click next
      await nextBtn.click();
      await page.waitForTimeout(500);
      
      // Check scroll changed
      const newScroll = await track.evaluate((el) => el.scrollLeft);
      expect(newScroll).toBeGreaterThan(initialScroll);
    }
  });
});

