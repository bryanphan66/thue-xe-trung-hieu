import type React from "react";

/**
 * Khai báo type cho web component <model-viewer> để dùng trong JSX/TSX.
 * Đặt file này ở types/ và đảm bảo nó nằm trong "include" của tsconfig.
 */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          poster?: string;
          alt?: string;
          loading?: "auto" | "lazy" | "eager";
          reveal?: "auto" | "interaction" | "manual";
          "camera-controls"?: boolean | "";
          "auto-rotate"?: boolean | "";
          "auto-rotate-delay"?: number | string;
          "rotation-per-second"?: string;
          "interaction-prompt"?: "auto" | "none" | "when-focused";
          "touch-action"?: string;
          "shadow-intensity"?: number | string;
          "shadow-softness"?: number | string;
          exposure?: number | string;
          ar?: boolean | "";
          "ar-modes"?: string;
        },
        HTMLElement
      >;
    }
  }
}

/** model-viewer element instance (cho ref) — chỉ những gì ta dùng. */
export interface ModelViewerElement extends HTMLElement {
  loaded?: boolean;
  modelIsVisible?: boolean;
  activateAR?: () => void;
}

export {};
