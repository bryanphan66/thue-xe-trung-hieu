import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Build container nhỏ gọn (.next/standalone tự chạy bằng server.js).
  output: "standalone",
  images: {
    // Phục vụ ảnh THẲNG từ Supabase Storage CDN (Singapore) thay vì qua optimizer của
    // Dokploy origin (VN) — Cloudflare KHÔNG cache /_next/image (cf DYNAMIC, TTFB ~1.4s/tấm).
    // Ảnh đã pre-resize nhỏ + cache-control dài khi import → nhanh & nhẹ trên mobile.
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default withNextIntl(nextConfig);
