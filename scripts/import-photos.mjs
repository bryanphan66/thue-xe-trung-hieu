// "Xào nấu" ảnh thật: đọc incoming-photos/ → optimize (sharp) → upload Supabase Storage (bucket 'cars', public)
// → ghi car_photos (xe) / owners.photo_url (chủ xe). Web force-dynamic nên hiện ngay, không deploy lại.
// Cần SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY trong .env.local.
// Chạy: node scripts/import-photos.mjs           (xử lý tất cả)
//       node scripts/import-photos.mjs kia-k5    (chỉ 1 xe)
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, extname, basename } from "node:path";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Thiếu SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (.env.local)"); process.exit(1);
}
const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const BUCKET = "cars";
const ROOT = "incoming-photos";
const onlySlug = process.argv[2];
const isImg = (f) => /\.(jpe?g|png|webp|heic)$/i.test(f);

async function ensureBucket() {
  const { data } = await sb.storage.getBucket(BUCKET);
  if (!data) { await sb.storage.createBucket(BUCKET, { public: true }); console.log(`Đã tạo bucket public '${BUCKET}'`); }
}
async function optimize(path, w = 1280) {
  // unoptimized:true ở next.config → ảnh này phục vụ thẳng cho client, nên resize web-size + nén kỹ.
  return sharp(readFileSync(path)).rotate().resize(w, null, { withoutEnlargement: true }).jpeg({ quality: 78, mozjpeg: true }).toBuffer();
}
async function uploadPublic(destPath, buf) {
  await sb.storage.from(BUCKET).upload(destPath, buf, { contentType: "image/jpeg", upsert: true, cacheControl: "604800" });
  return sb.storage.from(BUCKET).getPublicUrl(destPath).data.publicUrl;
}

async function importCar(slug) {
  const dir = join(ROOT, "cars", slug);
  if (!existsSync(dir)) return;
  const files = readdirSync(dir).filter(isImg).sort();
  if (!files.length) { console.log(`• ${slug}: chưa có ảnh`); return; }
  const { data: car } = await sb.from("cars").select("id").eq("slug", slug).maybeSingle();
  if (!car) { console.log(`⚠ ${slug}: không có xe slug này trong DB`); return; }
  // Xoá ảnh cũ của xe để chạy lại sạch. (DB hiện CHƯA có cột `kind` → không insert kind;
  //  data layer coi ảnh không có kind là ảnh thường. Khi thêm 360°/kind thì chừa spin_frame.)
  await sb.from("car_photos").delete().eq("car_id", car.id);
  let i = 0;
  for (const f of files) {
    const buf = await optimize(join(dir, f));
    const url = await uploadPublic(`${slug}/${String(i).padStart(2, "0")}.jpg`, buf);
    const { error } = await sb.from("car_photos").insert({ car_id: car.id, url, sort_order: i });
    if (error) { console.error(`  ✗ insert lỗi (${f}): ${error.message}`); }
    i++;
  }
  console.log(`✓ ${slug}: ${i} ảnh → web`);
}

async function importShopOwner() {
  const dir = join(ROOT, "shop");
  if (!existsSync(dir)) return;
  const files = readdirSync(dir).filter(isImg);
  const ownerFile = files.find((f) => /chu-xe|owner|trung/i.test(basename(f, extname(f))));
  if (ownerFile) {
    const buf = await sharp(readFileSync(join(dir, ownerFile))).rotate().resize(600, 600, { fit: "cover" }).jpeg({ quality: 84 }).toBuffer();
    const url = await uploadPublic(`shop/owner.jpg`, buf);
    const { data: owner } = await sb.from("owners").select("id").eq("is_primary", true).maybeSingle();
    if (owner) { await sb.from("owners").update({ photo_url: url }).eq("id", owner.id); console.log(`✓ chủ xe: ${ownerFile} → owners.photo_url`); }
  }
  // các ảnh tiệm khác: upload sẵn, in URL để dùng sau (vd hero/giới thiệu)
  for (const f of files.filter((x) => x !== ownerFile)) {
    const buf = await optimize(join(dir, f), 1600);
    const url = await uploadPublic(`shop/${basename(f, extname(f)).replace(/\s+/g, "-")}.jpg`, buf);
    console.log(`  ảnh tiệm: ${url}`);
  }
}

await ensureBucket();
if (onlySlug) { await importCar(onlySlug); }
else {
  for (const slug of ["kia-k5", "innova"]) await importCar(slug);
  await importShopOwner();
}
console.log("Xong.");
