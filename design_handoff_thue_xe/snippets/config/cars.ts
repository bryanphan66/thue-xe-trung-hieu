/**
 * Dữ liệu xe + dịch vụ — tách khỏi UI để sau này dễ thay bằng CMS.
 * Giá là chuỗi đã định dạng (vd "1.200.000") cho dễ hiển thị; QuickQuote tự parse số.
 * Xe có khuyến mãi: thêm oldDriver/oldSelf (giá gạch) + promo (nhãn).
 */
export type Car = {
  id: string;
  name: string;
  type: string;        // "Sedan · 4 chỗ"
  seats: number;
  driver: string;      // giá có tài xế / ngày
  self: string | null; // giá tự lái / ngày (null = không cho tự lái)
  oldDriver?: string;  // giá gạch (khuyến mãi)
  oldSelf?: string;
  promo?: string;      // nhãn ưu đãi, vd "Ưu đãi tháng 6"
  desc: string;
  accent: string | null; // badge trên ảnh: "Phổ biến nhất" / "Xe cưới"
  photos: number;      // số ảnh thật trong gallery
};

export const CARS: Car[] = [
  { id: "vios",    name: "Toyota Vios",   type: "Sedan · 4 chỗ", seats: 4,  driver: "1.200.000", self: "700.000",  oldDriver: "1.400.000", oldSelf: "850.000", promo: "Ưu đãi tháng 6", accent: "Phổ biến nhất", photos: 5, desc: "Xe gầm thấp êm ái, tiết kiệm — phù hợp đi khám bệnh, đưa đón trong thành phố và đường gần." },
  { id: "innova",  name: "Toyota Innova", type: "MPV · 7 chỗ",   seats: 7,  driver: "1.500.000", self: "900.000",  oldDriver: "1.700.000", promo: "Ưu đãi tháng 6", accent: null, photos: 6, desc: "Rộng rãi cho gia đình, khoang hành lý lớn — lựa chọn tốt cho đi du lịch và về quê." },
  { id: "cx5",     name: "Mazda CX-5",    type: "SUV · 5 chỗ",   seats: 5,  driver: "1.600.000", self: "1.000.000", accent: "Xe cưới", photos: 5, desc: "Gầm cao, ngoại hình sang — hay được chọn làm xe hoa, rước dâu và đi sự kiện." },
  { id: "transit", name: "Ford Transit",  type: "Van · 16 chỗ",  seats: 16, driver: "2.200.000", self: null, accent: null, photos: 4, desc: "Sức chứa lớn cho đoàn đông người — du lịch tập thể, đưa đón sự kiện, đi xa cả nhóm." },
];

export type Service = { icon: string; label: string; sub: string };
export const SERVICES: Service[] = [
  { icon: "stethoscope", label: "Đi khám bệnh",        sub: "Đưa đón bệnh viện, đúng giờ" },
  { icon: "heart",       label: "Đám cưới · Rước dâu", sub: "Xe sạch đẹp, tài xế lịch sự" },
  { icon: "palm",        label: "Đi du lịch",          sub: "Theo ngày, theo tuyến" },
  { icon: "navigation",  label: "Đi xa · Việc gấp",    sub: "Sẵn sàng 24/7" },
];

/** Khi bấm 1 dịch vụ → gợi ý xe phù hợp trong sheet (theo icon dịch vụ). */
export const SVC_SUGGEST: Record<string, string[]> = {
  stethoscope: ["Toyota Vios", "Toyota Innova"],
  heart:       ["Mazda CX-5", "Toyota Innova"],
  palm:        ["Toyota Innova", "Ford Transit"],
  navigation:  ["Toyota Innova", "Ford Transit"],
};

export type Testimonial = { quote: string; name: string; place: string; stars: number };
export const TESTIMONIALS: Testimonial[] = [
  { quote: "Xe sạch sẽ, anh tài xế chạy êm, tới bệnh viện đúng giờ hẹn. Lần sau tôi vẫn gọi.", name: "Cô Bảy", place: "xã Mỹ Hoà", stars: 5 },
  { quote: "Thuê xe cưới ở đây rất ưng, xe đẹp mà giá phải chăng. Cảm ơn nhà xe.",            name: "Anh Hùng", place: "Bình Minh", stars: 5 },
  { quote: "Gọi một cuộc là có xe, đi xa yên tâm. Bác tài vui vẻ, đáng tin.",                  name: "Chị Lan", place: "Vĩnh Long", stars: 5 },
];

/** "1.200.000" → 1200000 */
export const parsePrice = (s: string | null) => (s ? parseInt(s.replace(/\./g, ""), 10) || 0 : 0);
/** 1200000 → "1.200.000" */
export const formatVnd = (n: number) => n.toLocaleString("vi-VN");
