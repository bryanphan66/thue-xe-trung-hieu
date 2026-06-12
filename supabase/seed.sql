-- ============================================================
-- Thuê Xe Trung Hiếu — Dữ liệu khởi tạo (seed)
-- Chạy SAU file schema.sql. Nạp 1 chủ xe + 4 xe + vài đánh giá thật.
-- Chạy lại được nhiều lần (idempotent nhờ on conflict).
-- ============================================================

-- 1) Chủ xe chính (Anh Hiếu)
insert into owners (name, phone, zalo, facebook, address, is_primary)
values (
  'Anh Hiếu',
  '0326120108',
  '0326120108',
  'fb.com/thuexetrunghieu',
  'Khu dân cư kênh 10, ấp Bờ Dâu, xã Thạnh Mỹ Tây, Tỉnh An Giang',
  true
)
on conflict do nothing;

-- 2) Bốn xe — gắn vào chủ chính qua subquery owner_id.
--    slug là duy nhất → on conflict (slug) do nothing để chạy lại an toàn.
insert into cars (owner_id, slug, name, type, seats, description,
                  price_with_driver, price_self_drive, badge, photo_count, available, featured)
values
  ((select id from owners where is_primary limit 1),
   'vios', 'Toyota Vios', 'Sedan · 4 chỗ', 4,
   'Xe gầm thấp êm ái, tiết kiệm — phù hợp đi khám bệnh, đưa đón trong thành phố và đường gần.',
   1200000, 700000, 'Phổ biến nhất', 5, true, true),

  ((select id from owners where is_primary limit 1),
   'innova', 'Toyota Innova', 'MPV · 7 chỗ', 7,
   'Rộng rãi cho gia đình, khoang hành lý lớn — lựa chọn tốt cho đi du lịch và về quê.',
   1500000, 900000, null, 6, true, false),

  ((select id from owners where is_primary limit 1),
   'cx5', 'Mazda CX-5', 'SUV · 5 chỗ', 5,
   'Gầm cao, ngoại hình sang — hay được chọn làm xe hoa, rước dâu và đi sự kiện.',
   1600000, 1000000, 'Xe cưới', 5, true, false),

  ((select id from owners where is_primary limit 1),
   'transit', 'Ford Transit', 'Van · 16 chỗ', 16,
   'Sức chứa lớn cho đoàn đông người — du lịch tập thể, đưa đón sự kiện, đi xa cả nhóm.',
   2200000, null, null, 4, true, false)
on conflict (slug) do nothing;

-- 3) Đánh giá khách (đã duyệt sẵn để hiển thị ngay)
insert into testimonials (author_name, content, place, rating, approved)
values
  ('Cô Bảy',  'Xe sạch sẽ, anh tài xế chạy êm, tới bệnh viện đúng giờ hẹn. Lần sau tôi vẫn gọi.', 'xã Thạnh Mỹ Tây', 5, true),
  ('Anh Hùng','Thuê xe cưới ở đây rất ưng, xe đẹp mà giá phải chăng. Cảm ơn nhà xe.',           'Châu Phú',         5, true),
  ('Chị Lan', 'Gọi một cuộc là có xe, đi xa yên tâm. Bác tài vui vẻ, đáng tin.',                'TP. Long Xuyên',   5, true),
  ('Anh Phát','Thuê tự lái về quê dịp Tết, thủ tục nhanh gọn, xe giao tận nhà. Rất hài lòng.',  'Tân Châu',         5, true),
  ('Cô Hạnh', 'Cả nhà đi du lịch Vũng Tàu, xe 7 chỗ rộng rãi, bác tài chạy an toàn.',          'Chợ Mới',          5, true),
  ('Anh Khoa','Giá rõ ràng, không phát sinh lắt nhắt. Mình giới thiệu cho mấy người quen luôn.','Thoại Sơn',        5, true)
on conflict do nothing;
