import type { Car } from "@/types/db";
import { parsePrice } from "@/config/services";

/**
 * Gom xe theo SỐ CHỖ → "loại xe" để định giá kiểu vùng quê
 * (5 chỗ / 7 chỗ / 16 chỗ…), thay vì theo hãng. Giá đại diện = xe rẻ nhất
 * trong nhóm; `multiple` = true khi nhóm có >1 xe → hiển thị "từ".
 */
export type SeatGroup = {
  seats: number;
  label: string; // "7 chỗ"
  priceDriver: string | null;
  priceSelf: string | null;
  oldPriceDriver: string | null;
  oldPriceSelf: string | null;
  promo: string | null;
  cars: Car[];
  multiple: boolean;
};

export function groupCarsBySeats(cars: Car[]): SeatGroup[] {
  const map = new Map<number, Car[]>();
  for (const c of cars) {
    const s = c.seats || 0;
    if (!map.has(s)) map.set(s, []);
    map.get(s)!.push(c);
  }

  const groups: SeatGroup[] = [];
  for (const [seats, list] of map) {
    // Xe đại diện: giá có tài xế thấp nhất (fallback theo giá tự lái).
    const rep = [...list].sort((a, b) => {
      const pa = parsePrice(a.priceDriver) || parsePrice(a.priceSelf) || Infinity;
      const pb = parsePrice(b.priceDriver) || parsePrice(b.priceSelf) || Infinity;
      return pa - pb;
    })[0];
    groups.push({
      seats,
      label: `${seats} chỗ`,
      priceDriver: rep.priceDriver,
      priceSelf: rep.priceSelf,
      oldPriceDriver: rep.oldPriceDriver ?? null,
      oldPriceSelf: rep.oldPriceSelf ?? null,
      promo: rep.promo ?? null,
      cars: list,
      multiple: list.length > 1,
    });
  }
  groups.sort((a, b) => a.seats - b.seats);
  return groups;
}
