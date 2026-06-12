# Spec: Định giá theo SỐ CHỖ (thay vì theo hãng xe)

**Ngày:** 2026-06-12 · **Trạng thái:** Đã duyệt, triển khai

## Bối cảnh
Ở quê, khách thuê xe nghĩ theo **số chỗ** (5/7/16 chỗ), **tự lái hay có tài xế**, **đi xa không**, và **mục đích** (cưới/du lịch/khám bệnh) — không quan tâm hãng Toyota/Kia. UI V2 hiện gắn giá theo từng chiếc xe cụ thể (theo tên hãng).

## Quyết định (đã chốt với người dùng)
- Giá = **số chỗ + tự lái/có tài xế + đi xa**. Mục đích **không** đổi giá (chỉ điều hướng); xe cưới có thể có phụ phí trang trí (ghi chú).
- Trình bày **theo số chỗ** nhưng **vẫn show xe thật** (ảnh + tên) để tạo tin tưởng.
- "Đi xa/qua đêm" = **báo giá khi gọi** (không tính cứng theo km).
- Nguồn giá: **giữ giá trên từng xe trong Supabase**; web **tự gom theo số chỗ** (không đổi schema). Loại có nhiều xe khác giá → hiển thị "từ [giá thấp nhất]".

## Thiết kế
**Gom nhóm:** hàm thuần `groupCarsBySeats(cars)` → danh sách `SeatGroup { seats, label, priceDriver, priceSelf, oldPriceDriver, oldPriceSelf, promo, cars[], multiple }`. Giá đại diện = xe rẻ nhất trong nhóm; `multiple=true` khi nhóm có >1 xe (hiển thị "từ").

**Trang chủ:**
1. Chương 02 "Đội xe" → "Thuê theo số chỗ": mỗi `SeatGroup` là 1 thẻ (sticky stack) — số chỗ lớn + 2 cột giá (tài xế/tự lái, giá gạch + chip Ưu đãi nếu có) + danh sách xe thật (ảnh + tên + "Xem chi tiết"). Ghi chú: đi xa báo giá khi gọi; xe cưới có thể phụ phí trang trí.
2. Chương 03 QuickQuote: chọn **Số chỗ** (chip) → hình thức (khoá tự lái nếu nhóm không có) → số ngày → toggle đi xa → tạm tính = giá ngày nhóm × số ngày. `QuoteRequest` đổi `carName/carSlug` → `label` (= "7 chỗ").
3. Chương 01 Dịch vụ: giữ điều hướng. `SVC_SUGGEST` đổi từ tên xe → **số chỗ gợi ý** theo mục đích. ContactSheet "service" hiện chip **loại số chỗ**; bấm → mở chi tiết xe đại diện của nhóm.

**Trang chi tiết xe:** giữ nguyên (per-car), nhấn mạnh "X chỗ".

## Phạm vi
Sửa: `lib/seatGroups.ts` (mới), `components/JourneyHome.tsx`, `components/QuickQuote.tsx`, `components/ContactSheet.tsx`, `hooks/useContact.ts` (QuoteRequest), `config/services.ts` (SVC_SUGGEST→seats). **Không** đổi schema Supabase, không đổi domain.

## Ngoài phạm vi
Bảng giá riêng theo số chỗ trong DB; tính phí đi xa theo km; gói giá theo mục đích.
