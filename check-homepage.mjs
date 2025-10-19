import { chromium } from 'playwright';

(async () => {
  console.log('🔍 Checking homepage with Playwright...\n');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Navigate to homepage
    console.log('📍 Navigating to http://localhost:3000...');
    const response = await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle',
      timeout: 10000 
    });
    
    console.log(`✅ Status: ${response.status()}\n`);
    
    // Check if page is blank
    const content = await page.content();
    const bodyText = await page.textContent('body');
    
    console.log('📊 PAGE ANALYSIS:\n');
    console.log(`HTML Size: ${content.length} bytes`);
    console.log(`Body text length: ${bodyText.trim().length} chars\n`);
    
    // Check #app div
    const appDiv = await page.locator('#app').innerHTML();
    console.log('🔍 #app div content:');
    if (appDiv.trim().length === 0) {
      console.log('❌ EMPTY! (Trang trắng)\n');
    } else {
      console.log(`✅ Has content (${appDiv.length} chars)\n`);
    }
    
    // Check for HAPAS components
    console.log('🎨 CHECKING HAPAS COMPONENTS:\n');
    
    const checks = [
      { name: 'HeroSlider', selector: '.hapas-hero-slider' },
      { name: 'CategoryTiles', selector: '.hapas-category-tiles' },
      { name: 'ProductCarousel', selector: '.hapas-product-carousel' },
      { name: 'StoryBanner', selector: '.hapas-story-banner' },
      { name: 'NewsGrid', selector: '.hapas-news-grid' }
    ];
    
    let foundCount = 0;
    for (const check of checks) {
      const exists = await page.locator(check.selector).count() > 0;
      if (exists) {
        console.log(`✅ ${check.name} - Found`);
        foundCount++;
      } else {
        console.log(`❌ ${check.name} - NOT FOUND`);
      }
    }
    
    console.log(`\n📈 Result: ${foundCount}/5 components found\n`);
    
    // Check for errors in console
    const logs = [];
    page.on('console', msg => logs.push(msg));
    
    await page.waitForTimeout(2000);
    
    const errors = logs.filter(log => log.type() === 'error');
    if (errors.length > 0) {
      console.log('⚠️  Console Errors:');
      errors.forEach(err => console.log(`  - ${err.text()}`));
    } else {
      console.log('✅ No console errors');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'homepage-check.png', fullPage: true });
    console.log('\n📸 Screenshot saved: homepage-check.png');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
