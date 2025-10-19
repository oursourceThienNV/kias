# 🗄️ Database Administration Setup

Quick reference cho việc quản lý PostgreSQL database trong HAPAS E-commerce project.

---

## ⚡ Quick Start (TL;DR)

```bash
# Start pgweb database admin
npm run db:admin

# Access at http://localhost:8081
# Username: hapas
# Password: hapasdev123
# Database: hapas_ecommerce

# Stop when done
npm run db:admin:stop
```

---

## 📋 Available Commands

| Command | Description | URL |
|---------|-------------|-----|
| `npm run db:admin` | Start pgweb (lightweight) | http://localhost:8081 |
| `npm run db:admin:stop` | Stop pgweb | - |
| `npm run db:admin:supabase` | Start Supabase Studio* | http://localhost:3002 |
| `npm run db:admin:prod` | Production pgweb (localhost only) | http://localhost:8081 |

\* *Requires uncommenting services in `docker-compose.dev.yml`*

---

## 🎯 Which Tool to Use?

### pgweb (Default - Recommended)
- ✅ **Use when:** Quick data browsing, running queries, daily dev work
- ✅ **Pros:** Instant start, lightweight (~20MB), fast
- ✅ **Setup:** Zero config, just run

### Supabase Studio (Optional)
- ✅ **Use when:** Need schema visualization, team demos, exploring relationships
- ✅ **Pros:** Beautiful UI, ER diagrams, better UX
- ❌ **Cons:** Heavier (~200MB), requires config change

---

## 🚀 Setup Instructions

### Option 1: pgweb (Zero Config)

Already configured! Just run:
```bash
npm run db:admin
```

That's it! 🎉

### Option 2: Supabase Studio

**Step 1:** Edit `docker-compose.dev.yml`

Find lines 70-108 and uncomment (remove `#`):

```yaml
  # postgres-meta:
  #   image: supabase/postgres-meta:v0.68.0
```

Change to:

```yaml
  postgres-meta:
    image: supabase/postgres-meta:v0.68.0
```

Do the same for `supabase-studio` service.

**Step 2:** Start services
```bash
npm run db:admin:supabase
```

**Step 3:** Access
```
http://localhost:3002
```

---

## 📊 Integration with Docker Compose

### Development Stack

```bash
# Start everything (app + database + pgweb)
docker-compose -f docker-compose.dev.yml --profile tools up -d

# Services running:
# - hapas-app-dev:    http://localhost:3001
# - hapas-database:   postgresql://localhost:5433
# - pgweb:            http://localhost:8081
```

### Database Only

```bash
# Just database + admin tool
docker-compose -f docker-compose.dev.yml up -d hapas-database
docker-compose -f docker-compose.dev.yml --profile tools up -d pgweb
```

---

## 🔧 Common Tasks

### Browse Tables
1. Open http://localhost:8081
2. Click table name in left sidebar
3. View/edit data

### Run SQL Queries
1. Click "Query" tab
2. Type your SQL:
   ```sql
   SELECT * FROM products WHERE status = 1 LIMIT 10;
   ```
3. Click "Run Query"

### Export Data
1. Run your query
2. Click "Export" button
3. Choose CSV or JSON

### Check Database Size
```sql
SELECT 
    pg_size_pretty(pg_database_size('hapas_ecommerce')) as size;
```

### Recent Orders
```sql
SELECT 
    order_number,
    customer_full_name,
    grand_total,
    created_at
FROM "order"
ORDER BY created_at DESC
LIMIT 20;
```

---

## 🔐 Production Notes

**⚠️ WARNING:** Production pgweb is ONLY accessible via SSH tunnel!

```bash
# On local machine
ssh -L 8081:localhost:8081 user@production-server

# In another terminal (on production server)
npm run db:admin:prod

# Access on local browser
open http://localhost:8081

# IMPORTANT: Stop after use
docker-compose -f docker-compose.prod.yml stop pgweb
```

**Security Features in Production:**
- ✅ Bound to `127.0.0.1` only (not `0.0.0.0`)
- ✅ `restart: "no"` (won't auto-start)
- ✅ Requires `--profile admin-tools` to start
- ✅ Designed for temporary maintenance access

---

## 🆚 Tool Comparison

| Feature | pgweb | Supabase Studio |
|---------|-------|-----------------|
| **Resource Usage** | 20 MB | 200 MB |
| **Setup Time** | 0 min | 5 min |
| **UI Style** | Functional | Modern |
| **Query Editor** | Basic | Advanced |
| **Schema Viz** | ❌ | ✅ |
| **ER Diagrams** | ❌ | ✅ |
| **Speed** | Fast | Moderate |
| **Best For** | Daily tasks | Schema exploration |

---

## 📁 Architecture

```
Docker Compose Setup:
├─ docker-compose.dev.yml (Development)
│  ├─ hapas-app-dev (EverShop app)
│  ├─ hapas-database (PostgreSQL)
│  ├─ pgweb (profile: tools)
│  └─ supabase-studio* (profile: supabase)
│
└─ docker-compose.prod.yml (Production)
   ├─ hapas-app (EverShop app)
   ├─ hapas-database (PostgreSQL)
   └─ pgweb (profile: admin-tools, localhost only)

* Optional - requires uncommenting
```

---

## 🐛 Troubleshooting

### pgweb can't connect to database

```bash
# 1. Check database is running
docker-compose -f docker-compose.dev.yml ps

# 2. Wait for health check
# Status should show "healthy" not "starting"

# 3. Check database logs
docker logs hapas-ecommerce-db

# 4. Restart if needed
docker-compose -f docker-compose.dev.yml restart hapas-database

# 5. Try pgweb again
npm run db:admin
```

### Port already in use

```bash
# Find process using port 8081
lsof -i :8081

# Kill it
kill -9 <PID>

# Or change port in docker-compose.dev.yml:
# ports:
#   - "8082:8081"
```

### Connection refused

Check your database is accessible:
```bash
# From host machine
psql postgres://hapas:hapasdev123@localhost:5433/hapas_ecommerce -c "SELECT version();"

# If this works, pgweb should work too
```

---

## 📚 Documentation Links

- **Quick Start:** [DATABASE-ADMIN-QUICK-START.md](./docs/DATABASE-ADMIN-QUICK-START.md)
- **Full Comparison:** [DATABASE-ADMIN-TOOLS-COMPARISON.md](./docs/DATABASE-ADMIN-TOOLS-COMPARISON.md)
- **pgweb GitHub:** https://github.com/sosedoff/pgweb
- **Supabase Self-Hosting:** https://supabase.com/docs/guides/self-hosting

---

## ✅ Summary

**For most developers:**
```bash
npm run db:admin  # ← Use this!
```

**For schema exploration:**
```bash
# Uncomment Supabase in docker-compose.dev.yml, then:
npm run db:admin:supabase
```

**For production maintenance:**
```bash
# SSH tunnel first, then:
npm run db:admin:prod
```

---

**Created:** October 9, 2025  
**Team:** HAPAS E-commerce Development  
**Status:** Production Ready ✅

