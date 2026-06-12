// ===== Brand + content data =====
const BRAND = {
  name: "Thuê Xe Trung Hiếu",
  mark: "TRUNG HIẾU",
  tagline: "Dịch vụ cho thuê xe",
  phone: "0326 120 108",
  phoneRaw: "0326120108",
  zalo: "0326120108",
  facebook: "fb.com/thuexetrunghieu",
  address: "Khu dân cư kênh 10, ấp Bờ Dâu, xã Thạnh Mỹ Tây, Tỉnh An Giang",
  owner: "Anh Hiếu",
  mapLink: "https://maps.app.goo.gl/ptcb9NfjbUnhGPRb7",
  lat: 10.534045,
  lng: 105.16464,
  // OpenStreetMap embed: keyless, never blocked by X-Frame-Options (unlike Google's output=embed)
  mapEmbed: "https://www.openstreetmap.org/export/embed.html?bbox=" +
    [105.16464 - 0.012, 10.534045 - 0.008, 105.16464 + 0.012, 10.534045 + 0.008].join("%2C") +
    "&layer=mapnik&marker=" + [10.534045, 105.16464].join("%2C"),
};

const SERVICES = [
  { icon: "stethoscope", label: "Đi khám bệnh", sub: "Đưa đón bệnh viện, đúng giờ" },
  { icon: "heart",       label: "Đám cưới · Rước dâu", sub: "Xe sạch đẹp, tài xế lịch sự" },
  { icon: "palm",        label: "Đi du lịch", sub: "Theo ngày, theo tuyến" },
  { icon: "navigation",  label: "Đi xa · Việc gấp", sub: "Sẵn sàng 24/7" },
];

const CARS = [
  {
    id: "vios",
    name: "Toyota Vios",
    type: "Sedan · 4 chỗ",
    seats: 4,
    driver: "1.200.000",
    self: "700.000",
    oldDriver: "1.400.000",
    oldSelf: "850.000",
    promo: "Ưu đãi tháng 6",
    desc: "Xe gầm thấp êm ái, tiết kiệm — phù hợp đi khám bệnh, đưa đón trong thành phố và đường gần.",
    accent: "Phổ biến nhất",
    photos: 5,
  },
  {
    id: "innova",
    name: "Toyota Innova",
    type: "MPV · 7 chỗ",
    seats: 7,
    driver: "1.500.000",
    self: "900.000",
    oldDriver: "1.700.000",
    promo: "Ưu đãi tháng 6",
    desc: "Rộng rãi cho gia đình, khoang hành lý lớn — lựa chọn tốt cho đi du lịch và về quê.",
    accent: null,
    photos: 6,
  },
  {
    id: "cx5",
    name: "Mazda CX-5",
    type: "SUV · 5 chỗ",
    seats: 5,
    driver: "1.600.000",
    self: "1.000.000",
    desc: "Gầm cao, ngoại hình sang — hay được chọn làm xe hoa, rước dâu và đi sự kiện.",
    accent: "Xe cưới",
    photos: 5,
  },
  {
    id: "transit",
    name: "Ford Transit",
    type: "Van · 16 chỗ",
    seats: 16,
    driver: "2.200.000",
    self: null,
    desc: "Sức chứa lớn cho đoàn đông người — du lịch tập thể, đưa đón sự kiện, đi xa cả nhóm.",
    accent: null,
    photos: 4,
  },
];

const TESTIMONIALS = [
  { quote: "Xe sạch sẽ, anh tài xế chạy êm, tới bệnh viện đúng giờ hẹn. Lần sau tôi vẫn gọi.", name: "Cô Bảy", place: "xã Thạnh Mỹ Tây", stars: 5 },
  { quote: "Thuê xe cưới ở đây rất ưng, xe đẹp mà giá phải chăng. Cảm ơn nhà xe.", name: "Anh Hùng", place: "Châu Phú", stars: 5 },
  { quote: "Gọi một cuộc là có xe, đi xa yên tâm. Bác tài vui vẻ, đáng tin.", name: "Chị Lan", place: "TP. Long Xuyên", stars: 5 },
  { quote: "Thuê tự lái về quê dịp Tết, thủ tục nhanh gọn, xe giao tận nhà. Rất hài lòng.", name: "Anh Phát", place: "Tân Châu", stars: 5 },
  { quote: "Cả nhà đi du lịch Vũng Tàu, xe 7 chỗ rộng rãi, bác tài chạy an toàn.", name: "Cô Hạnh", place: "Chợ Mới", stars: 5 },
  { quote: "Giá rõ ràng, không phát sinh lắt nhắt. Mình giới thiệu cho mấy người quen luôn.", name: "Anh Khoa", place: "Thoại Sơn", stars: 5 },
];

Object.assign(window, { BRAND, SERVICES, CARS, TESTIMONIALS });
