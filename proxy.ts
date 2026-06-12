import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Bỏ qua API, nội bộ Next, và MỌI file tĩnh/metadata route có phần mở rộng
  // (robots.txt, sitemap.xml, icon.svg, ảnh…) — nếu để middleware chạm vào chúng,
  // next-intl trả 404 status dù nội dung đúng. Match trang HTML, redirect / → /vi.
  matcher: ["/((?!api|_next|_vercel|.*\\.).*)"],
};
