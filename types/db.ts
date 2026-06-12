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
  model3dUrl?: string | null; // .glb mô hình 3D (null = dùng model mẫu)
  posterUrl?: string | null; // poster ảnh thật fallback cho 3D
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
