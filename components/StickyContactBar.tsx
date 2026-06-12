"use client";

import { Phone, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * StickyContactBar — thanh liên hệ kính mờ cố định đáy (cả 2 màn).
 * Cộng safe-area-inset-bottom. Trồi lên khi tải (animate-barUp).
 *
 * Nhớ chừa padding-bottom cho nội dung trang (~130px) để bar không che.
 */
export function StickyContactBar({
  onCall,
  onZalo,
}: {
  onCall: () => void;
  onZalo: () => void;
}) {
  const t = useTranslations("actions");
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-w-mobile animate-barUp gap-2.5 border-t border-hairline/90 bg-bg/70 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl backdrop-saturate-150">
      <button
        type="button"
        onClick={onCall}
        className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-btn bg-ink text-[16px] font-semibold text-white transition-transform active:scale-[.975]"
      >
        <Phone size={18} /> {t("callNow")}
      </button>
      <button
        type="button"
        onClick={onZalo}
        className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-btn border border-hairline bg-white/55 text-[16px] font-semibold transition-transform active:scale-[.975]"
      >
        <MessageCircle size={18} /> {t("messageZalo")}
      </button>
    </div>
  );
}
