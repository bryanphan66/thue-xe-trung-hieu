"use client";

import { useEffect, useRef, useState } from "react";
import { Box, RotateCcw } from "lucide-react";
import type { ModelViewerElement } from "@/types/model-viewer";

/**
 * Car3DViewer — trình xem 3D trên "sân khấu" tối.
 *  - Tự xoay chậm khi nhàn rỗi, vuốt để xoay, chụm để zoom.
 *  - Nút AR "Xem trong sân nhà bạn" (điện thoại hỗ trợ).
 *  - Trạng thái tải (poster + spinner) cho mạng yếu; fallback ảnh thật khi lỗi.
 *
 * Đăng ký web component model-viewer client-side (KHÔNG import ở top-level để tránh SSR lỗi):
 *   import("@google/model-viewer")
 *
 * TODO: thay `src` bằng file .glb xe thật + `poster` ảnh thật từng xe.
 */
export default function Car3DViewer({
  src,
  poster,
  name,
}: {
  src: string;
  poster?: string;
  name: string;
}) {
  const ref = useRef<ModelViewerElement>(null);
  const [ready, setReady] = useState(false); // đã đăng ký custom element
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    import("@google/model-viewer").then(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const mv = ref.current;
    if (!mv || !ready) return;
    const onLoad = () => setLoaded(true);
    const onErr = () => {
      setFailed(true);
      setLoaded(true);
    };
    mv.addEventListener("load", onLoad);
    mv.addEventListener("error", onErr);
    const t = window.setTimeout(() => !mv.loaded && setLoaded(true), 9000);
    return () => {
      mv.removeEventListener("load", onLoad);
      mv.removeEventListener("error", onErr);
      window.clearTimeout(t);
    };
  }, [ready]);

  return (
    <section
      className="relative h-[420px] bg-stage"
      style={{ background: "radial-gradient(120% 90% at 50% 18%, #1b1c20 0%, #0B0B0C 62%)" }}
    >
      {ready && !failed && (
        // @ts-expect-error — web component
        <model-viewer
          ref={ref}
          src={src}
          poster={poster}
          alt={`Mô hình 3D ${name}`}
          loading="eager"
          reveal="auto"
          camera-controls=""
          auto-rotate=""
          auto-rotate-delay="3000"
          rotation-per-second="14deg"
          interaction-prompt="none"
          touch-action="pan-y"
          shadow-intensity="1.1"
          shadow-softness="1"
          exposure="0.9"
          ar=""
          ar-modes="webxr scene-viewer quick-look"
          className="absolute inset-0 h-full w-full transition-opacity duration-500"
          style={{ opacity: loaded ? 1 : 0, background: "transparent" }}
        />
      )}

      {/* Loading / fallback */}
      {(!loaded || failed) && (
        <div className="absolute inset-0 grid place-items-center gap-4 bg-[#141416]">
          {!failed ? (
            <>
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
              <span className="rounded-md border border-stage-hairline bg-black/50 px-2.5 py-1 font-mono text-[11px] uppercase text-stage-muted">
                Đang tải mô hình 3D…
              </span>
            </>
          ) : poster ? (
            <img src={poster} alt={name} className="h-full w-full object-cover" />
          ) : (
            <span className="font-mono text-[11px] uppercase text-stage-muted">
              Poster ảnh xe · {name}
            </span>
          )}
        </div>
      )}

      {/* Nhãn góc */}
      <div className="absolute left-[18px] top-4 flex items-center gap-2 text-stage-muted">
        <Box size={16} />
        <span className="font-mono text-[11px] uppercase tracking-[.06em]">Mô hình 3D</span>
      </div>

      {/* Gợi ý cử chỉ (tự fade) */}
      {loaded && !failed && (
        <div className="pointer-events-none absolute inset-x-0 bottom-[70px] flex animate-[hintFade_5.5s_ease_forwards] justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-stage-hairline bg-black/55 px-3.5 py-2 text-[13.5px] font-medium text-stage-ink backdrop-blur">
            <RotateCcw size={16} /> Vuốt để xoay · chụm để zoom
          </span>
        </div>
      )}

      {/* Nút AR */}
      <button
        type="button"
        onClick={() => ref.current?.activateAR?.()}
        className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-[12px] bg-stage-ink px-4 py-[11px] text-[14.5px] font-semibold text-ink"
      >
        <Box size={17} /> Xem trong sân nhà bạn
      </button>

      {/* keyframes cho gợi ý cử chỉ — hoặc khai báo trong tailwind.config */}
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
