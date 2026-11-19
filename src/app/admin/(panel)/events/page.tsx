"use client";

import { useRef } from "react";
import PageHeader from "@/components/PageHeader";
import Calendar from "@/components/Calendar";
import AdminCrud, { type FieldDef, type AdminCrudHandle } from "@/components/admin/AdminCrud";
import { useHubData } from "@/lib/data-provider";
import { longDate } from "@/lib/format";
import { PinIcon, CalendarIcon } from "@/components/icons";

const FIELDS: FieldDef[] = [
  { name: "title", label: "Event name", type: "text", required: true, placeholder: "Senior Dress-Up Day" },
  { name: "event_date", label: "Date", type: "date", required: true },
  { name: "subtitle", label: "Note", type: "text", placeholder: "Decades!", help: "Shown in parentheses after the name." },
  { name: "location", label: "Location", type: "text", placeholder: "Commons" },
];

export default function AdminEvents() {
  const { events, deadlines } = useHubData();
  const crud = useRef<AdminCrudHandle>(null);

  return (
    <div className="animate-in-up">
      <PageHeader
        title="Events"
        subtitle="Pick a date on the calendar to schedule something."
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Calendar
          events={events}
          deadlines={deadlines}
          title="Event Calendar"
          onSchedule={(iso) => crud.current?.openNew({ event_date: iso })}
        />

        <div className="min-w-0">
          <AdminCrud
            ref={crud}
            table="events"
            singular="Event"
            fields={FIELDS}
            defaults={{ title: "", event_date: "", subtitle: "", location: "" }}
            rows={events}
            emptyMessage="No events scheduled yet. Tap a date on the calendar to add one."
            renderRow={(e) => (
              <>
                <h3 className="font-display text-[17.5px] font-bold leading-tight tracking-tight text-ink sm:text-[18.5px]">
                  {e.title}
                  {e.subtitle && <span className="font-normal text-ink/55"> ({e.subtitle})</span>}
                </h3>
                <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink/55">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="h-[13px] w-[13px]" />
                    {longDate(e.event_date)}
                  </span>
                  {e.location && (
                    <span className="flex items-center gap-1">
                      <PinIcon className="h-[13px] w-[13px]" />
                      {e.location}
                    </span>
                  )}
                </p>
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
}
