# Hudulguun — Online Shop

> Project brief + codebase map. Read this first; open source files only when the task needs them.

## 1. Client

- **Brand:** HUDUL GUUN (Хөдөлгүүн) — *"Play based learning tools"*
- **Facebook:** https://www.facebook.com/Hudulguunmn
- **Market:** Mongolia. UI language **Mongolian (Cyrillic)**, currency **₮ (MNT)**, format `89,000₮`.
- **Audience:** parents of toddlers / young kids; also kindergartens and therapists.

## 2. Goal

Convert the existing **food delivery app** in this repo into an **online shop** for Hudulguun.
Launch product: the **Sensory Mat (Мэдрэхүйн матт)** on **pre-order**. Built so more learning toys can be added later.

## 3. Repo map (existing code — reuse, don't rewrite)

```
food/        Next.js 15 (App Router) + React 19 + Tailwind + shadcn/ui, axios, react-hook-form + zod, sonner, swiper/embla
  src/app/(customer)/_components/   Header, MainBanner, Categories, Foods, FoodCard, AddToCard, CartContext, CartDetail,
                                    DeliveryAddress, OrderHistory, UserProfile, MyProfile, Footer (+ skeletons)
  src/app/(admin)/admin/            Admin: AddFood, EditFood, AddCategory, CategoryFoods, SideBar, orders/
  src/app/(auth)/                   signin, signUp
  src/axios/                        `api` axios instance (baseURL = process.env.API_URL), setAuthToken
food-api/    Express 5 + Mongoose 8 + JWT, deployed on Vercel (api/index.ts)
  src/models/        food.model, food-category.model, food-order.model, user.model
  src/routes/        auth, category, food, order, user, count, countAll
  src/controllers/   one folder per resource
  dist/              build output — never edit
```

### Rename map (food → shop)

| Old | New |
|---|---|
| `food` model (`foodName, price, image, ingredients, category`) | `product` (see §5) |
| `category` (food category) | `category` (Мэдрэхүй, Тэнцвэр, Нарийн хөдөлгөөн …) |
| `order.foodOrderItems[{food, quantity}]` | `order.items[{product, variant, quantity, price}]` |
| order status `Pending/Canceled/Delivered` | `PreOrder / Pending / Paid / Shipped / Delivered / Canceled` |
| `FoodCard`, `Foods`, `AddFood`, `EditFood` | `ProductCard`, `Products`, `AddProduct`, `EditProduct` |
| Routes `/food`, `/category` | `/products`, `/categories` |

Do renames incrementally (model → controller → route → frontend) so the app keeps running.

## 4. Pages

| Route | Purpose |
|---|---|
| `/` | Hero ("Хүүхдийн хөгжил дэмжих МЭДРЭХҮЙН МАТТ — БЭЛЭН ИРЛЭЭ"), pre-order banner with price (89,000₮ / ~~99,000₮~~), featured product, benefits, "7 хөгжилтэй арга", safety, FAQ, Facebook link |
| `/products` | Grid, category filter |
| `/products/[slug]` | Gallery, color variant switch (Бүдэг / Тод), price (pre-order vs regular), qty, add to cart, description sections from §6 |
| `/cart` | Cart (existing CartDetail) |
| `/checkout` | Name, phone (8 digits), city/district/khoroo, address, note; payment method; guest checkout allowed |
| `/orders` | Order history (logged-in) |
| `/admin` | Products, variants, stock, pre-order limit, orders + status |

## 5. Data model — `product`

```ts
{
  name: string;               // "Мэдрэхүйн матт (Sensory Mat)"
  slug: string;               // "sensory-mat"
  shortDescription: string;
  description: string;        // markdown / rich text
  category: ObjectId;
  images: string[];
  price: number;              // 99000  (үндсэн үнэ)
  preOrderPrice?: number;     // 89000
  isPreOrder: boolean;        // admin toggles on/off
  variants: { name: string; color: string; images: string[]; stock: number }[];
  specs: { label: string; value: string }[];
  isActive: boolean;
  createdAt; updatedAt;
}
```
Price shown = `isPreOrder && preOrderPrice ? preOrderPrice : price`. No buyer limit (no "first 10" logic) for now. **Compute on the server** when creating an order — never trust the client price.

## 6. Launch product content (use verbatim)

**Name:** Мэдрэхүйн матт (Sensory Mat)
**Set:** 6 өөр төрлийн гадаргуутай, 6 ширхэг матт нэг багц
**Variants:** `Бүдэг өнгө` (pastel: light blue, yellow, pink, lime, lilac, aqua) · `Тод өнгө` (bright: blue, yellow, red, green, purple, orange)
**Price:** Урьдчилсан захиалга **89,000₮** · Үндсэн үнэ **99,000₮**
**Urgency:** 🔥 PRE-ORDER эхэллээ! Урьдчилсан захиалгын хямдралтай тоо хязгаартай тул та яараарай!

**Intro:** Хүүхдийн мэдрэхүй, тэнцвэр, хөдөлгөөнийг зэрэг хөгжүүлэх тоглоомон орчин юм!

**Хүүхэд хөлөөрөө:** зөөлөн, хатууг ялгаж сурна · овгор, товгорыг мэдэрнэ · биеийн байрлалаа хянаж сурна · тэнцвэрээ ажиллуулна
→ мэдрэхүй + булчин + хөдөлгөөний хөгжил = нэг дор!

**6 төрлийн өөр бүтэцтэй гадаргуу** — нэг хэсгээс нөгөөд гишгэх бүрт: алхалтаа хянаж · тэнцвэрээ барьж · бүх биеэ зэрэг ажиллуулна

**Яаж ашиглах вэ?** Өглөө хөл нүцгэн алхуулах · Тоглоомын зам болгох · "Өнгөн дээр үсэр" тоглоом · Баруун/зүүн, удаан/хурдан алхуулах · Нүдээ аниад мэдрэх тоглоом · Гадаах мэдрэх орчныг гэртээ бүрдүүлэх

**7 хөгжилтэй арга:**
1. Нэг хөл дээр үсрэх – тэнцвэр, гуяны булчин
2. Хавсралттай үсрэлт – бүх биеийн булчинг идэвхжүүлнэ
3. Хажуу тийшээ эргэх – хэвлий, нурууны булчин, тэнцвэр
4. Эвлүүлж тоглох – гар хурууны нарийн булчин, анхаарал төвлөрөлт
5. Аав, ээжтэйгээ хамт тоглох – харилцаа, ээлжлэх, дараалал, дуурайх чадвар
6. Олон янзаар үсрэх – хүч, хурд, мэдрэхүй
7. Нүдээ боож хэлбэр дүрс таах – төсөөлөл, эргэцүүлэл, хурууны мэдрэхүй

**Аюулгүй & практик (specs):** TPE материал (EN71 стандарттай) · Хальтирдаггүй · Хөнгөн, эвлүүлдэг · Цэвэрлэхэд амар

## 7. Design

- Off-white background `#F4F2EF`, near-black text `#1A1A1A`; clean, airy, playful but not cluttered.
- Logo: spaced uppercase wordmark "HUDUL / GUUN" + small "Play based learning tools".
- Headline accent: gradient purple `#7B5CF5` → blue `#4F7BE0` → teal `#2E9BA8` → green `#1FBF73`, with a dark-red offset shadow (`#7A1F1F`) — use for hero only.
- Rounded cards, soft shadows, emoji/ playful accents sparingly. Mobile-first (most traffic from Facebook on phones).
- Fonts: wide geometric sans for headings (e.g. Unbounded / Montserrat Alternates, Cyrillic support required), Inter/Nunito for body.

## 8. Checkout & payment (MVP)

- Guest checkout: name, phone, address — no forced sign-up.
- Payment: **bank transfer** with order number as reference (MVP) → later **QPay / SocialPay**.
- Delivery: Улаанбаатар хүргэлт + орон нутаг (via unaa/bus); delivery fee configurable in admin.
- After order: confirmation page + "Facebook Messenger-ээр холбогдох" button.

## 9. Roadmap

1. **Rebrand UI** — header/footer/logo/colors/fonts, Mongolian copy, remove food wording.
2. **Product model + admin** — replace food model, variants, pre-order fields; seed the Sensory Mat.
3. **Product page + cart** — variant selection, pre-order price logic.
4. **Checkout + orders** — guest checkout, server-side pricing, admin order statuses.
5. **Polish** — SEO/OG tags (Facebook share preview), metadata in Mongolian, responsive QA, analytics/Meta Pixel.
6. **Later** — QPay, more products, reviews, discount codes.

## 10. Quality bar — must work flawlessly

- **Server is the source of truth:** recompute prices/totals on the API; validate every request with zod (frontend + backend).
- **No silent failures:** every API call has loading, error (sonner toast in Mongolian) and empty states; disable submit buttons while pending to prevent double orders.
- **Cart persists** (localStorage, wrapped in try/catch) and survives refresh; removes products that no longer exist.
- **Orders are idempotent:** client sends an `idempotencyKey`; API ignores duplicates.
- **Stock per variant** updated with atomic `$inc` + condition; out-of-stock variants shown disabled.
- **Mongo connection cached** for Vercel serverless; DB indexes on `slug`, `order.createdAt`, `order.phone`.
- **Images** on Cloudinary/Vercel Blob (URL in DB), served via `next/image`.
- **Admin routes** protected by JWT + role check on the API, not only in the UI.
- **Before each deploy:** `npm run build` + `tsc --noEmit` + lint pass with zero errors; manually test on a phone: browse → variant → cart → checkout → order appears in admin.
- Lighthouse mobile ≥ 90 (performance, accessibility, SEO).

## 11. Conventions / notes

- Keep existing stack & patterns (shadcn/ui components in `food/src/components/ui`, `api` axios instance, CartContext).
- All user-facing strings in Mongolian; code identifiers in English.
- Format money with `toLocaleString("en-US") + "₮"`.
- ⚠️ `food-api/.env` is committed to git — move secrets out, add to `.gitignore`, rotate DB/JWT secrets.
- Don't edit `food-api/dist/`.
