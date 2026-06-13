/**
 * Chuẩn hoá + kiểm tra số điện thoại di động Việt Nam.
 * Chấp nhận: 0xxxxxxxxx / +84xxxxxxxxx / 84xxxxxxxxx (có thể có khoảng trắng, ., -).
 * Hợp lệ = 10 số, bắt đầu 0 + đầu số di động [3,5,7,8,9] + 8 số.
 * Trả về dạng chuẩn "0xxxxxxxxx" hoặc null nếu không hợp lệ.
 */
export function normalizeVNPhone(raw?: string | null): string | null {
  if (!raw) return null;
  let s = raw.replace(/[^\d+]/g, "");
  s = s.replace(/^\+?84/, "0"); // +84 / 84 → 0
  if (!/^0[35789]\d{8}$/.test(s)) return null; // sai định dạng di động VN
  if (/^0(\d)\1{8}$/.test(s)) return null; // toàn 1 chữ số (0000000000…)
  return s;
}
