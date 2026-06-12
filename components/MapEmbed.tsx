"use client";

import { useState } from "react";
import { Navigation } from "lucide-react";
import { BRAND } from "@/config/brand";

/**
 * MapEmbed — bản đồ nhúng cho LocationSection.
 *
 * - provider="osm" (MẶC ĐỊNH): OpenStreetMap. KEYLESS, không bao giờ bị chặn iframe.
 * - provider="google": Google Maps **Embed API** (đúng kiểu Google) — CẦN API key.
 *     KHÔNG dùng maps.google.com/...&output=embed: Google chặn iframe → ERR_BLOCKED_BY_RESPONSE.
 *     Lấy key: Google Cloud Console → bật "Maps Embed API" → tạo key →
 *     đặt vào .env.local:  NEXT_PUBLIC_GOOGLE_MAPS_KEY=xxxxx
 *
 * Nếu chọn google mà chưa có key, component tự fallback về OSM.
 */
type Provider = "osm" | "google";

function osmSrc(lat: number, lng: number) {
  const dx = 0.012, dy = 0.008; // khung nhìn ~ vài km quanh ghim
  const bbox = [lng - dx, lat - dy, lng + dx, lat + dy].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
}

function googleSrc(lat: number, lng: number, key: string) {
  return `https://www.google.com/maps/embed/v1/place?key=${key}&q=${lat},${lng}&zoom=15`;
}

export default function MapEmbed({ provider = "osm" }: { provider?: Provider }) {
  const [loaded, setLoaded] = useState(false);
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  const useGoogle = provider === "google" && !!key;
  const src = useGoogle ? googleSrc(BRAND.lat, BRAND.lng, key!) : osmSrc(BRAND.lat, BRAND.lng);

  return (
    <section className="px-[22px] pt-[52px]">
      <p className="whitespace-nowrap text-[11.5px] font-semibold uppercase tracking-[.16em] text-muted">
        Vị trí
      </p>
      <h2 className="mt-3 text-[27px] font-extrabold tracking-[-0.035em]">Ghé nhà xe</h2>
      <p className="mt-2.5 text-[16px] leading-[1.55] text-muted">{BRAND.address}</p>

      <div className="relative mt-[18px] overflow-hidden rounded-2xl border border-hairline">
        {!loaded && (
          <div className="absolute inset-0 grid place-items-center bg-[#f1f1f3]">
            <span className="rounded-md border border-hairline bg-white/70 px-2.5 py-1 font-mono text-[11px] uppercase text-muted">
              Đang tải bản đồ…
            </span>
          </div>
        )}
        <iframe
          title={`Bản đồ ${BRAND.name}`}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setLoaded(true)}
          className="relative block h-[210px] w-full border-0 [filter:grayscale(.15)_contrast(1.02)]"
        />
      </div>

      <a
        href={BRAND.mapLink}
        target="_blank"
        rel="noreferrer"
        className="mt-3.5 flex h-[52px] items-center justify-center gap-2 rounded-btn border border-hairline text-[16.5px] font-semibold transition-colors hover:border-ink active:scale-[.975]"
      >
        <Navigation size={18} /> Chỉ đường tới nhà xe
      </a>
    </section>
  );
}
