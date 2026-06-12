import { getTranslations } from "next-intl/server";
import type { Car } from "@/types/db";
import Eyebrow from "@/components/Eyebrow";

/** PriceTable — hộp bảng giá viền bo góc, 2 dòng (có tài xế / tự lái). Server component. */
export default async function PriceTable({ car }: { car: Car }) {
  const t = await getTranslations("detail");
  const tc = await getTranslations("cars");
  const ta = await getTranslations("actions");

  const rows = [
    { label: tc("priceDriver"), price: car.priceDriver, old: car.oldPriceDriver, note: t("driverNote") },
    {
      label: tc("priceSelf"),
      price: car.priceSelf,
      old: car.priceSelf ? car.oldPriceSelf : null,
      note: car.priceSelf ? t("selfNote") : t("selfNoteNone"),
    },
  ];

  return (
    <section className="section">
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <Eyebrow>{t("priceEyebrow")}</Eyebrow>
          {car.promo && <span className="promo-chip">{car.promo}</span>}
        </div>
        <div
          style={{
            marginTop: 18,
            border: "1px solid var(--hairline)",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {rows.map((r, i) => (
            <div
              key={i}
              style={{ padding: "20px 18px", borderTop: i ? "1px solid var(--hairline)" : "none" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <span style={{ fontSize: 16.5, fontWeight: 600 }}>{r.label}</span>
                <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.04em" }}>
                  {r.price ? (
                    <>
                      {r.price}
                      <span className="muted" style={{ fontSize: 14, fontWeight: 500 }}>
                        {" "}
                        {ta("perDay")}
                      </span>
                    </>
                  ) : (
                    <span className="muted" style={{ fontSize: 16, fontWeight: 600 }}>
                      {ta("contact")}
                    </span>
                  )}
                </span>
              </div>
              {r.old && (
                <div className="was" style={{ textAlign: "right" }}>
                  {r.old} {ta("perDay")}
                </div>
              )}
              <div className="muted" style={{ fontSize: 13.5, marginTop: 7 }}>
                {r.note}
              </div>
            </div>
          ))}
        </div>
        <div className="muted" style={{ fontSize: 13, marginTop: 12, lineHeight: 1.5 }}>
          {t("priceFootnote")}
        </div>
      </div>
    </section>
  );
}
