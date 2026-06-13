import { setRequestLocale } from "next-intl/server";
import { getCars, getTestimonials } from "@/lib/data";
import JourneyHome from "@/components/JourneyHome";
import JsonLd from "@/components/JsonLd";
import { faqJsonLd } from "@/lib/seo";

// Đọc Supabase phía server lúc RUNTIME → sửa dữ liệu là web đổi ngay, không deploy lại.
export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [cars, testimonials] = await Promise.all([getCars(), getTestimonials()]);

  return (
    <>
      <JsonLd data={faqJsonLd()} />
      <JourneyHome cars={cars} testimonials={testimonials} />
    </>
  );
}
