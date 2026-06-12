"use client";

import { useEffect, useRef, useState } from "react";
import { CARS } from "@/config/cars";

/**
 * HeroShowcase — carousel khoe 3 xe đầu, tự lướt ngang (~3,8s) kiểu "đang chạy".
 * Mỗi tấm có caption tên xe + số chỗ; chấm chỉ báo bấm được; chạm → tạm dừng.
 * Ảnh hiện tại "thở" (Ken Burns). prefers-reduced-motion → đứng yên.
 *
 * THAY ẢNH THẬT: đổi <div className="imgph"> bằng <Image .../> của next/image,
 * dùng car.heroPhoto (bạn thêm field) hoặc /public/cars/<id>-hero.jpg.
 */
export function HeroShowcase() {
  const heroCars = CARS.slice(0, 3);
  const [idx, setIdx] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      if (!paused.current) setIdx((i) => (i + 1) % heroCars.length);
    }, 3800);
    return () => clearInterval(t);
  }, [heroCars.length]);

  return (
    <div
      className="hero-show"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onTouchStart={() => (paused.current = true)}
    >
      <div className="hero-show-track" style={{ transform: `translateX(${-idx * 100}%)` }}>
        {heroCars.map((c, i) => (
          <div className="hero-slide" key={c.id}>
            {/* placeholder — thay bằng ảnh thật. i===idx mới gắn .hero-photo (Ken Burns). */}
            <div className={`imgph dark ${i === idx ? "hero-photo" : ""}`} style={{ aspectRatio: "16 / 11" }}>
              <span className="lbl">Ảnh xe · {c.name}</span>
            </div>
            <span className="hero-cap">
              {c.name} <span className="muted font-medium">· {c.seats} chỗ</span>
            </span>
          </div>
        ))}
      </div>
      <div className="hero-dots">
        {heroCars.map((_, i) => (
          <button key={i} className={i === idx ? "on" : ""} onClick={() => setIdx(i)} aria-label={`Xe ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}
