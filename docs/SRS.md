# SRS — Dịch vụ cho thuê xe Thạnh Mỹ Tây - An Giang (hiện trạng)

> Tài liệu sống, phản ánh trạng thái thực tế. Cập nhật: 2026-06-13.
> Lịch sử ban đầu xem `SPEC.md`; các quyết định thiết kế lẻ ở `docs/superpowers/specs/`.

## 1. Tổng quan
Web giới thiệu + nhận khách cho dịch vụ cho thuê ô tô vùng quê (An Giang). Khách: bà con
không rành công nghệ → ưu tiên **gọi/Zalo** và **để lại SĐT cho nhà xe gọi lại**.
- **Thương hiệu (hiển thị):** "Dịch vụ cho thuê xe Thạnh Mỹ Tây - An Giang" · chủ xe **Anh Trung** (Hoàng Trung).
- **Liên hệ:** ĐT/Zalo **0326 120 108** · địa chỉ Khu dân cư kênh 10, ấp Bờ Dâu, xã Thạnh Mỹ Tây, Tỉnh An Giang.
- **Domain:** https://thuexeangiang.autocontent.click (Cloudflare → Dokploy/Traefik).
- Tên hạ tầng (repo/Supabase/Dokploy) vẫn mang "trung-hieu" — chỉ là tên kỹ thuật.

## 2. Stack & hạ tầng
- **Next.js 16** (App Router, TS) + Tailwind v3 · next-intl (vi mặc định, không dò Accept-Language).
- **Supabase** (Postgres) — dữ liệu xe/đánh giá/đơn; đọc phía server lúc RUNTIME (env `SUPABASE_URL`/`SUPABASE_ANON_KEY`, **không** NEXT_PUBLIC vì bị nướng cứng lúc build). Trang dữ liệu = `force-dynamic`.
- **Dokploy** (Docker Swarm + Traefik, server 160.250.134.226) — host app (Dockerfile standalone).
- **GitHub** repo `bryanphan66/thue-xe-trung-hieu`; **GitHub Actions** lo deploy + cron đăng FB.

## 3. Tính năng (đang chạy)
- **Trang chủ V2 "Một hành trình"**: cột `.page` cuộn nội bộ + JourneyRail (mạch đen + xe chạy theo cuộn, đèn pha/phanh) + 8 chương tự biên đạo.
  - 01 Dịch vụ (khám bệnh/cưới/du lịch/đi xa/**Việc khác**) → ContactSheet gợi ý loại số chỗ + "Để nhà xe gọi lại".
  - 02 **Thuê theo SỐ CHỖ** (5 chỗ / 8 chỗ…) — giá tài xế/tự lái, giá gạch + chip "Ưu đãi", kèm xe thật.
  - 03 Báo giá nhanh (chọn số chỗ → hình thức → ngày → đi xa → tạm tính → đặt).
  - 04 Tự lái/tài xế · 05 Đánh giá (marquee) · 06 Đối tác · 07 Vị trí (OSM) · 08 Footer.
- **Định giá theo SỐ CHỖ**: gom xe theo `seats` (`lib/seatGroups.ts`), giá lấy từ xe rẻ nhất ("từ" nếu nhiều xe). KHÔNG theo hãng.
- **Đặt xe nhanh (1 SĐT)**: ContactSheet mode `book` → server action `submitBooking` → lưu Supabase `bookings` + **báo Telegram** cho chủ xe. Tự kèm ngữ cảnh (số chỗ/hình thức/ngày/tạm tính/dịch vụ). Best-effort: lỗi backend không chặn khách.
- **ContactSheet 4 kiểu**: call / zalo / service (gợi ý số chỗ) / book (form). Nút Zalo dùng logo Zalo. Thanh sticky: "Để nhà xe gọi lại" + "Liên hệ tư vấn ngay".
- **Chi tiết xe** `/xe/[slug]`: hero theo thứ tự 360° (≥8 frame) > model `.glb` > ảnh thật > placeholder sạch; gallery, bảng giá (giá gạch), OwnerCard.
- **SEO**: metadata/OpenGraph, schema.org (AutoRental + Product), sitemap, robots, favicon.

## 4. Mô hình dữ liệu (Supabase)
- `owners`, `cars` (slug, name, type, seats, price_with_driver, price_self_drive, badge, photo_count, model_3d_url, available, featured, owner_id), `car_photos` (url, sort_order, **kind**: photo|spin_frame), `testimonials` (approved), `partner_inquiries`, **`bookings`** (phone, name, seats, mode, days, far, total, note, source, status).
- RLS: public read (owners/cars/photos/approved testimonials); public insert (partner_inquiries, testimonials, bookings).
- **Khuyến mãi** (giá gạch + nhãn) để ở code `config/promos.ts` theo slug — không trong DB.
- Dữ liệu thật hiện tại: 2 xe — **Kia K5 GT-Line (5 chỗ)**, **Toyota Innova 2019 (8 chỗ)**.

## 5. Tích hợp & lịch chạy (CRON)
- **Deploy:** GitHub Actions `deploy.yml` (on push `main`) → gọi Dokploy API `application.deploy`. Secret `DOKPLOY_API_KEY`.
- **FB auto-post:** GitHub Actions `fb-post.yml` — **cron `0 1,5,11 * * *` (3 lần/ngày 8/12/18h VN)** + chạy tay. `scripts/fb-post.mjs` đọc xe Supabase → **Groq** (llama-3.3-70b) tạo bài biến hoá (fallback mẫu tĩnh) → Graph API `POST /{page}/feed`. Page Graph id **1147502741786246**.
- **Telegram báo đơn:** realtime trong server action (env Dokploy), bot **@May_2108_bot** → chat id chủ xe.

## 6. Biến môi trường / Secrets (chỉ tên — giá trị không lưu ở repo)
- **Dokploy (runtime):** `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SUPABASE_URL/ANON_KEY`, `NEXT_PUBLIC_SITE_URL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.
- **GitHub Secrets:** `DOKPLOY_API_KEY`, `FB_PAGE_TOKEN`, `FB_PAGE_ID`, `GROQ_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`.
- **Local `.env.local` (không commit):** + `SUPABASE_SERVICE_ROLE_KEY` (chỉ dùng quản trị từ máy).

## 7. Ngoài code / thủ công (chủ xe lo)
- **Hộ kinh doanh:** đã nộp hồ sơ online (số OH-0745385/26), chờ "Đã cấp" (~17–18/6) để lấy MST.
- **Zalo OA:** đang chờ duyệt (OA "Dịch vụ cho thuê xe Thạnh Mỹ Tây - AG"); cần MST chứng thực để mở **ZNS**. Công văn ở `~/Downloads/zalooa_congvan_*`.
- **Google Business Profile (Maps):** loại "Dịch vụ", danh mục "Car rental agency" — tạo + xác minh thủ công.
- **Facebook Page:** đã tạo + app riêng "Thuê Xe An Giang" + auto-post.
- **Còn thiếu:** ảnh xe thật (hero/gallery/360°), file `.glb` 3D.

## 8. Vận hành thường ngày
- Sửa giá / thêm xe / bật-tắt `available` → **Supabase Table Editor** (bảng `cars`). Web tự gom theo số chỗ, FB post lần sau tự cập nhật.
- Xem đơn đặt xe → bảng **`bookings`** (status: new→called→booked) + Telegram.
- FB: tự đăng 3 lần/ngày; muốn đăng thêm → GitHub Actions → "Auto-post to Facebook Page" → Run (có dry-run).
- Khuyến mãi/nhãn → `config/promos.ts`. Liên hệ/thương hiệu → `config/brand.ts`.

## 9. Yêu cầu phi chức năng (NFR)
- **Mobile-first**, cột tối đa 448px; nút ≥48px; chữ ≥15px; tải tốt trên 3G.
- **Hiệu năng**: ảnh `next/image`; container nhẹ (standalone); animation chỉ transform/opacity.
- **A11y**: alt/aria-label nút icon, focus-visible; **mọi animation tôn trọng `prefers-reduced-motion`**.
- **SEO địa phương**: title/OG/schema.org, sitemap, robots; canonical về domain chính.
- **Độ bền**: booking/Telegram/FB là **best-effort** — backend lỗi không chặn khách.

## 10. Bảo mật & secrets
- **Phân loại khóa Supabase**: `anon/publishable` (chỉ đọc theo RLS — công khai được, dùng cho web) · `service_role/secret` (bỏ qua RLS — **CHỈ** để ở `.env.local` máy local cho việc quản trị, **KHÔNG** đưa lên Dokploy/Git).
- **Secrets KHÔNG commit**: `.env*` đã gitignore. Token FB/Groq/Telegram + Dokploy API key để ở **GitHub Secrets** / **Dokploy env**.
- **Rotate khi lộ**: Groq (console.groq.com), FB App Secret (App Settings → Reset → lấy lại Page token), Telegram (@BotFather /revoke), Supabase (API Keys → roll). Báo để cập nhật lại env/secret.
- **Không tự động hoá vi phạm ToS**: không dùng bot tạo/đăng nhập tài khoản Google/Zalo/Facebook hộ — các bước xác minh do chủ xe làm thủ công.

## 11. Sao lưu & khôi phục
- **Code**: Git (GitHub) là bản sao lưu; deploy tái lập từ Dockerfile.
- **Dữ liệu**: Supabase (Postgres) — dữ liệu nhỏ; nên export định kỳ (Table Editor / pg_dump) phòng hờ. Đơn `bookings` quan trọng → cân nhắc backup.
- **Khôi phục web**: push lại `main` → GitHub Actions deploy → Dokploy dựng lại container.

## 12. Kiểm thử
- **E2E Playwright** (`npm run test:e2e`) — chạy ở **fixture mode** (env Supabase để trống) nên không đụng DB thật. Bao: home render, link tel/zalo, chi tiết xe, form đối tác, redirect `/`→`/vi`.
- **Trước khi push**: `npm run build` + `npm run lint` sạch (chỉ còn 1 warning `<img>` ở Car3DViewer — chấp nhận).

## 13. Quy trình phát triển (cập nhật chỉ cần SRS + CLAUDE.md)
1. Sửa **code**. 2. `npm run build && npm run lint` (+ test nếu cần). 3. Push `main` → **tự deploy** → verify live.
4. **Cập nhật `docs/SRS.md` + `CLAUDE.md`** cho mọi thay đổi đáng kể (tính năng, dữ liệu, tích hợp, env).
→ Hai file này là **cửa ngõ ngữ cảnh**; code là sự thật triển khai; specs cũ trong `docs/superpowers/specs/` là lịch sử quyết định.

## 14. Roadmap / còn thiếu
→ Đã chuyển thành backlog có ưu tiên ở **§18 (Phần B)**. Tóm tắt 3 việc gấp nhất: **ảnh/360° thật**, **ZNS xác nhận đặt** (sau khi có MST + OA), **đưa đa chủ xe lên thật**.

---

# PHẦN B — Định hướng phát triển (cho ver tiếp theo)

## 15. Phiên bản
- **v1** — "tờ rơi bấm gọi" (spec gốc `SPEC.md`).
- **v2 (đang chạy)** — UI "Một hành trình", định giá theo số chỗ, đặt xe nhanh + Telegram, FB auto-post (Groq), rebrand + domain, deploy Dokploy/Actions.
- **v-next (v3)** — xem §18. Trọng tâm đề xuất: **ảnh/360 thật + đa chủ xe (multi-vendor) lên thật + ZNS xác nhận đặt**.

## 16. Sơ đồ kiến trúc
```
Khách (mobile)
   │ HTTPS
Cloudflare  (DNS + TLS, *.autocontent.click)
   │ proxy → origin 160.250.134.226
Dokploy / Traefik ──► Next.js (standalone container, server runtime env)
                         ├─► Supabase (Postgres + RLS): cars, car_photos, bookings, testimonials, owners, partner_inquiries
                         └─► Telegram Bot API (báo đơn realtime)
GitHub Actions
   ├─ deploy.yml   (push main)       ──► Dokploy API → build + release
   └─ fb-post.yml  (cron 3×/ngày)    ──► Groq (LLM) ──► Facebook Graph API (đăng bài)
Quản trị: chủ xe sửa dữ liệu trong Supabase Table Editor (không có portal riêng)
```

## 17. Từ điển dữ liệu (tham chiếu nhanh)
- **owners**: `name, phone, zalo, facebook, photo_url, address, is_primary`. (Hiện app hiển thị chủ xe từ `config/brand.ts`; owners dùng cho liên kết + multi-vendor sau.)
- **cars**: `slug` (URL), `name, type, seats, description, price_with_driver, price_self_drive, badge, photo_count, model_3d_url, poster_url, available, featured, owner_id`.
- **car_photos**: `car_id, url, sort_order, kind` (`photo` | `spin_frame` cho 360°).
- **testimonials**: `author_name, content, place, rating, approved`.
- **bookings**: `phone, name, seats, mode(driver|self), days, far, total, note, source, status(new|called|booked|cancelled)`.
- **partner_inquiries**: `name, phone, car_info, note, status`.
- *Không trong DB:* khuyến mãi (`config/promos.ts` theo slug), dịch vụ + gợi ý số chỗ (`config/services.ts`), thương hiệu (`config/brand.ts`).

## 18. Backlog v-next (ưu tiên)
**✅ Đã làm (2026-06-13) — SEO gói 1:** OG image dùng ảnh thật (`public/og.jpg` qua `scripts/make-og.mjs`) + twitter `summary_large_image`; **FAQPage** (trang chủ) + **BreadcrumbList** (trang xe) JSON-LD; sitemap `lastModified`; ảnh thật tối ưu ở `public/cars/`. **Google Business Profile** đã nộp, chờ Google duyệt (≤5 ngày từ 13/6).

**P0 — giá trị cao, chặn trải nghiệm thật**
- **Đưa ảnh xe thật lên WEBSITE** (đã có `public/cars/innova.jpg`, `storefront.jpg`): upload Supabase Storage + thêm `car_photos` (hoặc fallback asset theo slug) → hero/gallery; sau đó **360° spin** (≥8 frame, `car_photos.kind='spin_frame'` đã sẵn) + OG riêng theo xe.
- **ZNS** xác nhận đặt xe qua Zalo (sau khi có MST + OA duyệt) — nối vào `submitBooking`.
- Đưa **đa chủ xe (multi-vendor) lên thật**: thêm `owner` + `cars` trong Supabase; cân nhắc hiển thị tên/owner theo `owners` thay vì chỉ `config/brand`.

**P1 — tăng chuyển đổi / vận hành**
- Sau khi GBP duyệt: nhờ khách **đánh giá thật** trên Maps + đưa vào web (`testimonials.approved`) → thêm `aggregateRating` (sao vàng).
- FB post kèm **ảnh** (Graph `/photos`); tinh chỉnh tần suất theo reach.
- Trang/ý đơn giản xem `bookings` (nếu Supabase Table Editor chưa đủ) — vẫn tránh portal nặng.
- Lọc/giá theo **đi xa (km/tuyến)** nếu chủ xe muốn rõ ràng hơn "báo giá khi gọi".

**P2 — mở rộng**
- i18n nội dung tiếng Anh (khung đã có); bộ chọn ngôn ngữ.
- Khuyến mãi quản lý trong DB (cột) thay vì config, để chủ tự bật/tắt.
- Analytics (lượt xem/cuộc gọi/đơn) — vd Plausible/GA + đếm click CTA.
- Chuyển cron FB sang Dokploy; thêm hàng đợi/retry cho thông báo.

## 19. Ngoài phạm vi (non-goals — giữ để khỏi phình)
- Thanh toán online; lịch đặt giờ/giữ chỗ phức tạp; app native.
- Tài khoản/đăng nhập cho khách.
- Portal admin nặng (dùng Supabase Table Editor).
- Tự động hoá bằng bot các bước cần xác minh danh tính (Google/Zalo/FB) — luôn thủ công.

## 20. Quyết định cần chốt cho v-next (open questions)
- Multi-vendor: hiển thị **tên từng chủ xe** (owners) hay gộp dưới 1 thương hiệu? Hoa hồng/điều phối ra sao?
- Khuyến mãi: giữ ở `config/promos.ts` hay đưa vào DB cho chủ tự sửa?
- Đặt xe: có cần **chọn ngày** (lightweight) hay vẫn chỉ "để lại SĐT"?
- FB: tần suất tối ưu (1–3×/ngày) + có cần ảnh mỗi bài?
- ZNS: mẫu tin xác nhận gồm gì; chi phí/tin chấp nhận được không?

> Khi bắt đầu một hạng mục v-next: cập nhật mục tương ứng ở đây + ghi quyết định mới vào `docs/superpowers/specs/` rồi mới code (theo §13).
