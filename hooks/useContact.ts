"use client";

import { useState } from "react";

export type ContactKind = "call" | "zalo" | null;

/**
 * useContact — quản lý trạng thái mở sheet liên hệ.
 *   const c = useContact();
 *   <StickyContactBar onCall={c.call} onZalo={c.zalo} />
 *   <ContactSheet open={c.open} onClose={c.close} />
 */
export function useContact() {
  const [open, setOpen] = useState<ContactKind>(null);
  return {
    open,
    call: () => setOpen("call"),
    zalo: () => setOpen("zalo"),
    close: () => setOpen(null),
  };
}
