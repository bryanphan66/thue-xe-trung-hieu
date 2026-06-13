// Sinh ảnh OG (1200×630) cho mạng xã hội: ảnh xe thật + bảng thương hiệu.
// Render HTML bằng Playwright (tiếng Việt chuẩn) → sharp tối ưu → public/og.jpg
// Chạy: node scripts/make-og.mjs   (ảnh nguồn: public/cars/innova.jpg)
import { readFileSync } from "node:fs";
import { chromium } from "playwright";
import sharp from "sharp";

const CAR = process.argv[2] || "public/cars/innova.jpg";
const OUT = process.argv[3] || "public/og.jpg";
const PHONE = "0326 120 108";
const SITE = "thuexeangiang.autocontent.click";

const carDataUri = "data:image/jpeg;base64," + readFileSync(CAR).toString("base64");

const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:1200px;height:630px}
  body{display:flex;font-family:'Be Vietnam Pro',system-ui,sans-serif;background:#0B0B0C;color:#fff}
  .photo{width:648px;height:630px;position:relative}
  .photo img{width:100%;height:100%;object-fit:cover}
  .photo::after{content:"";position:absolute;inset:0;box-shadow:inset -60px 0 60px -20px #0B0B0C}
  .panel{flex:1;padding:60px 56px;display:flex;flex-direction:column;justify-content:center;gap:18px}
  .eyebrow{font-size:18px;font-weight:700;letter-spacing:.22em;color:#D9A441;text-transform:uppercase}
  .title{font-size:50px;font-weight:800;line-height:1.04;letter-spacing:-.01em}
  .title .gold{color:#D9A441}
  .rule{width:64px;height:4px;background:#D9A441;border-radius:3px;margin:6px 0}
  .feat{font-size:23px;font-weight:500;color:#d6d6d8;line-height:1.4}
  .phone{font-size:44px;font-weight:800;margin-top:6px}
  .site{font-size:21px;font-weight:600;color:#9aa0a6}
</style></head>
<body>
  <div class="photo"><img src="${carDataUri}" alt=""></div>
  <div class="panel">
    <div class="eyebrow">Cho thuê xe · An Giang</div>
    <div class="title">Dịch vụ cho thuê xe<br><span class="gold">Thạnh Mỹ Tây – An Giang</span></div>
    <div class="rule"></div>
    <div class="feat">Xe 5 &amp; 8 chỗ · Tự lái hoặc có tài xế<br>Giao xe tận nhà · Đám cưới · Du lịch · Đi xa</div>
    <div class="phone">📞 ${PHONE}</div>
    <div class="site">🌐 ${SITE}</div>
  </div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const png = await page.screenshot({ type: "png" });
await browser.close();

await sharp(png).resize(1200, 630).jpeg({ quality: 86, mozjpeg: true }).toFile(OUT);
console.log("Đã tạo", OUT);
