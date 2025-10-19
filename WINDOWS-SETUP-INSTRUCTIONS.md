# Windows Setup Instructions - After Theme Fix

## 🎯 Bạn cần chạy gì trên Windows?

**TL;DR:**
```powershell
git pull
cd themes/hapas
npm install
cd ../..
npm run clean
npm run compile:windows
npm run dev
```

---

## 📋 Chi tiết từng bước

### Bước 1: Pull code mới nhất

```powershell
# Dừng dev server nếu đang chạy (Ctrl+C)

# Pull code từ branch
git pull origin refactor/upstream-sync
```

**Hoặc nếu có conflict:**
```powershell
git stash
git pull origin refactor/upstream-sync
git stash pop
```

---

### Bước 2: Cài dependencies cho theme

```powershell
# Di chuyển vào thư mục theme
cd themes\hapas

# Cài dependencies (bao gồm rimraf mới)
npm install

# Quay về thư mục root
cd ..\..
```

**Output mong đợi:**
```
added XX packages
...
rimraf installed ✅
```

---

### Bước 3: Clean toàn bộ compiled code

```powershell
# Clean tất cả: core, db, extensions, theme, webpack cache
npm run clean
```

**Lệnh này sẽ xóa:**
- `packages\evershop\dist\`
- `packages\postgres-query-builder\dist\`
- `extensions\hapas-homepage\dist\`
- `themes\hapas\dist\` ← MỚI!
- `.evershop\` (webpack cache)

---

### Bước 4: Compile toàn bộ (bao gồm theme!)

```powershell
# Compile: DB + Core + Extensions + Theme
npm run compile:windows
```

**Lệnh này sẽ chạy:**
1. `compile:db:tsc` - Compile database package (có .d.ts)
2. `compile:tsc` - Compile core EverShop (có .d.ts)
3. `compile:extensions` - Compile hapas-homepage extension
4. **`compile:theme`** - Compile theme HAPAS ← MỚI!

**Output mong đợi:**
```
> compile:db:tsc
... TypeScript compilation ...

> compile:tsc
... TypeScript compilation ...

> compile:extensions
... Extension compilation ...

> compile:theme
Successfully compiled: 19 files, copied 19 files with swc
```

**Thời gian:** Khoảng 30-60 giây

---

### Bước 5: Verify theme đã compile

```powershell
# Kiểm tra theme compiled files
dir themes\hapas\dist\pages\all\
```

**PHẢI thấy 16 files:**
```
AnnouncementBar.js
AnnouncementBar.scss
CustomerIcon.js
GlobalStyles.js
HapasFooter.js
HapasFooter.scss
HapasHeaderActions.js      ← Wishlist + Search + Language!
HapasHeaderActions.scss
HapasHeadTags.js
HapasLogo.js               ← KIAS Logo!
HapasLogo.scss
Logo.js
MainNavigation.js          ← Navigation Menu!
MainNavigation.scss
MiniCartIcon.js
SearchBox.js
```

**Nếu chỉ thấy SearchBox.js** → Compile lại:
```powershell
npm run compile:theme
```

---

### Bước 6: Start dev server

```powershell
npm run dev
```

**Output mong đợi:**
```
Building admin...
Building frontStore...
✓ Compiled successfully
```

---

### Bước 7: Kiểm tra UI trên browser

**Mở:** http://localhost:3000

**✅ PHẢI THẤY:**

**Header Top:**
- 📢 Announcement bar: "Ưu đãi 150K cho sản phẩm BUBBLY"

**Header Middle:**
- 🏢 KIAS Logo (giữa) - KHÔNG phải chữ "HAPAS"
- 🔍 Search icon
- 👤 Profile icon
- 🛒 Cart icon
- ❤️ **Wishlist icon** ← Phải có!
- 🌐 Language: "Ngôn ngữ | VN"

**Header Bottom:**
- 📱 Navigation menu: **MỚI | SET BỘ | VÁY & ĐẦM | QUẦN | ÁO | GIÁ MỚI HẤP DẪN**

**❌ NẾU KHÔNG THẤY:**
- Chỉ có 2 icon (profile + cart) → Theme chưa compile
- Không có navigation menu → Theme chưa compile
- Thấy chữ "HAPAS" thay vì logo → Theme chưa compile

**→ Quay lại Bước 4 và chạy lại `npm run compile:windows`**

---

## 🔄 Workflow hàng ngày (sau khi setup lần đầu)

### Khi pull code mới:

```powershell
git pull
npm run clean
npm run compile:windows
npm run dev
```

### Khi chỉ sửa theme:

```powershell
# Stop dev server (Ctrl+C)
npm run compile:theme
npm run dev
```

### Khi có lỗi lạ (white screen, missing components):

```powershell
# Nuclear option - clean everything
npm run clean
npm run compile:windows
npm run dev
```

### Khi update dependencies:

```powershell
npm install
cd themes\hapas && npm install && cd ..\..
npm run clean
npm run compile:windows
npm run dev
```

---

## 🚨 Troubleshooting

### Lỗi: `Cannot find module 'dist\bin\dev\index.js'`

**Nguyên nhân:** Chưa compile core

**Fix:**
```powershell
npm run compile:windows
```

### Lỗi: `Cannot find module './LoadingBar.scss'`

**Nguyên nhân:** Webpack cache cũ hoặc SCSS chưa copy

**Fix:**
```powershell
npm run clean
npm run compile:windows
npm run dev
```

### Lỗi: `ENOTEMPTY: directory not empty`

**Nguyên nhân:** Windows file lock

**Fix:**
```powershell
# 1. Stop dev server (Ctrl+C)

# 2. Close VSCode/IDE

# 3. Manual delete
rmdir /s /q packages\evershop\dist
rmdir /s /q .evershop

# 4. Recompile
npm run compile:windows
npm run dev
```

### Lỗi: `sass: command not found`

**Nguyên nhân:** Theme dependencies chưa install

**Fix:**
```powershell
cd themes\hapas
npm install
cd ..\..
npm run compile:theme
```

### Lỗi: `failed to read .swcrc file`

**Nguyên nhân:** Windows path resolution (đã fix trong code)

**Fix:**
```powershell
# Pull code mới nhất (đã có fix)
git pull

# Compile lại
npm run compile:theme
```

**Nếu vẫn lỗi:**
```powershell
cd themes\hapas
npm install  # Reinstall dependencies
cd ..\..
npm run clean
npm run compile:windows
```

### Lỗi: Theme compile nhưng UI vẫn basic

**Nguyên nhân:** Webpack cache

**Fix:**
```powershell
npm run clean:cache
npm run dev
```

### Lỗi: Database connection failed

**Nguyên nhân:** PostgreSQL chưa start

**Fix:**
```powershell
# Check Docker
docker ps | findstr postgres

# Start if not running
docker start hapas-ecommerce-db

# Verify
docker ps
```

---

## 📊 So sánh Before/After

### BEFORE (Windows - Lỗi):

```powershell
npm run compile:windows
→ Compile: DB, Core, Extensions
→ THIẾU: Theme!

dir themes\hapas\dist\pages\all\
→ Chỉ có: SearchBox.js

Browser:
→ Chỉ thấy: 2 icons (profile + cart)
→ KHÔNG có: Navigation, wishlist, search, language
```

### AFTER (Windows - Fix):

```powershell
npm run compile:windows
→ Compile: DB, Core, Extensions, THEME ✅

dir themes\hapas\dist\pages\all\
→ Có: 16 files (all components) ✅

Browser:
→ Full UI giống Mac:
  ✅ Navigation menu
  ✅ Wishlist icon
  ✅ Search icon
  ✅ Language switcher
  ✅ KIAS logo
```

---

## ✅ Checklist cho Windows Users

Sau khi làm theo hướng dẫn, check:

- [ ] `git pull` thành công
- [ ] `cd themes\hapas && npm install` thành công
- [ ] `npm run clean` xóa hết compiled code
- [ ] `npm run compile:windows` compile thành công (không lỗi)
- [ ] `dir themes\hapas\dist\pages\all\` thấy 16 files
- [ ] `npm run dev` start thành công
- [ ] Browser thấy navigation menu (MỚI, SET BỘ, VÁY & ĐẦM...)
- [ ] Browser thấy wishlist icon (trái tim)
- [ ] Browser thấy search icon (kính lúp)
- [ ] Browser thấy language switcher (Ngôn ngữ | VN)
- [ ] Browser thấy KIAS logo (KHÔNG phải chữ "HAPAS")
- [ ] UI giống y hệt screenshot từ Mac

**Nếu TẤT CẢ checklist PASS** → ✅ Setup thành công!

**Nếu có bất kỳ item nào FAIL** → Xem Troubleshooting section ở trên

---

## 💡 Tips

1. **Always clean before compile** nếu có vấn đề lạ
2. **Close IDE/terminals** khi có lỗi ENOTEMPTY
3. **Check Docker** trước khi start dev server
4. **Use PowerShell** (không phải CMD)
5. **Run as Administrator** nếu có permission errors

---

## 📞 Cần help?

Nếu vẫn gặp vấn đề:

1. Check **WINDOWS-THEME-DEBUG.md** - Diagnostic guide chi tiết
2. Check **WINDOWS-THEME-FIX.md** - Technical details
3. Check **FIX-SUMMARY.md** - Quick reference

---

**Created:** October 9, 2025  
**For:** Windows Users  
**After:** Theme compilation fix (commit 781bbeee)  
**Status:** Ready to use

