#!/usr/bin/env node

/**
 * Validate Migration System - Quick validation before full migration
 */

import KiasMigrator from './scripts/migrate-kias-data.js';

async function validateSystem() {
  console.log('🔍 Validating migration system before full execution...\n');
  
  const migrator = new KiasMigrator();
  
  try {
    // Test 1: Initialize system
    console.log('📋 Test 1: System Initialization');
    await migrator.init();
    console.log('✅ System initialized successfully');
    
    // Test 2: Admin authentication
    console.log('\n🔐 Test 2: Admin Authentication');
    await migrator.loginAdmin();
    console.log('✅ Admin authentication successful');
    
    // Test 3: Scraping capability (just 1 category)
    console.log('\n🕷️ Test 3: Scraping Capability');
    const testCategory = {
      name: 'Set Bộ',
      slug: 'set-bo',
      url: '/',
      expectedCount: 14
    };
    
    const products = await migrator.scrapeCategoryProducts(testCategory);
    console.log(`✅ Scraping successful: ${products.length} products found`);
    
    if (products.length === 0) {
      throw new Error('No products scraped - check KIAS.VN connectivity');
    }
    
    // Test 4: Data transformation
    console.log('\n🔄 Test 4: Data Transformation');
    const sampleProduct = products[0];
    const transformedProduct = migrator.transformProductForEverShop(sampleProduct);
    
    // Validate required fields
    const requiredFields = ['name', 'url_key', 'price', 'sku', 'description'];
    const missingFields = requiredFields.filter(field => !transformedProduct[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    console.log('✅ Data transformation successful');
    console.log(`   Sample: ${transformedProduct.name} - $${transformedProduct.price}`);
    
    // Test 5: Check existing products to avoid duplicates
    console.log('\n📊 Test 5: Database State Check');
    const fs = await import('fs/promises');
    const { execSync } = await import('child_process');
    
    const productCount = execSync(
      'docker exec -it hapas_ecommerce-database-1 psql -U postgres -d evershop -t -c "SELECT COUNT(*) FROM product;"',
      { encoding: 'utf8' }
    ).trim();
    
    const kiasCount = execSync(
      'docker exec -it hapas_ecommerce-database-1 psql -U postgres -d evershop -t -c "SELECT COUNT(*) FROM product_description WHERE name LIKE \'%KIAS%\';"',
      { encoding: 'utf8' }
    ).trim();
    
    console.log(`✅ Current database state:`);
    console.log(`   Total products: ${productCount}`);
    console.log(`   KIAS products: ${kiasCount}`);
    
    // Final validation summary
    console.log('\n🎉 VALIDATION SUMMARY:');
    console.log('✅ System initialization: PASSED');
    console.log('✅ Admin authentication: PASSED');
    console.log('✅ Web scraping: PASSED');
    console.log('✅ Data transformation: PASSED');
    console.log('✅ Database connectivity: PASSED');
    
    console.log('\n🚀 SYSTEM READY FOR FULL MIGRATION!');
    console.log(`📊 Expected to migrate: ${products.length} products from test category`);
    console.log(`📊 Full migration will process: ~48 products total`);
    
    return {
      success: true,
      productsFound: products.length,
      currentProducts: parseInt(productCount),
      currentKiasProducts: parseInt(kiasCount)
    };
    
  } catch (error) {
    console.error('\n❌ VALIDATION FAILED:', error.message);
    console.error('Stack trace:', error.stack);
    
    console.log('\n🛠️ TROUBLESHOOTING STEPS:');
    console.log('1. Check EverShop is running: npm run dev');
    console.log('2. Check database connection: docker-compose -f docker-compose.dev.yml ps');
    console.log('3. Check KIAS.VN connectivity: curl https://kias.vn');
    console.log('4. Verify admin credentials in migration script');
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Run validation
validateSystem()
  .then(result => {
    if (result.success) {
      console.log('\n✅ Ready to proceed with full migration!');
      process.exit(0);
    } else {
      console.log('\n❌ Fix issues before proceeding with migration.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Validation script error:', error);
    process.exit(1);
  });
