# HAPAS ECOMMERCE - KẾ HOẠCH TÁI CẤU TRÚC

**Ngày tạo:** 2025-10-08  
**Mục tiêu:** Đồng bộ với EverShop upstream mới nhất và duy trì khả năng cập nhật dễ dàng

---

## 🎯 TỔNG QUAN

### Vấn đề hiện tại:
- Project đã chỉnh sửa nhiều so với EverShop gốc
- Khó cập nhật khi EverShop có version mới
- Code core và custom code bị trộn lẫn

### Giải pháp:
- Tách biệt core EverShop và custom code
- Sử dụng Git upstream để theo dõi EverShop official
- Giữ lại CI/CD, Docker configs, và HAPAS customizations

---

## 📦 PHÂN LOẠI FILE

### ✅ GIỮ LẠI (HAPAS Custom)

#### 1. Hidden Directories
```
.cursor/
.github/
.history/
.husky/
```

#### 2. Docker & Infrastructure
```
docker-compose.yml
docker-compose.dev.yml
docker-compose.prod.yml
Dockerfile
Dockerfile.dev
Dockerfile.prod
```

#### 3. Deployment & CI/CD
```
.github/workflows/production-deploy.yml
scripts/deploy.sh
scripts/health-check.sh
scripts/init-db.sh
scripts/monitor-runner.sh
scripts/setup-github-runner.sh
DEPLOYMENT_GUIDE.md
DEPLOYMENT_STATUS.md
README_CI_CD.md
```

#### 4. Configuration
```
config/default.json          # ⚠️ Cần merge với upstream
```

#### 5. HAPAS Theme (100% custom)
```
themes/hapas/
  ├── components/
  ├── src/
  ├── public/
  ├── styles/
  ├── package.json
  ├── README.md
  └── theme.json
```

#### 6. Data & Migration
```
data/
  ├── kias-migration/
  ├── hapas-component-tests/
  ├── hapas-database-tests/
  └── test-results/
scripts/migrate-kias-data.js
```

#### 7. Analysis & Documentation
```
analysis/
WARP.md
CRITICAL-ISSUES-RESOLUTION-COMPLETE.md
FONT-RENDERING-INVESTIGATION-COMPLETE.md
HAPAS-NAVIGATION-IMPLEMENTATION-COMPLETE.md
HAPAS-THEME-INTEGRATION-TESTING.md
KIAS-COLOR-MAPPING.md
MIGRATION_GUIDE.md
NAVIGATION-CATEGORY-ANALYSIS-COMPLETE.md
PHASE-2A-MIGRATION-REPORT.md
hapas_shop_huong_dan_day_du.md
```

#### 8. Test Scripts
```
test-*.js
validate-migration-system.js
reset-admin-password.js
```

#### 9. SQL Scripts
```
fix_vietnamese_navigation.sql
update_navigation.sql
```

#### 10. Public Assets (Custom)
```
public/images/kias-placeholder.svg
```

### ❌ XÓA ĐI (Sẽ lấy từ upstream)

```
packages/evershop/
packages/postgres-query-builder/
packages/create-evershop-app/
extensions/                   # ⚠️ Kiểm tra trước nếu có custom extensions
translations/
node_modules/
package-lock.json
.evershop/                   # Build artifacts
changelog.md                 # Của upstream
CODE_OF_CONDUCT.md          # Của upstream
CONTRIBUTING.md             # Của upstream
LICENSE                     # Của upstream
README.md                   # Của upstream (có thể tạo custom README)
eslint.config.js            # Của upstream
jest.config.js              # Của upstream
tsconfig.json               # Của upstream (có thể cần merge)
package.json                # ⚠️ Lấy từ upstream, merge custom scripts
```

---

## 🚀 BƯỚC TRIỂN KHAI

### **BƯỚC 1: BACKUP TOÀN BỘ PROJECT**

```bash
# Tạo backup tại thư mục cha
cd /Volumes/DoanBHSST9/Outsource
tar -czf hapas_ecommerce_backup_$(date +%Y%m%d_%H%M%S).tar.gz hapas_ecommerce/
echo "✅ Backup saved: hapas_ecommerce_backup_YYYYMMDD_HHMMSS.tar.gz"
```

### **BƯỚC 2: TẠO NHÁNH MỚI**

```bash
cd /Volumes/DoanBHSST9/Outsource/hapas_ecommerce
git checkout -b refactor/upstream-sync
git add .
git commit -m "chore: snapshot before upstream refactor"
git push -u origin refactor/upstream-sync
```

### **BƯỚC 3: TẠO THƯ MỤC TẠM LƯU CUSTOM CODE**

```bash
mkdir -p /tmp/hapas_custom_backup

# Copy các file/folder cần giữ lại
cp -r .cursor /tmp/hapas_custom_backup/
cp -r .github /tmp/hapas_custom_backup/
cp -r .history /tmp/hapas_custom_backup/
cp -r .husky /tmp/hapas_custom_backup/
cp -r themes/hapas /tmp/hapas_custom_backup/hapas_theme
cp -r data /tmp/hapas_custom_backup/
cp -r analysis /tmp/hapas_custom_backup/
cp -r scripts /tmp/hapas_custom_backup/
cp -r config /tmp/hapas_custom_backup/

# Copy Docker files
cp docker-compose*.yml /tmp/hapas_custom_backup/
cp Dockerfile* /tmp/hapas_custom_backup/

# Copy documentation
cp WARP.md /tmp/hapas_custom_backup/
cp DEPLOYMENT_GUIDE.md /tmp/hapas_custom_backup/
cp DEPLOYMENT_STATUS.md /tmp/hapas_custom_backup/
cp README_CI_CD.md /tmp/hapas_custom_backup/
cp CRITICAL-ISSUES-RESOLUTION-COMPLETE.md /tmp/hapas_custom_backup/
cp FONT-RENDERING-INVESTIGATION-COMPLETE.md /tmp/hapas_custom_backup/
cp HAPAS-NAVIGATION-IMPLEMENTATION-COMPLETE.md /tmp/hapas_custom_backup/
cp HAPAS-THEME-INTEGRATION-TESTING.md /tmp/hapas_custom_backup/
cp KIAS-COLOR-MAPPING.md /tmp/hapas_custom_backup/
cp MIGRATION_GUIDE.md /tmp/hapas_custom_backup/
cp NAVIGATION-CATEGORY-ANALYSIS-COMPLETE.md /tmp/hapas_custom_backup/
cp PHASE-2A-MIGRATION-REPORT.md /tmp/hapas_custom_backup/
cp hapas_shop_huong_dan_day_du.md /tmp/hapas_custom_backup/

# Copy test scripts
cp test-*.js /tmp/hapas_custom_backup/
cp validate-migration-system.js /tmp/hapas_custom_backup/
cp reset-admin-password.js /tmp/hapas_custom_backup/

# Copy SQL scripts
cp fix_vietnamese_navigation.sql /tmp/hapas_custom_backup/
cp update_navigation.sql /tmp/hapas_custom_backup/

# Copy custom public assets
mkdir -p /tmp/hapas_custom_backup/public_custom
cp public/images/kias-placeholder.svg /tmp/hapas_custom_backup/public_custom/

echo "✅ Custom files backed up to /tmp/hapas_custom_backup"
```

### **BƯỚC 4: XÓA CODE CŨ (GIỮ LẠI GIT)**

```bash
cd /Volumes/DoanBHSST9/Outsource/hapas_ecommerce

# Xóa packages core
rm -rf packages/

# Xóa extensions (kiểm tra trước!)
rm -rf extensions/

# Xóa translations
rm -rf translations/

# Xóa node_modules và lock
rm -rf node_modules/
rm -f package-lock.json

# Xóa build artifacts
rm -rf .evershop/

# Xóa các file config của upstream
rm -f changelog.md
rm -f CODE_OF_CONDUCT.md
rm -f CONTRIBUTING.md
rm -f LICENSE
rm -f README.md
rm -f eslint.config.js
rm -f jest.config.js
rm -f tsconfig.json
rm -f package.json

# Commit trạng thái này
git add .
git commit -m "chore: remove upstream code - keep only custom files"
```

### **BƯỚC 5: THÊM EVERSHOP UPSTREAM**

```bash
# Thêm remote upstream
git remote add evershop https://github.com/evershopcommerce/evershop.git

# Fetch upstream
git fetch evershop

# Kiểm tra branches
git remote -v
git branch -r | grep evershop

echo "✅ EverShop upstream added"
```

### **BƯỚC 6: MERGE UPSTREAM VÀO NHÁNH MỚI**

```bash
# Tạo nhánh từ upstream dev branch
git checkout -b evershop-base evershop/dev

# Switch về nhánh refactor
git checkout refactor/upstream-sync

# Merge upstream vào
git merge --allow-unrelated-histories -X theirs evershop-base

# Sẽ có conflicts, giải quyết bằng cách giữ lại custom files
```

### **BƯỚC 7: RESTORE CUSTOM FILES**

```bash
# Copy lại custom files
cp -r /tmp/hapas_custom_backup/.cursor .
cp -r /tmp/hapas_custom_backup/.github .
cp -r /tmp/hapas_custom_backup/.history .
cp -r /tmp/hapas_custom_backup/.husky .

# Restore theme
mkdir -p themes
cp -r /tmp/hapas_custom_backup/hapas_theme themes/hapas

# Restore data
cp -r /tmp/hapas_custom_backup/data .

# Restore analysis
cp -r /tmp/hapas_custom_backup/analysis .

# Restore scripts
cp -r /tmp/hapas_custom_backup/scripts .

# Restore Docker files
cp /tmp/hapas_custom_backup/docker-compose*.yml .
cp /tmp/hapas_custom_backup/Dockerfile* .

# Restore documentation
cp /tmp/hapas_custom_backup/WARP.md .
cp /tmp/hapas_custom_backup/DEPLOYMENT_GUIDE.md .
cp /tmp/hapas_custom_backup/DEPLOYMENT_STATUS.md .
cp /tmp/hapas_custom_backup/README_CI_CD.md .
cp /tmp/hapas_custom_backup/*.md .

# Restore test scripts
cp /tmp/hapas_custom_backup/test-*.js .
cp /tmp/hapas_custom_backup/validate-migration-system.js .
cp /tmp/hapas_custom_backup/reset-admin-password.js .

# Restore SQL scripts
cp /tmp/hapas_custom_backup/*.sql .

# Restore public assets
mkdir -p public/images
cp /tmp/hapas_custom_backup/public_custom/* public/images/

echo "✅ Custom files restored"
```

### **BƯỚC 8: MERGE package.json VÀ config**

```bash
# Lưu package.json từ upstream
cp package.json package.upstream.json

# So sánh và merge thủ công
# Giữ lại custom scripts từ HAPAS:
# - migrate:categories
# - import:kias-products
# - download:product-images
# - verify:products

# Merge config/default.json
# Giữ lại HAPAS custom config:
# - database connection
# - theme: "hapas"
```

**⚠️ CHÚ Ý:** File này cần merge thủ công trong BƯỚC 9

### **BƯỚC 9: UPDATE package.json**

Thêm custom scripts vào package.json từ upstream:

```json
{
  "scripts": {
    "migrate:categories": "node ./scripts/migrate-kias-data.js",
    "import:kias-products": "node ./scripts/importKiasProducts.mjs",
    "download:product-images": "node ./scripts/downloadProductImages.mjs",
    "verify:products": "node ./scripts/verifyProducts.mjs"
  },
  "dependencies": {
    "bcrypt": "^6.0.0",
    "cheerio": "^1.1.0",
    "slick-carousel": "^1.8.1"
  }
}
```

### **BƯỚC 10: INSTALL VÀ TEST**

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile
npm run compile:db

# Test build
npm run build

# Test development
npm run dev

# Verify theme loads correctly
# Verify CI/CD workflows are intact
# Verify Docker configs work

# Commit everything
git add .
git commit -m "chore: merge upstream EverShop with HAPAS customizations"
git push origin refactor/upstream-sync
```

---

## 🔄 CẬP NHẬT TỪ UPSTREAM SAU NÀY

Khi EverShop có update mới:

```bash
# Fetch upstream
git fetch evershop

# Xem thay đổi
git log HEAD..evershop/dev --oneline

# Merge upstream vào branch hiện tại
git merge evershop/dev

# Giải quyết conflicts (nếu có)
# Ưu tiên giữ custom code của HAPAS

# Test lại
npm install
npm run compile
npm run compile:db
npm run build

# Push
git push
```

---

## ✅ CHECKLIST SAU KHI HOÀN THÀNH

- [ ] Tất cả custom files đều còn nguyên
- [ ] CI/CD workflow hoạt động bình thường
- [ ] Docker configs hoạt động
- [ ] Theme HAPAS load được
- [ ] Database migrations chạy được
- [ ] Custom scripts trong package.json hoạt động
- [ ] Application build và run thành công
- [ ] Git upstream được config đúng
- [ ] Documentation được giữ nguyên

---

## 📌 LƯU Ý QUAN TRỌNG

### 1. Backup trước khi làm
- Backup toàn bộ project
- Backup database
- Push code lên Git

### 2. Test từng bước
- Không làm nhiều bước cùng lúc
- Test sau mỗi bước
- Commit thường xuyên

### 3. Extensions
- Kiểm tra `extensions/` trước khi xóa
- Nếu có custom extensions, giữ lại
- Extensions tiêu chuẩn có thể xóa

### 4. Conflicts
- Khi merge upstream sẽ có conflicts
- Ưu tiên giữ custom code của HAPAS
- Đặc biệt chú ý: config, theme, scripts

### 5. Testing
- Test CI/CD sau khi hoàn thành
- Test Docker deployment
- Test theme rendering
- Test database connections

---

## 🆘 ROLLBACK (NẾU CẦN)

Nếu có vấn đề, rollback bằng cách:

```bash
# Quay lại commit trước đó
git checkout chore/snapshot-2025-10-06

# Hoặc restore từ backup
cd /Volumes/DoanBHSST9/Outsource
tar -xzf hapas_ecommerce_backup_*.tar.gz
```

---

**Kế hoạch này đảm bảo:**
- ✅ Giữ nguyên tất cả custom code của HAPAS
- ✅ Đồng bộ với EverShop upstream
- ✅ Dễ dàng cập nhật trong tương lai
- ✅ CI/CD vẫn hoạt động bình thường
- ✅ Có thể rollback nếu cần

