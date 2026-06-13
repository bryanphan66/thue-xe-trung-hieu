"use server";

import { supabase } from "@/lib/supabase";
import type { PartnerInquiryInput, BookingInput } from "@/types/db";

export type SubmitResult = { ok: boolean };

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
 * Demo/fixture mode (chưa cấu hình Supabase) → coi như đã nhận (ok:true).
 */
export async function submitPartnerInquiry(
  input: PartnerInquiryInput,
): Promise<SubmitResult> {
  const name = input.name?.trim();
  const phone = input.phone?.trim();
  if (!name || !phone) return { ok: false };

  // Chưa cấu hình Supabase → demo: coi như đã nhận.
  if (!supabase) return { ok: true };

  const { error } = await supabase.from("partner_inquiries").insert({
    name,
    phone,
    car_info: input.carInfo?.trim() || null,
    note: input.note?.trim() || null,
  });

  return { ok: !error };
}

/**
 * Server Action — đơn "để nhà xe gọi lại" (đặt xe nhanh, chỉ bắt buộc SĐT).
 * Lưu Supabase (best-effort) + báo Telegram (best-effort). Luôn trả ok nếu có SĐT
 * hợp lệ — không để lỗi backend chặn khách.
 */
export async function submitBooking(input: BookingInput): Promise<SubmitResult> {
  const phone = input.phone?.trim();
  if (!phone || phone.replace(/[^\d]/g, "").length < 8) return { ok: false };
  const name = input.name?.trim() || null;

  const modeText = input.mode === "self" ? "Tự lái" : input.mode === "driver" ? "Có tài xế" : null;
  const summaryParts = [
    input.seatsLabel,
    modeText,
    input.days ? `${input.days} ngày` : null,
    input.far ? "đi xa/qua đêm" : null,
    input.total ? `tạm tính ${input.total.toLocaleString("vi-VN")}đ` : null,
  ].filter(Boolean);
  const note = summaryParts.join(" · ") || null;

  // Lưu Supabase (nếu cấu hình + bảng tồn tại) — không chặn nếu lỗi.
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

  // Báo Telegram cho chủ xe.
  const lines = [
    "🚗 <b>Đơn đặt xe mới</b>",
    `📞 SĐT: <b>${phone}</b>${name ? ` · ${name}` : ""}`,
    note ? `📝 ${note}` : "",
  ].filter(Boolean);
  await notifyTelegram(lines.join("\n"));

  return { ok: true };
}
