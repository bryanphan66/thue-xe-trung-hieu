"use client";

import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";

/**
 * JourneyRail — "mạch hành trình" rất mảnh ở MÉP TRÁI (KHÔNG cắt vào nội dung).
 * Đây là CHỈ BÁO tiến trình, cố tình tiết chế — nội dung mới là ngôi sao.
 *
 * Đèn xe đổi theo HƯỚNG cuộn:
 *   cuộn xuống (tiến)  → .adv  → đèn pha trắng sáng
 *   cuộn lên   (lùi)   → .rev  → đèn hậu đỏ nhấp nháy
 *   dừng (~170ms)      → .brake→ đèn phanh đỏ sáng đều
 *
 * QUAN TRỌNG: hiệu ứng chạy theo scroll của CHÍNH container .page (cột giới hạn
 * bề ngang), KHÔNG phải window — nhiều môi trường nhúng vô hiệu hoá window-scroll.
 * Đặt <JourneyRail/> làm con đầu của .journey; mỗi <Chapter/> có 1 .node trên ray.
 *
 * Mọi chuyển động chỉ dùng transform/opacity + requestAnimationFrame (mượt máy yếu),
 * và có nhánh prefers-reduced-motion.
 */
export function JourneyRail({ scrollSelector = ".page" }: { scrollSelector?: string }) {
  const carRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const journey = document.querySelector<HTMLElement>(".journey");
    const scroller = document.querySelector<HTMLElement>(scrollSelector);
    const car = carRef.current, fill = fillRef.current;
    if (!journey || !scroller || !car || !fill) return;
    let raf = 0, lastTop = scroller.scrollTop, idle: ReturnType<typeof setTimeout>;

    const setDrive = (cls: "adv" | "rev" | "brake") => {
      car.classList.remove("adv", "rev", "brake");
      car.classList.add(cls);
    };

    const update = () => {
      raf = 0;
      const sr = scroller.getBoundingClientRect();
      const jr = journey.getBoundingClientRect();
      const vh = scroller.clientHeight;
      const y = Math.max(0, Math.min(jr.height, vh * 0.4 - (jr.top - sr.top)));
      car.style.transform = `translateY(${y}px)`;
      fill.style.height = `${y}px`;
      car.classList.toggle("on", jr.top - sr.top < vh * 0.5 && jr.bottom - sr.top > 0);
      journey.querySelectorAll<HTMLElement>(".node").forEach((n) => {
        const nr = n.getBoundingClientRect();
        n.classList.toggle("on", y >= nr.top - jr.top + nr.height / 2 - 2);
      });
    };

    const onScroll = () => {
      const top = scroller.scrollTop;
      if (top > lastTop + 0.6) setDrive("adv");
      else if (top < lastTop - 0.6) setDrive("rev");
      lastTop = top;
      clearTimeout(idle);
      idle = setTimeout(() => setDrive("brake"), 170);
      if (!raf) raf = requestAnimationFrame(update);
    };

    setDrive("brake");
    update();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const t = setTimeout(update, 400);
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      clearTimeout(t); clearTimeout(idle);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [scrollSelector]);

  return (
    <>
      <div className="spine" />
      <div className="spine-fill" ref={fillRef} />
      <span className="rail-start" />
      <div className="rail-dest"><MapPin size={15} /></div>
      <div className="rail-car" ref={carRef}>
        {/* xe nhìn từ trên — dựng bằng các lớp .body/.roof/.glass/.wheel/.light;
            xem CSS trong globals (.car ...). Đèn .hl (pha) + .tl (hậu) đổi theo state. */}
        <div className="car">
          <div className="body" /><div className="glass rear" /><div className="roof" /><div className="glass front" />
          <span className="wheel fl" /><span className="wheel fr" /><span className="wheel rl" /><span className="wheel rr" />
          <span className="light hl l" /><span className="light hl r" />
          <span className="light tl l" /><span className="light tl r" />
        </div>
      </div>
    </>
  );
}

/**
 * Chapter — một "chặng" tự biên đạo khi cuộn tới (≈ khi xe tới nơi):
 * số chương hiện → vạch kẻ chạy ngang (scaleX) → nhãn → tiêu đề trồi lên.
 * Dùng IntersectionObserver với root = container .page.
 */
export function Chapter({
  n, tag, label, children, scrollSelector = ".page",
}: {
  n: string; tag: string; label?: string; children: React.ReactNode; scrollSelector?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const root = document.querySelector<HTMLElement>(scrollSelector);
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { el.classList.add("show"); io.unobserve(el); } }),
      { root, threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    const fb = setTimeout(() => el.classList.add("show"), 1400); // an toàn: không kẹt ẩn
    return () => { io.disconnect(); clearTimeout(fb); };
  }, [scrollSelector]);

  return (
    <section ref={ref} className="chapter" data-screen-label={`Chương ${n}`}>
      <span className="node" />
      <div className="chapter-head">
        <span className="chapter-num">{n}</span>
        <span className="chapter-rule" />
        <span className="chapter-tag">{tag}</span>
      </div>
      {label ? <h2 className="chapter-label text-h2">{label}</h2> : null}
      {children}
    </section>
  );
}
