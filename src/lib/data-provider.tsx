"use client";

import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from "react";
import { getBrowserClient } from "@/lib/supabase/client";
import { startOfToday, parseDateOnly } from "@/lib/format";
import type {
  Announcement, Deadline, HubEvent, InfoItem, Resource,
} from "@/lib/types";

type HubData = {
  announcements: Announcement[];
  events: HubEvent[];
  deadlines: Deadline[];
  info: InfoItem[];
  resources: Resource[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  /** Events dated today or later, soonest first. */
  upcomingEvents: HubEvent[];
  /** Deadlines due today or later, soonest first. */
  upcomingDeadlines: Deadline[];
};

const Ctx = createContext<HubData | null>(null);

export function HubDataProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => getBrowserClient(), []);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<HubEvent[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [info, setInfo] = useState<InfoItem[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const [a, e, d, i, r] = await Promise.all([
      supabase.from("announcements").select("*")
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false }),
      supabase.from("events").select("*").order("event_date", { ascending: true }),
      supabase.from("deadlines").select("*").order("due_date", { ascending: true }),
      supabase.from("info_items").select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase.from("resources").select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
    ]);

    const firstError = a.error ?? e.error ?? d.error ?? i.error ?? r.error;
    if (firstError) {
      setError(firstError.message);
    } else {
      setError(null);
      setAnnouncements((a.data ?? []) as Announcement[]);
      setEvents((e.data ?? []) as HubEvent[]);
      setDeadlines((d.data ?? []) as Deadline[]);
      setInfo((i.data ?? []) as InfoItem[]);
      setResources((r.data ?? []) as Resource[]);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void refresh();

    const channel = supabase
      .channel("senior-hub-live")
      .on("postgres_changes", { event: "*", schema: "public" }, () => {
        void refresh();
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase, refresh]);


  const value = useMemo<HubData>(() => {
    const today = startOfToday();
    return {
      announcements, events, deadlines, info, resources, loading, error, refresh,
      upcomingEvents: events
        .filter((e) => parseDateOnly(e.event_date) >= today)
        .sort((a, b) => a.event_date.localeCompare(b.event_date)),
      upcomingDeadlines: deadlines
        .filter((d) => parseDateOnly(d.due_date) >= today)
        .sort((a, b) => a.due_date.localeCompare(b.due_date)),
    };
  }, [announcements, events, deadlines, info, resources, loading, error, refresh]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useHubData() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useHubData must be used inside <HubDataProvider>");
  return ctx;
}

