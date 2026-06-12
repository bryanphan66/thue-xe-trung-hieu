-- ============================================================
-- Bổ sung cột `kind` cho car_photos để hỗ trợ ẢNH XOAY 360°.
-- Chạy 1 lần trong Supabase SQL Editor (an toàn nếu chạy lại).
-- DB đã tạo trước đó (chưa có cột này) thì chạy file này.
-- ============================================================

alter table car_photos
  add column if not exists kind text default 'photo';
--  'photo'      = ảnh gallery thường
--  'spin_frame' = một khung trong chuỗi ảnh xoay 360°

-- Cách thêm ảnh xoay 360° cho 1 xe (ví dụ Innova):
--   1) Upload các khung ảnh lên Supabase Storage, copy public URL từng tấm.
--   2) Chèn vào car_photos với kind = 'spin_frame', sort_order = 0,1,2,... theo thứ tự vòng quay:
--
--   insert into car_photos (car_id, url, kind, sort_order) values
--     ((select id from cars where slug = 'innova'), 'https://.../frame-00.jpg', 'spin_frame', 0),
--     ((select id from cars where slug = 'innova'), 'https://.../frame-01.jpg', 'spin_frame', 1),
--     ...;
--
-- Cần >= 8 khung mới bật chế độ xoay (24-36 khung là mượt nhất).
-- Ảnh gallery thường: chèn như trên nhưng để kind = 'photo' (hoặc bỏ trống).
