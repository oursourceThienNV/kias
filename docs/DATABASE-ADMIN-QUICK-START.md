# Database Admin - Quick Start Guide

## 🚀 Sử Dụng Nhanh

### Development Environment

#### Option A: pgweb (Khuyến nghị - Simple & Fast)

```bash
# Start pgweb
npm run db:admin

# Access
open http://localhost:8081

# Stop khi xong
npm run db:admin:stop
```

#### Option B: Supabase Studio (UI đẹp hơn)

**Bước 1:** Uncomment services trong `docker-compose.dev.yml`

Tìm và bỏ comment (#) ở dòng 70-108:
```yaml
# postgres-meta:
#   image: supabase/postgres-meta:v0.68.0
#   ...

# supabase-studio:
#   image: supabase/studio:20240101-5d1ff88
#   ...
```

Thành:
```yaml
postgres-meta:
  image: supabase/postgres-meta:v0.68.0
  ...

supabase-studio:
  image: supabase/studio:20240101-5d1ff88
  ...
```

**Bước 2:** Start Supabase Studio
```bash
npm run db:admin:supabase

# Access
open http://localhost:3002
```

---

### Production Environment (⚠️ Cẩn thận!)

```bash
# CHỈ chạy tạm thời khi cần maintenance
npm run db:admin:prod

# Access ONLY via SSH tunnel:
ssh -L 8081:localhost:8081 user@production-server
# Then open http://localhost:8081 on local machine

# NHỚ stop ngay sau khi xong:
docker-compose -f docker-compose.prod.yml stop pgweb
```

---

## 📊 So Sánh Nhanh

| Tính năng | pgweb | Supabase Studio |
|-----------|-------|-----------------|
| **Setup** | Instant (npm run) | Cần uncomment config |
| **UI** | Basic | Modern & Beautiful |
| **Resources** | ~20MB | ~200MB |
| **Speed** | Rất nhanh | Hơi chậm |
| **Features** | Browse, Query, Export | + Schema viz, API docs |

---

## 🎯 Workflow Khuyến Nghị

### Cho Dev Hàng Ngày
```bash
# Buổi sáng - Start dev environment với pgweb
docker-compose -f docker-compose.dev.yml --profile tools up -d

# Có 3 services chạy:
# - hapas-app-dev (port 3001)
# - hapas-database (port 5433) 
# - pgweb (port 8081)

# Browse database khi cần
open http://localhost:8081

# Chiều tối - Stop all
docker-compose -f docker-compose.dev.yml down
```

### Khi Cần Schema Visualization
```bash
# Uncomment Supabase Studio trong docker-compose.dev.yml (1 lần)
# Sau đó:
npm run db:admin:supabase

# View schema diagrams, relationships, etc.
open http://localhost:3002
```

---

## 🔧 Common Tasks

### 1. Browse Tables
**pgweb:**
- Click table name → See data
- Click "Structure" → See schema
- Click "Content" → Browse/edit rows

**Supabase Studio:**
- Left sidebar → Tables
- Click table → Grid view
- Right panel → Schema info

### 2. Run Queries
**pgweb:**
- Click "Query" tab
- Type SQL
- Click "Run Query"
- Export as CSV/JSON

**Supabase Studio:**
- SQL Editor (icon on left)
- Type query
- Click Run
- Results in table below

### 3. Export Data
**pgweb:**
```sql
SELECT * FROM products WHERE status = 1;
-- Click "Export" → Choose CSV/JSON
```

**Supabase Studio:**
```sql
SELECT * FROM products WHERE status = 1;
-- Run → Click download icon
```

### 4. View Schema
**pgweb:**
- Click table → "Structure" tab
- See columns, indexes, constraints

**Supabase Studio:**
- Click table → "Schema" panel
- Visual representation
- Click "Relationships" → See FK connections

---

## 🐛 Troubleshooting

### pgweb không kết nối được database

```bash
# Check database đang chạy
docker-compose -f docker-compose.dev.yml ps

# Check logs
docker logs hapas-ecommerce-db

# Restart database
docker-compose -f docker-compose.dev.yml restart hapas-database

# Wait for health check
docker-compose -f docker-compose.dev.yml ps
# Wait until hapas-database shows "healthy"

# Then start pgweb
npm run db:admin
```

### Supabase Studio shows "Can't connect"

```bash
# Check postgres-meta running
docker logs hapas-supabase-meta

# Common issue: Database not ready
# Solution: Wait 10-15 seconds after database starts
docker-compose -f docker-compose.dev.yml restart postgres-meta supabase-studio
```

### Port already in use

```bash
# pgweb port 8081 conflict
lsof -i :8081
kill -9 <PID>

# Supabase Studio port 3002 conflict
lsof -i :3002
kill -9 <PID>

# Or change port in docker-compose.dev.yml:
# ports:
#   - "8082:8081"  # pgweb
#   - "3003:3000"  # supabase-studio
```

---

## 📚 Advanced Usage

### Connect from External Tools

**Connection String:**
```
Host: localhost
Port: 5433
Database: hapas_ecommerce
Username: hapas
Password: hapasdev123
SSL Mode: disable (dev) / require (prod)
```

**Tools Compatible:**
- DBeaver
- TablePlus
- DataGrip
- pgAdmin 4
- psql CLI

**Example (psql):**
```bash
psql postgres://hapas:hapasdev123@localhost:5433/hapas_ecommerce
```

---

## 🔐 Security Notes

### Development
- ✅ All ports exposed (OK cho local dev)
- ✅ Simple passwords (OK cho local dev)
- ✅ No SSL (OK cho local dev)

### Production
- ⚠️ pgweb ONLY bind to `127.0.0.1` (localhost)
- ⚠️ NEVER expose 8081 to internet
- ⚠️ Access via SSH tunnel only
- ⚠️ Start/stop as needed (not always running)
- ⚠️ Use `profiles: [admin-tools]` để tránh accidentally start

**Correct production workflow:**
```bash
# On local machine
ssh -L 8081:localhost:8081 user@production-server

# In SSH session on server
cd /path/to/hapas_ecommerce
docker-compose -f docker-compose.prod.yml --profile admin-tools up -d pgweb

# On local machine browser
open http://localhost:8081

# When done - In SSH session
docker-compose -f docker-compose.prod.yml stop pgweb
```

---

## 📖 References

- **pgweb:** https://github.com/sosedoff/pgweb
- **Supabase Studio:** https://supabase.com/docs/guides/self-hosting
- **Docker Compose Profiles:** https://docs.docker.com/compose/profiles/
- **Full Comparison:** [DATABASE-ADMIN-TOOLS-COMPARISON.md](./DATABASE-ADMIN-TOOLS-COMPARISON.md)

---

## ✅ Quick Commands Summary

```bash
# Development
npm run db:admin              # Start pgweb
npm run db:admin:stop         # Stop pgweb
npm run db:admin:supabase     # Start Supabase Studio (after uncommenting)

# Production (careful!)
npm run db:admin:prod         # Start pgweb (localhost only)

# Full stack with tools
docker-compose -f docker-compose.dev.yml --profile tools up -d

# Check status
docker-compose -f docker-compose.dev.yml ps

# View logs
docker-compose -f docker-compose.dev.yml logs -f pgweb
docker-compose -f docker-compose.dev.yml logs -f supabase-studio

# Stop all
docker-compose -f docker-compose.dev.yml down
```

---

**Created:** October 9, 2025  
**Last Updated:** October 9, 2025  
**Status:** Ready to Use

