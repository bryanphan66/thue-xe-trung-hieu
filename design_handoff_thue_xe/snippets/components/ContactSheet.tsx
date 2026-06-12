"use client";

import { Phone, MessageCircle, Sparkles, ArrowRight } from "lucide-react";
import { BRAND, tel, zaloLink } from "@/config/brand";
import { CARS, SVC_SUGGEST, formatVnd, type Car } from "@/config/cars";
import type { ContactState } from "@/hooks/useContact";

/**
 * ContactSheet — bottom sheet liên hệ, 4 kiểu (xem ContactState):
 *   call/zalo        → số ĐT + Gọi/Zalo
 *   service          → "Cần xe · <dịch vụ>" + chip xe gợi ý (bấm mở chi tiết)
 *   quote            → "Yêu cầu báo giá" + tóm tắt lựa chọn + Gọi/Zalo
 * Luôn có sẵn cả hai nút Gọi & Zalo cho mọi kiểu (kênh chính của nhà xe).
 */
export function ContactSheet({
  open,
  onClose,
  onPickCar,
}: {
  open: ContactState;
  onClose: () => void;
  onPickCar: (c: Car) => void;
}) {
  if (!open) return null;

  const isService = typeof open === "object" && open.kind === "service";
  const isQuote = typeof open === "object" && open.kind === "quote";
  const isCall = open === "call";
  const svc = isService ? open.service : null;
  const q = isQuote ? open.data : null;
  const suggest = svc ? SVC_SUGGEST[svc.icon] ?? [] : [];

  const heading = isQuote
    ? "Yêu cầu báo giá"
    : isService
      ? `Cần xe · ${svc!.label}`
      : isCall
        ? "Gọi cho nhà xe"
        : "Nhắn Zalo cho nhà xe";

  return (
    <div onClick={onClose} className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/40 backdrop-blur-[2px]">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-mobile animate-sheetUp rounded-t-sheet bg-surface px-[22px] pb-[calc(28px+env(safe-area-inset-bottom))] pt-2.5"
      >
        <div className="mx-auto mb-[22px] h-1 w-[38px] rounded-full bg-hairline" />

        <div className="flex items-center gap-3.5">
          <div className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-[14px] bg-ink text-white">
            {isQuote ? <Sparkles size={24} /> : isCall || (!isService && !isQuote) ? <Phone size={24} /> : <MessageCircle size={24} />}
          </div>
          <div>
            <div className="text-[13.5px] font-medium text-muted">{heading}</div>
            <div className="mt-0.5 text-[23px] font-extrabold tracking-[-0.03em]">{BRAND.phone}</div>
          </div>
        </div>

        {/* Tóm tắt báo giá */}
        {isQuote && q && (
          <div className="mt-[18px] rounded-xl border border-hairline bg-bg px-4 py-3.5">
            {[
              ["Xe", q.carName],
              ["Hình thức", q.mode === "self" ? "Tự lái" : "Có tài xế"],
              ["Số ngày", `${q.days} ngày`],
              ...(q.far ? [["Lưu ý", "Đi xa / qua đêm"]] : []),
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 py-1 text-[14.5px]">
                <span className="muted">{k}</span><span className="font-semibold">{v}</span>
              </div>
            ))}
            <div className="mt-2 flex items-baseline justify-between gap-3 border-t border-hairline pt-2.5">
              <span className="font-semibold">Tạm tính</span>
              <span className="text-[21px] font-extrabold tracking-[-0.03em]">{formatVnd(q.total)} đ</span>
            </div>
          </div>
        )}

        {/* Xe gợi ý theo dịch vụ — bấm để xem chi tiết */}
        {isService && (
          <div className="mt-[18px] rounded-xl border border-hairline bg-bg px-4 py-3.5">
            <div className="text-[12.5px] font-semibold uppercase tracking-wide text-muted">Đang sẵn xe phù hợp · bấm để xem</div>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {suggest.map((nm) => {
                const c = CARS.find((x) => x.name === nm);
                if (!c) return null;
                return (
                  <button key={nm} onClick={() => onPickCar(c)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-3 py-2 text-sm font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />{nm}
                    <ArrowRight size={15} className="text-muted" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <a href={tel} className="btn btn-primary mt-[18px]"><Phone size={19} /> Gọi ngay</a>
        <a href={zaloLink} target="_blank" rel="noreferrer" className="btn btn-ghost mt-2.5"><MessageCircle size={19} /> Nhắn Zalo</a>
        <button type="button" onClick={onClose} className="btn btn-ghost mt-2.5 border-none">Đóng</button>
      </div>
    </div>
  );
}
