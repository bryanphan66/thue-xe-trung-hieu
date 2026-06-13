"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useContact, type BookingContext } from "@/hooks/useContact";
import type { Service } from "@/config/services";
import type { Car } from "@/types/db";
import { StickyContactBar } from "./StickyContactBar";
import { ContactSheet } from "./ContactSheet";

type ContactActions = {
  call: () => void;
  zalo: () => void;
  service: (s: Service) => void;
  book: (ctx: BookingContext) => void;
};

const ContactContext = createContext<ContactActions | null>(null);

/** Mở sheet liên hệ (4 kiểu) từ bất kỳ component nào trong cây. */
export function useContactActions(): ContactActions {
  const ctx = useContext(ContactContext);
  if (!ctx) throw new Error("useContactActions must be used within ContactProvider");
  return ctx;
}

/**
 * Bọc cả app: giữ state sheet (4 kiểu), render StickyContactBar + ContactSheet,
 * cấp call/zalo/service/quote cho cây con, và reset cuộn .page khi đổi route.
 */
export default function ContactProvider({
  cars,
  children,
}: {
  cars: Car[];
  children: ReactNode;
}) {
  const c = useContact();
  const router = useRouter();
  const pathname = usePathname();

  // Đổi route → cuộn cột .page về đầu (mô hình "đổi màn" của V2).
  useEffect(() => {
    document.querySelector<HTMLElement>(".page")?.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return (
    <ContactContext.Provider value={{ call: c.call, zalo: c.zalo, service: c.service, book: c.book }}>
      {children}
      <StickyContactBar onCall={c.call} onZalo={c.zalo} />
      {c.open && (
        <ContactSheet
          open={c.open}
          cars={cars}
          onClose={c.close}
          onPickCar={(slug) => {
            c.close();
            router.push(`/xe/${slug}`);
          }}
        />
      )}
    </ContactContext.Provider>
  );
}
