import { Stethoscope, Heart, Palmtree, Navigation, type LucideIcon } from "lucide-react";

/**
 * "Loại dịch vụ" cứng trong code (ít thay đổi).
 * `key` map tới messages.services.<key>.{label,sub}; `Icon` là icon Lucide line.
 */
export type ServiceType = { key: string; Icon: LucideIcon };

export const SERVICE_TYPES: ServiceType[] = [
  { key: "hospital", Icon: Stethoscope },
  { key: "wedding", Icon: Heart },
  { key: "travel", Icon: Palmtree },
  { key: "urgent", Icon: Navigation },
];
