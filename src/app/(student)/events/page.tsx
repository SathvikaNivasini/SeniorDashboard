"use client";

import PageHeader from "@/components/PageHeader";
import NotifyButton from "@/components/NotifyButton";
import Calendar from "@/components/Calendar";
import { DateChip, EmptyState } from "@/components/ui";
import { PinIcon } from "@/components/icons";
import { useHubData } from "@/lib/data-provider";
import { monthShort, dayOfMonth, longDate, startOfToday, parseDateOnly } from "@/lib/format";
import type { HubEvent } from "@/lib/types";

function EventRow({ event, muted }: { event: HubEvent; muted?: boolean }) {
  return (
    <div className={`flex items-center gap-4 rounded-2xl px-2 py-3 transition hover:bg-peach-soft/60 ${muted ? "opacity-55" : ""}`}>
      <DateChip month={monthShort(event.event_date)} day={dayOfMonth(event.event_date)} />
      <div className="min-w-0">
        <p className="text-[16.5px] font-semibold leading-snug text-ink">
          {event.title}
          {event.subtitle && (
            <span className="font-normal text-ink/55"> ({event.subtitle})</span>
          )}
        </p>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink/55">
          <span>{longDate(event.event_date)}</span>
          {event.location && (
            <span className="flex items-center gap-1">
              <PinIcon className="h-[13px] w-[13px]" />
              {event.location}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const { events, deadlines, upcomingEvents, loading } = useHubData();
  const today = startOfToday();
  const past = events
    .filter((e) => parseDateOnly(e.event_date) < today)
    .sort((a, b) => b.event_date.localeCompare(a.event_date));

  return (
    <div className="animate-in-up">
      <PageHeader
        title="Senior Events"
        subtitle="Dress-up days, info sessions, and everything in between."
      />

      <div className="mb-5 flex justify-start lg:justify-end">
        <NotifyButton />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_396px]">
        <Calendar events={events} deadlines={deadlines} />

        <div className="flex flex-col gap-5">
          <section className="hub-card p-5 sm:p-6">
            <h2 className="font-display text-[22px] font-bold tracking-tight text-ink">
              Coming Up
            </h2>
            <div className="mt-3 flex flex-col">
              {loading && <EmptyState message="Loading events…" />}
              {!loading && upcomingEvents.length === 0 && (
                <EmptyState message="Nothing scheduled right now." />
              )}
              {upcomingEvents.map((e) => (
                <EventRow key={e.id} event={e} />
              ))}
            </div>
          </section>

          {past.length > 0 && (
            <section className="hub-card p-5 sm:p-6">
              <h2 className="font-display text-[22px] font-bold tracking-tight text-ink">
                Already Happened
              </h2>
              <div className="mt-3 flex flex-col">
                {past.map((e) => (
                  <EventRow key={e.id} event={e} muted />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
