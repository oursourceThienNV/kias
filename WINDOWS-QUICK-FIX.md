# Windows Quick Fix - White Screen Issue

**TLDR: You MUST compile code before running dev server!**

---

## 🚨 Common Errors:

### Error 1: Cannot find module 'dist/bin/dev/index.js'
```
Error: Cannot find module 'D:\...\packages\evershop\dist\bin\dev\index.js'
code: 'MODULE_NOT_FOUND'
```
**Cause:** You haven't compiled the code yet!

### Error 2: Cannot find module './LoadingBar.scss'
```
Uncaught Error: Cannot find module './LoadingBar.scss'
→ White screen / Blank page
```
**Cause:** SCSS files not copied OR webpack cache issue

---

## ✅ First Time Setup (MUST DO THIS!)

```powershell
# After git clone or git pull:
npm install                # Install dependencies
cd themes/hapas && npm install && cd ../..  # Install theme dependencies
npm run compile:windows    # Compile TypeScript → JavaScript (includes theme!)
npm run dev                # Start dev server
```

**Note:** `compile:windows` now compiles:
- ✅ Database package
- ✅ Core EverShop
- ✅ Extensions (hapas-homepage)
- ✅ **Theme (hapas)** ← NEW!

## ✅ If Already Compiled (Cache Issue)

```powershell
npm run clean               # Cleans: core, db, extensions, theme, webpack cache
npm run compile:windows     # Compiles: core, db, extensions, theme
npm run dev                 # Start dev server
```

**That's it!** Server will start and page should load.

---

## 📋 Step-by-Step (If Above Doesn't Work)

```powershell
# 1. Stop dev server (Ctrl+C if running)

# 2. Clean EVERYTHING (compiled code + webpack cache)
npm run clean

# 3. Recompile with Windows-optimized scripts
npm run compile:windows

# 4. Verify SCSS files exist
dir packages\evershop\dist\components\common\LoadingBar.scss
# Should show: LoadingBar.scss

# 5. Verify cache was cleared
dir .evershop
# Should be empty or show only fresh builds

# 6. Start dev server
npm run dev
# First start will be slow (building webpack bundles)
# Homepage should load without errors!
```

---

## 🤔 Why Does This Happen?

**The Problem:**
- Webpack bundles are cached in `.evershop/build/`
- Old bundles built BEFORE SCSS files were in `dist/`
- Dev server serves old cached bundles
- Old bundles can't find SCSS files → Error!

**The Solution:**
- Clean `.evershop/` cache
- Recompile (with SCSS files)
- Restart dev server
- Webpack rebuilds bundles with SCSS → Success!

---

## 🔄 Common Scenarios

### Scenario 1: Just cloned repo
```powershell
npm install
npm run compile:windows  # IMPORTANT: Windows-specific!
npm run setup
npm run dev
```

### Scenario 2: Pulled updates from git
```powershell
npm install              # Update dependencies
npm run clean            # Clear old builds + cache
npm run compile:windows  # Recompile
npm run dev             # Start fresh
```

### Scenario 3: Switching from macOS to Windows
```powershell
# On Windows machine:
npm run clean            # Remove macOS builds + cache
npm run compile:windows  # Windows-optimized compilation
npm run dev             # Fresh start
```

### Scenario 4: Changes not showing
```powershell
# If you edit code but don't see changes:
npm run clean:cache     # Clear ONLY webpack cache
npm run dev             # Restart (will rebuild)
```

---

## ⚡ Quick Commands Reference

| Command | What it does | When to use |
|---------|--------------|-------------|
| `npm run clean` | Remove dist/ + cache | Most issues |
| `npm run clean:cache` | Remove ONLY cache | Changes not showing |
| `npm run compile:windows` | Windows compilation | After clean |
| `npm run dev` | Start dev server | Every time |
| `npm run build` | Production build | Deployment |

---

## 🎯 Success Checklist

After running commands, verify:

- [x] `packages\evershop\dist\components\common\LoadingBar.scss` exists
- [x] `.evershop` folder cleared
- [x] `npm run dev` starts without errors
- [x] Browser loads `http://localhost:3000` without white screen
- [x] No "Cannot find module" errors in console

---

## 🚨 Error: ENOTEMPTY directory not empty

**Error message:**
```
Error: ENOTEMPTY: directory not empty, rmdir '.../dist/types'
```

**Cause:** 
- Dev server file watcher tries to rebuild
- Windows file locks prevent folder deletion
- TypeScript compiler has files open

**Fix:**
```powershell
# 1. Stop dev server (Ctrl+C)

# 2. Force remove dist folder
rmdir /s /q packages\evershop\dist

# 3. Recompile
npm run compile:windows

# 4. Start dev fresh
npm run dev
```

**If still fails:**
```powershell
# Close ALL terminals, IDEs, file explorers
# Then retry above steps

# OR restart computer (Windows file locks can be persistent)
```

---

## 🆘 Still Not Working?

1. **Check Node.js version:**
   ```powershell
   node --version  # Should be 18+
   ```

2. **Check if database is running:**
   ```powershell
   docker ps  # or services.msc for local PostgreSQL
   ```

3. **Try full clean:**
   ```powershell
   # Remove everything
   npm run clean
   
   # Remove node_modules (nuclear option)
   rmdir /s node_modules
   npm install
   
   # Recompile and start
   npm run compile:windows
   npm run dev
   ```

4. **Check for errors:**
   ```powershell
   # Run dev and save logs
   npm run dev 2>&1 | Tee-Object -FilePath dev.log
   # Check dev.log file for errors
   ```

---

## 📚 More Help

- **Full Windows Setup:** See [WINDOWS-SETUP.md](WINDOWS-SETUP.md)
- **General Setup:** See [SETUP.md](SETUP.md)
- **Main README:** See [README.md](README.md)

---

**Last Updated:** October 9, 2025  
**Works with:** Windows 10/11, Node.js 18+, PowerShell 7+

