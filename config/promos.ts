/**
 * Khuyến mãi theo xe (theo slug) — giá GẠCH (giá cũ) + nhãn ưu đãi.
 * Để ở config cho dễ đổi nhanh (giống design handoff). Giá hiển thị "hiện tại"
 * vẫn lấy từ Supabase (cars.price_*); ở đây chỉ là giá cũ để gạch + nhãn.
 * Số đã định dạng "1.700.000" cho khớp với giá từ data layer.
 */
export type Promo = { oldDriver?: string; oldSelf?: string; label?: string };

export const PROMOS: Record<string, Promo> = {
  innova: { oldDriver: "1.700.000", oldSelf: "1.000.000", label: "Ưu đãi tháng 6" },
  "kia-k5": { oldDriver: "2.000.000", oldSelf: "1.350.000", label: "Ưu đãi tháng 6" },
};
