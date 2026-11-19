import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";

/** Section heading used inside cards: icon chip + serif title. */
export function CardHeading({
  icon,
  title,
  chipClass = "bg-peach-soft text-ink",
  titleClass = "text-[23px]",
  children,
}: {
  icon: React.ReactNode;
  title: string;
  chipClass?: string;
  titleClass?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3.5">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${chipClass}`}>
        {icon}
      </span>
      <h2 className={`font-display font-bold leading-tight tracking-tight text-ink ${titleClass}`}>
        {title}
      </h2>
      {children}
    </div>
  );
}

/** "View All →" affordance. */
export function ViewAll({ href, label = "View All" }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex shrink-0 items-center gap-2 text-[15px] font-semibold text-gold-deep transition hover:text-ink"
    >
      {label}
      <ArrowRightIcon className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

/** Small circular arrow button that sits in the corner of tiles. */
export function ArrowChip({ className = "" }: { className?: string }) {
  return (
    <span
      className={`flex h-8 w-8 items-center justify-center rounded-full border-[1.7px] border-ink/85 text-ink transition-transform duration-200 group-hover:translate-x-0.5 ${className}`}
    >
      <ArrowRightIcon className="h-[15px] w-[15px]" strokeWidth={2.1} />
    </span>
  );
}

/** Peach date chip: month over day. */
export function DateChip({
  month,
  day,
  size = "md",
}: {
  month: string;
  day: number | string;
  size?: "sm" | "md";
}) {
  const sm = size === "sm";
  return (
    <span
      className={`flex shrink-0 flex-col items-center justify-center rounded-2xl bg-peach ${
        sm ? "h-[46px] w-[46px]" : "h-[58px] w-[62px]"
      }`}
    >
      <span className={`font-semibold leading-none tracking-wide text-ink/65 ${sm ? "text-[10.5px]" : "text-[12px]"}`}>
        {month}
      </span>
      <span className={`font-display font-bold leading-none text-ink ${sm ? "mt-0.5 text-[17px]" : "mt-1 text-[23px]"}`}>
        {day}
      </span>
    </span>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-2xl border border-dashed border-ink/15 bg-white/50 px-5 py-7 text-center text-[14px] text-ink/50">
      {message}
    </p>
  );
}
