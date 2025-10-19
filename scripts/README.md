# 📦 Migration & Data Scripts

Scripts để migration data từ KIAS.VN và quản lý database.

---

## 📋 SCRIPTS

### 1. `clean-all-data.js` - Xóa sạch database

**Mục đích**: Xóa toàn bộ data để chuẩn bị cho migration mới

**Xóa gì**:
- ✅ Tất cả products (và images, inventory, descriptions)
- ✅ Tất cả categories (trừ Kids, Men, Women default)
- ✅ Tất cả custom attributes (material, size)
- ✅ Tất cả CMS pages (trừ About Us nếu có)
- ✅ Tất cả files trong `media/catalog/product/`
- ✅ Reset database sequences về mặc định

**Sử dụng**:
```bash
# CẢNH BÁO: Thao tác này KHÔNG THỂ HOÀN TÁC!
CONFIRM_DELETE=yes node scripts/clean-all-data.js
```

**Output mẫu**:
```
🗑️  Deleting products...
   - Deleted 150 product images
   - Deleted 150 inventory records
   - Deleted 150 product descriptions
   - Deleted 300 attribute values
   - Deleted 150 products
✅ Total products deleted: 150

🗑️  Deleting categories...
   - Deleted 6 category descriptions
   - Deleted 6 categories
✅ Total categories deleted: 6

...

✅ Database is now clean and ready for fresh migration!
```

---

### 2. `kias-migration-complete.js` - Migration đầy đủ từ KIAS.VN

**Mục đích**: Scrape và import toàn bộ data từ KIAS.VN

**Tính năng**:
- ✅ Tạo categories (Set Bộ, Váy & Đầm, Quần, Áo, etc.)
- ✅ Tạo custom attributes (Material, Size)
- ✅ Scrape products từ KIAS.VN (tên, giá, ảnh, mô tả)
- ✅ Download product images về `media/catalog/product/`
- ✅ Import products vào EverShop qua API
- ✅ Tạo CMS pages (blog posts cho NewsGrid)
- ✅ Xử lý URL key conflicts tự động
- ✅ Generate migration report

**Sử dụng**:
```bash
node scripts/kias-migration-complete.js
```

**Yêu cầu**:
- EverShop running trên `localhost:3000`
- Admin account: `admin@admin.com` / `123456a@`
- Internet connection (scraping KIAS.VN)

**Cấu hình**:
```javascript
const CONFIG = {
  KIAS_CATEGORIES: [
    { name: 'Set Bộ', slug: 'set-bo', url: 'https://kias.vn/...' },
    { name: 'Váy & Đầm', slug: 'vay-dam', url: '...' },
    // ...
  ],
  MAX_PRODUCTS_PER_CATEGORY: 20,
  DELAY_BETWEEN_REQUESTS: 2000, // 2 seconds
  MAX_RETRIES: 3
};
```

**Output mẫu**:
```
🚀 Starting KIAS.VN Complete Migration to EverShop

🏗️  Creating custom attributes...
✅ Created attribute: Chất liệu (ID: 5)
✅ Created attribute: Kích cỡ (ID: 6)

📁 Creating categories...
✅ Created category: Set Bộ (ID: 4)
✅ Created category: Váy & Đầm (ID: 5)
...

🔍 Scraping products from KIAS.VN...
📂 Category: Set Bộ
   Found 20 products
   ✅ Set Áo Tay Dài + Quần Short... (3 images, 2 sizes)
   ...

🖼️  Downloading product images...
   ✅ Set Áo Tay Dài... (3 images)
   ...

📦 Importing products to EverShop...
   ✅ Set Áo Tay Dài... (ID: 101)
   ...

📰 Creating CMS pages for NewsGrid...
   ✅ Xu hướng thời trang Xuân Hè 2025
   ✅ Bí quyết phối đồ công sở thanh lịch
   ...

Migration Summary:
──────────────────────────────────────────────────
Categories Created:     6
Attributes Created:     2
Products Scraped:       80
Products Imported:      76
Products Failed:        4
Images Downloaded:      228
Images Failed:          12
CMS Pages Created:      6
CMS Pages Failed:       0
Success Rate:           95.00%
Total Errors:           16
──────────────────────────────────────────────────

🎉 Migration completed successfully in 458.32s!
```

**Report file**: `data/kias-migration/migration-report-complete.json`

---

## 🔄 WORKFLOW KHUYẾN NGHỊ

### Fresh Migration (Lần đầu hoặc reset)

```bash
# Bước 1: Xóa sạch data cũ
CONFIRM_DELETE=yes node scripts/clean-all-data.js

# Bước 2: Chạy migration đầy đủ
node scripts/kias-migration-complete.js

# Bước 3: Verify kết quả
npm run dev
# Mở http://localhost:3000 và kiểm tra homepage
```

### Update Migration (Có sẵn data, chỉ update)

```bash
# Nếu chỉ muốn thêm products mới, KHÔNG clean
# Chỉnh CONFIG.MAX_PRODUCTS_PER_CATEGORY hoặc thêm categories mới

node scripts/kias-migration-complete.js
```

---

## ⚙️ CẤU HÌNH

### Database Connection
File: `scripts/clean-all-data.js` và `kias-migration-complete.js`

```javascript
const CONFIG = {
  DB: {
    host: 'localhost',
    port: 5433,
    database: 'hapas_ecommerce',
    user: 'hapas',
    password: 'hapasdev123'
  }
};
```

### KIAS Categories
File: `scripts/kias-migration-complete.js`

```javascript
KIAS_CATEGORIES: [
  { name: 'Set Bộ', slug: 'set-bo', url: 'https://kias.vn/danh-muc-san-pham/set-bo-sets/' },
  { name: 'Váy & Đầm', slug: 'vay-dam', url: 'https://kias.vn/danh-muc-san-pham/vay-dam/' },
  { name: 'Quần', slug: 'quan', url: 'https://kias.vn/danh-muc-san-pham/quan-pants/' },
  { name: 'Áo', slug: 'ao', url: 'https://kias.vn/danh-muc-san-pham/ao-tops/' }
]
```

### Migration Limits
```javascript
MAX_PRODUCTS_PER_CATEGORY: 20,  // Số products tối đa mỗi category
DELAY_BETWEEN_REQUESTS: 2000,   // Delay giữa requests (ms)
MAX_RETRIES: 3                   // Số lần retry khi fail
```

---

## 🛡️ AN TOÀN

### clean-all-data.js
- ✅ Yêu cầu `CONFIRM_DELETE=yes` environment variable
- ✅ Không xóa nhầm nếu không confirm
- ✅ Giữ lại default categories (Kids, Men, Women)
- ✅ Giữ lại About Us page nếu có

### kias-migration-complete.js
- ✅ Admin authentication qua session cookie
- ✅ Retry logic cho URL key conflicts
- ✅ Error handling và logging đầy đủ
- ✅ Không crash khi 1 product fail
- ✅ Generate report chi tiết

---

## 📊 MIGRATION REPORT

Sau khi chạy migration, report được lưu tại:
```
data/kias-migration/migration-report-complete.json
```

**Nội dung**:
```json
{
  "timestamp": "2025-10-08T10:30:45.123Z",
  "stats": {
    "categoriesCreated": 6,
    "attributesCreated": 2,
    "productsScraped": 80,
    "productsImported": 76,
    "productsFailed": 4,
    "imagesDownloaded": 228,
    "imagesFailed": 12,
    "cmsPagesCreated": 6,
    "cmsPagesFailed": 0
  },
  "summary": {
    "successRate": "95.00%",
    "totalErrors": 16
  },
  "categories": [...],
  "attributes": [...],
  "errors": [...]
}
```

---

## 🔧 TROUBLESHOOTING

### Error: "Admin login failed"
**Fix**: Kiểm tra admin credentials trong CONFIG

### Error: "Category already exists"
**Fix**: Chạy `clean-all-data.js` trước hoặc update CONFIG để skip

### Error: "URL key conflict"
**Fix**: Script tự động retry với suffix `-1`, `-2`, etc.

### Error: "Failed to download image"
**Fix**: Kiểm tra internet connection, hoặc KIAS.VN có block IP

### Images không hiển thị trên homepage
**Fix**: 
1. Kiểm tra files tồn tại: `ls -la media/catalog/product/`
2. Test image proxy: `curl "http://localhost:3000/images?src=media/catalog/product/ao/image.jpg&w=600&q=80"`
3. Components đã dùng `Image` component (đã fix ✅)

---

## 📝 NOTES

- Migration script chạy **tuần tự** (không parallel) để tránh rate limiting
- Default delay 2s giữa mỗi request
- Product images được download song song nhưng có error handling
- CMS pages dùng API `/api/pages` (chuẩn EverShop)
- All scripts support ESM (import/export)

---

**Updated**: 2025-10-08  
**Author**: HAPAS Development Team






