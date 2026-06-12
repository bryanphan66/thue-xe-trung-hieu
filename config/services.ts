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

/** Gợi ý LOẠI XE (theo số chỗ) cho từng mục đích; lọc theo loại đang có, fallback = mọi loại. */
export const SVC_SUGGEST: Record<ServiceIcon, number[]> = {
  stethoscope: [5, 7], // khám bệnh: xe nhỏ gọn
  heart: [5, 7], // cưới: sedan đẹp / 7 chỗ gia đình
  palm: [7, 16], // du lịch: đông người
  navigation: [7, 16], // đi xa: rộng rãi
};

/** "1.200.000" → 1200000 */
export const parsePrice = (s: string | null) =>
  s ? parseInt(s.replace(/\./g, ""), 10) || 0 : 0;
/** 1200000 → "1.200.000" */
export const formatVnd = (n: number) => n.toLocaleString("vi-VN");
