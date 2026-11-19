"use client";

import PageHeader from "@/components/PageHeader";
import { EmptyState } from "@/components/ui";
import { ArrowRightIcon, ResourceGlyph } from "@/components/icons";
import { useHubData } from "@/lib/data-provider";

const TINTS = ["bg-peach-soft", "bg-mint", "bg-lavender", "bg-blush"];

export default function ResourcesPage() {
  const { resources, loading } = useHubData();

  return (
    <div className="animate-in-up">
      <PageHeader
        title="Resources"
        subtitle="Guides, forms, and links you'll actually need."
      />

      {loading && <EmptyState message="Loading resources…" />}
      {!loading && resources.length === 0 && (
        <EmptyState message="No resources uploaded yet." />
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {resources.map((r, i) => {
          const href = r.url && r.url !== "#" ? r.url : null;
          return (
            <article key={r.id} className="hub-card flex flex-col p-5">
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${TINTS[i % TINTS.length]}`}>
                <ResourceGlyph name={r.icon} className="h-6 w-6 text-ink" strokeWidth={1.7} />
              </span>
              <h2 className="font-display mt-4 text-[19px] font-bold leading-tight tracking-tight text-ink">
                {r.title}
              </h2>
              {r.description && (
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink/65">{r.description}</p>
              )}
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[14px] font-medium text-white transition hover:bg-ink/85"
                >
                  Open
                  <ArrowRightIcon className="h-[15px] w-[15px] transition-transform group-hover:translate-x-0.5" />
                </a>
              ) : (
                <span className="mt-5 inline-flex w-fit items-center rounded-full bg-peach-soft px-4 py-2.5 text-[14px] font-medium text-ink/55">
                  Link coming soon
                </span>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
