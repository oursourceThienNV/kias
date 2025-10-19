import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  console.log('📸 Analyzing HAPAS.VN...\n');
  const page1 = await browser.newPage();
  try {
    await page1.goto('https://hapas.vn/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page1.waitForTimeout(3000); // Wait for dynamic content
    await page1.screenshot({ path: 'hapas-vn-homepage.png', fullPage: true });
    
    const hapasStructure = await page1.evaluate(() => {
      const getVisibleSections = () => {
        const sections = [];
        
        // Main sections
        const allSections = document.querySelectorAll('section, [class*="section"], main > div, body > div[class]');
        allSections.forEach((el, idx) => {
          if (el.offsetHeight > 50) {
            sections.push({
              index: idx,
              tag: el.tagName,
              classes: el.className.substring(0, 50),
              height: el.offsetHeight,
              hasImages: el.querySelectorAll('img').length,
              hasProducts: el.querySelectorAll('[class*="product"]').length,
              text: el.innerText.substring(0, 100)
            });
          }
        });
        
        return sections;
      };
      
      return {
        title: document.title,
        sections: getVisibleSections(),
        hasHero: !!document.querySelector('.hero, .banner, .slider, [class*="hero"], [class*="slider"]'),
        categoryCount: document.querySelectorAll('[class*="category"], [class*="collection"]').length,
        productCount: document.querySelectorAll('[class*="product"]').length
      };
    });
    
    console.log('✅ HAPAS.VN Structure:');
    console.log('Title:', hapasStructure.title);
    console.log('Visible sections:', hapasStructure.sections.length);
    console.log('Has hero:', hapasStructure.hasHero);
    console.log('Categories:', hapasStructure.categoryCount);
    console.log('Products:', hapasStructure.productCount);
    console.log('\nSections detail:');
    hapasStructure.sections.forEach(s => {
      console.log(`  ${s.index}. ${s.tag} (${s.height}px) - ${s.classes} - Images:${s.hasImages} Products:${s.hasProducts}`);
    });
    
  } catch (e) {
    console.error('❌ Error loading hapas.vn:', e.message);
  }
  await page1.close();
  
  console.log('\n📸 Analyzing LOCALHOST:3000...\n');
  const page2 = await browser.newPage();
  try {
    await page2.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 10000 });
    await page2.screenshot({ path: 'localhost-homepage.png', fullPage: true });
    
    const localhostStructure = await page2.evaluate(() => {
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
          classes: el.className.substring(0, 60),
          height: el.offsetHeight,
          visible: el.offsetHeight > 0
        }));
      
      const productCards = document.querySelectorAll('.product-card');
      
      return {
        title: document.title,
        hapasComponents,
        mainSections,
        visibleSections: mainSections.filter(s => s.visible).length,
        productCount: productCards.length
      };
    });
    
    console.log('✅ LOCALHOST Structure:');
    console.log('Title:', localhostStructure.title);
    console.log('\nHAPAS Components:');
    Object.entries(localhostStructure.hapasComponents).forEach(([name, found]) => {
      console.log(`  ${found ? '✅' : '❌'} ${name}`);
    });
    console.log('\nMain sections:', localhostStructure.visibleSections, 'visible');
    console.log('Products shown:', localhostStructure.productCount);
    console.log('\nSections detail:');
    localhostStructure.mainSections.forEach((s, i) => {
      console.log(`  ${i}. ${s.tag} (${s.height}px) ${s.visible ? '✅' : '❌'} - ${s.classes}`);
    });
    
  } catch (e) {
    console.error('❌ Error loading localhost:', e.message);
  }
  await page2.close();
  
  await browser.close();
  
  console.log('\n📊 COMPARISON SUMMARY:');
  console.log('Screenshots saved to:');
  console.log('  - hapas-vn-homepage.png');
  console.log('  - localhost-homepage.png');
})();
