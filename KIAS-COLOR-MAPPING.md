# KIAS Brand Color Integration - Analysis & Mapping

## Executive Summary
Replacing EverShop's default teal/green colors with KIAS brand colors extracted from https://kias.vn/

## KIAS Brand Colors (Extracted via Playwright)
- **Primary Color**: `#79192a` (RGB: 121, 25, 42) - Deep burgundy/wine red
- **Text Primary**: `rgb(0, 0, 0)` - Black
- **Text Secondary**: `rgb(153, 153, 153)` - Medium gray
- **Background**: `rgb(255, 255, 255)` - White
- **Accent Gray**: `rgba(102, 102, 102, 0.85)` - Muted gray with opacity

## Current EverShop Colors to Replace

### Primary Green/Teal: `#008060`
**Found in 13 locations:**
- `themes/hapas/src/components/admin/LoginForm.tsx` (3x) - SVG logo fills
- `packages/evershop/src/modules/auth/pages/admin/adminLogin/LoginForm.tsx` (3x) - SVG logo fills  
- `packages/evershop/src/modules/cms/services/tailwind.frontStore.config.js`
- `packages/evershop/src/modules/cms/services/tailwind.admin.config.js`
- `packages/evershop/src/modules/cms/pages/frontStore/cmsPageView/Layout.scss`
- `packages/evershop/src/modules/checkout/pages/admin/shippingSetting/shippingSetting/Zone.tsx`
- `packages/evershop/src/modules/base/pages/admin/all/Layout.scss`

### Success Green: `#10b981`
**Found in 2 locations:**
- `themes/hapas/styles/_variables.scss` - `$color-success`
- `themes/hapas/src/styles/_variables.scss` - `$color-success`

### Info Blue: `#3b82f6` 
**Found in 10 locations:**
- `themes/hapas/styles/_variables.scss` - `$color-info`
- `themes/hapas/src/styles/_variables.scss` - `$color-info`
- `packages/evershop/src/modules/cms/components/SlideshowSetting.tsx` (4x) - Button colors
- `packages/evershop/src/modules/cms/components/Slideshow.tsx` - Button background
- `packages/evershop/src/components/common/form/ReactSelectField.tsx` - Focus border
- `packages/evershop/src/components/common/form/ReactSelectCreatableField.tsx` - Focus border

## Color Mapping Strategy

### 1. Primary Actions & Brand Elements
`#008060` → `#79192a` (KIAS Primary)
- Used for: Primary buttons, active states, brand elements, logos

### 2. Success States (Keep Green Concept) 
`#10b981` → `#4ade80` (Maintain green for UX convention)
- Rationale: Success should remain green for universal UX understanding

### 3. Info/Interactive Elements
`#3b82f6` → `#79192a` (KIAS Primary)
- Used for: Interactive elements, focus states, info indicators

## Implementation Files Priority

### High Priority (Core Brand Identity)
1. **Theme SCSS Variables**: 
   - `themes/hapas/src/styles/_variables.scss` 
   - `themes/hapas/styles/_variables.scss` (duplicate - to be consolidated)

2. **Admin Login Components**:
   - `themes/hapas/src/components/admin/LoginForm.tsx`
   - `packages/evershop/src/modules/auth/pages/admin/adminLogin/LoginForm.tsx`

3. **Core CSS Variables**:
   - `themes/hapas/src/styles/theme.scss`

### Medium Priority (System Colors)  
4. **Tailwind Configs**:
   - `packages/evershop/src/modules/cms/services/tailwind.frontStore.config.js`
   - `packages/evershop/src/modules/cms/services/tailwind.admin.config.js`

5. **Layout CSS**:
   - `packages/evershop/src/modules/base/pages/admin/all/Layout.scss`
   - `packages/evershop/src/modules/cms/pages/frontStore/cmsPageView/Layout.scss`

### Low Priority (Component-Specific)
6. **CMS Components**:
   - `packages/evershop/src/modules/cms/components/SlideshowSetting.tsx`
   - `packages/evershop/src/modules/cms/components/Slideshow.tsx`

7. **Form Components**:
   - `packages/evershop/src/components/common/form/ReactSelectField.tsx`
   - `packages/evershop/src/components/common/form/ReactSelectCreatableField.tsx`

## Extended KIAS Color Palette (Generated)

Based on KIAS primary `#79192a`, generating complementary shades:

```scss
// KIAS Brand Colors
$kias-primary: #79192a;           // Main brand color
$kias-primary-light: #a5465a;     // Lighter tint for hover states  
$kias-primary-dark: #4d1019;      // Darker shade for pressed states
$kias-primary-50: rgba(121, 25, 42, 0.05);   // Very light background
$kias-primary-100: rgba(121, 25, 42, 0.1);   // Light background
$kias-primary-200: rgba(121, 25, 42, 0.2);   // Medium background
$kias-primary-500: rgba(121, 25, 42, 0.5);   // Medium overlay
$kias-primary-800: rgba(121, 25, 42, 0.8);   // Dark overlay

// Status colors (maintain UX conventions)
$kias-success: #10b981;           // Keep green for success
$kias-error: #ef4444;             // Keep red for errors  
$kias-warning: #f59e0b;           // Keep amber for warnings
$kias-info: #79192a;              // Use brand color for info
```

## Testing Plan

### Visual Regression Testing
- [ ] Admin login page
- [ ] Frontend header/navigation
- [ ] Product cards and buttons
- [ ] Form focus states
- [ ] CMS slideshow components

### Accessibility Testing  
- [ ] Color contrast ratios (WCAG AA compliance)
- [ ] Focus indicators visibility
- [ ] Text readability on brand backgrounds

### Cross-browser Testing
- [ ] Chrome, Firefox, Safari, Edge
- [ ] Mobile responsive views
- [ ] Dark mode compatibility (if applicable)

## Risk Mitigation

### Potential Issues
1. **Brand colors too dark** for certain UI elements
2. **Poor contrast** on white/light backgrounds  
3. **User confusion** if brand colors clash with UX conventions

### Solutions
1. Generate **multiple tints/shades** of KIAS primary
2. **Test contrast ratios** and adjust opacity as needed
3. **Maintain semantic colors** (green=success, red=error) for UX clarity

## Rollback Plan
All changes committed to feature branch `feature/kias-brand-colors-integration`. Easy to revert via:
```bash
git checkout main
git branch -D feature/kias-brand-colors-integration
```

---
*Generated: 2025-09-30*
*Author: Senior Developer Analysis*