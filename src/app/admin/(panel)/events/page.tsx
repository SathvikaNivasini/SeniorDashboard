"use client";

import PageHeader from "@/components/PageHeader";
import AdminCrud, { type FieldDef } from "@/components/admin/AdminCrud";
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
  const { events } = useHubData();

  return (
    <div className="animate-in-up">
      <PageHeader title="Events" subtitle="Schedule what's coming up for the senior class." />
      <AdminCrud
        table="events"
        singular="Event"
        fields={FIELDS}
        defaults={{ title: "", event_date: "", subtitle: "", location: "" }}
        rows={events}
        emptyMessage="No events scheduled yet."
        renderRow={(e) => (
          <>
            <h3 className="font-display text-[18.5px] font-bold leading-tight tracking-tight text-ink">
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
  );
}
