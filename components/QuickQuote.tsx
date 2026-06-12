"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import type { Car } from "@/types/db";
import { parsePrice, formatVnd } from "@/config/services";
import type { QuoteRequest } from "@/hooks/useContact";

/**
 * QuickQuote — báo giá nhanh: chọn xe → hình thức → số ngày → (đi xa?) → tạm tính ngay.
 * "Gửi yêu cầu này" → onQuote(req) mở ContactSheet kiểu quote.
 */
export function QuickQuote({
  cars,
  onQuote,
}: {
  cars: Car[];
  onQuote: (req: QuoteRequest) => void;
}) {
  const [carSlug, setCarSlug] = useState(cars[0]?.slug ?? "");
  const [mode, setMode] = useState<"driver" | "self">("driver");
  const [days, setDays] = useState(1);
  const [far, setFar] = useState(false);
  const [pulse, setPulse] = useState(false);

  const car = cars.find((c) => c.slug === carSlug) ?? cars[0];

  // "Nảy" số tạm tính khi đổi lựa chọn — gọi trong handler (không phải effect).
  const bump = () => {
    setPulse(true);
    window.setTimeout(() => setPulse(false), 260);
  };
  const pickCar = (c: Car) => {
    setCarSlug(c.slug);
    if (mode === "self" && !c.priceSelf) setMode("driver");
    bump();
  };
  const pickMode = (m: "driver" | "self") => {
    setMode(m);
    bump();
  };
  const changeDays = (delta: number) => {
    setDays((d) => Math.min(30, Math.max(1, d + delta)));
    bump();
  };

  const unit = parsePrice(mode === "self" ? car?.priceSelf ?? null : car?.priceDriver ?? null);
  const total = unit * days;

  if (!car) return null;
  const shortName = (n: string) => n.replace(/^(Toyota|Mazda|Ford|Hyundai|Kia)\s/, "");

  return (
    <div className="est-card">
      <div className="est-label">Chọn xe</div>
      <div className="est-chips">
        {cars.map((c) => (
          <button
            key={c.slug}
            className={`est-chip ${c.slug === carSlug ? "on" : ""}`}
            onClick={() => pickCar(c)}
          >
            {shortName(c.name)}
          </button>
        ))}
      </div>

      <div className="est-label" style={{ marginTop: 18 }}>
        Hình thức
      </div>
      <div className="seg">
        <button className={mode === "driver" ? "on" : ""} onClick={() => pickMode("driver")}>
          Có tài xế
        </button>
        <button
          className={mode === "self" ? "on" : ""}
          disabled={!car.priceSelf}
          onClick={() => car.priceSelf && pickMode("self")}
        >
          Tự lái{!car.priceSelf ? " · không có" : ""}
        </button>
      </div>

      <div className="est-label" style={{ marginTop: 18 }}>
        Số ngày thuê
      </div>
      <div className="step">
        <button onClick={() => changeDays(-1)} aria-label="Bớt ngày">
          –
        </button>
        <span className="val">{days}</span>
        <button onClick={() => changeDays(1)} aria-label="Thêm ngày">
          +
        </button>
      </div>

      <div className="est-toggle" style={{ marginTop: 20 }}>
        <div>
          <div style={{ fontSize: 15.5, fontWeight: 600 }}>Đi xa / qua đêm</div>
          <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>
            Có thể phụ phí — báo giá khi gọi
          </div>
        </div>
        <button
          className={`switch ${far ? "on" : ""}`}
          onClick={() => setFar((f) => !f)}
          aria-label="Đi xa"
        />
      </div>

      <div
        style={{
          borderTop: "1px solid var(--hairline)",
          marginTop: 20,
          paddingTop: 18,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <div className="muted" style={{ fontSize: 13, fontWeight: 500 }}>
            Tạm tính
          </div>
          <div className={`est-total ${pulse ? "pulse" : ""}`}>
            {formatVnd(total)}
            <span className="muted" style={{ fontSize: 15, fontWeight: 500 }}>
              {" "}
              đ
            </span>
          </div>
        </div>
        <div className="muted" style={{ fontSize: 13, textAlign: "right", lineHeight: 1.5 }}>
          {formatVnd(unit)} đ<br />× {days} ngày
        </div>
      </div>

      <button
        className="btn btn-primary"
        style={{ marginTop: 18 }}
        onClick={() =>
          onQuote({ carSlug: car.slug, carName: car.name, mode, days, far, total })
        }
      >
        <MessageCircle size={18} /> Gửi yêu cầu này
      </button>
      <div className="muted" style={{ fontSize: 12.5, marginTop: 12, lineHeight: 1.5 }}>
        * Số tiền tạm tính theo giá ngày. Phụ phí đi xa, qua đêm, ngày lễ báo riêng khi gọi.
      </div>
    </div>
  );
}
