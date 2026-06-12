# Hướng dẫn quản lý — Thuê Xe An Giang

> Tài liệu này dành cho **anh Trung (chủ xe)**. Web không cần biết lập trình vẫn quản lý được:
> mọi dữ liệu xe, ảnh, đánh giá, yêu cầu đối tác đều nằm trong **Supabase** — bấm chuột là sửa được.

---

## 0. Nhìn tổng quan (đọc 1 phút)

- Trang web giống một **tờ rơi điện tử bấm gọi được**. Khách xem xe → bấm **GỌI** hoặc **NHẮN ZALO**.
- Khi **chưa cài Supabase**, web tự chạy với **dữ liệu mẫu** (4 xe demo) để xem thử. Cài Supabase xong, web **tự chuyển sang dữ liệu thật** — không phải sửa code.
- Số điện thoại / Zalo / địa chỉ / bản đồ nằm trong file `config/brand.ts`. Muốn đổi số → sửa 1 chỗ đó (nhờ người kỹ thuật) rồi đăng lại.

---

## 1. Lần đầu: tạo Supabase (làm 1 lần)

1. Vào https://supabase.com → **Sign in** (đăng nhập bằng Google cho nhanh).
2. Bấm **New project**. Đặt tên (vd `thue-xe-trung-hieu`), chọn region **Southeast Asia (Singapore)**, đặt **Database Password** (lưu lại).
3. Đợi vài phút cho project khởi tạo xong.

### 1.1. Tạo các bảng dữ liệu

1. Menu trái → **SQL Editor** → **New query**.
2. Mở file `supabase/schema.sql` trong dự án, **copy toàn bộ** dán vào ô SQL.
3. Bấm **Run**. Báo "Success" là xong — đã tạo các bảng: `owners`, `cars`, `car_photos`, `partner_inquiries`, `testimonials`.

### 1.2. Lấy 2 khóa kết nối

Menu trái → **Project Settings → API**, copy 2 giá trị:
- **Project URL** → dán vào biến `NEXT_PUBLIC_SUPABASE_URL`
- **anon public key** → dán vào biến `NEXT_PUBLIC_SUPABASE_ANON_KEY`

(Cách điền 2 biến này lên web ở **mục 6 — Đăng web lên Vercel**.)

---

## 2. Thêm chủ xe & xe đầu tiên

Menu trái → **Table Editor**.

### 2.1. Thêm chủ xe (bảng `owners`)

Mở bảng `owners` → **Insert → Insert row**:

| Cột | Điền gì |
|-----|---------|
| `name` | Anh Trung |
| `phone` | 0326120108 |
| `zalo` | 0326120108 |
| `address` | Khu dân cư kênh 10, ấp Bờ Dâu, xã Thạnh Mỹ Tây, Tỉnh An Giang |
| `is_primary` | bật **true** (đây là chủ chính) |

Bấm **Save**. Copy lại giá trị cột `id` (dạng dài) để gán cho xe ở bước sau.

### 2.2. Thêm xe (bảng `cars`)

Mở bảng `cars` → **Insert row**:

| Cột | Điền gì | Ghi chú |
|-----|---------|---------|
| `owner_id` | dán `id` của chủ xe vừa tạo | bắt buộc |
| `slug` | `vios` | chữ thường, không dấu, không khoảng trắng — sẽ thành địa chỉ `…/xe/vios` |
| `name` | Toyota Vios | tên hiển thị |
| `type` | Sedan · 4 chỗ | |
| `seats` | 4 | |
| `description` | Xe gầm thấp êm ái, tiết kiệm… | mô tả ngắn |
| `price_with_driver` | 1200000 | **chỉ số, không dấu chấm** |
| `price_self_drive` | 700000 | để trống nếu không cho tự lái |
| `badge` | Phổ biến nhất | để trống nếu không cần nhãn |
| `available` | true | bật mới hiển thị |
| `featured` | true | xe nổi bật lên đầu danh sách |

> **Giá:** nhập số nguyên (1200000), web tự thêm dấu chấm → hiển thị `1.200.000đ/ngày`. Để trống `price_self_drive` → web ghi "Liên hệ".

---

## 3. Thêm ảnh xe (bảng `car_photos`)

Ảnh thật giúp bà con tin tưởng. Hai bước:

1. **Tải ảnh lên Storage:** menu trái → **Storage** → tạo bucket công khai (vd `cars`) → upload ảnh → bấm vào ảnh, copy **public URL**.
2. **Gắn ảnh vào xe:** mở bảng `car_photos` → **Insert row**:
   - `car_id` = `id` của xe
   - `url` = link ảnh vừa copy
   - `sort_order` = 0, 1, 2… (số nhỏ hiện trước)

**Nên chụp đủ các góc** (sắp `sort_order` theo thứ tự này): mặt trước → chéo 45° → hông → sau → nội thất → taplo → cốp. Chụp ngang, đủ sáng, nền gọn.

> Khi đã có ảnh thật, web tự dùng ảnh thật thay cho ô placeholder. (Sau này muốn xem xoay 360° bằng ảnh thật vẫn dùng được bảng này — không phải đổi cấu trúc.)

---

## 4. Việc làm thường ngày

| Muốn làm gì | Vào bảng | Thao tác |
|-------------|----------|----------|
| **Tạm ẩn 1 xe** (đang bận/đang sửa) | `cars` | sửa `available` → **false**. Bật lại → **true** |
| **Đổi giá** | `cars` | sửa `price_with_driver` / `price_self_drive` |
| **Cho xe lên đầu** | `cars` | bật `featured` = true |
| **Xem khách muốn hợp tác** | `partner_inquiries` | đọc `name`, `phone`, `car_info`; gọi lại rồi đổi `status` = `contacted`/`added` |
| **Duyệt đánh giá khách** | `testimonials` | đánh giá mới có `approved` = false (chưa hiện). Đọc xong, nếu OK → đổi `approved` = **true** mới hiển thị lên web |
| **Thêm chủ xe thứ 2** | `owners` rồi `cars` | thêm `owner` mới (is_primary = false) + `cars` của họ — web tự hiện thêm, **không sửa code** |

> **Đánh giá để duyệt:** ai cũng gửi đánh giá được nhưng **mặc định bị ẩn** (`approved = false`). Chỉ những cái anh bật `approved = true` mới lên web → tránh spam.

---

## 5. Mô hình 3D (tùy chọn, làm sau cũng được)

- Mặc định trang chi tiết xe dùng **một mô hình 3D mẫu** trên "sân khấu" tối.
- Khi có file `.glb` của **đúng chiếc xe**: upload lên Storage, copy URL, dán vào cột `model_3d_url` của xe đó.
- Chưa có cũng không sao — phần ảnh thật (mục 3) là quan trọng nhất.

---

## 5b. Ảnh xoay 360° (đẹp nhất, dùng ảnh thật)

Cho khách **vuốt để xoay xe** — nhìn như 3D nhưng là **ảnh thật của xe**, nhẹ, không cần file 3D.

**Chụp:** đi đều quanh xe, mỗi ~15° chụp 1 tấm bằng điện thoại (24–36 tấm), giữ nguyên khoảng cách + độ cao, xe luôn nằm giữa khung, nền gọn, ánh sáng đều.

**Đưa lên web:**
1. Lần đầu: chạy 1 lần file `supabase/add-360.sql` trong SQL Editor (thêm cột `kind`).
2. Upload các khung ảnh lên Storage, copy URL từng tấm.
3. Chèn vào bảng `car_photos` với `kind` = **`spin_frame`**, `sort_order` = 0,1,2,… theo đúng thứ tự vòng quay (xem ví dụ SQL trong file `add-360.sql`).

> Cần **≥ 8 khung** mới bật chế độ xoay (24–36 là mượt nhất). Có ảnh xoay thì trang chi tiết tự thay mô hình 3D bằng khối xoay 360°. Ảnh gallery thường vẫn để `kind` = `photo`.

---

## 6. Đăng web lên Vercel & nối Supabase

1. Vào https://vercel.com → đăng nhập bằng GitHub → **Add New → Project** → chọn repo này → **Deploy**.
2. Vào **Project → Settings → Environment Variables**, thêm các biến:

   | Tên biến | Giá trị |
   |----------|---------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Project URL (mục 1.2) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key (mục 1.2) |
   | `NEXT_PUBLIC_SITE_URL` | địa chỉ web thật, vd `https://thuexetrunghieu.com` |

3. Bấm **Redeploy** để web nạp biến mới. Xong → web chạy bằng **dữ liệu thật** từ Supabase.

> Chưa điền 2 biến Supabase → web vẫn chạy bằng dữ liệu mẫu (an toàn để xem trước).
> `NEXT_PUBLIC_SITE_URL` giúp Google hiểu đúng địa chỉ web (SEO, sitemap).

---

## 7. Khi cần đổi thông tin liên hệ

Số điện thoại, Zalo, Facebook, địa chỉ, link Google Maps nằm trong **`config/brand.ts`**.
Nhờ người kỹ thuật sửa file đó rồi đăng lại — đây là **một chỗ duy nhất**, đổi xong áp dụng toàn web.

---

## 8. Mẹo cuối

- Ảnh xe thật, chụp rõ, có cả **ảnh chủ xe** → bà con tin hơn.
- Trả lời nhanh khi có yêu cầu đối tác trong `partner_inquiries`.
- Đánh giá thật của khách quen là "vàng" — nhớ xin và duyệt lên web.
