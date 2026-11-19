"use client";

import PageHeader from "@/components/PageHeader";
import AdminCrud, { type FieldDef } from "@/components/admin/AdminCrud";
import { useHubData } from "@/lib/data-provider";

const FIELDS: FieldDef[] = [
  { name: "title", label: "Question or topic", type: "text", required: true, full: true, placeholder: "When is graduation?" },
  { name: "category", label: "Category", type: "text", placeholder: "Graduation", help: "Items are grouped by category." },
  { name: "sort_order", label: "Sort order", type: "number", help: "Lower numbers appear first." },
  { name: "body", label: "Answer", type: "textarea", placeholder: "Write the answer seniors need." },
];

export default function AdminInfo() {
  const { info } = useHubData();

  return (
    <div className="animate-in-up">
      <PageHeader title="Senior Info" subtitle="Answer the questions seniors ask over and over." />
      <AdminCrud
        table="info_items"
        singular="Info Item"
        fields={FIELDS}
        defaults={{ title: "", category: "General", sort_order: 0, body: "" }}
        rows={info}
        emptyMessage="No info items yet."
        renderRow={(i) => (
          <>
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="font-display text-[18.5px] font-bold leading-tight tracking-tight text-ink">
                {i.title}
              </h3>
              <span className="rounded-full bg-lavender px-2.5 py-1 text-[11.5px] font-semibold text-ink">
                {i.category}
              </span>
            </div>
            {i.body && (
              <p className="mt-2 line-clamp-2 text-[14.5px] leading-relaxed text-ink/65">{i.body}</p>
            )}
          </>
        )}
      />
    </div>
  );
}
