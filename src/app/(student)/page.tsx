"use client";

import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Calendar from "@/components/Calendar";
import { QuoteFlourish, Swash } from "@/components/Decorations";
import { CardHeading, ViewAll, ArrowChip, DateChip, EmptyState } from "@/components/ui";
import {
  MegaphoneIcon, InfoIcon, AlertIcon, BarChartIcon, PinIcon,
  CalendarIcon, DocumentIcon, GraduationIcon, StarIcon, SparkleIcon,
  ArrowRightIcon, ResourceGlyph,
} from "@/components/icons";
import { useHubData } from "@/lib/data-provider";
import { monthShort, dayOfMonth, isFresh } from "@/lib/format";

const QUICK_LINKS = [
  { label: "Key Dates", href: "/deadlines", icon: CalendarIcon, tint: "bg-peach" },
  { label: "Senior FAQs", href: "/info", icon: DocumentIcon, tint: "bg-mint" },
  { label: "College & Career", href: "/resources", icon: GraduationIcon, tint: "bg-lavender" },
  { label: "Senior Events", href: "/events", icon: StarIcon, tint: "bg-blush" },
];

export default function StudentHome() {
  const { announcements, events, deadlines, resources, upcomingEvents, upcomingDeadlines, loading } =
    useHubData();

  const hasNew = announcements.some((a) => isFresh(a.created_at));
  const featuredResources = resources.slice(0, 3);

  return (
    <div className="animate-in-up">
      <PageHeader
        title="Welcome, Seniors!"
        subtitle="Your one-stop hub for all senior information. Stay informed, stay on track!"
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_396px]">
        {/* ---------------- Main column ---------------- */}
        <div className="flex min-w-0 flex-col gap-5">
          {/* Announcements banner */}
          <Link
            href="/announcements"
            className="group flex items-center gap-5 rounded-[28px] bg-gradient-to-r from-[#fdeeda] via-[#fbe0c2] to-[#f9d4ab] px-5 py-5 transition-shadow hover:shadow-[0_14px_34px_-22px_rgba(150,90,30,0.7)] sm:px-7"
          >
            <span className="hidden h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full bg-[#f8c893]/70 sm:flex">
              <MegaphoneIcon className="h-9 w-9 text-ink" strokeWidth={1.7} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-3">
                <span className="font-display text-[22px] font-bold tracking-tight text-ink sm:text-[24px]">
                  Senior Announcements
                </span>
                {hasNew && (
                  <span className="gold-pill rounded-full px-3 py-[5px] text-[12px] font-semibold text-white">
                    New
                  </span>
                )}
              </span>
              <span className="mt-1.5 block text-[14px] text-ink/65 sm:text-[15px]">
                Check the latest updates on senior events, deadlines, and more!
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-2 text-[15px] font-semibold text-gold-deep transition group-hover:text-ink">
              <span className="hidden sm:inline">View All</span>
              <ArrowRightIcon className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>

          {/* Calendar + deadlines */}
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.52fr)_minmax(0,1fr)]">
            <Calendar events={events} deadlines={deadlines} />

            <section className="hub-card flex flex-col p-5 sm:p-6">
              <h2 className="font-display text-center text-[23px] font-bold tracking-tight text-ink">
                Important Deadlines
              </h2>
              <div className="mt-5 flex flex-col gap-3.5">
                {loading && <EmptyState message="Loading deadlines…" />}
                {!loading && upcomingDeadlines.length === 0 && (
                  <EmptyState message="No upcoming deadlines. Enjoy the breather!" />
                )}
                {upcomingDeadlines.slice(0, 3).map((d) => (
                  <div key={d.id} className="flex items-center gap-3.5">
                    <DateChip month={monthShort(d.due_date)} day={dayOfMonth(d.due_date)} />
                    <div className="min-w-0">
                      <p className="text-[16px] font-semibold leading-snug text-ink">{d.title}</p>
                      {d.detail && (
                        <p className="mt-1 flex items-center gap-1 text-[13px] text-ink/55">
                          <PinIcon className="h-[13px] w-[13px] shrink-0" />
                          {d.detail}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {upcomingDeadlines.length > 3 && (
                <div className="mt-5 flex justify-center">
                  <ViewAll href="/deadlines" label="See all deadlines" />
                </div>
              )}
            </section>
          </div>

          {/* Quick links */}
          <section className="hub-card p-5 sm:p-6">
            <CardHeading
              icon={<BarChartIcon className="h-[21px] w-[21px]" strokeWidth={2.2} />}
              title="Senior Quick Links"
            />
            <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {QUICK_LINKS.map(({ label, href, icon: Icon, tint }) => (
                <Link
                  key={label}
                  href={href}
                  className={`group relative flex h-[140px] flex-col items-center justify-center gap-2.5 rounded-[22px] px-3 pb-11 transition-transform duration-200 hover:-translate-y-0.5 ${tint}`}
                >
                  <Icon className="h-7 w-7 text-ink" strokeWidth={1.8} />
                  <span className="text-center text-[14.5px] font-semibold leading-tight text-ink sm:text-[15px]">
                    {label}
                  </span>
                  <ArrowChip className="absolute bottom-3 right-3" />
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* ---------------- Right rail ---------------- */}
        <div className="flex min-w-0 flex-col gap-5">
          {/* Senior resources */}
          <section className="hub-card p-5 sm:p-6">
            <CardHeading
              icon={<InfoIcon className="h-[22px] w-[22px]" />}
              title="Senior Resources"
              chipClass="bg-peach-soft text-ink rounded-full"
            />
            <p className="mt-1.5 text-[15px] text-ink/60">
              Quick links to essential information!
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {featuredResources.length === 0 && (
                <div className="col-span-3">
                  <EmptyState message="No resources posted yet." />
                </div>
              )}
              {featuredResources.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-col gap-3 rounded-[20px] bg-peach-soft p-3.5"
                >
                  <ResourceGlyph name={r.icon} className="h-7 w-7 text-ink" strokeWidth={1.7} />
                  <p className="font-display text-[16px] font-bold leading-[1.2] tracking-tight text-ink">
                    {r.title}
                  </p>
                  <Link
                    href={r.url && r.url !== "#" ? r.url : "/resources"}
                    target={r.url && r.url !== "#" ? "_blank" : undefined}
                    rel={r.url && r.url !== "#" ? "noopener noreferrer" : undefined}
                    className="group mt-auto inline-flex w-fit items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-[13px] font-medium text-white transition hover:bg-ink/85"
                  >
                    View
                    <ArrowRightIcon className="h-[13px] w-[13px] transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming events */}
          <section className="hub-card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <CardHeading
                icon={<AlertIcon className="h-[22px] w-[22px]" />}
                title="Upcoming Events"
                chipClass="bg-[#fde0dd] text-[#c1272d] rounded-full"
                titleClass="text-[19px] sm:text-[23px] whitespace-nowrap"
              />
              <ViewAll href="/events" />
            </div>
            <div className="mt-4 flex flex-col">
              {loading && <EmptyState message="Loading events…" />}
              {!loading && upcomingEvents.length === 0 && (
                <EmptyState message="Nothing on the calendar yet." />
              )}
              {upcomingEvents.slice(0, 3).map((e, i) => (
                <Link
                  key={e.id}
                  href="/events"
                  className={`flex items-center gap-3.5 rounded-2xl px-2 py-2.5 transition hover:bg-peach-soft/70 ${
                    i === 0 ? "bg-peach-soft/55" : ""
                  }`}
                >
                  <DateChip month={monthShort(e.event_date)} day={dayOfMonth(e.event_date)} size="sm" />
                  <span className="min-w-0 text-[15px] font-medium leading-snug text-ink">
                    {e.title}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Motivation */}
          <section className="relative flex min-h-[172px] items-center justify-center overflow-hidden rounded-[28px] bg-sidebar px-6 py-8">
            <QuoteFlourish className="pointer-events-none absolute -bottom-2 left-0 w-full" />
            <QuoteFlourish className="pointer-events-none absolute -top-10 right-0 w-2/3 rotate-180" />
            <SparkleIcon className="absolute left-7 top-8 h-3.5 w-3.5 text-gold-light/70" />
            <SparkleIcon className="absolute right-8 top-6 h-3 w-3 text-gold-light/50" />
            <SparkleIcon className="absolute bottom-7 right-10 h-4 w-4 text-gold-light/60" />
            <div className="relative text-center">
              <p className="font-script whitespace-nowrap text-[30px] leading-[1.1] text-gold-light -rotate-2 sm:text-[34px]">
                You&rsquo;ve got this, Seniors!
              </p>
              <Swash className="mx-auto mt-1 h-5 w-[210px] text-gold-light/80 -rotate-2" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
