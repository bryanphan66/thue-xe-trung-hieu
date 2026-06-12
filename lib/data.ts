import { supabase } from "./supabase";
import { fixtureCars, fixtureTestimonials } from "./fixtures";
import type { Car, Testimonial } from "@/types/db";

/**
 * Lớp truy cập dữ liệu. Ưu tiên Supabase khi đã cấu hình env;
 * nếu chưa → trả fixtures (dev & E2E chạy được ngay, không cần backend).
 * Khi điền env Supabase thật, app tự dùng dữ liệu thật mà không sửa code.
 */

const vnd = (n: number | null) =>
  n == null ? null : Math.round(n).toLocaleString("vi-VN");

type CarRow = {
  slug: string;
  name: string;
  type: string | null;
  seats: number | null;
  price_with_driver: number | null;
  price_self_drive: number | null;
  description: string | null;
  badge: string | null;
  photo_count: number | null;
  model_3d_url: string | null;
  poster_url: string | null;
  // `kind` có thể chưa tồn tại trong DB cũ → optional (dùng car_photos(*) để an toàn ngược).
  car_photos?: { url: string; sort_order: number; kind?: string | null }[];
};

function mapRow(r: CarRow): Car {
  const sorted = (r.car_photos ?? []).slice().sort((a, b) => a.sort_order - b.sort_order);
  const spinFrames = sorted.filter((p) => p.kind === "spin_frame").map((p) => p.url);
  const photos = sorted.filter((p) => p.kind !== "spin_frame").map((p) => p.url);
  return {
    slug: r.slug,
    name: r.name,
    type: r.type ?? "",
    seats: r.seats ?? 0,
    priceDriver: vnd(r.price_with_driver),
    priceSelf: vnd(r.price_self_drive),
    description: r.description ?? "",
    badge: r.badge,
    photoCount: r.photo_count ?? photos.length,
    photoUrls: photos.length ? photos : undefined,
    spinFrames: spinFrames.length ? spinFrames : undefined,
    model3dUrl: r.model_3d_url,
    posterUrl: r.poster_url,
  };
}

export async function getCars(): Promise<Car[]> {
  if (!supabase) return fixtureCars;
  const { data } = await supabase
    .from("cars")
    .select("*, car_photos(*)")
    .eq("available", true)
    .order("featured", { ascending: false });
  if (!data || data.length === 0) return fixtureCars;
  return (data as CarRow[]).map(mapRow);
}

export async function getCar(slug: string): Promise<Car | null> {
  if (!supabase) return fixtureCars.find((c) => c.slug === slug) ?? null;
  const { data } = await supabase
    .from("cars")
    .select("*, car_photos(*)")
    .eq("slug", slug)
    .maybeSingle();
  return data ? mapRow(data as CarRow) : null;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!supabase) return fixtureTestimonials;
  const { data } = await supabase
    .from("testimonials")
    .select("quote:content, name:author_name, place, stars:rating")
    .eq("approved", true)
    .order("created_at", { ascending: false });
  if (!data || data.length === 0) return fixtureTestimonials;
  return data as Testimonial[];
}
