"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Car } from "@/types/db";

/**
 * HeroShowcase — carousel khoe tối đa 3 xe đầu, tự lướt (~3,8s), chạm → dừng.
 * Ảnh thật nếu có (car.photoUrls[0]), ngược lại placeholder sọc. Ken Burns cho tấm đang xem.
 * prefers-reduced-motion → đứng yên.
 */
export function HeroShowcase({ cars }: { cars: Car[] }) {
  const heroCars = cars.slice(0, 3);
  const [idx, setIdx] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    if (heroCars.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      if (!paused.current) setIdx((i) => (i + 1) % heroCars.length);
    }, 3800);
    return () => clearInterval(t);
  }, [heroCars.length]);

  if (heroCars.length === 0) return null;

  return (
    <div
      className="hero-show"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onTouchStart={() => (paused.current = true)}
    >
      <div className="hero-show-track" style={{ transform: `translateX(${-idx * 100}%)` }}>
        {heroCars.map((c, i) => {
          const cover = c.photoUrls?.[0];
          return (
            <div className="hero-slide" key={c.slug}>
              <div
                className={`imgph dark ${i === idx ? "hero-photo" : ""}`}
                style={{ aspectRatio: "16 / 11" }}
              >
                {cover ? (
                  <Image
                    src={cover}
                    alt={`Ảnh xe ${c.name}`}
                    fill
                    sizes="448px"
                    priority={i === 0}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <span className="lbl">Ảnh xe · {c.name}</span>
                )}
              </div>
              <span className="hero-cap">
                {c.name} <span className="muted font-medium">· {c.seats} chỗ</span>
              </span>
            </div>
          );
        })}
      </div>
      {heroCars.length > 1 && (
        <div className="hero-dots">
          {heroCars.map((_, i) => (
            <button
              key={i}
              className={i === idx ? "on" : ""}
              onClick={() => setIdx(i)}
              aria-label={`Xe ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
