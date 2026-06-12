"use client";

import { useState } from "react";
import type { Service } from "@/config/cars";
import type { QuoteRequest } from "@/components/QuickQuote";

/**
 * Trạng thái sheet liên hệ. 4 kiểu:
 *   "call" | "zalo"                      — gọi/Zalo thường (sticky bar, CTA)
 *   { kind:"service", service }          — bấm 1 dịch vụ ở chương 01 → gợi ý xe
 *   { kind:"quote",   data: QuoteRequest}— "Gửi yêu cầu" từ QuickQuote (ch.03)
 */
export type ContactState =
  | "call"
  | "zalo"
  | { kind: "service"; service: Service }
  | { kind: "quote"; data: QuoteRequest }
  | null;

export function useContact() {
  const [open, setOpen] = useState<ContactState>(null);
  return {
    open,
    call: () => setOpen("call"),
    zalo: () => setOpen("zalo"),
    service: (s: Service) => setOpen({ kind: "service", service: s }),
    quote: (data: QuoteRequest) => setOpen({ kind: "quote", data }),
    close: () => setOpen(null),
  };
}
