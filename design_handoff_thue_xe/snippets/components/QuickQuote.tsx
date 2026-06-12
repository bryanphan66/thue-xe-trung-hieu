"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { CARS, parsePrice, formatVnd } from "@/config/cars";

export type QuoteRequest = {
  carId: string;
  carName: string;
  mode: "driver" | "self";
  days: number;
  far: boolean;
  total: number;
};

/**
 * QuickQuote — "Báo giá nhanh": chọn xe → hình thức → số ngày → (đi xa?) →
 * ra số tiền tạm tính ngay (giá ngày × số ngày, dùng giá ƯU ĐÃI nếu có).
 * "Gửi yêu cầu này" → onQuote(req) để mở ContactSheet tóm tắt sẵn (gọi/Zalo).
 *
 * Đặt bên trong <Chapter n="03" tag="Báo giá" label="Tính nhanh chi phí">.
 */
export function QuickQuote({ onQuote }: { onQuote: (req: QuoteRequest) => void }) {
  const [carId, setCarId] = useState(CARS[0].id);
  const [mode, setMode] = useState<"driver" | "self">("driver");
  const [days, setDays] = useState(1);
  const [far, setFar] = useState(false);
  const [pulse, setPulse] = useState(false);

  const car = CARS.find((c) => c.id === carId)!;
  useEffect(() => { if (mode === "self" && !car.self) setMode("driver"); }, [carId]); // eslint-disable-line

  const unit = parsePrice(mode === "self" ? car.self : car.driver);
  const total = unit * days;
  useEffect(() => { setPulse(true); const t = setTimeout(() => setPulse(false), 260); return () => clearTimeout(t); }, [total]);

  const shortName = (n: string) => n.replace(/^(Toyota|Mazda|Ford)\s/, "");

  return (
    <div className="est-card">
      <div className="est-label">Chọn xe</div>
      <div className="est-chips">
        {CARS.map((c) => (
          <button key={c.id} className={`est-chip ${c.id === carId ? "on" : ""}`} onClick={() => setCarId(c.id)}>
            {shortName(c.name)}
          </button>
        ))}
      </div>

      <div className="est-label mt-[18px]">Hình thức</div>
      <div className="seg">
        <button className={mode === "driver" ? "on" : ""} onClick={() => setMode("driver")}>Có tài xế</button>
        <button className={mode === "self" ? "on" : ""} disabled={!car.self} onClick={() => car.self && setMode("self")}>
          Tự lái{!car.self ? " · không có" : ""}
        </button>
      </div>

      <div className="est-label mt-[18px]">Số ngày thuê</div>
      <div className="step">
        <button onClick={() => setDays((d) => Math.max(1, d - 1))} aria-label="Bớt ngày">–</button>
        <span className="val">{days}</span>
        <button onClick={() => setDays((d) => Math.min(30, d + 1))} aria-label="Thêm ngày">+</button>
      </div>

      <div className="est-toggle mt-5">
        <div>
          <div className="text-[15.5px] font-semibold">Đi xa / qua đêm</div>
          <div className="muted text-[13px] mt-0.5">Có thể phụ phí — báo giá khi gọi</div>
        </div>
        <button className={`switch ${far ? "on" : ""}`} onClick={() => setFar((f) => !f)} aria-label="Đi xa" />
      </div>

      <div className="mt-5 flex items-end justify-between gap-3 border-t border-hairline pt-[18px]">
        <div>
          <div className="muted text-[13px] font-medium">Tạm tính</div>
          <div className={`est-total ${pulse ? "pulse" : ""}`}>
            {formatVnd(total)}<span className="muted text-[15px] font-medium"> đ</span>
          </div>
        </div>
        <div className="muted text-[13px] text-right leading-normal">{formatVnd(unit)} đ<br />× {days} ngày</div>
      </div>

      <button
        className="btn btn-primary mt-[18px]"
        onClick={() => onQuote({ carId, carName: car.name, mode, days, far, total })}
      >
        <MessageCircle size={18} /> Gửi yêu cầu này
      </button>
      <div className="muted text-[12.5px] mt-3 leading-normal">
        * Số tiền tạm tính theo giá ngày. Phụ phí đi xa, qua đêm, ngày lễ báo riêng khi gọi.
      </div>
    </div>
  );
}
