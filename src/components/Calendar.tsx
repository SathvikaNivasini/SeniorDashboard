"use client";

import { useMemo, useState } from "react";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { SunburstRays } from "@/components/Decorations";
import { CardHeading } from "@/components/ui";
import { monthLong, parseDateOnly, isSameDay } from "@/lib/format";
import type { Deadline, HubEvent } from "@/lib/types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar({
  events,
  deadlines,
}: {
  events: HubEvent[];
  deadlines: Deadline[];
}) {
  const today = new Date();
  const [cursor, setCursor] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const marks = useMemo(() => {
    const map = new Map<string, string[]>();
    const add = (date: string, label: string) => {
      const key = date.slice(0, 10);
      map.set(key, [...(map.get(key) ?? []), label]);
    };
    events.forEach((e) => add(e.event_date, e.title));
    deadlines.forEach((d) => add(d.due_date, d.title));
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

  const shift = (delta: number) => setCursor(new Date(year, month + delta, 1));

  const keyFor = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return (
    <section className="hub-card flex flex-col p-5 sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <CardHeading
          icon={<CalendarIcon className="h-[21px] w-[21px]" />}
          title="Senior Information Calendar"
          titleClass="text-[19px] sm:text-[21px] whitespace-nowrap"
        />
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => shift(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink/70 transition hover:bg-peach-soft hover:text-ink"
            aria-label="Previous month"
          >
            <ChevronLeftIcon className="h-[19px] w-[19px]" strokeWidth={2.2} />
          </button>
          <span className="min-w-[104px] text-center text-[17px] font-semibold tracking-tight text-ink">
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

      <div className="mt-5 overflow-hidden rounded-[22px] border border-[#e9d3bf]/70">
        {/* Weekday header */}
        <div className="grid grid-cols-7 bg-peach-soft/80">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="border-r border-[#e9d3bf]/60 py-3 text-center text-[13px] font-semibold text-ink/70 last:border-r-0"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 bg-white/55">
          {cells.map((day, idx) => {
            if (day === null) {
              return (
                <div
                  key={`blank-${idx}`}
                  className="h-[52px] border-b border-r border-[#e9d3bf]/45 last-of-type:border-r-0 sm:h-[54px]"
                />
              );
            }
            const dateKey = keyFor(day);
            const labels = marks.get(dateKey);
            const isToday = isSameDay(parseDateOnly(dateKey), today);

            return (
              <div
                key={dateKey}
                title={labels?.join(" · ")}
                className="relative flex h-[52px] items-center justify-center border-b border-r border-[#e9d3bf]/45 sm:h-[54px]"
              >
                {isToday ? (
                  <span className="relative flex items-center justify-center">
                    <SunburstRays className="absolute h-[54px] w-[54px] text-gold" />
                    <span className="gold-pill flex h-[34px] w-[34px] items-center justify-center rounded-full text-[15px] font-bold text-white shadow-[0_4px_12px_-4px_rgba(230,150,60,0.9)]">
                      {day}
                    </span>
                  </span>
                ) : (
                  <span
                    className={`flex h-[34px] w-[34px] items-center justify-center rounded-full text-[15px] transition hover:bg-peach-soft ${
                      labels ? "font-semibold text-ink" : "font-medium text-ink/75"
                    }`}
                  >
                    {day}
                  </span>
                )}
                {labels && !isToday && (
                  <span className="absolute bottom-[6px] h-[4.5px] w-[4.5px] rounded-full bg-gold-deep/85" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
