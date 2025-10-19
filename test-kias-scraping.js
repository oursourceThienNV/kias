#!/usr/bin/env node

/**
 * Test KIAS Scraping - Quick test of the scraping functionality
 */

import KiasMigrator from './scripts/migrate-kias-data.js';

async function testScraping() {
  console.log('🧪 Testing KIAS scraping functionality...\n');
  
  const migrator = new KiasMigrator();
  await migrator.init();
  
  // Test with just Set Bộ category (smallest category)
  const testCategory = {
    name: 'Set Bộ',
    slug: 'set-bo',
    url: '/danh-muc/set-bo/',
    expectedCount: 14
  };
  
  try {
    console.log(`🔍 Testing scraping for category: ${testCategory.name}`);
    const products = await migrator.scrapeCategoryProducts(testCategory);
    
    console.log(`\n📊 RESULTS:`);
    console.log(`- Products found: ${products.length}`);
    console.log(`- Expected: ${testCategory.expectedCount}`);
    
    if (products.length > 0) {
      console.log(`\n📦 Sample product:`);
      const sample = products[0];
      console.log(`- Name: ${sample.name}`);
      console.log(`- Price: ${sample.price}₫`);
      console.log(`- Category: ${sample.category}`);
      console.log(`- URL: ${sample.productUrl}`);
      console.log(`- Images: ${sample.images.length} image(s)`);
      console.log(`- On Sale: ${sample.isOnSale ? 'Yes' : 'No'}`);
      
      if (sample.originalPrice) {
        console.log(`- Original Price: ${sample.originalPrice}₫`);
        const discount = Math.round((1 - sample.price / sample.originalPrice) * 100);
        console.log(`- Discount: ${discount}%`);
      }
    }
    
    // Save test results
    const testResults = {
      timestamp: new Date().toISOString(),
      category: testCategory,
      productsFound: products.length,
      products: products.slice(0, 3), // Save first 3 products as sample
      success: products.length > 0
    };
    
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const outputDir = 'data/test-results';
    await fs.mkdir(outputDir, { recursive: true });
    
    const outputFile = path.join(outputDir, 'kias-scraping-test.json');
    await fs.writeFile(outputFile, JSON.stringify(testResults, null, 2));
    
    console.log(`\n💾 Test results saved to: ${outputFile}`);
    
    if (products.length > 0) {
      console.log(`\n✅ SCRAPING TEST SUCCESSFUL!`);
      console.log(`Ready to proceed with full migration.`);
    } else {
      console.log(`\n❌ SCRAPING TEST FAILED!`);
      console.log(`No products were extracted. Check website structure or network connectivity.`);
    }
    
  } catch (error) {
    console.error(`\n💥 Test failed:`, error.message);
    console.error(`Stack trace:`, error.stack);
  }
}

// Run test
testScraping();
