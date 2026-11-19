"use client";

import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { CardHeading, ViewAll, ArrowChip, DateChip, EmptyState } from "@/components/ui";
import {
  MegaphoneIcon, CalendarIcon, DocumentIcon, BoltIcon, GearIcon, FolderIcon,
} from "@/components/icons";
import { useHubData } from "@/lib/data-provider";
import { monthShort, dayOfMonth } from "@/lib/format";

const QUICK_ACTIONS = [
  { label: "Post Announcement", href: "/admin/announcements", icon: MegaphoneIcon, tint: "bg-peach" },
  { label: "Add Event", href: "/admin/events", icon: CalendarIcon, tint: "bg-lavender" },
  { label: "Upload Resource", href: "/admin/resources", icon: DocumentIcon, tint: "bg-mint" },
  { label: "Manage Content", href: "/admin/info", icon: GearIcon, tint: "bg-peach" },
];

export default function AdminDashboard() {
  const { announcements, resources, upcomingEvents, loading } = useHubData();

  const stats = [
    {
      value: announcements.length,
      label: "Total Announcements",
      href: "/admin/announcements",
      icon: MegaphoneIcon,
      tint: "bg-peach",
    },
    {
      value: upcomingEvents.length,
      label: "Upcoming Events",
      href: "/admin/events",
      icon: CalendarIcon,
      tint: "bg-lavender",
    },
    {
      value: resources.length,
      label: "Resources Uploaded",
      href: "/admin/resources",
      icon: FolderIcon,
      tint: "bg-mint",
    },
  ];

  return (
    <div className="animate-in-up">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Manage senior information, keep students informed!"
      />

      {/* Stat tiles */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map(({ value, label, href, icon: Icon, tint }) => (
          <Link
            key={label}
            href={href}
            className={`group flex items-center gap-5 rounded-[26px] px-6 py-5 transition-transform duration-200 hover:-translate-y-0.5 ${tint}`}
          >
            <Icon className="h-11 w-11 shrink-0 text-ink" strokeWidth={1.6} />
            <span className="min-w-0 flex-1">
              <span className="font-display block text-[40px] font-bold leading-none tracking-tight text-ink">
                {loading ? "—" : value}
              </span>
              <span className="mt-1.5 block text-[14.5px] font-medium text-ink/70">{label}</span>
            </span>
            <ArrowChip />
          </Link>
        ))}
      </div>

      {/* Events + actions */}
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <section className="hub-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <CardHeading
              icon={<CalendarIcon className="h-[22px] w-[22px]" />}
              title="Upcoming Events"
            />
            <ViewAll href="/admin/events" />
          </div>

          <div className="mt-4 flex flex-col divide-y divide-ink/[0.07]">
            {loading && <EmptyState message="Loading events…" />}
            {!loading && upcomingEvents.length === 0 && (
              <EmptyState message="No upcoming events. Add one to get started." />
            )}
            {upcomingEvents.slice(0, 4).map((e) => (
              <Link
                key={e.id}
                href="/admin/events"
                className="flex items-center gap-4 rounded-2xl px-2 py-3.5 transition hover:bg-peach-soft/60"
              >
                <DateChip month={monthShort(e.event_date)} day={dayOfMonth(e.event_date)} />
                <span className="min-w-0">
                  <span className="block text-[16.5px] font-semibold leading-snug text-ink">
                    {e.title}
                  </span>
                  {e.subtitle && (
                    <span className="mt-0.5 block text-[15px] text-ink/55">({e.subtitle})</span>
                  )}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="hub-card p-5 sm:p-6">
          <CardHeading
            icon={<BoltIcon className="h-[21px] w-[21px]" />}
            title="Quick Actions"
          />
          <div className="mt-5 grid grid-cols-2 gap-4">
            {QUICK_ACTIONS.map(({ label, href, icon: Icon, tint }) => (
              <Link
                key={label}
                href={href}
                className={`group relative flex h-[140px] flex-col items-center justify-center gap-2.5 rounded-[22px] px-3 pb-11 transition-transform duration-200 hover:-translate-y-0.5 ${tint}`}
              >
                <Icon className="h-7 w-7 text-ink" strokeWidth={1.8} />
                <span className="text-center text-[14px] font-semibold leading-tight text-ink sm:text-[14.5px]">
                  {label}
                </span>
                <ArrowChip className="absolute bottom-3 right-3" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
