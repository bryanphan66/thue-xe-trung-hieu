"use client";

import { useState } from "react";
import type { Service } from "@/config/services";

/** Ngữ cảnh đính kèm khi khách đặt xe (từ báo giá hoặc thẻ số chỗ). */
export type BookingContext = {
  source: string; // 'quote' | 'seat'
  seatsLabel?: string; // "7 chỗ"
  seats?: number;
  mode?: "driver" | "self";
  days?: number;
  far?: boolean;
  total?: number;
};

/**
 * Trạng thái sheet liên hệ:
 *   "call" | "zalo"               — gọi/Zalo thường
 *   { kind:"service", service }   — bấm 1 dịch vụ → gợi ý loại xe
 *   { kind:"book", ctx }          — "Để nhà xe gọi lại" (đặt xe nhanh)
 */
export type ContactState =
  | "call"
  | "zalo"
  | { kind: "service"; service: Service }
  | { kind: "book"; ctx: BookingContext }
  | null;

export function useContact() {
  const [open, setOpen] = useState<ContactState>(null);
  return {
    open,
    call: () => setOpen("call"),
    zalo: () => setOpen("zalo"),
    service: (s: Service) => setOpen({ kind: "service", service: s }),
    book: (ctx: BookingContext) => setOpen({ kind: "book", ctx }),
    close: () => setOpen(null),
  };
}
