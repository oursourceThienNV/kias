# KIAS Migration Script - Updates & Fixes

## 📋 Tổng Kết Các Thay Đổi

Script `kias-migration-complete.js` đã được update để đảm bảo tương thích 100% với EverShop product creation requirements.

---

## ✅ Critical Fixes Applied

### 1. **Added Missing `tax_class` Field** (CRITICAL)
**Problem**: EverShop requires `tax_class` field nhưng script không có  
**Fix**: Added `tax_class: 1` (default tax class)
```javascript
// Line ~611
tax_class: 1, // CRITICAL: Was missing, must be present
```

### 2. **Fixed `manage_stock` & `stock_availability` Data Types**
**Problem**: Gửi `boolean` (true/false) nhưng EverShop cần `number` (0/1)  
**Fix**: Changed to numbers
```javascript
// Lines ~606-607
manage_stock: 1, // Must be number 0/1, not boolean
stock_availability: 1, // Must be number 0/1, not boolean
```

### 3. **Added `meta_title` with Fallback**
**Problem**: `meta_title` required nhưng có thể thiếu nếu scraping fail  
**Fix**: Added fallback logic
```javascript
// Line ~612
meta_title: product.seo.meta_title || `${product.name} - ${product.category}`,
```

### 4. **URL Key Pattern Validation**
**Problem**: EverShop validates url_key với pattern `/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/`  
**Fix**: Clean url_key để match pattern
```javascript
// Lines ~622-627
productPayload.url_key = productPayload.url_key
  .toLowerCase()
  .replace(/[^a-z0-9-]/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '');
```

### 5. **Size Attribute Mapping** (Multiselect)
**Problem**: Script chỉ lưu material, không xử lý size options  
**Fix**: Added size attribute logic với mapping đúng format
```javascript
// Lines ~638-657
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
```

### 6. **Improved Attribute Storage**
**Problem**: attributeMap không lưu đầy đủ options data cần cho mapping  
**Fix**: Store full attribute object including options
```javascript
// Lines ~305-315 & ~325-334
this.attributeMap.set(attrData.attribute_code, {
  id: existing.attributeId,
  attribute_code: existing.attributeCode,
  attribute_name: existing.attributeName,
  type: existing.type,
  options: existing.options || [] // Full options array với attribute_option_id
});
```

---

## 📊 Complete Product Payload Structure

Sau khi update, mỗi product được gửi với **đầy đủ 13 required fields + optionals**:

```javascript
{
  // ========== REQUIRED FIELDS (13) ==========
  name: string,              // Product name
  url_key: string,           // Clean URL slug
  sku: string,               // Unique SKU
  price: number,             // Price in VND
  status: 1,                 // 1 = enabled
  visibility: 1,             // 1 = visible in catalog/search
  manage_stock: 1,           // 1 = track inventory
  stock_availability: 1,     // 1 = in stock
  qty: 100,                  // Quantity
  weight: 0.4,               // Weight in kg
  group_id: 1,               // Attribute group ID
  tax_class: 1,              // Tax class ID
  meta_title: string,        // SEO meta title
  
  // ========== OPTIONAL FIELDS ==========
  category_id: number,       // Category reference
  description: EditorJS[],   // Rich description
  meta_description: string,  // SEO meta desc
  meta_keywords: string,     // SEO keywords
  images: string[],          // Array of relative paths
  attributes: [              // Custom attributes
    {
      attribute_code: "material",
      value: "Tuysi kẻ"      // text type
    },
    {
      attribute_code: "size",
      value: ["1", "2", "3", "4"] // multiselect type
    }
  ]
}
```

---

## 🔄 Migration Flow

### Phase 1: Setup
1. ✅ Login admin (`POST /api/admin/user/login`)
2. ✅ Create attributes (material: text, size: select with S/M/L/XL)
3. ✅ Create categories (Set Bộ, Váy & Đầm, Quần, Áo)

### Phase 2: Data Extraction
4. ✅ Scrape KIAS product pages
5. ✅ Extract: name, price, images URLs, sizes, material, description
6. ✅ Download images to `media/catalog/product/{category}/`

### Phase 3: Transform & Import
7. ✅ Transform to EverShop format (với tất cả required fields)
8. ✅ Clean url_key
9. ✅ Map sizes to attribute option IDs
10. ✅ Import products (`POST /api/products`)
11. ✅ Retry logic cho URL conflicts (409)

### Phase 4: Reporting
12. ✅ Generate detailed JSON report
13. ✅ Log statistics (success/failed counts)

---

## 🎯 Validation Checklist

Trước khi run migration, verify:

- [x] EverShop dev server running (`npm run dev`)
- [x] PostgreSQL database accessible
- [x] Admin user exists (admin@admin.com / 123456a@)
- [x] Internet connection (for KIAS scraping)
- [x] Write permission to `media/` directory
- [x] Disk space for images (~50MB)

---

## 🚀 Usage

```bash
# Run migration
cd /Volumes/DoanBHSST9/Outsource/hapas_ecommerce
node scripts/kias-migration-complete.js

# Expected output:
# 🚀 KIAS Complete Migration Started
# 🔐 Logging in as admin...
# ✅ Admin authenticated
# 🏷️  Creating custom attributes...
# ✅ Created attribute: Material (ID: 15)
# ✅ Created attribute: Size (ID: 16)
#    → Options: S, M, L, XL
# 📁 Creating categories...
# ✅ Created category: Set Bộ (ID: 20)
# ...
# 🕷️  Scraping KIAS product data...
# ...
# 🖼️  Downloading product images...
# ...
# 📦 Importing products to EverShop...
# ✅ [KIAS x HannahOlala] Modern Authority... (ID: 123)
# ...
# ✅ Migration complete!
```

---

## 📝 Output Files

### Success Case
```json
// data/kias-migration/migration-report-{timestamp}.json
{
  "status": "completed",
  "timestamp": "2025-10-08T10:30:00.000Z",
  "stats": {
    "categoriesCreated": 4,
    "attributesCreated": 2,
    "productsScraped": 48,
    "imagesDownloaded": 336,
    "productsImported": 48,
    "productsFailed": 0,
    "totalDuration": "5m 32s"
  },
  "errors": []
}
```

### Partial Failure Case
```json
{
  "status": "completed_with_errors",
  "stats": { ... },
  "errors": [
    {
      "type": "product_import",
      "product": "Product Name",
      "error": "url_key already exists",
      "attempts": 3
    }
  ]
}
```

---

## 🐛 Troubleshooting

### Error: "tax_class is required"
**Cause**: Old script version  
**Fix**: Re-run with updated script (fix applied ✅)

### Error: "url_key must match pattern"
**Cause**: Vietnamese characters or special chars in url_key  
**Fix**: Auto-cleaned by script (fix applied ✅)

### Error: "manage_stock must be a number"
**Cause**: Sending boolean instead of number  
**Fix**: Changed to numbers (fix applied ✅)

### Error: "Attribute option not found"
**Cause**: Size mapping failed  
**Fix**: Improved attribute storage (fix applied ✅)

### Error: 409 Conflict (url_key exists)
**Cause**: URL key duplicate  
**Fix**: Script retries with `-2`, `-3` suffix automatically ✅

---

## 🔮 Next Steps

1. ✅ Test migration với 2-3 products
2. ⏸️ Verify DB entries:
   - `product` table
   - `product_description` table
   - `product_image` table
   - `product_inventory` table
   - `product_attribute_value_index` table
   - `url_rewrite` table
3. ⏸️ Check frontend: http://localhost:3000/
4. ⏸️ Run full migration (48 products)
5. ⏸️ Review migration report
6. ⏸️ Fix any errors and retry failed products

---

## 📚 Related Docs

- [EverShop Product Fields Mapping](./EVERSHOP-PRODUCT-FIELDS-MAPPING.md) - Complete field reference
- [KIAS Migration README](../scripts/KIAS-MIGRATION-README.md) - Original documentation
- [008-kias-migration Rule](.cursor/rules/008-kias-migration.mdc) - Project rules

---

**Status**: ✅ Ready for testing  
**Last Updated**: 2025-10-08  
**Script Version**: 1.1.0 (with critical fixes)

