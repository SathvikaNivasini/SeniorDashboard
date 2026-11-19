import type { NavItem } from "@/components/Sidebar";
import {
  HomeIcon, MegaphoneIcon, CalendarIcon, ClockIcon, InfoIcon, FolderIcon,
  BarChartIcon,
} from "@/components/icons";

export const STUDENT_NAV: NavItem[] = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Announcements", href: "/announcements", icon: MegaphoneIcon },
  { label: "Events", href: "/events", icon: CalendarIcon },
  { label: "Deadlines", href: "/deadlines", icon: ClockIcon },
  { label: "Info", href: "/info", icon: InfoIcon },
  { label: "Resources", href: "/resources", icon: FolderIcon },
];

export const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: BarChartIcon },
  { label: "Announcements", href: "/admin/announcements", icon: MegaphoneIcon },
  { label: "Events", href: "/admin/events", icon: CalendarIcon },
  { label: "Deadlines", href: "/admin/deadlines", icon: ClockIcon },
  { label: "Info", href: "/admin/info", icon: InfoIcon },
  { label: "Resources", href: "/admin/resources", icon: FolderIcon },
];

export const NAVS = { student: STUDENT_NAV, admin: ADMIN_NAV } as const;
export type NavVariant = keyof typeof NAVS;
