# HAPAS E-commerce - Windows Setup Guide

Quick setup guide specifically for Windows developers encountering common issues.

---

## 🪟 Windows-Specific Quick Start

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- PostgreSQL 14+ ([Download](https://www.postgresql.org/download/windows/))
- Git ([Download](https://git-scm.com/download/win))
- PowerShell or Command Prompt

### 1-Command Setup (Recommended)

Open PowerShell as Administrator:

```powershell
# Clone and setup
git clone <repository-url>
cd hapas_ecommerce
npm install
npm run compile:windows  # ← Windows-optimized compilation
npm run setup
npm run dev
```

### Step-by-Step Setup

```powershell
# 1. Clone repository
git clone <repository-url>
cd hapas_ecommerce

# 2. Install dependencies
npm install

# 3. ⚠️ CRITICAL: Compile with Windows-compatible script
npm run compile:windows
# This runs:
#  - compile:tsc (TypeScript + copyfiles - reliable on Windows)
#  - compile:db (Database query builder)
#  - compile:extensions (HAPAS homepage extension)

# 4. Setup database and admin user
npm run setup
# Follow prompts to configure database connection

# 5. Start development server
npm run dev
# Server will start on http://localhost:3000
```

---

## 🎓 Understanding SWC vs TypeScript Compiler

### Why Windows Uses Different Compilation?

**SWC (Fast Transpiler):**
- ✅ Very fast JavaScript/TypeScript compilation
- ✅ Used by default: `npm run compile`
- ❌ Does NOT generate `.d.ts` type declaration files
- ❌ No type checking
- 🎯 Great for development mode (runtime doesn't need types)

**TypeScript Compiler (TSC):**
- ✅ Generates `.d.ts` type declaration files
- ✅ Full type checking
- ✅ Required when one package imports types from another
- ⚠️ Slower than SWC (but still fast enough)
- 🎯 Required for Windows when using `compile:tsc`

### The Type Declaration Problem

```
SWC compilation:
packages/postgres-query-builder/dist/
  ├─ index.js       ✅ JavaScript
  └─ index.d.ts     ❌ MISSING!

TypeScript cannot find PoolClient type → ERROR!

TSC compilation:
packages/postgres-query-builder/dist/
  ├─ index.js       ✅ JavaScript
  └─ index.d.ts     ✅ Type declarations

TypeScript finds PoolClient type → SUCCESS!
```

---

## 🚨 Common Windows Issues & Fixes

### Issue #1: White Screen / Blank Page

**Error in Console:**
```
Cannot find module './LoadingBar.scss'
Uncaught Error: Cannot find module './LoadingBar.scss'
```

**Cause:**
- SCSS files not copied to `dist/` folder
- SWC's `--copy-files` flag doesn't work reliably on Windows

**Fix:**
```powershell
# CRITICAL: Clean BOTH compiled files AND webpack cache!
npm run clean
# This removes:
#  - packages/*/dist (compiled TypeScript)
#  - .evershop folder (webpack build cache)

# Recompile with Windows-specific compilation
npm run compile:windows
# This runs in order:
#  1. npm run compile:db:tsc (postgres-query-builder with TypeScript)
#     → Creates .js AND .d.ts files (type declarations)
#  2. npm run compile:tsc (evershop core with TypeScript)
#     → Can now import types from postgres-query-builder!
#  3. npm run compile:extensions (hapas-homepage)
#     → Can import types from evershop!

# Why TypeScript compiler instead of SWC?
# - SWC: Fast but NO type declarations (.d.ts)
# - TSC: Slower but generates .d.ts files
# - Windows needs .d.ts for type checking!

npm run dev
```

**Verify fix worked:**
```powershell
# 1. Check SCSS files exist in dist/
dir packages\evershop\dist\components\common\*.scss
# Should show LoadingBar.scss and other SCSS files

# 2. Check webpack cache was cleared
dir .evershop
# Should be EMPTY or show fresh builds only

# 3. Start dev server (will rebuild webpack bundles)
npm run dev
# First start will be slower (building bundles)
# Subsequent reloads will be faster (hot reload)
```

**Why this fixes it:**

The issue is webpack build cache, not compilation:

```
Problem Flow:
1. Old webpack bundles in .evershop/build (built without SCSS)
2. Dev server serves cached bundles
3. Cached bundles try to import './LoadingBar.scss'
4. File not in OLD bundle → ERROR!

Solution Flow:
1. Clean .evershop cache
2. Recompile packages (with SCSS files)
3. Start dev server
4. Webpack rebuilds bundles (includes SCSS) → SUCCESS!
```

---

### Issue #2: Scripts Not Running

**Error:**
```
node run scripts/clean-all-data.js
Error: Cannot find module 'D:\...\run'
```

**Cause:**
Wrong command syntax (missing path separator interpretation)

**Fix:**
```powershell
# ❌ Wrong
node run scripts/clean-all-data.js

# ✅ Correct
node scripts/clean-all-data.js
# or
node scripts\clean-all-data.js  # Windows-style path
```

---

### Issue #3: PostgreSQL Connection Failed

**Error:**
```
AggregateError [ECONNREFUSED]
Connection refused
```

**Cause:**
PostgreSQL service not running

**Fix (Docker):**
```powershell
# Start PostgreSQL container
docker start hapas-ecommerce-db

# Verify it's running
docker ps | findstr postgres
```

**Fix (Local PostgreSQL):**
```powershell
# Start PostgreSQL service
net start postgresql-x64-14  # Replace with your version

# Or use Services GUI:
# services.msc → PostgreSQL → Start
```

---

### Issue #4: Permission Errors

**Error:**
```
EPERM: operation not permitted
```

**Fix:**
Run PowerShell or CMD **as Administrator**

```powershell
# Right-click PowerShell
# → "Run as Administrator"

# Then navigate to project
cd D:\path\to\hapas_ecommerce
npm run compile:windows
```

---

### Issue #5: Long Path Names

**Error:**
```
ENAMETOOLONG: name too long
```

**Fix:**
Enable long path support in Windows:

```powershell
# Run as Administrator
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" `
  -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force

# Or via Group Policy:
# gpedit.msc → Computer Config → Administrative Templates
# → System → Filesystem → Enable Win32 long paths
```

Or clone to a shorter path:
```powershell
# ❌ Too long
D:\Very\Long\Path\With\Many\Folders\hapas_ecommerce

# ✅ Better
D:\Projects\hapas
```

---

## 📋 Recommended Windows Workflow

### Development

```powershell
# Daily workflow
npm run dev  # Start server

# If you modify TypeScript/SCSS files:
npm run compile:windows  # Recompile
npm run dev              # Restart server
```

### Production Build

```powershell
# Clean build
npm run clean
npm run compile:windows
npm run build
npm run start
```

### Database Reset

```powershell
# Reset database (DESTRUCTIVE!)
$env:CONFIRM_DELETE="yes"
node scripts/clean-all-data.js
node scripts/kias-migration-complete.js
```

---

## 🛠️ Useful Commands

### Clean Everything
```powershell
npm run clean        # Remove dist/ folders + webpack cache
npm run clean:cache  # Remove ONLY webpack cache (.evershop)
```

### Understanding Cache Folders

**`.evershop/` folder:**
- Webpack build cache (bundles for dev/prod)
- Image optimization cache
- Build artifacts

**When to clean:**
```powershell
# Symptoms that need cache clean:
# - White screen / blank page
# - "Cannot find module" errors (SCSS, JS)
# - Changes not reflected in browser
# - Switching between macOS and Windows
# - After pulling major updates

# Solution:
npm run clean        # Clean everything
npm run compile:windows
npm run dev          # Rebuilds cache fresh
```

### Rebuild from Scratch
```powershell
npm run clean
npm run compile:windows
npm run compile:db
npm run compile:extensions
```

### Check File Existence
```powershell
# Verify SCSS files
dir /s packages\evershop\dist\*.scss

# Count SCSS files
(dir /s packages\evershop\dist\*.scss).Count
# Should be > 0
```

### View Logs
```powershell
# Server logs
npm run dev 2>&1 | Tee-Object -FilePath dev.log

# Build logs
npm run build 2>&1 | Tee-Object -FilePath build.log
```

---

## 💡 Pro Tips for Windows Development

### 1. Use PowerShell 7+
```powershell
# Install PowerShell 7
winget install Microsoft.PowerShell
```

### 2. Configure Git for Windows Paths
```powershell
git config --global core.autocrlf true  # Handle line endings
git config --global core.longpaths true # Support long paths
```

### 3. Use Windows Terminal
Modern terminal with better Unicode support:
```powershell
winget install Microsoft.WindowsTerminal
```

### 4. Set Execution Policy (if needed)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 5. Environment Variables
```powershell
# View all Node/npm env vars
Get-ChildItem Env: | Where-Object Name -like "*NODE*"

# Set custom variables
$env:NODE_ENV="development"
$env:DEBUG="evershop:*"
```

---

## 🔍 Troubleshooting Checklist

Before asking for help, verify:

- [ ] Node.js version ≥ 18: `node --version`
- [ ] npm version ≥ 9: `npm --version`
- [ ] PostgreSQL running: `docker ps` or `services.msc`
- [ ] Compiled packages exist: `dir packages\evershop\dist`
- [ ] SCSS files copied: `dir packages\evershop\dist\**\*.scss`
- [ ] Extensions compiled: `dir extensions\hapas-homepage\dist`
- [ ] No permission errors: Run as Administrator
- [ ] Path not too long: Use short project path

---

## 📞 Getting Help

If issues persist:

1. **Check SETUP.md** - Main setup guide
2. **Review error messages** - Often point to exact problem
3. **Clean and rebuild:**
   ```powershell
   npm run clean
   npm run compile:windows
   ```
4. **Verify file structure:**
   ```powershell
   tree /F packages\evershop\dist\components\common
   ```

---

## 🎯 Success Indicators

You're ready when:

✅ `npm run compile:windows` completes without errors
✅ `packages\evershop\dist\` contains `.js` and `.scss` files
✅ `npm run dev` starts server on `http://localhost:3000`
✅ Homepage loads without white screen
✅ Browser console shows no errors

---

**Last Updated:** October 9, 2025  
**Tested on:** Windows 10/11, Node.js 18-22, PowerShell 7  
**Maintained by:** HAPAS Development Team

