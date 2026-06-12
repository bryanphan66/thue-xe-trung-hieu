import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import { routing } from "@/i18n/routing";
import { BRAND } from "@/config/brand";
import { getCars } from "@/lib/data";
import ContactProvider from "@/components/ContactProvider";
import JsonLd from "@/components/JsonLd";
import { localBusinessJsonLd } from "@/lib/seo";
import "../globals.css";

const sans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  const title = `${BRAND.name} — Cho thuê xe ${BRAND.address.split(",").slice(-2).join(",").trim()}`;
  const description = t("lead");
  return {
    metadataBase: new URL(BRAND.siteUrl),
    title: {
      default: title,
      template: `%s — ${BRAND.name}`,
    },
    description,
    applicationName: BRAND.name,
    keywords: [
      "cho thuê xe",
      "thuê xe có tài xế",
      "thuê xe tự lái",
      "thuê xe An Giang",
      "thuê xe Thạnh Mỹ Tây",
      "xe đám cưới",
      "xe đi khám bệnh",
      BRAND.name,
    ],
    alternates: {
      canonical: `/${locale}`,
      languages: { vi: "/vi", en: "/en" },
    },
    openGraph: {
      type: "website",
      siteName: BRAND.name,
      title,
      description,
      url: `/${locale}`,
      locale: locale === "vi" ? "vi_VN" : "en_US",
    },
    twitter: { card: "summary", title, description },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const cars = await getCars();

  return (
    <html lang={locale} className={`${sans.variable} ${mono.variable}`}>
      <body>
        <JsonLd data={localBusinessJsonLd()} />
        <NextIntlClientProvider>
          <div className="page">
            <ContactProvider cars={cars}>{children}</ContactProvider>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
