import { getTranslations } from "next-intl/server";
import { Shield } from "lucide-react";
import { BRAND } from "@/config/brand";

/** OwnerCard — thẻ chủ xe với ảnh tròn placeholder + huy hiệu uy tín. Server component. */
export default async function OwnerCard() {
  const t = await getTranslations("detail");

  return (
    <section className="section">
      <div className="container">
        <div className="card" style={{ padding: 18, display: "flex", alignItems: "center", gap: 16 }}>
          <div className="imgph" style={{ width: 60, height: 60, borderRadius: 99, flexShrink: 0 }}>
            <span className="mono muted" style={{ fontSize: 10 }}>
              ẢNH
            </span>
          </div>
          <div style={{ flex: 1 }}>
            <div className="muted" style={{ fontSize: 13, fontWeight: 500 }}>
              {t("ownerLabel")}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", marginTop: 2 }}>
              {BRAND.owner}
            </div>
          </div>
          <div
            className="linkrow"
            style={{ gap: 7, color: "var(--accent)", fontSize: 13.5, fontWeight: 600 }}
          >
            <Shield size={17} /> {t("trust")}
          </div>
        </div>
      </div>
    </section>
  );
}
