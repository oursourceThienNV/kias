import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('📸 Analyzing LOCALHOST:3000...\n');
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'localhost-homepage.png', fullPage: true });
    
    const structure = await page.evaluate(() => {
      const hapasComponents = {
        heroSlider: !!document.querySelector('.hapas-hero-slider'),
        categoryTiles: !!document.querySelector('.hapas-category-tiles'),
        productCarousel: !!document.querySelector('.hapas-product-carousel'),
        storyBanner: !!document.querySelector('.hapas-story-banner'),
        newsGrid: !!document.querySelector('.hapas-news-grid')
      };
      
      const mainSections = Array.from(document.querySelectorAll('main > *'))
        .map(el => ({
          tag: el.tagName,
          classes: el.className,
          height: el.offsetHeight,
          visible: el.offsetHeight > 0,
          text: el.innerText.substring(0, 50)
        }));
      
      const productCards = document.querySelectorAll('.product-card');
      
      return {
        title: document.title,
        hapasComponents,
        mainSections,
        visibleSections: mainSections.filter(s => s.visible).length,
        productCount: productCards.length,
        totalHeight: Array.from(document.querySelectorAll('main > *'))
          .reduce((sum, el) => sum + el.offsetHeight, 0)
      };
    });
    
    console.log('✅ LOCALHOST:3000 Analysis:\n');
    console.log('Title:', structure.title);
    console.log('Total main height:', structure.totalHeight + 'px');
    console.log('\n🎨 HAPAS Theme Components:');
    Object.entries(structure.hapasComponents).forEach(([name, found]) => {
      console.log(`  ${found ? '✅ FOUND' : '❌ MISSING'} ${name}`);
    });
    console.log('\n📦 Main Content Sections:', structure.visibleSections, 'visible');
    console.log('🛍️  Products displayed:', structure.productCount);
    console.log('\n📋 Section Details:');
    structure.mainSections.forEach((s, i) => {
      if (s.visible) {
        console.log(`  ${i + 1}. ${s.tag} (${s.height}px) - ${s.classes}`);
        if (s.text) console.log(`     "${s.text.trim()}..."`);
      }
    });
    
    console.log('\n📸 Screenshot saved: localhost-homepage.png');
    
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
  
  await browser.close();
})();
