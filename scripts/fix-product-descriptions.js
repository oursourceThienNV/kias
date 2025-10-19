#!/usr/bin/env node

/**
 * Fix Product Descriptions - Decode HTML Entities
 * 
 * This script decodes HTML entities in all product descriptions
 * that are currently escaped (e.g., &lt;p&gt; → <p>)
 * 
 * Usage:
 *   node scripts/fix-product-descriptions.js
 */

import pg from 'pg';

const CONFIG = {
  DB: {
    host: 'localhost',
    port: 5433,
    database: 'hapas_ecommerce',
    user: 'hapas',
    password: 'hapasdev123'
  }
};

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
 * Recursively decode HTML entities in description JSON structure
 */
function decodeDescriptionJson(descriptionStr) {
  try {
    const description = JSON.parse(descriptionStr);
    
    // Traverse and decode HTML in all 'html' fields
    if (Array.isArray(description)) {
      description.forEach(row => {
        if (row.columns && Array.isArray(row.columns)) {
          row.columns.forEach(column => {
            if (column.data && column.data.blocks && Array.isArray(column.data.blocks)) {
              column.data.blocks.forEach(block => {
                if (block.type === 'raw' && block.data && block.data.html) {
                  // Decode HTML entities
                  block.data.html = decodeHtmlEntities(block.data.html);
                }
              });
            }
          });
        }
      });
    }
    
    return JSON.stringify(description);
  } catch (error) {
    console.error('Error parsing description JSON:', error.message);
    return descriptionStr;
  }
}

async function fixDescriptions() {
  const client = new pg.Client(CONFIG.DB);
  
  try {
    console.log('🔧 Fixing product descriptions...\n');
    
    await client.connect();
    console.log('✅ Connected to database\n');
    
    // Get all products with descriptions
    const result = await client.query(`
      SELECT 
        product_description_product_id,
        name,
        description
      FROM product_description
      WHERE description IS NOT NULL
        AND description != ''
    `);
    
    console.log(`Found ${result.rows.length} products with descriptions\n`);
    
    let updated = 0;
    let skipped = 0;
    let failed = 0;
    
    for (const row of result.rows) {
      try {
        // Check if description contains escaped HTML
        if (!row.description.includes('&lt;') && !row.description.includes('&gt;')) {
          skipped++;
          continue;
        }
        
        // Decode the description
        const decodedDescription = decodeDescriptionJson(row.description);
        
        // Update in database
        await client.query(
          `UPDATE product_description 
           SET description = $1 
           WHERE product_description_product_id = $2`,
          [decodedDescription, row.product_description_product_id]
        );
        
        updated++;
        console.log(`✅ Updated: ${row.name.substring(0, 60)}...`);
        
      } catch (error) {
        failed++;
        console.error(`❌ Failed: ${row.name.substring(0, 60)}...`);
        console.error(`   Error: ${error.message}`);
      }
    }
    
    await client.end();
    
    console.log('\n' + '═'.repeat(50));
    console.log('           📊 SUMMARY');
    console.log('═'.repeat(50));
    console.log(`Total Products:     ${result.rows.length}`);
    console.log(`Updated:            ${updated}`);
    console.log(`Skipped (OK):       ${skipped}`);
    console.log(`Failed:             ${failed}`);
    console.log('═'.repeat(50));
    console.log('\n✅ Done!\n');
    
  } catch (error) {
    console.error('\n💥 Error:', error);
    await client.end();
    process.exit(1);
  }
}

// Run
fixDescriptions().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

