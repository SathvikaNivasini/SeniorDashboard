"use client";

import PageHeader from "@/components/PageHeader";
import { EmptyState } from "@/components/ui";
import { MegaphoneIcon, PinIcon } from "@/components/icons";
import NotifyButton from "@/components/NotifyButton";
import { useHubData } from "@/lib/data-provider";
import { relativeTime, isFresh } from "@/lib/format";

export default function AnnouncementsPage() {
  const { announcements, loading } = useHubData();

  return (
    <div className="animate-in-up">
      <PageHeader
        title="Announcements"
        subtitle="Every senior update in one place — newest first."
      />

      <div className="mb-5 flex max-w-[1120px] justify-start lg:justify-end">
        <NotifyButton />
      </div>

      <div className="flex max-w-[1120px] flex-col gap-4">
        {loading && <EmptyState message="Loading announcements…" />}
        {!loading && announcements.length === 0 && (
          <EmptyState message="No announcements yet. Check back soon!" />
        )}

        {announcements.map((a) => (
          <article key={a.id} className="hub-card p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-peach-soft sm:flex">
                <MegaphoneIcon className="h-6 w-6 text-ink" strokeWidth={1.7} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="font-display text-[21px] font-bold leading-tight tracking-tight text-ink">
                    {a.title}
                  </h2>
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
                <p className="mt-1 text-[13px] text-ink/45">{relativeTime(a.created_at)}</p>
                {a.body && (
                  <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-ink/75">
                    {a.body}
                  </p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
