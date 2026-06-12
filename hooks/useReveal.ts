"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useReveal — hiện nội dung khi cuộn tới (fade + dịch).
 * BẮT BUỘC có fallback: nếu IntersectionObserver chưa kích hoạt (vd tab đang ẩn lúc tải)
 * thì sau ~1.3s vẫn hiện — KHÔNG để nội dung kẹt ở opacity 0.
 *
 * Trong Next, trang cuộn theo window nên root = null là đủ.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(opts?: {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}) {
  const { threshold = 0.12, rootMargin = "0px 0px -6% 0px", once = true } = opts ?? {};
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            if (once) io.unobserve(el);
          } else if (!once) {
            setShown(false);
          }
        }),
      { threshold, rootMargin }
    );
    io.observe(el);

    const fallback = window.setTimeout(() => setShown(true), 1300);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [threshold, rootMargin, once]);

  return { ref, shown };
}
