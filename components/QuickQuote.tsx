"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { parsePrice, formatVnd } from "@/config/services";
import type { SeatGroup } from "@/lib/seatGroups";
import type { BookingContext } from "@/hooks/useContact";

/**
 * QuickQuote — báo giá nhanh theo SỐ CHỖ: chọn loại (5/7/16 chỗ) → hình thức →
 * số ngày → (đi xa?) → tạm tính ngay. "Gửi yêu cầu" → sheet đặt xe (để lại SĐT).
 */
export function QuickQuote({
  groups,
  onBook,
}: {
  groups: SeatGroup[];
  onBook: (ctx: BookingContext) => void;
}) {
  const [seats, setSeats] = useState(groups[0]?.seats ?? 0);
  const [mode, setMode] = useState<"driver" | "self">("driver");
  const [days, setDays] = useState(1);
  const [far, setFar] = useState(false);
  const [pulse, setPulse] = useState(false);

  const g = groups.find((x) => x.seats === seats) ?? groups[0];

  const bump = () => {
    setPulse(true);
    window.setTimeout(() => setPulse(false), 260);
  };
  const pickSeats = (grp: SeatGroup) => {
    setSeats(grp.seats);
    if (mode === "self" && !grp.priceSelf) setMode("driver");
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

  if (!g) return null;
  const unit = parsePrice(mode === "self" ? g.priceSelf : g.priceDriver);
  const total = unit * days;

  return (
    <div className="est-card">
      <div className="est-label">Chọn loại xe (số chỗ)</div>
      <div className="est-chips">
        {groups.map((grp) => (
          <button
            key={grp.seats}
            className={`est-chip ${grp.seats === seats ? "on" : ""}`}
            onClick={() => pickSeats(grp)}
          >
            {grp.label}
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
          disabled={!g.priceSelf}
          onClick={() => g.priceSelf && pickMode("self")}
        >
          Tự lái{!g.priceSelf ? " · không có" : ""}
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
            Tạm tính {g.multiple ? "(từ)" : ""}
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
          onBook({ source: "quote", seatsLabel: g.label, seats: g.seats, mode, days, far, total })
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
