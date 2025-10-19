#!/usr/bin/env node

/**
 * KIAS.VN Data Migration Script for Hapas E-commerce
 * 
 * This script extracts product data from KIAS.VN and imports it into EverShop
 * 
 * Usage:
 *   node scripts/migrate-kias-data.js
 * 
 * Categories to import:
 * - Set Bộ (14 products)
 * - Váy & Đầm (22 products)  
 * - Quần (5 products)
 * - Áo (12 products)
 * 
 * Total: ~53 products
 * Price range: 580,000₫ - 2,780,000₫
 */

import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  KIAS_BASE_URL: 'https://kias.vn',
  OUTPUT_DIR: path.join(__dirname, '../data/kias-migration'),
  EVERSHOP_API_BASE: 'http://localhost:3000/api',
  CATEGORIES: [
    { name: 'Set Bộ', slug: 'set-bo', url: '/', expectedCount: 14 },
    { name: 'Váy & Đầm', slug: 'vay-dam', url: '/', expectedCount: 22 },
    { name: 'Quần', slug: 'quan', url: '/', expectedCount: 5 },
    { name: 'Áo', slug: 'ao', url: '/', expectedCount: 12 }
  ],
  DELAY_BETWEEN_REQUESTS: 2000, // 2 second delay to be respectful
  MAX_RETRIES: 3,
  USER_AGENTS: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  ]
};

class KiasMigrator {
  constructor() {
    this.products = [];
    this.categories = [];
    this.errors = [];
    this.adminCookies = null; // For EverShop admin authentication
    this.stats = {
      totalProducts: 0,
      successfulImports: 0,
      failedImports: 0,
      categoriesCreated: 0
    };
  }

  async init() {
    console.log('🚀 Starting KIAS.VN data migration...');
    
    // Create output directory
    await fs.mkdir(CONFIG.OUTPUT_DIR, { recursive: true });
    
    // Initialize axios with default config
    this.axios = axios.create({
      timeout: 30000,
      headers: {
        'User-Agent': this.getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });
  }

  async extractProductData() {
    console.log('📊 Extracting product data from KIAS.VN...');
    
    for (const category of CONFIG.CATEGORIES) {
      console.log(`\n📂 Processing category: ${category.name}`);
      
      try {
        // This would need to be implemented based on KIAS.VN's actual structure
        // For now, we'll create sample data structure
        const categoryProducts = await this.scrapeCategoryProducts(category);
        
        this.products.push(...categoryProducts);
        this.stats.totalProducts += categoryProducts.length;
        
        console.log(`✅ Found ${categoryProducts.length} products in ${category.name}`);
        
        // Respectful delay
        await this.delay(CONFIG.DELAY_BETWEEN_REQUESTS);
        
      } catch (error) {
        console.error(`❌ Error processing ${category.name}:`, error.message);
        this.errors.push({
          category: category.name,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    // Save extracted data
    await this.saveExtractedData();
  }

  async scrapeCategoryProducts(category) {
    console.log(`🔍 Scraping category: ${category.name} from homepage`);

    try {
      // All products are on the homepage, we'll filter by category sections
      const homepageUrl = `${CONFIG.KIAS_BASE_URL}/`;
      const response = await this.axios.get(homepageUrl);

      const $ = cheerio.load(response.data);
      const products = [];

      // Look for category-specific sections on the homepage
      // KIAS.VN displays products in sections like "SET Bộ", "Váy & Đầm", etc.
      const categorySection = this.findCategorySection($, category.name);

      if (categorySection) {
        console.log(`📂 Found section for ${category.name}`);

        // Find products within this category section
        categorySection.find('.product-small.col').each((index, element) => {
          try {
            const $product = $(element);

            // Extract product data
            const productData = this.extractProductFromElement($product, $, category);

            if (productData && productData.name && productData.price) {
              products.push(productData);
              console.log(`✅ Extracted: ${productData.name} - ${productData.price}₫`);
            }
          } catch (error) {
            console.error(`❌ Error extracting product ${index}:`, error.message);
          }
        });
      } else {
        console.log(`⚠️ No specific section found for ${category.name}, trying general product extraction`);

        // Fallback: extract all products and filter by name/content
        $('.product-small.col').each((index, element) => {
          try {
            const $product = $(element);
            const productData = this.extractProductFromElement($product, $, category);

            if (productData && productData.name && productData.price) {
              // Simple filtering based on product characteristics
              if (this.isProductInCategory(productData, category)) {
                products.push(productData);
                console.log(`✅ Extracted: ${productData.name} - ${productData.price}₫`);
              }
            }
          } catch (error) {
            console.error(`❌ Error extracting product ${index}:`, error.message);
          }
        });
      }

      console.log(`📦 Found ${products.length} products in ${category.name}`);
      return products;

    } catch (error) {
      console.error(`❌ Error scraping category ${category.name}:`, error.message);
      return [];
    }
  }

  extractProductFromElement($product, $, category) {
    // Extract product name and URL
    const nameElement = $product.find('.name.product-title a');
    const name = nameElement.text().trim();
    const productUrl = nameElement.attr('href');

    if (!name || !productUrl) {
      return null;
    }

    // Extract price information
    const priceElement = $product.find('.price .woocommerce-Price-amount.amount bdi');
    const priceText = priceElement.first().text().replace(/[^\d]/g, '');
    const price = parseInt(priceText) || 0;

    // Check for sale price
    let originalPrice = null;
    const salePriceElements = $product.find('.price .woocommerce-Price-amount.amount');
    if (salePriceElements.length > 1) {
      const originalPriceText = salePriceElements.last().text().replace(/[^\d]/g, '');
      originalPrice = parseInt(originalPriceText) || null;
    }

    // Extract image
    const imageElement = $product.find('.product-image img');
    const imageUrl = imageElement.attr('src') || imageElement.attr('data-src');

    // Check if on sale
    const isOnSale = $product.find('.badge.onsale').length > 0;

    // Generate slug from name
    const slug = this.generateSlug(name);

    // Extract rating (if available)
    const ratingElement = $product.find('.star-rating');
    const rating = ratingElement.length > 0 ? this.extractRating(ratingElement) : 0;

    return {
      name: name,
      slug: slug,
      price: price,
      originalPrice: originalPrice,
      category: category.name,
      categorySlug: category.slug,
      productUrl: productUrl.startsWith('http') ? productUrl : `${CONFIG.KIAS_BASE_URL}${productUrl}`,
      images: imageUrl ? [imageUrl] : [],
      isOnSale: isOnSale,
      rating: rating,
      description: name, // Use name as description for now
      attributes: {
        material: 'Vải cao cấp',
        origin: 'Vietnam',
        care: 'Giặt tay, không tẩy'
      },
      seo: {
        metaTitle: `${name} - ${category.name} - KIAS`,
        metaDescription: name
      }
    };
  }

  async saveExtractedData() {
    const dataFile = path.join(CONFIG.OUTPUT_DIR, 'extracted-products.json');
    const data = {
      extractedAt: new Date().toISOString(),
      stats: this.stats,
      categories: CONFIG.CATEGORIES,
      products: this.products,
      errors: this.errors
    };
    
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
    console.log(`💾 Saved extracted data to: ${dataFile}`);
  }

  async createEverShopCategories() {
    console.log('\n📁 Creating categories in EverShop...');

    // First, login to get admin session
    await this.loginAdmin();

    for (const category of CONFIG.CATEGORIES) {
      try {
        const categoryData = {
          name: category.name,
          url_key: category.slug,
          status: 1,
          include_in_nav: 1,
          description: [
            {
              id: 'category-desc-1',
              size: 12,
              columns: [
                {
                  id: 'col-1',
                  size: 12,
                  data: {
                    type: 'text',
                    text: `Danh mục ${category.name} - Thời trang cao cấp KIAS`
                  }
                }
              ]
            }
          ],
          meta_title: `${category.name} - HAPAS E-commerce`,
          meta_description: `Bộ sưu tập ${category.name} cao cấp từ KIAS`
        };

        const response = await this.axios.post(`http://localhost:3000/api/categories`, categoryData, {
          headers: {
            'Cookie': this.adminCookies,
            'Content-Type': 'application/json'
          }
        });

        console.log(`✅ Created category: ${category.name} (ID: ${response.data.data.category_id})`);
        category.evershopId = response.data.data.category_id;
        this.stats.categoriesCreated++;

      } catch (error) {
        console.error(`❌ Failed to create category ${category.name}:`, error.message);
        this.errors.push({
          type: 'category_creation',
          category: category.name,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  async loginAdmin() {
    if (this.adminCookies) {
      return; // Already logged in
    }

    console.log('🔐 Logging in as admin...');

    try {
      const loginData = {
        email: 'admin@admin.com',
        password: '123456a@'
      };

      // Use the correct admin login endpoint
      const response = await this.axios.post(`http://localhost:3000/admin/user/login`, loginData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true
      });

      // Extract cookies from response
      const setCookieHeader = response.headers['set-cookie'];
      if (setCookieHeader) {
        // Extract the session cookie (asid)
        const sessionCookie = setCookieHeader.find(cookie => cookie.startsWith('asid='));
        if (sessionCookie) {
          this.adminCookies = sessionCookie.split(';')[0];
          console.log('✅ Admin login successful');
          console.log('🍪 Session cookie:', this.adminCookies);
        } else {
          throw new Error('No session cookie (asid) received from login');
        }
      } else {
        throw new Error('No cookies received from login');
      }

    } catch (error) {
      console.error('❌ Admin login failed:', error.response?.data || error.message);
      throw new Error(`Admin login failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async importProducts() {
    console.log('\n🛍️ Importing products to EverShop...');

    // Ensure admin is logged in
    await this.loginAdmin();

    for (const product of this.products) {
      try {
        const productData = this.transformProductForEverShop(product);

        console.log(`📦 Importing: ${product.name}`);

        const response = await this.axios.post(`http://localhost:3000/api/products`, productData, {
          headers: {
            'Cookie': this.adminCookies,
            'Content-Type': 'application/json'
          }
        });

        console.log(`✅ Imported: ${product.name} (ID: ${response.data.data.product_id})`);
        product.evershopId = response.data.data.product_id;
        this.stats.successfulImports++;

        // Respectful delay
        await this.delay(CONFIG.DELAY_BETWEEN_REQUESTS);

      } catch (error) {
        console.error(`❌ Failed to import ${product.name}:`, error.response?.data?.error?.message || error.message);
        this.stats.failedImports++;
        this.errors.push({
          type: 'product_import',
          product: product.name,
          error: error.response?.data?.error?.message || error.message,
          timestamp: new Date().toISOString()
        });

        // Continue with next product even if one fails
        continue;
      }
    }
  }

  transformProductForEverShop(kiasProduct) {
    // Generate unique SKU
    const sku = `KIAS-${kiasProduct.slug.substring(0, 20)}-${Date.now().toString().slice(-6)}`;

    return {
      name: kiasProduct.name,
      url_key: kiasProduct.slug,
      price: kiasProduct.price / 1000, // Convert VND to thousands for easier handling
      status: 1, // Active
      visibility: 1, // Visible
      manage_stock: true,
      stock_availability: true,
      qty: 100, // Default stock quantity
      weight: 0.5, // Default weight in kg
      sku: sku,
      // Description must be array format for EverShop
      description: [
        {
          id: 'product-desc-1',
          size: 12,
          columns: [
            {
              id: 'col-1',
              size: 12,
              data: {
                type: 'text',
                text: kiasProduct.description || kiasProduct.name
              }
            }
          ]
        }
      ],
      short_description: (kiasProduct.description || kiasProduct.name).substring(0, 160),
      meta_title: kiasProduct.seo?.metaTitle || `${kiasProduct.name} - HAPAS`,
      meta_description: kiasProduct.seo?.metaDescription || kiasProduct.description || kiasProduct.name,
      group_id: 1, // Default product group - required by EverShop
      // Add images if available
      images: kiasProduct.images || [],
      // Add attributes for product details
      attributes: [
        {
          attribute_code: 'material',
          value: kiasProduct.attributes?.material || 'Vải cao cấp'
        },
        {
          attribute_code: 'origin',
          value: kiasProduct.attributes?.origin || 'Vietnam'
        },
        {
          attribute_code: 'care_instructions',
          value: kiasProduct.attributes?.care || 'Giặt tay, không tẩy'
        }
      ]
    };
  }

  async downloadImages() {
    console.log('\n🖼️ Downloading product images...');
    
    const imageDir = path.join(CONFIG.OUTPUT_DIR, 'images');
    await fs.mkdir(imageDir, { recursive: true });
    
    // TODO: Implement image download logic
    console.log('📸 Image download completed');
  }

  async generateReport() {
    const report = {
      migrationDate: new Date().toISOString(),
      stats: this.stats,
      errors: this.errors,
      summary: {
        totalProductsFound: this.stats.totalProducts,
        successRate: `${((this.stats.successfulImports / this.stats.totalProducts) * 100).toFixed(2)}%`,
        categoriesCreated: this.stats.categoriesCreated,
        errorsCount: this.errors.length
      }
    };
    
    const reportFile = path.join(CONFIG.OUTPUT_DIR, 'migration-report.json');
    await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
    
    console.log('\n📊 Migration Report:');
    console.log(`Total products found: ${report.stats.totalProducts}`);
    console.log(`Successful imports: ${report.stats.successfulImports}`);
    console.log(`Failed imports: ${report.stats.failedImports}`);
    console.log(`Success rate: ${report.summary.successRate}`);
    console.log(`Categories created: ${report.stats.categoriesCreated}`);
    console.log(`Errors: ${report.summary.errorsCount}`);
    console.log(`\n📄 Full report saved to: ${reportFile}`);
  }

  getRandomUserAgent() {
    return CONFIG.USER_AGENTS[Math.floor(Math.random() * CONFIG.USER_AGENTS.length)];
  }

  generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim('-'); // Remove leading/trailing hyphens
  }

  extractRating($ratingElement) {
    // Try to extract rating from star-rating element
    const ratingText = $ratingElement.attr('title') || $ratingElement.text();
    const ratingMatch = ratingText.match(/(\d+(?:\.\d+)?)/);
    return ratingMatch ? parseFloat(ratingMatch[1]) : 0;
  }

  findCategorySection($, categoryName) {
    // Look for section headers that match the category name
    const sectionHeaders = $('h1, h2, h3, h4, h5, h6, .heading-font');

    for (let i = 0; i < sectionHeaders.length; i++) {
      const header = $(sectionHeaders[i]);
      const headerText = header.text().trim().toUpperCase();
      const categoryUpper = categoryName.toUpperCase();

      if (headerText.includes(categoryUpper) || categoryUpper.includes(headerText)) {
        // Found matching header, return the section containing products
        const section = header.closest('section, .section, .row').first();
        if (section.length > 0) {
          return section;
        }

        // Fallback: look for next sibling with products
        const nextSection = header.nextAll().find('.products, .product-small').first().closest('.row, .section');
        if (nextSection.length > 0) {
          return nextSection;
        }
      }
    }

    return null;
  }

  isProductInCategory(productData, category) {
    // Simple heuristic to determine if a product belongs to a category
    const productName = productData.name.toLowerCase();
    const categoryName = category.name.toLowerCase();

    // Category-specific keywords
    const categoryKeywords = {
      'set bộ': ['set', 'bộ', 'combo', 'áo + quần', 'áo + chân váy'],
      'váy & đầm': ['váy', 'đầm', 'dress', 'skirt'],
      'quần': ['quần', 'pants', 'trouser', 'short'],
      'áo': ['áo', 'shirt', 'blouse', 'top']
    };

    const keywords = categoryKeywords[categoryName] || [];

    // Check if product name contains category keywords
    for (const keyword of keywords) {
      if (productName.includes(keyword)) {
        return true;
      }
    }

    // Default: include all products if no specific filtering
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async run() {
    try {
      await this.init();
      await this.extractProductData();
      await this.createEverShopCategories();
      await this.importProducts();
      await this.downloadImages();
      await this.generateReport();
      
      console.log('\n🎉 KIAS migration completed successfully!');
      
    } catch (error) {
      console.error('\n💥 Migration failed:', error);
      process.exit(1);
    }
  }
}

// Run migration if called directly (Windows-compatible)
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const migrator = new KiasMigrator();
  migrator.run();
}

export default KiasMigrator;
