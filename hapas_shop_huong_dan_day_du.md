# EverShop — Cẩm nang triển khai đầy đủ (Theme, Extension, Page mới, Tính năng mới, Checkout/Payment, Shipping)

> **Mục tiêu**: Tài liệu này hướng dẫn **từng bước** để bạn:
> 1) Tạo **Theme** đổi *header, footer, homepage*  
> 2) Tạo **Extension** sinh **trang mới** (ví dụ `/hapas`, `/hapas/:slug`)  
> 3) Thêm **tính năng mới** (ví dụ: “Product Comments”)  
> 4) **Sửa/tuỳ biến Checkout**, tích hợp/điều chỉnh **Payment**  
> 5) **Sửa/tuỳ biến Shipping** (tính phí, chọn phương thức, validate)
>
> Tài liệu theo đúng triết lý **Module + Theme + Extension**, **SSR React + GraphQL + Express + PostgreSQL** của EverShop. Ưu tiên **không sửa core**, mọi thay đổi nên đặt ở **theme** hoặc **extension** để dễ nâng cấp.

---

## 0) Chuẩn bị môi trường & dự án

### Yêu cầu hệ thống
- **Node.js ≥ 20**, **npm ≥ 7**
- **PostgreSQL ≥ 13**
- Git, Docker (tuỳ chọn cho local nhanh)

### Khởi tạo dự án
- Cách nhanh nhất:
  ```bash
  npx create-evershop-app my-evershop-app
  cd my-evershop-app
  ```
- Hoặc cài package:
  ```bash
  npm init -y
  npm i @evershop/evershop
  # package.json → thêm scripts:
  # "setup": "evershop install",
  # "dev": "evershop dev",
  # "build": "evershop build",
  # "start": "evershop start",
  # "user:create": "evershop user:create"
  npm run setup
  npm run dev
  ```

### Cấu trúc thư mục chuẩn (root)
```
.evershop/         # build output (auto)
.log/              # logs (auto)
config/            # cấu hình JSON (tự tạo)
extensions/        # nơi để Extension (tự tạo)
media/             # upload
themes/            # nơi để Theme (tự tạo)
```

### Cấu hình `config/default.json` (tối thiểu)
```json
{
  "shop": { "currency": "USD", "language": "en", "weightUnit": "kg" },
  "system": {
    "theme": "default",
    "extensions": []
  }
}
```
> Có thể thêm `config/production.json` để override khi chạy production. Biến môi trường cũng có thể override giá trị.

### Chạy dev / build / start
```bash
npm run dev            # hot reload
npm run build && npm start
```

---

## 1) Kiến trúc EverShop — cách đọc code

### 1.1. Pages & Route
- Mỗi **Page** là một thư mục trong:
  - `packages/<module>/pages/frontStore/<routeId>/`
  - `packages/<module>/pages/admin/<routeId>/`
- **`routeId`** = tên thư mục (chuỗi URL-safe, duy nhất).
- Mỗi page có **`route.json`** định nghĩa `path`, `methods`, (tuỳ chọn) `access`.

**Ví dụ `route.json`:**
```json
{ "methods": ["GET"], "path": "/category/:url_key" }
```

### 1.2. Middleware & Component
- **Middleware**: file **viết thường** (`index.ts`, `load.ts`…), chạy trước render. Dùng để parse params, query, kiểm tra quyền, **set context**…
- **Component React**: file **viết hoa** (`General.tsx`, `List.tsx`…), **default export** là master component.
- **Area layout**: component có thể “cắm” vào layout thông qua:
  ```ts
  export const layout = { areaId: "content", sortOrder: 10 };
  ```

### 1.3. SSR GraphQL & Context
- Trong component có thể **export** query GraphQL dạng **string** (đúng literal string) để EverShop SSR:
  ```ts
  export const query = `
    query {
      product(id: getContextValue("productId")) { name sku }
    }`;
  ```
- **Context**: truyền dữ liệu từ middleware sang GraphQL/component:
  - `setContextValue(req, "productId", id)` trong middleware
  - `getContextValue("productId")` trong `query`/resolver

### 1.4. REST API trong module/extension
- Endpoint = thư mục trong `api/<endpointId>/` có `route.json`:
  ```json
  { "methods": ["POST"], "path": "/products", "access": "private" }
  ```
- **Mặc định `access` = private** nếu không khai báo.
- Có thể thêm `payloadSchema.json` để validate với Ajv.

### 1.5. GraphQL types/resolvers
- Mỗi **type** đặt tại `graphql/types/<PascalCaseType>/` gồm:
  - `Type.graphql` (schema)
  - `Type.resolvers.ts` (resolver)

### 1.6. Events (subscribers)
- Bạn có thể subscribe các sự kiện như `order_placed`, `product_created`… tại:
  `extensions/<ext>/subscribers/<event_name>/<name>.ts`

---

## 2) Tạo Theme “hapas-theme” — đổi header, footer, homepage

> **Theme** dùng để override UI/layout trang có sẵn. Không sinh page mới.

### 2.1. Khung thư mục
```
themes/hapas-theme/
  public/
  dist/
  src/
    components/
    pages/
      all/All.tsx           # master layout toàn site (nơi đặt header/footer)
      homepage/Hero.tsx     # các block homepage
      homepage/Sections.tsx
  package.json
  tsconfig.json
```

**`package.json` (ví dụ)**:
```json
{
  "name": "hapas-theme",
  "version": "1.0.0",
  "private": true,
  "main": "dist/index.js"
}
```

### 2.2. Bật Theme
- Root `package.json` thêm workspaces (nếu dùng npm workspaces):
  ```json
  { "workspaces": ["extensions/*", "themes/*"] }
  ```
- `config/default.json`:
  ```json
  { "system": { "theme": "hapas-theme" } }
  ```
- **Build lại** sau khi đổi theme:
  ```bash
  npm run build && npm start
  ```

### 2.3. Override header/footer qua `pages/all/All.tsx`
```tsx
import React from "react";
import Area from "@components/common/Area";

export default function All() {
  return (
    <>
      <header className="hapas-header"><Area id="header" noOuter /></header>
      <main className="hapas-content"><Area id="content" noOuter /></main>
      <footer className="hapas-footer"><Area id="footer" /></footer>
    </>
  );
}
export const layout = { areaId: "body", sortOrder: 1 };
```
> Bạn có toàn quyền thiết kế header/footer ở đây. Các block con sẽ “cắm” vào `header/content/footer`.

### 2.4. Tùy biến Homepage
```tsx
// themes/hapas-theme/src/pages/homepage/Hero.tsx
export default function Hero() { return <section>Hapas Hero</section>; }
export const layout = { areaId: "content", sortOrder: 10 };

// themes/hapas-theme/src/pages/homepage/Sections.tsx
export default function Sections() { return <section>Sections</section>; }
export const layout = { areaId: "content", sortOrder: 20 };
```

---

## 3) Tạo Extension “hapas” — thêm page mới `/hapas` & `/hapas/:slug`

> **Extension** dùng để sinh page mới, thêm API, GraphQL, migration…

### 3.1. Khung thư mục
```
extensions/hapas/
  package.json
  tsconfig.json
  src/
    migration/Version-1.0.0.ts
    graphql/types/Hapa/Hapa.graphql
    graphql/types/Hapa/Hapa.resolvers.ts
    pages/frontStore/hapasList/
      route.json
      index.ts           # middleware
      List.tsx           # master component
    pages/frontStore/hapasView/
      route.json
      index.ts
      Detail.tsx
```

**Bật extension** trong `config/default.json`:
```json
{
  "system": {
    "extensions": [
      { "name": "hapas", "resolve": "extensions/hapas", "enabled": true, "priority": 10 }
    ]
  }
}
```
> Sau khi bật/tắt extension: **build lại**.

### 3.2. Khai báo Routes
- `/hapas`:
  ```json
  // extensions/hapas/src/pages/frontStore/hapasList/route.json
  { "methods": ["GET"], "path": "/hapas" }
  ```
- `/hapas/:slug`:
  ```json
  // extensions/hapas/src/pages/frontStore/hapasView/route.json
  { "methods": ["GET"], "path": "/hapas/:slug" }
  ```

### 3.3. Migration DB
```ts
// extensions/hapas/src/migration/Version-1.0.0.ts
import { PoolClient } from "pg";
export default async function (conn: PoolClient) {
  await conn.query(`
    create table if not exists hapas (
      id serial primary key,
      slug varchar(255) unique not null,
      title varchar(255) not null,
      excerpt text,
      content text,
      image_url text,
      created_at timestamptz default now()
    );
  `);
}
```

### 3.4. GraphQL
```graphql
# extensions/hapas/src/graphql/types/Hapa/Hapa.graphql
type Hapa {
  id: ID!
  slug: String!
  title: String!
  excerpt: String
  content: String
  image_url: String
  created_at: String
}

type HapaConnection {
  items: [Hapa!]!
  total: Int!
}

extend type Query {
  hapas(limit: Int = 12, offset: Int = 0, q: String): HapaConnection!
  hapaBySlug(slug: String!): Hapa
}
```

```ts
// extensions/hapas/src/graphql/types/Hapa/Hapa.resolvers.ts
import { select } from "@evershop/postgres-query-builder";

export default {
  Query: {
    hapas: async (_p, { limit, offset, q }, { pool }) => {
      const qb = select().from("hapas");
      if (q) qb.where("title", "ilike", `%${q}%`);
      qb.limit(limit).offset(offset).orderBy("created_at", "DESC");
      const items = await qb.execute(pool);
      const total = (await select("count(*) as c").from("hapas").execute(pool))[0].c;
      return { items, total: Number(total) };
    },
    hapaBySlug: async (_p, { slug }, { pool }) => {
      const rows = await select().from("hapas").where("slug", "=", slug).limit(1).execute(pool);
      return rows[0] || null;
    }
  }
};
```

### 3.5. Middleware set Context
```ts
// extensions/hapas/src/pages/frontStore/hapasList/index.ts
import { setContextValue } from "@evershop/evershop/graphql/services";
export default async (req, _res, next) => {
  setContextValue(req, "hapasListArgs", {
    limit: Number(req.query.limit ?? 12),
    offset: Number(req.query.offset ?? 0),
    q: req.query.q ?? ""
  });
  next();
};
```

```ts
// extensions/hapas/src/pages/frontStore/hapasView/index.ts
import { setContextValue } from "@evershop/evershop/graphql/services";
export default async (req, res, next) => {
  const { slug } = req.params;
  if (!slug) return res.status(404).end();
  setContextValue(req, "slug", slug);
  next();
};
```

### 3.6. Components (SSR)
```tsx
// extensions/hapas/src/pages/frontStore/hapasList/List.tsx
export default function List({ hapas }) {
  return (
    <section className="hapas-list">
      {hapas.items.map(h => (
        <article key={h.id}>
          <a href={`/hapas/${h.slug}`}>{h.title}</a>
          <p>{h.excerpt}</p>
        </article>
      ))}
    </section>
  );
}
export const layout = { areaId: "content", sortOrder: 10 };
export const query = `
  query {
    hapas(
      limit: getContextValue("hapasListArgs").limit,
      offset: getContextValue("hapasListArgs").offset,
      q: getContextValue("hapasListArgs").q
    ) { total items { id slug title excerpt image_url created_at } }
  }`;
```

```tsx
// extensions/hapas/src/pages/frontStore/hapasView/Detail.tsx
export default function Detail({ hapa }) {
  if (!hapa) return <div>Not found</div>;
  return (
    <article className="hapas-detail">
      <h1>{hapa.title}</h1>
      {hapa.image_url && <img src={hapa.image_url} alt={hapa.title} />}
      <div dangerouslySetInnerHTML={{ __html: hapa.content || "" }} />
    </article>
  );
}
export const layout = { areaId: "content", sortOrder: 10 };
export const query = `
  query { hapaBySlug(slug: getContextValue("slug")) { id slug title content image_url } }`;
```

---

## 4) Thêm tính năng mới — ví dụ “Product Comments” (Extension)

### 4.1. Khung & bật extension
```
extensions/productComment/
  src/
    migrations/Version-1.0.0.ts
    graphql/types/ProductComment/ProductComment.graphql
    graphql/types/ProductComment/ProductComment.resolvers.ts
    api/createComment/
      route.json
      save.ts
    pages/frontStore/productView/Comments.tsx
  package.json
  tsconfig.json
```
`config/default.json`:
```json
{
  "system": {
    "extensions": [
      { "name": "productComment", "resolve": "extensions/productComment", "enabled": true, "priority": 10 }
    ]
  }
}
```

### 4.2. Migration
```ts
import { PoolClient } from "pg";
export default async function (conn: PoolClient) {
  await conn.query(`
    create table if not exists product_comment(
      comment_id serial primary key,
      product_id int not null,
      author varchar(255) not null,
      body text not null,
      created_at timestamptz default now()
    );
  `);
}
```

### 4.3. REST API (tạo bình luận)
```json
// route.json
{ "methods": ["POST"], "path": "/comments", "access": "public" }
```
```ts
// save.ts
import { pool } from "@evershop/evershop/lib/postgres";
export default async (req, res) => {
  const { productId, author, body } = req.body || {};
  if (!productId || !author || !body) return res.status(400).json({ error: "Invalid" });
  await pool.query(
    "insert into product_comment(product_id, author, body) values ($1,$2,$3)",
    [productId, author, body]
  );
  res.json({ success: true });
};
```

### 4.4. GraphQL (mở rộng Product)
```graphql
# ProductComment.graphql
type ProductComment {
  commentId: ID!
  author: String!
  body: String!
  createdAt: String!
}

extend type Product {
  comments: [ProductComment!]!
}
```
```ts
// ProductComment.resolvers.ts
import { select } from "@evershop/postgres-query-builder";
export default {
  Product: {
    comments: async (product, _args, { pool }) => {
      const rows = await select()
        .from("product_comment")
        .where("product_id", "=", product.productId)
        .orderBy("created_at", "DESC")
        .execute(pool);
      return rows.map(r => ({
        commentId: r.comment_id,
        author: r.author,
        body: r.body,
        createdAt: r.created_at
      }));
    }
  }
};
```

### 4.5. UI storefront (Area injection)
```tsx
// pages/frontStore/productView/Comments.tsx
export default function Comments({ product: { comments } }) {
  return (
    <div className="comments">
      {comments.map(c => <p key={c.commentId}><b>{c.author}</b>: {c.body}</p>)}
    </div>
  );
}
export const layout = { areaId: "productViewRight", sortOrder: 30 };
export const query = `
  query {
    product(id: getContextValue("productId")) {
      comments { commentId author body createdAt }
    }
  }`;
```

---

## 5) Tuỳ biến Checkout & Payment

> Mục tiêu: thêm/bớt bước, thêm trường, tích hợp cổng thanh toán (ví dụ Stripe/MoMo/VNPay…), xử lý webhook, cập nhật trạng thái đơn hàng.

### 5.1. Nguyên tắc
- **Không sửa core**: override UI bằng **Theme**, thêm logic bằng **Extension**.
- **Checkout pages** thường tồn tại sẵn (ví dụ `/checkout`, `/checkout/shipping`, `/checkout/payment`, `/checkout/success`…) — bạn có thể:
  - Thêm block UI vào các **Area** của trang checkout qua Theme
  - Thêm **middleware** (trong Extension) để validate, bổ sung context, guard
  - Thêm **REST endpoints** (Extension) cho các hành động (tạo payment intent, xác thực OTP, webhook…)
  - **Subscribe events** (`order_placed`, `payment_succeeded`…) để xử lý hậu kỳ

### 5.2. Thêm/bớt trường thông tin ở Checkout
1) **Tìm routeId** của trang checkout hiện có trong `packages/**/pages/frontStore/checkout*/` hoặc tương đương.  
2) **Theme**: tạo file trong `themes/hapas-theme/src/pages/<checkoutPage>/MyField.tsx`
   ```tsx
   export default function MyField({ cart }) {
     return <div className="my-field">Ghi chú đơn hàng: ……</div>;
   }
   export const layout = { areaId: "content", sortOrder: 25 };
   export const query = `query { cart { id items { quantity } } }`;
   ```
3) **Extension** (nếu cần lưu dữ liệu vào DB/cart):
   - Tạo REST endpoint `/api/cart/note` để cập nhật `cart.note`
   - Middleware tại page checkout đọc `req.body.note` và `setContextValue(req,"cartNote",…)` để GraphQL/map vào order.

### 5.3. Tích hợp Payment Gateway (mẫu tổng quát)
**Mục tiêu**: Tạo provider `myPay` với các phần:
- **UI trên trang Payment**: nút “Thanh toán MyPay”
- **Endpoint tạo payment intent**: `/payment/mypay/create-intent` (private/public tuỳ case)
- **Webhook**: `/payment/mypay/webhook`
- **Cập nhật Order**: set `payment_status`, `transaction_id`, ghi audit log.

**Bước thực hiện** (Extension `paymentMyPay`):
```
extensions/paymentMyPay/
  src/
    api/payment/mypay/create-intent/
      route.json
      index.ts
    api/payment/mypay/webhook/
      route.json
      index.ts
    pages/frontStore/checkoutPayment/MyPayButton.tsx
    subscribers/order_placed/attachPendingPayment.ts
  package.json
```
- `create-intent/route.json`
  ```json
  { "methods": ["POST"], "path": "/payment/mypay/create-intent", "access": "private" }
  ```
- `create-intent/index.ts` (giả lập)
  ```ts
  export default async (req, res) => {
    const { orderId, amount } = req.body;
    // gọi SDK/cURL tới cổng thanh toán → trả về clientSecret/redirectUrl
    return res.json({ clientSecret: "xxx", redirectUrl: "https://..." });
  };
  ```
- `webhook/route.json`
  ```json
  { "methods": ["POST"], "path": "/payment/mypay/webhook", "access": "public" }
  ```
- `webhook/index.ts`
  ```ts
  export default async (req, res) => {
    const event = req.body;
    // verify signature → lấy orderId → update trạng thái order
    // ví dụ: payment_succeeded → set paid + lưu transaction_id
    res.json({ received: true });
  };
  ```
- **UI** trên trang thanh toán (Theme hoặc Extension Page block):
  ```tsx
  export default function MyPayButton({ order }) {
    async function pay() {
      const r = await fetch("/payment/mypay/create-intent", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, amount: order.grandTotal })
      });
      const { redirectUrl } = await r.json();
      window.location.href = redirectUrl;
    }
    return <button onClick={pay}>Thanh toán MyPay</button>;
  }
  export const layout = { areaId: "content", sortOrder: 50 };
  export const query = `query { order { id grandTotal } }`;
  ```
- **Hậu kỳ (subscriber)**:
  ```ts
  // subscribers/order_placed/attachPendingPayment.ts
  export default async (order) => {
    // gắn trạng thái "pending_payment", tạo record transaction draft...
  };
  ```

> **Lưu ý bảo mật**: Khoá bí mật (API key) để ở ENV, xác thực webhook (HMAC), không lộ secret ra client. Luôn log idempotency key khi cập nhật order để tránh double-charge.

### 5.4. Thêm bước mới trong Checkout (ví dụ: “Chọn gói quà”)
- **UI**: block trong page checkout (Theme) hỏi “gói quà?”
- **Endpoint**: `/api/checkout/giftwrap` (Extension) để ghi lựa chọn vào cart/order
- **Middleware**: tại trang payment/shipping, đọc context `giftwrap` để tính **phụ phí** (xem Shipping 6.3).

---

## 6) Tuỳ biến Shipping (tính phí, phương thức, validate)

### 6.1. Mục tiêu
- Tính phí ship dựa theo địa chỉ/khối lượng/khoảng cách
- Cung cấp danh sách **phương thức ship** (Standard/Express/In-store Pickup…)
- Ghi nhận **chọn lựa** của khách vào cart/order
- Validate “khu vực không phục vụ”, COD giới hạn…

### 6.2. Kiến trúc gợi ý
Tạo Extension `shippingCustom`:
```
extensions/shippingCustom/
  src/
    api/shipping/rates/
      route.json
      index.ts
    graphql/types/Shipping/Shipping.graphql
    graphql/types/Shipping/Shipping.resolvers.ts
    pages/frontStore/checkoutShipping/MethodSelector.tsx
    subscribers/order_placed/applyShippingLines.ts
```
- `/api/shipping/rates` trả về các **shipping methods** và `price` dựa trên `address`, `weight`, `subtotal`…
- GraphQL mở rộng **Cart/Order** để hiển thị/ghi `shippingMethod`, `shippingPrice`
- UI Selector tại trang Shipping (Theme/Extension block)

### 6.3. REST: `/api/shipping/rates`
```json
// route.json
{ "methods": ["POST"], "path": "/shipping/rates", "access": "private" }
```
```ts
// index.ts
export default async (req, res) => {
  const { address, weight, subtotal } = req.body;
  const methods = [];
  if (address?.country === "VN") {
    methods.push({ code: "STD", label: "Tiêu chuẩn (2-4 ngày)", price: 20000 });
    methods.push({ code: "EXP", label: "Hoả tốc (4-8h)", price: 80000 });
    if (subtotal > 990000) methods[0].price = 0; // freeship
  } else {
    methods.push({ code: "INTL", label: "Quốc tế (5-10 ngày)", price: 250000 });
  }
  res.json({ methods });
};
```

### 6.4. UI chọn phương thức
```tsx
export default function MethodSelector({ cart }) {
  async function fetchRates() {
    const r = await fetch("/shipping/rates", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: cart.shippingAddress, weight: cart.totalWeight, subtotal: cart.subtotal }) });
    const { methods } = await r.json();
    // set state → render radio
  }
  return (
    <section>
      <button onClick={fetchRates}>Lấy phí vận chuyển</button>
      {/* render methods… onChange → POST /api/cart/set-shipping-method */}
    </section>
  );
}
export const layout = { areaId: "content", sortOrder: 20 };
export const query = `query { cart { id subtotal totalWeight shippingAddress { country } } }`;
```

### 6.5. Ghi chọn lựa vào Cart/Order
- Tạo endpoint `/api/cart/set-shipping-method` để lưu `shippingMethod` + `shippingPrice` vào DB/cart.
- Trong **middleware** của trang thanh toán, đảm bảo đọc `shippingMethod` để **tính grandTotal**.
- Subscriber `order_placed/applyShippingLines.ts`: chuyển dữ liệu ship từ cart → order lines.

### 6.6. Validate khu vực/giới hạn
- Trong `rates/index.ts`: nếu `address.city` ∈ `BLOCKED_CITIES` → trả lỗi/khuyến nghị phương thức khác.
- Tại **middleware** checkout shipping/payment: chặn tiến trình nếu chưa có `shippingMethod` hợp lệ.

---

## 7) Quy trình làm việc — từng bước (tổng hợp)

1) **Tạo Theme** `hapas-theme` để đổi **header**, **footer**, **homepage**  
   - Khung `themes/hapas-theme` → workspaces → `config.system.theme="hapas-theme"` → **build**  
   - Viết `pages/all/All.tsx` (layout), `pages/homepage/*` (block)

2) **Tạo Extension** `hapas` để sinh page mới `/hapas`, `/hapas/:slug`  
   - Khung `extensions/hapas` + bật trong `config` → **build**  
   - `route.json` cho 2 page; `migration` bảng `hapas`; `GraphQL` types/resolvers  
   - Middleware `setContextValue`; Component SSR `List.tsx`, `Detail.tsx`

3) **Thêm tính năng** (ví dụ Comments) bằng Extension riêng  
   - Migration + REST + GraphQL + UI block (Area inject vào `productView`)  

4) **Checkout/Payment**  
   - Thêm trường/bước mới bằng Theme block + REST endpoint để lưu cart  
   - Tích hợp payment gateway: create-intent, webhook, cập nhật order, subscriber hậu kỳ  
   - Bảo mật: ENV secrets, verify webhook, idempotency

5) **Shipping**  
   - Endpoint `/shipping/rates` tính phí theo địa chỉ/trọng lượng/subtotal  
   - UI chọn method, ghi vào cart, áp dụng lên order, validate khu vực

6) **Kiểm thử & quan sát**  
   - Viết test E2E cho luồng mới (hapas list/detail, comment, checkout với shipping/payment)  
   - Log lỗi vào `.log/` và đảm bảo các thư mục `public/.evershop/.log/media` có quyền ghi (nếu cần)  
   - Smoke test: /, /hapas, /hapas/:slug, checkout đến paid/success

---

## 8) Mẹo & Best Practices

- **Không sửa core** hoặc **default theme** → luôn dùng Theme/Extension.
- **Đặt tên `routeId`** ngắn, URL-safe, **duy nhất**; tránh ký tự đặc biệt.
- **Component viết hoa / middleware viết thường**; master component **default export**.
- **API mặc định private** khi không khai `access` trong `route.json`.
- Dùng **`buildUrl(routeId, params)`** để sinh URL, tránh hardcode path.
- **GraphQL**: đặt type trong `graphql/types/<PascalCase>/` (schema + resolvers).
- **Context SSR**: `setContextValue(req, key, val)` ↔ `getContextValue(key)` trong `query`/resolver.
- **Events** cho side-effects (email, đồng bộ ERP/WMS, log giao dịch…).
- **Secrets**: để ở ENV; không bao giờ đẩy xuống client.
- **Rebuild** sau khi đổi **Theme/Extension**.
- **Migration**: giữ idempotent (sử dụng `if not exists`, versioning file…).

---

## 9) Checklist cuối (copy-paste dùng nhanh)

- [ ] Node 20+, Postgres 13+; `npx create-evershop-app` hoặc cài package  
- [ ] `config/default.json` có `system.theme`, `system.extensions`  
- [ ] Workspaces: `["extensions/*","themes/*"]`  
- [ ] **Theme** `hapas-theme`: `pages/all/All.tsx`, `pages/homepage/*` → **build**  
- [ ] **Extension** `hapas`: routes `/hapas`, `/hapas/:slug`; migration; GraphQL; SSR components → **build**  
- [ ] **Feature ext** (Comments): migration, REST, GraphQL, UI inject vào `productView`  
- [ ] **Checkout/Payment**: block UI + endpoints + webhook + subscriber + ENV secrets  
- [ ] **Shipping**: `/shipping/rates` + selector + set method + apply to order + validations  
- [ ] Test E2E + Smoke test toàn luồng + kiểm file quyền ghi

---

> Cần mình tách **skeleton thư mục + file rỗng** cho `themes/hapas-theme`, `extensions/hapas`, `extensions/paymentMyPay`, `extensions/shippingCustom` thành một gói ZIP để bạn import thẳng vào dự án không? Chỉ cần nói “xuất skeleton” là mình tạo file ngay.
