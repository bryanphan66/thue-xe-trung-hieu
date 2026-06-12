# Prompt dán cho Claude Code — bản V2 "Một hành trình"

> Kéo cả thư mục `design_handoff_thue_xe/` vào Claude Code, rồi dán nguyên đoạn dưới.

---

```
Dựng lại bộ giao diện V2 trong design_handoff_thue_xe/ thành một web app thật.

NGUỒN CHÂN LÝ
- Đọc design_handoff_thue_xe/README.md (bản V2 "Một hành trình") để nắm concept, 8 chương,
  tương tác, animation, và các lưu ý kỹ thuật.
- reference/ là prototype HTML/React-Babel — bám SÁT pixel/spacing/màu/typography/animation;
  VIẾT LẠI bằng component sạch, KHÔNG copy nguyên.
- reference/index.html chứa TOÀN BỘ CSS (class .spine/.chapter/.est-card/.hero-show/.car .light…):
  PORT NGUYÊN khối <style> này vào app/globals.css (thiết kế dùng plain CSS class cho phần
  "hành trình"/estimator, không phải tất cả bằng Tailwind utility).
- snippets/ là scaffold TypeScript đã gõ type — chép và dùng làm điểm khởi đầu:
  config/brand.ts, config/cars.ts, hooks/{useContact,useReveal}.ts, types/model-viewer.d.ts,
  components/{JourneyRail,HeroShowcase,QuickQuote,ContactSheet,StickyContactBar,Car3DViewer,MapEmbed,Reveal}.tsx,
  app/globals.snippet.css.

STACK
- Next.js (App Router) + TypeScript + Tailwind CSS (snippets/tailwind.config.ts đã map token).
- Font Be Vietnam Pro + JetBrains Mono qua next/font/google.
- Icon: lucide-react (map theo reference/app/icons.jsx).
- 3D: @google/model-viewer ('use client'/dynamic), loading="eager".

⚠️ KỸ THUẬT QUAN TRỌNG NHẤT
- Hiệu ứng hành trình chạy theo scroll của CONTAINER `.page` (cột giới hạn bề ngang,
  height:100dvh; overflow-y:auto), KHÔNG phải window. JourneyRail nghe scroll trên .page;
  Chapter dùng IntersectionObserver root=.page. Giữ nguyên mô hình 1 cột .page cuộn nội bộ.
- CarStack ("Đội xe") dùng position:sticky → ĐỪNG bọc thẻ trong Reveal (transform của Reveal
  làm hỏng sticky). Để stacking chính là animation.
- Mọi animation chỉ transform/opacity + requestAnimationFrame; MỌI hiệu ứng có nhánh
  prefers-reduced-motion (rất quan trọng cho máy yếu/người lớn tuổi).

THƯƠNG HIỆU (snippets/config/brand.ts — đừng hardcode rải rác)
- Thuê Xe Trung Hiếu · chủ xe Anh Hiếu · ĐT & Zalo 0326120108
  (tel:0326120108 / https://zalo.me/0326120108).
- Địa chỉ: Khu dân cư kênh 10, ấp Bờ Dâu, xã Thạnh Mỹ Tây, Tỉnh An Giang.
- Google Maps (nút Chỉ đường): https://maps.app.goo.gl/ptcb9NfjbUnhGPRb7
- Toạ độ ghim: 10.534045, 105.16464

DỰNG 8 CHƯƠNG (trang chủ) — xem chi tiết trong README
- Hero (nền tối): h1 "drive-in & brake" 3 dòng + HeroShowcase (carousel 3 xe, tự lướt, chấm, pause) + 2 CTA.
- 01 Dịch vụ: 4 hàng BẤM ĐƯỢC → ContactSheet kiểu "service" (chip xe gợi ý bấm mở chi tiết).
- 02 Đội xe: CarStack sticky xếp chồng; CarCard có khuyến mãi (chip "Ưu đãi" viền ink + giá gạch, KHÔNG đỏ).
- 03 Báo giá: QuickQuote (chọn xe→hình thức→số ngày→đi xa→tạm tính) → "Gửi yêu cầu" → ContactSheet kiểu "quote".
- 04 Tự lái/tài xế: icon vô lăng lắc (steerRock) + chìa khoá xoay (keyTurn).
- 05 Đánh giá: marquee trôi ngang, mask 2 mép, chạm→paused.
- 06 Đối tác. 07 Vị trí: bản đồ OpenStreetMap keyless (KHÔNG dùng google output=embed — bị chặn iframe).
- 08 Footer "Đến nơi" (nền tối) + JourneyRail/Chapter bao quanh tất cả.

JOURNEYRAIL (điểm nhấn V2)
- Mạch mảnh mép trái: .spine + .spine-fill (đổ cobalt) + .rail-start + .rail-dest (ghim) + .rail-car.
- Xe tí hon translateY theo % cuộn; .node bật cobalt khi xe qua.
- ĐÈN theo hướng cuộn: xuống→.adv (đèn pha trắng), lên→.rev (đèn hậu đỏ nhấp nháy revBlink),
  dừng ~170ms→.brake (đèn phanh đỏ đều). reduced-motion → đỏ tĩnh.

CHI TIẾT XE
- Car3DViewer (model-viewer, sân khấu tối, auto-rotate, AR, trạng thái tải/fallback — TODO thay .glb thật).
- CarGallery (vuốt ngang snap), PriceTable (có giá gạch + chip ưu đãi), OwnerCard, CTA Gọi/Zalo.

CÒN THIẾU (chỉ chủ xe cấp): ảnh xe thật (3 hero + gallery), file .glb 3D, số giá ưu đãi/thời hạn thật.

A11y cơ bản (alt, aria-label nút icon, focus-visible), build sạch, tôn trọng prefers-reduced-motion.
```

---

## Đổi so với gói V1 (nếu bạn từng nhận bản trước)
Gói này đã thay `reference/` sang **V2** (rail.jsx/home2.jsx/app2.jsx) và bổ sung snippet mới:
`config/cars.ts`, `components/JourneyRail.tsx`, `HeroShowcase.tsx`, `QuickQuote.tsx`, và
`ContactSheet.tsx` + `hooks/useContact.ts` nâng lên **4 kiểu** (call/zalo/service/quote).

## Còn thiếu (chỉ chủ xe cung cấp được)
- **Ảnh xe thật**: 3 ảnh Hero (showcase) + dải gallery mỗi xe + ảnh thẻ.
- **File `.glb`** mô hình 3D từng xe (+ poster). Chưa có thì giữ placeholder/model mẫu.
- **Số giá ưu đãi + thời hạn thật** (đang là mẫu trong `config/cars.ts`).
- Toạ độ đã chính xác; muốn ô nhúng kiểu Google → tạo `NEXT_PUBLIC_GOOGLE_MAPS_KEY`.
