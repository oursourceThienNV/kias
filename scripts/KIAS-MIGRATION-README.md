# KIAS.VN Complete Migration Script

Script migration hoàn chỉnh để import dữ liệu từ KIAS.vn vào EverShop, bao gồm đầy đủ categories, products, images, attributes và variants.

## Tổng Quan

Script này thực hiện:

1. **Tạo Custom Attributes**: `material` (text), `size` (select với options S/M/L/XL)
2. **Tạo Categories**: 4 danh mục chính (Set Bộ, Váy & Đầm, Quần, Áo) với đúng format EverShop
3. **Scrape Product Details**: Lấy đầy đủ thông tin từ từng trang sản phẩm trên KIAS.vn
4. **Download Images**: Tải ảnh về `media/catalog/product/{category}/` và lưu path đúng format
5. **Import Products**: Tạo products với category_id, images, attributes, description format EditorJS
6. **Conflict Resolution**: Xử lý trùng `url_key` với retry logic (append suffix)
7. **Comprehensive Reporting**: Log chi tiết và báo cáo JSON

## Yêu Cầu

### Hệ Thống
- Node.js ≥ 16.x
- EverShop instance chạy tại `http://localhost:3000`
- Quyền write vào thư mục `media/`
- Kết nối internet để scrape KIAS.vn

### Admin Credentials
Mặc định trong script:
- Email: `admin@admin.com`
- Password: `123456a@`

> ⚠️ **Lưu ý**: Nếu credentials khác, cập nhật trong `CONFIG.ADMIN_CREDENTIALS`

### Dependencies
```bash
npm install axios cheerio
```

## Cấu Hình

### Tùy Chỉnh Trong Script

```javascript
const CONFIG = {
  KIAS_BASE_URL: 'https://kias.vn',
  EVERSHOP_API_BASE: 'http://localhost:3000',
  
  // Giới hạn số sản phẩm mỗi danh mục (để test)
  MAX_PRODUCTS_PER_CATEGORY: 20,
  
  // Delay giữa các requests (ms)
  DELAY_BETWEEN_REQUESTS: 2000,
  
  // Số lần retry khi có lỗi
  MAX_RETRIES: 3,
  
  // Admin credentials
  ADMIN_CREDENTIALS: {
    email: 'admin@admin.com',
    password: '123456a@'
  }
};
```

### Categories

Script sẽ tạo 4 categories:

| Tên | Slug | URL Category KIAS |
|-----|------|------------------|
| Set Bộ | `set-bo` | https://kias.vn/danh-muc-san-pham/set-bo-sets/ |
| Váy & Đầm | `vay-dam` | https://kias.vn/danh-muc-san-pham/vay-dam/ |
| Quần | `quan` | https://kias.vn/danh-muc-san-pham/quan-pants/ |
| Áo | `ao` | https://kias.vn/danh-muc-san-pham/ao-tops/ |

## Cách Sử Dụng

### 1. Kiểm Tra EverShop Running

```bash
# Ensure EverShop is running
npm run dev
# hoặc
npm run start
```

Mở browser: http://localhost:3000

### 2. Chạy Migration Script

```bash
cd /Volumes/DoanBHSST9/Outsource/hapas_ecommerce
node scripts/kias-migration-complete.js
```

### 3. Theo Dõi Progress

Script sẽ hiển thị real-time progress:

```
🚀 Starting KIAS.VN Complete Migration to EverShop

Configuration:
  KIAS Base URL: https://kias.vn
  EverShop API: http://localhost:3000
  ...

🔐 Logging in as admin...
✅ Admin login successful

🏗️  Creating custom attributes...
✅ Created attribute: Chất liệu (ID: 3)
✅ Created attribute: Kích cỡ (ID: 4)

📁 Creating categories...
✅ Created category: Set Bộ (ID: 5)
✅ Created category: Váy & Đầm (ID: 6)
...

🔍 Scraping products from KIAS.VN...
📂 Category: Set Bộ
   Found 16 products
   ✅ [KIAS x HannahOlala] Modern Authority... (7 images, 4 sizes)
...

🖼️  Downloading product images...
   ✅ [KIAS x HannahOlala] Modern Authority... (7 images)
...

📦 Importing products to EverShop...
   ✅ [KIAS x HannahOlala] Modern Authority... (ID: 123)
...

📊 Generating migration report...

Migration Summary:
──────────────────────────────────────────────────
Categories Created:     4
Attributes Created:     2
Products Scraped:       48
Products Imported:      45
Products Failed:        3
Images Downloaded:      287
Success Rate:           93.75%
──────────────────────────────────────────────────

🎉 Migration completed successfully in 245.67s!
```

## Output

### 1. Media Files
```
media/
└── catalog/
    └── product/
        ├── set-bo/
        │   ├── CTS03609.jpg
        │   ├── CTS03563.jpg
        │   └── ...
        ├── vay-dam/
        │   └── ...
        ├── quan/
        │   └── ...
        └── ao/
            └── ...
```

### 2. Migration Report
```
data/kias-migration/migration-report-complete.json
```

**Report Structure:**
```json
{
  "timestamp": "2025-01-08T10:30:00.000Z",
  "stats": {
    "categoriesCreated": 4,
    "attributesCreated": 2,
    "productsScraped": 48,
    "productsImported": 45,
    "productsFailed": 3,
    "imagesDownloaded": 287,
    "imagesFailed": 5
  },
  "summary": {
    "totalProductsScraped": 48,
    "totalProductsImported": 45,
    "successRate": "93.75%",
    "totalErrors": 8
  },
  "categories": [...],
  "attributes": [...],
  "errors": [
    {
      "type": "product_import",
      "product": "Product Name",
      "error": "..."
    }
  ]
}
```

## Kiến Trúc & Logic

### 1. Slugify Vietnamese

```javascript
function normalizeVietnamese(str) {
  return str
    .normalize('NFD')                    // Decompose
    .replace(/[\u0300-\u036f]/g, '')    // Remove diacritics
    .replace(/đ/g, 'd')                  // đ → d
    .replace(/Đ/g, 'D');                 // Đ → D
}
```

**Example:**
- `"Váy & Đầm"` → `"vay-dam"`
- `"[KIAS x HannahOlala] 𝐌𝐨𝐝𝐞𝐫𝐧 𝐀𝐮𝐭𝐡𝐨𝐫𝐢𝐭𝐲"` → `"kias-x-hannaholala-modern-authority"`

### 2. URL Key Conflict Resolution

```javascript
// First attempt
url_key: "product-name"

// 409 Conflict → Retry
url_key: "product-name-1"

// 409 Conflict → Retry
url_key: "product-name-2"

// Success → Stop
```

### 3. Description Format (EditorJS)

```javascript
formatDescription(htmlContent) {
  return [
    {
      id: `row-${Date.now()}`,
      size: 12,
      columns: [
        {
          id: `col-${Date.now()}`,
          size: 12,
          data: {
            type: 'html',
            content: htmlContent  // Full HTML from KIAS
          }
        }
      ]
    }
  ];
}
```

### 4. Product Payload Structure

```javascript
{
  name: "Product Name",
  url_key: "product-name",
  sku: "KIAS-PRODUCT-NAME-ABC123",
  price: 2650000,                    // VND (không chia 1000)
  status: 1,
  visibility: 1,
  manage_stock: true,
  stock_availability: true,
  qty: 100,
  weight: 0.5,
  group_id: 1,
  category_id: 5,                    // From categoryMap
  description: [...],                // EditorJS format
  short_description: "...",
  meta_title: "...",
  meta_description: "...",
  images: [                          // Local paths
    "catalog/product/set-bo/image1.jpg",
    "catalog/product/set-bo/image2.jpg"
  ],
  attributes: [
    {
      attribute_code: "material",
      value: "Tuysi kẻ"
    }
  ]
}
```

## Troubleshooting

### 1. Admin Login Failed

**Error:** `Admin login failed: No session cookie (asid) received`

**Solution:**
- Kiểm tra EverShop có chạy không
- Verify admin credentials trong database
- Check `config/default.json` cho session config

### 2. Category Already Exists

**Warning:** `Category "Set Bộ" may already exist`

**Solution:** Script sẽ skip category này. Nếu cần re-create:
```bash
# Delete categories trong admin panel hoặc
psql evershop_db -c "DELETE FROM category WHERE name IN ('Set Bộ', 'Váy & Đầm', 'Quần', 'Áo');"
```

### 3. Image Download Failed

**Error:** `Failed to download image: ...`

**Causes:**
- Network timeout
- Invalid image URL
- Permission denied trên `media/` directory

**Solution:**
```bash
# Check media directory permissions
chmod -R 755 media/

# Re-run script (đã download images sẽ được skip)
node scripts/kias-migration-complete.js
```

### 4. Product Import Failed (409 Conflict)

**Error:** `url_key already exists`

**Solution:** Script tự động retry với suffix. Nếu vẫn fail sau 3 lần:
- Check database: `SELECT url_key FROM product_description WHERE url_key LIKE 'product-name%';`
- Manual resolve hoặc delete conflict products

### 5. Attributes Not Found

**Error:** `Attribute "material" not found`

**Solution:**
```bash
# Re-run createAttributes section
# hoặc create manual trong admin panel:
# Admin > Catalog > Attributes > Create New
```

## Best Practices

### 1. Test Trước

Set `MAX_PRODUCTS_PER_CATEGORY: 2` để test với ít products:

```javascript
const CONFIG = {
  ...
  MAX_PRODUCTS_PER_CATEGORY: 2,  // Test mode
  ...
};
```

### 2. Backup Database

```bash
# Backup trước khi migrate
pg_dump evershop_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 3. Incremental Migration

Nếu có nhiều products, chia nhỏ:

```javascript
// Migrate từng category riêng
const CONFIG = {
  CATEGORIES: [
    { name: 'Set Bộ', slug: 'set-bo', url: '...' }
    // Comment out others
  ]
};
```

### 4. Monitor Resources

```bash
# Check disk space cho images
df -h media/

# Check PostgreSQL connections
psql evershop_db -c "SELECT count(*) FROM pg_stat_activity;"
```

## Advanced Usage

### Custom Image Transformations

Thêm image processing (resize, optimize):

```javascript
import sharp from 'sharp';

async function downloadImage(url, localPath) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const buffer = Buffer.from(response.data);
  
  // Resize và optimize
  await sharp(buffer)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toFile(localPath);
}
```

### Product Variants (Size Options)

Để tạo product variants theo size:

```javascript
// TODO: Implement variant creation
// Cần tạo variant_group và link products
// Reference: packages/evershop/src/modules/catalog/services/product/createProduct.ts
```

### Batch Processing

Để chạy migration batch (parallel):

```javascript
import pLimit from 'p-limit';

const limit = pLimit(5); // 5 concurrent requests

const tasks = products.map(product => 
  limit(() => this.importProduct(product))
);

await Promise.all(tasks);
```

## Maintenance

### Clean Up Failed Imports

```sql
-- Delete products without images
DELETE FROM product WHERE product_id NOT IN (
  SELECT DISTINCT product_image_product_id FROM product_image
);

-- Delete orphan categories
DELETE FROM category WHERE category_id NOT IN (
  SELECT DISTINCT category_id FROM product WHERE category_id IS NOT NULL
);
```

### Re-scrape Specific Products

```javascript
// Thêm vào script
const RESCRAPE_URLS = [
  'https://kias.vn/san-pham/product-1/',
  'https://kias.vn/san-pham/product-2/'
];

for (const url of RESCRAPE_URLS) {
  await this.scrapeProductDetail(url, category);
}
```

## FAQ

**Q: Script có thể chạy nhiều lần không?**  
A: Có, nhưng sẽ tạo duplicate categories/attributes. Nên clean up trước hoặc add check logic.

**Q: Làm sao để migrate incremental (chỉ products mới)?**  
A: Lưu `migrated_products.json` với list URL đã migrate, check before scraping.

**Q: Script có handle rate limiting không?**  
A: Có, `DELAY_BETWEEN_REQUESTS: 2000ms` và `MAX_RETRIES: 3`.

**Q: Images có tự động resize không?**  
A: Không, giữ nguyên size gốc. Thêm `sharp` package nếu cần resize.

**Q: Có thể migrate sang staging environment không?**  
A: Có, đổi `EVERSHOP_API_BASE` trong CONFIG.

---

## Liên Hệ & Support

Nếu gặp vấn đề:
1. Check `data/kias-migration/migration-report-complete.json`
2. Check EverShop logs: `dev-latest.log`
3. Check database: `psql evershop_db`

**Author**: KIAS Migration Script v2.0  
**Last Updated**: 2025-01-08

