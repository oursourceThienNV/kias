# 🔄 Hướng dẫn Migration Dữ liệu KIAS.VN

**Tài liệu này hướng dẫn chi tiết cách migrate dữ liệu từ KIAS.VN vào dự án Hapas E-commerce mới.**

---

## 📋 Mục lục
1. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
2. [Chuẩn bị môi trường](#chuẩn-bị-môi-trường)
3. [Cài đặt EverShop mới](#cài-đặt-evershop-mới)
4. [Chạy Migration Script](#chạy-migration-script)
5. [Kiểm tra kết quả](#kiểm-tra-kết-quả)
6. [Xử lý lỗi thường gặp](#xử-lý-lỗi-thường-gặp)

---

## 🔧 Yêu cầu hệ thống

### Phần mềm cần thiết:
- **Node.js**: 18.x hoặc cao hơn
- **PostgreSQL**: 16.x hoặc cao hơn
- **Docker Desktop**: (khuyến nghị cho database)
- **Git**: Để clone repository

### Kiểm tra version:
```bash
node --version    # Phải >= 18.x
npm --version     # Phải >= 8.x
psql --version    # Phải >= 16.x
docker --version  # Phải có nếu dùng Docker
```

---

## 🚀 Chuẩn bị môi trường

### Bước 1: Clone Repository

```bash
# Clone project từ GitHub
git clone https://github.com/xingcorp/hapas_ecommerce.git
cd hapas_ecommerce

# Checkout branch chính
git checkout prod  # hoặc main
```

### Bước 2: Cài đặt Dependencies

```bash
# Cài đặt tất cả packages
npm install

# Compile TypeScript code
npm run compile
npm run compile:db
```

### Bước 3: Start Database với Docker (Khuyến nghị)

```bash
# Start PostgreSQL container
docker-compose -f docker-compose.dev.yml up -d

# Verify database đã chạy
docker-compose -f docker-compose.dev.yml logs database

# Kiểm tra kết nối
docker-compose -f docker-compose.dev.yml ps
```

**Output mong đợi:**
```
NAME                    STATUS    PORTS
hapas-postgres-dev      Up        0.0.0.0:5433->5432/tcp
```

### Bước 4 (Tùy chọn): Setup Database Local (Nếu không dùng Docker)

```bash
# Tạo database
createdb -U postgres evershop

# Import schema (nếu có backup)
psql -U postgres -d evershop -f backup.sql
```

---

## 🏗️ Cài đặt EverShop mới

### Phương pháp 1: Sử dụng Setup Wizard (Khuyến nghị)

```bash
# Chạy installation wizard
npm run setup

# Hoặc:
npm run user:create
```

**Wizard sẽ hỏi các thông tin:**

```
🎯 EverShop Installation Wizard
================================

📊 Database Configuration:
  Host: localhost          # Enter
  Port: 5433              # Enter (5433 nếu dùng Docker)
  Database: evershop      # Enter
  Username: postgres      # Enter
  Password: ******        # Nhập password

👤 Admin Account:
  Full Name: Admin HAPAS  # Nhập tên
  Email: admin@hapas.com  # Nhập email
  Password: ******        # Nhập password mạnh

✅ Installation completed!
```

### Phương pháp 2: Manual Setup

```bash
# 1. Set environment variables
export DB_HOST=localhost
export DB_PORT=5433
export DB_NAME=evershop
export DB_USER=postgres
export DB_PASSWORD=postgres

# 2. Run EverShop build
npm run build

# 3. Start server để EverShop tự động chạy migrations
npm start

# 4. Tạo admin user qua API hoặc database
```

### Xác nhận cài đặt thành công:

```bash
# Start dev server
npm run dev

# Truy cập:
# - Frontend: http://localhost:3000
# - Admin: http://localhost:3000/admin
```

**Đăng nhập admin panel với thông tin đã tạo ở bước trên.**

---

## 🔄 Chạy Migration Script

### Bước 1: Đảm bảo EverShop đang chạy

```bash
# Terminal 1: Start EverShop dev server
npm run dev

# Chờ đến khi thấy:
# ✓ Server is running on http://localhost:3000
# ✓ Admin panel: http://localhost:3000/admin
```

### Bước 2: Cấu hình Migration Script

Kiểm tra file `scripts/migrate-kias-data.js`:

```javascript
const CONFIG = {
  KIAS_BASE_URL: 'https://kias.vn',
  OUTPUT_DIR: './data/kias-migration',
  EVERSHOP_API_BASE: 'http://localhost:3000/api',  // ← Port phải đúng
  CATEGORIES: [
    { name: 'Set Bộ', slug: 'set-bo', url: '/', expectedCount: 14 },
    { name: 'Váy & Đầm', slug: 'vay-dam', url: '/', expectedCount: 22 },
    { name: 'Quần', slug: 'quan', url: '/', expectedCount: 5 },
    { name: 'Áo', slug: 'ao', url: '/', expectedCount: 12 }
  ],
  DELAY_BETWEEN_REQUESTS: 2000, // 2 giây giữa mỗi request
};
```

**Lưu ý:** Nếu port khác 3000, cần update `EVERSHOP_API_BASE`.

### Bước 3: Set Admin Credentials

Script cần admin credentials để import products. Tạo file `.env` hoặc export:

```bash
# Cách 1: Export environment variables
export EVERSHOP_ADMIN_EMAIL=admin@hapas.com
export EVERSHOP_ADMIN_PASSWORD=your_password_here

# Cách 2: Tạo file .env (khuyến nghị)
echo "EVERSHOP_ADMIN_EMAIL=admin@hapas.com" >> .env
echo "EVERSHOP_ADMIN_PASSWORD=your_password_here" >> .env
```

**QUAN TRỌNG:** Không commit file `.env` lên git!

### Bước 4: Chạy Migration

```bash
# Terminal 2: Chạy migration script
node scripts/migrate-kias-data.js
```

### Quá trình Migration

Script sẽ thực hiện các bước sau:

```
🔄 KIAS Data Migration Started
================================

📂 Step 1: Initialize directories...
   ✓ Created: data/kias-migration/
   ✓ Created: data/kias-migration/images/

🔍 Step 2: Scraping KIAS.VN...
   → Fetching products from 'Set Bộ'...
   → Fetching products from 'Váy & Đầm'...
   → Fetching products from 'Quần'...
   → Fetching products from 'Áo'...
   ✓ Extracted 53 products

💾 Step 3: Saving extracted data...
   ✓ Saved: data/kias-migration/extracted-products.json

🔐 Step 4: Login to EverShop admin...
   ✓ Logged in successfully

📁 Step 5: Creating categories...
   ✓ Created: Set Bộ (ID: 1)
   ✓ Created: Váy & Đầm (ID: 2)
   ✓ Created: Quần (ID: 3)
   ✓ Created: Áo (ID: 4)

🛍️ Step 6: Importing products...
   📦 [1/53] Importing: Sét Bộ Nữ KIAS...
   ✅ Imported: Sét Bộ Nữ KIAS (ID: 1)
   
   📦 [2/53] Importing: Váy Xòe Công Chúa...
   ✅ Imported: Váy Xòe Công Chúa (ID: 2)
   
   ... (tiếp tục với các products khác)

🖼️ Step 7: Downloading images...
   → Downloading images for 53 products...
   ✓ Downloaded: 142/142 images

📊 Step 8: Generating report...
   ✓ Report saved: data/kias-migration/migration-report.json

🎉 KIAS migration completed successfully!

📈 Summary:
   • Categories created: 4
   • Products imported: 53
   • Images downloaded: 142
   • Failed imports: 0
   • Duration: 5m 23s
```

### Bước 5: Review Migration Report

```bash
# Xem chi tiết report
cat data/kias-migration/migration-report.json

# Hoặc mở bằng editor
code data/kias-migration/migration-report.json
```

**Report structure:**
```json
{
  "timestamp": "2025-10-06T12:34:56.789Z",
  "summary": {
    "totalProducts": 53,
    "successfulImports": 53,
    "failedImports": 0,
    "categoriesCreated": 4,
    "imagesDownloaded": 142,
    "duration": "5m 23s"
  },
  "products": [
    {
      "kiasId": "...",
      "evershopId": 1,
      "name": "Sét Bộ Nữ KIAS...",
      "sku": "KIAS-SET-BO-001",
      "status": "success"
    }
  ],
  "errors": []
}
```

---

## ✅ Kiểm tra kết quả

### 1. Kiểm tra Categories

```bash
# Truy cập admin panel
# http://localhost:3000/admin/categories

# Hoặc query database
psql -U postgres -d evershop -c "SELECT * FROM category;"
```

**Mong đợi thấy 4 categories:**
- Set Bộ
- Váy & Đầm
- Quần
- Áo

### 2. Kiểm tra Products

```bash
# Admin panel
# http://localhost:3000/admin/products

# Database query
psql -U postgres -d evershop -c "SELECT product_id, name, sku, price FROM product LIMIT 10;"
```

**Mong đợi thấy ~53 products với:**
- SKU format: `KIAS-{CATEGORY}-{NUM}`
- Price range: 580,000 - 2,780,000 VNĐ
- Status: Enabled
- Stock: In stock

### 3. Kiểm tra Images

```bash
# Kiểm tra thư mục images
ls -lh data/kias-migration/images/

# Verify images trong database
psql -U postgres -d evershop -c "SELECT COUNT(*) FROM product_image;"
```

**Mong đợi:**
- ~142 image files trong `data/kias-migration/images/`
- Database có tương ứng số records

### 4. Test Frontend

```bash
# Truy cập homepage
# http://localhost:3000

# Browse categories
# http://localhost:3000/category/set-bo
# http://localhost:3000/category/vay-dam
# http://localhost:3000/category/quan
# http://localhost:3000/category/ao
```

**Checklist:**
- [ ] Categories hiển thị trong navigation
- [ ] Products listing hiển thị đúng
- [ ] Product images load được
- [ ] Product detail page hoạt động
- [ ] Add to cart functionality works
- [ ] Prices hiển thị đúng format tiền tệ

---

## ❌ Xử lý lỗi thường gặp

### Lỗi 1: Database connection failed

**Error:**
```
Error: getaddrinfo ENOTFOUND localhost
```

**Giải pháp:**
```bash
# Kiểm tra Docker container
docker-compose -f docker-compose.dev.yml ps

# Nếu không chạy, start lại
docker-compose -f docker-compose.dev.yml up -d

# Test connection
psql -h 127.0.0.1 -p 5433 -U postgres -d evershop
```

### Lỗi 2: Admin login failed

**Error:**
```
❌ Admin login failed: Invalid credentials
```

**Giải pháp:**
```bash
# Reset admin password
node reset-admin-password.js

# Hoặc tạo admin user mới
npm run user:create
```

### Lỗi 3: Port 3000 already in use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Giải pháp:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Hoặc dùng port khác
PORT=3001 npm run dev
```

### Lỗi 4: Image download failed

**Error:**
```
❌ Failed to download image: net::ERR_CONNECTION_REFUSED
```

**Giải pháp:**
```bash
# Kiểm tra internet connection
ping kias.vn

# Retry migration với delay lớn hơn
# Edit scripts/migrate-kias-data.js:
# DELAY_BETWEEN_REQUESTS: 5000  (tăng lên 5s)

# Chạy lại migration
node scripts/migrate-kias-data.js
```

### Lỗi 5: Duplicate SKU

**Error:**
```
❌ Failed to import: Duplicate key value violates unique constraint "product_sku"
```

**Giải pháp:**
```bash
# Xóa products đã import trước đó
psql -U postgres -d evershop -c "DELETE FROM product WHERE sku LIKE 'KIAS-%';"

# Chạy lại migration
node scripts/migrate-kias-data.js
```

### Lỗi 6: KIAS website blocking

**Error:**
```
❌ Request failed with status code 429 (Too Many Requests)
```

**Giải pháp:**
```javascript
// Edit scripts/migrate-kias-data.js
const CONFIG = {
  DELAY_BETWEEN_REQUESTS: 5000,  // Tăng delay lên 5s
  MAX_RETRIES: 5,                // Tăng retry lên 5
  // ...
};

// Chạy lại vào thời điểm khác trong ngày
```

---

## 🔄 Re-run Migration (Chạy lại)

Nếu cần chạy lại migration từ đầu:

### 1. Clean Database

```bash
# Xóa tất cả data đã import
psql -U postgres -d evershop << EOF
DELETE FROM product_image WHERE product_image_product_id IN (SELECT product_id FROM product WHERE sku LIKE 'KIAS-%');
DELETE FROM product WHERE sku LIKE 'KIAS-%';
DELETE FROM category WHERE url_key IN ('set-bo', 'vay-dam', 'quan', 'ao');
EOF
```

### 2. Clean Migration Data

```bash
# Xóa files đã tạo
rm -rf data/kias-migration/
```

### 3. Re-run Migration

```bash
node scripts/migrate-kias-data.js
```

---

## 📝 Notes quan trọng

### 1. Về Images
- Images được download từ KIAS.VN và lưu local
- Path: `data/kias-migration/images/`
- Cần copy images vào `media/catalog/` để production sử dụng

### 2. Về Prices
- Prices từ KIAS.VN format: `1.580.000₫`
- Script tự động convert sang số: `1580000`
- Currency: VND (Vietnamese Dong)

### 3. Về Categories
- Categories được tạo tự động từ KIAS structure
- URL keys: `set-bo`, `vay-dam`, `quan`, `ao`
- Có thể customize sau khi import

### 4. Về Performance
- Migration ~53 products mất ~5-10 phút
- Delay giữa requests: 2s (có thể tăng nếu bị block)
- Network dependent (download images)

### 5. Về Data Quality
- Script có validation cho prices, SKUs
- Tự động handle missing data
- Tạo report chi tiết để review

---

## 🚀 Next Steps

Sau khi migration thành công:

1. **Review Products:**
   ```bash
   # Admin panel: Review và edit products nếu cần
   http://localhost:3000/admin/products
   ```

2. **Setup Payment Methods:**
   ```bash
   # Configure Stripe, PayPal, COD
   http://localhost:3000/admin/settings/payment
   ```

3. **Configure Shipping:**
   ```bash
   # Setup shipping methods và rates
   http://localhost:3000/admin/settings/shipping
   ```

4. **Customize Theme:**
   ```bash
   # Customize HAPAS theme
   themes/hapas/src/
   ```

5. **Test Order Flow:**
   ```bash
   # Test complete purchase flow
   http://localhost:3000
   ```

---

## 📞 Support

Nếu gặp vấn đề:

1. **Check Logs:**
   ```bash
   # Server logs
   npm run dev
   
   # Database logs
   docker-compose -f docker-compose.dev.yml logs database
   ```

2. **Review Migration Report:**
   ```bash
   cat data/kias-migration/migration-report.json
   ```

3. **Check Documentation:**
   - [EverShop Docs](https://evershop.io/docs)
   - `README.md` trong project
   - `DEPLOYMENT_GUIDE.md`

---

**📅 Document Version:** 1.0  
**📝 Last Updated:** 2025-10-06  
**👤 Author:** Hapas Development Team

