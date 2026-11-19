"use client";

import PageHeader from "@/components/PageHeader";
import AdminCrud, { type FieldDef } from "@/components/admin/AdminCrud";
import { useHubData } from "@/lib/data-provider";
import { longDate } from "@/lib/format";
import { ClockIcon, PinIcon } from "@/components/icons";

const FIELDS: FieldDef[] = [
  { name: "title", label: "Deadline", type: "text", required: true, placeholder: "Final Senior Survey" },
  { name: "due_date", label: "Due date", type: "date", required: true },
  { name: "detail", label: "Detail", type: "text", full: true, placeholder: "All Day", help: "Shown under the title with a pin icon." },
];

export default function AdminDeadlines() {
  const { deadlines } = useHubData();

  return (
    <div className="animate-in-up">
      <PageHeader title="Deadlines" subtitle="Keep the key dates in front of every senior." />
      <AdminCrud
        table="deadlines"
        singular="Deadline"
        fields={FIELDS}
        defaults={{ title: "", due_date: "", detail: "" }}
        rows={deadlines}
        emptyMessage="No deadlines posted yet."
        renderRow={(d) => (
          <>
            <h3 className="font-display text-[18.5px] font-bold leading-tight tracking-tight text-ink">
              {d.title}
            </h3>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink/55">
              <span className="flex items-center gap-1">
                <ClockIcon className="h-[13px] w-[13px]" />
                {longDate(d.due_date)}
              </span>
              {d.detail && (
                <span className="flex items-center gap-1">
                  <PinIcon className="h-[13px] w-[13px]" />
                  {d.detail}
                </span>
              )}
            </p>
          </>
        )}
      />
    </div>
  );
}
