-- ============================================================
-- Thuê Xe An Giang — Supabase schema
-- Chạy trong Supabase SQL Editor. Thiết kế multi-vendor sẵn.
-- App dùng fixtures khi chưa cấu hình env; điền env là tự dùng dữ liệu thật.
-- ============================================================

-- Chủ xe
create table if not exists owners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  zalo text,
  facebook text,
  photo_url text,
  address text,
  is_primary boolean default false,
  created_at timestamptz default now()
);

-- Xe
create table if not exists cars (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references owners(id) on delete cascade,
  slug text unique not null,              -- id thân thiện URL: vios / innova ...
  name text not null,                     -- "Toyota Vios"
  type text,                              -- "Sedan · 4 chỗ"
  seats int,
  description text,
  price_with_driver numeric,              -- giá có tài xế / ngày
  price_self_drive numeric,               -- giá tự lái / ngày (null = chưa áp dụng)
  badge text,                             -- "Phổ biến nhất" | "Xe cưới" | null
  photo_count int default 0,              -- số ảnh placeholder khi chưa có ảnh thật
  model_3d_url text,                      -- .glb mô hình 3D (null = model mẫu)
  poster_url text,                        -- poster ảnh thật fallback cho 3D
  available boolean default true,
  featured boolean default false,
  created_at timestamptz default now()
);

-- Ảnh xe thật
create table if not exists car_photos (
  id uuid primary key default gen_random_uuid(),
  car_id uuid references cars(id) on delete cascade,
  url text not null,
  sort_order int default 0,
  kind text default 'photo'   -- 'photo' = ảnh gallery | 'spin_frame' = khung ảnh xoay 360°
);

-- Yêu cầu của chủ xe khác muốn tham gia
create table if not exists partner_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  car_info text,
  note text,
  status text default 'new',              -- new | contacted | added
  created_at timestamptz default now()
);

-- Đánh giá / lời nhận xét
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  content text not null,
  place text,                             -- địa phương của khách
  rating int check (rating between 1 and 5),
  approved boolean default false,
  created_at timestamptz default now()
);

-- ===== RLS =====
alter table owners enable row level security;
alter table cars enable row level security;
alter table car_photos enable row level security;
alter table partner_inquiries enable row level security;
alter table testimonials enable row level security;

create policy "public read owners" on owners for select using (true);
create policy "public read cars" on cars for select using (true);
create policy "public read photos" on car_photos for select using (true);
create policy "public read approved testimonials" on testimonials
  for select using (approved = true);
create policy "public insert partner" on partner_inquiries
  for insert with check (true);
create policy "public insert testimonial" on testimonials
  for insert with check (true);
