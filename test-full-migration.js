#!/usr/bin/env node

/**
 * Test Full KIAS Migration - Test the complete migration pipeline
 */

import KiasMigrator from './scripts/migrate-kias-data.js';

async function testFullMigration() {
  console.log('🧪 Testing FULL KIAS migration pipeline...\n');
  
  const migrator = new KiasMigrator();
  await migrator.init();
  
  try {
    // Step 1: Extract product data (limited to 3 products for testing)
    console.log('📊 Step 1: Extracting product data...');
    await migrator.extractProductData();
    
    // Limit to first 3 products for testing
    const originalProducts = migrator.products;
    migrator.products = originalProducts.slice(0, 3);
    
    console.log(`\n📦 Limited to ${migrator.products.length} products for testing:`);
    migrator.products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ${product.price}₫`);
    });
    
    // Step 2: Create categories in EverShop
    console.log('\n📁 Step 2: Creating categories...');
    await migrator.createEverShopCategories();
    
    // Step 3: Import products to EverShop
    console.log('\n🛍️ Step 3: Importing products...');
    await migrator.importProducts();
    
    // Step 4: Generate report
    console.log('\n📋 Step 4: Generating report...');
    await migrator.generateReport();
    
    // Final results
    console.log('\n🎉 FULL MIGRATION TEST RESULTS:');
    console.log(`✅ Categories created: ${migrator.stats.categoriesCreated}`);
    console.log(`✅ Products imported: ${migrator.stats.successfulImports}`);
    console.log(`❌ Failed imports: ${migrator.stats.failedImports}`);
    console.log(`⚠️ Total errors: ${migrator.errors.length}`);
    
    if (migrator.errors.length > 0) {
      console.log('\n❌ ERRORS ENCOUNTERED:');
      migrator.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.type}: ${error.error}`);
      });
    }
    
    // Save detailed test results
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const testResults = {
      timestamp: new Date().toISOString(),
      testType: 'full_migration',
      stats: migrator.stats,
      errors: migrator.errors,
      productsProcessed: migrator.products.length,
      sampleProducts: migrator.products.map(p => ({
        name: p.name,
        price: p.price,
        category: p.category,
        evershopId: p.evershopId || null
      })),
      success: migrator.stats.successfulImports > 0 && migrator.errors.length === 0
    };
    
    const outputDir = 'data/test-results';
    await fs.mkdir(outputDir, { recursive: true });
    
    const outputFile = path.join(outputDir, 'full-migration-test.json');
    await fs.writeFile(outputFile, JSON.stringify(testResults, null, 2));
    
    console.log(`\n💾 Detailed test results saved to: ${outputFile}`);
    
    if (testResults.success) {
      console.log(`\n🎉 FULL MIGRATION TEST SUCCESSFUL!`);
      console.log(`Ready for production migration of all ${originalProducts.length} products.`);
    } else {
      console.log(`\n⚠️ MIGRATION TEST HAD ISSUES`);
      console.log(`Please review errors and fix before proceeding with full migration.`);
    }
    
  } catch (error) {
    console.error(`\n💥 Migration test failed:`, error.message);
    console.error(`Stack trace:`, error.stack);
    
    // Save error details
    const errorResults = {
      timestamp: new Date().toISOString(),
      testType: 'full_migration',
      error: error.message,
      stack: error.stack,
      success: false
    };
    
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const outputDir = 'data/test-results';
    await fs.mkdir(outputDir, { recursive: true });
    
    const outputFile = path.join(outputDir, 'full-migration-error.json');
    await fs.writeFile(outputFile, JSON.stringify(errorResults, null, 2));
    
    console.log(`\n💾 Error details saved to: ${outputFile}`);
  }
}

// Run test
testFullMigration();
