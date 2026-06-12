import { BRAND, phoneE164 } from "@/config/brand";
import type { Car } from "@/types/db";

/**
 * schema.org builders cho SEO địa phương.
 * AutoRental kế thừa LocalBusiness — đúng cho dịch vụ cho thuê xe vùng quê.
 */

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    name: BRAND.name,
    description:
      "Dịch vụ cho thuê xe có tài xế hoặc tự lái ở vùng quê — đi khám bệnh, đám cưới, du lịch, việc gấp.",
    url: BRAND.siteUrl,
    telephone: phoneE164,
    image: `${BRAND.siteUrl}/icon.svg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Khu dân cư kênh 10, ấp Bờ Dâu",
      addressLocality: "Xã Thạnh Mỹ Tây",
      addressRegion: "An Giang",
      addressCountry: "VN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BRAND.lat,
      longitude: BRAND.lng,
    },
    hasMap: BRAND.mapLink,
    areaServed: { "@type": "AdministrativeArea", name: "An Giang" },
    priceRange: "₫₫",
    openingHours: "Mo-Su 00:00-24:00",
  };
}

export function carJsonLd(car: Car) {
  const price = car.priceDriver ?? car.priceSelf;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: car.name,
    description: car.description,
    category: "Cho thuê xe",
    brand: { "@type": "Brand", name: BRAND.name },
    url: `${BRAND.siteUrl}/vi/xe/${car.slug}`,
    ...(price
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "VND",
            price: price.replace(/\./g, ""),
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              unitText: "NGÀY",
            },
            availability: "https://schema.org/InStock",
            seller: { "@type": "AutoRental", name: BRAND.name },
          },
        }
      : {}),
  };
}
