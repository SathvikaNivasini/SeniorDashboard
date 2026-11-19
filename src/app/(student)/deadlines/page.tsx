"use client";

import PageHeader from "@/components/PageHeader";
import NotifyButton from "@/components/NotifyButton";
import { DateChip, EmptyState } from "@/components/ui";
import { PinIcon, ClockIcon } from "@/components/icons";
import { useHubData } from "@/lib/data-provider";
import {
  monthShort, dayOfMonth, longDate, startOfToday, parseDateOnly,
} from "@/lib/format";
import type { Deadline } from "@/lib/types";

function daysAway(due: string) {
  const diff = Math.round(
    (parseDateOnly(due).getTime() - startOfToday().getTime()) / 86400000,
  );
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return `In ${diff} days`;
}

function DeadlineRow({ d, past }: { d: Deadline; past?: boolean }) {
  return (
    <div className={`flex items-center gap-4 rounded-2xl px-2 py-3.5 transition hover:bg-peach-soft/60 ${past ? "opacity-55" : ""}`}>
      <DateChip month={monthShort(d.due_date)} day={dayOfMonth(d.due_date)} />
      <div className="min-w-0 flex-1">
        <p className="text-[16.5px] font-semibold leading-snug text-ink">{d.title}</p>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink/55">
          <span>{longDate(d.due_date)}</span>
          {d.detail && (
            <span className="flex items-center gap-1">
              <PinIcon className="h-[13px] w-[13px]" />
              {d.detail}
            </span>
          )}
        </p>
      </div>
      {!past && (
        <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-peach-soft px-3 py-1.5 text-[12.5px] font-semibold text-ink/70 sm:flex">
          <ClockIcon className="h-[14px] w-[14px]" />
          {daysAway(d.due_date)}
        </span>
      )}
    </div>
  );
}

export default function DeadlinesPage() {
  const { deadlines, upcomingDeadlines, loading } = useHubData();
  const today = startOfToday();
  const past = deadlines
    .filter((d) => parseDateOnly(d.due_date) < today)
    .sort((a, b) => b.due_date.localeCompare(a.due_date));

  return (
    <div className="animate-in-up">
      <PageHeader
        title="Key Dates"
        subtitle="Don't let anything sneak up on you this year."
      />

      <div className="mb-5 flex justify-start lg:justify-end">
        <NotifyButton />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="hub-card p-5 sm:p-6">
          <h2 className="font-display text-[22px] font-bold tracking-tight text-ink">
            Important Deadlines
          </h2>
          <div className="mt-3 flex flex-col">
            {loading && <EmptyState message="Loading deadlines…" />}
            {!loading && upcomingDeadlines.length === 0 && (
              <EmptyState message="Nothing due right now. Enjoy the breather!" />
            )}
            {upcomingDeadlines.map((d) => (
              <DeadlineRow key={d.id} d={d} />
            ))}
          </div>
        </section>

        {past.length > 0 && (
          <section className="hub-card p-5 sm:p-6">
            <h2 className="font-display text-[22px] font-bold tracking-tight text-ink">
              Passed
            </h2>
            <div className="mt-3 flex flex-col">
              {past.map((d) => (
                <DeadlineRow key={d.id} d={d} past />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
