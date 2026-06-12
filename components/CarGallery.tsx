"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import type { Car } from "@/types/db";
import Eyebrow from "@/components/Eyebrow";
import Photo from "@/components/Photo";

/** Nút mũi tên prev/next của gallery. */
function galleryBtn(disabled: boolean): CSSProperties {
  return {
    width: 38,
    height: 38,
    borderRadius: 10,
    border: "1px solid var(--hairline)",
    background: "var(--surface)",
    color: disabled ? "var(--hairline)" : "var(--ink)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: disabled ? "default" : "pointer",
  };
}

/**
 * CarGallery — dải ảnh cuộn ngang scroll-snap + chấm tiến độ.
 * Ưu tiên ảnh thật (car.photoUrls) nếu có, ngược lại dùng placeholder theo photoCount.
 */
export default function CarGallery({ car }: { car: Car }) {
  const t = useTranslations("detail");
  const ref = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  const urls = car.photoUrls;
  const count = urls?.length ?? car.photoCount;

  const go = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    const next = Math.min(count - 1, Math.max(0, idx + dir));
    setIdx(next);
    const child = el.children[next] as HTMLElement | undefined;
    if (child) el.scrollTo({ left: child.offsetLeft - 22, behavior: "smooth" });
  };

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement | undefined;
    const w = first ? first.offsetWidth + 10 : 1;
    setIdx(Math.round(el.scrollLeft / w));
  };

  return (
    <section className="section" style={{ paddingTop: 36 }}>
      <div
        className="container"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <Eyebrow>{t("galleryEyebrow")}</Eyebrow>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => go(-1)}
            aria-label={t("galleryPrev")}
            style={galleryBtn(idx === 0)}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => go(1)}
            aria-label={t("galleryNext")}
            style={galleryBtn(idx === count - 1)}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={ref}
        onScroll={onScroll}
        style={{
          marginTop: 16,
          display: "flex",
          gap: 10,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          paddingLeft: 22,
          paddingRight: 22,
          scrollbarWidth: "none",
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={{ flex: "0 0 84%", scrollSnapAlign: "start" }}>
            {urls ? (
              <div
                style={{
                  position: "relative",
                  aspectRatio: "4 / 3",
                  borderRadius: 14,
                  overflow: "hidden",
                }}
              >
                <Image
                  src={urls[i]}
                  alt={t("photoLabel", { index: i + 1, count })}
                  fill
                  sizes="84vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
            ) : (
              <Photo
                ratio="4 / 3"
                radius={14}
                label={t("photoLabel", { index: i + 1, count })}
              />
            )}
          </div>
        ))}
      </div>

      <div className="container" style={{ display: "flex", gap: 5, marginTop: 14 }}>
        {Array.from({ length: count }).map((_, i) => (
          <span
            key={i}
            style={{
              height: 3,
              flex: 1,
              borderRadius: 99,
              background: i === idx ? "var(--ink)" : "var(--hairline)",
              transition: "background .25s ease",
            }}
          />
        ))}
      </div>
    </section>
  );
}
