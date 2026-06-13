# SEO: OG image (ảnh thật) + structured data + sitemap — Thiết kế

Ngày: 2026-06-13 · Trạng thái: duyệt (chủ chọn phương án A) → triển khai.

## Mục tiêu
Lấp 2 lỗ hổng SEO lớn nhất (xem audit): **không có ảnh chia sẻ (OG)** và **thiếu structured data nâng cao**. Tăng tỉ lệ bấm khi share link (FB/Zalo/Messenger) và khả năng hiện rich result trên Google.

## Phạm vi (làm)
1. **OG image dùng ảnh thật** — `public/og.jpg` (1200×630): ảnh Innova thật (cột trái) + bảng thương hiệu tối (cột phải: tên dịch vụ, "5 & 8 chỗ · Tự lái · Có tài xế · Giao tận nhà", SĐT 0326 120 108, website). Sinh bằng `scripts/make-og.mjs` (Playwright render HTML → ảnh, sharp tối ưu). Khai báo `openGraph.images` + `twitter.card='summary_large_image'` + `twitter.images` trong `app/[locale]/layout.tsx`.
2. **FAQPage JSON-LD** ở trang chủ (`faqJsonLd()` trong `lib/seo.ts`) — 5–6 Q&A thật.
3. **BreadcrumbList JSON-LD** ở trang xe (`breadcrumbJsonLd()`) — Trang chủ › Cho thuê xe › [Tên xe].
4. **sitemap `lastModified`** cho mọi URL.
5. Lưu ảnh thật tối ưu vào `public/cars/` (innova.jpg, storefront.jpg) để tái dùng.

## Ngoài phạm vi (lần sau)
- Đưa ảnh thật vào **website** (cần upload Supabase Storage + thêm `car_photos`) — task riêng.
- FAQ hiển thị trên UI (hiện chỉ JSON-LD; Google vẫn đọc được).
- OG image riêng theo từng xe; Core Web Vitals; aggregateRating (chờ đánh giá thật).

## Quyết định
- **OG tĩnh** (sinh sẵn) thay vì dynamic `ImageResponse` → tránh rắc rối font tiếng Việt khi render runtime; ảnh thật đẹp & ổn định; khai báo URL tuyệt đối qua `metadataBase`.
- Dùng ảnh **Innova** (đời thật) làm hình chính; storefront để dành cho web/Maps.
- FAQ để JSON-LD trước (ít rủi ro, đỡ đụng layout journey V2).

## Kiểm thử
`npm run build` + `npm run lint` sạch; verify OG bằng `curl` thẻ `og:image`/`twitter:*` trên live + Facebook Sharing Debugger (chủ tự scrape lại).
