import type { MetadataRoute } from "next";
import { BRAND } from "@/config/brand";
import { routing } from "@/i18n/routing";
import { getCars } from "@/lib/data";

/** Sitemap đa ngôn ngữ: trang chủ, đối tác và mọi xe — cho mỗi locale. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = BRAND.siteUrl.replace(/\/$/, "");
  const cars = await getCars();

  const paths = [
    "",
    "/cho-thue-xe",
    ...cars.map((c) => `/xe/${c.slug}`),
  ];

  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${base}/${locale}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
  );
}
