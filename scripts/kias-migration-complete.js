#!/usr/bin/env node

/**
 * KIAS.VN Complete Data Migration Script for Hapas E-commerce (EverShop)
 * 
 * This script performs a complete migration of product data from KIAS.VN including:
 * - Categories with proper EverShop structure
 * - Products with full details (images, description, attributes, variants)
 * - Image downloads to local media directory
 * - Custom attributes creation
 * - URL key conflict resolution
 * - Comprehensive error handling and reporting
 * 
 * Usage:
 *   node scripts/kias-migration-complete.js
 * 
 * Requirements:
 *   - EverShop instance running on localhost:3000
 *   - Admin credentials: admin@admin.com / 123456a@
 *   - Internet connection for KIAS.VN scraping
 *   - Write access to media/ directory
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import { createWriteStream, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==================== CONFIGURATION ====================

const CONFIG = {
  KIAS_BASE_URL: 'https://kias.vn',
  EVERSHOP_API_BASE: 'http://localhost:3000',
  OUTPUT_DIR: path.join(__dirname, '../data/kias-migration'),
  MEDIA_DIR: path.join(__dirname, '../media'),
  
  // KIAS categories (scrape from KIAS.vn)
  KIAS_CATEGORIES: [
    { name: 'Set Bộ', slug: 'set-bo', url: 'https://kias.vn/danh-muc-san-pham/set-bo-sets/' },
    { name: 'Váy & Đầm', slug: 'vay-dam', url: 'https://kias.vn/danh-muc-san-pham/vay-dam/' },
    { name: 'Quần', slug: 'quan', url: 'https://kias.vn/danh-muc-san-pham/quan-pants/' },
    { name: 'Áo', slug: 'ao', url: 'https://kias.vn/danh-muc-san-pham/ao-tops/' }
  ],
  
  // Additional categories for homepage display (matching kias-hapas-mapping.json)
  ADDITIONAL_CATEGORIES: [
    { 
      name: 'Hàng mới về', 
      slug: 'new-arrivals', 
      description: 'Sản phẩm mới nhất',
      isVirtual: true // Not a KIAS category, just for display
    },
    { 
      name: 'Giá mới hấp dẫn', 
      slug: 'sale', 
      description: 'Sản phẩm khuyến mãi',
      isVirtual: true
    }
  ],
  
  // Combined list for DB creation
  get CATEGORIES() {
    return [
      ...this.KIAS_CATEGORIES,
      ...this.ADDITIONAL_CATEGORIES
    ];
  },
  
  ADMIN_CREDENTIALS: {
    email: 'admin@admin.com',
    password: '123456a@'
  },
  
  DELAY_BETWEEN_REQUESTS: 2000, // 2 seconds
  MAX_RETRIES: 3,
  MAX_PRODUCTS_PER_CATEGORY: 20, // Limit for testing
  
  USER_AGENT: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Normalize Vietnamese characters for URL-safe slugs
 */
function normalizeVietnamese(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

/**
 * Generate URL-safe slug from Vietnamese text
 */
function slugify(text) {
  return normalizeVietnamese(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Generate unique slug with suffix if needed
 */
function generateUniqueSlug(name, existingSlugs = new Set()) {
  let slug = slugify(name);
  let counter = 1;
  
  while (existingSlugs.has(slug)) {
    slug = `${slugify(name)}-${counter}`;
    counter++;
  }
  
  existingSlugs.add(slug);
  return slug;
}

/**
 * Decode HTML entities (comprehensive version for Node.js)
 */
function decodeHtmlEntities(html) {
  if (!html) return '';
  
  const entities = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&#039;': "'",
    '&#39;': "'",
    '&nbsp;': ' ',
    '&apos;': "'",
    '&ndash;': '–',
    '&mdash;': '—',
    '&hellip;': '…'
  };
  
  // First pass: Replace known entities
  let decoded = html;
  Object.keys(entities).forEach(entity => {
    decoded = decoded.split(entity).join(entities[entity]);
  });
  
  // Second pass: Replace numeric entities (&#xxx; and &#xHH;)
  decoded = decoded.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
  decoded = decoded.replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
  
  return decoded;
}

/**
 * Convert HTML content to EverShop EditorJS format
 */
function formatDescription(htmlContent) {
  if (!htmlContent) {
    return [];
  }
  
  // Decode HTML entities first
  const decodedHtml = decodeHtmlEntities(htmlContent);
  
  // Format description to match EverShop's EditorJS structure
  // Must have blocks array with type 'raw' for HTML content
  return [
    {
      id: `row-${Date.now()}`,
      size: 12,
      columns: [
        {
          id: `col-${Date.now()}`,
          size: 12,
          data: {
            blocks: [
              {
                type: 'raw',
                id: `block-${Date.now()}`,
                data: {
                  html: decodedHtml
                }
              }
            ]
          }
        }
      ]
    }
  ];
}

/**
 * Ensure directory exists
 */
async function ensureDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

/**
 * Download image from URL to local path
 */
async function downloadImage(url, localPath) {
  const response = await axios.get(url, {
    responseType: 'stream',
    timeout: 30000,
    headers: {
      'User-Agent': CONFIG.USER_AGENT
    }
  });
  
  await ensureDir(path.dirname(localPath));
  const writer = createWriteStream(localPath);
  response.data.pipe(writer);
  await finished(writer);
}

/**
 * Delay execution
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ==================== MAIN MIGRATOR CLASS ====================

class KiasCompleteMigrator {
  constructor() {
    this.adminCookies = null;
    this.categoryMap = new Map(); // name → {id, slug}
    this.attributeMap = new Map(); // code → {id, options}
    this.existingSlugs = new Set();
    this.products = [];
    this.errors = [];
    this.stats = {
      categoriesCreated: 0,
      attributesCreated: 0,
      productsScraped: 0,
      productsImported: 0,
      productsFailed: 0,
      imagesDownloaded: 0,
      imagesFailed: 0,
      cmsPagesCreated: 0,
      cmsPagesFailed: 0
    };
    
    this.axios = axios.create({
      timeout: 30000,
      headers: {
        'User-Agent': CONFIG.USER_AGENT
      }
    });
  }
  
  // ==================== INITIALIZATION ====================
  
  async init() {
    console.log('🚀 Starting KIAS.VN Complete Migration to EverShop\n');
    console.log('Configuration:');
    console.log(`  KIAS Base URL: ${CONFIG.KIAS_BASE_URL}`);
    console.log(`  EverShop API: ${CONFIG.EVERSHOP_API_BASE}`);
    console.log(`  Media Directory: ${CONFIG.MEDIA_DIR}`);
    console.log(`  KIAS Categories: ${CONFIG.KIAS_CATEGORIES.length}`);
    console.log(`  Virtual Categories: ${CONFIG.ADDITIONAL_CATEGORIES.length}`);
    console.log(`  Total Categories: ${CONFIG.CATEGORIES.length}`);
    console.log('');
    
    // Ensure directories exist
    await ensureDir(CONFIG.OUTPUT_DIR);
    await ensureDir(path.join(CONFIG.MEDIA_DIR, 'catalog/product'));
    
    console.log('✅ Directories initialized\n');
  }
  
  // ==================== AUTHENTICATION ====================
  
  async loginAdmin() {
    if (this.adminCookies) {
      return; // Already logged in
    }
    
    console.log('🔐 Logging in as admin...');
    
    try {
      const response = await axios.post(
        `${CONFIG.EVERSHOP_API_BASE}/admin/user/login`,
        CONFIG.ADMIN_CREDENTIALS,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      
      const setCookieHeader = response.headers['set-cookie'];
      if (!setCookieHeader) {
        throw new Error('No cookies received from login');
      }
      
      const sessionCookie = setCookieHeader.find(cookie => cookie.startsWith('asid='));
      if (!sessionCookie) {
        throw new Error('No session cookie (asid) received');
      }
      
      this.adminCookies = sessionCookie.split(';')[0];
      console.log('✅ Admin login successful\n');
    } catch (error) {
      console.error('❌ Admin login failed:', error.response?.data || error.message);
      throw new Error(`Admin login failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }
  
  // ==================== ATTRIBUTES CREATION ====================
  
  async createAttributes() {
    console.log('🏗️  Creating custom attributes...\n');
    
    await this.loginAdmin();
    
    const attributes = [
      {
        attribute_code: 'material',
        attribute_name: 'Chất liệu',
        type: 'text',
        is_required: 0,
        display_on_frontend: 1,
        is_filterable: 0,
        groups: [1]
      },
      {
        attribute_code: 'size',
        attribute_name: 'Kích cỡ',
        type: 'select',
        is_required: 0,
        display_on_frontend: 1,
        is_filterable: 1,
        groups: [1],
        options: [
          { option_text: 'S' },
          { option_text: 'M' },
          { option_text: 'L' },
          { option_text: 'XL' }
        ]
      }
    ];
    
    for (const attrData of attributes) {
      try {
        // Check if attribute already exists
        const checkResponse = await axios.get(
          `${CONFIG.EVERSHOP_API_BASE}/api/attributes`,
          {
            headers: { Cookie: this.adminCookies }
          }
        );
        
        const existing = checkResponse.data?.data?.items?.find(
          a => a.attributeCode === attrData.attribute_code
        );
        
        if (existing) {
          console.log(`ℹ️  Attribute "${attrData.attribute_name}" already exists (ID: ${existing.attributeId})`);
          
          // Store full attribute info including options
          this.attributeMap.set(attrData.attribute_code, {
            id: existing.attributeId,
            attribute_code: existing.attributeCode,
            attribute_name: existing.attributeName,
            type: existing.type,
            options: existing.options || []
          });
          
          if (existing.options && existing.options.length > 0) {
            console.log(`   → Options: ${existing.options.map(o => o.option_text || o.optionText).join(', ')}`);
          }
          continue;
        }
        
        // Create attribute
        const response = await axios.post(
          `${CONFIG.EVERSHOP_API_BASE}/api/attributes`,
          attrData,
          {
            headers: {
              Cookie: this.adminCookies,
              'Content-Type': 'application/json'
            }
          }
        );
        
        const created = response.data.data;
        
        // Store full attribute info including options (critical for size mapping)
        this.attributeMap.set(attrData.attribute_code, {
          id: created.attribute_id || created.attributeId,
          attribute_code: attrData.attribute_code,
          attribute_name: attrData.attribute_name,
          type: attrData.type,
          options: attrData.options?.map((opt, idx) => ({
            attribute_option_id: created.options?.[idx]?.attribute_option_id || idx + 1,
            option_text: opt.option_text
          })) || []
        });
        
        console.log(`✅ Created attribute: ${attrData.attribute_name} (ID: ${created.attribute_id || created.attributeId})`);
        if (attrData.options) {
          console.log(`   → Options: ${attrData.options.map(o => o.option_text).join(', ')}`);
        }
        this.stats.attributesCreated++;
        
        await delay(500);
      } catch (error) {
        console.error(`❌ Failed to create attribute "${attrData.attribute_name}":`, error.response?.data || error.message);
        this.errors.push({
          type: 'attribute_creation',
          attribute: attrData.attribute_name,
          error: error.response?.data || error.message
        });
      }
    }
    
    console.log('');
  }
  
  // ==================== CATEGORIES CREATION ====================
  
  async createCategories() {
    console.log('📁 Creating categories...\n');
    
    await this.loginAdmin();
    
    for (const category of CONFIG.CATEGORIES) {
      try {
        // Customize description based on category type
        let description, metaDesc;
        
        if (category.isVirtual) {
          // Virtual categories (New Arrivals, Sale)
          description = formatDescription(`<p>${category.description || category.name}</p>`);
          metaDesc = category.description || `${category.name} - Thời trang KIAS`;
        } else {
          // Real KIAS categories
          description = formatDescription(`Bộ sưu tập ${category.name} cao cấp từ KIAS - Thời trang thiết kế dành cho phụ nữ hiện đại`);
          metaDesc = `Khám phá bộ sưu tập ${category.name} cao cấp tại KIAS - Thanh lịch, nhẹ nhàng, dễ ứng dụng`;
        }
        
        const categoryData = {
          name: category.name,
          url_key: category.slug,
          status: 1,
          include_in_nav: category.isVirtual ? 0 : 1, // Virtual categories không show in nav
          position: CONFIG.CATEGORIES.indexOf(category) + 1,
          description,
          meta_title: `${category.name} - Thời trang KIAS`,
          meta_description: metaDesc
        };
        
        const response = await axios.post(
          `${CONFIG.EVERSHOP_API_BASE}/api/categories`,
          categoryData,
          {
            headers: {
              Cookie: this.adminCookies,
              'Content-Type': 'application/json'
            }
          }
        );
        
        const created = response.data.data;
        this.categoryMap.set(category.name, {
          id: created.category_id,
          slug: category.slug
        });
        
        console.log(`✅ Created category: ${category.name} (ID: ${created.category_id})`);
        this.stats.categoriesCreated++;
        
        await delay(1000);
      } catch (error) {
        // Check if it's duplicate error
        if (error.response?.status === 409 || error.response?.data?.error?.message?.includes('already exists')) {
          console.log(`ℹ️  Category "${category.name}" may already exist, attempting to fetch...`);
          // Try to get existing category ID
          // For now, we'll skip this category
          continue;
        }
        
        console.error(`❌ Failed to create category "${category.name}":`, error.response?.data || error.message);
        this.errors.push({
          type: 'category_creation',
          category: category.name,
          error: error.response?.data || error.message
        });
      }
    }
    
    console.log('');
  }
  
  // ==================== PRODUCT SCRAPING ====================
  
  async scrapeProducts() {
    console.log('🔍 Scraping products from KIAS.VN...\n');
    
    // Only scrape from KIAS categories (not virtual categories)
    for (const category of CONFIG.KIAS_CATEGORIES) {
      console.log(`📂 Category: ${category.name}`);
      console.log(`   URL: ${category.url}`);
      
      try {
        const response = await this.axios.get(category.url);
        const $ = cheerio.load(response.data);
        
        // Find all product cards
        const productLinks = [];
        $('.product-small .box-image a').each((index, element) => {
          if (index >= CONFIG.MAX_PRODUCTS_PER_CATEGORY) return false; // Limit
          const url = $(element).attr('href');
          if (url) {
            productLinks.push(url);
          }
        });
        
        console.log(`   Found ${productLinks.length} products\n`);
        
        // Scrape each product detail
        for (const productUrl of productLinks) {
          await this.scrapeProductDetail(productUrl, category);
          await delay(CONFIG.DELAY_BETWEEN_REQUESTS);
        }
        
      } catch (error) {
        console.error(`❌ Failed to scrape category "${category.name}":`, error.message);
        this.errors.push({
          type: 'category_scraping',
          category: category.name,
          error: error.message
        });
      }
    }
    
    console.log(`\n✅ Total products scraped: ${this.stats.productsScraped}\n`);
  }
  
  async scrapeProductDetail(productUrl, category) {
    try {
      console.log(`   🔎 Scraping: ${productUrl.substring(0, 80)}...`);
      
      const response = await this.axios.get(productUrl);
      const $ = cheerio.load(response.data);
      
      // Extract product name
      const name = $('h1.product-title').first().text().trim();
      if (!name) {
        console.log(`      ⚠️  Skipped: No product name found`);
        return;
      }
      
      // Extract price
      const priceText = $('.price .woocommerce-Price-amount bdi').first().text().replace(/[^\d]/g, '');
      const price = parseInt(priceText) || 0;
      
      // Extract images
      const images = [];
      $('.product-gallery img').each((index, element) => {
        const src = $(element).attr('src') || $(element).attr('data-src');
        if (src && !src.includes('placeholder')) {
          // Get the full-size image URL
          const fullSrc = src.replace(/-\d+x\d+\./, '.'); // Remove WordPress size suffix
          images.push(fullSrc);
        }
      });
      
      // Extract description
      const descriptionHtml = $('#tab-description').html() || '';
      
      // Extract material from description
      let material = 'Vải cao cấp';
      const materialMatch = descriptionHtml.match(/Chất liệu[:\s]*([^<\n]+)/i);
      if (materialMatch) {
        material = materialMatch[1].trim();
      }
      
      // Extract sizes
      const sizes = [];
      $('.variations_form .value button').each((index, element) => {
        const sizeText = $(element).text().trim();
        if (sizeText && !sizeText.includes('Lựa chọn')) {
          sizes.push(sizeText);
        }
      });
      
      // Generate unique URL key
      const urlKey = generateUniqueSlug(name, this.existingSlugs);
      
      const productData = {
        name,
        url_key: urlKey,
        price,
        category: category.name,
        categorySlug: category.slug,
        productUrl,
        images,
        sizes,
        material,
        description: descriptionHtml,
        seo: {
          meta_title: `${name} - ${category.name} - KIAS`,
          meta_description: name.substring(0, 160)
        }
      };
      
      this.products.push(productData);
      this.stats.productsScraped++;
      
      console.log(`      ✅ ${name.substring(0, 60)}... (${images.length} images, ${sizes.length} sizes)`);
      
    } catch (error) {
      console.log(`      ❌ Failed: ${error.message}`);
      this.errors.push({
        type: 'product_scraping',
        url: productUrl,
        error: error.message
      });
    }
  }
  
  // ==================== IMAGE DOWNLOAD ====================
  
  async downloadImages() {
    console.log('\n🖼️  Downloading product images...\n');
    
    for (const product of this.products) {
      const categoryDir = path.join(CONFIG.MEDIA_DIR, 'catalog/product', product.categorySlug);
      await ensureDir(categoryDir);
      
      const downloadedImages = [];
      
      for (const imageUrl of product.images) {
        try {
          const filename = path.basename(new URL(imageUrl).pathname);
          const localPath = path.join(categoryDir, filename);
          const relativePath = `media/catalog/product/${product.categorySlug}/${filename}`;
          
          // Check if already downloaded
          if (existsSync(localPath)) {
            downloadedImages.push(relativePath);
            continue;
          }
          
          await downloadImage(imageUrl, localPath);
          downloadedImages.push(relativePath);
          this.stats.imagesDownloaded++;
          
        } catch (error) {
          console.log(`   ⚠️  Failed to download image: ${imageUrl.substring(0, 60)}...`);
          this.stats.imagesFailed++;
        }
      }
      
      product.localImages = downloadedImages;
      
      if (downloadedImages.length > 0) {
        console.log(`   ✅ ${product.name.substring(0, 50)}... (${downloadedImages.length} images)`);
      }
    }
    
    console.log(`\n✅ Images downloaded: ${this.stats.imagesDownloaded}`);
    console.log(`⚠️  Images failed: ${this.stats.imagesFailed}\n`);
  }
  
  // ==================== PRODUCT IMPORT ====================
  
  async importProducts() {
    console.log('\n📦 Importing products to EverShop...\n');
    
    await this.loginAdmin();
    
    for (const product of this.products) {
      try {
        const categoryInfo = this.categoryMap.get(product.category);
        if (!categoryInfo) {
          console.log(`   ⚠️  Skipped: Category "${product.category}" not found`);
          this.stats.productsFailed++;
          continue;
        }
        
        // Generate SKU
        const sku = `KIAS-${product.url_key.substring(0, 20)}-${Date.now().toString(36)}`.toUpperCase();
        
        // Transform for EverShop (ALL required fields + optionals)
        const productPayload = {
          // Required fields (13)
          name: product.name,
          url_key: product.url_key, // will be validated and cleaned
          sku,
          price: product.price,
          status: 1,
          visibility: 1,
          manage_stock: 1, // Must be number 0/1, not boolean
          stock_availability: 1, // Must be number 0/1, not boolean
          qty: 100,
          weight: 0.4, // kg, default for Vietnamese clothing
          group_id: 1, // Default attribute group
          tax_class: 1, // CRITICAL: Was missing, must be present
          meta_title: product.seo.meta_title || `${product.name} - ${product.category}`,
          
          // Optional fields (recommended)
          category_id: categoryInfo.id,
          description: formatDescription(product.description),
          meta_description: product.seo.meta_description || product.name.substring(0, 160),
          meta_keywords: `${product.category}, KIAS, thời trang`,
          images: product.localImages || [] // Array of relative paths
        };
        
        // Clean url_key to match EverShop pattern: /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/
        productPayload.url_key = productPayload.url_key
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        
        // Add attributes (ensure correct format)
        if (product.material && this.attributeMap.has('material')) {
          productPayload.attributes = productPayload.attributes || [];
          productPayload.attributes.push({
            attribute_code: 'material',
            value: product.material // text type: string value
          });
        }
        
        // Add size attribute (multiselect: array of option_id strings)
        if (product.sizes && product.sizes.length > 0 && this.attributeMap.has('size')) {
          const sizeAttr = this.attributeMap.get('size');
          const sizeOptionIds = product.sizes
            .map(sizeName => {
              const option = sizeAttr.options?.find(opt => 
                opt.option_text.toLowerCase() === sizeName.toLowerCase()
              );
              return option ? option.attribute_option_id.toString() : null;
            })
            .filter(id => id !== null);
          
          if (sizeOptionIds.length > 0) {
            productPayload.attributes = productPayload.attributes || [];
            productPayload.attributes.push({
              attribute_code: 'size',
              value: sizeOptionIds // multiselect type: array of strings
            });
          }
        }
        
        // Try to import with retries
        let imported = false;
        for (let attempt = 1; attempt <= CONFIG.MAX_RETRIES; attempt++) {
          try {
            const response = await axios.post(
              `${CONFIG.EVERSHOP_API_BASE}/api/products`,
              productPayload,
              {
                headers: {
                  Cookie: this.adminCookies,
                  'Content-Type': 'application/json'
                }
              }
            );
            
            console.log(`   ✅ ${product.name.substring(0, 60)}... (ID: ${response.data.data.product_id})`);
            this.stats.productsImported++;
            imported = true;
            break;
            
          } catch (error) {
            if (error.response?.status === 409 && attempt < CONFIG.MAX_RETRIES) {
              // URL key conflict - retry with modified key
              productPayload.url_key = `${product.url_key}-${attempt}`;
              console.log(`   🔄 Retry with new URL key: ${productPayload.url_key}`);
              continue;
            }
            throw error;
          }
        }
        
        if (!imported) {
          throw new Error('Failed after max retries');
        }
        
        await delay(CONFIG.DELAY_BETWEEN_REQUESTS);
        
      } catch (error) {
        console.log(`   ❌ Failed: ${product.name.substring(0, 60)}...`);
        console.log(`      Error: ${error.response?.data?.error?.message || error.message}`);
        this.stats.productsFailed++;
        this.errors.push({
          type: 'product_import',
          product: product.name,
          error: error.response?.data || error.message
        });
      }
    }
    
    console.log(`\n✅ Products imported: ${this.stats.productsImported}`);
    console.log(`❌ Products failed: ${this.stats.productsFailed}\n`);
  }
  
  // ==================== CMS PAGES CREATION ====================
  
  async createCmsPages() {
    console.log('\n📰 Creating CMS pages for NewsGrid...\n');
    
    await this.loginAdmin();
    
    const blogPosts = [
      {
        name: 'Xu hướng thời trang Xuân Hè 2025',
        url_key: 'xu-huong-thoi-trang-xuan-he-2025',
        meta_title: 'Xu hướng thời trang Xuân Hè 2025 - KIAS',
        meta_description: 'Khám phá những xu hướng thời trang nổi bật nhất cho mùa Xuân Hè 2025 từ KIAS',
        content: 'Xu hướng thời trang Xuân Hè 2025 đang chú trọng vào sự thanh lịch, tối giản nhưng vẫn đầy tinh tế. KIAS mang đến những thiết kế độc đáo, kết hợp chất liệu cao cấp và màu sắc hài hòa.'
      },
      {
        name: 'Bí quyết phối đồ công sở thanh lịch',
        url_key: 'bi-quyet-phoi-do-cong-so',
        meta_title: 'Bí quyết phối đồ công sở thanh lịch',
        meta_description: 'Cẩm nang phối đồ công sở chuyên nghiệp và thanh lịch cho phụ nữ hiện đại',
        content: 'Phối đồ công sở không chỉ là việc chọn trang phục, mà còn là nghệ thuật thể hiện phong cách cá nhân. KIAS hướng dẫn bạn tạo nên tủ đồ công sở hoàn hảo với những bộ Set Bộ, Váy công sở và Áo thanh lịch.'
      },
      {
        name: 'BST Set Bộ Cao Cấp 2025',
        url_key: 'bst-set-bo-cao-cap-2025',
        meta_title: 'BST Set Bộ Cao Cấp - Tinh Tế Từng Chi Tiết',
        meta_description: 'Bộ sưu tập Set Bộ cao cấp với thiết kế tinh tế, chất liệu tuyển chọn',
        content: 'Bộ sưu tập Set Bộ 2025 của KIAS là sự kết hợp hoàn hảo giữa chất liệu cao cấp và thiết kế tinh tế. Mỗi bộ trang phục được chăm chút từng chi tiết nhỏ nhất để mang đến vẻ đẹp hoàn mỹ.'
      },
      {
        name: 'Chất liệu vải cao cấp - Điều làm nên KIAS',
        url_key: 'chat-lieu-vai-cao-cap',
        meta_title: 'Chất liệu vải cao cấp - Điều làm nên KIAS',
        meta_description: 'Tìm hiểu về các chất liệu vải cao cấp được KIAS sử dụng trong từng sản phẩm',
        content: 'KIAS tin rằng chất liệu là linh hồn của mỗi sản phẩm. Chúng tôi chọn lọc những loại vải cao cấp nhất: Linen Ý, Lụa Pháp, Cotton Blend, mang đến sự thoải mái và đẳng cấp.'
      },
      {
        name: 'Phong cách tối giản - Xu hướng bền vững',
        url_key: 'phong-cach-toi-gian-ben-vung',
        meta_title: 'Phong cách tối giản - Xu hướng bền vững',
        meta_description: 'Phong cách tối giản và bền vững trong thời trang hiện đại',
        content: 'Minimalism không chỉ là xu hướng mà còn là triết lý sống. KIAS theo đuổi thiết kế tối giản, bền vững, giúp bạn xây dựng tủ đồ capsule wardrobe chất lượng cao.'
      },
      {
        name: 'Hướng dẫn bảo quản quần áo cao cấp',
        url_key: 'huong-dan-bao-quan-quan-ao-cao-cap',
        meta_title: 'Hướng dẫn bảo quản quần áo cao cấp',
        meta_description: 'Cách bảo quản quần áo cao cấp để giữ được chất lượng lâu dài',
        content: 'Quần áo cao cấp cần được chăm sóc đúng cách. KIAS chia sẻ bí quyết bảo quản từng loại vải: Linen, Silk, Cotton để sản phẩm luôn như mới và bền đẹp theo thời gian.'
      }
    ];
    
    for (const post of blogPosts) {
      try {
        // Format content to EverShop EditorJS structure
        const formattedContent = [
          {
            id: `row-${Date.now()}`,
            size: 12,
            columns: [
              {
                id: `col-${Date.now()}`,
                size: 12,
                data: {
                  type: 'html',
                  content: `<p>${post.content}</p>`
                }
              }
            ]
          }
        ];
        
        const pageData = {
          status: 1,
          url_key: post.url_key,
          name: post.name,
          content: formattedContent,
          meta_title: post.meta_title,
          meta_description: post.meta_description,
          meta_keywords: 'KIAS, thời trang, blog, tin tức'
        };
        
        const response = await axios.post(
          `${CONFIG.EVERSHOP_API_BASE}/api/pages`,
          pageData,
          {
            headers: {
              Cookie: this.adminCookies,
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log(`   ✅ ${post.name}`);
        this.stats.cmsPagesCreated++;
        
        await delay(500);
        
      } catch (error) {
        console.log(`   ❌ Failed: ${post.name}`);
        console.log(`      Error: ${error.response?.data?.error?.message || error.message}`);
        this.stats.cmsPagesFailed++;
        this.errors.push({
          type: 'cms_page_creation',
          page: post.name,
          error: error.response?.data || error.message
        });
      }
    }
    
    console.log(`\n✅ CMS pages created: ${this.stats.cmsPagesCreated}`);
    console.log(`❌ CMS pages failed: ${this.stats.cmsPagesFailed}\n`);
  }
  
  // ==================== REPORTING ====================
  
  async generateReport() {
    console.log('\n📊 Generating migration report...\n');
    
    const report = {
      timestamp: new Date().toISOString(),
      stats: this.stats,
      summary: {
        totalProductsScraped: this.stats.productsScraped,
        totalProductsImported: this.stats.productsImported,
        successRate: this.stats.productsScraped > 0 
          ? `${((this.stats.productsImported / this.stats.productsScraped) * 100).toFixed(2)}%`
          : '0%',
        totalErrors: this.errors.length
      },
      categories: Array.from(this.categoryMap.entries()).map(([name, info]) => ({
        name,
        id: info.id,
        slug: info.slug
      })),
      attributes: Array.from(this.attributeMap.entries()).map(([code, info]) => ({
        code,
        id: info.id,
        optionsCount: info.options.length
      })),
      errors: this.errors
    };
    
    const reportPath = path.join(CONFIG.OUTPUT_DIR, 'migration-report-complete.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log('Migration Summary:');
    console.log('─'.repeat(50));
    console.log(`Categories Created:     ${this.stats.categoriesCreated}`);
    console.log(`Attributes Created:     ${this.stats.attributesCreated}`);
    console.log(`Products Scraped:       ${this.stats.productsScraped}`);
    console.log(`Products Imported:      ${this.stats.productsImported}`);
    console.log(`Products Failed:        ${this.stats.productsFailed}`);
    console.log(`Images Downloaded:      ${this.stats.imagesDownloaded}`);
    console.log(`Images Failed:          ${this.stats.imagesFailed}`);
    console.log(`CMS Pages Created:      ${this.stats.cmsPagesCreated}`);
    console.log(`CMS Pages Failed:       ${this.stats.cmsPagesFailed}`);
    console.log(`Success Rate:           ${report.summary.successRate}`);
    console.log(`Total Errors:           ${this.errors.length}`);
    console.log('─'.repeat(50));
    console.log(`\n📄 Full report saved to: ${reportPath}\n`);
  }
  
  // ==================== MAIN EXECUTION ====================
  
  async run() {
    const startTime = Date.now();
    
    try {
      await this.init();
      await this.createAttributes();
      await this.createCategories();
      await this.scrapeProducts();
      await this.downloadImages();
      await this.importProducts();
      await this.createCmsPages(); // Add blog posts for NewsGrid
      await this.generateReport();
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`\n🎉 Migration completed successfully in ${duration}s!\n`);
      
    } catch (error) {
      console.error('\n💥 Migration failed:', error);
      console.error('Stack:', error.stack);
      process.exit(1);
    }
  }
}

// ==================== SCRIPT EXECUTION ====================

// Windows-compatible: Convert argv path to file URL for comparison
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const migrator = new KiasCompleteMigrator();
  migrator.run().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export default KiasCompleteMigrator;

