"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";
import { GradCapMark, SparkleIcon, XIcon } from "@/components/icons";
import { SidebarFlourish, Swash } from "@/components/Decorations";

export type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

function isActive(pathname: string, href: string) {
  if (href === "/" || href === "/admin") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar({
  items,
  open,
  onClose,
  footer,
}: {
  items: NavItem[];
  open: boolean;
  onClose: () => void;
  footer?: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile scrim */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-ink/50 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[244px] shrink-0 flex-col overflow-hidden bg-sidebar transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarFlourish className="pointer-events-none absolute bottom-0 left-0 w-full" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Close menu"
        >
          <XIcon className="h-5 w-5" />
        </button>

        {/* Wordmark */}
        <div className="relative z-10 px-7 pt-8">
          <div className="flex items-start gap-2">
            <span className="font-display text-[29px] font-bold leading-[1.08] tracking-tight text-white">
              Senior
            </span>
            <GradCapMark className="mt-1 h-[26px] w-[32px] shrink-0 text-gold -rotate-6" />
          </div>
          <span className="font-display block text-[29px] font-bold leading-[1.08] tracking-tight text-white">
            Hub
          </span>
        </div>

        {/* Nav */}
        <nav className="relative z-10 mt-9 flex flex-col gap-1.5 px-4">
          {items.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={`group flex items-center gap-4 rounded-full px-5 py-3 transition-all duration-200 ${
                  active
                    ? "gold-pill text-ink shadow-[0_8px_20px_-10px_rgba(240,150,50,0.9)]"
                    : "text-white/85 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                <Icon className="h-[22px] w-[22px] shrink-0" strokeWidth={active ? 2.1 : 1.9} />
                <span className={`text-[15px] ${active ? "font-semibold" : "font-medium"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {footer}

        {/* Class signature */}
        <div className="relative z-10 mt-auto px-7 pb-[132px]">
          <div className="relative">
            <span className="font-script block text-[30px] leading-none text-gold-light -rotate-3">
              Class of
            </span>
            <span className="font-script -mt-1 block pl-7 text-[52px] leading-none text-gold-light -rotate-3">
              2027
            </span>
            <Swash className="ml-6 mt-0.5 h-5 w-[128px] text-gold-light/85 -rotate-3" />
            <SparkleIcon className="absolute -right-1 top-11 h-3.5 w-3.5 text-gold-light/80" />
            <SparkleIcon className="absolute -left-2 -bottom-1 h-3 w-3 text-gold-light/60" />
          </div>
        </div>
      </aside>
    </>
  );
}
