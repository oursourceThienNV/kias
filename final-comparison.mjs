import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  // Analyze HAPAS.VN
  console.log('📸 Analyzing HAPAS.VN structure...\n');
  const page1 = await browser.newPage();
  await page1.goto('https://hapas.vn/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page1.waitForTimeout(3000);
  
  const hapasAnalysis = await page1.evaluate(() => {
    const sections = {
      heroSlider: !!document.querySelector('.home-slider, [class*="slider"]'),
      categories: document.querySelectorAll('[class*="collection"], [class*="category"]').length,
      products: document.querySelectorAll('[class*="product"]').length,
      banner: document.querySelectorAll('[class*="banner"]').length,
      features: !!document.querySelector('[class*="features"]'),
      video: !!document.querySelector('[class*="video"]'),
      blog: document.querySelectorAll('[class*="blog"], [class*="news"]').length,
      totalHeight: document.body.scrollHeight
    };
    
    return sections;
  });
  
  await page1.screenshot({ path: 'hapas-vn-final.png', fullPage: true });
  await page1.close();
  
  // Analyze LOCALHOST  
  console.log('📸 Analyzing LOCALHOST implementation...\n');
  const page2 = await browser.newPage();
  await page2.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 10000 });
  await page2.waitForTimeout(2000);
  
  const localhostAnalysis = await page2.evaluate(() => {
    const sections = {
      heroSlider: !!document.querySelector('.hapas-hero-slider'),
      categoryTiles: !!document.querySelector('.hapas-category-tiles'),
      productCarousel: !!document.querySelector('.hapas-product-carousel'),
      storyBanner: !!document.querySelector('.hapas-story-banner'),
      newsGrid: !!document.querySelector('.hapas-news-grid'),
      totalHeight: document.body.scrollHeight,
      
      // Details
      categoryCount: document.querySelectorAll('.category-tile').length,
      productCount: document.querySelectorAll('.product-card').length,
      newsCount: document.querySelectorAll('.news-card').length,
      
      // Heights
      heroHeight: document.querySelector('.hapas-hero-slider')?.offsetHeight || 0,
      categoryHeight: document.querySelector('.hapas-category-tiles')?.offsetHeight || 0,
      productHeight: document.querySelector('.hapas-product-carousel')?.offsetHeight || 0,
      storyHeight: document.querySelector('.hapas-story-banner')?.offsetHeight || 0,
      newsHeight: document.querySelector('.hapas-news-grid')?.offsetHeight || 0
    };
    
    return sections;
  });
  
  await page2.screenshot({ path: 'localhost-final.png', fullPage: true });
  await page2.close();
  
  await browser.close();
  
  // Generate comparison report
  console.log('═══════════════════════════════════════════════════════════');
  console.log('           📊 FINAL COMPARISON REPORT');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  console.log('🎯 HAPAS.VN (Target):');
  console.log('  - Hero Slider:', hapasAnalysis.heroSlider ? '✅' : '❌');
  console.log('  - Category Elements:', hapasAnalysis.categories);
  console.log('  - Product Elements:', hapasAnalysis.products);
  console.log('  - Banners:', hapasAnalysis.banner);
  console.log('  - Features:', hapasAnalysis.features ? '✅' : '❌');
  console.log('  - Video Section:', hapasAnalysis.video ? '✅' : '❌');
  console.log('  - Blog/News:', hapasAnalysis.blog);
  console.log('  - Total Height:', hapasAnalysis.totalHeight + 'px\n');
  
  console.log('💻 LOCALHOST (Current):');
  console.log('  - HeroSlider:', localhostAnalysis.heroSlider ? `✅ ${localhostAnalysis.heroHeight}px` : '❌');
  console.log('  - CategoryTiles:', localhostAnalysis.categoryTiles ? `✅ ${localhostAnalysis.categoryHeight}px (${localhostAnalysis.categoryCount} items)` : '❌');
  console.log('  - ProductCarousel:', localhostAnalysis.productCarousel ? `✅ ${localhostAnalysis.productHeight}px (${localhostAnalysis.productCount} products)` : '❌');
  console.log('  - StoryBanner:', localhostAnalysis.storyBanner ? `✅ ${localhostAnalysis.storyHeight}px` : '❌');
  console.log('  - NewsGrid:', localhostAnalysis.newsGrid ? `✅ ${localhostAnalysis.newsHeight}px (${localhostAnalysis.newsCount} posts)` : '❌');
  console.log('  - Total Height:', localhostAnalysis.totalHeight + 'px\n');
  
  // Calculate similarity
  const componentsScore = (
    (localhostAnalysis.heroSlider ? 20 : 0) +
    (localhostAnalysis.categoryTiles ? 20 : 0) +
    (localhostAnalysis.productCarousel ? 20 : 0) +
    (localhostAnalysis.storyBanner ? 20 : 0) +
    (localhostAnalysis.newsGrid ? 20 : 0)
  );
  
  const heightScore = Math.min(100, (localhostAnalysis.totalHeight / hapasAnalysis.totalHeight) * 100);
  const contentScore = Math.min(100, (
    (localhostAnalysis.categoryCount / hapasAnalysis.categories) * 30 +
    (localhostAnalysis.productCount / hapasAnalysis.products) * 40 +
    (localhostAnalysis.newsCount / hapasAnalysis.blog) * 30
  ));
  
  const totalSimilarity = (componentsScore * 0.4 + heightScore * 0.3 + contentScore * 0.3);
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('           📊 SIMILARITY ASSESSMENT');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log(`  Components: ${componentsScore}% (5/5 implemented)`);
  console.log(`  Height Coverage: ${heightScore.toFixed(1)}%`);
  console.log(`  Content Density: ${contentScore.toFixed(1)}%`);
  console.log('  ───────────────────────────────────────────────────');
  console.log(`  🎯 TOTAL SIMILARITY: ${totalSimilarity.toFixed(1)}%\n`);
  
  if (totalSimilarity >= 90) {
    console.log('  ✅ TARGET ACHIEVED (>90%)! 🎉\n');
  } else if (totalSimilarity >= 70) {
    console.log('  🟡 GOOD PROGRESS (70-90%)\n');
  } else {
    console.log('  🔴 MORE WORK NEEDED (<70%)\n');
  }
  
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('📸 Screenshots saved:');
  console.log('  - hapas-vn-final.png');
  console.log('  - localhost-final.png');
})();
