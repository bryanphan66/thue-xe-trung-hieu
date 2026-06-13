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

/** FAQPage — câu hỏi thật khách hay hỏi (giúp Google hiểu + có thể hiện rich result). */
export function faqJsonLd() {
  const qa: [string, string][] = [
    [
      "Có giao xe tận nhà không?",
      "Có. Nhà xe giao xe tận nhà trong khu vực xã Thạnh Mỹ Tây và các nơi lân cận ở An Giang.",
    ],
    [
      "Có cho thuê xe tự lái không?",
      "Có. Bạn có thể thuê xe tự lái để chủ động giờ giấc, hoặc thuê kèm tài xế quen đường miền Tây.",
    ],
    [
      "Có những loại xe mấy chỗ?",
      "Hiện có xe 5 chỗ (Kia K5) và 8 chỗ (Toyota Innova), đời mới, sạch sẽ, máy lạnh mát.",
    ],
    [
      "Đi xa hoặc đi tỉnh khác thì tính giá thế nào?",
      "Đi xa được báo giá khi gọi, tùy quãng đường và lịch trình cụ thể để có giá tốt nhất.",
    ],
    [
      "Cho thuê xe đám cưới, đưa đón đi khám bệnh không?",
      "Có. Nhà xe phục vụ rước dâu - đám cưới, đưa đón đi khám bệnh (hợp người lớn tuổi), du lịch, ra sân bay và về quê - đi xa.",
    ],
    [
      "Đặt xe bằng cách nào?",
      `Gọi hoặc nhắn Zalo ${BRAND.phone}, hoặc để lại số điện thoại trên web để nhà xe gọi lại.`,
    ],
  ];
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

/** BreadcrumbList cho trang xe: Trang chủ › Cho thuê xe › [Tên xe]. */
export function breadcrumbJsonLd(car: Car, locale = "vi") {
  const base = `${BRAND.siteUrl}/${locale}`;
  const items = [
    { name: "Trang chủ", url: base },
    { name: "Cho thuê xe", url: `${base}/cho-thue-xe` },
    { name: car.name, url: `${base}/xe/${car.slug}` },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
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
