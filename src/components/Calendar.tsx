"use client";

import { useMemo, useState } from "react";
import {
  CalendarIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon, XIcon, PinIcon,
} from "@/components/icons";
import { SunburstRays } from "@/components/Decorations";
import { CardHeading } from "@/components/ui";
import { monthLong, parseDateOnly, isSameDay } from "@/lib/format";
import type { Deadline, HubEvent } from "@/lib/types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS_LONG = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

type DayItem =
  | { kind: "event"; id: string; title: string; note: string | null; place: string | null }
  | { kind: "deadline"; id: string; title: string; note: string | null; place: null };

function isoFor(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function Calendar({
  events,
  deadlines,
  onSchedule,
  title = "Senior Information Calendar",
}: {
  events: HubEvent[];
  deadlines: Deadline[];
  /** When provided, the day panel offers a "schedule here" action (admin). */
  onSchedule?: (isoDate: string) => void;
  title?: string;
}) {
  const today = new Date();
  const [cursor, setCursor] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selected, setSelected] = useState<string | null>(null);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const byDate = useMemo(() => {
    const map = new Map<string, DayItem[]>();
    const push = (date: string, item: DayItem) => {
      const key = date.slice(0, 10);
      map.set(key, [...(map.get(key) ?? []), item]);
    };
    events.forEach((e) =>
      push(e.event_date, {
        kind: "event", id: e.id, title: e.title, note: e.subtitle, place: e.location,
      }),
    );
    deadlines.forEach((d) =>
      push(d.due_date, {
        kind: "deadline", id: d.id, title: d.title, note: d.detail, place: null,
      }),
    );
    return map;
  }, [events, deadlines]);

  const cells = useMemo(() => {
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const out: (number | null)[] = Array(firstWeekday).fill(null);
    for (let d = 1; d <= daysInMonth; d += 1) out.push(d);
    while (out.length % 7 !== 0) out.push(null);
    return out;
  }, [year, month]);

  function shift(delta: number) {
    setCursor(new Date(year, month + delta, 1));
    setSelected(null);
  }

  function goToday() {
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelected(isoFor(today.getFullYear(), today.getMonth(), today.getDate()));
  }

  const selectedItems = selected ? byDate.get(selected) ?? [] : [];
  const selectedDate = selected ? parseDateOnly(selected) : null;
  const viewingThisMonth =
    year === today.getFullYear() && month === today.getMonth();

  return (
    <section className="hub-card flex flex-col p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-3">
        <CardHeading
          icon={<CalendarIcon className="h-[21px] w-[21px]" />}
          title={title}
          titleClass="text-[17px] sm:text-[21px]"
        />
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            type="button"
            onClick={() => shift(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink/70 transition hover:bg-peach-soft hover:text-ink"
            aria-label="Previous month"
          >
            <ChevronLeftIcon className="h-[19px] w-[19px]" strokeWidth={2.2} />
          </button>
          <span className="min-w-[96px] text-center text-[16px] font-semibold tracking-tight text-ink sm:min-w-[104px] sm:text-[17px]">
            {monthLong(month).slice(0, 3)} {year}
          </span>
          <button
            type="button"
            onClick={() => shift(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink/70 transition hover:bg-peach-soft hover:text-ink"
            aria-label="Next month"
          >
            <ChevronRightIcon className="h-[19px] w-[19px]" strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {!viewingThisMonth && (
        <button
          type="button"
          onClick={goToday}
          className="mt-3 w-fit rounded-full bg-peach-soft px-3.5 py-1.5 text-[12.5px] font-semibold text-ink/70 transition hover:bg-peach hover:text-ink"
        >
          Jump to today
        </button>
      )}

      <div className="mt-4 overflow-hidden rounded-[20px] border border-[#e9d3bf]/70 sm:mt-5 sm:rounded-[22px]">
        <div className="grid grid-cols-7 bg-peach-soft/80">
          {WEEKDAYS.map((d, i) => (
            <div
              key={d}
              className="border-r border-[#e9d3bf]/60 py-2.5 text-center text-[11px] font-semibold text-ink/70 last:border-r-0 sm:py-3 sm:text-[13px]"
            >
              <span className="hidden sm:inline">{d}</span>
              <span className="sm:hidden">{WEEKDAYS_LONG[i].slice(0, 1)}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 bg-white/55">
          {cells.map((day, idx) => {
            if (day === null) {
              return (
                <div
                  key={`blank-${idx}`}
                  className="h-[46px] border-b border-r border-[#e9d3bf]/45 sm:h-[54px]"
                />
              );
            }

            const iso = isoFor(year, month, day);
            const items = byDate.get(iso);
            const isToday = isSameDay(parseDateOnly(iso), today);
            const isSelected = selected === iso;

            return (
              <div
                key={iso}
                className="relative flex h-[46px] items-center justify-center border-b border-r border-[#e9d3bf]/45 sm:h-[54px]"
              >
                <button
                  type="button"
                  onClick={() => setSelected(isSelected ? null : iso)}
                  aria-pressed={isSelected}
                  aria-label={`${WEEKDAYS_LONG[new Date(year, month, day).getDay()]}, ${monthLong(month)} ${day}${
                    items ? ` — ${items.length} item${items.length === 1 ? "" : "s"}` : ""
                  }`}
                  className="group relative flex h-full w-full items-center justify-center outline-none"
                >
                  {isToday ? (
                    <span className="relative flex items-center justify-center">
                      <SunburstRays className="absolute h-[48px] w-[48px] text-gold sm:h-[54px] sm:w-[54px]" />
                      <span className="gold-pill flex h-[31px] w-[31px] items-center justify-center rounded-full text-[14px] font-bold text-white shadow-[0_4px_12px_-4px_rgba(230,150,60,0.9)] sm:h-[34px] sm:w-[34px] sm:text-[15px]">
                        {day}
                      </span>
                    </span>
                  ) : (
                    <span
                      className={`flex h-[31px] w-[31px] items-center justify-center rounded-full text-[14px] transition sm:h-[34px] sm:w-[34px] sm:text-[15px] ${
                        isSelected
                          ? "bg-ink font-bold text-white"
                          : items
                            ? "font-semibold text-ink group-hover:bg-peach-soft"
                            : "font-medium text-ink/75 group-hover:bg-peach-soft"
                      }`}
                    >
                      {day}
                    </span>
                  )}

                  {items && (
                    <span
                      className={`absolute bottom-[5px] h-[4.5px] w-[4.5px] rounded-full sm:bottom-[6px] ${
                        isToday || isSelected ? "bg-transparent" : "bg-gold-deep/85"
                      }`}
                    />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected day detail */}
      {selectedDate && (
        <div className="animate-in-up mt-4 rounded-[20px] bg-peach-soft/70 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-[16.5px] font-bold leading-tight tracking-tight text-ink sm:text-[18px]">
              {WEEKDAYS_LONG[selectedDate.getDay()]}, {monthLong(selectedDate.getMonth())}{" "}
              {selectedDate.getDate()}
            </h3>
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Close day details"
              className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink/45 transition hover:bg-white/70 hover:text-ink"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>

          {selectedItems.length === 0 ? (
            <p className="mt-2 text-[14px] text-ink/55">Nothing scheduled for this day.</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2.5">
              {selectedItems.map((item) => (
                <li key={`${item.kind}-${item.id}`} className="flex items-start gap-2.5">
                  <span
                    className={`mt-[7px] h-2 w-2 shrink-0 rounded-full ${
                      item.kind === "event" ? "bg-gold-deep" : "bg-[#c1272d]"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold leading-snug text-ink">
                      {item.title}
                      {item.note && (
                        <span className="font-normal text-ink/55"> ({item.note})</span>
                      )}
                    </p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[12.5px] text-ink/50">
                      <span>{item.kind === "event" ? "Event" : "Deadline"}</span>
                      {item.place && (
                        <span className="flex items-center gap-1">
                          <PinIcon className="h-[12px] w-[12px]" />
                          {item.place}
                        </span>
                      )}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {onSchedule && (
            <button
              type="button"
              onClick={() => onSchedule(selected!)}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3 text-[14px] font-semibold text-white transition hover:bg-ink/85 active:scale-[0.99] sm:w-auto"
            >
              <PlusIcon className="h-[16px] w-[16px]" strokeWidth={2.3} />
              Schedule an event on this day
            </button>
          )}
        </div>
      )}
    </section>
  );
}
