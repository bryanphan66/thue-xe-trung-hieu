"use server";

import { supabase } from "@/lib/supabase";
import type { PartnerInquiryInput } from "@/types/db";

export type SubmitResult = { ok: boolean };

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
