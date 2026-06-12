import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/Hero";
import ServiceTypes from "@/components/ServiceTypes";
import CarList from "@/components/CarList";
import DriveOptions from "@/components/DriveOptions";
import Testimonials from "@/components/Testimonials";
import PartnerSection from "@/components/PartnerSection";
import LocationSection from "@/components/LocationSection";
import Footer from "@/components/Footer";

// ISR: render lại sau mỗi 60s → sửa dữ liệu trong Supabase tự hiện, không cần deploy lại.
export const revalidate = 60;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="screen">
      <Hero />
      <ServiceTypes />
      <CarList />
      <DriveOptions />
      <Testimonials />
      <PartnerSection />
      <LocationSection />
      <Footer />
    </main>
  );
}
