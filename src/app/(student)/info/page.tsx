"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { EmptyState } from "@/components/ui";
import { ChevronDownIcon, InfoIcon } from "@/components/icons";
import { useHubData } from "@/lib/data-provider";
import type { InfoItem } from "@/lib/types";

const TINTS = ["bg-peach", "bg-mint", "bg-lavender", "bg-blush"];

export default function InfoPage() {
  const { info, loading } = useHubData();
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const categories = useMemo(() => {
    const set = new Set(info.map((i) => i.category));
    return ["All", ...Array.from(set)];
  }, [info]);

  const grouped = useMemo(() => {
    const visible = filter === "All" ? info : info.filter((i) => i.category === filter);
    const map = new Map<string, InfoItem[]>();
    visible.forEach((i) => map.set(i.category, [...(map.get(i.category) ?? []), i]));
    return Array.from(map.entries());
  }, [info, filter]);

  return (
    <div className="animate-in-up">
      <PageHeader
        title="Senior Info"
        subtitle="The answers to what seniors ask most."
      />

      {categories.length > 1 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={`rounded-full px-4 py-2 text-[14px] font-medium transition ${
                filter === c
                  ? "bg-ink text-white"
                  : "bg-white/70 text-ink/70 hover:bg-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {loading && <EmptyState message="Loading info…" />}
      {!loading && info.length === 0 && (
        <EmptyState message="No info posted yet." />
      )}

      <div className="flex max-w-[1020px] flex-col gap-5">
        {grouped.map(([category, items], gi) => (
          <section key={category} className="hub-card p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${TINTS[gi % TINTS.length]}`}>
                <InfoIcon className="h-5 w-5 text-ink" />
              </span>
              <h2 className="font-display text-[22px] font-bold tracking-tight text-ink">
                {category}
              </h2>
            </div>

            <div className="mt-4 flex flex-col divide-y divide-ink/[0.07]">
              {items.map((item) => {
                const open = openId === item.id;
                return (
                  <div key={item.id}>
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : item.id)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-4 py-4 text-left"
                    >
                      <span className="text-[16px] font-semibold text-ink">{item.title}</span>
                      <ChevronDownIcon
                        className={`h-[18px] w-[18px] shrink-0 text-ink/50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                      />
                    </button>
                    {open && (
                      <p className="animate-in-up whitespace-pre-wrap pb-4 pr-8 text-[15px] leading-relaxed text-ink/70">
                        {item.body}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
