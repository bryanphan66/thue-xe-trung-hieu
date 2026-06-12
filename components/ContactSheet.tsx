"use client";

import {
  Phone,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Stethoscope,
  HeartHandshake,
  TreePalm,
  Navigation,
  type LucideIcon,
} from "lucide-react";
import { BRAND, tel, zaloLink } from "@/config/brand";
import { SVC_SUGGEST, formatVnd, type ServiceIcon } from "@/config/services";
import { groupCarsBySeats, type SeatGroup } from "@/lib/seatGroups";
import type { Car } from "@/types/db";
import type { ContactState } from "@/hooks/useContact";

const SVC_ICON: Record<ServiceIcon, LucideIcon> = {
  stethoscope: Stethoscope,
  heart: HeartHandshake,
  palm: TreePalm,
  navigation: Navigation,
};

/**
 * ContactSheet — bottom sheet liên hệ, 4 kiểu (call/zalo/service/quote).
 * Luôn có cả Gọi & Zalo. service: chip xe gợi ý (bấm → chi tiết). quote: hộp tóm tắt.
 */
export function ContactSheet({
  open,
  cars,
  onClose,
  onPickCar,
}: {
  open: ContactState;
  cars: Car[];
  onClose: () => void;
  onPickCar: (slug: string) => void;
}) {
  if (!open) return null;

  const isService = typeof open === "object" && open.kind === "service";
  const isQuote = typeof open === "object" && open.kind === "quote";
  const isCall = open === "call";
  const svc = isService ? open.service : null;
  const q = isQuote ? open.data : null;

  // Gợi ý theo LOẠI XE (số chỗ) cho dịch vụ.
  let suggest: SeatGroup[] = [];
  if (svc) {
    const groups = groupCarsBySeats(cars);
    const seatsWanted = SVC_SUGGEST[svc.icon] ?? [];
    suggest = groups.filter((g) => seatsWanted.includes(g.seats));
    if (suggest.length === 0) suggest = groups;
  }

  const heading = isQuote
    ? "Yêu cầu báo giá"
    : isService
      ? `Cần xe · ${svc!.label}`
      : isCall
        ? "Gọi cho nhà xe"
        : "Nhắn Zalo cho nhà xe";

  const HeadIcon = isQuote ? Sparkles : isService ? SVC_ICON[svc!.icon] : isCall ? Phone : MessageCircle;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/40 backdrop-blur-[2px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-mobile animate-sheetUp rounded-t-sheet bg-surface px-[22px] pb-[calc(28px+env(safe-area-inset-bottom))] pt-2.5"
      >
        <div className="mx-auto mb-[22px] h-1 w-[38px] rounded-full bg-hairline" />

        <div className="flex items-center gap-3.5">
          <div className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-[14px] bg-ink text-white">
            <HeadIcon size={24} />
          </div>
          <div>
            <div className="text-[13.5px] font-medium text-muted">{heading}</div>
            <div className="mt-0.5 text-[23px] font-extrabold tracking-[-0.03em]">{BRAND.phone}</div>
          </div>
        </div>

        {isQuote && q && (
          <div className="mt-[18px] rounded-xl border border-hairline bg-bg px-4 py-3.5">
            {[
              ["Loại xe", q.label],
              ["Hình thức", q.mode === "self" ? "Tự lái" : "Có tài xế"],
              ["Số ngày", `${q.days} ngày`],
              ...(q.far ? [["Lưu ý", "Đi xa / qua đêm"]] : []),
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 py-1 text-[14.5px]">
                <span className="muted">{k}</span>
                <span className="font-semibold">{v}</span>
              </div>
            ))}
            <div className="mt-2 flex items-baseline justify-between gap-3 border-t border-hairline pt-2.5">
              <span className="font-semibold">Tạm tính</span>
              <span className="text-[21px] font-extrabold tracking-[-0.03em]">{formatVnd(q.total)} đ</span>
            </div>
          </div>
        )}

        {isService && (
          <div className="mt-[18px] rounded-xl border border-hairline bg-bg px-4 py-3.5">
            <div className="text-[12.5px] font-semibold uppercase tracking-wide text-muted">
              Đang sẵn xe phù hợp · bấm để xem
            </div>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {suggest.map((g) => (
                <button
                  key={g.seats}
                  onClick={() => g.cars[0] && onPickCar(g.cars[0].slug)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-3 py-2 text-sm font-semibold"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {g.label}
                  <ArrowRight size={15} className="text-muted" />
                </button>
              ))}
            </div>
          </div>
        )}

        <a href={tel} className="btn btn-primary mt-[18px]">
          <Phone size={19} /> Gọi ngay
        </a>
        <a href={zaloLink} target="_blank" rel="noreferrer" className="btn btn-ghost mt-2.5">
          <MessageCircle size={19} /> Nhắn Zalo
        </a>
        <button type="button" onClick={onClose} className="btn btn-ghost mt-2.5 border-none">
          Đóng
        </button>
      </div>
    </div>
  );
}
