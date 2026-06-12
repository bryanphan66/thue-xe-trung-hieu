import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Users } from "lucide-react";
import { getCar, getCars } from "@/lib/data";
import { BRAND } from "@/config/brand";
import { carJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";
import Car3DViewer from "@/components/Car3DViewer";
import BackBar from "@/components/BackBar";
import CarGallery from "@/components/CarGallery";
import PriceTable from "@/components/PriceTable";
import OwnerCard from "@/components/OwnerCard";
import DetailCta from "@/components/DetailCta";

// Model mẫu khi xe chưa có .glb thật.
// TODO: thay .glb xe thật
const CAR_MODEL_URL =
  "https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Assets@main/Models/ToyCar/glTF-Binary/ToyCar.glb";

export async function generateStaticParams() {
  const cars = await getCars();
  return cars.map((car) => ({ slug: car.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const car = await getCar(slug);
  if (!car) return {};
  const title = `${car.name} (${car.type})`;
  return {
    title,
    description: car.description,
    alternates: { canonical: `/${locale}/xe/${slug}` },
    openGraph: {
      type: "website",
      siteName: BRAND.name,
      title: `${car.name} — ${BRAND.name}`,
      description: car.description,
      url: `/${locale}/xe/${slug}`,
    },
  };
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const car = await getCar(slug);
  if (!car) notFound();

  const t = await getTranslations("detail");
  const ta = await getTranslations("actions");

  return (
    <main className="screen">
      <JsonLd data={carJsonLd(car)} />
      <BackBar name={car.name} />

      <Car3DViewer
        src={car.model3dUrl ?? CAR_MODEL_URL}
        poster={car.posterUrl ?? undefined}
        name={car.name}
      />

      <div className="container" style={{ paddingTop: 26 }}>
        <Reveal>
          <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.04em" }}>{car.name}</h1>
          <div className="muted linkrow" style={{ fontSize: 15.5, marginTop: 8, gap: 8 }}>
            <span className="linkrow" style={{ gap: 6 }}>
              <Users size={17} /> {ta("seats", { count: car.seats })}
            </span>
            <span style={{ color: "var(--hairline)" }}>·</span>
            <span>{car.type.split("·")[0].trim()}</span>
          </div>
        </Reveal>
      </div>

      <Reveal>
        <CarGallery car={car} />
      </Reveal>

      <section className="section" style={{ paddingTop: 36 }}>
        <div className="container">
          <Reveal variant="left">
            <Eyebrow>{t("descriptionEyebrow")}</Eyebrow>
          </Reveal>
          <Reveal variant="up" delay={60}>
            <p className="body" style={{ marginTop: 14, fontSize: 17, lineHeight: 1.6 }}>
              {car.description}
            </p>
          </Reveal>
        </div>
      </section>

      <Reveal variant="up">
        <PriceTable car={car} />
      </Reveal>
      <Reveal variant="scale">
        <OwnerCard />
      </Reveal>

      <DetailCta />
    </main>
  );
}
