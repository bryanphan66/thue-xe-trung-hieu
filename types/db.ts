/** Kiểu dữ liệu domain. Dữ liệu xe/đánh giá giữ nguyên tiếng Việt (không i18n). */

export type Car = {
  slug: string; // id thân thiện URL: vios / innova / cx5 / transit
  name: string; // "Toyota Vios"
  type: string; // "Sedan · 4 chỗ"
  seats: number;
  priceDriver: string | null; // "1.200.000" (đã format) | null = Liên hệ
  priceSelf: string | null; // "700.000" | null = chưa áp dụng
  description: string;
  badge: string | null; // "Phổ biến nhất" | "Xe cưới" | null
  photoCount: number; // số ảnh placeholder cho gallery (khi chưa có ảnh thật)
  photoUrls?: string[]; // ảnh thật nếu có (ưu tiên hơn photoCount)
  spinFrames?: string[]; // ảnh xoay 360° (car_photos.kind = 'spin_frame'), sắp theo sort_order
  model3dUrl?: string | null; // .glb mô hình 3D (null = dùng model mẫu)
  posterUrl?: string | null; // poster ảnh thật fallback cho 3D
  // Khuyến mãi (cấu hình ở config/promos.ts, gộp theo slug) — giá gạch + nhãn ưu đãi.
  oldPriceDriver?: string | null; // giá gạch có tài xế (đã format)
  oldPriceSelf?: string | null; // giá gạch tự lái
  promo?: string | null; // nhãn ưu đãi, vd "Ưu đãi tháng 6"
};

export type Testimonial = {
  quote: string;
  name: string;
  place: string;
  stars: number;
};

export type PartnerInquiryInput = {
  name: string;
  phone: string;
  carInfo?: string;
  note?: string;
};
