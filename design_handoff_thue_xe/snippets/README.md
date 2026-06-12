# snippets/ — file dán thẳng vào dự án Next.js

Các file production-ready để Claude Code khởi động nhanh. Bám đúng tokens/spec trong `../README.md`.

| File | Đặt vào | Việc |
|---|---|---|
| `tailwind.config.ts` | gốc dự án | Tokens màu, bo góc, font, keyframes/animation. |
| `config/brand.ts` | `config/brand.ts` | Thông tin thương hiệu/liên hệ + toạ độ bản đồ ở MỘT chỗ. |
| `config/cars.ts` | `config/cars.ts` | **V2** · type `Car` + `CARS` (có promo/giá gạch), `SERVICES`, `TESTIMONIALS`, `SVC_SUGGEST`, `parsePrice`/`formatVnd`. |
| `components/JourneyRail.tsx` | `components/` | **V2** · `JourneyRail` (mạch mép trái + xe + đèn theo hướng cuộn) + `Chapter` (tự biên đạo). Nghe scroll trên `.page`. |
| `components/HeroShowcase.tsx` | `components/` | **V2** · carousel Hero 3 xe (tự lướt, chấm, tạm dừng khi chạm). |
| `components/QuickQuote.tsx` | `components/` | **V2** · "Báo giá nhanh" (chọn xe/hình thức/số ngày/đi xa → tạm tính → `onQuote`). |
| `components/ContactSheet.tsx` | `components/` | **V2** · sheet 4 kiểu: call/zalo/service(chip xe gợi ý)/quote(tóm tắt). |
| `hooks/useContact.ts` | `hooks/` | **V2** · `{ open, call, zalo, service, quote, close }`, type `ContactState`. |
| `components/MapEmbed.tsx` | `components/` | Bản đồ nhúng: OSM (keyless, mặc định) hoặc Google Embed API (cần key). |
| `hooks/useReveal.ts` | `hooks/` | IntersectionObserver + fallback. Trả `{ ref, shown }`. |
| `components/Reveal.tsx` | `components/` | Wrapper dùng useReveal; biến thể up/up-lg/left/right/scale/mask. |
| `components/Car3DViewer.tsx` | `components/` | model-viewer (sân khấu tối, auto-rotate, AR, loading, fallback). |
| `components/StickyContactBar.tsx` | `components/` | Thanh liên hệ kính mờ cố định đáy (Gọi/Zalo). |
| `types/model-viewer.d.ts` | `types/` | Khai báo JSX cho `<model-viewer>`. |
| `app/globals.snippet.css` | nối vào `app/globals.css` | `.reveal` + biến thể, `.marquee`, **+ toàn bộ CSS V2** (.page/.spine/.car đèn/.chapter/.svc-row/.car-stack/.promo/.est-*/.hero-show), `prefers-reduced-motion`. |
| `.env.local.example` | copy thành `.env.local` | Chỉ cần khi dùng bản đồ kiểu Google. |

## Thứ tự dựng gợi ý
1. `npx create-next-app@latest --ts --tailwind --app`
2. Chép `tailwind.config.ts`, `config/brand.ts`, `components/MapEmbed.tsx`; nối `globals.snippet.css`.
3. Cài: `npm i lucide-react @google/model-viewer`. Đảm bảo `tsconfig.json` có `"include": [..., "types/**/*.ts"]`.
4. Khai báo font Be Vietnam Pro + JetBrains Mono bằng `next/font/google` trong `app/layout.tsx`
   (xem comment đầu `tailwind.config.ts`), gán `--font-sans` / `--font-mono`.
5. Class `.reveal` → `.reveal.in` đã có hook sẵn (`hooks/useReveal.ts` + `components/Reveal.tsx`).
6. Dựng từng section theo `../README.md` và đối chiếu `../reference/`.

## Ráp thanh liên hệ + sheet 4 kiểu (ví dụ)
```tsx
const c = useContact();
const openCar = (car) => { c.close(); /* setScreen('detail') + setCar(car) */ };
// ...trong layout của cả 2 trang:
<StickyContactBar onCall={c.call} onZalo={c.zalo} />
<ContactSheet open={c.open} onClose={c.close} onPickCar={openCar} />
// chương 01: <button className="svc-row" onClick={() => c.service(s)}> ... </button>
// chương 03: <QuickQuote onQuote={c.quote} />
```

## Lưu ý bản đồ (quan trọng)
- **KHÔNG** nhúng `maps.google.com/...&output=embed` → bị chặn iframe (`ERR_BLOCKED_BY_RESPONSE`).
- Mặc định dùng **OpenStreetMap** (đã ghim đúng `10.534045, 105.16464`). Muốn kiểu Google → set
  `<MapEmbed provider="google" />` + `NEXT_PUBLIC_GOOGLE_MAPS_KEY` trong `.env.local`.
