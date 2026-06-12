import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ChevronLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BRAND } from "@/config/brand";
import { Reveal } from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";
import PartnerForm from "@/components/PartnerForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "partner" });
  return {
    title: `${t("title")} — ${BRAND.name}`,
    description: t("body"),
  };
}

export default async function PartnerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("partner");
  const ta = await getTranslations("actions");

  return (
    <>
      {/* Thanh quay lại — nền sáng, dính trên cùng */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 16px",
          background: "rgba(250,250,250,.72)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid var(--hairline)",
        }}
      >
        <Link
          href="/"
          aria-label={ta("back")}
          style={{
            width: 40,
            height: 40,
            borderRadius: 11,
            border: "1px solid var(--hairline)",
            background: "var(--surface)",
            color: "var(--ink)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ChevronLeft size={20} />
        </Link>
        <span style={{ fontSize: 15.5, fontWeight: 600 }}>{t("title")}</span>
      </div>

      <main className="screen container section" style={{ paddingBottom: 130 }}>
        <Reveal variant="left">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
        </Reveal>
        <Reveal variant="up" delay={60}>
          <h2 className="h2" style={{ marginTop: 12 }}>
            {t("title")}
          </h2>
          <p className="muted body" style={{ marginTop: 12 }}>
            {t("formIntro")}
          </p>
        </Reveal>
        <Reveal variant="up" delay={120}>
          <PartnerForm />
        </Reveal>
      </main>
    </>
  );
}
