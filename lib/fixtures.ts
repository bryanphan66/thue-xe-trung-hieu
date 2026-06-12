import type { Car, Testimonial } from "@/types/db";

/** Dữ liệu mẫu (lấy từ design handoff). Dùng khi chưa cấu hình Supabase. */

export const fixtureCars: Car[] = [
  {
    slug: "vios",
    name: "Toyota Vios",
    type: "Sedan · 4 chỗ",
    seats: 4,
    priceDriver: "1.200.000",
    priceSelf: "700.000",
    description:
      "Xe gầm thấp êm ái, tiết kiệm — phù hợp đi khám bệnh, đưa đón trong thành phố và đường gần.",
    badge: "Phổ biến nhất",
    photoCount: 5,
  },
  {
    slug: "innova",
    name: "Toyota Innova",
    type: "MPV · 7 chỗ",
    seats: 7,
    priceDriver: "1.500.000",
    priceSelf: "900.000",
    description:
      "Rộng rãi cho gia đình, khoang hành lý lớn — lựa chọn tốt cho đi du lịch và về quê.",
    badge: null,
    photoCount: 6,
  },
  {
    slug: "cx5",
    name: "Mazda CX-5",
    type: "SUV · 5 chỗ",
    seats: 5,
    priceDriver: "1.600.000",
    priceSelf: "1.000.000",
    description:
      "Gầm cao, ngoại hình sang — hay được chọn làm xe hoa, rước dâu và đi sự kiện.",
    badge: "Xe cưới",
    photoCount: 5,
  },
  {
    slug: "transit",
    name: "Ford Transit",
    type: "Van · 16 chỗ",
    seats: 16,
    priceDriver: "2.200.000",
    priceSelf: null,
    description:
      "Sức chứa lớn cho đoàn đông người — du lịch tập thể, đưa đón sự kiện, đi xa cả nhóm.",
    badge: null,
    photoCount: 4,
  },
];

export const fixtureTestimonials: Testimonial[] = [
  { quote: "Xe sạch sẽ, anh tài xế chạy êm, tới bệnh viện đúng giờ hẹn. Lần sau tôi vẫn gọi.", name: "Cô Bảy", place: "xã Thạnh Mỹ Tây", stars: 5 },
  { quote: "Thuê xe cưới ở đây rất ưng, xe đẹp mà giá phải chăng. Cảm ơn nhà xe.", name: "Anh Hùng", place: "Châu Phú", stars: 5 },
  { quote: "Gọi một cuộc là có xe, đi xa yên tâm. Bác tài vui vẻ, đáng tin.", name: "Chị Lan", place: "TP. Long Xuyên", stars: 5 },
  { quote: "Thuê tự lái về quê dịp Tết, thủ tục nhanh gọn, xe giao tận nhà. Rất hài lòng.", name: "Anh Phát", place: "Tân Châu", stars: 5 },
  { quote: "Cả nhà đi du lịch Vũng Tàu, xe 7 chỗ rộng rãi, bác tài chạy an toàn.", name: "Cô Hạnh", place: "Chợ Mới", stars: 5 },
  { quote: "Giá rõ ràng, không phát sinh lắt nhắt. Mình giới thiệu cho mấy người quen luôn.", name: "Anh Khoa", place: "Thoại Sơn", stars: 5 },
];
