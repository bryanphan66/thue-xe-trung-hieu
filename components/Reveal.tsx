"use client";

import React from "react";
import { useReveal } from "@/hooks/useReveal";

/**
 * Reveal — wrapper dùng useReveal. Cần class `.reveal` / `.reveal.in` trong globals
 * (xem app/globals.snippet.css).
 *
 *   <Reveal variant="up-lg" delay={95}>...</Reveal>
 *   <Reveal as="span" variant="mask">dòng tiêu đề</Reveal>
 */
type Variant = "up" | "up-lg" | "left" | "right" | "scale" | "mask";

const HIDDEN: Record<Variant, string> = {
  up: "translateY(16px)",
  "up-lg": "translateY(34px)",
  left: "translateX(-26px)",
  right: "translateX(26px)",
  scale: "translateY(14px) scale(.95)",
  mask: "translateY(110%)", // dùng kèm bọc overflow-hidden
};

type RevealProps = {
  children: React.ReactNode;
  variant?: Variant;
  delay?: number;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
};

export function Reveal({
  children,
  variant = "up",
  delay = 0,
  as: Tag = "div",
  className = "",
  style,
}: RevealProps) {
  const { ref, shown } = useReveal<HTMLElement>();
  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? "in" : ""} ${className}`}
      style={
        {
          transitionDelay: `${delay}ms`,
          "--rv-hidden": HIDDEN[variant],
          ...style,
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
