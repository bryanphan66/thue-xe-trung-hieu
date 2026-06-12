"use client";

import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/** BackBar — thanh trên cùng dính, nền tối mờ, nút quay về trang chủ + tên xe. */
export default function BackBar({ name }: { name: string }) {
  const ta = useTranslations("actions");

  return (
    <div
      className="bg-[rgba(11,11,12,.6)] backdrop-blur"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <Link
        href="/"
        aria-label={ta("back")}
        style={{
          width: 40,
          height: 40,
          borderRadius: 11,
          border: "1px solid var(--stage-hairline)",
          background: "rgba(255,255,255,.06)",
          color: "var(--stage-ink)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <ChevronLeft size={20} />
      </Link>
      <span style={{ color: "var(--stage-ink)", fontSize: 15.5, fontWeight: 600 }}>{name}</span>
    </div>
  );
}
