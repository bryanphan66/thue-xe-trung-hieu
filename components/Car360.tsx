"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw, RotateCw } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Car360 — "xoay 360° từ ẢNH THẬT" (không phải 3D model nặng).
 *  - Chuỗi ảnh chụp quanh xe; vuốt ngang / kéo chuột / phím ←→ để xoay.
 *  - Tự xoay nhẹ khi nhàn rỗi (dừng hẳn khi người dùng chạm); tôn trọng prefers-reduced-motion.
 *  - Preload toàn bộ frame để xoay mượt, có thanh tiến độ lúc tải.
 *  - Nhẹ, chạy tốt trên 3G; xe bóng/kính không thành vấn đề (chỉ là ảnh).
 */
export default function Car360({ frames, name }: { frames: string[]; name: string }) {
  const t = useTranslations("detail");
  const total = frames.length;

  const [index, setIndex] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [interacted, setInteracted] = useState(false);

  const boxRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; start: number } | null>(null);

  const ready = loadedCount >= total;

  // Preload tất cả frame (dùng để xoay mượt, không nháy).
  useEffect(() => {
    let alive = true;
    let done = 0;
    const bump = () => {
      if (!alive) return;
      done += 1;
      setLoadedCount(done);
    };
    frames.forEach((src) => {
      const img = new window.Image();
      img.onload = bump;
      img.onerror = bump;
      img.src = src;
    });
    return () => {
      alive = false;
    };
  }, [frames]);

  // Tự xoay nhẹ khi nhàn rỗi — dừng khi người dùng tương tác hoặc reduced-motion.
  useEffect(() => {
    if (!ready || interacted) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % total), 120);
    return () => window.clearInterval(id);
  }, [ready, interacted, total]);

  const rotateBy = (steps: number) => {
    setIndex((i) => ((i + steps) % total + total) % total);
  };

  // Kéo ngang: trọn chiều rộng vùng xem = 1 vòng đầy.
  const onPointerDown = (e: React.PointerEvent) => {
    setInteracted(true);
    drag.current = { x: e.clientX, start: index };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current || !boxRef.current) return;
    const w = boxRef.current.offsetWidth || 1;
    const delta = Math.round(((e.clientX - drag.current.x) / w) * total);
    setIndex((((drag.current.start - delta) % total) + total) % total);
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setInteracted(true);
      rotateBy(-1);
    } else if (e.key === "ArrowRight") {
      setInteracted(true);
      rotateBy(1);
    }
  };

  return (
    <section
      className="relative h-[420px] select-none bg-stage"
      style={{ background: "radial-gradient(120% 90% at 50% 18%, #1b1c20 0%, #0B0B0C 62%)" }}
    >
      <div
        ref={boxRef}
        role="img"
        aria-label={`${t("spin360")} ${name}`}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onKeyDown={onKeyDown}
        className="absolute inset-0 cursor-grab touch-pan-y outline-none active:cursor-grabbing"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={frames[index]}
          alt={`${name} — ${index + 1}/${total}`}
          draggable={false}
          className="h-full w-full object-contain transition-opacity duration-300"
          style={{ opacity: ready ? 1 : 0 }}
        />
      </div>

      {/* Loading + tiến độ */}
      {!ready && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center gap-4 bg-[#141416]">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
          <span className="rounded-md border border-stage-hairline bg-black/50 px-2.5 py-1 font-mono text-[11px] uppercase text-stage-muted">
            {t("loadingFrames")} {loadedCount}/{total}
          </span>
        </div>
      )}

      {/* Nhãn góc */}
      <div className="pointer-events-none absolute left-[18px] top-4 flex items-center gap-2 text-stage-muted">
        <RotateCw size={16} />
        <span className="font-mono text-[11px] uppercase tracking-[.06em]">{t("spin360")}</span>
      </div>

      {/* Gợi ý cử chỉ (tự fade) */}
      {ready && !interacted && (
        <div className="pointer-events-none absolute inset-x-0 bottom-[22px] flex animate-[hintFade_5.5s_ease_forwards] justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-stage-hairline bg-black/55 px-3.5 py-2 text-[13.5px] font-medium text-stage-ink backdrop-blur">
            <RotateCcw size={16} /> {t("gestureHintSpin")}
          </span>
        </div>
      )}

      <style jsx global>{`
        @keyframes hintFade {
          0%,
          55% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[hintFade_5\\.5s_ease_forwards\\] {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
