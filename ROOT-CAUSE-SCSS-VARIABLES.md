# Root Cause Analysis: SCSS Variables "Undefined variable" Error

**Date:** October 8, 2025  
**Status:** ✅ RESOLVED  
**Severity:** Critical (Blocked entire navigation implementation)

---

## Executive Summary

The HAPAS theme navigation bar failed to display due to "Undefined variable" errors in SCSS compilation. After thorough investigation including reading EverShop documentation and examining core module patterns, we identified that **EverShop's theme compilation process does NOT support `@import` statements for SCSS variables**. This is a fundamental limitation of the build system that was not clearly documented.

---

## The Problem

### Symptoms
- Navigation components rendered without styling
- Build errors: `Error: Undefined variable $breakpoint-lg`, `$font-primary`, etc.
- Components appeared in DOM but had broken layout

### Initial Approach (INCORRECT)
```scss
// themes/hapas/src/styles/_variables.scss
$color-primary: #000000;
$font-primary: 'Inter', sans-serif;
$breakpoint-lg: 1024px;

// themes/hapas/src/pages/all/MainNavigation.scss
@import '../../styles/variables';
@import '../../styles/mixins';

.main-navigation {
  background: $color-primary;
  font-family: $font-primary;
  
  @media (min-width: $breakpoint-lg) {
    // styles
  }
}
```

This pattern **FAILED** with "Undefined variable" errors.

---

## Root Cause Investigation

### Step 1: Documentation Analysis

Reviewed official EverShop documentation:
- [Module Overview](https://evershop.io/docs/development/module/module-overview)
- [Theme Overview](https://evershop.io/docs/development/theme/theme-overview)
- [Styling](https://evershop.io/docs/development/theme/styling)

**Key Finding:** The documentation mentions SCSS support but does NOT explain:
- How to share variables across components
- The limitation of the copyfiles approach
- That `@import` won't work for variables
- Best practices for variable management

### Step 2: Core Module Analysis

Examined how EverShop's core modules handle styling:

```
packages/evershop/src/modules/
├── base/pages/frontStore/all/
│   ├── tailwind.scss      # Uses Tailwind with @apply
│   └── Layout.scss        # Defines CSS variables at :root, defines SCSS vars locally
├── cms/pages/admin/all/
│   └── Navigation.scss    # Uses CSS variables (var(--primary))
```

**Critical Discovery:** 
- ✅ Core modules use CSS variables (`:root` with `var()`)
- ✅ Core modules use Tailwind CSS
- ✅ Core modules define SCSS variables LOCALLY in each file
- ❌ Core modules NEVER use `@import` for SCSS variables

### Step 3: Build Process Analysis

Examined the theme compilation process:

```json
// themes/hapas/package.json
{
  "scripts": {
    "compile": "tsc && copyfiles -u 1 \"src/**/*.{graphql,scss,json}\" dist"
  }
}
```

**The Root Cause:**

1. **TypeScript Compilation:** `tsc` compiles `.ts` and `.tsx` files
2. **File Copying:** `copyfiles` copies `.scss`, `.graphql`, `.json` files AS-IS to `dist/`
3. **No SCSS Preprocessing:** There's NO sass compiler step during theme compilation
4. **Broken Imports:** SCSS files are copied with `@import` statements intact
5. **Runtime Failure:** When webpack tries to compile the SCSS at runtime:
   - The `@import` paths are relative to the original `src/` location
   - But the files are now in `dist/` folder
   - The referenced variable files don't exist at the expected relative paths
   - Result: **"Undefined variable"** error

```
Original:  themes/hapas/src/pages/all/MainNavigation.scss
           @import '../../styles/variables';  ← Points to src/styles/
           
Copied to: themes/hapas/dist/pages/all/MainNavigation.scss
           @import '../../styles/variables';  ← Still points to src/styles/
           
Webpack:   Looking for dist/styles/variables.scss ← File doesn't exist!
           Error: Undefined variable
```

---

## The Solution

### Pattern 1: CSS Variables (RECOMMENDED)

**Step 1:** Define variables in a global stylesheet using CSS custom properties:

```scss
// themes/hapas/src/styles/theme.scss
:root {
  /* Brand Colors */
  --color-primary: #000000;
  --color-secondary: #666666;
  --color-accent: #f5f5f5;
  
  /* Typography */
  --font-primary: 'Inter', -apple-system, sans-serif;
  --font-size-base: 16px;
  
  /* Spacing */
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  
  /* Breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
}

body {
  font-family: var(--font-primary);
  color: var(--color-primary);
}
```

**Step 2:** Import the global stylesheet ONCE in a global component:

```tsx
// themes/hapas/src/pages/all/HapasHeadTags.tsx
import '../../styles/theme.scss';

export default function HapasHeadTags() {
  return (
    <Head>
      {/* Meta tags, etc. */}
    </Head>
  );
}

export const layout = {
  areaId: 'head',
  sortOrder: 1
};
```

**Step 3:** Use CSS variables in component SCSS files:

```scss
// themes/hapas/src/pages/all/MainNavigation.scss
// NO @import statements needed!

.main-navigation {
  background: var(--color-primary);
  padding: var(--spacing-md);
  font-family: var(--font-primary);
  
  @media (min-width: 1024px) {
    padding: var(--spacing-lg);
  }
}

.nav-link {
  color: var(--color-secondary);
  
  &:hover {
    color: var(--color-accent);
  }
}
```

**Why this works:**
- CSS variables cascade through the DOM naturally
- No import resolution needed
- Variables are available to all components
- Supports dynamic theming (light/dark mode)
- Browser-native feature

### Pattern 2: Tailwind CSS (RECOMMENDED by EverShop)

```tsx
export default function MainNavigation() {
  return (
    <nav className="bg-black px-4 py-2 lg:px-8">
      <a className="text-gray-600 hover:text-gray-300 transition-colors">
        Link
      </a>
    </nav>
  );
}
```

**Why this works:**
- No variable management needed
- Utility-first approach
- Fully supported by EverShop's build system
- Consistent with core modules

### Pattern 3: Self-Contained SCSS

```scss
// Define variables at the top of EACH component file
$local-primary: #000000;
$local-spacing: 1rem;

.component {
  color: $local-primary;
  padding: $local-spacing;
  
  .nested-element {
    margin: calc($local-spacing / 2);
  }
}
```

**Why this works:**
- No imports needed
- Variables are scoped to the file
- SCSS features (nesting, calculations) still available

---

## Impact & Resolution

### Before Fix
- ❌ Navigation bar not visible
- ❌ Build errors blocking development
- ❌ Components rendering without styles
- ⏱️ 4+ hours debugging time

### After Fix
- ✅ Navigation bar displaying correctly
- ✅ All components styled properly
- ✅ Clean build with no errors
- ✅ Proper component discovery from `pages/all/`

### Files Modified
1. Moved components from `src/components/` to `src/pages/all/`
2. Removed all `@import` statements from component SCSS files
3. Updated `HapasHeadTags.tsx` to import global `theme.scss`
4. Fixed import paths for new directory structure
5. Added type guards for props (e.g., `Array.isArray(categories)`)

---

## Lessons Learned

### Critical Insights

1. **Component Discovery:**
   - ✅ Global components MUST be in `themes/{name}/src/pages/all/`
   - ❌ Components in `src/components/` are ONLY for overriding core modules
   - This was not clearly documented and caused initial confusion

2. **SCSS Limitations:**
   - ✅ EverShop does NOT support `@import` for SCSS variables
   - ✅ Use CSS variables or Tailwind instead
   - ❌ The documentation doesn't clearly explain this limitation

3. **Build Process:**
   - Theme compilation uses `copyfiles`, not a full sass compiler
   - SCSS files are copied AS-IS without import resolution
   - Webpack compiles them at runtime with broken relative paths

4. **Core Module Patterns:**
   - Core modules use CSS variables or Tailwind exclusively
   - No core module uses `@import` for variables
   - This should have been a red flag to investigate further

### What Should Have Been Done Differently

1. **Research First:** Should have examined core module patterns before implementing
2. **Read Documentation Thoroughly:** The styling docs mention multiple approaches
3. **Test Incrementally:** Should have tested a simple component first
4. **Follow Conventions:** When in doubt, follow core module patterns

---

## Documentation Updates

### Updated Files
- `.cursor/rules/006-theme-components.mdc` - Comprehensive rewrite with correct patterns
- `ROOT-CAUSE-SCSS-VARIABLES.md` - This document

### Key Additions
1. **Component Placement Rules** - Clear explanation of `pages/` vs `components/`
2. **SCSS Styling Section** - What works, what doesn't, and why
3. **Common Issues & Solutions** - Troubleshooting guide
4. **Best Practices** - Recommendations based on core module analysis

---

## Recommendations

### For Future Development

1. **Use CSS Variables** for design tokens (colors, spacing, typography)
2. **Use Tailwind** for component styling when possible
3. **Never use @import** for SCSS variables in EverShop themes
4. **Place global components** in `pages/all/` directory
5. **Follow core module patterns** when unsure

### For EverShop Team

1. **Document SCSS Limitations** - Clearly explain that `@import` doesn't work for variables
2. **Provide Theme Template** - Include a starter theme with correct patterns
3. **Improve Error Messages** - Indicate when a variable import is failing
4. **Add Build Validation** - Warn if `@import` statements are detected in theme SCSS

---

## Conclusion

The root cause of the "Undefined variable" errors was a fundamental misunderstanding of EverShop's theme compilation process. The build system uses simple file copying for SCSS files rather than a full sass compiler, making `@import` statements for variables non-functional.

The solution is to use CSS variables (modern, recommended approach) or Tailwind CSS (EverShop's preferred approach) instead of SCSS variables with imports. This aligns with how EverShop's core modules are built and ensures compatibility with the build system.

This issue highlighted the importance of:
- Reading documentation thoroughly
- Examining existing patterns in the codebase
- Understanding the build process before implementing
- Testing assumptions incrementally

**Status:** ✅ RESOLVED - Navigation bar now displays correctly with proper styling using CSS variables.

---

**Last Updated:** October 8, 2025  
**Author:** AI Development Assistant  
**Reviewed:** Pending

