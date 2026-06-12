/**
 * Mọi thông tin thương hiệu/liên hệ ở MỘT chỗ — đổi tại đây, không hardcode rải rác.
 */
export const BRAND = {
  name: "Thuê Xe Trung Hiếu",
  tagline: "Dịch vụ cho thuê xe",
  owner: "Anh Hiếu",

  // Liên hệ
  phone: "0326 120 108",        // hiển thị
  phoneRaw: "0326120108",       // dùng cho tel:
  zalo: "0326120108",           // https://zalo.me/<zalo>
  facebook: "fb.com/thuexetrunghieu",
  address: "Khu dân cư kênh 10, ấp Bờ Dâu, xã Thạnh Mỹ Tây, Tỉnh An Giang",

  // Bản đồ
  mapLink: "https://maps.app.goo.gl/ptcb9NfjbUnhGPRb7", // nút "Chỉ đường" mở Google Maps app
  lat: 10.534045,
  lng: 105.16464,
} as const;

export const tel = `tel:${BRAND.phoneRaw}`;
export const zaloLink = `https://zalo.me/${BRAND.zalo}`;
