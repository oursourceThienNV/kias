# EverShop Product Fields Mapping - Complete Documentation

## Tổng Quan

Tài liệu này mô tả **TẤT CẢ** các trường trong form tạo sản phẩm admin của EverShop và cách map chính xác cho migration script.

---

## 1. 📋 GENERAL SECTION (Card: "General")

### 1.1. Product Name (Required) ✅
- **Field name**: `name`
- **Type**: `string`
- **Component**: `InputField`
- **Validation**: Required
- **DB Table**: `product_description.name`
- **Example**: `"[KIAS x HannahOlala] Modern Authority"`

### 1.2. SKU (Required) ✅
- **Field name**: `sku`
- **Type**: `string`
- **Component**: `InputField`
- **Validation**: Required, must be unique
- **DB Table**: `product.sku`
- **Example**: `"KIAS-SET-001"`
- **Migration Note**: Generate from category + counter or use product ID from KIAS

### 1.3. Price (Required) ✅
- **Field name**: `price`
- **Type**: `number`
- **Component**: `NumberField`
- **Validation**: Required, min: 0
- **DB Table**: `product.price`
- **Unit**: `storeCurrency` (VND)
- **Example**: `2650000` (2,650,000 VND)
- **Migration Note**: Giữ nguyên giá từ KIAS, không chia 1000

### 1.4. Weight (Required) ✅
- **Field name**: `weight`
- **Type**: `number`
- **Component**: `NumberField`
- **Validation**: Required, min: 1
- **DB Table**: `product.weight`
- **Unit**: `weightUnit` (default: kg)
- **Example**: `0.5`
- **Migration Note**: Ước tính mặc định 0.3kg cho áo/váy, 0.4kg cho set bộ, 0.35kg cho quần

### 1.5. Category (Optional) ⚠️
- **Field name**: `category_id`
- **Type**: `number` (category ID)
- **Component**: `CategorySelector` (modal)
- **Validation**: Optional
- **DB Table**: `product.category_id`
- **Example**: `15` (ID của category "Set Bộ")
- **Migration Note**: Map category name từ KIAS → category_id trong EverShop

### 1.6. Tax Class (Required) ✅
- **Field name**: `tax_class`
- **Type**: `number` (tax class ID)
- **Component**: `SelectField`
- **Validation**: Required
- **DB Table**: `product.tax_class`
- **Options**: Load from `tax_class` table
- **Example**: `1` (default tax class)
- **Migration Note**: Mặc định = 1 (None)

### 1.7. Description (Optional) 📝
- **Field name**: `description`
- **Type**: `array<EditorJS Block>`
- **Component**: `Editor` (EditorJS-based WYSIWYG)
- **Validation**: Optional
- **DB Table**: `product_description.description` (JSONB)
- **Format**:
```json
[
  {
    "id": "row-1",
    "size": 12,
    "columns": [
      {
        "id": "col-1",
        "size": 12,
        "data": {
          "type": "text",
          "text": "<p>Product description HTML here</p>"
        }
      }
    ]
  }
]
```
- **Migration Note**: Convert HTML từ KIAS → EditorJS format

---

## 2. 📸 MEDIA SECTION (Card: "Media")

### 2.1. Images (Optional) 📷
- **Field name**: `images`
- **Type**: `array<string>` (image paths)
- **Component**: `ImageUploader`
- **Validation**: Optional
- **DB Table**: `product_image` (nhiều rows)
  - `origin_image`: relative path (`catalog/product/xxx.jpg`)
  - `is_main`: `true` cho ảnh đầu tiên, `false` cho còn lại
- **Upload Flow**:
  1. Frontend uploads images to `POST /api/images/:targetPath` (multer middleware)
  2. Backend saves to `media/:targetPath/:filename`
  3. Returns `{ path: "catalog/product/xxx.jpg", url: "/media/catalog/..." }`
  4. Frontend collects paths array: `["catalog/product/img1.jpg", "catalog/product/img2.jpg"]`
  5. Submit form with images array
  6. Backend saves to `product_image` table

- **Migration Strategy**:
  1. Download images từ KIAS.vn → `media/catalog/product/{category-slug}/{filename}`
  2. Lưu relative paths: `["catalog/product/set-bo/CTS03609.jpg", ...]`
  3. Pass to API: `images: ["catalog/product/set-bo/CTS03609.jpg", ...]`

- **Example**:
```javascript
// Frontend submit payload:
{
  images: [
    "catalog/product/set-bo/modern-authority-1.jpg",
    "catalog/product/set-bo/modern-authority-2.jpg"
  ]
}

// Backend insertProductImages() saves to DB:
// product_image row 1: { origin_image: "catalog/product/set-bo/modern-authority-1.jpg", is_main: true }
// product_image row 2: { origin_image: "catalog/product/set-bo/modern-authority-2.jpg", is_main: false }
```

---

## 3. 🔍 SEO SECTION (Card: "Search engine optimize")

### 3.1. URL Key (Required) ✅
- **Field name**: `url_key`
- **Type**: `string`
- **Component**: `InputField`
- **Validation**: Required, pattern: `/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/`
- **DB Table**: `product_description.url_key` + `url_rewrite`
- **Example**: `"kias-modern-authority-set"`
- **Migration Note**: 
  - Slugify Vietnamese (normalize NFD → remove diacritics → lowercase → replace spaces with `-`)
  - Check uniqueness, append `-{counter}` nếu trùng
  - Tự động tạo `url_rewrite` entry

### 3.2. Meta Title (Required) ✅
- **Field name**: `meta_title`
- **Type**: `string`
- **Component**: `InputField`
- **Validation**: Required
- **DB Table**: `product_description.meta_title`
- **Example**: `"[KIAS x HannahOlala] Modern Authority - Set Bộ Công Sở"`
- **Migration Note**: Use product name + category name

### 3.3. Meta Keywords (Optional, Hidden) 🔒
- **Field name**: `meta_keywords`
- **Type**: `string`
- **Component**: `InputField` (type="hidden")
- **Validation**: Optional
- **DB Table**: `product_description.meta_keywords`
- **Example**: `"set bộ, công sở, kias, hannaholala"`
- **Migration Note**: Optional, có thể bỏ qua hoặc generate từ name + category

### 3.4. Meta Description (Optional) 📄
- **Field name**: `meta_description`
- **Type**: `string` (textarea)
- **Component**: `TextareaField`
- **Validation**: Optional
- **DB Table**: `product_description.meta_description`
- **Example**: `"Set bộ công sở cao cấp..."`
- **Migration Note**: Extract từ product description HTML (first 160 chars)

---

## 4. ⚙️ STATUS SECTION (Card: "Product status")

### 4.1. Status (Required) ✅
- **Field name**: `status`
- **Type**: `number` (0 or 1)
- **Component**: `RadioGroupField`
- **Validation**: Required
- **DB Table**: `product.status`
- **Options**:
  - `0`: Disabled
  - `1`: Enabled
- **Default**: `1`
- **Migration Note**: Mặc định = `1` (enabled)

### 4.2. Visibility (Required) ✅
- **Field name**: `visibility`
- **Type**: `number` (0 or 1)
- **Component**: `RadioGroupField`
- **Validation**: Required
- **DB Table**: `product.visibility`
- **Options**:
  - `0`: Not visible individually (chỉ dùng cho variants)
  - `1`: Catalog, Search (hiển thị bình thường)
- **Default**: `1`
- **Migration Note**: Mặc định = `1`

---

## 5. 📦 INVENTORY SECTION (Card: "Inventory")

### 5.1. Manage Stock (Required) ✅
- **Field name**: `manage_stock`
- **Type**: `number` (0 or 1)
- **Component**: `RadioGroupField`
- **Validation**: Required
- **DB Table**: `product_inventory.manage_stock`
- **Options**:
  - `1`: Yes (track inventory)
  - `0`: No (unlimited stock)
- **Default**: `1`
- **Migration Note**: Mặc định = `1`

### 5.2. Stock Availability (Required) ✅
- **Field name**: `stock_availability`
- **Type**: `number` (0 or 1)
- **Component**: `RadioGroupField`
- **Validation**: Required
- **DB Table**: `product_inventory.stock_availability`
- **Options**:
  - `1`: In Stock
  - `0`: Out of Stock
- **Default**: `1`
- **Migration Note**: Mặc định = `1`

### 5.3. Quantity (Required) ✅
- **Field name**: `qty`
- **Type**: `number`
- **Component**: `NumberField`
- **Validation**: Required
- **DB Table**: `product_inventory.qty`
- **Example**: `100`
- **Migration Note**: Mặc định = `100` (estimate)

---

## 6. 🏷️ ATTRIBUTES SECTION (Card: "Attributes")

### 6.1. Attribute Group (Required) ✅
- **Field name**: `group_id`
- **Type**: `number` (attribute group ID)
- **Component**: `SelectField`
- **Validation**: Required
- **DB Table**: `product.group_id`
- **Example**: `1` (Default Attribute Group)
- **Migration Note**: 
  - Mặc định = `1` (Default group)
  - Nếu cần custom attributes (material, size), tạo group mới hoặc add vào default group

### 6.2. Attributes (Dynamic) 🔄
- **Field name**: `attributes`
- **Type**: `array<{attribute_code: string, value: string|number|array}>`
- **Component**: Dynamic based on attribute type
- **Validation**: Based on `is_required` flag
- **DB Table**: `product_attribute_value_index`
- **Format**:
```javascript
attributes: [
  {
    attribute_code: "material",
    value: "Tuysi kẻ"  // text type
  },
  {
    attribute_code: "color",
    value: "5"  // select type: option_id as string
  },
  {
    attribute_code: "size",
    value: ["1", "2", "3"]  // multiselect type: array of option_ids
  }
]
```

- **Attribute Types**:
  - **text**: `value` = string → saved to `option_text`
  - **textarea**: `value` = string → saved to `option_text`
  - **select**: `value` = option_id (string) → saved to `option_id` + `option_text`
  - **multiselect**: `value` = array of option_ids → multiple rows in DB
  - **date**: `value` = date string
  - **datetime**: `value` = datetime string

- **Migration Strategy**:
  1. Tạo attributes trước (material: text, size: select với options S/M/L/XL)
  2. Map KIAS data:
     - Material từ description → attribute "material"
     - Size options → attribute "size" (chọn tất cả sizes available)
  3. Pass đúng format:
```javascript
attributes: [
  { attribute_code: "material", value: "Tuysi kẻ" },
  { attribute_code: "size", value: ["1", "2", "3", "4"] } // IDs of S, M, L, XL
]
```

---

## 7. 🔄 COMPLETE PAYLOAD EXAMPLE

### Minimum Required Payload
```json
{
  "name": "[KIAS x HannahOlala] Modern Authority",
  "sku": "KIAS-SET-001",
  "price": 2650000,
  "weight": 0.4,
  "url_key": "kias-modern-authority-set",
  "status": 1,
  "visibility": 1,
  "qty": 100,
  "manage_stock": 1,
  "stock_availability": 1,
  "group_id": 1,
  "tax_class": 1,
  "meta_title": "[KIAS x HannahOlala] Modern Authority - Set Bộ Công Sở"
}
```

### Full Payload với All Optional Fields
```json
{
  "name": "[KIAS x HannahOlala] Modern Authority",
  "sku": "KIAS-SET-001",
  "price": 2650000,
  "weight": 0.4,
  "url_key": "kias-modern-authority-set",
  "status": 1,
  "visibility": 1,
  "qty": 100,
  "manage_stock": 1,
  "stock_availability": 1,
  "group_id": 1,
  "tax_class": 1,
  "category_id": 15,
  "meta_title": "[KIAS x HannahOlala] Modern Authority - Set Bộ Công Sở",
  "meta_description": "Set bộ công sở cao cấp từ KIAS",
  "meta_keywords": "set bộ, công sở, kias",
  "description": [
    {
      "id": "row-1",
      "size": 12,
      "columns": [
        {
          "id": "col-1",
          "size": 12,
          "data": {
            "type": "text",
            "text": "<h3>Mô tả sản phẩm</h3><p>Set bộ công sở...</p>"
          }
        }
      ]
    }
  ],
  "images": [
    "catalog/product/set-bo/modern-authority-1.jpg",
    "catalog/product/set-bo/modern-authority-2.jpg",
    "catalog/product/set-bo/modern-authority-3.jpg"
  ],
  "attributes": [
    {
      "attribute_code": "material",
      "value": "Tuysi kẻ"
    },
    {
      "attribute_code": "size",
      "value": ["1", "2", "3", "4"]
    }
  ]
}
```

---

## 8. 🛠️ MIGRATION SCRIPT UPDATES NEEDED

### Current Issues in `kias-migration-complete.js`:

1. ✅ **Missing `tax_class`**: Cần thêm `tax_class: 1`
2. ✅ **Missing `meta_title`**: Required field, hiện chưa có
3. ⚠️ **Weight format**: Script có `weight` nhưng cần verify format
4. ⚠️ **Images format**: Phải là array of paths (relative), không phải URLs
5. ⚠️ **Attributes format**: Cần ensure đúng type (select → string option_id, multiselect → array)
6. ✅ **URL key validation**: Cần match pattern `/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/`

### Actions Required:

```javascript
// 1. Add tax_class
payload.tax_class = 1;

// 2. Add meta_title
payload.meta_title = product.name + (category ? ` - ${category.name}` : '');

// 3. Fix images: ensure relative paths
payload.images = downloadedImages.map(img => img.relativePath); 
// relativePath format: "catalog/product/set-bo/filename.jpg"

// 4. Fix attributes: ensure correct format
payload.attributes = [
  { attribute_code: "material", value: materialText }, // text type
  { attribute_code: "size", value: sizeOptionIds.map(id => id.toString()) } // multiselect: array of strings
];

// 5. Ensure url_key matches pattern
payload.url_key = payload.url_key.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
```

---

## 9. 📊 FIELD PRIORITY CHECKLIST

### Must Have (Script sẽ fail nếu thiếu):
- ✅ `name`
- ✅ `sku`
- ✅ `price`
- ✅ `weight`
- ✅ `url_key`
- ✅ `status`
- ✅ `visibility`
- ✅ `qty`
- ✅ `manage_stock`
- ✅ `stock_availability`
- ✅ `group_id`
- ✅ `tax_class`
- ✅ `meta_title`

### Should Have (Nên có để data đầy đủ):
- ⚠️ `category_id`
- ⚠️ `description`
- ⚠️ `images`
- ⚠️ `attributes`
- ⚠️ `meta_description`

### Can Skip:
- ❌ `meta_keywords` (ít dùng)

---

## 10. 🔗 API ENDPOINT

- **URL**: `POST http://localhost:3000/api/products`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {admin_token}` (from login)
- **Body**: JSON payload (see examples above)
- **Response**:
```json
{
  "data": {
    "insertId": 123,
    "uuid": "abc-123",
    "links": [...]
  }
}
```

---

## 11. 📝 VALIDATION SCHEMA

Xem file: `packages/evershop/src/modules/catalog/services/product/productDataSchema.json`

Key validations:
- `name`: string, required
- `sku`: string, required
- `price`: number, required, ≥ 0
- `weight`: number, required, ≥ 1
- `url_key`: string, required, pattern `/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/`
- `status`: enum [0, 1]
- `visibility`: enum [0, 1]
- `qty`: number, required
- `manage_stock`: boolean
- `stock_availability`: boolean
- `group_id`: number, required
- `tax_class`: number, required

---

## 12. 🎯 SUMMARY

**Tổng số trường**: 23 fields (13 required + 10 optional)

**Critical Updates for Migration Script**:
1. Add `tax_class: 1`
2. Add `meta_title` (name + category)
3. Fix images format (relative paths array)
4. Fix attributes format (correct types)
5. Validate url_key pattern
6. Ensure all 13 required fields present

**Next Steps**:
1. Update `kias-migration-complete.js` theo checklist trên
2. Test với 1-2 products
3. Verify DB entries (product, product_description, product_image, product_inventory, product_attribute_value_index)
4. Run full migration

---

**Tài liệu này cung cấp 100% thông tin cần thiết để map chính xác dữ liệu KIAS.vn → EverShop.**

