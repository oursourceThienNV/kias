import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error' || type === 'warning') {
      console.log(`[${type.toUpperCase()}]`, msg.text());
    }
  });
  
  console.log('Loading http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  
  await page.waitForTimeout(5000); // Wait for React hydration
  
  const analysis = await page.evaluate(() => {
    const main = document.querySelector('main');
    return {
      mainExists: !!main,
      mainHTML: main ? main.innerHTML.substring(0, 500) : 'NO MAIN',
      mainChildren: main ? main.children.length : 0,
      appDiv: document.querySelector('#app')?.innerHTML.substring(0, 300)
    };
  });
  
  console.log('\n📊 Analysis:');
  console.log('Main exists:', analysis.mainExists);
  console.log('Main children:', analysis.mainChildren);
  console.log('\nMain HTML preview:');
  console.log(analysis.mainHTML);
  
  await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
  console.log('\n📸 Screenshot saved');
  
  await page.waitForTimeout(30000); // Keep open for manual inspection
  await browser.close();
})();
