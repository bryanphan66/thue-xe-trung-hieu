-- ============================================================
-- Bảng `bookings` — đơn "để nhà xe gọi lại" (đặt xe nhanh).
-- Chạy 1 lần trong Supabase SQL Editor.
-- ============================================================

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  name text,
  seats int,                 -- số chỗ khách quan tâm
  mode text,                 -- 'driver' | 'self'
  days int,
  far boolean,
  total numeric,             -- tạm tính (nếu từ báo giá)
  note text,                 -- tóm tắt / mục đích
  source text,               -- 'quote' | 'seat' | ...
  status text default 'new', -- new | called | booked | cancelled
  created_at timestamptz default now()
);

alter table bookings enable row level security;

-- Cho phép web (khóa anon/publishable) GHI đơn; KHÔNG cho đọc công khai
-- (chủ xe xem trong Table Editor hoặc qua service key).
create policy "public insert bookings" on bookings
  for insert with check (true);
