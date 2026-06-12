# Handoff: Thuê Xe Trung Hiếu — Web cho thuê xe (mobile) · **bản V2 "Một hành trình"**

## Tổng quan
Landing page giới thiệu dịch vụ cho thuê xe (có tài xế / tự lái) phục vụ đi khám bệnh,
đám cưới – rước dâu, du lịch, đi xa. Mục tiêu: khách **xem xe → bấm GỌI / NHẮN ZALO / GỬI YÊU CẦU BÁO GIÁ**.
Mobile-first, tiếng Việt, phong cách **quiet-luxury đơn sắc**, KHÔNG màu mè / emoji / "tờ rơi".

## ⭐ Ý tưởng chủ đạo của V2 — "MỘT HÀNH TRÌNH"
Cú cuộn trang được kể như **một chuyến đi**. Nhưng **trọng tâm là NỘI DUNG, không phải chiếc xe**:
- Một **"mạch hành trình" rất mảnh ở mép trái** (thanh dọc + chiếc xe tí hon) — **chỉ báo tiến trình**,
  cố tình tiết chế, **không cắt vào nội dung** (nội dung rộng gần full-width, lề trái chỉ ~46px).
- **Đèn xe đổi theo hướng cuộn**: cuộn xuống (tiến) → **đèn pha trắng sáng**; cuộn lên (lùi) →
  **đèn hậu đỏ nhấp nháy**; dừng → **đèn phanh đỏ sáng đều**.
- Trang chia **8 "chương" đánh số editorial (01 → 08)**. Mỗi chương khi cuộn tới (≈ xe tới nơi)
  **tự bung ra có biên đạo**: số chương hiện → vạch kẻ chạy ngang → nhãn → tiêu đề trồi lên → nội dung so le.

> Đây là lựa chọn có chủ đích sau nhiều vòng: thứ chạy theo scroll phải **ngoại biên & mờ**;
> nội dung mới là thứ được biên đạo để thu hút (giống Apple/Stripe/Linear).

## Về các file trong gói
`reference/` là **bản thiết kế tham chiếu HTML/React (Babel inline)** — đúng look & behavior,
**KHÔNG phải code production**. `reference/index.html` là **nguồn chân lý về CSS** (toàn bộ class
`.spine`, `.chapter`, `.est-card`, `.hero-show`, `.car .light`… nằm trong `<style>` ở đây) — **port
nguyên khối CSS này** sang `app/globals.css`. `snippets/` là **scaffold TypeScript** đã gõ sẵn type,
**tiêu thụ chính các class CSS đó** (không phải tất cả bằng utility Tailwind).

## Độ chính xác
**Hi-fi** — dựng lại **pixel-perfect**. Bám pixel/spacing/màu/typography/animation trong reference.

---

## Stack đề xuất
- **Next.js (App Router) + TypeScript + Tailwind CSS**.
- Icon: **lucide-react** (map theo `reference/app/icons.jsx`).
- Font: **Be Vietnam Pro** + **JetBrains Mono** qua `next/font/google` (Be VN: 400–800).
- 3D: **`@google/model-viewer`** — client-only, `loading="eager"`.
- **Plain CSS classes** cho phần "hành trình"/estimator (port từ reference) + Tailwind cho layout thường.

## Design tokens (đã có sẵn trong `snippets/tailwind.config.ts` + `snippets/config/brand.ts`)
| Token | Hex | Dùng cho |
|---|---|---|
| `ink` | `#0B0B0C` | chữ chính, nút chính |
| `surface` | `#FFFFFF` | nền thẻ |
| `bg` | `#FAFAFA` | nền sáng chính |
| `muted` | `#6B7280` | chữ phụ |
| `hairline` | `#E7E7E9` | viền mảnh |
| `stage` (dark) | `#0B0B0C` | nền hero / khu 3D / footer |
| `stage-ink` | `#FAFAFA` | chữ trên nền tối |
| `stage-muted` | `#9A9CA3` | chữ phụ trên nền tối |
| `stage-hairline` | `#1F2024` | viền trên nền tối |
| `accent` (cobalt) | `#2D5BFF` | **DÙNG RẤT ÍT**: chấm chỉ báo, sao, nốt/vạch ray, switch bật, focus |

- Bo góc: thẻ `14px`, nút `13px`, sheet `22px`. Bóng: gần như không — ưu tiên hairline.
- Container mobile: cột `.page` rộng tối đa **448px**, padding ngang `22px`, nhịp dọc `~52–64px`.
- Vùng chạm ≥ 48px; CTA chính cao `52px`.

## ⚠️ Kỹ thuật QUAN TRỌNG NHẤT của V2
**Hiệu ứng hành trình chạy theo scroll của container `.page`, KHÔNG phải `window`.**
`.page` là cột giới hạn bề ngang, đặt `height:100dvh; overflow-y:auto`. Lý do: nhiều môi trường nhúng
(và preview) vô hiệu hoá window-scroll. → `JourneyRail` lắng nghe `scroller.addEventListener('scroll')`
với `scroller = document.querySelector('.page')`; `Chapter` dùng IntersectionObserver `root = .page`.
Ở Next.js, giữ nguyên mô hình: 1 cột `.page` cuộn nội bộ (đừng để body/window cuộn).

## Typography
- Be Vietnam Pro (grotesk). Display/hero h1: `48px / 800 / line-height .96 / letter-spacing -0.05em`.
- H2 chương: `27px / 800 / -0.035em`. Tên xe card `22px/800`; detail `30px/800`.
- Body/lead `17px / 400 / 1.5–1.6`. Eyebrow/nhãn chương `11.5px/600/UPPERCASE/.16em/muted/nowrap`.
- Số chương: JetBrains Mono `13px/600`. Giá: nổi bật bằng **cỡ chữ** (19–32px/800), KHÔNG bằng màu.

---

## MÀN HÌNH 1 — TRANG CHỦ (8 chương)

### Hero (nền `stage` tối)
- Eyebrow chấm cobalt nhịp khẽ + "DỊCH VỤ CHO THUÊ XE · An Giang".
- **h1 "drive-in & brake"**: 3 dòng ("Đi xa thật dễ." / "Chỉ một" / "cuộc gọi.") lao vào từ trái,
  hơi nhoè tốc độ (`blur`) rồi **giảm tốc gấp, vượt đà nhẹ rồi dừng** (`@keyframes driveIn`, stagger `--i`).
- **HeroShowcase** (`snippets/components/HeroShowcase.tsx`): carousel khoe **3 xe đầu**, tự lướt ngang
  `~3,8s` (track `translateX(-idx*100%)`), caption tên xe + số chỗ, **chấm chỉ báo** bấm được,
  **chạm → tạm dừng**, ảnh hiện tại "thở" (Ken Burns). `prefers-reduced-motion` → đứng yên.
- Cặp CTA Gọi ngay (nền trắng) / Nhắn Zalo (ghost) + gợi ý "Cuộn".

### `<div className="journey">` chứa `<JourneyRail/>` + 8 `<Chapter/>`
`JourneyRail` (`snippets/components/JourneyRail.tsx`) render: `.spine` (ray), `.spine-fill` (đổ cobalt),
`.rail-start` (điểm xuất phát), `.rail-dest` (ghim đích MapPin), `.rail-car` (xe + đèn). `Chapter` render
`.node` (sáng cobalt khi xe qua) + head (số/vạch/nhãn tự biên đạo) + label + children.

1. **01 · Dịch vụ — "Bạn cần đi đâu?"** — 4 hàng `.svc-row` (**bấm được**): ô icon 46px + nhãn + sub + chevron.
   Bấm → mở **ContactSheet kiểu `service`**: tiêu đề "Cần xe · <dịch vụ>" + hộp "ĐANG SẴN XE PHÙ HỢP ·
   bấm để xem" với **chip xe gợi ý** (theo `SVC_SUGGEST`) — **bấm chip → mở thẳng trang chi tiết xe** —
   + nút Gọi/Zalo.
2. **02 · Đội xe — "Xe của chúng tôi"** — hint "Cuộn để lật qua N xe" + **CarStack**: các thẻ
   `.car-stack-item` dùng **`position:sticky`** với `top` lệch dần (78/90/102/114px) → **xếp chồng** khi cuộn.
   ⚠️ Sticky hỏng nếu có **tổ tiên bị `transform`/`overflow:hidden`** → **đừng bọc thẻ trong Reveal**
   (Reveal đặt transform). Mỗi **CarCard**: ảnh 16:10 (+badge "Phổ biến nhất"/"Xe cưới"), tên xe,
   số chỗ/loại, **bảng giá 2 cột**; nếu có khuyến mãi: **chip "Ưu đãi tháng 6"** (viền ink, KHÔNG đỏ) +
   **giá gạch** `.was` (xám) trên giá mới; nút "Xem chi tiết" + nút gọi nhanh.
3. **03 · Báo giá — "Tính nhanh chi phí"** → **QuickQuote** (`snippets/components/QuickQuote.tsx`):
   chọn xe (chip) → hình thức (segmented Có tài xế/Tự lái; tự khoá Tự lái nếu xe không có) →
   số ngày (stepper) → toggle "Đi xa/qua đêm" → **"Tạm tính" cập nhật ngay** (giá ngày × số ngày,
   dùng giá ưu đãi nếu có; có hiệu ứng "nảy"). Nút **"Gửi yêu cầu này"** → ContactSheet kiểu `quote`
   tóm tắt Xe/Hình thức/Số ngày/Đi xa/Tạm tính + Gọi/Zalo.
4. **04 · Lựa chọn — "Tự lái hay có tài xế?"** — 2 mục, icon **vô lăng lắc qua-lại** (`steerRock`) cho
   "Có tài xế", **chìa khoá xoay** (`keyTurn`) cho "Tự lái". Phân tách hairline.
5. **05 · Đánh giá — "Bà con tin tưởng"** — **marquee** trôi ngang liền mạch: thẻ `flex:0 0 300px` +
   `margin-right:14px`, track **2 bản** danh sách, `translateX(0)→-50%` `linear ~52s`, **mask mờ 2 mép**,
   **chạm/hover → paused**. reduced-motion → wrap xuống dòng. Sao cobalt + câu "…" + "— Tên, địa phương".
6. **06 · Đối tác** — thẻ "Bạn có xe muốn cho thuê?" + nút ghost "Trở thành đối tác ↗".
7. **07 · Vị trí — "Ghé nhà xe"** — địa chỉ + **bản đồ nhúng**.
   ⚠️ Google `output=embed` **bị chặn iframe** (`ERR_BLOCKED_BY_RESPONSE`) — KHÔNG dùng. Đang dùng
   **OpenStreetMap** (keyless): `https://www.openstreetmap.org/export/embed.html?bbox=<minlon,minlat,maxlon,maxlat>&layer=mapnik&marker=<lat,lng>`,
   `filter:grayscale(.15)`, placeholder "Đang tải bản đồ…". Toạ độ **`10.534045, 105.16464`**.
   Nút "Chỉ đường" → `BRAND.mapLink` (Google Maps app). *(Có key → đổi sang Maps Embed API.)*
8. **08 · Đến nơi (Footer, nền `stage`)** — tên nhà xe, chủ xe, các dòng: địa chỉ (bấm mở map),
   SĐT (gọi), Zalo, Facebook; nút "Chỉ đường tới nhà xe". Chừa `padding-bottom ~130px` cho sticky bar.

## MÀN HÌNH 2 — CHI TIẾT XE
1. **Back bar** sticky kính mờ nền tối (chevron-left + tên xe).
2. **Car3DViewer** — `<model-viewer>` trên sân khấu tối (~420px): `camera-controls auto-rotate
   auto-rotate-delay=3000 rotation-per-second=14deg shadow-intensity=1.1 exposure=0.9 ar
   ar-modes="webxr scene-viewer quick-look" loading="eager"`. Overlay: nhãn "MÔ HÌNH 3D",
   gesture hint tự fade ~5.5s, nút AR "Xem trong sân nhà bạn" (`mv.activateAR()`). Trạng thái tải
   (poster tối + spinner), fallback ảnh thật khi `error`. (Hiện ToyCar mẫu từ jsDelivr — **thay .glb thật**.)
3. Tên xe (h1 30px) + số chỗ + loại.
4. **CarGallery** — ảnh thật vuốt ngang `scroll-snap` (mỗi ảnh 84%), nút chevron, thanh tiến trình đoạn.
5. **Mô tả** ngắn.
6. **PriceTable** — 2 hàng Có tài xế/Tự lái, số 24px/800; **nếu khuyến mãi**: chip "Ưu đãi" cạnh "Bảng giá"
   + **giá gạch** cạnh giá mới. Ghi chú phụ phí bên dưới.
7. **OwnerCard** — ảnh tròn + "Chủ xe / Anh Hiếu" + badge cobalt "Uy tín".
8. Cặp CTA Gọi ngay / Nhắn Zalo cuối nội dung.

## StickyContactBar (cả 2 màn)
Cố định đáy, **căn giữa cột** (`left:50%; transform:translateX(-50%); max-width:448px`), **kính mờ**
(`backdrop-filter: blur(18px) saturate(1.4)`). Gọi ngay (ink) + Nhắn Zalo (ghost). `padding-bottom` + safe-area.

## ContactSheet — 4 kiểu (xem `snippets/hooks/useContact.ts` + `ContactSheet.tsx`)
`"call" | "zalo" | {kind:"service", service} | {kind:"quote", data}`. Sheet trượt từ đáy (`sheetUp`),
luôn có **cả Gọi & Zalo**; kiểu `service` thêm chip xe gợi ý (bấm → chi tiết); kiểu `quote` thêm hộp tóm tắt.

---

## Tương tác & chuyển động (chỉ `transform`/`opacity` — mượt máy yếu; mọi thứ có `prefers-reduced-motion`)
- **Reveal khi cuộn**: fade + dịch (biến thể up/up-lg/left/scale/mask qua `--rv-hidden`), IntersectionObserver
  `root=.page`; **bắt buộc fallback** hiện nội dung sau ~1.3–1.4s (không kẹt opacity 0).
- **Chapter tự biên đạo** khi `.show`: `.chapter-num` hiện, `.chapter-rule` `scaleX(0→1)`, `.chapter-tag` &
  `.chapter-label` trồi lên (stagger qua transition-delay).
- **JourneyRail**: `requestAnimationFrame`; xe `translateY` theo % cuộn; `.spine-fill` cao dần; `.node` bật `.on`;
  **đèn**: `.adv`/`.rev`/`.brake` theo hướng cuộn (rev = `revBlink` đỏ; reduced-motion → đỏ tĩnh).
- **Hero**: `driveIn` (chữ) + Ken Burns (ảnh) + `dotPulse` (chấm).
- **CarStack**: sticky stacking (không phải transform). **DriveOptions**: `steerRock` / `keyTurn`.
- **Marquee** đánh giá; **StickyBar** `barUp` khi tải; **chuyển màn** Home↔Detail fade + **reset scroll `.page` về top**.
- `:active` nút `scale(.975)`.

## State (xem `reference/app/app2.jsx`)
`screen:'home'|'detail'`, `selectedCar`, `sheet: ContactState`. Đổi màn → cuộn `.page` về top.
Dữ liệu xe/dịch vụ: `snippets/config/cars.ts` (CARS có promo, SERVICES, TESTIMONIALS, SVC_SUGGEST, parsePrice/formatVnd).

## Assets cần thay
- **Ảnh xe thật**: 3 ảnh Hero (showcase) + dải gallery mỗi xe + ảnh thẻ — hiện placeholder sọc + nhãn mono.
- **File .glb** 3D từng xe (+ poster) — hiện ToyCar mẫu.
- **Giá/khuyến mãi**: số ưu đãi + giá gạch + thời hạn ("tháng 6"…) đang là mẫu — thay số thật trong `cars.ts`.
- **Liên hệ (đã điền)**: Thuê Xe Trung Hiếu · ĐT/Zalo **0326120108** · Khu dân cư kênh 10, ấp Bờ Dâu,
  xã Thạnh Mỹ Tây, Tỉnh An Giang · chủ xe Anh Hiếu · Maps `https://maps.app.goo.gl/ptcb9NfjbUnhGPRb7` ·
  Toạ độ `10.534045, 105.16464`. Tất cả trong `snippets/config/brand.ts`.

## Files tham chiếu (V2)
- `reference/index.html` — tokens + **TOÀN BỘ CSS** (port sang globals.css) + thứ tự load.
- `reference/app/data.jsx` — BRAND + CARS (promo) + SERVICES + TESTIMONIALS.
- `reference/app/icons.jsx` — bộ icon (map sang lucide-react cùng tên: phone, chat→MessageCircle, users→Users, steering, keyRound, stethoscope, heart, palm→TreePalm, navigation, cube→Box, rotate3d→Rotate3d, sparkle→Sparkles…).
- `reference/app/ui.jsx` — Reveal (+fallback, biến thể), Photo placeholder, Stars, Eyebrow.
- `reference/app/rail.jsx` — **JourneyRail (xe + đèn theo scroll) + Chapter (tự biên đạo)**.
- `reference/app/home2.jsx` — Hero+HeroShowcase, 8 chương, CarCard (promo), **EstimatorChapter/QuickQuote**, DriveOptions, Marquee, Footer.
- `reference/app/detail.jsx` — Car3DViewer, CarGallery, PriceTable (promo), OwnerCard.
- `reference/app/app2.jsx` — routing, StickyContactBar, **ContactSheet 4 kiểu**, onService/onQuote/onPickCar.

## Snippets TypeScript (scaffold sẵn type)
- `snippets/config/brand.ts` · `snippets/config/cars.ts` (CARS+promo, SERVICES, SVC_SUGGEST, parsePrice/formatVnd).
- `snippets/components/JourneyRail.tsx` (JourneyRail + Chapter) · `HeroShowcase.tsx` · `QuickQuote.tsx` · `ContactSheet.tsx` (4 kiểu) · `StickyContactBar.tsx` · `Car3DViewer.tsx` · `MapEmbed.tsx` · `Reveal.tsx`.
- `snippets/hooks/useContact.ts` (4 kiểu) · `useReveal.ts` · `snippets/types/model-viewer.d.ts` · `snippets/tailwind.config.ts` · `snippets/app/globals.snippet.css`.
