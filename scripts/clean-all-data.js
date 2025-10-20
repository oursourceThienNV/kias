#!/usr/bin/env node

/**
 * Clean All Data Script for EverShop Database
 * 
 * This script removes ALL data from the database to prepare for fresh migration.
 * 
 * WARNING: This is DESTRUCTIVE and will DELETE:
 * - All products
 * - All categories (except default ones)
 * - All attributes (except default ones)
 * - All CMS pages
 * - All product images
 * - All media files
 * 
 * Usage:
 *   node scripts/clean-all-data.js
 * 
 * Requirements:
 *   - PostgreSQL running on localhost:5433
 *   - Database: hapas_ecommerce
 */

import pg from 'pg';
import { unlink, readdir, rm } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG = {
  DB: {
    host: 'localhost',
    port: 5433,
    database: 'hapas_ecommerce',
    user: 'hapas',
    password: 'hapasdev123'
  },
  MEDIA_DIR: path.join(__dirname, '../media/catalog/product')
};

class DataCleaner {
  constructor() {
    this.client = new pg.Client(CONFIG.DB);
    this.stats = {
      productsDeleted: 0,
      categoriesDeleted: 0,
      attributesDeleted: 0,
      cmsPagesDeleted: 0,
      mediaFilesDeleted: 0
    };
  }
  
  async connect() {
    await this.client.connect();
    console.log('✅ Connected to database\n');
  }
  
  async confirmDeletion() {
    console.log('⚠️  WARNING: This will DELETE ALL data from the database!\n');
    console.log('This includes:');
    console.log('  - All products and their images');
    console.log('  - All custom categories');
    console.log('  - All custom attributes');
    console.log('  - All CMS pages');
    console.log('  - All media files in media/catalog/product/\n');
    
    // In automated script, we'll skip confirmation
    // For safety, require CONFIRM_DELETE=yes environment variable
    if (process.env.CONFIRM_DELETE !== 'yes') {
      console.log('❌ Deletion cancelled. To confirm, run:');
      console.log('   CONFIRM_DELETE=yes node scripts/clean-all-data.js\n');
      process.exit(0);
    }
    
    console.log('✅ Confirmation received. Proceeding with deletion...\n');
  }
  
  async deleteProducts() {
    console.log('🗑️  Deleting products...');
    
    try {
      // Delete in correct order due to foreign keys
      
      // 1. Delete product images
      const productImagesResult = await this.client.query('DELETE FROM product_image');
      console.log(`   - Deleted ${productImagesResult.rowCount} product images`);
      
      // 2. Delete product inventory
      const inventoryResult = await this.client.query('DELETE FROM product_inventory');
      console.log(`   - Deleted ${inventoryResult.rowCount} inventory records`);
      
      // 3. Delete product descriptions
      const descResult = await this.client.query('DELETE FROM product_description');
      console.log(`   - Deleted ${descResult.rowCount} product descriptions`);
      
      // 4. Delete product attribute values
      const attrValuesResult = await this.client.query('DELETE FROM product_attribute_value_index');
      console.log(`   - Deleted ${attrValuesResult.rowCount} attribute values`);
      
      // 5. Delete products
      const productsResult = await this.client.query('DELETE FROM product');
      console.log(`   - Deleted ${productsResult.rowCount} products`);
      
      this.stats.productsDeleted = productsResult.rowCount;
      console.log(`✅ Total products deleted: ${this.stats.productsDeleted}\n`);
      
    } catch (error) {
      console.error('❌ Error deleting products:', error.message);
      throw error;
    }
  }
  
  async deleteCategories() {
    console.log('🗑️  Deleting categories...');
    
    try {
      // Keep default EverShop categories (Kids, Men, Women with IDs 1,2,3)
      // Delete all KIAS categories
      
      const descResult = await this.client.query(
        `DELETE FROM category_description 
         WHERE category_description_category_id NOT IN (1, 2, 3)`
      );
      console.log(`   - Deleted ${descResult.rowCount} category descriptions`);
      
      const categoriesResult = await this.client.query(
        `DELETE FROM category WHERE category_id NOT IN (1, 2, 3)`
      );
      console.log(`   - Deleted ${categoriesResult.rowCount} categories`);
      
      this.stats.categoriesDeleted = categoriesResult.rowCount;
      console.log(`✅ Total categories deleted: ${this.stats.categoriesDeleted}\n`);
      
    } catch (error) {
      console.error('❌ Error deleting categories:', error.message);
      throw error;
    }
  }
  
  async deleteAttributes() {
    console.log('🗑️  Deleting custom attributes...');
    
    try {
      // Delete custom KIAS attributes (material, size)
      // Keep default EverShop attributes
      
      const optionsResult = await this.client.query(
        `DELETE FROM attribute_option 
         WHERE attribute_id IN (
           SELECT attribute_id FROM attribute 
           WHERE attribute_code IN ('material', 'size')
         )`
      );
      console.log(`   - Deleted ${optionsResult.rowCount} attribute options`);
      
      const attributesResult = await this.client.query(
        `DELETE FROM attribute 
         WHERE attribute_code IN ('material', 'size')`
      );
      console.log(`   - Deleted ${attributesResult.rowCount} attributes`);
      
      this.stats.attributesDeleted = attributesResult.rowCount;
      console.log(`✅ Total attributes deleted: ${this.stats.attributesDeleted}\n`);
      
    } catch (error) {
      console.error('❌ Error deleting attributes:', error.message);
      throw error;
    }
  }
  
  async deleteCmsPages() {
    console.log('🗑️  Deleting CMS pages...');
    
    try {
      // Delete all CMS pages except "About Us" (if it exists)
      
      const descResult = await this.client.query(
        `DELETE FROM cms_page_description 
         WHERE url_key NOT IN ('about-us')`
      );
      console.log(`   - Deleted ${descResult.rowCount} page descriptions`);
      
      const pagesResult = await this.client.query(
        `DELETE FROM cms_page 
         WHERE cms_page_id NOT IN (
           SELECT cms_page_description_cms_page_id 
           FROM cms_page_description 
           WHERE url_key = 'about-us'
         )`
      );
      console.log(`   - Deleted ${pagesResult.rowCount} CMS pages`);
      
      this.stats.cmsPagesDeleted = pagesResult.rowCount;
      console.log(`✅ Total CMS pages deleted: ${this.stats.cmsPagesDeleted}\n`);
      
    } catch (error) {
      console.error('❌ Error deleting CMS pages:', error.message);
      throw error;
    }
  }
  
  async deleteMediaFiles() {
    console.log('🗑️  Deleting media files...');
    
    try {
      if (!existsSync(CONFIG.MEDIA_DIR)) {
        console.log('   ℹ️  Media directory does not exist, skipping...\n');
        return;
      }
      
      const categories = await readdir(CONFIG.MEDIA_DIR);
      
      for (const categoryDir of categories) {
        const categoryPath = path.join(CONFIG.MEDIA_DIR, categoryDir);
        
        try {
          await rm(categoryPath, { recursive: true, force: true });
          console.log(`   - Deleted: ${categoryDir}/`);
          this.stats.mediaFilesDeleted++;
        } catch (error) {
          console.log(`   ⚠️  Failed to delete: ${categoryDir}/`);
        }
      }
      
      console.log(`✅ Total media directories deleted: ${this.stats.mediaFilesDeleted}\n`);
      
    } catch (error) {
      console.error('❌ Error deleting media files:', error.message);
      // Don't throw - media deletion is not critical
    }
  }
  
  async resetSequences() {
    console.log('🔄 Resetting database sequences...');
    
    try {
      // Reset auto-increment sequences to start fresh
      await this.client.query(`
        SELECT setval('product_product_id_seq', 1, false);
        SELECT setval('category_category_id_seq', 4, false);
        SELECT setval('attribute_attribute_id_seq', 
          COALESCE((SELECT MAX(attribute_id) FROM attribute), 0) + 1, 
          false
        );
        SELECT setval('cms_page_cms_page_id_seq', 1, false);
      `);
      
      console.log('✅ Sequences reset\n');
    } catch (error) {
      console.error('⚠️  Error resetting sequences:', error.message);
      // Non-critical, continue
    }
  }
  
  async printSummary() {
    console.log('\n' + '═'.repeat(50));
    console.log('           🧹 CLEANUP SUMMARY');
    console.log('═'.repeat(50));
    console.log(`Products Deleted:       ${this.stats.productsDeleted}`);
    console.log(`Categories Deleted:     ${this.stats.categoriesDeleted}`);
    console.log(`Attributes Deleted:     ${this.stats.attributesDeleted}`);
    console.log(`CMS Pages Deleted:      ${this.stats.cmsPagesDeleted}`);
    console.log(`Media Dirs Deleted:     ${this.stats.mediaFilesDeleted}`);
    console.log('═'.repeat(50));
    console.log('\n✅ Database is now clean and ready for fresh migration!\n');
  }
  
  async run() {
    try {
      await this.connect();
      await this.confirmDeletion();
      
      await this.deleteProducts();
      await this.deleteCategories();
      await this.deleteAttributes();
      await this.deleteCmsPages();
      await this.deleteMediaFiles();
      await this.resetSequences();
      
      await this.printSummary();
      
      await this.client.end();
      console.log('✅ Disconnected from database\n');
      
    } catch (error) {
      console.error('\n💥 Cleanup failed:', error);
      await this.client.end();
      process.exit(1);
    }
  }
}

// ==================== SCRIPT EXECUTION ====================

// Windows-compatible: Convert argv path to file URL for comparison
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const cleaner = new DataCleaner();
  cleaner.run().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export default DataCleaner;

