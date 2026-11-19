import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const HomeIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M3.6 10.3 12 3.6l8.4 6.7" />
    <path d="M5.4 9.9V19a1.3 1.3 0 0 0 1.3 1.3h3.1v-4.6a2.2 2.2 0 0 1 4.4 0v4.6h3.1A1.3 1.3 0 0 0 18.6 19V9.9" />
  </Base>
);

export const CalendarIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="3.2" y="5" width="17.6" height="15.8" rx="2.6" />
    <path d="M3.2 9.6h17.6M8 3.2v3.6M16 3.2v3.6" />
    <path d="M7.6 13.2h.01M12 13.2h.01M16.4 13.2h.01M7.6 17h.01M12 17h.01M16.4 17h.01" strokeWidth={2.4} />
  </Base>
);

export const ClockIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.9" />
    <path d="M12 7.1V12l3.3 2" />
  </Base>
);

export const InfoIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.9" />
    <path d="M12 11v5.2" />
    <path d="M12 7.7h.01" strokeWidth={2.5} />
  </Base>
);

export const FolderIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M3.4 7.3a2 2 0 0 1 2-2h3.3l2 2.4h6.9a2 2 0 0 1 2 2v7.9a2 2 0 0 1-2 2H5.4a2 2 0 0 1-2-2z" />
  </Base>
);

export const MegaphoneIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 10.2v3.6a1.9 1.9 0 0 0 1.9 1.9h1.5l7.8 4.1V4.2L7.4 8.3H5.9A1.9 1.9 0 0 0 4 10.2Z" />
    <path d="M18.4 8.6a4.6 4.6 0 0 1 0 6.8" />
    <path d="M7.4 15.7v3.1a1.6 1.6 0 0 0 3.2 0v-1.4" />
  </Base>
);

export const DocumentIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M13.6 3.3H7.4a2 2 0 0 0-2 2v13.4a2 2 0 0 0 2 2h9.2a2 2 0 0 0 2-2V8.3z" />
    <path d="M13.6 3.3v3.9a1.3 1.3 0 0 0 1.3 1.3h3.7" />
    <path d="M8.9 12.6h6.2M8.9 16h4.4" />
  </Base>
);

export const GraduationIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M1.9 9.1 12 4.6l10.1 4.5L12 13.6z" />
    <path d="M6.1 11v4.7c0 1.6 2.6 3 5.9 3s5.9-1.4 5.9-3V11" />
    <path d="M21.2 9.5v5" />
  </Base>
);

export const CheckCircleIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.9" />
    <path d="M8.3 12.2l2.6 2.6 4.8-5.1" />
  </Base>
);

export const StarIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m12 3.6 2.72 5.63 6.18.86-4.49 4.3 1.1 6.13L12 17.6l-5.51 2.92 1.1-6.13-4.49-4.3 6.18-.86z" />
  </Base>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4.6 12h14.1" />
    <path d="m13.4 6.7 5.3 5.3-5.3 5.3" />
  </Base>
);

export const ChevronLeftIcon = (p: IconProps) => (
  <Base {...p}><path d="m14.6 5.8-6.2 6.2 6.2 6.2" /></Base>
);

export const ChevronRightIcon = (p: IconProps) => (
  <Base {...p}><path d="m9.4 5.8 6.2 6.2-6.2 6.2" /></Base>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Base {...p}><path d="m5.8 9.4 6.2 6.2 6.2-6.2" /></Base>
);

export const PinIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 21s6.6-5.5 6.6-10.4a6.6 6.6 0 1 0-13.2 0C5.4 15.5 12 21 12 21Z" />
    <circle cx="12" cy="10.4" r="2.4" />
  </Base>
);

export const BarChartIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M5.4 20V10.8M12 20V4.6M18.6 20v-6.5" />
  </Base>
);

export const BoltIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M13.3 2.6 4.8 13.3h6.1l-1.2 8.1 8.5-10.7h-6.1z" />
  </Base>
);

export const GearIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="3.1" />
    <path d="M19.5 14.6a1.6 1.6 0 0 0 .32 1.77l.06.06a1.95 1.95 0 1 1-2.76 2.76l-.06-.06a1.6 1.6 0 0 0-1.77-.32 1.6 1.6 0 0 0-.97 1.46v.17a1.95 1.95 0 1 1-3.9 0v-.09a1.6 1.6 0 0 0-1.05-1.46 1.6 1.6 0 0 0-1.77.32l-.06.06a1.95 1.95 0 1 1-2.76-2.76l.06-.06a1.6 1.6 0 0 0 .32-1.77 1.6 1.6 0 0 0-1.46-.97h-.17a1.95 1.95 0 1 1 0-3.9h.09a1.6 1.6 0 0 0 1.46-1.05 1.6 1.6 0 0 0-.32-1.77l-.06-.06a1.95 1.95 0 1 1 2.76-2.76l.06.06a1.6 1.6 0 0 0 1.77.32h.08a1.6 1.6 0 0 0 .97-1.46v-.17a1.95 1.95 0 1 1 3.9 0v.09a1.6 1.6 0 0 0 .97 1.46 1.6 1.6 0 0 0 1.77-.32l.06-.06a1.95 1.95 0 1 1 2.76 2.76l-.06.06a1.6 1.6 0 0 0-.32 1.77v.08a1.6 1.6 0 0 0 1.46.97h.17a1.95 1.95 0 1 1 0 3.9h-.09a1.6 1.6 0 0 0-1.46.97Z" />
  </Base>
);

export const PlusIcon = (p: IconProps) => (
  <Base {...p}><path d="M12 5.4v13.2M5.4 12h13.2" /></Base>
);

export const PencilIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M16.2 3.9a2.1 2.1 0 0 1 3 3L8 18.1l-4 1 1-4z" />
  </Base>
);

export const TrashIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4.6 6.6h14.8M9.6 6.6V5.1a1.5 1.5 0 0 1 1.5-1.5h1.8a1.5 1.5 0 0 1 1.5 1.5v1.5" />
    <path d="M17.6 6.6 17 19a1.6 1.6 0 0 1-1.6 1.5H8.6A1.6 1.6 0 0 1 7 19L6.4 6.6" />
  </Base>
);

export const AlertIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.9" />
    <path d="M12 7.6v5" />
    <path d="M12 16.1h.01" strokeWidth={2.5} />
  </Base>
);

export const BellIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M18.1 10.4a6.1 6.1 0 1 0-12.2 0c0 5.1-2 6.5-2 6.5h16.2s-2-1.4-2-6.5Z" />
    <path d="M13.7 20.1a1.95 1.95 0 0 1-3.4 0" />
  </Base>
);

export const LockIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="4.6" y="10.4" width="14.8" height="10" rx="2.4" />
    <path d="M8.3 10.4V7.6a3.7 3.7 0 0 1 7.4 0v2.8" />
  </Base>
);

export const LogoutIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M9.6 20.4H6.1a2 2 0 0 1-2-2V5.6a2 2 0 0 1 2-2h3.5" />
    <path d="M15.4 16.4 19.8 12l-4.4-4.4M19.8 12H9.3" />
  </Base>
);

export const XIcon = (p: IconProps) => (
  <Base {...p}><path d="m6.4 6.4 11.2 11.2M17.6 6.4 6.4 17.6" /></Base>
);

export const SearchIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="11" cy="11" r="6.9" />
    <path d="m16.2 16.2 4 4" />
  </Base>
);

export const LinkIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M10.3 13.7a3.9 3.9 0 0 0 5.9.42l2.36-2.36a3.9 3.9 0 0 0-5.52-5.52l-1.35 1.35" />
    <path d="M13.7 10.3a3.9 3.9 0 0 0-5.9-.42L5.44 12.24a3.9 3.9 0 0 0 5.52 5.52l1.35-1.35" />
  </Base>
);

/* --- Solid accent marks ------------------------------------------------ */

export const CrownIcon = (p: IconProps) => (
  <svg viewBox="0 0 48 40" fill="none" aria-hidden="true" {...p}>
    <path
      d="M6 32.5 3 11.8l11.2 7.4L24 5.5l9.8 13.7L45 11.8l-3 20.7z"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinejoin="round"
    />
  </svg>
);

export const SparkleIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 1.8c.6 4.9 3.3 7.6 8.2 8.2-4.9.6-7.6 3.3-8.2 8.2-.6-4.9-3.3-7.6-8.2-8.2 4.9-.6 7.6-3.3 8.2-8.2Z" />
  </svg>
);

export const SchoolCrestIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="m12 2.4 2.94 6.08 6.66.9-4.84 4.62 1.2 6.6L12 17.44 6.04 20.6l1.2-6.6L2.4 9.38l6.66-.9z" />
  </svg>
);

export const GradCapMark = (p: IconProps) => (
  <svg viewBox="0 0 40 32" fill="none" aria-hidden="true" {...p}>
    <path d="M2.4 11.6 20 4.4l17.6 7.2L20 18.8z" fill="currentColor" />
    <path
      d="M9 14.8v6.4c0 2.5 4.9 4.6 11 4.6s11-2.1 11-4.6v-6.4"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
    />
    <path d="M36.4 12.6v7.8" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" />
  </svg>
);

export const ICON_MAP = {
  document: DocumentIcon,
  graduation: GraduationIcon,
  check: CheckCircleIcon,
  calendar: CalendarIcon,
  star: StarIcon,
  folder: FolderIcon,
  info: InfoIcon,
  link: LinkIcon,
} as const;

export type IconKey = keyof typeof ICON_MAP;

export const ICON_CHOICES: IconKey[] = [
  "document", "graduation", "check", "calendar", "star", "folder", "info", "link",
];

export function ResourceGlyph({ name, ...rest }: { name: string } & IconProps) {
  const Cmp = ICON_MAP[(name as IconKey)] ?? DocumentIcon;
  return <Cmp {...rest} />;
}
