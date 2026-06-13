"use client";

import { useState } from "react";
import {
  Phone,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Check,
  Stethoscope,
  HeartHandshake,
  TreePalm,
  Navigation,
  Ellipsis,
  type LucideIcon,
} from "lucide-react";
import { BRAND, tel, zaloLink } from "@/config/brand";
import { SVC_SUGGEST, formatVnd, type ServiceIcon } from "@/config/services";
import { groupCarsBySeats, type SeatGroup } from "@/lib/seatGroups";
import { submitBooking } from "@/lib/actions";
import ZaloIcon from "@/components/ZaloIcon";
import type { Car } from "@/types/db";
import type { ContactState, BookingContext } from "@/hooks/useContact";

const SVC_ICON: Record<ServiceIcon, LucideIcon> = {
  stethoscope: Stethoscope,
  heart: HeartHandshake,
  palm: TreePalm,
  navigation: Navigation,
  other: Ellipsis,
};

const inputClass =
  "w-full min-h-[52px] rounded-[13px] border border-hairline bg-surface px-4 text-ink placeholder:text-muted outline-none focus:border-ink transition-colors";

/**
 * ContactSheet — bottom sheet liên hệ (call / zalo / service / book).
 * book = "Để nhà xe gọi lại": form chỉ bắt buộc SĐT → submitBooking (lưu + Telegram).
 * Render có điều kiện (mount mới mỗi lần mở) nên state form tự reset.
 */
export function ContactSheet({
  open,
  cars,
  onClose,
  onPickCar,
  onBook,
}: {
  open: ContactState;
  cars: Car[];
  onClose: () => void;
  onPickCar: (slug: string) => void;
  onBook: (ctx: BookingContext) => void;
}) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [hp, setHp] = useState(""); // honeypot — người thật không thấy/không điền
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  if (!open) return null;

  const isService = typeof open === "object" && open.kind === "service";
  const isBook = typeof open === "object" && open.kind === "book";
  const isCall = open === "call";
  const svc = isService ? open.service : null;
  const ctx = isBook ? open.ctx : null;

  let suggest: SeatGroup[] = [];
  if (svc) {
    const groups = groupCarsBySeats(cars);
    const seatsWanted = SVC_SUGGEST[svc.icon] ?? [];
    suggest = groups.filter((g) => seatsWanted.includes(g.seats));
    if (suggest.length === 0) suggest = groups;
  }

  const modeText = ctx?.mode === "self" ? "Tự lái" : ctx?.mode === "driver" ? "Có tài xế" : null;
  const summaryRows: [string, string][] = ctx
    ? ([
        ctx.purpose ? ["Dịch vụ", ctx.purpose] : null,
        ctx.seatsLabel ? ["Loại xe", ctx.seatsLabel] : null,
        modeText ? ["Hình thức", modeText] : null,
        ctx.days ? ["Số ngày", `${ctx.days} ngày`] : null,
        ctx.far ? ["Lưu ý", "Đi xa / qua đêm"] : null,
      ].filter(Boolean) as [string, string][])
    : [];

  const heading = isBook
    ? "Để nhà xe gọi lại"
    : isService
      ? `Cần xe · ${svc!.label}`
      : isCall
        ? "Gọi cho nhà xe"
        : "Nhắn Zalo cho nhà xe";

  const HeadIcon = isBook ? Sparkles : isService ? SVC_ICON[svc!.icon] : isCall ? Phone : MessageCircle;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const res = await submitBooking({
      phone,
      name,
      hp,
      source: ctx?.source ?? "book",
      purpose: ctx?.purpose,
      seatsLabel: ctx?.seatsLabel,
      seats: ctx?.seats,
      mode: ctx?.mode,
      days: ctx?.days,
      far: ctx?.far,
      total: ctx?.total,
    });
    setStatus(res.ok ? "ok" : "error");
  }

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
            {isBook && status === "ok" ? <Check size={24} /> : <HeadIcon size={24} />}
          </div>
          <div>
            <div className="text-[13.5px] font-medium text-muted">{heading}</div>
            <div className="mt-0.5 text-[23px] font-extrabold tracking-[-0.03em]">{BRAND.phone}</div>
          </div>
        </div>

        {/* ----- BOOK: form đặt xe nhanh ----- */}
        {isBook ? (
          status === "ok" ? (
            <>
              <p className="mt-[18px] rounded-xl border border-hairline bg-bg px-4 py-3.5 text-[15.5px] leading-relaxed">
                Đã nhận thông tin. Nhà xe sẽ <b>gọi lại cho bạn ngay</b>. Cảm ơn quý khách!
              </p>
              <a href={tel} className="btn btn-primary mt-[18px]">
                <Phone size={19} /> Gọi luôn cho nhanh
              </a>
              <a href={zaloLink} target="_blank" rel="noreferrer" className="btn btn-ghost mt-2.5">
                <ZaloIcon size={20} /> Nhắn Zalo
              </a>
              <button type="button" onClick={onClose} className="btn btn-ghost mt-2.5 border-none">
                Đóng
              </button>
            </>
          ) : (
            <form onSubmit={onSubmit}>
              {summaryRows.length > 0 && (
                <div className="mt-[18px] rounded-xl border border-hairline bg-bg px-4 py-3">
                  {summaryRows.map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3 py-0.5 text-[14px]">
                      <span className="muted">{k}</span>
                      <span className="font-semibold">{v}</span>
                    </div>
                  ))}
                  {ctx?.total ? (
                    <div className="mt-1.5 flex items-baseline justify-between gap-3 border-t border-hairline pt-2">
                      <span className="font-semibold">Tạm tính</span>
                      <span className="text-[19px] font-extrabold tracking-[-0.03em]">
                        {formatVnd(ctx.total)} đ
                      </span>
                    </div>
                  ) : null}
                </div>
              )}

              <p className="mt-[18px] text-[14.5px] text-muted">
                Để lại số điện thoại, nhà xe gọi lại tư vấn & giữ xe cho bạn:
              </p>
              <input
                name="phone"
                type="tel"
                inputMode="tel"
                required
                autoFocus
                placeholder="Số điện thoại của bạn *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`${inputClass} mt-2.5`}
              />
              <input
                name="name"
                type="text"
                placeholder="Tên của bạn (không bắt buộc)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`${inputClass} mt-2.5`}
              />
              {/* Honeypot: ẩn với người thật, bot tự điền → server bỏ qua */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
              />

              {status === "error" && (
                <p className="mt-2.5 text-[14px] text-clay" style={{ color: "#b4321f" }}>
                  Số điện thoại chưa hợp lệ. Bà con thử lại hoặc gọi trực tiếp giúp nhé.
                </p>
              )}

              <button
                type="submit"
                className="btn btn-primary mt-[18px]"
                disabled={status === "sending"}
                style={{ opacity: status === "sending" ? 0.7 : 1 }}
              >
                {status === "sending" ? "Đang gửi…" : "Gửi — nhà xe gọi lại"}
              </button>
              <a href={tel} className="btn btn-ghost mt-2.5">
                <Phone size={19} /> Hoặc gọi luôn 0326 120 108
              </a>
            </form>
          )
        ) : (
          <>
            {/* ----- SERVICE: gợi ý loại xe ----- */}
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

            {isService && (
              <button
                type="button"
                onClick={() => onBook({ source: "service", purpose: svc!.label })}
                className="btn btn-primary mt-[18px]"
              >
                <Phone size={19} /> Để nhà xe gọi lại
              </button>
            )}
            <a href={tel} className={isService ? "btn btn-ghost mt-2.5" : "btn btn-primary mt-[18px]"}>
              <Phone size={19} /> Gọi ngay
            </a>
            <a href={zaloLink} target="_blank" rel="noreferrer" className="btn btn-ghost mt-2.5">
              <ZaloIcon size={20} /> Nhắn Zalo
            </a>
            <button type="button" onClick={onClose} className="btn btn-ghost mt-2.5 border-none">
              Đóng
            </button>
          </>
        )}
      </div>
    </div>
  );
}
