# HAPAS E-commerce - Setup Guide

Complete setup guide for HAPAS E-commerce project on new machines.

---

## 🚀 Quick Start (New Machine Setup)

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- Git

### Step-by-step Installation

#### macOS / Linux

```bash
# 1. Clone repository
git clone <repository-url>
cd hapas_ecommerce

# 2. Install dependencies
npm install

# 3. Compile core packages
npm run compile       # SWC (faster)
npm run compile:db

# 4. Compile extensions (REQUIRED for production build)
npm run compile:extensions

# 5. Setup database and create admin user
npm run setup

# 6. Run development server
npm run dev
```

#### Windows (PowerShell / CMD)

```bash
# 1. Clone repository
git clone <repository-url>
cd hapas_ecommerce

# 2. Install dependencies
npm install

# 3. ⚠️ IMPORTANT: Use compile:windows for reliable SCSS file copying
npm run compile:windows
# This runs: compile:tsc + compile:db + compile:extensions

# Alternative (if above has issues):
npm run compile:tsc   # TypeScript compiler + copyfiles (more reliable on Windows)
npm run compile:db
npm run compile:extensions

# 4. Setup database and create admin user
npm run setup

# 5. Run development server
npm run dev
```

**Admin credentials:**
- Email: `admin@admin.com`
- Password: `123456a@`
- URL: `http://localhost:3000/admin`

**Common Windows Issue:**
If you see "Cannot find module './LoadingBar.scss'" → See [Issue 5](#issue-5-cannot-find-module-loadingbarscss-windows) below.

---

## 📦 Build Commands

### Development
```bash
npm run dev              # Start dev server with hot reload
```

### Production Build
```bash
# IMPORTANT: Must compile extensions first!
npm run compile:extensions   # Compile TypeScript extensions
npm run build                # Build production bundles
npm run start                # Start production server
```

---

## 🔧 Extension Development

### Why Compile Extensions?

**Background:**
- Extensions with TypeScript source (`src/`) need compilation to JavaScript (`dist/`)
- In **development mode**: EverShop compiles TypeScript on-the-fly
- In **production build**: EverShop requires pre-compiled `dist/` directory

**The Issue:**
```
❌ Extension 'hapas-homepage' must have a 'dist' directory at 
   extensions/hapas-homepage/dist. This is required for production mode.
```

**Root Cause:**
1. TypeScript extensions have `src/` but `dist/` is gitignored
2. Production build validates `dist/` directory existence
3. Build fails if `dist/` is missing

**Solution:**
```bash
# Before running npm run build, compile extensions:
npm run compile:extensions
```

### Compile Individual Extension

```bash
cd extensions/hapas-homepage
npm run build        # Compile TypeScript → JavaScript
npm run rebuild      # Clean + build
```

---

## 📁 Project Structure

```
hapas_ecommerce/
├── packages/
│   ├── evershop/           # Core EverShop (compiled to dist/)
│   └── postgres-query-builder/
├── extensions/
│   └── hapas-homepage/     # TypeScript extension
│       ├── src/            ✅ TypeScript source
│       ├── dist/           ⚠️  Compiled JS (gitignored, must build)
│       ├── package.json    ✅ Has build script
│       └── tsconfig.json   ✅ TypeScript config
├── themes/
│   └── hapas/
└── scripts/                # Migration & utility scripts
```

---

## 🐛 Common Issues

### Issue 1: Missing dist/ directory

**Error:**
```
Extension 'hapas-homepage' must have a 'dist' directory
```

**Solution:**
```bash
npm run compile:extensions
```

### Issue 2: Scripts not executing on Windows

**Error:**
```
Error: Cannot find module 'D:\...\run'
```

**Cause:** Wrong command syntax

**Solution:**
```bash
# ❌ Wrong
node run scripts/clean-all-data.js

# ✅ Correct
node scripts/clean-all-data.js
```

### Issue 3: ERR_UNSUPPORTED_ESM_URL_SCHEME on Windows

**Cause:** Windows path handling in ES modules

**Status:** ✅ Fixed in latest commits

### Issue 4: Cannot use import statement outside a module

**Error:**
```
SyntaxError: Cannot use import statement outside a module
at extensions/hapas-homepage/dist/pages/frontStore/homepage/index.js
```

**Root Cause:**
- TypeScript compiled to ES Module syntax (import/export)
- Extension package.json missing `"type": "module"`
- Node.js defaults to CommonJS, which doesn't support `import`

**Solution:**
```json
// extensions/hapas-homepage/package.json
{
  "type": "module"  // ✅ REQUIRED for ES Modules
}
```

**Status:** ✅ Fixed - Extension now properly declares ES Module type

### Issue 5: Cannot find module './LoadingBar.scss' (Windows)

**Error:**
```
Uncaught Error: Cannot find module './LoadingBar.scss'
at webpackMissingModule (LoadingBar.js:9:50)
→ White screen / Blank page
```

**Root Cause:**
- SCSS files not copied to `dist/` directory during compilation
- Webpack expects SCSS files to exist alongside JS files
- Missing `npm run compile` step OR SWC `--copy-files` not working on Windows

**Solution (Step-by-step for Windows):**

```bash
# 1. Clean existing dist
npm run clean  # or manually: rm -rf packages/evershop/dist

# 2. Compile core with SCSS files
npm run compile     # Uses SWC with --copy-files flag

# 3. If SWC doesn't copy SCSS files on Windows, use TypeScript compiler instead:
npm run compile:tsc # Uses tsc + copyfiles (more reliable on Windows)

# 4. Verify SCSS files are copied
dir packages\evershop\dist\components\common\LoadingBar.scss
# Should exist!

# 5. Now run dev or build
npm run dev
```

**Windows-specific workaround (if SWC fails):**

Always use `compile:tsc` instead of `compile` on Windows:
```bash
npm run compile:tsc   # More reliable for copying non-JS files
npm run compile:db
npm run compile:extensions
npm run dev
```

**Verification:**
```bash
# Check if SCSS files exist in dist/
find packages/evershop/dist -name "*.scss" | wc -l
# Should show multiple SCSS files (not 0!)
```

**Status:** ✅ Fixed - Use `compile:tsc` on Windows for reliable file copying

---

## 🗄️ Database

### PostgreSQL Setup (Docker - Recommended)

```bash
# Start database
docker-compose -f docker-compose.dev.yml up -d

# Connection details:
Host: localhost
Port: 5433
Database: hapas_ecommerce
User: hapas
Password: hapasdev123
```

### Manual PostgreSQL

1. Create database: `hapas_ecommerce`
2. Update `config/default.json` with connection details
3. Run `npm run setup`

---

## 📝 Migration Scripts

### Clean all data
```bash
# Requires confirmation
CONFIRM_DELETE=yes node scripts/clean-all-data.js
```

### Import KIAS.VN products
```bash
node scripts/kias-migration-complete.js
```

**Requirements:**
- EverShop running on `localhost:3000`
- Admin logged in
- Internet connection

---

## 🔐 Security Notes

⚠️ **Default credentials are for DEVELOPMENT only!**

Before production deployment:
1. Change admin email and password
2. Update database credentials
3. Set strong passwords (12+ characters)
4. Enable HTTPS
5. Review `.env` configuration

---

## 📚 Documentation

- [EverShop Docs](https://evershop.io/docs)
- [Extension Development](https://evershop.io/docs/development/module/create-your-first-extension)
- [Theme Development](https://evershop.io/docs/development/theme/theme-overview)

---

## 🆘 Support

**Common Questions:**
1. **Q:** Why do I need to compile extensions?
   **A:** Production build requires pre-compiled JavaScript. Development mode compiles on-the-fly.

2. **Q:** Can I skip `npm run compile:extensions`?
   **A:** No, if you have TypeScript extensions. Build will fail without it.

3. **Q:** Why is `dist/` not in git?
   **A:** Compiled code shouldn't be versioned. Always regenerate from source.

---

**Last Updated:** October 9, 2025  
**Version:** 1.2.2  
**Maintained by:** HAPAS Development Team

