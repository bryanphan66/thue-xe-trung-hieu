"use client";

import { Phone, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { BRAND, tel, zaloLink } from "@/config/brand";
import type { ContactKind } from "@/hooks/useContact";

/**
 * ContactSheet — bottom sheet hiện số điện thoại + nút hành động thật.
 * Mở từ bất kỳ nút Gọi/Zalo. Bấm nền mờ hoặc "Đóng" để tắt.
 */
export function ContactSheet({
  open,
  onClose,
}: {
  open: ContactKind;
  onClose: () => void;
}) {
  const t = useTranslations("actions");
  const ts = useTranslations("contactSheet");
  if (!open) return null;
  const isCall = open === "call";

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[80] flex items-end bg-ink/40 backdrop-blur-[2px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full animate-sheetUp rounded-t-sheet bg-surface px-[22px] pb-[calc(28px+env(safe-area-inset-bottom))] pt-2.5"
      >
        <div className="mx-auto mb-[22px] h-1 w-[38px] rounded-full bg-hairline" />

        <div className="flex items-center gap-3.5">
          <div className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-[14px] bg-ink text-white">
            {isCall ? <Phone size={24} /> : <MessageCircle size={24} />}
          </div>
          <div>
            <div className="text-[13.5px] font-medium text-muted">
              {isCall ? ts("callTitle") : ts("zaloTitle")}
            </div>
            <div className="mt-0.5 text-[23px] font-extrabold tracking-[-0.03em]">
              {BRAND.phone}
            </div>
          </div>
        </div>

        <a
          href={isCall ? tel : zaloLink}
          target="_blank"
          rel="noreferrer"
          className="mt-[22px] flex h-[52px] items-center justify-center gap-2 rounded-btn bg-ink text-[16.5px] font-semibold text-white"
        >
          {isCall ? <Phone size={19} /> : <MessageCircle size={19} />}
          {isCall ? t("callNow") : t("openZalo")}
        </a>
        <button
          type="button"
          onClick={onClose}
          className="mt-2.5 flex h-[52px] w-full items-center justify-center rounded-btn border border-hairline text-[16.5px] font-semibold"
        >
          {t("close")}
        </button>
      </div>
    </div>
  );
}
