"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { NAVS, type NavVariant } from "@/components/nav";
import { CanvasFlourish } from "@/components/Decorations";
import { SchoolCrestIcon } from "@/components/icons";
import AdminSidebarFooter from "@/components/admin/AdminSidebarFooter";

export default function Shell({
  variant,
  children,
}: {
  variant: NavVariant;
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = NAVS[variant];

  return (
    <div className="min-h-screen">
      <Sidebar
        items={nav}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        footer={variant === "admin" ? <AdminSidebarFooter /> : null}
      />

      <div className="hub-canvas relative min-h-screen overflow-hidden lg:pl-[244px]">
        <CanvasFlourish className="pointer-events-none absolute -top-px right-0 w-[680px] max-w-[72%] select-none" />

        {/* School badge */}
        <div className="absolute right-6 top-6 z-20 hidden items-center gap-2.5 rounded-full bg-white px-5 py-2.5 shadow-[0_6px_20px_-8px_rgba(80,45,15,0.45)] sm:flex lg:right-9 lg:top-7">
          <SchoolCrestIcon className="h-[22px] w-[22px] text-[#c1272d]" />
          <span className="text-[15px] font-semibold tracking-tight text-ink">
            Coppell High School
          </span>
        </div>

        {/* Mobile bar */}
        <div className="relative z-20 flex items-center justify-between px-5 pt-5 lg:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/85 shadow-sm backdrop-blur"
            aria-label="Open menu"
          >
            <span className="flex flex-col gap-[5px]">
              <span className="block h-[2px] w-[18px] rounded-full bg-ink" />
              <span className="block h-[2px] w-[18px] rounded-full bg-ink" />
              <span className="block h-[2px] w-[13px] rounded-full bg-ink" />
            </span>
          </button>
          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm sm:hidden">
            <SchoolCrestIcon className="h-4 w-4 text-[#c1272d]" />
            <span className="text-[13px] font-semibold text-ink">Coppell HS</span>
          </div>
        </div>

        <main className="relative z-10 px-5 pb-14 pt-6 sm:px-8 lg:px-10 lg:pb-16 lg:pt-9">
          {children}
        </main>
      </div>
    </div>
  );
}
