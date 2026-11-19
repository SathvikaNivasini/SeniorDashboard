"use client";

import PageHeader from "@/components/PageHeader";
import AdminCrud, { type FieldDef } from "@/components/admin/AdminCrud";
import { useHubData } from "@/lib/data-provider";
import { ResourceGlyph, LinkIcon } from "@/components/icons";

const FIELDS: FieldDef[] = [
  { name: "title", label: "Resource name", type: "text", required: true, placeholder: "Senior Guide" },
  { name: "sort_order", label: "Sort order", type: "number", help: "The first three show on the student home page." },
  { name: "icon", label: "Icon", type: "icon", full: true },
  { name: "description", label: "Description", type: "textarea", placeholder: "What is this resource for?" },
  { name: "url", label: "Link", type: "text", full: true, placeholder: "https://…", help: "Paste a link to a document, form, or site." },
];

export default function AdminResources() {
  const { resources } = useHubData();

  return (
    <div className="animate-in-up">
      <PageHeader title="Resources" subtitle="Share the guides, forms, and links seniors need." />
      <AdminCrud
        table="resources"
        singular="Resource"
        fields={FIELDS}
        defaults={{ title: "", sort_order: 0, icon: "document", description: "", url: "" }}
        rows={resources}
        emptyMessage="No resources uploaded yet."
        renderRow={(r) => (
          <div className="flex items-start gap-3.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-peach-soft">
              <ResourceGlyph name={r.icon} className="h-[22px] w-[22px] text-ink" strokeWidth={1.7} />
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-[18.5px] font-bold leading-tight tracking-tight text-ink">
                {r.title}
              </h3>
              {r.description && (
                <p className="mt-1.5 line-clamp-2 text-[14.5px] leading-relaxed text-ink/65">
                  {r.description}
                </p>
              )}
              {r.url && r.url !== "#" && (
                <p className="mt-1.5 flex items-center gap-1.5 truncate text-[12.5px] text-ink/45">
                  <LinkIcon className="h-[13px] w-[13px] shrink-0" />
                  <span className="truncate">{r.url}</span>
                </p>
              )}
            </div>
          </div>
        )}
      />
    </div>
  );
}
