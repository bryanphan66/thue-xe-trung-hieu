"use client";

import { Phone, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { BRAND } from "@/config/brand";
import { useContactActions } from "@/components/ContactProvider";

/** DetailCta — cặp nút "Gọi ngay" / "Nhắn Zalo" mở contact sheet toàn cục. */
export default function DetailCta() {
  const ta = useTranslations("actions");
  const { call, zalo } = useContactActions();

  return (
    <section className="section" style={{ paddingBottom: 130 }}>
      <div
        className="container"
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <button className="btn btn-primary" onClick={call}>
          <Phone size={19} /> {ta("callNow")} · {BRAND.phone}
        </button>
        <button className="btn btn-ghost" onClick={zalo}>
          <MessageCircle size={19} /> {ta("messageZalo")}
        </button>
      </div>
    </section>
  );
}
