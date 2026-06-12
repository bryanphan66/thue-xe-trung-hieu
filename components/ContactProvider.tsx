"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useContact } from "@/hooks/useContact";
import { StickyContactBar } from "./StickyContactBar";
import { ContactSheet } from "./ContactSheet";

type ContactActions = { call: () => void; zalo: () => void };

const ContactContext = createContext<ContactActions | null>(null);

/** Mở bottom sheet liên hệ từ bất kỳ component nào (hero, card, footer...). */
export function useContactActions(): ContactActions {
  const ctx = useContext(ContactContext);
  if (!ctx) throw new Error("useContactActions must be used within ContactProvider");
  return ctx;
}

/**
 * Bọc cả app: giữ state sheet, render StickyContactBar + ContactSheet,
 * và cấp call/zalo cho cây con qua context.
 */
export default function ContactProvider({ children }: { children: ReactNode }) {
  const c = useContact();
  return (
    <ContactContext.Provider value={{ call: c.call, zalo: c.zalo }}>
      {children}
      <StickyContactBar onCall={c.call} onZalo={c.zalo} />
      <ContactSheet open={c.open} onClose={c.close} />
    </ContactContext.Provider>
  );
}
