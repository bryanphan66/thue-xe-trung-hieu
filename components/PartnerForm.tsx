"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { submitPartnerInquiry } from "@/lib/actions";

type Status = "idle" | "sending" | "ok" | "error";

const inputClass =
  "w-full min-h-[52px] rounded-[13px] border border-hairline bg-surface px-4 text-ink placeholder:text-muted outline-none focus:border-ink transition-colors";

export default function PartnerForm() {
  const t = useTranslations("partner");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setStatus("sending");
    const res = await submitPartnerInquiry({
      name: String(fd.get("name") || ""),
      phone: String(fd.get("phone") || ""),
      carInfo: String(fd.get("carInfo") || ""),
      note: String(fd.get("note") || ""),
    });
    setStatus(res.ok ? "ok" : "error");
  }

  if (status === "ok") {
    return (
      <div
        data-testid="partner-success"
        className="card"
        style={{ marginTop: 26, padding: "28px 22px", textAlign: "center" }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 999,
            background: "var(--ink)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <Check size={26} />
        </div>
        <p className="body" style={{ fontSize: 16.5, lineHeight: 1.55 }}>
          {t("success")}
        </p>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form
      data-testid="partner-form"
      onSubmit={onSubmit}
      style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 12 }}
    >
      <input
        name="name"
        type="text"
        required
        placeholder={t("formName")}
        autoComplete="name"
        className={inputClass}
      />
      <input
        name="phone"
        type="tel"
        inputMode="tel"
        required
        placeholder={t("formPhone")}
        autoComplete="tel"
        className={inputClass}
      />
      <input
        name="carInfo"
        type="text"
        placeholder={t("formCarInfo")}
        className={inputClass}
      />
      <textarea
        name="note"
        rows={4}
        placeholder={t("formNote")}
        className={inputClass}
        style={{ minHeight: 110, paddingTop: 14, paddingBottom: 14, resize: "none" }}
      />

      {status === "error" && (
        <p style={{ color: "#b4321f", fontSize: 15, lineHeight: 1.5 }}>
          {t("error")}
        </p>
      )}

      <button
        type="submit"
        className="btn btn-primary"
        disabled={sending}
        style={{ marginTop: 6, opacity: sending ? 0.7 : 1 }}
      >
        {sending ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
