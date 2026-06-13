"use server";

import { headers } from "next/headers";
import { supabase } from "@/lib/supabase";
import { normalizeVNPhone } from "@/lib/phone";
import { rateLimited } from "@/lib/rateLimit";
import type { PartnerInquiryInput, BookingInput } from "@/types/db";

export type SubmitResult = { ok: boolean };

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Lấy IP client (qua Cloudflare/Traefik). */
async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("cf-connecting-ip") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

/** Tên: cắt 60 ký tự, bỏ nếu chứa link/email (spam thường nhét link vào tên). */
function cleanName(raw?: string | null): string | null {
  if (!raw) return null;
  const n = raw.trim().slice(0, 60);
  if (!n) return null;
  if (/(https?:\/\/|www\.|t\.me\/|\.com|\.vn\b|@)/i.test(n)) return null;
  return n;
}

/** Gửi thông báo Telegram (best-effort). Cần env TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID. */
async function notifyTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
  } catch {
    // im lặng — không để lỗi Telegram chặn phản hồi cho khách
  }
}

/**
 * Server Action — nhận yêu cầu hợp tác cho thuê xe.
 * Chống spam: honeypot + SĐT VN hợp lệ + rate limit.
 */
export async function submitPartnerInquiry(
  input: PartnerInquiryInput,
): Promise<SubmitResult> {
  if (input.hp && input.hp.trim()) return { ok: true }; // bot → giả như đã nhận
  const name = cleanName(input.name);
  const phone = normalizeVNPhone(input.phone);
  if (!name || !phone) return { ok: false };

  const ip = await clientIp();
  if (rateLimited(`pa:ip:${ip}`, { max: 4 }) || rateLimited(`pa:ph:${phone}`, { max: 2, minGapMs: 30_000 }))
    return { ok: true }; // âm thầm bỏ qua, không để lộ

  if (!supabase) return { ok: true };
  const { error } = await supabase.from("partner_inquiries").insert({
    name,
    phone,
    car_info: input.carInfo?.trim().slice(0, 200) || null,
    note: input.note?.trim().slice(0, 500) || null,
  });
  return { ok: !error };
}

/**
 * Server Action — đơn "để nhà xe gọi lại" (đặt xe nhanh).
 * Chống spam nhiều lớp: honeypot → SĐT VN hợp lệ → rate limit (IP + SĐT) → escape Telegram.
 */
export async function submitBooking(input: BookingInput): Promise<SubmitResult> {
  // 1) Honeypot: bot điền field ẩn → giả thành công, không lưu/không báo.
  if (input.hp && input.hp.trim()) return { ok: true };

  // 2) SĐT di động VN hợp lệ (chặn 12345678, số rác…).
  const phone = normalizeVNPhone(input.phone);
  if (!phone) return { ok: false };

  // 3) Rate limit: theo IP + theo SĐT. Vượt ngưỡng → âm thầm bỏ (không flood Telegram).
  const ip = await clientIp();
  if (rateLimited(`bk:ip:${ip}`, { max: 4 }) || rateLimited(`bk:ph:${phone}`, { max: 2, minGapMs: 30_000 }))
    return { ok: true };

  const name = cleanName(input.name);
  const modeText = input.mode === "self" ? "Tự lái" : input.mode === "driver" ? "Có tài xế" : null;
  const note =
    [
      input.purpose,
      input.seatsLabel,
      modeText,
      input.days ? `${input.days} ngày` : null,
      input.far ? "đi xa/qua đêm" : null,
      input.total ? `tạm tính ${input.total.toLocaleString("vi-VN")}đ` : null,
    ]
      .filter(Boolean)
      .join(" · ")
      .slice(0, 300) || null;

  // Lưu Supabase (best-effort).
  if (supabase) {
    try {
      await supabase.from("bookings").insert({
        phone,
        name,
        seats: input.seats ?? null,
        mode: input.mode ?? null,
        days: input.days ?? null,
        far: input.far ?? null,
        total: input.total ?? null,
        note,
        source: input.source ?? null,
      });
    } catch {
      // bảng chưa tạo / lỗi mạng → bỏ qua, vẫn báo Telegram + trả ok
    }
  }

  // 4) Báo Telegram — escape HTML để không bị chèn thẻ.
  const lines = [
    "🚗 <b>Đơn đặt xe mới</b>",
    `📞 SĐT: <b>${esc(phone)}</b>${name ? ` · ${esc(name)}` : ""}`,
    note ? `📝 ${esc(note)}` : "",
  ].filter(Boolean);
  await notifyTelegram(lines.join("\n"));

  return { ok: true };
}
