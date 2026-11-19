import { CrownIcon, SparkleIcon } from "@/components/icons";

export default function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-7 flex flex-wrap items-end justify-between gap-4 pr-0 lg:pr-[260px]">
      <div className="min-w-0">
        <div className="flex items-center gap-4">
          <h1 className="font-display text-[34px] font-bold leading-[1.05] tracking-[-0.02em] text-ink min-[400px]:text-[38px] sm:text-[50px] lg:text-[56px]">
            {title}
          </h1>
          <CrownIcon className="mb-2.5 hidden h-10 w-12 shrink-0 text-gold sm:block" />
        </div>
        <p className="font-display mt-1.5 flex items-center gap-2 text-[16px] italic text-ink/70 sm:text-[17px]">
          {subtitle}
          <SparkleIcon className="h-4 w-4 shrink-0 text-gold" />
        </p>
      </div>
      {action}
    </header>
  );
}
