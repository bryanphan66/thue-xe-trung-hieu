import type { MetadataRoute } from "next";
import { BRAND } from "@/config/brand";

export default function robots(): MetadataRoute.Robots {
  const base = BRAND.siteUrl.replace(/\/$/, "");
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
