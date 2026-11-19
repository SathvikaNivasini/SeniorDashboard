"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { XIcon } from "@/components/icons";

/**
 * Dialog rendered into document.body.
 *
 * The portal matters: any ancestor with a transform (including a finished CSS
 * animation that left one behind) becomes the containing block for
 * `position: fixed`, which silently breaks a full-screen overlay. Rendering at
 * the body level keeps the overlay pinned to the viewport no matter what the
 * page wrapper is doing.
 */
export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  maxWidth = "560px",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock background scroll without the layout shifting as the scrollbar goes.
  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, [open]);

  // Move focus into the dialog so keyboard and screen-reader users land there.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const target = panel.querySelector<HTMLElement>(
        "input:not([type=hidden]), textarea, select, button",
      );
      target?.focus();
    }, 60);
    return () => clearTimeout(t);
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto overscroll-contain bg-ink/50 p-0 backdrop-blur-sm sm:items-start sm:p-6 sm:py-10"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ maxWidth }}
        className="relative my-0 w-full rounded-t-[28px] bg-card shadow-[0_24px_60px_-20px_rgba(60,30,10,0.45)] sm:my-auto sm:rounded-[28px]"
      >
        {/* Grab handle, phone only */}
        <div className="flex justify-center pt-3 sm:hidden">
          <span className="h-1.5 w-11 rounded-full bg-ink/15" />
        </div>

        <div className="flex items-start justify-between gap-4 px-5 pb-1 pt-4 sm:px-7 sm:pt-7">
          <h3 className="font-display text-[21px] font-bold leading-tight tracking-tight text-ink sm:text-[24px]">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink/50 transition hover:bg-peach-soft hover:text-ink"
          >
            <XIcon className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-5 pb-5 pt-3 sm:max-h-none sm:px-7">
          {children}
        </div>

        {footer && (
          <div className="sticky bottom-0 rounded-b-[28px] border-t border-ink/[0.07] bg-card px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-7 sm:pb-7">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
