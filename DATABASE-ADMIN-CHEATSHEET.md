# 🗄️ Database Admin - Cheat Sheet

## ⚡ Lệnh Thường Dùng

```bash
# START database admin UI
npm run db:admin

# STOP database admin
npm run db:admin:stop

# ACCESS
open http://localhost:8081
```

**Credentials:**
- Database: `hapas_ecommerce`
- User: `hapas`
- Password: `hapasdev123`

---

## 🎯 Quick Actions

### 1. Xem tất cả products
```sql
SELECT 
    product_id,
    sku,
    name,
    price,
    status
FROM product
ORDER BY product_id DESC
LIMIT 20;
```

### 2. Check orders hôm nay
```sql
SELECT 
    order_number,
    customer_full_name,
    grand_total,
    payment_status,
    created_at
FROM "order"
WHERE DATE(created_at) = CURRENT_DATE
ORDER BY created_at DESC;
```

### 3. Xem categories
```sql
SELECT 
    category_id,
    name,
    status,
    include_in_nav
FROM category
ORDER BY category_id;
```

### 4. Count products per category
```sql
SELECT 
    c.name as category_name,
    COUNT(pc.product_id) as product_count
FROM category c
LEFT JOIN product_category pc ON c.category_id = pc.category_id
GROUP BY c.category_id, c.name
ORDER BY product_count DESC;
```

### 5. Recent customers
```sql
SELECT 
    customer_id,
    email,
    full_name,
    status,
    created_at
FROM customer
ORDER BY created_at DESC
LIMIT 20;
```

### 6. Database size
```sql
SELECT 
    pg_size_pretty(pg_database_size('hapas_ecommerce')) as database_size,
    pg_size_pretty(pg_total_relation_size('product')) as product_table_size,
    pg_size_pretty(pg_total_relation_size('"order"')) as order_table_size;
```

---

## 🔧 Maintenance Queries

### Reset admin password
```sql
-- Update admin password (bcrypt hash for "admin123")
UPDATE admin_user 
SET password = '$2b$10$XxXxXxXxXxXxXxXxXxXxXeXxXxXxXxXxXxXxXxXxXxXxXxXxXx'
WHERE email = 'admin@hapas.local';
```

### Clear cart sessions (old carts)
```sql
DELETE FROM cart 
WHERE updated_at < NOW() - INTERVAL '30 days'
AND status = 0;
```

### Find duplicate SKUs
```sql
SELECT sku, COUNT(*) as count
FROM product
GROUP BY sku
HAVING COUNT(*) > 1;
```

### Products without images
```sql
SELECT p.product_id, p.name, p.sku
FROM product p
LEFT JOIN product_image pi ON p.product_id = pi.product_id
WHERE pi.product_image_id IS NULL
AND p.status = 1;
```

---

## 📊 Analytics Queries

### Sales by month
```sql
SELECT 
    TO_CHAR(created_at, 'YYYY-MM') as month,
    COUNT(*) as order_count,
    SUM(grand_total) as total_revenue
FROM "order"
WHERE payment_status = 'paid'
GROUP BY month
ORDER BY month DESC;
```

### Top selling products
```sql
SELECT 
    p.name,
    COUNT(oi.product_id) as times_ordered,
    SUM(oi.qty) as total_quantity
FROM order_item oi
JOIN product p ON oi.product_id = p.product_id
GROUP BY p.product_id, p.name
ORDER BY total_quantity DESC
LIMIT 10;
```

### Customer lifetime value
```sql
SELECT 
    c.email,
    c.full_name,
    COUNT(o.order_id) as order_count,
    SUM(o.grand_total) as lifetime_value
FROM customer c
LEFT JOIN "order" o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.email, c.full_name
HAVING COUNT(o.order_id) > 0
ORDER BY lifetime_value DESC
LIMIT 20;
```

---

## 🚨 Troubleshooting

### pgweb không connect được

```bash
# 1. Check database container
docker ps | grep hapas-database

# 2. Check database logs  
docker logs hapas-ecommerce-db

# 3. Restart database
docker restart hapas-ecommerce-db

# 4. Wait 10 seconds, then retry
npm run db:admin
```

### Port 8081 already in use

```bash
# Find what's using the port
lsof -i :8081

# Kill process
kill -9 <PID>

# Or change port in docker-compose.dev.yml
```

### Can't see tables

```sql
-- Check current schema
SELECT current_schema();

-- List all tables
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

---

## 📱 Mobile/Quick Reference

**Start:** `npm run db:admin`  
**URL:** `localhost:8081`  
**Stop:** `npm run db:admin:stop`

**Tables:**
- `product` - Products
- `category` - Categories  
- `"order"` - Orders (quoted!)
- `customer` - Customers
- `cart` - Shopping carts

---

## 🔗 Documentation

| Topic | File |
|-------|------|
| Quick Start | `README_DATABASE_ADMIN.md` |
| Detailed Guide | `docs/DATABASE-ADMIN-QUICK-START.md` |
| Tool Comparison | `docs/DATABASE-ADMIN-TOOLS-COMPARISON.md` |
| Setup Summary | `SETUP-SUMMARY-DATABASE-ADMIN.md` |

---

**Tip:** Bookmark http://localhost:8081 trong browser! 🔖

