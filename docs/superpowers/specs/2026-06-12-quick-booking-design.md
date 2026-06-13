# Spec: Đặt xe nhanh (chỉ 1 SĐT) + báo Telegram

**Ngày:** 2026-06-12 · **Trạng thái:** Đã duyệt, triển khai

## Mục tiêu
Cho khách **để lại SĐT** đặt xe trong vài giây; chủ xe nhận **thông báo Telegram tức thì**; lưu Supabase để tra cứu. KHÔNG portal admin (dùng Supabase Table Editor).

## Flow khách
- Nút "Để nhà xe gọi lại" ở: sheet Báo giá (sau QuickQuote) + mỗi thẻ số chỗ.
- Form tối giản: **SĐT bắt buộc** (bàn phím số) + **Tên tùy chọn**. Tự đính kèm ngữ cảnh (số chỗ/hình thức/số ngày/tạm tính nếu từ báo giá; loại số chỗ nếu từ thẻ).
- Gửi → "Đã nhận, nhà xe gọi lại ngay" + nút Gọi luôn / Zalo (cho ai vội).

## Phía chủ xe
- **Telegram**: mỗi đơn 1 tin (SĐT + tên + tóm tắt). Bot qua @BotFather; token + chat id để ở Dokploy env (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`).
- **Supabase** bảng `bookings` (phone, name, seats/mode/days/far/total, note, source, status, created_at) + RLS insert công khai (giống partner_inquiries).

## Kỹ thuật
- Mở rộng hệ thống contact: thêm mode `{kind:'book', ctx}` trong `useContact`/`ContactProvider`; bỏ mode `quote` (gộp vào book).
- `ContactSheet` thêm form đặt xe (client state) khi mode = book.
- Server action `submitBooking(input)`: validate SĐT → insert `bookings` (best-effort) → gọi Telegram Bot API (best-effort). Thiếu cấu hình vẫn trả "đã nhận".
- File `supabase/bookings.sql` (Trung chạy 1 lần). Telegram env set sau khi có bot.

## Ngoài phạm vi
Portal admin; xác thực OTP SĐT; chọn ngày giờ cụ thể; thanh toán.
