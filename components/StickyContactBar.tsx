"use client";

import { Phone, MessageCircle } from "lucide-react";

/**
 * StickyContactBar — thanh liên hệ kính mờ cố định đáy, căn giữa cột .page (max 448px).
 * Trồi lên khi tải (.stickybar animation). Cộng safe-area-inset-bottom (trong CSS).
 */
export function StickyContactBar({
  onCall,
  onZalo,
}: {
  onCall: () => void;
  onZalo: () => void;
}) {
  return (
    <div className="stickybar">
      <button type="button" className="btn btn-primary" onClick={onCall}>
        <Phone size={18} /> Gọi ngay
      </button>
      <button
        type="button"
        className="btn btn-ghost"
        onClick={onZalo}
        style={{ background: "rgba(255,255,255,.55)" }}
      >
        <MessageCircle size={18} /> Nhắn Zalo
      </button>
    </div>
  );
}
