# Windows Theme Debug Guide

## 🎯 Problem: Mac shows full UI, Windows shows only basic header

### Symptoms on Windows:
- ✅ Shows: "Your heading here" text
- ✅ Shows: Profile icon + Cart icon (2 icons only)
- ❌ Missing: Main navigation (MỚI, SET BỘ, VÁY & ĐẦM, etc.)
- ❌ Missing: Wishlist icon
- ❌ Missing: Search icon
- ❌ Missing: Language switcher
- ❌ Missing: KIAS logo

### Root Cause:
**Theme components are NOT being loaded!**

Only core components from `packages/evershop/src/modules/` are rendering.
Theme components from `themes/hapas/src/pages/all/` are NOT rendering.

---

## ✅ Step-by-Step Fix

### 1. Check Active Theme

```powershell
# Check config/default.json
cat config/default.json | grep -A 5 "theme"
```

**Expected output:**
```json
"theme": "hapas"
```

**If NOT "hapas":**
```powershell
# Update config/default.json, change:
"system": {
  "theme": "hapas"  ← Must be "hapas"
}
```

---

### 2. Check Theme Files Exist

```powershell
# Check if theme source files exist
dir themes\hapas\src\pages\all\MainNavigation.tsx
dir themes\hapas\src\pages\all\HapasHeaderActions.tsx
dir themes\hapas\src\pages\all\HapasLogo.tsx
```

**All 3 files must exist!**

---

### 3. Check Theme Compilation

```powershell
# Check if compiled files exist
dir themes\hapas\dist\pages\all\MainNavigation.js
dir themes\hapas\dist\pages\all\HapasHeaderActions.js
dir themes\hapas\dist\pages\all\HapasLogo.js
```

**If files DON'T exist:**
```powershell
# Compile theme (included in compile:windows)
npm run compile:windows
```

---

### 4. Check Extension is Enabled

```powershell
# Check config/default.json
cat config/default.json | grep -A 10 "extensions"
```

**Expected output:**
```json
"extensions": [
  {
    "name": "hapas-homepage",
    "resolve": "extensions/hapas-homepage",
    "enabled": true,
    "priority": 10
  }
]
```

**If enabled is false or missing:**
```powershell
# Update config/default.json:
"enabled": true  ← Must be true
```

---

### 5. Check Extension Compiled Files

```powershell
# Check if extension is compiled
dir extensions\hapas-homepage\dist\pages\frontStore\homepage\index.js
```

**If files DON'T exist:**
```powershell
# Compile extension (included in compile:windows)
npm run compile:windows
```

---

### 6. Clear Webpack Cache

```powershell
# Stop dev server (Ctrl+C)

# Clear webpack build cache
npm run clean:cache

# Or clear EVERYTHING
npm run clean
```

---

### 7. Full Clean Rebuild

If above steps don't work, do a **FULL CLEAN REBUILD**:

```powershell
# 1. Stop dev server (Ctrl+C)

# 2. Clean EVERYTHING
npm run clean

# 3. Recompile from scratch
npm run compile:windows

# 4. Start dev server
npm run dev

# 5. Open browser: http://localhost:3000
```

---

### 8. Check Database Has Categories

**On Mac (working):**
```bash
docker exec hapas-ecommerce-db psql -U hapas -d hapas_ecommerce -c "
  SELECT c.category_id, cd.name, c.include_in_nav, c.status 
  FROM category c 
  LEFT JOIN category_description cd ON c.category_id = cd.category_description_category_id 
  WHERE c.include_in_nav = true AND c.status = true 
  ORDER BY c.category_id;
"
```

**Expected output:**
```
 category_id |   name    | include_in_nav | status 
-------------+-----------+----------------+--------
           1 | Kids      | t              | t
           2 | Women     | t              | t
           3 | Men       | t              | t
           4 | Set Bộ    | t              | t
           5 | Váy & Đầm | t              | t
           6 | Quần      | t              | t
           7 | Áo        | t              | t
```

**If NO categories on Windows:**
```powershell
# Run migration to create categories
node scripts/kias-migration-complete.js
```

---

## 🔍 Debug: Check What's Actually Rendering

### Check Browser Console

1. Open browser: `http://localhost:3000`
2. Press `F12` → Console tab
3. Look for errors related to:
   - `MainNavigation`
   - `HapasHeaderActions`
   - `HapasLogo`
   - GraphQL query errors

### Check Server Logs

Look for:
```
✅ Component discovered: MainNavigation at themes/hapas/dist/pages/all/MainNavigation.js
✅ Component discovered: HapasHeaderActions at themes/hapas/dist/pages/all/HapasHeaderActions.js
✅ Component discovered: HapasLogo at themes/hapas/dist/pages/all/HapasLogo.js
```

**If NOT found:**
- Theme components are not being discovered
- Check theme path in `config/default.json`
- Check compiled files exist in `themes/hapas/dist/pages/all/`

---

## 🎯 Expected Results After Fix

### Header should show:

**Top Bar:**
- Announcement: "Ưu đãi 150K cho sản phẩm BUBBLY"

**Middle:**
- Left: (empty)
- Center: **KIAS Logo** (not "HAPAS" text)
- Right: 
  - 🔍 Search icon
  - 👤 Profile icon
  - 🛒 Cart icon (with badge if items exist)
  - ❤️ **Wishlist icon** (with badge)
  - Language: "Ngôn ngữ | VN"

**Bottom:**
- Navigation: **MỚI | SET BỘ | VÁY & ĐẦM | QUẦN | ÁO | GIÁ MỚI HẤP DẪN**

---

## 🚨 Common Issues

### Issue 1: "Your heading here" text

**Cause:** This is NOT from EverShop code!
- Could be browser extension injecting content
- Could be from incomplete theme render

**Fix:** Ignore this text, focus on missing components

---

### Issue 2: Theme components not discovered

**Check:**
```powershell
# 1. Theme name in config
cat config\default.json | findstr theme

# 2. Theme files exist
dir themes\hapas\dist\pages\all\

# 3. Clean and rebuild
npm run clean && npm run compile:windows && npm run dev
```

---

### Issue 3: Categories not showing even after compile

**Cause:** Database doesn't have categories OR GraphQL query failing

**Fix:**
```powershell
# 1. Check database (see step 8 above)

# 2. If no categories, run migration
node scripts\kias-migration-complete.js

# 3. Restart dev server
npm run dev
```

---

### Issue 4: Some icons showing, some missing

**Current state:**
- ✅ Profile icon (core)
- ✅ Cart icon (core)
- ❌ Search icon (theme HapasHeaderActions)
- ❌ Wishlist icon (theme HapasHeaderActions)

**Cause:** Core components load, theme components don't

**Fix:** Follow steps 1-7 above to ensure theme is loaded

---

## 📊 Component Priority

EverShop area system uses `sortOrder`:
- **Lower number = higher priority = renders first**

### headerMiddleCenter:
- `HapasLogo` (sortOrder: 1) ← Should render
- `Logo` (sortOrder: 10) ← Fallback if HapasLogo missing

### headerMiddleRight:
- `HapasHeaderActions` (sortOrder: 10) ← Should render ALL actions (search, profile, cart, wishlist, language)
- `SearchBox` (sortOrder: 5) ← Core component
- `CustomerIcon` (sortOrder: 10) ← Core component
- `MiniCartIcon` (sortOrder: 15) ← Core component

**If theme component exists, it should REPLACE or OVERRIDE core components!**

---

## 🎓 Understanding the Issue

### Why Mac works, Windows doesn't:

1. **Mac:**
   - Theme compiled correctly
   - `themes/hapas/dist/` exists with all files
   - EverShop discovers theme components
   - Theme components render instead of core components
   - Full HAPAS UI displayed ✅

2. **Windows:**
   - Theme NOT compiled OR not discovered
   - EverShop falls back to core components
   - Only basic header shows
   - Missing: navigation, wishlist, custom styling ❌

### The Fix:
**Ensure theme is compiled and EverShop can discover theme components!**

---

## 📞 Still Not Working?

If after following ALL steps above, Windows still shows basic header:

1. **Compare with Mac:**
   - Check `config/default.json` is IDENTICAL
   - Check `themes/hapas/dist/` folder structure is IDENTICAL
   - Check `extensions/hapas-homepage/dist/` exists

2. **Check file paths:**
   ```powershell
   # Windows uses backslashes, ensure no hardcoded forward slashes
   # EverShop should handle this, but double-check:
   cat package.json | findstr compile:extensions
   ```

3. **Check Node.js version:**
   ```powershell
   node --version  # Should be v20.x (same as Mac)
   npm --version
   ```

4. **Nuclear option:**
   ```powershell
   # Delete EVERYTHING and start fresh
   rmdir /s /q node_modules
   rmdir /s /q packages\evershop\dist
   rmdir /s /q packages\postgres-query-builder\dist
   rmdir /s /q extensions\hapas-homepage\dist
   rmdir /s /q themes\hapas\dist
   rmdir /s /q .evershop
   
   npm install
   npm run compile:windows
   npm run dev
   ```

---

**Last Updated:** October 9, 2025
**Issue:** Windows shows basic header only, Mac shows full HAPAS UI
**Status:** Diagnostic guide created, awaiting Windows user testing

