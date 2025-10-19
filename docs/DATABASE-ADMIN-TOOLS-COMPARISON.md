# So Sánh Database Admin Tools cho HAPAS E-commerce

## TL;DR - Quick Decision Matrix

| Nhu cầu | Tool khuyến nghị | Lý do |
|---------|------------------|-------|
| **Chỉ cần browse/edit data** | **pgweb** | Nhẹ, đơn giản, đủ dùng |
| **Cần UI đẹp + schema visualization** | **Supabase Studio** | Modern UI, nhiều features |
| **Production database** | **pgAdmin 4** | Enterprise-grade, full features |
| **Mac user, sẵn sàng trả phí** | **TablePlus** | Native app, UX tốt nhất |

---

## Option 1: pgweb (Lightweight Web Client)

### ✅ Ưu điểm
- **Cực kỳ nhẹ**: Single Go binary (~15MB)
- **Zero config**: Chạy 1 lệnh là xong
- **Fast**: Response time < 100ms
- **Cross-platform**: Linux/Mac/Windows

### ❌ Nhược điểm
- UI cơ bản
- Không có schema visualization
- Features hạn chế

### 🚀 Setup
```bash
# Cách 1: Docker (khuyến nghị)
docker run -d \
  -p 8081:8081 \
  -e DATABASE_URL=postgres://hapas:hapasdev123@host.docker.internal:5433/hapas_ecommerce \
  --name hapas_pgweb \
  sosedoff/pgweb

# Access: http://localhost:8081

# Cách 2: Binary trực tiếp
brew install pgweb  # Mac
pgweb --url postgres://hapas:hapasdev123@localhost:5433/hapas_ecommerce
```

### 📊 Use Cases
- ✅ Quick data inspection
- ✅ Run ad-hoc queries
- ✅ Export data to CSV/JSON
- ✅ Debug migration scripts

---

## Option 2: Supabase Studio (Modern Web UI)

### ✅ Ưu điểm
- **Beautiful UI**: Modern, intuitive interface
- **Schema Visualization**: ER diagrams, relationships
- **Table Editor**: Grid view với validation
- **SQL Editor**: Autocomplete, syntax highlighting
- **API Explorer**: Auto-generate REST API docs

### ❌ Nhược điểm
- **Heavier**: 2 containers (studio + postgres-meta)
- **More complex**: Cần docker-compose setup
- **Overkill**: Nếu chỉ cần browse data đơn giản

### 🚀 Setup
```bash
# Start Supabase Studio
./scripts/db-admin-supabase.sh start

# Access: http://localhost:3001

# Stop when done
./scripts/db-admin-supabase.sh stop
```

### 📊 Use Cases
- ✅ Schema exploration và documentation
- ✅ Complex queries với visual builder
- ✅ Table relationships visualization
- ✅ Team collaboration (share screenshots với đẹp UI)
- ✅ Prototype realtime features

### ⚠️ Important Notes
**Setup hiện tại CHỈ bao gồm:**
- Supabase Studio (UI)
- PostgreSQL Meta API

**KHÔNG bao gồm:**
- Supabase Auth
- Supabase Storage
- Supabase Realtime
- Edge Functions

Nếu cần full stack → Xem [Full Supabase Self-Hosting](#option-4-full-supabase-stack)

---

## Option 3: pgAdmin 4 (Enterprise Tool)

### ✅ Ưu điểm
- **Feature-complete**: Mọi tính năng database admin
- **Production-ready**: Query planner, explain analyze
- **Backup/Restore**: Built-in tools
- **Security**: Role management, SSL config

### ❌ Nhược điểm
- **Heavy UI**: Desktop app style, không modern
- **Steep learning curve**: Nhiều options phức tạp
- **Slow**: UI rendering chậm với large datasets

### 🚀 Setup
```bash
docker run -d \
  -p 5050:80 \
  -e PGADMIN_DEFAULT_EMAIL=admin@hapas.local \
  -e PGADMIN_DEFAULT_PASSWORD=admin \
  --name hapas_pgadmin \
  dpage/pgadmin4

# Access: http://localhost:5050
# Login: admin@hapas.local / admin
# Add server manually
```

### 📊 Use Cases
- ✅ Production database monitoring
- ✅ Query performance tuning
- ✅ Database backup/restore
- ✅ User/role management

---

## Option 4: Full Supabase Stack (Self-Hosted)

### 📖 Khi nào cần?

**CHỈ setup full stack NẾU:**
- ✅ Cần **Realtime subscriptions** cho features như:
  - Live product reviews
  - Real-time inventory updates
  - Customer chat
  - Collaborative features
  
- ✅ Cần **Supabase Auth** cho:
  - OAuth (Google, Facebook, GitHub login)
  - Magic links (passwordless login)
  - Multi-factor authentication
  
- ✅ Cần **Edge Functions** cho:
  - Serverless background jobs
  - Webhooks processing
  - Custom API endpoints

### 🚀 Setup Guide

```bash
# 1. Clone Supabase Docker setup
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker

# 2. Copy example env
cp .env.example .env

# 3. Generate JWT secrets
# Follow: https://supabase.com/docs/guides/self-hosting/docker

# 4. Configure PostgreSQL connection
# Edit .env:
POSTGRES_HOST=host.docker.internal
POSTGRES_PORT=5433
POSTGRES_DB=hapas_ecommerce
POSTGRES_USER=hapas
POSTGRES_PASSWORD=hapasdev123

# 5. Start stack
docker-compose up -d

# Services will be available at:
# - Studio: http://localhost:3000
# - API: http://localhost:8000
# - Realtime: ws://localhost:4000
```

### 📊 Architecture

```
Full Supabase Stack:
├── Kong (API Gateway) :8000
├── GoTrue (Auth) :9999
├── PostgREST (REST API) :3001
├── Realtime (Websockets) :4000
├── Storage (S3-compatible) :5000
├── pg_meta (Metadata) :8080
├── Studio (UI) :3000
└── PostgreSQL (Database) :5432
```

### ⚠️ Integration với EverShop

**Hai cách tiếp cận:**

#### A. Hybrid Mode (Khuyến nghị)
```
EverShop: Core e-commerce (products, orders, checkout)
    ↓
Supabase: Additional features (realtime, auth)
    ↓
Shared PostgreSQL: Single source of truth
```

**Example Implementation:**
```typescript
// extensions/realtime-reviews/src/frontend/LiveReviews.tsx
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'http://localhost:8000',
  process.env.SUPABASE_ANON_KEY!
)

export function LiveReviews({ productId }) {
  useEffect(() => {
    const channel = supabase
      .channel('reviews')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'product_review',
        filter: `product_id=eq.${productId}`
      }, handleNewReview)
      .subscribe()
      
    return () => channel.unsubscribe()
  }, [productId])
}
```

#### B. Full Migration (KHÔNG khuyến nghị)
- Migrate toàn bộ backend logic sang Supabase
- Effort: 3-4 tháng
- Risk: Cao
- Benefit: Questionable

---

## Comparison Matrix

| Feature | pgweb | Supabase Studio | pgAdmin 4 | Full Supabase |
|---------|-------|-----------------|-----------|---------------|
| **Setup Time** | 1 min | 5 min | 10 min | 1-2 hours |
| **Resource Usage** | ~20MB | ~200MB | ~300MB | ~2GB |
| **UI Quality** | Basic | Modern | Desktop | Modern |
| **Learning Curve** | Flat | Easy | Steep | Moderate |
| **Schema Viz** | ❌ | ✅ | ✅ | ✅ |
| **SQL Editor** | Basic | Good | Advanced | Good |
| **Realtime** | ❌ | ❌ | ❌ | ✅ |
| **Auth Features** | ❌ | ❌ | ❌ | ✅ |
| **Production Ready** | Dev only | Dev only | ✅ | ✅ |
| **Cost** | Free | Free | Free | Free (self-host) |

---

## Recommended Workflow

### For Development

**Tuần 1-4: Start Simple**
```bash
# Use pgweb for quick tasks
docker run -d -p 8081:8081 \
  -e DATABASE_URL=postgres://hapas:hapasdev123@host.docker.internal:5433/hapas_ecommerce \
  sosedoff/pgweb
```

**Tuần 5+: Upgrade if needed**
```bash
# If team needs better UI → Switch to Supabase Studio
./scripts/db-admin-supabase.sh start
```

### For Specific Features

**Need Realtime?**
```bash
# Setup full Supabase stack
# Implement specific features incrementally:
# Week 1: Live reviews
# Week 2: Real-time inventory
# Week 3: Customer notifications
```

**Need OAuth?**
```bash
# Alternative: Add to EverShop directly
npm install passport passport-google-oauth20
# Simpler than full Supabase if ONLY need OAuth
```

---

## Decision Tree

```
Bạn cần gì?
├─ Chỉ browse/edit data?
│  └─ → pgweb (1 min setup)
│
├─ Cần UI đẹp + schema viz?
│  └─ → Supabase Studio (5 min setup)
│
├─ Cần realtime features?
│  ├─ Simple (1-2 features)
│  │  └─ → Socket.io + EverShop
│  └─ Complex (nhiều features)
│     └─ → Full Supabase stack
│
└─ Production monitoring?
   └─ → pgAdmin 4 + monitoring tools
```

---

## Next Steps

### Immediate (Hôm nay)

**Option A: Quick Start với pgweb**
```bash
docker run -d -p 8081:8081 \
  -e DATABASE_URL=postgres://hapas:hapasdev123@host.docker.internal:5433/hapas_ecommerce \
  --name hapas_pgweb \
  sosedoff/pgweb

# Test: http://localhost:8081
```

**Option B: Try Supabase Studio**
```bash
./scripts/db-admin-supabase.sh start
# Test: http://localhost:3001
```

### Short-term (Tuần tới)

1. **Evaluate**: Team dùng tool nào thoải mái hơn?
2. **Document**: Thêm vào team wiki
3. **Standardize**: Chọn 1 tool chính cho team

### Long-term (1-2 tháng)

**Nếu cần Realtime:**
1. Prototype với full Supabase stack
2. Implement 1 feature thử nghiệm (e.g., live reviews)
3. Measure performance vs benefit
4. Decide: Expand hoặc rollback

---

## FAQ

### Q: Có thể dùng cả pgweb VÀ Supabase Studio không?

**A:** Có! Không conflict. Chạy trên ports khác nhau:
- pgweb: `http://localhost:8081`
- Supabase Studio: `http://localhost:3001`

Dùng pgweb cho quick tasks, Supabase Studio cho schema exploration.

---

### Q: Self-hosted Supabase có giống cloud version không?

**A:** Tính năng tương tự, nhưng:
- ✅ Same features
- ❌ No automatic scaling
- ❌ No managed backups
- ❌ No email templates (cần config)
- ❌ Phải maintain yourself

---

### Q: Full Supabase stack conflict với EverShop không?

**A:** Không conflict NẾU dùng đúng cách:
- Supabase chạy port riêng (8000)
- EverShop chạy port 3000
- Cùng dùng 1 PostgreSQL database
- Mỗi cái handle logic riêng

**Warning:** KHÔNG dùng Supabase PostgREST làm primary API thay EverShop GraphQL → Sẽ conflict architecture.

---

### Q: Chi phí run Full Supabase stack?

**A:** Self-hosted = FREE, chỉ trả:
- Server/VPS cost
- Storage cost
- Bandwidth cost

**Resource requirements:**
- Minimum: 2GB RAM, 2 CPU cores
- Recommended: 4GB RAM, 4 CPU cores
- Storage: Tùy database size

**Dev environment:** Chạy trên laptop OK (Docker Desktop)

---

## References

- [Supabase Self-Hosting Guide](https://supabase.com/docs/guides/self-hosting)
- [pgweb Documentation](https://github.com/sosedoff/pgweb)
- [pgAdmin Documentation](https://www.pgadmin.org/docs/)
- [EverShop Documentation](https://evershop.io/docs)

---

**Last Updated:** October 9, 2025  
**Author:** HAPAS Development Team  
**Status:** Living Document

