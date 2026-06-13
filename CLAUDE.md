# CLAUDE.md — Cẩm nang làm việc

Web cho thuê xe vùng quê (An Giang). **Hiện trạng đầy đủ: đọc `docs/SRS.md`** (nguồn sự thật tổng quan).

> ⚙️ **Quy tắc vàng:** mỗi thay đổi đáng kể → cập nhật **code + `docs/SRS.md` + file này**. Hai doc này là cửa ngõ ngữ cảnh; code là sự thật triển khai; `docs/superpowers/specs/` là lịch sử quyết định.

## Lệnh
- `npm run dev` · `npm run build` · `npm run lint` · `npm run test:e2e` (Playwright, fixture mode).
- **Deploy = push `main`** → GitHub Actions `deploy.yml` gọi Dokploy API (không tự build trên Vercel). Verify ở https://thuexeangiang.autocontent.click
- **FB auto-post**: GitHub Actions `fb-post.yml` (cron 3×/ngày + Run thủ công, có dry-run).

## Kiến trúc & bản đồ repo
- **Next.js 16 App Router + TS + Tailwind v3 + next-intl** (vi mặc định). Cột `.page` cuộn nội bộ (UI V2 "hành trình").
- `app/[locale]/` — `layout.tsx` (fonts, ContactProvider, JSON-LD), `page.tsx` (server → `JourneyHome`), `xe/[slug]/`, `cho-thue-xe/`. `app/globals.css` chứa CSS V2 (journey/chapter/estimator…). `app/sitemap.ts`, `app/robots.ts`, `app/icon.svg`.
- `components/` — `JourneyHome` (8 chương), `JourneyRail`, `HeroShowcase`, `QuickQuote`, `ContactSheet` (4 mode), `ContactProvider`, `StickyContactBar`, `Car3DViewer`, `Car360`, `CarGallery`, `PriceTable`, `OwnerCard`, `ZaloIcon`…
- `lib/` — `data.ts` (đọc Supabase + fixtures), `seatGroups.ts` (gom theo số chỗ), `actions.ts` (server actions: partner + **submitBooking** + Telegram), `seo.ts`, `supabase.ts`.
- `config/` — `brand.ts` (thương hiệu/liên hệ), `services.ts` (dịch vụ + SVC_SUGGEST), `promos.ts` (giá gạch/nhãn ưu đãi theo slug).
- `hooks/` — `useContact.ts`, `useReveal.ts`. `scripts/fb-post.mjs` (Groq → FB tự động), `scripts/fb-page.mjs` (cập nhật thông tin Page + đăng/ghim bài giới thiệu — chạy tay, cần Page token có `pages_manage_metadata`+`pages_manage_posts` trong `.env.local`), `scripts/make-og.mjs` (sinh `public/og.jpg` 1200×630 từ ảnh thật + thương hiệu, Playwright). `public/cars/` ảnh thật tối ưu (innova/storefront). `supabase/*.sql`. `docs/SRS.md`.
- **SEO**: `lib/seo.ts` = LocalBusiness(AutoRental) + Product/Offer + **FAQPage** (trang chủ) + **BreadcrumbList** (trang xe). OG/twitter (`summary_large_image`) trỏ `/og.jpg`. Sitemap có `lastModified`. Đổi ảnh OG → chạy lại `node scripts/make-og.mjs`.

## ⚠️ BẪY QUAN TRỌNG (đừng phá)
1. **Supabase = server-only** → đọc env `SUPABASE_URL`/`SUPABASE_ANON_KEY` (KHÔNG dùng `NEXT_PUBLIC_*` cho client vì Next **nướng cứng lúc build** → runtime bị bỏ qua). Trang đọc dữ liệu phải `export const dynamic = "force-dynamic"`.
2. **package-lock phải sinh trên Linux** (có `@swc/helpers@0.5.23`) nếu không `npm ci` trong Docker fail. Regenerate qua docker `node:22-alpine` rồi commit.
3. **lucide-react v1.17 KHÔNG có icon `Facebook`** → dùng `Globe`; nút Zalo dùng `components/ZaloIcon.tsx` (logo).
4. **FB Graph Page id = `1147502741786246`** (KHÁC id trên URL profile `61590698163868`). Dùng Graph id khi gọi API.
5. **`proxy.ts` (next-intl middleware)** matcher phải loại path có dấu chấm (`/((?!api|_next|_vercel|.*\\.).*)`) — nếu không `robots.txt`/`sitemap.xml`/`icon.svg` trả **404**. Native webhook custom-git của Dokploy lỗi "Branch Not Match" → deploy qua GitHub Actions, đừng dựa vào webhook đó.
6. **`localeDetection: false`** trong `i18n/routing.ts` → `/` luôn về `/vi` (ưu tiên tiếng Việt).
7. **Định giá theo SỐ CHỖ**: gom xe qua `lib/seatGroups.ts`; **khuyến mãi ở `config/promos.ts`** (không trong DB). Đừng quay lại định giá theo hãng.
8. **Output standalone** (`next.config.ts`) — Dockerfile copy `.next/standalone` + chạy `node server.js`.
9. **Không bot tạo/đăng nhập tài khoản** Google/Zalo/Facebook (ToS) — xác minh do chủ xe làm. `service_role` key chỉ ở `.env.local` máy local, KHÔNG lên Dokploy/Git.

## Quy ước
- Chuỗi UI qua next-intl (`messages/vi.json|en.json`) — tránh hardcode (trừ phần V2 dùng nhiều text inline đã chấp nhận).
- Màu: token `ink/surface/bg/muted/hairline/stage*/accent` (Tailwind + CSS vars). Accent (cobalt) dùng **rất ít**; thanh tiến trình journey đã đổi sang **đen (ink)**.
- Mọi animation: chỉ transform/opacity + nhánh `prefers-reduced-motion`.
- Best-effort cho booking/Telegram/FB — không để lỗi backend chặn khách.

## Cách thêm/sửa nhanh
- **Giá / xe / bật-tắt available**: Supabase Table Editor (bảng `cars`). Web tự gom theo số chỗ.
- **Khuyến mãi**: `config/promos.ts` · **Thương hiệu/liên hệ**: `config/brand.ts` · **Dịch vụ**: `config/services.ts`.
- **Đơn đặt xe**: bảng `bookings` (status new→called→booked) + báo Telegram (@May_2108_bot).
- **Nội dung FB post**: `scripts/fb-post.mjs` (Groq prompt + fallback tĩnh).

## Secrets (chỉ tên — xem SRS §6)
Dokploy env: `SUPABASE_URL/ANON_KEY`, `NEXT_PUBLIC_*`, `NEXT_PUBLIC_SITE_URL`, `TELEGRAM_BOT_TOKEN/CHAT_ID`.
GitHub Secrets: `DOKPLOY_API_KEY`, `FB_PAGE_TOKEN/ID`, `GROQ_API_KEY`, `SUPABASE_URL/ANON_KEY`.
