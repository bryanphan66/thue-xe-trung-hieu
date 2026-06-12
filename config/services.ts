/**
 * Cấu hình "loại dịch vụ" + gợi ý xe theo dịch vụ (tĩnh — ít đổi, không cần DB).
 * Dùng cho chương 01 (trang chủ) và ContactSheet kiểu "service".
 */
export type Service = { icon: ServiceIcon; label: string; sub: string };
export type ServiceIcon = "stethoscope" | "heart" | "palm" | "navigation";

export const SERVICES: Service[] = [
  { icon: "stethoscope", label: "Đi khám bệnh", sub: "Đưa đón bệnh viện, đúng giờ" },
  { icon: "heart", label: "Đám cưới · Rước dâu", sub: "Xe sạch đẹp, tài xế lịch sự" },
  { icon: "palm", label: "Đi du lịch", sub: "Theo ngày, theo tuyến" },
  { icon: "navigation", label: "Đi xa · Việc gấp", sub: "Sẵn sàng 24/7" },
];

/** Gợi ý xe (theo TÊN) cho từng dịch vụ; lọc theo xe đang có, fallback = mọi xe. */
export const SVC_SUGGEST: Record<ServiceIcon, string[]> = {
  stethoscope: ["Toyota Vios", "Toyota Innova", "Toyota Innova 2.0E"],
  heart: ["Mazda CX-5", "Toyota Innova", "Toyota Innova 2.0E"],
  palm: ["Toyota Innova", "Toyota Innova 2.0E", "Ford Transit"],
  navigation: ["Toyota Innova", "Toyota Innova 2.0E", "Ford Transit"],
};

/** "1.200.000" → 1200000 */
export const parsePrice = (s: string | null) =>
  s ? parseInt(s.replace(/\./g, ""), 10) || 0 : 0;
/** 1200000 → "1.200.000" */
export const formatVnd = (n: number) => n.toLocaleString("vi-VN");
