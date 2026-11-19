"use client";

import PageHeader from "@/components/PageHeader";
import AdminCrud, { type FieldDef } from "@/components/admin/AdminCrud";
import { useHubData } from "@/lib/data-provider";
import { relativeTime, isFresh } from "@/lib/format";
import { PinIcon } from "@/components/icons";

const FIELDS: FieldDef[] = [
  { name: "title", label: "Title", type: "text", required: true, full: true, placeholder: "Senior Dress-Up Day Guidelines" },
  { name: "body", label: "Details", type: "textarea", placeholder: "What do seniors need to know?" },
  { name: "is_pinned", label: "Pin to the top of the list", type: "checkbox", full: true },
];

export default function AdminAnnouncements() {
  const { announcements } = useHubData();

  return (
    <div className="animate-in-up">
      <PageHeader
        title="Announcements"
        subtitle="Post an update and every senior sees it instantly."
      />
      <AdminCrud
        table="announcements"
        singular="Announcement"
        fields={FIELDS}
        defaults={{ title: "", body: "", is_pinned: false }}
        rows={announcements}
        emptyMessage="No announcements yet. Post the first one."
        renderRow={(a) => (
          <>
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="font-display text-[18.5px] font-bold leading-tight tracking-tight text-ink">
                {a.title}
              </h3>
              {a.is_pinned && (
                <span className="inline-flex items-center gap-1 rounded-full bg-peach px-2.5 py-1 text-[11.5px] font-semibold text-ink">
                  <PinIcon className="h-3 w-3" />
                  Pinned
                </span>
              )}
              {isFresh(a.created_at) && (
                <span className="gold-pill rounded-full px-2.5 py-1 text-[11.5px] font-semibold text-white">
                  New
                </span>
              )}
            </div>
            <p className="mt-1 text-[12.5px] text-ink/45">{relativeTime(a.created_at)}</p>
            {a.body && (
              <p className="mt-2 line-clamp-2 text-[14.5px] leading-relaxed text-ink/65">{a.body}</p>
            )}
          </>
        )}
      />
    </div>
  );
}
