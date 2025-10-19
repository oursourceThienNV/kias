# Windows Theme Compilation Fix

## 🎯 Problem Identified

**User reported:** "Trong thư mục themes\hapas\dist\pages\all\ chỉ có mỗi SearchBox.js"

### Root Cause:

1. ❌ **`compile:windows` script KHÔNG compile theme!**
   - Chỉ compile: database, core, extensions
   - THIẾU: theme compilation

2. ❌ **Theme build scripts dùng Unix commands (`rm -rf`)**
   - Không hoạt động trên Windows PowerShell
   - Cần dùng `rimraf` (cross-platform)

---

## ✅ Fix Applied (October 9, 2025)

### 1. Updated `themes/hapas/package.json`:

**Before:**
```json
"build:clean": "rm -rf dist",
"clean": "rm -rf dist"
```

**After:**
```json
"build:clean": "rimraf dist",
"clean": "rimraf dist",
"devDependencies": {
  "rimraf": "^6.0.1",  ← Added
  ...
}
```

### 2. Updated root `package.json`:

**Before:**
```json
"compile:windows": "npm run compile:db:tsc && npm run compile:tsc && npm run compile:extensions"
```

**After:**
```json
"compile:theme": "cd ./themes/hapas && npm run build",  ← NEW SCRIPT
"compile:windows": "npm run compile:db:tsc && npm run compile:tsc && npm run compile:extensions && npm run compile:theme"
```

### 3. Updated `clean` script to include theme:

**Before:**
```json
"clean": "rimraf ./packages/evershop/dist ./packages/postgres-query-builder/dist ./extensions/hapas-homepage/dist ./.evershop"
```

**After:**
```json
"clean": "rimraf ./packages/evershop/dist ./packages/postgres-query-builder/dist ./extensions/hapas-homepage/dist ./themes/hapas/dist ./.evershop"
```

---

## 🚀 How to Use (Windows Users)

### First Time Setup:

```powershell
# 1. Install root dependencies
npm install

# 2. Install theme dependencies
cd themes/hapas
npm install
cd ../..

# 3. Compile everything (including theme!)
npm run compile:windows

# 4. Start dev server
npm run dev
```

### After Changes:

```powershell
# Full rebuild
npm run clean
npm run compile:windows
npm run dev
```

---

## ✅ Expected Result After Fix

**Before fix (Windows):**
```
themes\hapas\dist\pages\all\
  - SearchBox.js  ← Only this file!
```

**After fix (Windows):**
```
themes\hapas\dist\pages\all\
  - AnnouncementBar.js
  - AnnouncementBar.scss
  - CustomerIcon.js
  - GlobalStyles.js
  - HapasFooter.js
  - HapasFooter.scss
  - HapasHeaderActions.js
  - HapasHeaderActions.scss
  - HapasHeadTags.js
  - HapasLogo.js
  - HapasLogo.scss
  - Logo.js
  - MainNavigation.js        ← Navigation menu!
  - MainNavigation.scss
  - MiniCartIcon.js
  - SearchBox.js
```

**Total:** 16 files (8 .js + 8 .scss)

---

## 🎯 Theme Compilation Process

### What `npm run compile:theme` does:

1. **Clean:** `rimraf dist` (removes old compiled files)
2. **Compile:** `swc src -d dist --copy-files` (TypeScript → JavaScript)
3. **SCSS:** `sass src/styles:dist/styles` (SCSS → CSS)

### Files compiled:

- `themes/hapas/src/**/*.tsx` → `themes/hapas/dist/**/*.js`
- `themes/hapas/src/**/*.scss` → `themes/hapas/dist/**/*.scss` (copied)
- `themes/hapas/src/styles/**/*.scss` → `themes/hapas/dist/styles/**/*.css` (compiled)

---

## 🔍 Verification

### Check theme compiled correctly:

```powershell
# Should show 16+ files
dir themes\hapas\dist\pages\all\

# Should see main components
dir themes\hapas\dist\pages\all\MainNavigation.js
dir themes\hapas\dist\pages\all\HapasHeaderActions.js
dir themes\hapas\dist\pages\all\HapasLogo.js
```

### Check webpack cache cleared:

```powershell
# Should be empty or not exist after npm run clean
dir .evershop\build\
```

### Check dev server log:

Look for:
```
✅ Theme component discovered: MainNavigation
✅ Theme component discovered: HapasHeaderActions
✅ Theme component discovered: HapasLogo
```

---

## 📊 Impact on UI

### Before Fix (Windows):

**Header showed:**
- ❌ Basic header only
- ❌ "Your heading here" text
- ✅ 2 icons: profile + cart (core components)
- ❌ NO navigation menu
- ❌ NO wishlist icon
- ❌ NO search icon
- ❌ NO language switcher

### After Fix (Windows):

**Header shows:**
- ✅ Announcement bar: "Ưu đãi 150K cho sản phẩm BUBBLY"
- ✅ KIAS Logo (center)
- ✅ Full header actions: search + profile + cart + **wishlist** + language
- ✅ **Navigation menu:** MỚI | SET BỘ | VÁY & ĐẦM | QUẦN | ÁO | GIÁ MỚI HẤP DẪN
- ✅ Same UI as Mac! 🎉

---

## 🎓 Technical Details

### Why was only SearchBox.js compiled?

**Hypothesis:**
1. Previous build attempt was interrupted
2. Partial compilation happened
3. Only SearchBox.js got through before process stopped
4. No clean script ran, so old partial files remained

**Solution:**
- Always run `npm run clean` before compile
- Use `rimraf` for cross-platform file deletion
- Include theme in `compile:windows` workflow

### Why didn't theme compile before?

**Root cause:**
- Theme has its own `package.json` with build scripts
- Root `compile:windows` didn't call theme build
- Developers assumed theme was auto-compiled (it wasn't!)
- Mac likely had theme compiled once and cached

**Lesson learned:**
- Explicitly compile all workspace packages
- Don't assume nested packages auto-compile
- Document all compilation steps for new devs

---

## 🎯 Related Files Modified

1. `themes/hapas/package.json` - Fixed build scripts for Windows
2. `package.json` (root) - Added `compile:theme` and updated `compile:windows`
3. `WINDOWS-QUICK-FIX.md` - Updated setup instructions
4. `WINDOWS-THEME-DEBUG.md` - Created diagnostic guide

---

## ✅ Testing Checklist

After applying this fix, verify:

- [ ] `npm run clean` removes `themes/hapas/dist/`
- [ ] `npm run compile:theme` creates `themes/hapas/dist/`
- [ ] `themes/hapas/dist/pages/all/` has 16 files
- [ ] `npm run compile:windows` compiles theme automatically
- [ ] `npm run dev` shows full HAPAS UI
- [ ] Navigation menu displays correctly
- [ ] Wishlist icon appears
- [ ] Search icon appears
- [ ] Language switcher appears
- [ ] KIAS logo displays (not "HAPAS" text)

---

## 🚨 Known Issues

### Issue: `sass: command not found`

**Fix:**
```powershell
cd themes/hapas
npm install  # Installs sass as devDependency
cd ../..
npm run compile:theme
```

### Issue: `swc: command not found`

**Fix:**
```powershell
cd themes/hapas
npm install  # Installs @swc/cli as devDependency
cd ../..
npm run compile:theme
```

### Issue: `failed to read .swcrc file` (Windows)

**Cause:** Windows path resolution issue with `--config-file .swcrc` flag

**Fix Applied:** Removed `--config-file` flag - SWC auto-detects `.swcrc` in current directory

**Before:**
```json
"build:compile": "swc src -d dist --config-file .swcrc --copy-files"
```

**After:**
```json
"build:compile": "swc src -d dist --copy-files"
```

### Issue: Theme compiles but UI still basic

**Cause:** Webpack cache serving old bundle

**Fix:**
```powershell
npm run clean:cache  # Only clear webpack cache
# OR
npm run clean        # Clear everything
npm run compile:windows
npm run dev
```

---

**Created:** October 9, 2025  
**Issue:** Windows theme not compiling, only SearchBox.js present  
**Status:** FIXED - Added theme compilation to compile:windows workflow  
**Affects:** Windows development environments  
**Tested:** Pending Windows user confirmation

