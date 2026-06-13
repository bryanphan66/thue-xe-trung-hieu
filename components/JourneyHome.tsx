"use client";

import Image from "next/image";
import {
  Phone,
  MessageCircle,
  Users,
  ArrowRight,
  ArrowUpRight,
  Box,
  KeyRound,
  MapPin,
  Navigation,
  Globe,
  Stethoscope,
  HeartHandshake,
  TreePalm,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BRAND } from "@/config/brand";
import { SERVICES, type ServiceIcon } from "@/config/services";
import type { Car, Testimonial } from "@/types/db";
import { useContactActions } from "@/components/ContactProvider";
import type { BookingContext } from "@/hooks/useContact";
import { JourneyRail, Chapter } from "@/components/JourneyRail";
import { HeroShowcase } from "@/components/HeroShowcase";
import { QuickQuote } from "@/components/QuickQuote";
import { groupCarsBySeats, type SeatGroup } from "@/lib/seatGroups";
import { Reveal } from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";
import Photo from "@/components/Photo";
import Stars from "@/components/Stars";

const SVC_ICON: Record<ServiceIcon, LucideIcon> = {
  stethoscope: Stethoscope,
  heart: HeartHandshake,
  palm: TreePalm,
  navigation: Navigation,
};

/** Vô lăng — lucide không có, dựng SVG nhỏ. */
function SteeringWheel({ size = 26, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 14.2V21" />
      <path d="M10.1 10.9 4.2 7.6" />
      <path d="M13.9 10.9l5.9-3.3" />
    </svg>
  );
}

function priceCol(label: string, price: string | null, old: string | null, fromLabel: string) {
  return (
    <div style={{ flex: 1, padding: "13px 0" }}>
      <div className="muted" style={{ fontSize: 12.5, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-0.03em", marginTop: 3 }}>
        {price ? (
          <>
            {fromLabel}
            {price}
            <span className="muted" style={{ fontSize: 13, fontWeight: 500 }}> đ/ngày</span>
          </>
        ) : (
          <span className="muted" style={{ fontSize: 15, fontWeight: 600 }}>Liên hệ</span>
        )}
      </div>
      {price && old && <div className="was">{old} đ</div>}
    </div>
  );
}

/** Thẻ "loại xe theo số chỗ": giá tài xế/tự lái + danh sách xe thật trong loại. */
function SeatGroupCard({
  group,
  onCall,
  onBook,
}: {
  group: SeatGroup;
  onCall: () => void;
  onBook: (ctx: BookingContext) => void;
}) {
  const fromLabel = group.multiple ? "từ " : "";
  return (
    <div className="card car-card" style={{ overflow: "hidden" }} data-testid="seat-card">
      <div style={{ padding: 18 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
          <h3 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.04em", display: "flex", alignItems: "center", gap: 8 }}>
            <Users size={22} /> {group.label}
          </h3>
          {group.promo && <span className="promo-chip">{group.promo}</span>}
        </div>

        <div style={{ display: "flex", marginTop: 14, borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)" }}>
          {priceCol("Có tài xế", group.priceDriver, group.oldPriceDriver, fromLabel)}
          <div style={{ width: 1, background: "var(--hairline)" }} />
          <div style={{ paddingLeft: 16, flex: 1 }}>
            {priceCol("Tự lái", group.priceSelf, group.oldPriceSelf, fromLabel)}
          </div>
        </div>

        <div className="muted" style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase", marginTop: 16, marginBottom: 8 }}>
          Xe loại này
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {group.cars.map((car) => {
            const cover = car.photoUrls?.[0];
            return (
              <Link
                key={car.slug}
                href={`/xe/${car.slug}`}
                data-testid="car-detail-link"
                style={{ display: "flex", alignItems: "center", gap: 12, padding: 8, borderRadius: 12, border: "1px solid var(--hairline)" }}
              >
                <div style={{ position: "relative", width: 64, aspectRatio: "16 / 10", borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                  {cover ? (
                    <Image src={cover} alt={car.name} fill sizes="64px" style={{ objectFit: "cover" }} />
                  ) : (
                    <Photo label="" ratio="16 / 10" radius={8} />
                  )}
                </div>
                <span style={{ flex: 1, fontWeight: 700, fontSize: 15.5 }}>{car.name}</span>
                {car.badge && <span className="muted" style={{ fontSize: 12 }}>{car.badge}</span>}
                <ArrowRight size={17} className="muted" />
              </Link>
            );
          })}
        </div>

        <button
          className="btn btn-primary btn-sm"
          style={{ marginTop: 14, width: "100%" }}
          onClick={() => onBook({ source: "seat", seatsLabel: group.label, seats: group.seats })}
        >
          <Phone size={17} /> Để nhà xe gọi lại
        </button>
        <button
          className="btn btn-ghost btn-sm"
          style={{ marginTop: 8, width: "100%" }}
          onClick={onCall}
        >
          Gọi tư vấn ngay
        </button>
      </div>
    </div>
  );
}

export default function JourneyHome({
  cars,
  testimonials,
}: {
  cars: Car[];
  testimonials: Testimonial[];
}) {
  const { call, zalo, service, book } = useContactActions();
  const groups: SeatGroup[] = groupCarsBySeats(cars);

  const mapEmbed = `https://www.openstreetmap.org/export/embed.html?bbox=${BRAND.lng - 0.01},${BRAND.lat - 0.01},${BRAND.lng + 0.01},${BRAND.lat + 0.01}&layer=mapnik&marker=${BRAND.lat},${BRAND.lng}`;

  const drive = [
    { Icon: SteeringWheel, cls: "drive-steer", title: "Có tài xế", body: "Bác tài quen đường, đón tận nơi. Bạn chỉ việc lên xe — hợp người lớn tuổi, đi khám bệnh, sự kiện." },
    { Icon: KeyRound, cls: "drive-key", title: "Tự lái", body: "Tự cầm lái, chủ động giờ giấc. Thủ tục gọn nhẹ, giao xe tận nhà — hợp đi gần và du lịch ngắn ngày." },
  ];
  const tItems = [...testimonials, ...testimonials];

  return (
    <div className="screen page-pad">
      {/* HERO */}
      <header className="hero2">
        <div className="container" style={{ paddingTop: 56, paddingBottom: 40 }}>
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <span className="dot-pulse" style={{ width: 7, height: 7, borderRadius: 99, background: "var(--accent)", display: "inline-block" }} />
              <Eyebrow dark>{BRAND.tagline} · An Giang</Eyebrow>
            </div>
          </Reveal>
          <h1 className="display" style={{ color: "var(--stage-ink)" }}>
            {["Đi xa thật dễ.", "Chỉ một", "cuộc gọi."].map((ln, i) => (
              <span className="hero-line" key={i} style={{ "--i": i } as React.CSSProperties}>
                {ln}
              </span>
            ))}
          </h1>
          <Reveal delay={130}>
            <p className="lead" style={{ color: "var(--stage-muted)", marginTop: 20, maxWidth: 330 }}>
              Cuộn xuống để bắt đầu hành trình — từ chiếc xe đầu tiên đến tận cửa nhà xe.
            </p>
          </Reveal>
        </div>

        <Reveal delay={170} variant="scale">
          <div className="container">
            <HeroShowcase cars={cars} />
          </div>
        </Reveal>

        <Reveal delay={220}>
          <div className="container" style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10, paddingBottom: 56 }}>
            <button className="btn btn-on-dark" onClick={call}>
              <Phone size={19} /> Gọi ngay · {BRAND.phone}
            </button>
            <button className="btn btn-ghost-on-dark" onClick={zalo}>
              <MessageCircle size={19} /> Nhắn Zalo
            </button>
          </div>
        </Reveal>

        <div className="scroll-cue">
          <span className="mono" style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase" }}>Cuộn</span>
          <span className="ln" />
        </div>
      </header>

      <div className="journey">
        <JourneyRail />

        {/* 01 — Dịch vụ */}
        <Chapter n="01" tag="Dịch vụ" label="Bạn cần đi đâu?">
          <div style={{ borderTop: "1px solid var(--hairline)" }}>
            {SERVICES.map((s, i) => {
              const Ico = SVC_ICON[s.icon];
              return (
                <Reveal as="div" key={i} variant="left" delay={i * 70}>
                  <button className="svc-row" onClick={() => service(s)}>
                    <span className="svc-ico"><Ico size={22} /></span>
                    <span style={{ flex: 1 }}>
                      <span style={{ display: "block", fontSize: 17.5, fontWeight: 700, letterSpacing: "-0.02em" }}>{s.label}</span>
                      <span className="muted" style={{ display: "block", fontSize: 14.5, marginTop: 2 }}>{s.sub}</span>
                    </span>
                    <ArrowRight size={19} className="svc-go" />
                  </button>
                </Reveal>
              );
            })}
          </div>
        </Chapter>

        {/* 02 — Thuê theo số chỗ */}
        <Chapter n="02" tag="Đội xe" label="Thuê theo số chỗ">
          <div className="stack-hint">
            <Box size={15} /> Cuộn để xem {groups.length} loại xe
          </div>
          <div className="car-stack">
            {groups.map((g, i) => (
              <div
                className="car-stack-item"
                key={g.seats}
                style={{ top: 78 + i * 12, zIndex: i + 1, marginBottom: i === groups.length - 1 ? 0 : 22, paddingBottom: 22 }}
              >
                <SeatGroupCard group={g} onCall={call} onBook={book} />
              </div>
            ))}
          </div>
          <p className="muted" style={{ fontSize: 13, lineHeight: 1.55, marginTop: 16 }}>
            Đi xa / qua đêm: báo giá khi gọi · Xe cưới có thể thêm phụ phí trang trí.
          </p>
        </Chapter>

        {/* 03 — Báo giá nhanh */}
        <Chapter n="03" tag="Báo giá" label="Tính nhanh chi phí">
          <QuickQuote groups={groups} onBook={book} />
        </Chapter>

        {/* 04 — Lựa chọn */}
        <Chapter n="04" tag="Lựa chọn" label="Tự lái hay có tài xế?">
          <div>
            {drive.map((o, i) => (
              <Reveal key={i} delay={i * 60} variant="left">
                <div style={{ display: "flex", gap: 16, padding: "20px 0", borderTop: "1px solid var(--hairline)", borderBottom: i === drive.length - 1 ? "1px solid var(--hairline)" : "none" }}>
                  <span className="drive-ico"><o.Icon size={26} className={o.cls} /></span>
                  <div>
                    <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.025em" }}>{o.title}</div>
                    <p className="muted" style={{ fontSize: 15.5, lineHeight: 1.55, marginTop: 6 }}>{o.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Chapter>

        {/* 05 — Đánh giá */}
        {testimonials.length > 0 && (
          <Chapter n="05" tag="Đánh giá" label="Bà con tin tưởng">
            <Reveal variant="scale">
              <div className="marquee" style={{ marginLeft: -46, marginRight: -22 }}>
                <div className="marquee-track">
                  {tItems.map((t, i) => (
                    <div key={i} className="card tcard" style={{ padding: "20px 18px" }} aria-hidden={i >= testimonials.length}>
                      <Stars n={t.stars} />
                      <p className="body" style={{ marginTop: 12, fontSize: 16, lineHeight: 1.5, letterSpacing: "-0.015em" }}>“{t.quote}”</p>
                      <div className="muted" style={{ fontSize: 14, marginTop: 14, fontWeight: 500 }}>— {t.name}, {t.place}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </Chapter>
        )}

        {/* 06 — Đối tác */}
        <Chapter n="06" tag="Đối tác">
          <Reveal>
            <div style={{ border: "1px solid var(--hairline)", borderRadius: 16, padding: "26px 22px", background: "var(--surface)" }}>
              <h2 className="h2" style={{ fontSize: 24 }}>Bạn có xe muốn cho thuê?</h2>
              <p className="muted" style={{ fontSize: 16, lineHeight: 1.55, marginTop: 10 }}>
                Để xe nhàn rỗi sinh lời. Chúng tôi lo khách, lịch và hợp đồng — bạn nhận thu nhập hàng tháng.
              </p>
              <Link href="/cho-thue-xe" className="btn btn-ghost" style={{ marginTop: 18 }}>
                Trở thành đối tác <ArrowUpRight size={18} />
              </Link>
            </div>
          </Reveal>
        </Chapter>

        {/* 07 — Vị trí */}
        <Chapter n="07" tag="Vị trí" label="Ghé nhà xe">
          <Reveal>
            <p className="muted" style={{ fontSize: 16, lineHeight: 1.55 }}>{BRAND.address}</p>
          </Reveal>
          <Reveal delay={90} variant="scale">
            <div style={{ marginTop: 18, borderRadius: 16, overflow: "hidden", border: "1px solid var(--hairline)", position: "relative" }}>
              <div className="imgph" style={{ position: "absolute", inset: 0, borderRadius: 0 }}>
                <span className="lbl">Đang tải bản đồ…</span>
              </div>
              <iframe
                title={`Bản đồ ${BRAND.name}`}
                src={mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ position: "relative", width: "100%", height: 210, border: 0, display: "block", filter: "grayscale(.15) contrast(1.02)" }}
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <a href={BRAND.mapLink} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ marginTop: 14 }}>
              <Navigation size={18} /> Chỉ đường tới nhà xe
            </a>
          </Reveal>
        </Chapter>
      </div>

      {/* 08 — Đến nơi (footer) */}
      <footer className="arrival">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <span className="mono" style={{ fontSize: 13, fontWeight: 600 }}>08</span>
          <span style={{ flex: 1, height: 1, background: "var(--stage-hairline)" }} />
          <span className="eyebrow on-dark">Đến nơi</span>
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.04em" }}>{BRAND.name}</div>
        <div style={{ marginTop: 4 }}><Eyebrow dark>Chủ xe · {BRAND.owner}</Eyebrow></div>

        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            { Icon: MapPin, label: BRAND.address, href: BRAND.mapLink, action: undefined as undefined | (() => void) },
            { Icon: Phone, label: BRAND.phone, href: undefined, action: call },
            { Icon: MessageCircle, label: "Zalo · " + BRAND.zalo, href: undefined, action: zalo },
            { Icon: Globe, label: BRAND.facebook, href: `https://${BRAND.facebook}`, action: undefined },
          ].map((r, i) => {
            const inner = (
              <>
                <r.Icon size={20} style={{ color: "var(--stage-muted)", flexShrink: 0 }} />
                <span style={{ fontSize: 15.5, flex: 1 }}>{r.label}</span>
                <ArrowUpRight size={17} style={{ color: "var(--stage-muted)" }} />
              </>
            );
            const style: React.CSSProperties = {
              display: "flex", alignItems: "center", gap: 14, padding: "15px 0",
              borderTop: "1px solid var(--stage-hairline)", cursor: "pointer",
              borderBottom: i === 3 ? "1px solid var(--stage-hairline)" : "none", color: "inherit",
            };
            return r.href ? (
              <a key={i} href={r.href} target="_blank" rel="noreferrer" style={style}>{inner}</a>
            ) : (
              <button key={i} onClick={r.action} style={{ ...style, background: "none", border: "none", borderTop: "1px solid var(--stage-hairline)", textAlign: "left", fontFamily: "inherit" }}>{inner}</button>
            );
          })}
        </div>
        <div className="mono" style={{ fontSize: 11.5, marginTop: 26, color: "var(--stage-muted)" }}>© 2026 {BRAND.name}</div>
      </footer>
    </div>
  );
}
